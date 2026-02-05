import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface MatchParams {
  matchId: string;
}

export async function matchDetailRoutes(server: FastifyInstance) {
  server.get<{ Params: MatchParams }>('/match/:matchId', async (request, reply) => {
    const { matchId } = request.params;

    // Get match details
    const matchResult = await query(
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
      WHERE m.id = $1
      LIMIT 1`,
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      return reply.status(404).send({ error: 'Match not found' });
    }

    const row = matchResult.rows[0];

    const match = {
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
    };

    // Get latest odds
    const oddsResult = await query(
      `SELECT 
        os.captured_at,
        b.name as bookmaker_name,
        b.slug as bookmaker_slug,
        mk.key as market_key,
        osl.line,
        osl.selection,
        osl.odd_value,
        osl.implied_prob
      FROM odds_snapshots os
      JOIN bookmakers b ON os.bookmaker_id = b.id
      JOIN odds_snapshot_lines osl ON os.id = osl.snapshot_id
      JOIN markets mk ON osl.market_id = mk.id
      WHERE os.match_id = $1
      ORDER BY os.captured_at DESC
      LIMIT 20`,
      [matchId]
    );

    let oddsLatest = null;
    if (oddsResult.rows.length > 0) {
      const firstRow = oddsResult.rows[0];
      oddsLatest = {
        bookmaker: {
          name: firstRow.bookmaker_name,
          slug: firstRow.bookmaker_slug,
        },
        capturedAt: firstRow.captured_at,
        markets: oddsResult.rows.map((r: any) => ({
          marketKey: r.market_key,
          line: r.line,
          selection: r.selection,
          oddValue: parseFloat(r.odd_value),
          impliedProb: r.implied_prob ? parseFloat(r.implied_prob) : null,
        })),
      };
    }

    // Get predictions
    const predictionsResult = await query(
      `SELECT 
        mp.id,
        mk.key as market_key,
        mp.line,
        mp.selection,
        mp.probability,
        mp.confidence,
        l.name as league_name,
        l.slug as league_slug,
        c.name as country_name
      FROM match_predictions mp
      JOIN markets mk ON mp.market_id = mk.id
      JOIN matches m ON mp.match_id = m.id
      JOIN leagues l ON m.league_id = l.id
      JOIN countries c ON l.country_id = c.id
      WHERE mp.match_id = $1
      ORDER BY mp.confidence DESC`,
      [matchId]
    );

    const predictions = predictionsResult.rows.map((r: any) => ({
      matchId: parseInt(matchId, 10),
      kickoffAt: row.kickoff_at,
      league: {
        name: r.league_name,
        slug: r.league_slug,
        countryName: r.country_name,
      },
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      marketKey: r.market_key,
      line: r.line,
      selection: r.selection,
      probability: r.probability,
      confidence: r.confidence,
      shortExplanation: 'Based on recent form and statistical analysis',
      isPremium: false,
    }));

    // Get H2H (simplified - last 5 matches between these teams)
    const h2hResult = await query(
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
      WHERE m.id != $1
        AND (
          (m.home_team_id = $2 AND m.away_team_id = $3) OR
          (m.home_team_id = $3 AND m.away_team_id = $2)
        )
        AND m.status = 'FT'
      ORDER BY m.kickoff_at DESC
      LIMIT 5`,
      [matchId, row.home_team_id, row.away_team_id]
    );

    const h2h = h2hResult.rows.map((r: any) => ({
      matchId: r.match_id,
      providerFixtureId: r.provider_fixture_id,
      kickoffAt: r.kickoff_at,
      status: r.status,
      elapsed: r.elapsed,
      league: {
        id: r.league_id,
        name: r.league_name,
        slug: r.league_slug,
        type: r.league_type,
        logoUrl: r.league_logo,
        country: {
          name: r.country_name,
          code: r.country_code,
          flagUrl: r.country_flag,
        },
      },
      homeTeam: {
        id: r.home_team_id,
        name: r.home_team_name,
        slug: r.home_team_slug,
        logoUrl: r.home_team_logo,
      },
      awayTeam: {
        id: r.away_team_id,
        name: r.away_team_name,
        slug: r.away_team_slug,
        logoUrl: r.away_team_logo,
      },
      score: {
        home: r.home_goals,
        away: r.away_goals,
      },
    }));

    return {
      match,
      oddsLatest,
      predictions,
      h2h,
      whereToWatch: [
        { name: 'Sky Sports', url: 'https://www.skysports.com' },
        { name: 'BT Sport', url: null },
      ],
    };
  });
}

