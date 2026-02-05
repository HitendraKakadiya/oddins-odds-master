import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface TeamsQuery {
  query?: string;
  leagueSlug?: string;
}

interface TeamParams {
  teamSlug: string;
}

interface TeamTabParams {
  teamSlug: string;
  tab: string;
}

export async function teamsRoutes(server: FastifyInstance) {
  // GET /v1/teams
  server.get<{ Querystring: TeamsQuery }>('/teams', async (request) => {
    const { query: searchQuery, leagueSlug } = request.query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (searchQuery) {
      conditions.push(`t.name ILIKE $${paramIndex++}`);
      params.push(`%${searchQuery}%`);
    }

    if (leagueSlug) {
      conditions.push(`l.slug = $${paramIndex++}`);
      params.push(leagueSlug);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT DISTINCT
        t.id,
        t.name,
        t.slug,
        t.logo_url
      FROM teams t
      ${leagueSlug ? 'JOIN season_teams st ON t.id = st.team_id JOIN seasons s ON st.season_id = s.id JOIN leagues l ON s.league_id = l.id' : ''}
      ${whereClause}
      ORDER BY t.name
      LIMIT 50`,
      params
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logo_url,
    }));
  });

  // GET /v1/team/:teamSlug
  server.get<{ Params: TeamParams }>('/team/:teamSlug', async (request, reply) => {
    const { teamSlug } = request.params;

    const teamResult = await query(
      `SELECT id, name, slug, logo_url
       FROM teams
       WHERE slug = $1
       LIMIT 1`,
      [teamSlug]
    );

    if (teamResult.rows.length === 0) {
      return reply.status(404).send({ error: 'Team not found' });
    }

    const team = teamResult.rows[0];

    // Get next match
    const nextMatchResult = await query(
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
      WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
        AND m.status = 'NS'
        AND m.kickoff_at > NOW()
      ORDER BY m.kickoff_at ASC
      LIMIT 1`,
      [team.id]
    );

    const nextMatch = nextMatchResult.rows.length > 0 ? {
      matchId: nextMatchResult.rows[0].match_id,
      providerFixtureId: nextMatchResult.rows[0].provider_fixture_id,
      kickoffAt: nextMatchResult.rows[0].kickoff_at,
      status: nextMatchResult.rows[0].status,
      elapsed: nextMatchResult.rows[0].elapsed,
      league: {
        id: nextMatchResult.rows[0].league_id,
        name: nextMatchResult.rows[0].league_name,
        slug: nextMatchResult.rows[0].league_slug,
        type: nextMatchResult.rows[0].league_type,
        logoUrl: nextMatchResult.rows[0].league_logo,
        country: {
          name: nextMatchResult.rows[0].country_name,
          code: nextMatchResult.rows[0].country_code,
          flagUrl: nextMatchResult.rows[0].country_flag,
        },
      },
      homeTeam: {
        id: nextMatchResult.rows[0].home_team_id,
        name: nextMatchResult.rows[0].home_team_name,
        slug: nextMatchResult.rows[0].home_team_slug,
        logoUrl: nextMatchResult.rows[0].home_team_logo,
      },
      awayTeam: {
        id: nextMatchResult.rows[0].away_team_id,
        name: nextMatchResult.rows[0].away_team_name,
        slug: nextMatchResult.rows[0].away_team_slug,
        logoUrl: nextMatchResult.rows[0].away_team_logo,
      },
      score: {
        home: nextMatchResult.rows[0].home_goals,
        away: nextMatchResult.rows[0].away_goals,
      },
    } : null;

    // Get recent matches
    const recentResult = await query(
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
      WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
        AND m.status = 'FT'
      ORDER BY m.kickoff_at DESC
      LIMIT 5`,
      [team.id]
    );

    const recentMatches = recentResult.rows.map((row: any) => ({
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
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logo_url,
      },
      nextMatch,
      recentMatches,
      statsSummary: {
        goalsPerGame: 1.8,
        cornersPerGame: 5.5,
        cardsPerGame: 2.1,
      },
    };
  });

  // GET /v1/team/:teamSlug/:tab
  server.get<{ Params: TeamTabParams }>('/team/:teamSlug/:tab', async (request, reply) => {
    const { teamSlug, tab } = request.params;

    const teamResult = await query(
      `SELECT id, name, slug, logo_url
       FROM teams
       WHERE slug = $1
       LIMIT 1`,
      [teamSlug]
    );

    if (teamResult.rows.length === 0) {
      return reply.status(404).send({ error: 'Team not found' });
    }

    const team = teamResult.rows[0];

    let items: any[] = [];

    switch (tab) {
      case 'fixtures':
        const fixturesResult = await query(
          `SELECT 
            m.id, m.kickoff_at, m.status,
            ht.name as home_team, at.name as away_team,
            l.name as league_name
          FROM matches m
          JOIN teams ht ON m.home_team_id = ht.id
          JOIN teams at ON m.away_team_id = at.id
          JOIN leagues l ON m.league_id = l.id
          WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
            AND m.status = 'NS'
          ORDER BY m.kickoff_at ASC
          LIMIT 20`,
          [team.id]
        );
        items = fixturesResult.rows;
        break;

      case 'results':
        const resultsResult = await query(
          `SELECT 
            m.id, m.kickoff_at, m.status, m.home_goals, m.away_goals,
            ht.name as home_team, at.name as away_team,
            l.name as league_name
          FROM matches m
          JOIN teams ht ON m.home_team_id = ht.id
          JOIN teams at ON m.away_team_id = at.id
          JOIN leagues l ON m.league_id = l.id
          WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
            AND m.status = 'FT'
          ORDER BY m.kickoff_at DESC
          LIMIT 20`,
          [team.id]
        );
        items = resultsResult.rows;
        break;

      case 'stats':
      case 'corners':
      case 'cards':
        // Return aggregated stats from team_match_stats
        const statsResult = await query(
          `SELECT 
            m.id as match_id,
            m.kickoff_at,
            tms.stats,
            tms.is_home
          FROM team_match_stats tms
          JOIN matches m ON tms.match_id = m.id
          WHERE tms.team_id = $1 AND m.status = 'FT'
          ORDER BY m.kickoff_at DESC
          LIMIT 20`,
          [team.id]
        );
        items = statsResult.rows.map((row: any) => ({
          matchId: row.match_id,
          kickoffAt: row.kickoff_at,
          isHome: row.is_home,
          stats: row.stats,
        }));
        break;

      default:
        items = [];
    }

    return {
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logo_url,
      },
      tab,
      items,
    };
  });
}

