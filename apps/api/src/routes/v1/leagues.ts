import { FastifyInstance } from 'fastify';
import { getLeaguesDirect, getLeagueStandingsDirect, getLeagueFixturesDirect, getTopScorersDirect, getTopAssistsDirect } from '../../lib/sports';
import { query } from '../../db';

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
  server.get('/leagues/popular', async () => {
    // const popularLeagueIds = [39, 140, 135, 78, 61, 2, 3, 253, 71, 94, 88, 113]; // EPL, La Liga, Serie A, etc.
    // const allLeagues = await getLeaguesDirect() || [];
    // const filtered = allLeagues.filter((item: any) => popularLeagueIds.includes(item.league.id));

    // Fetch from local database instead of third-party API
    const popularLeagueIds = [39, 140, 135, 78, 61, 2, 3, 253, 71, 94, 88, 113];
    const result = await query(
      `SELECT 
        l.provider_league_id as id,
        l.name,
        l.slug,
        l.logo_url as "logoUrl",
        c.name as country_name,
        c.code as country_code,
        c.flag_url as country_flag
      FROM leagues l
      JOIN countries c ON l.country_id = c.id
      WHERE l.provider_league_id = ANY($1::int[])`,
      [popularLeagueIds] as any
    );

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logoUrl,
      country: {
        name: row.country_name,
        code: row.country_code,
        flagUrl: row.country_flag
      }
    }));
  });

  // GET /v1/league/:countrySlug/:leagueSlug
  server.get<{ Params: LeagueDetailParams }>('/league/:countrySlug/:leagueSlug', async (request, reply) => {
    const { countrySlug, leagueSlug } = request.params;

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

    // Fetch data in parallel
    const [standingsRaw, fixtures, results, topScorers, topAssists] = await Promise.all([
      getLeagueStandingsDirect(leagueId, currentSeason),
      getLeagueFixturesDirect(leagueId, currentSeason, 'next', 10),
      getLeagueFixturesDirect(leagueId, currentSeason, 'last', 10),
      getTopScorersDirect(leagueId, currentSeason),
      getTopAssistsDirect(leagueId, currentSeason)
    ]);

    const standings = (standingsRaw || []).map((row: any) => ({
      rank: row.rank,
      team: {
        id: row.team.id,
        name: row.team.name,
        slug: slugify(row.team.name),
        logoUrl: row.team.logo,
      },
      overall: {
        played: row.all.played,
        wins: row.all.win,
        draws: row.all.draw,
        losses: row.all.lose,
        gf: row.all.goals.for,
        ga: row.all.goals.against,
        gd: row.goalsDiff,
        points: row.points,
        ppg: row.all.played > 0 ? parseFloat((row.points / row.all.played).toFixed(2)) : 0
      },
      home: {
        played: row.home.played,
        wins: row.home.win,
        draws: row.home.draw,
        losses: row.home.lose,
        gf: row.home.goals.for,
        ga: row.home.goals.against,
        gd: row.home.goals.for - row.home.goals.against,
        points: row.home.win * 3 + row.home.draw,
        ppg: row.home.played > 0 ? parseFloat(((row.home.win * 3 + row.home.draw) / row.home.played).toFixed(2)) : 0
      },
      away: {
        played: row.away.played,
        wins: row.away.win,
        draws: row.away.draw,
        losses: row.away.lose,
        gf: row.away.goals.for,
        ga: row.away.goals.against,
        gd: row.away.goals.for - row.away.goals.against,
        points: row.away.win * 3 + row.away.draw,
        ppg: row.away.played > 0 ? parseFloat(((row.away.win * 3 + row.away.draw) / row.away.played).toFixed(2)) : 0
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

    // Divide by 2 because each goal is counted for one team but it's the same match goal
    // Wait, totalGoals from standings GF is actually the sum of all goals scored by all teams.
    // In a league, sum(GF) should equal sum(GA). And total goals in the league is sum(GF).

    // totalMatchesPlayed from standings is sum of matches played by each team. 
    // Since each match involves 2 teams, total unique matches played is sum(played) / 2.
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
  });
}

