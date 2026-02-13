import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface StreamsQuery {
  region?: string;
  date?: string;
}

export async function streamsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { region?: string; date?: string; page?: string; pageSize?: string } }>('/streams', async (request) => {
    const { region, date, page = '1', pageSize = '20' } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    const conditions: string[] = ['DATE(m.kickoff_at) = $1'];
    const params: (string | number)[] = [targetDate];
    let paramIndex = 2;

    if (region) {
      conditions.push(`c.name ILIKE $${paramIndex++}`);
      params.push(`%${region}%`);
    }

    const whereClause = conditions.join(' AND ');

    // 1. Get Total Count
    const countResult = await query(
      `SELECT COUNT(*) 
       FROM matches m
       JOIN leagues l ON m.league_id = l.id
       JOIN countries c ON l.country_id = c.id
       WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // 2. Get Paginated Data
    // We need to add pagination params to the params array for the main query
    const queryParams = [...params, pageSizeNum, offset];

    const result = await query(
      `SELECT 
        l.id as league_id,
        l.name as league_name,
        l.slug as league_slug,
        m.id as match_id,
        m.kickoff_at,
        ht.name as home_team_name,
        ht.slug as home_team_slug,
        ht.logo_url as home_team_logo,
        at.name as away_team_name,
        at.slug as away_team_slug,
        at.logo_url as away_team_logo
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN countries c ON l.country_id = c.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE ${whereClause}
      ORDER BY m.kickoff_at ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryParams
    );

    const items = result.rows.map((row: any) => ({
      league: {
        id: row.league_id,
        name: row.league_name,
        slug: row.league_slug,
      },
      matchId: row.match_id,
      kickoffAt: row.kickoff_at,
      homeTeam: {
        name: row.home_team_name,
        slug: row.home_team_slug,
        logoUrl: row.home_team_logo,
      },
      awayTeam: {
        name: row.away_team_name,
        slug: row.away_team_slug,
        logoUrl: row.away_team_logo,
      },
      whereToWatch: [
        { name: 'Sky Sports', url: 'https://www.skysports.com' },
        { name: 'BT Sport', url: 'https://www.bt.com/sport' },
      ],
    }));

    return {
      date: targetDate,
      region,
      page: pageNum,
      pageSize: pageSizeNum,
      total,
      items,
    };
  });
}

