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
  getFullPredictionDetailDirect
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
  competition?: string;
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
    const { competition } = request.query;
    const requestedLeagueId = competition ? parseInt(competition, 10) : null;

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

      // 2. Fetch Matches in parallel
      const [nextMatches, recentMatches] = await Promise.all([
        getTeamMatchesDirect(liveTeam.id, 'next', 5, requestedLeagueId).catch(() => []),
        getTeamMatchesDirect(liveTeam.id, 'last', 10, requestedLeagueId).catch(() => [])
      ]);

      // 3. Determine the league ID for stats
      let statsLeagueId = requestedLeagueId;
      if (!statsLeagueId) {
        const leagueCounts = new Map<number, number>();
        recentMatches.forEach((m: any) => {
          if (m.league?.id) {
            leagueCounts.set(m.league.id, (leagueCounts.get(m.league.id) || 0) + 1);
          }
        });
        statsLeagueId = [...leagueCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 39;
      }

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

      try {
        if (statsLeagueId) {
          const stats = await getTeamStatsDirect(liveTeam.id, statsLeagueId, new Date().getFullYear());
          if (stats && stats.fixtures) {
            const getAvg = (val: any) => parseFloat(val || 0);

            statsSummary = {
              overall: {
                played: stats.fixtures.played?.total || 0,
                wins: stats.fixtures.wins?.total || 0,
                draws: stats.fixtures.draws?.total || 0,
                losses: stats.fixtures.loses?.total || 0,
              },
              home: {
                played: stats.fixtures.played?.home || 0,
                wins: stats.fixtures.wins?.home || 0,
                draws: stats.fixtures.draws?.home || 0,
                losses: stats.fixtures.loses?.home || 0,
              },
              away: {
                played: stats.fixtures.played?.away || 0,
                wins: stats.fixtures.wins?.away || 0,
                draws: stats.fixtures.draws?.away || 0,
                losses: stats.fixtures.loses?.away || 0,
              },
              cleanSheets: stats.clean_sheet?.total || 0,
              homeCleanSheets: stats.clean_sheet?.home || 0,
              awayCleanSheets: stats.clean_sheet?.away || 0,
              bttsRate: stats.fixtures.played?.total > 0 && stats.btts ? Math.round((stats.btts.total / stats.fixtures.played.total) * 100) : 0,
              homeBttsRate: stats.fixtures.played?.home > 0 && stats.btts ? Math.round((stats.btts.home / stats.fixtures.played.home) * 100) : 0,
              awayBttsRate: stats.fixtures.played?.away > 0 && stats.btts ? Math.round((stats.btts.away / stats.fixtures.played.away) * 100) : 0,
              failedToScoreRate: stats.fixtures.played?.total > 0 && stats.failed_to_score ? Math.round((stats.failed_to_score.total / stats.fixtures.played.total) * 100) : 0,
              homeFailedToScoreRate: stats.fixtures.played?.home > 0 && stats.failed_to_score ? Math.round((stats.failed_to_score.home / stats.fixtures.played.home) * 100) : 0,
              awayFailedToScoreRate: stats.fixtures.played?.away > 0 && stats.failed_to_score ? Math.round((stats.failed_to_score.away / stats.fixtures.played.away) * 100) : 0,
              ppg: stats.fixtures.played?.total > 0 ? parseFloat((((stats.fixtures.wins?.total || 0) * 3 + (stats.fixtures.draws?.total || 0)) / stats.fixtures.played.total).toFixed(2)) : 0,
              goalsScoredAvg: getAvg(stats.goals?.for?.average?.total),
              goalsConcededAvg: getAvg(stats.goals?.against?.average?.total),
              cornersAvg: 9.5,
              cardsAvg: 4.2,
              cornersForAvg: 0,
              cornersAgainstAvg: 0,
              cardsForAvg: 0,
              cardsAgainstAvg: 0
            };
          }
        }
      } catch (err) {
        server.log.warn(`Failed to fetch live team stats for ${liveTeam.id} in league ${statsLeagueId}: ${(err as any).message}`);
      }

      // 5. Fetch Standings, Squad, Top Scorers/Assists, Competitions
      const currentYear = new Date().getFullYear();
      // If we are in early 2026, the current season might be 2025. 
      // If late 2026, it might be 2026.
      // Resilient strategy: Try currentYear, then currentYear-1.
      const seasonToTry = (new Date().getMonth() < 6) ? currentYear - 1 : currentYear;

      const [standings, squad, topScorers, topAssists, detailedStats, competitions] = await Promise.all([
        getLeagueStandingsDirect(statsLeagueId, seasonToTry)
          .then(res => (res && res.length > 0) ? res : getLeagueStandingsDirect(statsLeagueId, seasonToTry - 1))
          .catch((e) => {
            server.log.warn(`Standings fetch failed for ${statsLeagueId} seasons ${seasonToTry}/${seasonToTry - 1}: ${e.message}`);
            return [];
          }),
        getTeamSquadDirect(liveTeam.id).catch((e) => {
          server.log.warn(`Squad fetch failed for ${liveTeam.id}: ${e.message}`);
          return [];
        }),
        getTopScorersDirect(statsLeagueId, seasonToTry).catch(() => []),
        getTopAssistsDirect(statsLeagueId, seasonToTry).catch(() => []),
        getTeamStatsDirect(liveTeam.id, statsLeagueId, seasonToTry).catch(() => null),
        getTeamLeaguesDirect(liveTeam.id).catch(() => [])
      ]);

      // 6. Fetch Next Match Detail if exists for comparison section
      let nextMatchDetail = null;
      if (nextMatches[0]) {
        try {
          nextMatchDetail = await getFullPredictionDetailDirect(nextMatches[0].matchId);
        } catch (err) {
          server.log.warn(`Failed to fetch next match detail: ${(err as any).message}`);
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

        const cAvg = getAvgMap(raw.corners?.for?.average);

        return {
          ...raw,
          fixtures: {
            ...raw.fixtures,
            played: getMap(raw.fixtures?.played),
            wins: getMap(raw.fixtures?.wins),
            draws: getMap(raw.fixtures?.draws),
            losses: getMap(raw.fixtures?.loses),
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
            over_7_5: { overall: estimateOver(cAvg.overall, 7.5), home: estimateOver(cAvg.home, 7.5), away: estimateOver(cAvg.away, 7.5) },
            over_8_5: { overall: estimateOver(cAvg.overall, 8.5), home: estimateOver(cAvg.home, 8.5), away: estimateOver(cAvg.away, 8.5) },
            over_9_5: { overall: estimateOver(cAvg.overall, 9.5), home: estimateOver(cAvg.home, 9.5), away: estimateOver(cAvg.away, 9.5) },
            over_10_5: { overall: estimateOver(cAvg.overall, 10.5), home: estimateOver(cAvg.home, 10.5), away: estimateOver(cAvg.away, 10.5) },
            over_11_5: { overall: estimateOver(cAvg.overall, 11.5), home: estimateOver(cAvg.home, 11.5), away: estimateOver(cAvg.away, 11.5) },
            over_12_5: { overall: estimateOver(cAvg.overall, 12.5), home: estimateOver(cAvg.home, 12.5), away: estimateOver(cAvg.away, 12.5) },
            over_13_5: { overall: estimateOver(cAvg.overall, 13.5), home: estimateOver(cAvg.home, 13.5), away: estimateOver(cAvg.away, 13.5) },
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
          logo: c.logo
        })),
        nextMatch: nextMatches[0] || null,
        nextMatchDetail,
        recentMatches: recentMatches || [],
        statsSummary,
        standings: standings || [],
        squad: squad || [],
        topScorers: topScorers || [],
        topAssists: topAssists || [],
        detailedStats: transformDetailedStats(detailedStats),
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

