import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface MatchParams {
  matchId: string;
}

async function getLeagueStandings(seasonId: number) {
  const standingsResult = await query(
    `SELECT 
      t.id as team_id,
      t.name as team_name,
      t.logo_url as team_logo,
      -- Overall
      COUNT(m.id) as played,
      SUM(CASE WHEN (m.home_team_id = t.id AND m.home_goals > m.away_goals) OR (m.away_team_id = t.id AND m.away_goals > m.home_goals) THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN m.home_goals = m.away_goals THEN 1 ELSE 0 END) as draws,
      SUM(CASE WHEN (m.home_team_id = t.id AND m.home_goals < m.away_goals) OR (m.away_team_id = t.id AND m.away_goals < m.home_goals) THEN 1 ELSE 0 END) as losses,
      SUM(CASE WHEN m.home_team_id = t.id THEN m.home_goals ELSE m.away_goals END) as gf,
      SUM(CASE WHEN m.home_team_id = t.id THEN m.away_goals ELSE m.home_goals END) as ga,
      -- Home
      SUM(CASE WHEN m.home_team_id = t.id THEN 1 ELSE 0 END) as home_played,
      SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals > m.away_goals THEN 1 ELSE 0 END) as home_wins,
      SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals = m.away_goals THEN 1 ELSE 0 END) as home_draws,
      SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals < m.away_goals THEN 1 ELSE 0 END) as home_losses,
      SUM(CASE WHEN m.home_team_id = t.id THEN m.home_goals ELSE 0 END) as home_gf,
      SUM(CASE WHEN m.home_team_id = t.id THEN m.away_goals ELSE 0 END) as home_ga,
      -- Away
      SUM(CASE WHEN m.away_team_id = t.id THEN 1 ELSE 0 END) as away_played,
      SUM(CASE WHEN m.away_team_id = t.id AND m.away_goals > m.home_goals THEN 1 ELSE 0 END) as away_wins,
      SUM(CASE WHEN m.away_team_id = t.id AND m.away_goals = m.home_goals THEN 1 ELSE 0 END) as away_draws,
      SUM(CASE WHEN m.away_team_id = t.id AND m.away_goals < m.home_goals THEN 1 ELSE 0 END) as away_losses,
      SUM(CASE WHEN m.away_team_id = t.id THEN m.away_goals ELSE 0 END) as away_gf,
      SUM(CASE WHEN m.away_team_id = t.id THEN m.home_goals ELSE 0 END) as away_ga
    FROM teams t
    JOIN season_teams st ON t.id = st.team_id
    LEFT JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id) 
      AND m.season_id = st.season_id AND m.status = 'FT'
    WHERE st.season_id = $1
    GROUP BY t.id, t.name, t.logo_url`,
    [seasonId]
  );

  // Get last 5 for each team
  const last5Result = await query(
    `WITH TeamMatches AS (
      SELECT 
        t.id as team_id,
        m.id,
        m.kickoff_at,
        CASE 
          WHEN (m.home_team_id = t.id AND m.home_goals > m.away_goals) OR (m.away_team_id = t.id AND m.away_goals > m.home_goals) THEN 'W'
          WHEN m.home_goals = m.away_goals THEN 'D'
          ELSE 'L'
        END as result,
        ROW_NUMBER() OVER(PARTITION BY t.id ORDER BY m.kickoff_at DESC) as rn
      FROM teams t
      JOIN season_teams st ON t.id = st.team_id
      JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id) 
        AND m.season_id = st.season_id AND m.status = 'FT'
      WHERE st.season_id = $1
    )
    SELECT team_id, string_agg(result, ',' ORDER BY kickoff_at DESC) as form
    FROM TeamMatches
    WHERE rn <= 5
    GROUP BY team_id`,
    [seasonId]
  );

  const formMap = new Map(last5Result.rows.map(r => [r.team_id, r.form.split(',')]));

  const calculateSplit = (wins: number, draws: number, played: number, gf: number, ga: number) => ({
    played, wins, draws, losses: played - wins - draws,
    gf, ga, gd: gf - ga,
    points: wins * 3 + draws,
    ppg: played > 0 ? parseFloat(((wins * 3 + draws) / played).toFixed(2)) : 0
  });

  const standings = standingsResult.rows.map(r => ({
    team: { id: r.team_id, name: r.team_name, logoUrl: r.team_logo },
    overall: calculateSplit(parseInt(r.wins), parseInt(r.draws), parseInt(r.played), parseInt(r.gf), parseInt(r.ga)),
    home: calculateSplit(parseInt(r.home_wins), parseInt(r.home_draws), parseInt(r.home_played), parseInt(r.home_gf), parseInt(r.home_ga)),
    away: calculateSplit(parseInt(r.away_wins), parseInt(r.away_draws), parseInt(r.away_played), parseInt(r.away_gf), parseInt(r.away_ga)),
    form: formMap.get(r.team_id) || []
  }));

  // Sort by Overall Points, then GD, then GF
  return standings.sort((a, b) =>
    b.overall.points - a.overall.points ||
    b.overall.gd - a.overall.gd ||
    b.overall.gf - a.overall.gf
  ).map((s, idx) => ({ ...s, rank: idx + 1 }));
}

async function getTeamStatsSummary(teamId: number, leagueId: number) {
  const finishedStatuses = `('FT','AET','PEN','PST','AWD','WO','CANC','ABD','INT','SUSP')`;

  const getRecentMatchesQuery = (leagueFilter: boolean) => `
    SELECT 
      m.id, m.home_team_id, m.away_team_id, m.home_goals, m.away_goals,
      m.status, m.kickoff_at,
      ht.name as home_team_name, ht.logo_url as home_team_logo,
      at.name as away_team_name, at.logo_url as away_team_logo,
      l.name as league_name
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.id
    JOIN teams at ON m.away_team_id = at.id
    JOIN leagues l ON m.league_id = l.id
    WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
      ${leagueFilter ? 'AND m.league_id = $2' : ''}
      AND m.status IN ${finishedStatuses}
      AND m.home_goals IS NOT NULL
    ORDER BY m.kickoff_at DESC
    LIMIT 20
  `;

  let recentMatches = await query(getRecentMatchesQuery(true), [teamId, leagueId]);
  let dataSource: 'league' | 'all' | 'any' = 'league';

  if (recentMatches.rows.length === 0) {
    dataSource = 'all';
    recentMatches = await query(getRecentMatchesQuery(false), [teamId]);
  }

  if (recentMatches.rows.length === 0) {
    dataSource = 'any';
    recentMatches = await query(
      `SELECT 
        m.id, m.home_team_id, m.away_team_id, m.home_goals, m.away_goals,
        m.status, m.kickoff_at,
        ht.name as home_team_name, ht.logo_url as home_team_logo,
        at.name as away_team_name, at.logo_url as away_team_logo,
        l.name as league_name
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.id
       JOIN teams at ON m.away_team_id = at.id
       JOIN leagues l ON m.league_id = l.id
       WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
         AND m.home_goals IS NOT NULL
         AND m.kickoff_at < NOW()
       ORDER BY m.kickoff_at DESC
       LIMIT 20`,
      [teamId]
    );
  }

  const stats = {
    overall: { played: 0, wins: 0, draws: 0, losses: 0, scored: 0, conceded: 0, btts: 0, cleanSheets: 0, failedToScore: 0, ppg: 0, over05: 0, over15: 0, over25: 0, over35: 0, over45: 0, over55: 0 },
    home: { played: 0, wins: 0, draws: 0, losses: 0, scored: 0, conceded: 0, btts: 0, cleanSheets: 0, failedToScore: 0, ppg: 0, over05: 0, over15: 0, over25: 0, over35: 0, over45: 0, over55: 0 },
    away: { played: 0, wins: 0, draws: 0, losses: 0, scored: 0, conceded: 0, btts: 0, cleanSheets: 0, failedToScore: 0, ppg: 0, over05: 0, over15: 0, over25: 0, over35: 0, over45: 0, over55: 0 },
    last5: [] as string[],
    last5Home: [] as string[],
    last5Away: [] as string[],
    recentMatchesDetailed: [] as any[]
  };

  recentMatches.rows.forEach((m: any, idx: number) => {
    const isHome = m.home_team_id === teamId;
    const scored = isHome ? m.home_goals : m.away_goals;
    const conceded = isHome ? m.away_goals : m.home_goals;
    const totalGoals = (m.home_goals || 0) + (m.away_goals || 0);
    const result = scored > conceded ? 'W' : (scored === conceded ? 'D' : 'L');

    if (idx < 5) stats.last5.push(result);
    if (isHome && stats.last5Home.length < 5) stats.last5Home.push(result);
    if (!isHome && stats.last5Away.length < 5) stats.last5Away.push(result);

    // Detailed match data for Form tab
    stats.recentMatchesDetailed.push({
      id: m.id,
      kickoffAt: m.kickoff_at,
      homeTeam: { id: m.home_team_id, name: m.home_team_name, logoUrl: m.home_team_logo },
      awayTeam: { id: m.away_team_id, name: m.away_team_name, logoUrl: m.away_team_logo },
      score: { home: m.home_goals, away: m.away_goals },
      leagueName: m.league_name,
      result: result,
      isHome: isHome
    });

    const update = (obj: any) => {
      obj.played++;
      obj.scored += scored;
      obj.conceded += conceded;
      if (result === 'W') { obj.wins++; obj.ppg += 3; }
      else if (result === 'D') { obj.draws++; obj.ppg += 1; }
      else obj.losses++;

      if (scored > 0 && conceded > 0) obj.btts++;
      if (conceded === 0) obj.cleanSheets++;
      if (scored === 0) obj.failedToScore++;

      if (totalGoals > 0.5) obj.over05++;
      if (totalGoals > 1.5) obj.over15++;
      if (totalGoals > 2.5) obj.over25++;
      if (totalGoals > 3.5) obj.over35++;
      if (totalGoals > 4.5) obj.over45++;
      if (totalGoals > 5.5) obj.over55++;
    };

    update(stats.overall);
    if (isHome) update(stats.home);
    else update(stats.away);
  });

  const finalize = (obj: any) => {
    if (obj.played > 0) {
      obj.ppg = parseFloat((obj.ppg / obj.played).toFixed(2));
      obj.winRate = Math.round((obj.wins / obj.played) * 100);
      obj.scoredAvg = parseFloat((obj.scored / obj.played).toFixed(2));
      obj.concededAvg = parseFloat((obj.conceded / obj.played).toFixed(2));
      obj.bttsRate = Math.round((obj.btts / obj.played) * 100);
      obj.cleanSheetRate = Math.round((obj.cleanSheets / obj.played) * 100);
      obj.failedToScoreRate = Math.round((obj.failedToScore / obj.played) * 100);
      obj.over05Rate = Math.round((obj.over05 / obj.played) * 100);
      obj.over15Rate = Math.round((obj.over15 / obj.played) * 100);
      obj.over25Rate = Math.round((obj.over25 / obj.played) * 100);
      obj.over35Rate = Math.round((obj.over35 / obj.played) * 100);
      obj.over45Rate = Math.round((obj.over45 / obj.played) * 100);
      obj.over55Rate = Math.round((obj.over55 / obj.played) * 100);
    }
  };

  finalize(stats.overall);
  finalize(stats.home);
  finalize(stats.away);

  return { ...stats, dataSource };
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
        m.season_id,
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

    const [homeStats, awayStats, leagueStats, standings] = await Promise.all([
      getTeamStatsSummary(row.home_team_id, row.league_id),
      getTeamStatsSummary(row.away_team_id, row.league_id),
      query(`
        SELECT 
          AVG(home_goals + away_goals) as avg_goals,
          COUNT(*) FILTER (WHERE home_goals > 0 AND away_goals > 0) * 100.0 / NULLIF(COUNT(*), 0) as btts_rate,
          COUNT(*) FILTER (WHERE home_goals + away_goals > 2.5) * 100.0 / NULLIF(COUNT(*), 0) as over25_rate,
          COUNT(*) FILTER (WHERE home_goals + away_goals > 1.5) * 100.0 / NULLIF(COUNT(*), 0) as over15_rate
        FROM matches 
        WHERE league_id = $1 
          AND status IN ('FT','AET','PEN','PST','AWD','WO','CANC','ABD','INT','SUSP')
          AND home_goals IS NOT NULL
      `, [row.league_id]),
      getLeagueStandings(row.season_id)
    ]);

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
          oddValue: parseFloat(String(r.odd_value)),
          impliedProb: r.implied_prob ? parseFloat(String(r.implied_prob)) : null,
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
        mp.confidence
      FROM match_predictions mp
      JOIN markets mk ON mp.market_id = mk.id
      WHERE mp.match_id = $1
      ORDER BY mp.confidence DESC`,
      [matchId]
    );

    const predictions = predictionsResult.rows.map((r: any) => ({
      matchId: parseInt(matchId, 10),
      marketKey: r.market_key,
      line: r.line,
      selection: r.selection,
      probability: parseFloat(String(r.probability)),
      confidence: parseFloat(String(r.confidence)),
      shortExplanation: 'Based on recent form and statistical analysis',
      isPremium: false,
    }));

    // Get H2H (enhanced - last 20 matches between these teams)
    const h2hResult = await query(
      `SELECT 
        m.id, m.kickoff_at, m.home_goals, m.away_goals,
        m.home_team_id, m.away_team_id,
        ht.name as home_team_name, ht.logo_url as home_team_logo,
        at.name as away_team_name, at.logo_url as away_team_logo,
        l.name as competition
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.id != $1
        AND (
          (m.home_team_id = $2 AND m.away_team_id = $3) OR
          (m.home_team_id = $3 AND m.away_team_id = $2)
        )
        AND m.status = 'FT'
        AND m.home_goals IS NOT NULL
      ORDER BY m.kickoff_at DESC
      LIMIT 20`,
      [matchId, row.home_team_id, row.away_team_id]
    );

    const h2h = h2hResult.rows.map((r: any) => ({
      id: r.id,
      date: r.kickoff_at,
      competition: r.competition,
      homeTeam: { id: r.home_team_id, name: r.home_team_name, logoUrl: r.home_team_logo },
      awayTeam: { id: r.away_team_id, name: r.away_team_name, logoUrl: r.away_team_logo },
      homeScore: r.home_goals,
      awayScore: r.away_goals,
    }));

    // Calculate H2H Summary
    const h2hSummary = {
      total: h2h.length,
      homeTeam: { wins: 0, cleanSheets: 0 },
      awayTeam: { wins: 0, cleanSheets: 0 },
      draws: 0,
      btts: 0,
      over05: 0,
      over15: 0,
      over25: 0
    };

    h2h.forEach(m => {
      const isHomeTeamHome = m.homeTeam.id === row.home_team_id;
      const homeScore = isHomeTeamHome ? m.homeScore : m.awayScore;
      const awayScore = isHomeTeamHome ? m.awayScore : m.homeScore;
      const totalGoals = m.homeScore + m.awayScore;

      if (homeScore > awayScore) h2hSummary.homeTeam.wins++;
      else if (awayScore > homeScore) h2hSummary.awayTeam.wins++;
      else h2hSummary.draws++;

      if (homeScore === 0) h2hSummary.awayTeam.cleanSheets++;
      if (awayScore === 0) h2hSummary.homeTeam.cleanSheets++;
      if (homeScore > 0 && awayScore > 0) h2hSummary.btts++;

      if (totalGoals > 0.5) h2hSummary.over05++;
      if (totalGoals > 1.5) h2hSummary.over15++;
      if (totalGoals > 2.5) h2hSummary.over25++;
    });

    const lStats = leagueStats.rows[0];

    return {
      match,
      oddsLatest,
      predictions,
      h2h,
      h2hSummary,
      standings,
      stats: {
        home: homeStats,
        away: awayStats,
        homeStatsSource: homeStats.dataSource,
        awayStatsSource: awayStats.dataSource,
        league: {
          goalsAvg: parseFloat(String(lStats.avg_goals || 0)).toFixed(2),
          bttsRate: Math.round(parseFloat(String(lStats.btts_rate || 0))),
          over25Rate: Math.round(parseFloat(String(lStats.over25_rate || 0))),
          over15Rate: Math.round(parseFloat(String(lStats.over15_rate || 0))),
        }
      },
      whereToWatch: [
        { name: 'Sky Sports', url: 'https://www.skysports.com' },
        { name: 'BT Sport', url: '#' },
      ],
    };
  });
}

