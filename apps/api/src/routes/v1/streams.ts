import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface StreamsQuery {
  region?: string;
  date?: string;
}

export async function streamsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: StreamsQuery }>('/streams', async (request) => {
    const { region, date } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const conditions: string[] = ['DATE(m.kickoff_at) = $1'];
    const params: unknown[] = [targetDate];
    let paramIndex = 2;

    if (region) {
      conditions.push(`c.name ILIKE $${paramIndex++}`);
      params.push(`%${region}%`);
    }

    const whereClause = conditions.join(' AND ');

    const result = await query(
      `SELECT 
        l.name as league_name,
        l.slug as league_slug,
        m.id as match_id,
        m.kickoff_at,
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
      WHERE ${whereClause}
      ORDER BY m.kickoff_at ASC`,
      params
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = result.rows.map((row: any) => ({
      league: {
        name: row.league_name,
        slug: row.league_slug,
      },
      matchId: row.match_id,
      kickoffAt: row.kickoff_at,
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
      whereToWatch: [
        { name: 'Sky Sports', url: 'https://www.skysports.com' },
        { name: 'BT Sport', url: 'https://www.bt.com/sport' },
      ],
    }));

    return {
      date: targetDate,
      region,
      items,
    };
  });
}

