import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface TodayQuery {
  date?: string;
  tz?: string;
  page?: string;
  pageSize?: string;
  leagueId?: string;
  market?: string;
  minOdds?: string;
}

interface FeaturedTipsQuery {
  date?: string;
}

export async function matchesRoutes(server: FastifyInstance) {
  // GET /v1/matches/today
  server.get<{ Querystring: TodayQuery }>('/matches/today', async (request) => {
    const { date, leagueId, market, minOdds, page = '1', pageSize = '20' } = request.query;

    // Default to today if no date provided
    const targetDate = date || new Date().toISOString().split('T')[0];

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;


    // Build filter clauses
    const conditions = [`DATE(m.kickoff_at) = $1`];
    const params: (string | number)[] = [targetDate];
    let paramIdx = 2;

    if (leagueId) {
      conditions.push(`l.provider_league_id = $${paramIdx++}`);
      params.push(leagueId);
    }

    if (market || minOdds) {
      let oddsSubQuery = `
        SELECT 1 FROM odds_snapshots os
        JOIN odds_snapshot_lines osl ON os.id = osl.snapshot_id
        JOIN markets mk ON osl.market_id = mk.id
        WHERE os.match_id = m.id
      `;

      if (market === 'Sure 2 Odds') {
        oddsSubQuery += ` AND osl.odd_value BETWEEN 1.90 AND 2.20`;
      } else if (market === 'Draw') {
        oddsSubQuery += ` AND mk.key = 'FT_1X2' AND osl.selection = 'Draw'`;
      } else if (market) {
        const marketMap: Record<string, { key: string; selection?: string; line?: number }> = {
          '1X2': { key: 'FT_1X2' },
          'Double Chance': { key: 'DC' },
          'Both Teams to Score': { key: 'BTTS' },
          'Over 2.5': { key: 'OU_GOALS', selection: 'Over', line: 2.5 },
          'Under 2.5': { key: 'OU_GOALS', selection: 'Under', line: 2.5 },
          'Over 1.5': { key: 'OU_GOALS', selection: 'Over', line: 1.5 },
          'Correct Score': { key: 'CS' },
          'HT/FT': { key: 'HT_FT' },
          'DNB': { key: 'DNB' },
          'Handicap': { key: 'HANDICAP' },
          'Over 9.5 Corners': { key: 'OU_CORNERS', selection: 'Over', line: 9.5 },
          'Under 9.5 Corners': { key: 'OU_CORNERS', selection: 'Under', line: 9.5 },
        };

        const config = marketMap[market];
        if (config) {
          oddsSubQuery += ` AND mk.key = $${paramIdx++}`;
          params.push(config.key);
          if (config.selection) {
            oddsSubQuery += ` AND osl.selection = $${paramIdx++}`;
            params.push(config.selection);
          }
          if (config.line) {
            oddsSubQuery += ` AND osl.line = $${paramIdx++}`;
            params.push(config.line);
          }
        }
      }

      if (minOdds) {
        const minOddsVal = parseFloat(minOdds);
        if (!isNaN(minOddsVal)) {
          oddsSubQuery += ` AND osl.odd_value >= $${paramIdx++}`;
          params.push(minOddsVal);
        }
      }

      conditions.push(`EXISTS (${oddsSubQuery})`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM matches m 
       JOIN leagues l ON m.league_id = l.id
       ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Query matches for the given date with pagination
    params.push(pageSizeNum, offset);
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
      ${whereClause}
      ORDER BY m.kickoff_at ASC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      params
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
      page: pageNum,
      pageSize: pageSizeNum,
      total,
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
        t.published_at,
        m.kickoff_at,
        l.name as league_name,
        l.slug as league_slug,
        ht.name as home_team_name,
        ht.logo_url as home_team_logo,
        at.name as away_team_name,
        at.logo_url as away_team_logo,
        c.name as country_name,
        c.code as country_code
      FROM tips t
      JOIN matches m ON t.match_id = m.id
      JOIN leagues l ON m.league_id = l.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      LEFT JOIN countries c ON l.country_id = c.id
      WHERE DATE(m.kickoff_at) = $1
        AND t.published_at IS NOT NULL
      ORDER BY t.tip_rank ASC, t.published_at DESC
      LIMIT 3`,
      [targetDate]
    );

    return {
      date: targetDate,
      tips: result.rows.map((row) => ({
        id: row.id,
        matchId: row.match_id,
        title: row.title,
        shortReason: row.short_reason,
        isPremium: row.is_premium,
        publishedAt: row.published_at,
        kickoffAt: row.kickoff_at,
        league: {
          name: row.league_name,
          slug: row.league_slug,
          countryName: row.country_name,
          countryCode: row.country_code,
        },
        homeTeam: {
          name: row.home_team_name,
          logoUrl: row.home_team_logo,
        },
        awayTeam: {
          name: row.away_team_name,
          logoUrl: row.away_team_logo,
        },
        selection: row.title, // Use title as selection for now
      })),
    };
  });
}

