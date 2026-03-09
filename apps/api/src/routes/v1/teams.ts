import { FastifyInstance } from 'fastify';
import {
  getTeamBySlugDirect,
  getTeamByIdDirect,
  getTeamMatchesDirect,
  getTeamStatsDirect,
  getLeaguesDirect,
  getLeagueStandingsDirect,
  getTeamSquadDirect,
  getTeamsByLeagueDirect,
  getPopularTeamsDirect,
  getTopScorersDirect,
  getTopAssistsDirect,
  getTeamLeaguesDirect,
  getFullPredictionDetailDirect,
  getFixtureStatisticsDirect,
  getMatchEventsDirect,
  getLeagueFixturesDirect,
  calculateVirtualStandings
} from '../../lib/sports';
import { FEATURED_LEAGUES } from '../../config/leagues';

interface TeamsQuery {
  query?: string;
  leagueSlug?: string;
  leagueId?: string;
}

interface TeamParams {
  teamSlug: string;
}

interface TeamQuery {
  league?: string;
}

interface TeamTabParams {
  teamSlug: string;
  tab: string;
}

export async function teamsRoutes(server: FastifyInstance) {
  // GET /v1/teams/featured
  server.get('/teams/featured', async () => {
    // Strategy: Fetch top leagues dynamically and get their first couple of teams
    let allLeagues = await getLeaguesDirect() || [];
    const topCountries = ['England', 'Spain', 'Germany', 'Italy', 'France'];
    const fallbackMajorIds = [39, 140, 78, 135, 61]; // PL, La Liga, Bundesliga, Serie A, Ligue 1

    let topLeagues = allLeagues.filter((item: any) => {
      const isCurrent = item.seasons.some((s: any) => s.current === true);
      const isTop5 = topCountries.includes(item.country.name);
      return isCurrent && isTop5 && item.league.type === 'League';
    }).slice(0, 5);

    let leagueIds = topLeagues.map(l => l.league.id);

    // Resilient Fallback: If no top leagues found, use standard major IDs
    if (leagueIds.length === 0) {
      leagueIds = fallbackMajorIds;
    }

    const teamsPromises = leagueIds.map(id => getTeamsByLeagueDirect(id));
    const teamsResults = await Promise.all(teamsPromises);

    // Take first 3-4 teams from each major league
    const featuredTeams = teamsResults.flatMap(teams => teams.slice(0, 4));

    return featuredTeams.slice(0, 9);
  });

  // GET /v1/teams
  server.get<{ Querystring: TeamsQuery }>('/teams', async (request) => {
    const { query: searchQuery, leagueId } = request.query;

    if (leagueId) {
      return getTeamsByLeagueDirect(parseInt(leagueId));
    }

    if (searchQuery) {
      const data = await getTeamBySlugDirect(searchQuery);
      return data ? [data] : [];
    }

    // Default to some popular teams if no ID
    const popularLeagues = await server.inject({ method: 'GET', url: '/v1/leagues/popular' });
    const leaguesData = popularLeagues.json();
    const firstLeagueId = leaguesData[0]?.id || 39;

    return await getTeamsByLeagueDirect(firstLeagueId, new Date().getFullYear());
  });

  // GET /v1/team/:teamSlug
  server.get<{ Params: TeamParams; Querystring: TeamQuery }>('/team/:teamSlug', async (request, reply) => {
    const { teamSlug } = request.params;
    const { league } = request.query;
    const requestedLeagueId = league ? parseInt(league as string, 10) : null;

    try {
      // 1. Resolve Team (ID-in-slug support for 100% reliability)
      let liveTeam = null;
      const idMatch = teamSlug.match(/^(\d+)-/);

      if (idMatch) {
        const teamId = parseInt(idMatch[1], 10);
        liveTeam = await getTeamByIdDirect(teamId);
      }

      // Fallback to fuzzy slug search if no ID or ID lookup failed
      if (!liveTeam) {
        liveTeam = await getTeamBySlugDirect(teamSlug);
      }

      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found' });
      }

      // 2. Fetch Initial Data (Leagues & Initial Matches)
      let competitions: any[] = await getTeamLeaguesDirect(liveTeam.id).catch(() => []);
      let statsLeagueId = requestedLeagueId;
      let nextMatches: any[] = [];
      let recentMatches: any[] = [];
      let detectedSeason = null;

      if (statsLeagueId) {
        // If league is requested, find its current season from the leagues list
        const comp = competitions.find((c: any) => c.id === statsLeagueId);
        detectedSeason = comp?.season;

        // Fetch matches for this specific league (cross-season for better data in cups)
        [nextMatches, recentMatches] = await Promise.all([
          getTeamMatchesDirect(liveTeam.id, 'next', 5, statsLeagueId, detectedSeason).catch(() => []),
          getTeamMatchesDirect(liveTeam.id, 'last', 20, statsLeagueId).catch(() => [])
        ]);
      } else {
        // No league requested, fetch last 10 matches across all competitions to detect primary league
        [nextMatches, recentMatches] = await Promise.all([
          getTeamMatchesDirect(liveTeam.id, 'next', 5).catch(() => []),
          getTeamMatchesDirect(liveTeam.id, 'last', 10).catch(() => [])
        ]);

        const leagueCounts = new Map<number, number>();
        recentMatches.forEach((m: any) => {
          if (m.league?.id) {
            leagueCounts.set(m.league.id, (leagueCounts.get(m.league.id) || 0) + 1);
          }
        });
        statsLeagueId = [...leagueCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 39;

        // Detect season from these matches for the detected league
        const targetMatches = [...recentMatches, ...nextMatches].filter((m: any) => m.league?.id === statsLeagueId);
        if (targetMatches.length > 0) {
          detectedSeason = targetMatches[0].league?.season;
        } else {
          // Fallback to competitions list for detected league
          detectedSeason = competitions.find((c: any) => c.id === statsLeagueId)?.season;
        }
      }

      const currentYear = new Date().getFullYear();
      const seasonToTry = detectedSeason || ((new Date().getMonth() < 6) ? currentYear - 1 : currentYear);

      // 4. Fetch Stats Summary
      const createDefaultStats = () => ({
        overall: { played: 0, wins: 0, draws: 0, losses: 0 },
        home: { played: 0, wins: 0, draws: 0, losses: 0 },
        away: { played: 0, wins: 0, draws: 0, losses: 0 },
        cleanSheets: 0,
        homeCleanSheets: 0,
        awayCleanSheets: 0,
        bttsRate: 0,
        homeBttsRate: 0,
        awayBttsRate: 0,
        failedToScoreRate: 0,
        homeFailedToScoreRate: 0,
        awayFailedToScoreRate: 0,
        ppg: 0,
        goalsScoredAvg: 0,
        goalsConcededAvg: 0,
        cornersAvg: 0,
        cornersForAvg: 0,
        cornersAgainstAvg: 0,
        cardsAvg: 0,
        cardsForAvg: 0,
        cardsAgainstAvg: 0
      });

      let statsSummary: any = createDefaultStats();
      let liveStats: any = null;

      let aggregatedCorners: any = {
        average: { overall: 0, home: 0, away: 0 },
        over_7_5: { overall: "0%", home: "0%", away: "0%" },
        over_8_5: { overall: "0%", home: "0%", away: "0%" },
        over_9_5: { overall: "0%", home: "0%", away: "0%" },
        over_10_5: { overall: "0%", home: "0%", away: "0%" },
        over_11_5: { overall: "0%", home: "0%", away: "0%" },
        over_12_5: { overall: "0%", home: "0%", away: "0%" },
        over_13_5: { overall: "0%", home: "0%", away: "0%" }
      };

      let firstGoalStats: any = {
        scoring_first: { overall: 0, home: 0, away: 0 },
        conceded_first: { overall: 0, home: 0, away: 0 }
      };

      // 4. Parallel Data Fetching
      const [
        liveStatsData,
        aggregationData,
        standings,
        squad,
        topScorers,
        topAssists,
        nextMatchDetail
      ] = await Promise.all([
        // A. Team Stats for the league/season
        requestedLeagueId ? getTeamStatsDirect(liveTeam.id, statsLeagueId, seasonToTry) : Promise.resolve(null),

        // B. Deep Aggregation from recent matches (corners, cards, first goal)
        (async () => {
          const finishedMatches = recentMatches.filter((m: any) =>
            ['FT', 'AET', 'PEN'].includes(m.status) && m.league?.id === statsLeagueId
          ).slice(0, 5);

          if (finishedMatches.length === 0) return null;

          const statsPromises = finishedMatches.map((m: any) => getFixtureStatisticsDirect(m.matchId));
          const eventsPromises = finishedMatches.map((m: any) => getMatchEventsDirect(m.matchId));

          const [matchesStats, matchesEvents] = await Promise.all([
            Promise.all(statsPromises),
            Promise.all(eventsPromises)
          ]);
          return { finishedMatches, matchesStats, matchesEvents };
        })(),

        // C. Standings (with fallback)
        getLeagueStandingsDirect(statsLeagueId, seasonToTry)
          .then(async (res) => {
            if (res && res.length > 0) return res;
            const prevSeasonRes = await getLeagueStandingsDirect(statsLeagueId, seasonToTry - 1).catch(() => []);
            if (prevSeasonRes && prevSeasonRes.length > 0) return prevSeasonRes;
            try {
              let results = await getLeagueFixturesDirect(statsLeagueId, seasonToTry, 'last', 50).catch(() => []);
              if (!results || results.length === 0) {
                results = await getLeagueFixturesDirect(statsLeagueId, seasonToTry - 1, 'last', 50).catch(() => []);
              }
              if (results && results.length > 0) return calculateVirtualStandings(results);
            } catch (err) { }
            return [];
          }).catch(() => []),

        // D. Squad
        getTeamSquadDirect(liveTeam.id).catch(() => []),

        // E. Top Scorers
        getTopScorersDirect(statsLeagueId, seasonToTry)
          .then(res => (res && res.length > 0) ? res : getTopScorersDirect(statsLeagueId, seasonToTry - 1))
          .catch(() => []),

        // F. Top Assists
        getTopAssistsDirect(statsLeagueId, seasonToTry)
          .then(res => (res && res.length > 0) ? res : getTopAssistsDirect(statsLeagueId, seasonToTry - 1))
          .catch(() => []),

        // G. Next Match Detail
        nextMatches[0] ? getFullPredictionDetailDirect(nextMatches[0].matchId).catch(() => null) : Promise.resolve(null)
      ]);

      liveStats = liveStatsData;
      if (liveStats && liveStats.fixtures) {
        const getAvg = (val: any) => parseFloat(val || 0);
        statsSummary = {
          overall: {
            played: liveStats.fixtures.played?.total || 0,
            wins: liveStats.fixtures.wins?.total || 0,
            draws: liveStats.fixtures.draws?.total || 0,
            losses: liveStats.fixtures.loses?.total || 0,
          },
          home: {
            played: liveStats.fixtures.played?.home || 0,
            wins: liveStats.fixtures.wins?.home || 0,
            draws: liveStats.fixtures.draws?.home || 0,
            losses: liveStats.fixtures.loses?.home || 0,
          },
          away: {
            played: liveStats.fixtures.played?.away || 0,
            wins: liveStats.fixtures.wins?.away || 0,
            draws: liveStats.fixtures.draws?.away || 0,
            losses: liveStats.fixtures.loses?.away || 0,
          },
          cleanSheets: liveStats.clean_sheet?.total || 0,
          homeCleanSheets: liveStats.clean_sheet?.home || 0,
          awayCleanSheets: liveStats.clean_sheet?.away || 0,
          bttsRate: liveStats.fixtures.played?.total > 0 && liveStats.btts ? Math.round((liveStats.btts.total / liveStats.fixtures.played.total) * 100) : 0,
          homeBttsRate: liveStats.fixtures.played?.home > 0 && liveStats.btts ? Math.round((liveStats.btts.home / liveStats.fixtures.played.home) * 100) : 0,
          awayBttsRate: liveStats.fixtures.played?.away > 0 && liveStats.btts ? Math.round((liveStats.btts.away / liveStats.fixtures.played.away) * 100) : 0,
          failedToScoreRate: liveStats.fixtures.played?.total > 0 && liveStats.failed_to_score ? Math.round((liveStats.failed_to_score.total / liveStats.fixtures.played.total) * 100) : 0,
          homeFailedToScoreRate: liveStats.fixtures.played?.home > 0 && liveStats.failed_to_score ? Math.round((liveStats.failed_to_score.home / liveStats.fixtures.played.home) * 100) : 0,
          awayFailedToScoreRate: liveStats.fixtures.played?.away > 0 && liveStats.failed_to_score ? Math.round((liveStats.failed_to_score.away / liveStats.fixtures.played.away) * 100) : 0,
          ppg: liveStats.fixtures.played?.total > 0 ? parseFloat((((liveStats.fixtures.wins?.total || 0) * 3 + (liveStats.fixtures.draws?.total || 0)) / liveStats.fixtures.played.total).toFixed(2)) : 0,
          goalsScoredAvg: getAvg(liveStats.goals?.for?.average?.total),
          goalsConcededAvg: getAvg(liveStats.goals?.against?.average?.total),
          cornersAvg: 0,
          cardsAvg: 0,
          cornersForAvg: 0,
          cornersAgainstAvg: 0,
          cardsForAvg: 0,
          cardsAgainstAvg: 0
        };
      }

      // Process Aggregation
      if (aggregationData) {
        const { finishedMatches, matchesStats, matchesEvents } = aggregationData;
        let totals = { overall: 0, home: 0, away: 0 };
        let counts = { overall: 0, home: 0, away: 0 };
        let overs = {
          7.5: { overall: 0, home: 0, away: 0 },
          8.5: { overall: 0, home: 0, away: 0 },
          9.5: { overall: 0, home: 0, away: 0 },
          10.5: { overall: 0, home: 0, away: 0 },
          11.5: { overall: 0, home: 0, away: 0 },
          12.5: { overall: 0, home: 0, away: 0 },
          13.5: { overall: 0, home: 0, away: 0 }
        };

        matchesStats.forEach((matchStat: any, index: number) => {
          const match = finishedMatches[index];
          const isTargetHome = match.homeTeam.id === liveTeam.id;
          const splitKey = isTargetHome ? 'home' : 'away';

          if (matchStat && matchStat.length >= 2) {
            const homeCorners = parseInt(matchStat.find((s: any) => s.team.id === match.homeTeam.id)?.statistics?.find((st: any) => st.type === 'Corner Kicks')?.value || '0', 10);
            const awayCorners = parseInt(matchStat.find((s: any) => s.team.id === match.awayTeam.id)?.statistics?.find((st: any) => st.type === 'Corner Kicks')?.value || '0', 10);
            const totalMatchCorners = homeCorners + awayCorners;
            totals.overall += totalMatchCorners;
            counts.overall++;
            totals[splitKey] += totalMatchCorners;
            counts[splitKey]++;
            [7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5].forEach(threshold => {
              if (totalMatchCorners > threshold) {
                overs[threshold as 7.5].overall++;
                overs[threshold as 7.5][splitKey]++;
              }
            });
          }

          const events = matchesEvents[index];
          if (events && Array.isArray(events)) {
            const firstGoal = events.find((e: any) => e.type === 'Goal');
            if (firstGoal) {
              const scorerTeamId = firstGoal.team?.id;
              if (scorerTeamId === liveTeam.id) {
                firstGoalStats.scoring_first.overall++;
                firstGoalStats.scoring_first[splitKey]++;
              } else {
                firstGoalStats.conceded_first.overall++;
                firstGoalStats.conceded_first[splitKey]++;
              }
            }
          }
        });

        const calcAvg = (sum: number, count: number) => count > 0 ? (sum / count).toFixed(2) : "0.00";
        const calcPct = (matchCount: number, totalCount: number) => totalCount > 0 ? Math.round((matchCount / totalCount) * 100) + "%" : "0%";

        aggregatedCorners = {
          average: {
            overall: calcAvg(totals.overall, counts.overall),
            home: calcAvg(totals.home, counts.home),
            away: calcAvg(totals.away, counts.away)
          },
          over_7_5: {
            overall: calcPct(overs[7.5].overall, counts.overall),
            home: calcPct(overs[7.5].home, counts.home),
            away: calcPct(overs[7.5].away, counts.away)
          },
          over_8_5: {
            overall: calcPct(overs[8.5].overall, counts.overall),
            home: calcPct(overs[8.5].home, counts.home),
            away: calcPct(overs[8.5].away, counts.away)
          },
          over_9_5: {
            overall: calcPct(overs[9.5].overall, counts.overall),
            home: calcPct(overs[9.5].home, counts.home),
            away: calcPct(overs[9.5].away, counts.away)
          },
          over_10_5: {
            overall: calcPct(overs[10.5].overall, counts.overall),
            home: calcPct(overs[10.5].home, counts.home),
            away: calcPct(overs[10.5].away, counts.away)
          },
          over_11_5: {
            overall: calcPct(overs[11.5].overall, counts.overall),
            home: calcPct(overs[11.5].home, counts.home),
            away: calcPct(overs[11.5].away, counts.away)
          },
          over_12_5: {
            overall: calcPct(overs[12.5].overall, counts.overall),
            home: calcPct(overs[12.5].home, counts.home),
            away: calcPct(overs[12.5].away, counts.away)
          },
          over_13_5: {
            overall: calcPct(overs[13.5].overall, counts.overall),
            home: calcPct(overs[13.5].home, counts.home),
            away: calcPct(overs[13.5].away, counts.away)
          }
        };

        statsSummary.cornersAvg = aggregatedCorners.average.overall;

        if (statsSummary.overall.played === 0 && finishedMatches.length > 0) {
          let mTotals = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };
          let hTotals = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };
          let aTotals = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };

          finishedMatches.forEach((match: any) => {
            const isHome = match.homeTeam.id === liveTeam.id;
            const goalsFor = isHome ? match.score.home : match.score.away;
            const goalsAgainst = isHome ? match.score.away : match.score.home;
            mTotals.played++;
            mTotals.gf += goalsFor || 0;
            mTotals.ga += goalsAgainst || 0;
            if (isHome) { hTotals.played++; hTotals.gf += goalsFor || 0; hTotals.ga += goalsAgainst || 0; }
            else { aTotals.played++; aTotals.gf += goalsFor || 0; aTotals.ga += goalsAgainst || 0; }
            if (goalsFor > goalsAgainst) { mTotals.wins++; if (isHome) hTotals.wins++; else aTotals.wins++; }
            else if (goalsFor === goalsAgainst) { mTotals.draws++; if (isHome) hTotals.draws++; else aTotals.draws++; }
            else { mTotals.losses++; if (isHome) hTotals.losses++; else aTotals.losses++; }
          });

          statsSummary.overall = mTotals;
          statsSummary.home = hTotals;
          statsSummary.away = aTotals;
          statsSummary.winRate = Math.round((mTotals.wins / mTotals.played) * 100);
          statsSummary.goalsScoredAvg = parseFloat((mTotals.gf / mTotals.played).toFixed(2));
          statsSummary.goalsConcededAvg = parseFloat((mTotals.ga / mTotals.played).toFixed(2));
        }
      }

      const transformDetailedStats = (raw: any) => {
        if (!raw) return null;
        const getMap = (obj: any) => ({
          overall: obj?.total || 0,
          home: obj?.home || 0,
          away: obj?.away || 0
        });
        const getAvgMap = (obj: any) => ({
          overall: obj?.total || "0.0",
          home: obj?.home || "0.0",
          away: obj?.away || "0.0"
        });

        const getOverUnderMap = (uo: any, type: 'over' | 'under') => {
          const result: any = {};
          if (uo) {
            Object.entries(uo).forEach(([threshold, vals]: [string, any]) => {
              const key = `${type}-${threshold.replace('.', '_')}`;
              result[key] = {
                overall: vals[type] || 0,
                // API-Football aggregate stats don't usually split over/under by home/away in the main object
                // but we can fallback to overall if home/away not specific
                home: vals.home?.[type] || vals[type] || 0,
                away: vals.away?.[type] || vals[type] || 0
              };
            });
          }
          return result;
        };

        const estimateOver = (avg: any, threshold: number) => {
          const a = parseFloat(avg) || 0;
          if (a === 0) return "0%";
          const diff = a - threshold;
          let prob = 0.5 + (diff * 0.12);
          prob = Math.max(0.05, Math.min(0.95, prob));
          return `${Math.round(prob * 100)}%`;
        };

        const getMinuteSum = (minuteObj: any, startInd: number, endInd: number) => {
          if (!minuteObj) return 0;
          const intervals = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90", "91-105", "106-120"];
          let sum = 0;
          for (let i = startInd; i <= endInd; i++) {
            sum += minuteObj[intervals[i]]?.total || 0;
          }
          return sum;
        };

        const cAvg = aggregatedCorners.average;

        return {
          ...raw,
          fixtures: {
            ...raw.fixtures,
            played: getMap(raw.fixtures?.played),
            wins: getMap(raw.fixtures?.wins),
            draws: getMap(raw.fixtures?.draws),
            losses: getMap(raw.fixtures?.loses),
            scoring_first: firstGoalStats.scoring_first,
            conceded_first: firstGoalStats.conceded_first,
          },
          goals: {
            for: {
              total: {
                ...getMap(raw.goals?.for?.total),
                ...getOverUnderMap(raw.goals?.for?.under_over, 'over'),
                ...getOverUnderMap(raw.goals?.for?.under_over, 'under'),
              },
              average: getAvgMap(raw.goals?.for?.average),
            },
            against: {
              total: getMap(raw.goals?.against?.total),
              average: getAvgMap(raw.goals?.against?.average),
            }
          },
          clean_sheet: getMap(raw.clean_sheet),
          failed_to_score: getMap(raw.failed_to_score),
          '1st-half': {
            overall: getMinuteSum(raw.goals?.for?.minute, 0, 2),
            home: Math.round(getMinuteSum(raw.goals?.for?.minute, 0, 2) * 0.55), // Estimated split
            away: Math.round(getMinuteSum(raw.goals?.for?.minute, 0, 2) * 0.45)
          },
          '2nd-half': {
            overall: getMinuteSum(raw.goals?.for?.minute, 3, 7),
            home: Math.round(getMinuteSum(raw.goals?.for?.minute, 3, 7) * 0.55),
            away: Math.round(getMinuteSum(raw.goals?.for?.minute, 3, 7) * 0.45)
          },
          btts: {
            overall: Math.round((raw.fixtures?.played?.total || 1) * 0.52), // Placeholder estimation
            home: Math.round((raw.fixtures?.played?.home || 1) * 0.55),
            away: Math.round((raw.fixtures?.played?.away || 1) * 0.48)
          },
          corners: {
            ...raw.corners,
            average: cAvg,
            over_7_5: aggregatedCorners.over_7_5,
            over_8_5: aggregatedCorners.over_8_5,
            over_9_5: aggregatedCorners.over_9_5,
            over_10_5: aggregatedCorners.over_10_5,
            over_11_5: aggregatedCorners.over_11_5,
            over_12_5: aggregatedCorners.over_12_5,
            over_13_5: aggregatedCorners.over_13_5,
          }
        };
      };

      return {
        team: {
          id: liveTeam.id,
          name: liveTeam.name,
          slug: teamSlug,
          logoUrl: liveTeam.logo,
          country: liveTeam.country,
          venue: liveTeam.venue?.name || 'Unknown Stadium',
          city: liveTeam.venue?.city || 'Unknown City',
        },
        competitions: (competitions || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          logo: c.logo,
          type: c.type,
          country: c.country,
          season: c.season
        })),
        nextMatch: nextMatches[0] || null,
        nextMatchDetail,
        recentMatches: recentMatches || [],
        statsSummary,
        standings: standings || [],
        squad: squad || [],
        topScorers: (topScorers || [])
          .filter((s: any) => s.statistics?.[0]?.team?.id === liveTeam.id)
          .map((s: any) => ({
            ...s,
            // Ensure statistics is an array as expected by the frontend mapping
            statistics: Array.isArray(s.statistics) ? s.statistics : [s.statistics]
          })),
        topAssists: (topAssists || [])
          .filter((s: any) => s.statistics?.[0]?.team?.id === liveTeam.id)
          .map((s: any) => ({
            ...s,
            // Ensure statistics is an array as expected by the frontend mapping
            statistics: Array.isArray(s.statistics) ? s.statistics : [s.statistics]
          })),
        detailedStats: transformDetailedStats(liveStats),
        activeLeagueId: statsLeagueId
      };
    } catch (error) {
      server.log.error(error, 'CRITICAL: Failed in GET /v1/team/:teamSlug');
      return reply.status(500).send({ error: 'Internal server error fetching team details' });
    }
  });

  // GET /v1/team/:teamSlug/:tab
  server.get<{ Params: TeamTabParams }>('/team/:teamSlug/:tab', async (request, reply) => {
    const { teamSlug, tab } = request.params;

    try {
      const liveTeam = await getTeamBySlugDirect(teamSlug);
      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found' });
      }

      let items: any[] = [];

      switch (tab) {
        case 'fixtures':
          items = await getTeamMatchesDirect(liveTeam.id, 'next', 20);
          break;
        case 'results':
          items = await getTeamMatchesDirect(liveTeam.id, 'last', 20);
          break;
        case 'stats':
        case 'corners':
        case 'cards': {
          items = await getTeamMatchesDirect(liveTeam.id, 'last', 20);
          break;
        }
        case 'squads':
        case 'squad':
          items = await getTeamSquadDirect(liveTeam.id);
          break;
        default:
          items = [];
      }

      return {
        team: {
          id: liveTeam.id,
          name: liveTeam.name,
          slug: teamSlug,
          logoUrl: liveTeam.logo,
        },
        tab,
        items,
      };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Internal server error fetching team tab data' });
    }
  });
}
