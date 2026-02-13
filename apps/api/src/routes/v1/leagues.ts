import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface LeagueDetailParams {
  countrySlug: string;
  leagueSlug: string;
}

export async function leaguesRoutes(server: FastifyInstance) {
  // GET /v1/leagues
  server.get<{ Querystring: { page?: string; pageSize?: string } }>('/leagues', async (request) => {
    const { page = '1', pageSize = '50' } = request.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    const result = await query(
      `SELECT 
        c.id as country_id,
        c.name as country_name,
        c.code as country_code,
        c.flag_url as country_flag,
        l.id as league_id,
        l.name as league_name,
        l.slug as league_slug,
        l.type as league_type,
        l.logo_url as league_logo
      FROM leagues l
      JOIN countries c ON l.country_id = c.id
      ORDER BY c.name, l.name`
    );

    // Group by country
    const groupedMap: Map<string, any> = new Map();

    for (const row of result.rows) {
      const countryKey = row.country_name;

      if (!groupedMap.has(countryKey)) {
        groupedMap.set(countryKey, {
          country: {
            name: row.country_name,
            code: row.country_code,
            flagUrl: row.country_flag,
          },
          leagues: [],
        });
      }

      groupedMap.get(countryKey).leagues.push({
        id: row.league_id,
        name: row.league_name,
        slug: row.league_slug,
        logoUrl: row.league_logo,
        type: row.league_type,
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

  // GET /v1/league/:countrySlug/:leagueSlug
  server.get<{ Params: LeagueDetailParams }>('/league/:countrySlug/:leagueSlug', async (request, reply) => {
    const { leagueSlug } = request.params;

    // Get league info
    const leagueResult = await query(
      `SELECT 
        l.id as league_id,
        l.name as league_name,
        l.slug as league_slug,
        l.type as league_type,
        l.logo_url as league_logo,
        c.name as country_name,
        c.code as country_code,
        c.flag_url as country_flag,
        s.id as season_id,
        s.year as season_year,
        s.is_current as season_is_current
      FROM leagues l
      JOIN countries c ON l.country_id = c.id
      LEFT JOIN seasons s ON l.id = s.league_id AND s.is_current = true
      WHERE l.slug = $1
      LIMIT 1`,
      [leagueSlug]
    );

    if (leagueResult.rows.length === 0) {
      return reply.status(404).send({ error: 'League not found' });
    }

    const leagueRow = leagueResult.rows[0];
    const seasonId = leagueRow.season_id;

    // Get standings (mock for now - calculate from match results)
    const standingsResult = await query(
      `SELECT 
        t.id as team_id,
        t.name as team_name,
        t.slug as team_slug,
        t.logo_url as team_logo,
        COUNT(DISTINCT m.id) as played,
        SUM(CASE 
          WHEN (m.home_team_id = t.id AND m.home_goals > m.away_goals) OR 
               (m.away_team_id = t.id AND m.away_goals > m.home_goals) 
          THEN 1 ELSE 0 END) as wins,
        SUM(CASE 
          WHEN m.home_goals = m.away_goals AND m.status = 'FT'
          THEN 1 ELSE 0 END) as draws,
        SUM(CASE 
          WHEN (m.home_team_id = t.id AND m.home_goals < m.away_goals) OR 
               (m.away_team_id = t.id AND m.away_goals < m.home_goals) 
          THEN 1 ELSE 0 END) as losses,
        SUM(CASE 
          WHEN m.home_team_id = t.id THEN COALESCE(m.home_goals, 0)
          ELSE COALESCE(m.away_goals, 0) END) as gf,
        SUM(CASE 
          WHEN m.home_team_id = t.id THEN COALESCE(m.away_goals, 0)
          ELSE COALESCE(m.home_goals, 0) END) as ga
      FROM teams t
      JOIN season_teams st ON t.id = st.team_id
      LEFT JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id) 
        AND m.season_id = st.season_id AND m.status = 'FT'
      WHERE st.season_id = $1
      GROUP BY t.id, t.name, t.slug, t.logo_url
      ORDER BY 
        (SUM(CASE 
          WHEN (m.home_team_id = t.id AND m.home_goals > m.away_goals) OR 
               (m.away_team_id = t.id AND m.away_goals > m.home_goals) 
          THEN 3 
          WHEN m.home_goals = m.away_goals AND m.status = 'FT' THEN 1 
          ELSE 0 END)) DESC,
        (SUM(CASE 
          WHEN m.home_team_id = t.id THEN COALESCE(m.home_goals, 0)
          ELSE COALESCE(m.away_goals, 0) END) - 
         SUM(CASE 
          WHEN m.home_team_id = t.id THEN COALESCE(m.away_goals, 0)
          ELSE COALESCE(m.home_goals, 0) END)) DESC`,
      [seasonId]
    );

    const standings = standingsResult.rows.map((row: { team_id: number; team_name: string; team_slug: string; team_logo: string | null; played: number | string; wins: number | string; draws: number | string; losses: number | string; gf: number | string; ga: number | string }, index: number) => ({
      rank: index + 1,
      team: {
        id: row.team_id,
        name: row.team_name,
        slug: row.team_slug,
        logoUrl: row.team_logo,
      },
      played: parseInt(String(row.played), 10),
      wins: parseInt(String(row.wins), 10),
      draws: parseInt(String(row.draws), 10),
      losses: parseInt(String(row.losses), 10),
      gf: parseInt(String(row.gf), 10),
      ga: parseInt(String(row.ga), 10),
      points: parseInt(String(row.wins), 10) * 3 + parseInt(String(row.draws), 10),
    }));

    // Get upcoming fixtures
    const fixturesResult = await query(
      `SELECT 
        m.id as match_id,
        m.provider_fixture_id,
        m.kickoff_at,
        m.status,
        m.elapsed,
        m.home_goals,
        m.away_goals,
        l.id as league_id,
        l.name as league_name,
        l.slug as league_slug,
        l.type as league_type,
        l.logo_url as league_logo,
        c.name as country_name,
        c.code as country_code,
        c.flag_url as country_flag,
        ht.id as home_team_id,
        ht.name as home_team_name,
        ht.slug as home_team_slug,
        ht.logo_url as home_team_logo,
        at.id as away_team_id,
        at.name as away_team_name,
        at.slug as away_team_slug,
        at.logo_url as away_team_logo
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN countries c ON l.country_id = c.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.season_id = $1 AND m.status = 'NS' AND m.kickoff_at > NOW()
      ORDER BY m.kickoff_at ASC
      LIMIT 10`,
      [seasonId]
    );

    const fixtures = fixturesResult.rows.map((row: { match_id: number; provider_fixture_id: number | null; kickoff_at: string; status: string; elapsed: number | null; home_goals: number | null; away_goals: number | null; league_id: number; league_name: string; league_slug: string; league_type: string; league_logo: string | null; country_name: string; country_code: string; country_flag: string | null; home_team_id: number; home_team_name: string; home_team_slug: string; home_team_logo: string | null; away_team_id: number; away_team_name: string; away_team_slug: string; away_team_logo: string | null }) => ({
      matchId: row.match_id,
      providerFixtureId: row.provider_fixture_id,
      kickoffAt: row.kickoff_at,
      status: row.status,
      elapsed: row.elapsed,
      league: {
        id: row.league_id,
        name: row.league_name,
        slug: row.league_slug,
        type: row.league_type,
        logoUrl: row.league_logo,
        country: {
          name: row.country_name,
          code: row.country_code,
          flagUrl: row.country_flag,
        },
      },
      homeTeam: {
        id: row.home_team_id,
        name: row.home_team_name,
        slug: row.home_team_slug,
        logoUrl: row.home_team_logo,
      },
      awayTeam: {
        id: row.away_team_id,
        name: row.away_team_name,
        slug: row.away_team_slug,
        logoUrl: row.away_team_logo,
      },
      score: {
        home: row.home_goals,
        away: row.away_goals,
      },
    }));

    // Get recent results
    const resultsResult = await query(
      `SELECT 
        m.id as match_id,
        m.provider_fixture_id,
        m.kickoff_at,
        m.status,
        m.elapsed,
        m.home_goals,
        m.away_goals,
        l.id as league_id,
        l.name as league_name,
        l.slug as league_slug,
        l.type as league_type,
        l.logo_url as league_logo,
        c.name as country_name,
        c.code as country_code,
        c.flag_url as country_flag,
        ht.id as home_team_id,
        ht.name as home_team_name,
        ht.slug as home_team_slug,
        ht.logo_url as home_team_logo,
        at.id as away_team_id,
        at.name as away_team_name,
        at.slug as away_team_slug,
        at.logo_url as away_team_logo
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN countries c ON l.country_id = c.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.season_id = $1 AND m.status = 'FT'
      ORDER BY m.kickoff_at DESC
      LIMIT 10`,
      [seasonId]
    );

    const results = resultsResult.rows.map((row: { match_id: number; provider_fixture_id: number | null; kickoff_at: string; status: string; elapsed: number | null; home_goals: number | null; away_goals: number | null; league_id: number; league_name: string; league_slug: string; league_type: string; league_logo: string | null; country_name: string; country_code: string; country_flag: string | null; home_team_id: number; home_team_name: string; home_team_slug: string; home_team_logo: string | null; away_team_id: number; away_team_name: string; away_team_slug: string; away_team_logo: string | null }) => ({
      matchId: row.match_id,
      providerFixtureId: row.provider_fixture_id,
      kickoffAt: row.kickoff_at,
      status: row.status,
      elapsed: row.elapsed,
      league: {
        id: row.league_id,
        name: row.league_name,
        slug: row.league_slug,
        type: row.league_type,
        logoUrl: row.league_logo,
        country: {
          name: row.country_name,
          code: row.country_code,
          flagUrl: row.country_flag,
        },
      },
      homeTeam: {
        id: row.home_team_id,
        name: row.home_team_name,
        slug: row.home_team_slug,
        logoUrl: row.home_team_logo,
      },
      awayTeam: {
        id: row.away_team_id,
        name: row.away_team_name,
        slug: row.away_team_slug,
        logoUrl: row.away_team_logo,
      },
      score: {
        home: row.home_goals,
        away: row.away_goals,
      },
    }));

    return {
      league: {
        id: leagueRow.league_id,
        name: leagueRow.league_name,
        slug: leagueRow.league_slug,
        type: leagueRow.league_type,
        logoUrl: leagueRow.league_logo,
        country: {
          name: leagueRow.country_name,
          code: leagueRow.country_code,
          flagUrl: leagueRow.country_flag,
        },
      },
      season: {
        year: leagueRow.season_year,
        isCurrent: leagueRow.season_is_current,
      },
      standings,
      fixtures,
      results,
      statsSummary: {
        goalsAvg: 2.7,
        cornersAvg: 10.5,
        cardsAvg: 4.2,
      },
      faq: [
        {
          q: `When does the ${leagueRow.league_name} season start?`,
          a: `The ${leagueRow.league_name} season typically runs from August to May.`,
        },
        {
          q: `How many teams compete in ${leagueRow.league_name}?`,
          a: `The league features ${standings.length} teams competing for the title.`,
        },
      ],
    };
  });
}

