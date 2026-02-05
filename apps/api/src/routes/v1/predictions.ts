import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface PredictionsQuery {
  date?: string;
  region?: string;
  leagueSlug?: string;
  marketKey?: string;
  page?: string;
  pageSize?: string;
}

export async function predictionsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: PredictionsQuery }>('/predictions', async (request) => {
    const {
      date,
      region,
      leagueSlug,
      marketKey,
      page = '1',
      pageSize = '50',
    } = request.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    // Build WHERE clause dynamically
    const conditions: string[] = ['mp.generated_at IS NOT NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    if (date) {
      conditions.push(`DATE(m.kickoff_at) = $${paramIndex++}`);
      params.push(date);
    }

    if (leagueSlug) {
      conditions.push(`l.slug = $${paramIndex++}`);
      params.push(leagueSlug);
    }

    if (marketKey) {
      conditions.push(`mk.key = $${paramIndex++}`);
      params.push(marketKey);
    }

    if (region) {
      // Region filter on country name (simplified)
      conditions.push(`c.name ILIKE $${paramIndex++}`);
      params.push(`%${region}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(DISTINCT mp.id) as total
       FROM match_predictions mp
       JOIN matches m ON mp.match_id = m.id
       JOIN leagues l ON m.league_id = l.id
       JOIN countries c ON l.country_id = c.id
       JOIN markets mk ON mp.market_id = mk.id
       ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated results
    params.push(pageSizeNum, offset);
    const result = await query(
      `SELECT 
        mp.id as prediction_id,
        m.id as match_id,
        m.kickoff_at,
        l.name as league_name,
        l.slug as league_slug,
        c.name as country_name,
        ht.id as home_team_id,
        ht.name as home_team_name,
        ht.slug as home_team_slug,
        ht.logo_url as home_team_logo,
        at.id as away_team_id,
        at.name as away_team_name,
        at.slug as away_team_slug,
        at.logo_url as away_team_logo,
        mk.key as market_key,
        mp.line,
        mp.selection,
        mp.probability,
        mp.confidence,
        t.is_premium
      FROM match_predictions mp
      JOIN matches m ON mp.match_id = m.id
      JOIN leagues l ON m.league_id = l.id
      JOIN countries c ON l.country_id = c.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      JOIN markets mk ON mp.market_id = mk.id
      LEFT JOIN tips t ON m.id = t.match_id
      ${whereClause}
      ORDER BY m.kickoff_at ASC, mp.confidence DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      params
    );

    const items = result.rows.map((row: any) => ({
      matchId: row.match_id,
      kickoffAt: row.kickoff_at,
      league: {
        name: row.league_name,
        slug: row.league_slug,
        countryName: row.country_name,
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
      marketKey: row.market_key,
      line: row.line,
      selection: row.selection,
      probability: row.probability,
      confidence: row.confidence,
      shortExplanation: `Based on recent form and statistical analysis`,
      isPremium: row.is_premium || false,
    }));

    return {
      page: pageNum,
      pageSize: pageSizeNum,
      total,
      items,
    };
  });
}

