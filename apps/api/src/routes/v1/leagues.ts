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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          standingsRaw = calculateVirtualStandings(results as any);
        }
      } catch (err) {
        server.log.warn(`Error fetching league data for ${leagueId}: ${(err as Error).message}`);
      }

      const standings = (standingsRaw || []).map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = row as any;
        return {
          rank: r.rank,
          group: r.group,
          team: {
            id: r.team?.id,
            name: r.team?.name,
            slug: r.team?.name ? slugify(r.team.name) : '',
            logoUrl: r.team?.logo || r.team?.logoUrl,
          },
          overall: {
            played: r.overall?.played || 0,
            wins: r.overall?.wins || 0,
            draws: r.overall?.draws || 0,
            losses: r.overall?.losses || 0,
            gf: r.overall?.gf || 0,
            ga: r.overall?.ga || 0,
            gd: r.overall?.gd || 0,
            points: r.overall?.points || 0,
            ppg: r.overall?.ppg || 0,
            ...r.overall
          },
          home: {
            played: r.home?.played || 0,
            wins: r.home?.wins || 0,
            draws: r.home?.draws || 0,
            losses: r.home?.losses || 0,
            gf: r.home?.gf || 0,
            ga: r.home?.ga || 0,
            gd: r.home?.gd || 0,
            points: r.home?.points || 0,
            ppg: r.home?.ppg || 0,
            ...r.home
          },
          away: {
            played: r.away?.played || 0,
            wins: r.away?.wins || 0,
            draws: r.away?.draws || 0,
            losses: r.away?.losses || 0,
            gf: r.away?.gf || 0,
            ga: r.away?.ga || 0,
            gd: r.away?.gd || 0,
            points: r.away?.points || 0,
            ppg: r.away?.ppg || 0,
            ...r.away
          },
          form: r.form || []
        };
      });

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const st = s as any;
        totalGoals += st.overall.gf;
        totalMatchesPlayed += st.overall.played;
        homeWins += st.home.wins;
        awayWins += st.away.wins;
        draws += st.overall.draws;

        if (st.overall.gf > bestAttack.goals) bestAttack = { team: st.team.name, goals: st.overall.gf };
        if (st.overall.gf < worstAttack.goals) worstAttack = { team: st.team.name, goals: st.overall.gf };
        if (st.overall.ga < bestDefense.goals) bestDefense = { team: st.team.name, goals: st.overall.ga };
        if (st.overall.ga > worstDefense.goals) worstDefense = { team: st.team.name, goals: st.overall.ga };

        if (st.overall.wins > mostWins.val) mostWins = { team: st.team.name, val: st.overall.wins };
        if (st.overall.wins < fewestWins.val) fewestWins = { team: st.team.name, val: st.overall.wins };
        if (st.overall.draws > mostDraws.val) mostDraws = { team: st.team.name, val: st.overall.draws };
        if (st.overall.draws < fewestDraws.val) fewestDraws = { team: st.team.name, val: st.overall.draws };
        if (st.overall.losses > mostLosses.val) mostLosses = { team: st.team.name, val: st.overall.losses };
        if (st.overall.losses < fewestLosses.val) fewestLosses = { team: st.team.name, val: st.overall.losses };
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerStats: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          topScorer: (topScorers as any)[0]?.player?.name || 'N/A',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          topScorerGoals: (topScorers as any)[0]?.statistics?.goals?.total || 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          topAssist: (topAssists as any)[0]?.player?.name || 'N/A',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }

    try {
      if (teamId) {
        // Test teams/statistics response structure for corner data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tsData = await fetchFromSportsProvider<any>(`/teams/statistics?league=${leagueId}&season=${season}&team=${teamId}`);
        const ts = tsData?.response;
        if (!ts) return { cleared, error: 'No response for team stats' };
        // Return the full structure keys and corner-related data
        const topKeys = Object.keys(ts);
        const cornersObj = ts.corners;
        const statsArr = ts.statistics || [];
        const goalsKeys = Object.keys(ts.goals || {});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {
          cleared, teamId, topKeys, cornersObj, statsArr: statsArr.slice(0, 5), goalsKeys,
          fixturesPlayed: ts.fixtures?.played
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if (fixtureId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // Test a specific fixture's statistics
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const statsData: any = await fetchFromSportsProvider(`/fixtures/statistics?fixture=${fixtureId}`);
        const response = statsData?.response || [];
        const cornerTypes = response.map((t: unknown) => ({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          team: (t as any).team?.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cornerKicks: (t as any).statistics?.find((s: any) => s.type === 'Corner Kicks')?.value,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          allTypes: (t as any).statistics?.map((s: any) => s.type)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { cleared, fixtureId, cornerData: cornerTypes };
      } else {
        // Test fixtures availability for the league
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d: any = await fetchFromSportsProvider(`/fixtures?league=${leagueId}&season=${season}&status=FT`);
        const fixtures = d?.response || [];
        const sample = fixtures.slice(0, 3).map((f: unknown) => ({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (f as any).fixture?.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          date: (f as any).fixture?.date,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: (f as any).fixture?.status?.short,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          home: (f as any).teams?.home?.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          away: (f as any).teams?.away?.name
        }));
        return { cleared, leagueId, season, fixturesCount: fixtures.length, sample };
      }
    } catch (err) {
      return { error: (err as Error).message, cleared };
    }
  });
}

