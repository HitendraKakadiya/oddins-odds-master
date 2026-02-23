import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface TodayQuery {
  date?: string;
  tz?: string;
}

interface FeaturedTipsQuery {
  date?: string;
}

export async function matchesRoutes(server: FastifyInstance) {
  // GET /v1/matches/today
  server.get<{ Querystring: TodayQuery }>('/matches/today', async (request) => {
    const { date } = request.query;

    // Default to today if no date provided
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Query matches for the given date
    const result = await query(
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
        at.logo_url as away_team_logo,
        t.id as tip_id,
        t.title as tip_title,
        t.is_premium as tip_is_premium
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN countries c ON l.country_id = c.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      LEFT JOIN tips t ON m.id = t.match_id AND t.published_at IS NOT NULL
      WHERE DATE(m.kickoff_at) = $1
      ORDER BY m.kickoff_at ASC`,
      [targetDate]
    );

    const matches = result.rows.map((row: { match_id: number; provider_fixture_id: number | null; kickoff_at: string; status: string; elapsed: number | null; home_goals: number | null; away_goals: number | null; league_id: number; league_name: string; league_slug: string; league_type: string; league_logo: string | null; country_name: string; country_code: string; country_flag: string | null; home_team_id: number; home_team_name: string; home_team_slug: string; home_team_logo: string | null; away_team_id: number; away_team_name: string; away_team_slug: string; away_team_logo: string | null; tip_id: number | null; tip_title: string | null; tip_is_premium: boolean | null }) => ({
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
      featuredTip: row.tip_id ? {
        id: row.tip_id,
        title: row.tip_title,
        isPremium: row.tip_is_premium,
      } : null,
    }));

    return {
      date: targetDate,
      matches,
    };
  });

  // GET /v1/tips/featured
  server.get<{ Querystring: FeaturedTipsQuery }>('/tips/featured', async (request) => {
    const { date } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const result = await query(
      `SELECT 
        t.id,
        t.match_id,
        t.title,
        t.short_reason,
        t.is_premium,
        t.published_at
      FROM tips t
      JOIN matches m ON t.match_id = m.id
      WHERE DATE(m.kickoff_at) = $1
        AND t.published_at IS NOT NULL
      ORDER BY t.tip_rank ASC, t.published_at DESC
      LIMIT 10`,
      [targetDate]
    );

    return {
      date: targetDate,
      tips: result.rows.map((row: { id: number; match_id: number; title: string; short_reason: string; is_premium: boolean; published_at: string }) => ({
        id: row.id,
        matchId: row.match_id,
        title: row.title,
        shortReason: row.short_reason,
        isPremium: row.is_premium,
        publishedAt: row.published_at,
      })),
    };
  });
}

