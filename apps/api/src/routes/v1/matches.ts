import { FastifyInstance } from 'fastify';
import { getLiveMatchesDirect, getTodayOddsDirect, getPredictionsDirect } from '../../lib/sports';

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
    const { date, leagueId, market, minOdds, page = '1', pageSize = '5' } = request.query;

    // Default to today if no date provided
    const targetDate = date || new Date().toISOString().split('T')[0];

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    try {
      // 1. Fetch matches for the date from live API
      const allMatches = await getLiveMatchesDirect(targetDate);

      // 2. Fetch odds if filtering by market or minOdds
      let allOdds: unknown[] = [];
      if (market || minOdds) {
        allOdds = await getTodayOddsDirect(targetDate);
      }

      // 3. Filter in-memory
      let filteredMatches = allMatches;

      if (leagueId) {
        filteredMatches = filteredMatches.filter((m) => m.league?.id === parseInt(leagueId, 10));
      }

      if (market || minOdds) {
        filteredMatches = filteredMatches.filter((m) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const matchOdds = (allOdds as any[]).find((o) => o.matchId === m.matchId);
          if (!matchOdds) return false;

          // Simple market mapping for live data
          const marketMap: Record<string, string> = {
            '1X2': 'Match Winner',
            'Double Chance': 'Double Chance',
            'Both Teams to Score': 'Both Teams Score',
            'Over 2.5': 'Goals Over/Under',
            'Under 2.5': 'Goals Over/Under',
          };

          const providerMarketName = marketMap[market || ''] || 'Match Winner';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oddsForMarket = (matchOdds as any).bookmakers?.[0]?.markets?.find((mk: any) => mk.name === providerMarketName);

          if (!oddsForMarket) return false;

          if (minOdds) {
            const minOddsVal = parseFloat(minOdds.replace('>', '').replace('<', ''));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (oddsForMarket as any).values?.some((v: any) => v.odd >= minOddsVal);
          }

          return true;
        });
      }

      const total = filteredMatches.length;
      const paginatedMatches = filteredMatches.slice(offset, offset + pageSizeNum);

      // Fetch predictions for the paginated matches
      const paginatedMatchesWithPredictions = await Promise.all(paginatedMatches.map(async (m) => {
        try {
          const realPred = await getPredictionsDirect(m.matchId);
          if (realPred) {
            return {
              ...m,
              featuredTip: {
                id: m.matchId,
                title: realPred.selection || 'Expert Pick',
                isPremium: false,
                confidence: realPred.probabilities?.home ? parseInt(realPred.probabilities.home) : null
              }
            };
          }
        } catch (err) {
          console.warn(`Failed to fetch prediction for match ${m.matchId}`);
        }
        return m;
      }));

      return {
        date: targetDate,
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        matches: paginatedMatchesWithPredictions,
      };
    } catch (err) {
      console.error('Failed to fetch live today matches:', (err as Error).message);
      // Fallback to empty if everything fails
      return {
        date: targetDate,
        page: pageNum,
        pageSize: pageSizeNum,
        total: 0,
        matches: [],
      };
    }
  });

  // GET /v1/tips/featured
  server.get<{ Querystring: FeaturedTipsQuery }>('/tips/featured', async (request) => {
    const { date } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    try {
      // 1. Fetch today's matches
      const allMatches = await getLiveMatchesDirect(targetDate);

      // 2. Take top 5 matches (e.g., first 5 from the list)
      const topMatches = allMatches.slice(0, 5);

      // 3. Fetch predictions for each in parallel
      const tips = await Promise.all(topMatches.map(async (m) => {
        try {
          const prediction = await getPredictionsDirect(m.matchId);
          if (!prediction) return null;

          return {
            id: m.matchId,
            matchId: m.matchId,
            title: prediction.advice || `Prediction: ${prediction.selection}`,
            shortReason: prediction.advice,
            isPremium: Math.random() > 0.7, // Randomly mark some as premium
            publishedAt: new Date().toISOString(),
            kickoffAt: m.kickoffAt,
            league: {
              name: m.league.name,
              slug: m.league.slug,
              countryName: m.league.country?.name,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              countryCode: (m.league.country as any)?.code,
            },
            homeTeam: {
              name: m.homeTeam.name,
              logoUrl: m.homeTeam.logoUrl,
            },
            awayTeam: {
              name: m.awayTeam.name,
              logoUrl: m.awayTeam.logoUrl,
            },
            selection: prediction.selection,
          };
        } catch {
          return null;
        }
      }));

      return {
        date: targetDate,
        tips: tips.filter(t => t !== null).slice(0, 3), // Return top 3 valid tips
      };
    } catch (err) {
      console.error('Failed to fetch live featured tips:', (err as Error).message);
      return {
        date: targetDate,
        tips: [],
      };
    }
  });
}

