import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface SearchQuery {
  q: string;
}

export async function searchRoutes(server: FastifyInstance) {
  server.get<{ Querystring: SearchQuery }>('/search', async (request, reply) => {
    const { q } = request.query;

    if (!q || q.trim().length === 0) {
      return reply.status(400).send({ error: 'Query parameter "q" is required' });
    }

    const searchTerm = `%${q.trim()}%`;

    // Search leagues
    const leaguesResult = await query(
      `SELECT id, name, slug
       FROM leagues
       WHERE name ILIKE $1
       ORDER BY name
       LIMIT 10`,
      [searchTerm]
    );

    const leagues = leaguesResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
    }));

    // Search teams
    const teamsResult = await query(
      `SELECT id, name, slug, logo_url
       FROM teams
       WHERE name ILIKE $1
       ORDER BY name
       LIMIT 10`,
      [searchTerm]
    );

    const teams = teamsResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logo_url,
    }));

    // Search matches (by team names)
    const matchesResult = await query(
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
      WHERE ht.name ILIKE $1 OR at.name ILIKE $1
      ORDER BY m.kickoff_at DESC
      LIMIT 10`,
      [searchTerm]
    );

    const matches = matchesResult.rows.map((row: any) => ({
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

    // Search articles
    const articlesResult = await query(
      `SELECT id, type, slug, title, summary, category, published_at, updated_at
       FROM articles
       WHERE (title ILIKE $1 OR summary ILIKE $1 OR body_md ILIKE $1)
         AND published_at IS NOT NULL
       ORDER BY published_at DESC
       LIMIT 10`,
      [searchTerm]
    );

    const articles = articlesResult.rows.map((row: any) => ({
      id: row.id,
      type: row.type,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      category: row.category,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
    }));

    return {
      q: q.trim(),
      leagues,
      teams,
      matches,
      articles,
    };
  });
}

