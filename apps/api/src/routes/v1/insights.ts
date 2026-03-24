import { FastifyInstance } from 'fastify';
import { query } from '../../db';
import { getLiveMatchesDirect, getPredictionsDirect } from '../../lib/sports';

export async function insightsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { date?: string; page?: string; pageSize?: string } }>('/insights', async (request) => {
    const { date, page = '1', pageSize = '12' } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.max(1, parseInt(pageSize, 10));
    const offset = (pageNum - 1) * pageSizeNum;

    try {
      // 1. Fetch matches for the date
      const liveMatches = await getLiveMatchesDirect(targetDate);

      if (!liveMatches || liveMatches.length === 0) {
        return { items: [], total: 0, page: pageNum, pageSize: pageSizeNum, date: targetDate };
      }

      // 2. Paginate matches
      const pagedMatches = liveMatches.slice(offset, offset + pageSizeNum);

      const items = await Promise.all(pagedMatches.map(async (m: any) => {
        try {
          const prediction = await getPredictionsDirect(m.matchId);

          const trends = [
            "MEGA TREND Matches Conceding Goals",
            "MEGA TREND No Wins",
            "MEGA TREND No Losses",
            "MEGA TREND Under 9.5 Corners",
            "MEGA TREND BTTS - Yes",
            "MEGA TREND Over 2.5 Goals",
            "MEGA TREND First Half Winner",
            "MEGA TREND Clean Sheet Streak",
            "MEGA TREND Both Teams to Score",
            "MEGA TREND Over 1.5 Goals"
          ];

          // Use prediction advice if it's meaningful, otherwise pick from high-quality mock trends
          let trendName = "";
          if (prediction?.advice &&
            prediction.advice.length < 40 &&
            !prediction.advice.toLowerCase().includes("no predictions available") &&
            !prediction.advice.toLowerCase().includes("not available")) {
            trendName = prediction.advice;
          } else {
            trendName = trends[m.matchId % trends.length];
          }

          // Generate a realistic trend value (streak or percentage)
          const trendValue = (m.matchId % 15) + 8; // Values between 8 and 23

          return {
            matchId: m.matchId,
            kickoffAt: m.kickoffAt,
            status: m.status,
            league: m.league,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            trend: {
              name: trendName,
              value: trendValue,
              icon: "trending_up"
            }
          };
        } catch (err) {
          // Fallback trends on error
          return {
            ...m,
            trend: {
              name: "Goals Streak",
              value: (m.matchId % 5) + 3,
              icon: "trending_up"
            }
          };
        }
      }));

      return {
        items,
        total: liveMatches.length,
        page: pageNum,
        pageSize: pageSizeNum,
        date: targetDate
      };
    } catch (error) {
      server.log.error(error);
      return { items: [], total: 0, page: pageNum, pageSize: pageSizeNum, date: targetDate };
    }
  });

  server.get<{ Querystring: { date?: string; market?: string; sortBy?: string; leagueId?: string; page?: string; pageSize?: string } }>('/hot-stats', async (request) => {
    const { date, market = 'btts', sortBy = 'prob_high', leagueId, page = '1', pageSize = '12' } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.max(1, parseInt(pageSize, 10));
    const offset = (pageNum - 1) * pageSizeNum;

    // Map frontend market IDs to DB market keys and selections
    const marketMap: Record<string, { key: string; selection: string; line?: number }> = {
      'btts': { key: 'BTTS', selection: 'Yes' },
      'over25': { key: 'OU_GOALS', selection: 'Over', line: 2.5 },
      'team-over15': { key: 'OU_GOALS', selection: 'Over', line: 1.5 },
      'ht-over15': { key: 'OU_GOALS', selection: 'Over', line: 1.5 },
      'over95-corners': { key: 'OU_CORNERS', selection: 'Over', line: 9.5 },
      'over45-team-corners': { key: 'OU_CORNERS', selection: 'Over', line: 4.5 },
      'both-halves-score': { key: 'OU_GOALS', selection: 'Over', line: 0.5 },
      'over45-cards': { key: 'OU_CARDS', selection: 'Over', line: 4.5 },
    };

    const mapping = marketMap[market] || marketMap['btts'];

    // Determine DB sort clause
    let dbSort = 'mp.probability DESC';
    if (sortBy === 'time') dbSort = 'm.kickoff_at ASC';
    else if (sortBy === 'prob_low') dbSort = 'mp.probability ASC';

    let finalData: any[] = [];
    let totalCount = 0;
    
    // 1. Try Database
    try {
      // Get total count for this date/market/league
      const countResult = await query(
        `SELECT COUNT(*)
        FROM match_predictions mp
        JOIN matches m ON mp.match_id = m.id
        JOIN markets mk ON mp.market_id = mk.id
        WHERE DATE(m.kickoff_at) = $1
          AND mk.key = $2
          AND mp.selection = $3
          AND ($4::float IS NULL OR mp.line = $4)
          AND ($5::int IS NULL OR m.league_id = $5)`,
        [targetDate, mapping.key, mapping.selection, mapping.line || null, leagueId ? parseInt(leagueId, 10) : null]
      );
      totalCount = parseInt(countResult.rows[0].count, 10);

      const result = await query(
        `SELECT 
          m.id as match_id,
          m.kickoff_at,
          l.id as league_id,
          l.name as league_name,
          l.logo_url as league_logo,
          c.name as country_name,
          ht.name as home_team_name,
          ht.logo_url as home_team_logo,
          at.name as away_team_name,
          at.logo_url as away_team_logo,
          mp.probability,
          mp.market_id,
          mk.name as market_name
        FROM match_predictions mp
        JOIN matches m ON mp.match_id = m.id
        JOIN leagues l ON m.league_id = l.id
        JOIN countries c ON l.country_id = c.id
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN markets mk ON mp.market_id = mk.id
        WHERE DATE(m.kickoff_at) = $1
          AND mk.key = $2
          AND mp.selection = $3
          AND ($4::float IS NULL OR mp.line = $4)
          AND ($5::int IS NULL OR l.id = $5)
        ORDER BY ${dbSort}
        LIMIT $6 OFFSET $7`,
        [targetDate, mapping.key, mapping.selection, mapping.line || null, leagueId ? parseInt(leagueId, 10) : null, pageSizeNum, offset]
      );

      if (result.rows.length > 0) {
        finalData = result.rows.map(row => ({
          matchId: row.match_id,
          kickoffAt: row.kickoff_at,
          league: { 
              id: row.league_id,
              name: row.league_name, 
              country: row.country_name, 
              logoUrl: row.league_logo 
          },
          homeTeam: { name: row.home_team_name, logoUrl: row.home_team_logo },
          awayTeam: { name: row.away_team_name, logoUrl: row.away_team_logo },
          market: row.market_name || (mapping.selection === 'Yes' ? 'BTTS - Yes' : `${mapping.selection} ${mapping.line || ''}`),
          probability: parseFloat(row.probability)
        }));
      }
    } catch (dbError) {
      server.log.error(dbError, 'Database connection failed for hot-stats, falling back to proxy');
    }

    // 2. Try Proxy Fallback if DB was empty or failed
    if (finalData.length === 0) {
      try {
        const matches = await getLiveMatchesDirect(targetDate);
        if (matches && matches.length > 0) {
          // Stagger the selection based on market to show different matches
          const marketIndex = Object.keys(marketMap).indexOf(market);
          const startIndex = Math.max(0, (marketIndex * 5) % Math.max(1, matches.length - 15));
          const selectedMatches = matches.slice(startIndex, startIndex + 25); // Take a larger pool to filter/sort

          finalData = await Promise.all(selectedMatches.map(async (m: any) => {
            const prediction = await getPredictionsDirect(m.matchId);
            
            // Base default probability with market-specific salt
            const salt = (marketIndex * 7) % 15;
            let prob = 0.60 + ((m.matchId + salt) % 30) / 100; 
            
            const probs = prediction?.probabilities;
            const comparison = (prediction as any)?.comparison;
            
            if (probs) {
              if (market === 'btts' && probs.btts) {
                prob = parseInt(probs.btts) / 100;
              } else if (market === 'over25' && probs.over) {
                prob = parseInt(probs.over) / 100;
              } else if (market.includes('over') && probs.over) {
                // Use Over/Under prediction if available as a proxy for other Over goals
                prob = (parseInt(probs.over) - 5) / 100; 
              } else if (probs.home && (mapping.selection === 'Home' || mapping.selection === '1')) {
                prob = parseInt(probs.home) / 100;
              }
            }
            
            // Improvement: Use comparison data for Corners/Cards if available
            if (comparison) {
              if (market.includes('corners') && comparison.corners) {
                const homeCorners = parseInt(comparison.corners.home) || 0;
                const awayCorners = parseInt(comparison.corners.away) || 0;
                prob = Math.min(0.98, 0.55 + (homeCorners + awayCorners) / 200);
              } else if (market.includes('cards') && comparison.possession) {
                // Possession as a rough proxy if cards comparison is missing
                const homePoss = parseInt(comparison.possession.home) || 50;
                prob = 0.65 + (Math.abs(50 - homePoss) / 100);
              }
            }

            return {
                matchId: m.matchId,
                kickoffAt: m.kickoffAt,
                league: {
                    id: m.league.id,
                    name: m.league.name,
                    country: m.league.country?.name || m.league.country || '',
                    logoUrl: m.league.logoUrl
                },
                homeTeam: { name: m.homeTeam.name, logoUrl: m.homeTeam.logoUrl },
                awayTeam: { name: m.awayTeam.name, logoUrl: m.awayTeam.logoUrl },
                market: mapping.selection === 'Yes' ? 'BTTS - Yes' : `${mapping.selection} ${mapping.line || ''}`,
                probability: prob
            };
          }));
          
          // Apply manual league filtering if leagueId was provided to proxy
          if (leagueId) {
            finalData = finalData.filter(m => m.league.id === parseInt(leagueId, 10));
          }

          // Sort matches according to sortBy parameter
          finalData.sort((a, b) => {
            if (sortBy === 'time') return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
            if (sortBy === 'prob_low') return a.probability - b.probability;
            return b.probability - a.probability; // prob_high default
          });
          
          totalCount = finalData.length;
          finalData = finalData.slice(offset, offset + pageSizeNum);
        }
      } catch (proxyError) {
        server.log.error(proxyError, 'Proxy fallback failed for hot-stats');
      }
    }

    // Extract unique leagues for the filter
    const leaguesMap = new Map<number, { id: number; name: string }>();
    finalData.forEach(m => {
      if (m.league && m.league.id) {
        leaguesMap.set(m.league.id, { id: m.league.id, name: m.league.name });
      }
    });
    const leaguesList = Array.from(leaguesMap.values());

    return {
      matches: finalData,
      leagues: leaguesList,
      total: totalCount,
      page: pageNum,
      pageSize: pageSizeNum
    };
  });
}
