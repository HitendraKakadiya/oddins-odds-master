import { FastifyInstance } from 'fastify';
import { getLeaguesDirect, getLeagueStandingsDirect, getLeagueFixturesDirect, getTopScorersDirect, getTopAssistsDirect } from '../../lib/sports';
import { getFeaturedLeagueIds } from '../../config/leagues';

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
    const allLeagues = leaguesFromDb || [];

    // Group by country
    const groupedMap: Map<string, { country: { name: string; code: string; flagUrl: string | null }; leagues: { id: number; name: string; slug: string; logoUrl: string | null; type: string }[] }> = new Map();

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

    const allLeagues = await getLeaguesDirect() || [];

    // Strategy: Current active leagues from major football nations
    const topCountries = ['England', 'Spain', 'Germany', 'Italy', 'France', 'Brazil', 'Argentina', 'Portugal', 'Netherlands', 'World'];

    const currentYear = new Date().getFullYear();
    const filtered = allLeagues.filter((item: any) => {
      // Must have at least one season from last 2 years (roughly) to be considered 'active with data'
      const hasRecentData = item.seasons.some((s: any) => s.year >= currentYear - 1);
      const isMajorCountry = topCountries.includes(item.country.name);
      const isLigAndNotCup = item.league.type === 'League' || (item.country.name === 'World' && item.league.name.includes('Champions League'));

      return hasRecentData && isMajorCountry && isLigAndNotCup;
    });

    // Sort by country importance and then league name
    const sorted = filtered.sort((a: any, b: any) => {
      const aIdx = topCountries.indexOf(a.country.name);
      const bIdx = topCountries.indexOf(b.country.name);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.league.name.localeCompare(b.league.name);
    });

    // Paginate
    const start = (pageNum - 1) * limitNum;
    const paginated = sorted.slice(start, start + limitNum);

    return paginated.map((item: any) => ({
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
      const allLeagues = await getLeaguesDirect() || [];
      const found = allLeagues.find((item: any) =>
        slugify(item.league.name) === leagueSlug &&
        slugify(item.country.name) === countrySlug
      );

      if (!found) {
        return reply.status(404).send({ error: 'League not found' });
      }

      const leagueId = found.league.id;
      const currentSeason = (found.seasons || []).find((s: any) => s.current)?.year || new Date().getFullYear();

      // Fetch data in parallel with season fallback for standings
      let standingsRaw: any[] = [];
      let fixtures: any[] = [];
      let results: any[] = [];
      let topScorers: any[] = [];
      let topAssists: any[] = [];

      try {
        [standingsRaw, fixtures, results, topScorers, topAssists] = await Promise.all([
          getLeagueStandingsDirect(leagueId, currentSeason).catch(() => getLeagueStandingsDirect(leagueId, currentSeason - 1)),
          getLeagueFixturesDirect(leagueId, currentSeason, 'next', 10).catch(() => []),
          getLeagueFixturesDirect(leagueId, currentSeason, 'last', 10).catch(() => []),
          getTopScorersDirect(leagueId, currentSeason).catch(() => []),
          getTopAssistsDirect(leagueId, currentSeason).catch(() => [])
        ]);
      } catch (err) {
        console.error(`Error fetching league data for ${leagueId}:`, err);
      }

      const standings = (standingsRaw || []).map((row: any) => ({
        rank: row.rank,
        group: row.group,
        team: {
          id: row.team.id,
          name: row.team.name,
          slug: slugify(row.team.name),
          logoUrl: row.team.logoUrl,
        },
        overall: {
          played: row.overall.played,
          wins: row.overall.wins,
          draws: row.overall.draws,
          losses: row.overall.losses,
          gf: row.overall.gf,
          ga: row.overall.ga,
          gd: row.overall.gd,
          points: row.overall.points,
          ppg: row.overall.ppg
        },
        home: {
          played: row.home.played,
          wins: row.home.wins,
          draws: row.home.draws,
          losses: row.home.losses,
          gf: row.home.gf,
          ga: row.home.ga,
          gd: row.home.gd,
          points: row.home.points,
          ppg: row.home.ppg
        },
        away: {
          played: row.away.played,
          wins: row.away.wins,
          draws: row.away.draws,
          losses: row.away.losses,
          gf: row.away.gf,
          ga: row.away.ga,
          gd: row.away.gd,
          points: row.away.points,
          ppg: row.away.ppg
        },
        form: row.form || []
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

      standings.forEach((s: any) => {
        totalGoals += s.overall.gf;
        totalMatchesPlayed += s.overall.played;
        homeWins += s.home.wins;
        awayWins += s.away.wins;
        draws += s.overall.draws;

        if (s.overall.gf > bestAttack.goals) bestAttack = { team: s.team.name, goals: s.overall.gf };
        if (s.overall.gf < worstAttack.goals) worstAttack = { team: s.team.name, goals: s.overall.gf };
        if (s.overall.ga < bestDefense.goals) bestDefense = { team: s.team.name, goals: s.overall.ga };
        if (s.overall.ga > worstDefense.goals) worstDefense = { team: s.team.name, goals: s.overall.ga };

        if (s.overall.wins > mostWins.val) mostWins = { team: s.team.name, val: s.overall.wins };
        if (s.overall.wins < fewestWins.val) fewestWins = { team: s.team.name, val: s.overall.wins };
        if (s.overall.draws > mostDraws.val) mostDraws = { team: s.team.name, val: s.overall.draws };
        if (s.overall.draws < fewestDraws.val) fewestDraws = { team: s.team.name, val: s.overall.draws };
        if (s.overall.losses > mostLosses.val) mostLosses = { team: s.team.name, val: s.overall.losses };
        if (s.overall.losses < fewestLosses.val) fewestLosses = { team: s.team.name, val: s.overall.losses };
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
          topScorer: topScorers[0]?.player.name || 'N/A',
          topScorerGoals: topScorers[0]?.statistics.goals.total || 0,
          topAssist: topAssists[0]?.player.name || 'N/A',
          topAssistCount: topAssists[0]?.statistics.goals.assists || 0
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
}

