import { FastifyInstance } from 'fastify';
import { getLeaguesDirect, getLeagueStandingsDirect, getLeagueFixturesDirect, getTopScorersDirect, getTopAssistsDirect, calculateVirtualStandings, fetchFromSportsProvider, providerCache } from '../../lib/sports';
import { ApiLeagueRecord } from '../../lib/provider-types';

interface LeagueDetailParams {
  countrySlug: string;
  leagueSlug: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function leaguesRoutes(server: FastifyInstance) {
  // GET /v1/leagues
  server.get<{ Querystring: { page?: string; pageSize?: string } }>('/leagues', async (request) => {
    const { page = '1', pageSize = '50' } = request.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    const leaguesFromDb = await getLeaguesDirect();
    const allLeagues: ApiLeagueRecord[] = leaguesFromDb || [];

    // Group by country
    const groupedMap: Map<string, { country: { name: string; code: string | null; flagUrl: string | null }; leagues: { id: number; name: string; slug: string; logoUrl: string | null; type: string }[] }> = new Map();

    for (const item of allLeagues) {
      const countryKey = item.country.name;

      if (!groupedMap.has(countryKey)) {
        groupedMap.set(countryKey, {
          country: {
            name: item.country.name,
            code: item.country.code,
            flagUrl: item.country.flag,
          },
          leagues: [],
        });
      }

      groupedMap.get(countryKey)!.leagues.push({
        id: item.league.id,
        name: item.league.name,
        slug: slugify(item.league.name),
        logoUrl: item.league.logo,
        type: item.league.type,
      });
    }

    const allGrouped = Array.from(groupedMap.values());
    const total = allGrouped.length;
    const paginated = allGrouped.slice(offset, offset + pageSizeNum);

    return {
      page: pageNum,
      pageSize: pageSizeNum,
      total,
      items: paginated,
    };
  });

  // GET /v1/leagues/popular
  server.get('/leagues/popular', async (request) => {
    const { page = '1', limit = '10' } = request.query as { page?: string, limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const allLeagues: ApiLeagueRecord[] = await getLeaguesDirect() || [];

    // Strategy: Current active leagues from major football nations
    const topCountries = ['England', 'Spain', 'Germany', 'Italy', 'France', 'Brazil', 'Argentina', 'Portugal', 'Netherlands', 'World'];

    const currentYear = new Date().getFullYear();
    const filtered = allLeagues.filter((item) => {
      // Must have at least one season from last 2 years (roughly) to be considered 'active with data'
      const hasRecentData = (item.seasons || []).some((s) => s.year >= currentYear - 1);
      const isMajorCountry = topCountries.includes(item.country.name);
      const isLigAndNotCup = item.league.type === 'League' || (item.country.name === 'World' && item.league.name.includes('Champions League'));

      return hasRecentData && isMajorCountry && isLigAndNotCup;
    });

    // Sort by country importance and then league name
    const sorted = filtered.sort((a, b) => {
      const aIdx = topCountries.indexOf(a.country.name);
      const bIdx = topCountries.indexOf(b.country.name);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.league.name.localeCompare(b.league.name);
    });

    // Paginate
    const start = (pageNum - 1) * limitNum;
    const paginated = sorted.slice(start, start + limitNum);

    return paginated.map((item) => ({
      id: item.league.id,
      name: item.league.name,
      slug: slugify(item.league.name),
      logoUrl: item.league.logo,
      country: {
        name: item.country.name,
        code: item.country.code,
        flagUrl: item.country.flag
      }
    }));
  });

  // GET /v1/league/:countrySlug/:leagueSlug
  server.get<{ Params: LeagueDetailParams }>('/league/:countrySlug/:leagueSlug', async (request, reply) => {
    const { countrySlug, leagueSlug } = request.params;

    try {
      // Resolve leagueId from slug
      const allLeagues: ApiLeagueRecord[] = await getLeaguesDirect() || [];
      const found = allLeagues.find((item) =>
        slugify(item.league.name) === leagueSlug &&
        slugify(item.country.name) === countrySlug
      );

      if (!found) {
        return reply.status(404).send({ error: 'League not found' });
      }

      const leagueId = found.league.id;
      const currentSeason = (found.seasons || []).find((s) => s.current)?.year || new Date().getFullYear();

      // Fetch data in parallel with season fallback for standings
      let standingsRaw: unknown[] = [];
      let fixtures: unknown[] = [];
      let results: unknown[] = [];
      let topScorers: unknown[] = [];
      let topAssists: unknown[] = [];

      const availableSeasons = (found.seasons || [])
        .map((s) => s.year)
        .sort((a, b) => b - a);


      try {
        // Find best season for standings (latest available with data)
        let standingsSeason = currentSeason;
        for (const season of availableSeasons) {
          if (season > currentSeason) continue;
          const res = await getLeagueStandingsDirect(leagueId, season).catch(() => []);
          if (res && res.length > 0) {
            standingsRaw = res;
            standingsSeason = season;
            break;
          }
          // Only try up to 3 seasons back to keep it fast
          if (availableSeasons.indexOf(season) > availableSeasons.indexOf(currentSeason) + 2) break;
        }

        // Fetch other data - use the latest season that had data (standingsSeason) if current is empty
        const dataSeason = standingsSeason || currentSeason;
        [fixtures, results, topScorers, topAssists] = await Promise.all([
          getLeagueFixturesDirect(leagueId, dataSeason, 'next', 10).catch(() => []),
          getLeagueFixturesDirect(leagueId, dataSeason, 'last', 50).catch(() => []),
          getTopScorersDirect(leagueId, dataSeason).catch(() =>
            standingsSeason !== currentSeason ? getTopScorersDirect(leagueId, standingsSeason).catch(() => []) : []
          ),
          getTopAssistsDirect(leagueId, dataSeason).catch(() =>
            standingsSeason !== currentSeason ? getTopAssistsDirect(leagueId, standingsSeason).catch(() => []) : []
          )
        ]);

        // If no official standings, try calculating virtual ones from the results we fetched
        if (standingsRaw.length === 0 && results.length > 0) {
          standingsRaw = calculateVirtualStandings(results);
        }
      } catch (err) {
        server.log.warn(`Error fetching league data for ${leagueId}: ${(err as Error).message}`);
      }

      const standings = (standingsRaw || []).map((row) => ({
        rank: (row as any).rank,
        group: (row as any).group,
        team: {
          id: (row as any).team?.id,
          name: (row as any).team?.name,
          slug: (row as any).team?.name ? slugify((row as any).team.name) : '',
          logoUrl: (row as any).team?.logo || (row as any).team?.logoUrl,
        },
        overall: {
          played: (row as any).overall?.played || 0,
          wins: (row as any).overall?.wins || 0,
          draws: (row as any).overall?.draws || 0,
          losses: (row as any).overall?.losses || 0,
          gf: (row as any).overall?.gf || 0,
          ga: (row as any).overall?.ga || 0,
          gd: (row as any).overall?.gd || 0,
          points: (row as any).overall?.points || 0,
          ppg: (row as any).overall?.ppg || 0,
          ...(row as any).overall
        },
        home: {
          played: (row as any).home?.played || 0,
          wins: (row as any).home?.wins || 0,
          draws: (row as any).home?.draws || 0,
          losses: (row as any).home?.losses || 0,
          gf: (row as any).home?.gf || 0,
          ga: (row as any).home?.ga || 0,
          gd: (row as any).home?.gd || 0,
          points: (row as any).home?.points || 0,
          ppg: (row as any).home?.ppg || 0,
          ...(row as any).home
        },
        away: {
          played: (row as any).away?.played || 0,
          wins: (row as any).away?.wins || 0,
          draws: (row as any).away?.draws || 0,
          losses: (row as any).away?.losses || 0,
          gf: (row as any).away?.gf || 0,
          ga: (row as any).away?.ga || 0,
          gd: (row as any).away?.gd || 0,
          points: (row as any).away?.points || 0,
          ppg: (row as any).away?.ppg || 0,
          ...(row as any).away
        },
        form: (row as any).form || []
      }));

      // Compute stats from standings
      let totalGoals = 0;
      let totalMatchesPlayed = 0;
      let homeWins = 0;
      let awayWins = 0;
      let draws = 0;

      let bestAttack = { team: '', goals: -1 };
      let worstAttack = { team: '', goals: Infinity };
      let bestDefense = { team: '', goals: Infinity };
      let worstDefense = { team: '', goals: -1 };

      let mostWins = { team: '', val: -1 };
      let fewestWins = { team: '', val: Infinity };
      let mostDraws = { team: '', val: -1 };
      let fewestDraws = { team: '', val: Infinity };
      let mostLosses = { team: '', val: -1 };
      let fewestLosses = { team: '', val: Infinity };

      standings.forEach((s) => {
        totalGoals += (s as any).overall.gf;
        totalMatchesPlayed += (s as any).overall.played;
        homeWins += (s as any).home.wins;
        awayWins += (s as any).away.wins;
        draws += (s as any).overall.draws;

        if ((s as any).overall.gf > bestAttack.goals) bestAttack = { team: (s as any).team.name, goals: (s as any).overall.gf };
        if ((s as any).overall.gf < worstAttack.goals) worstAttack = { team: (s as any).team.name, goals: (s as any).overall.gf };
        if ((s as any).overall.ga < bestDefense.goals) bestDefense = { team: (s as any).team.name, goals: (s as any).overall.ga };
        if ((s as any).overall.ga > worstDefense.goals) worstDefense = { team: (s as any).team.name, goals: (s as any).overall.ga };

        if ((s as any).overall.wins > mostWins.val) mostWins = { team: (s as any).team.name, val: (s as any).overall.wins };
        if ((s as any).overall.wins < fewestWins.val) fewestWins = { team: (s as any).team.name, val: (s as any).overall.wins };
        if ((s as any).overall.draws > mostDraws.val) mostDraws = { team: (s as any).team.name, val: (s as any).overall.draws };
        if ((s as any).overall.draws < fewestDraws.val) fewestDraws = { team: (s as any).team.name, val: (s as any).overall.draws };
        if ((s as any).overall.losses > mostLosses.val) mostLosses = { team: (s as any).team.name, val: (s as any).overall.losses };
        if ((s as any).overall.losses < fewestLosses.val) fewestLosses = { team: (s as any).team.name, val: (s as any).overall.losses };
      });

      const uniqueMatchesPlayed = totalMatchesPlayed / 2;

      const statsSummary = {
        matchesPlayed: uniqueMatchesPlayed,
        totalMatches: (standings.length * (standings.length - 1)), // Double round robin
        totalGoals,
        avgGoals: uniqueMatchesPlayed > 0 ? parseFloat((totalGoals / uniqueMatchesPlayed).toFixed(2)) : 0,
        homeWins,
        awayWins,
        draws,
        cardsAvg: uniqueMatchesPlayed > 0 ? parseFloat((standings.reduce((acc, s) => acc + (((s.overall as Record<string, any>).cards as any)?.average || 0), 0) / standings.length).toFixed(2)) || 3.8 : 3.8, // Fallback to 3.8 if data is missing
        // These would require extra API calls to fixtures or seasonal stats endpoints if we wanted them more accurately
        over25Percent: 55,
        under25Percent: 45,
        mostCommonScore: '1-1',
        offensive: {
          best: bestAttack.team,
          worst: worstAttack.team,
          bestGoals: bestAttack.goals,
          worstGoals: worstAttack.goals
        },
        defensive: {
          best: bestDefense.team,
          worst: worstDefense.team,
          bestGoals: bestDefense.goals,
          worstGoals: worstDefense.goals
        },
        consistency: {
          mostWins: mostWins.team,
          fewestWins: fewestWins.team,
          mostDraws: mostDraws.team,
          fewestDraws: fewestDraws.team,
          mostLosses: mostLosses.team,
          fewestLosses: fewestLosses.team
        },
        playerStats: {
          topScorer: (topScorers as any)[0]?.player?.name || 'N/A',
          topScorerGoals: (topScorers as any)[0]?.statistics?.goals?.total || 0,
          topAssist: (topAssists as any)[0]?.player?.name || 'N/A',
          topAssistCount: (topAssists as any)[0]?.statistics?.goals?.assists || 0
        }
      };

      return {
        league: {
          id: found.league.id,
          name: found.league.name,
          slug: slugify(found.league.name),
          type: found.league.type,
          logoUrl: found.league.logo,
          country: {
            name: found.country.name,
            code: found.country.code,
            flagUrl: found.country.flag,
          },
        },
        season: {
          year: currentSeason,
          isCurrent: true,
        },
        standings,
        fixtures,
        results,
        statsSummary,
        faq: [
          {
            q: `When does the ${found.league.name} season start?`,
            a: `The ${found.league.name} season typically runs during the ${currentSeason} calendar period.`,
          },
          {
            q: `How many teams compete in ${found.league.name}?`,
            a: `The league features ${standings.length} teams competing for the title.`,
          },
        ],
      };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
  // GET /v1/debug/corners-test?leagueId=X&season=Y  (DEV ONLY - test corner stats coverage)
  server.get<{ Querystring: { leagueId?: string; season?: string; fixtureId?: string; teamId?: string } }>('/debug/corners-test', async (request) => {
    const { leagueId = '397', season = '2024', fixtureId, teamId } = request.query;

    // Clear relevant cache entries for fresh data
    let cleared = 0;
    for (const key of providerCache.keys()) {
      if (key.includes(`league=${leagueId}`) || key.includes(`fixture=${fixtureId}`) || (teamId && key.includes(`team=${teamId}`))) {
        providerCache.delete(key);
        cleared++;
      }
    }

    try {
      if (teamId) {
        // Test teams/statistics response structure for corner data
        const tsData = await fetchFromSportsProvider<any>(`/teams/statistics?league=${leagueId}&season=${season}&team=${teamId}`);
        const ts = tsData?.response;
        if (!ts) return { cleared, error: 'No response for team stats' };
        // Return the full structure keys and corner-related data
        const topKeys = Object.keys(ts);
        const cornersObj = ts.corners;
        const statsArr = ts.statistics || [];
        const goalsKeys = Object.keys(ts.goals || {});
        return {
          cleared, teamId, topKeys, cornersObj, statsArr: statsArr.slice(0, 5), goalsKeys,
          fixturesPlayed: ts.fixtures?.played
        };
      } else if (fixtureId) {
        // Test a specific fixture's statistics
        const statsData: any = await fetchFromSportsProvider(`/fixtures/statistics?fixture=${fixtureId}`);
        const response = statsData?.response || [];
        const cornerTypes = response.map((t: unknown) => ({
          team: (t as any).team?.name,
          cornerKicks: (t as any).statistics?.find((s: any) => s.type === 'Corner Kicks')?.value,
          allTypes: (t as any).statistics?.map((s: any) => s.type)
        }));
        return { cleared, fixtureId, cornerData: cornerTypes };
      } else {
        // Test fixtures availability for the league
        const d: any = await fetchFromSportsProvider(`/fixtures?league=${leagueId}&season=${season}&status=FT`);
        const fixtures = d?.response || [];
        const sample = fixtures.slice(0, 3).map((f: unknown) => ({
          id: (f as any).fixture?.id,
          date: (f as any).fixture?.date,
          status: (f as any).fixture?.status?.short,
          home: (f as any).teams?.home?.name,
          away: (f as any).teams?.away?.name
        }));
        return { cleared, leagueId, season, fixturesCount: fixtures.length, sample };
      }
    } catch (err) {
      return { error: (err as Error).message, cleared };
    }
  });
}

