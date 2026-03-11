import { FastifyInstance } from 'fastify';
import { getPool } from '../../db/pool';
import { getLiveMatchesDirect, getPredictionsDirect, getFullPredictionDetailDirect } from '../../lib/sports';

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Safe hybrid fetcher: tries provider first, then DB
async function getHybridMatches(targetDate: string): Promise<{ matches: unknown[], total: number }> {
    let matches: unknown[] = [];
    let total = 0;

    // 1. Try Live Provider
    try {
        const liveMatches = await getLiveMatchesDirect(targetDate);
        if (liveMatches && liveMatches.length > 0) {
            return { matches: liveMatches, total: liveMatches.length };
        }
    } catch (err) {
        console.warn(`Live provider failed for ${targetDate}:`, (err as Error).message);
    }

    // 2. Fallback to DB
    try {
        const pool = getPool();
        if (pool) {
            const client = await pool.connect();
            try {
                const params = [targetDate];
                const whereClause = "WHERE DATE(m.kickoff_at) = $1";

                const countRes = await client.query(
                    `SELECT COUNT(*) FROM matches m JOIN leagues l ON m.league_id = l.id ${whereClause}`,
                    params
                );
                total = parseInt(countRes.rows[0].count, 10);

                if (total > 0) {
                    const matchesRes = await client.query(
                        `SELECT 
                            m.provider_fixture_id as "matchId", m.kickoff_at as "kickoffAt", m.status, m.elapsed,
                            m.home_goals as "homeScore", m.away_goals as "awayScore",
                            l.provider_league_id as "leagueId", l.name as "leagueName", l.logo_url as "leagueLogo", l.type as "leagueType",
                            c.name as "countryName", c.code as "countryCode", c.flag_url as "countryFlag",
                            ht.name as "homeTeamName", ht.logo_url as "homeTeamLogo",
                            at.name as "awayTeamName", at.logo_url as "awayTeamLogo"
                        FROM matches m
                        JOIN leagues l ON m.league_id = l.id
                        JOIN countries c ON l.country_id = c.id
                        JOIN teams ht ON m.home_team_id = ht.id
                        JOIN teams at ON m.away_team_id = at.id
                        ${whereClause}
                        ORDER BY m.kickoff_at ASC`,
                        params
                    );

                    matches = matchesRes.rows.map(row => ({
                        matchId: row.matchId,
                        providerFixtureId: row.matchId,
                        kickoffAt: row.kickoffAt,
                        status: row.status,
                        elapsed: row.elapsed,
                        league: {
                            id: row.leagueId,
                            name: row.leagueName,
                            slug: slugify(row.leagueName),
                            logoUrl: row.leagueLogo,
                            type: row.leagueType,
                            country: { name: row.countryName, code: row.countryCode, flagUrl: row.countryFlag }
                        },
                        homeTeam: {
                            name: row.homeTeamName,
                            slug: slugify(row.homeTeamName),
                            logoUrl: row.homeTeamLogo
                        },
                        awayTeam: {
                            name: row.awayTeamName,
                            slug: slugify(row.awayTeamName),
                            logoUrl: row.awayTeamLogo
                        },
                        score: { home: row.homeScore, away: row.awayScore }
                    }));
                }
            } finally {
                client.release();
            }
        }
    } catch (dbErr) {
        console.warn(`DB fallback failed for ${targetDate}:`, (dbErr as Error).message);
    }

    return { matches, total };
}

export async function liveRoutes(server: FastifyInstance) {
    // GET /v1/live/matches
    server.get<{ Querystring: { date?: string; page?: string; pageSize?: string; leagueId?: string; market?: string; minOdds?: string } }>('/live/matches', async (request) => {
        const { date, page = '1', pageSize = '20', leagueId } = request.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
        const offset = (pageNum - 1) * pageSizeNum;

        const { matches } = await getHybridMatches(targetDate);

        let filteredMatches = matches;

        // 1. Filter by League
        if (leagueId) {
            const leagueIdNum = parseInt(leagueId, 10);
            filteredMatches = filteredMatches.filter(m => (m as any).league?.id === leagueIdNum);
        }

        // 2. Filter by Market (Placeholder logic for now as provider data varies)
        // In a real scenario, we would check if the match has odds for this market.

        // 3. Filter by Odds
        // Placeholder: Odds filtering for live provider data is complex as it requires extra API calls.
        // For now, we align the params but filtering might only be effective for DB-sourced matches.

        const pagedMatches = filteredMatches.slice(offset, offset + pageSizeNum);

        // Fetch predictions for the paginated matches
        const pagedMatchesWithPredictions = await Promise.all(pagedMatches.map(async (m) => {
            try {
                const realPred = await getPredictionsDirect((m as any).matchId);
                if (realPred) {
                    return {
                        ...(m as object),
                        featuredTip: {
                            id: (m as any).matchId,
                            title: realPred.selection || 'Expert Pick',
                            isPremium: false,
                            confidence: realPred.probabilities?.home ? parseInt(realPred.probabilities.home) : null
                        }
                    };
                }
            } catch (err) {
                console.warn(`Failed to fetch prediction for match ${(m as any).matchId}`);
            }
            return m;
        }));

        return {
            date: targetDate,
            page: pageNum,
            pageSize: pageSizeNum,
            total: filteredMatches.length,
            matches: pagedMatchesWithPredictions,
        };
    });

    // GET /v1/live/leagues
    server.get<{ Querystring: { date?: string; page?: string; pageSize?: string } }>('/live/leagues', async (request) => {
        const { date, page = '1', pageSize = '50' } = request.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10)));
        const offset = (pageNum - 1) * pageSizeNum;

        const { matches } = await getHybridMatches(targetDate);

        // Group by country
        const countryGroups: Record<string, { country: any, leagues: Map<number, any> }> = {};

        matches.forEach((mItem) => {
            const m = mItem as any;
            const cName = m.league.country.name || 'International';
            if (!countryGroups[cName]) {
                countryGroups[cName] = {
                    country: {
                        name: cName,
                        code: m.league.country.code || 'UN',
                        flagUrl: m.league.country.flagUrl
                    },
                    leagues: new Map()
                };
            }

            if (!countryGroups[cName].leagues.has(m.league.id)) {
                countryGroups[cName].leagues.set(m.league.id, {
                    id: m.league.id,
                    name: m.league.name,
                    slug: m.league.slug,
                    logoUrl: m.league.logoUrl,
                    type: m.league.type
                });
            }
        });

        const items = Object.values(countryGroups).map(group => ({
            country: group.country,
            leagues: Array.from(group.leagues.values())
        }));

        return {
            page: pageNum,
            pageSize: pageSizeNum,
            total: items.length,
            items: items.slice(offset, offset + pageSizeNum),
        };
    });

    server.get<{ Querystring: { date?: string; page?: string; pageSize?: string } }>('/live/predictions', async (request) => {
        const { date, page = '1', pageSize = '20' } = request.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
        const offset = (pageNum - 1) * pageSizeNum;

        try {
            const { matches } = await getHybridMatches(targetDate);

            // Paginate matches before fetching predictions to save API calls
            const pagedMatches = matches.slice(offset, offset + pageSizeNum);

            const predictionPromises = pagedMatches.map(async (mItem) => {
                const m = mItem as any;
                try {
                    const realPred = await getPredictionsDirect(m.matchId);
                    if (realPred) {
                        return {
                            ...m,
                            selection: realPred.selection,
                            advice: realPred.advice,
                            probability: realPred.probabilities.home,
                            confidence: 'High',
                            shortExplanation: realPred.advice ? realPred.advice.slice(0, 100) + '...' : 'Live analysis available.'
                        };
                    }
                } catch (err) {
                    console.warn(`Failed to fetch real prediction for match ${m.matchId}`);
                }

                // Fallback clearly marked as live trend
                return {
                    ...m,
                    selection: m.score.home >= m.score.away ? 'Home Win (Trend)' : 'Away Win (Trend)',
                    probability: '50%+',
                    confidence: 'Low',
                    shortExplanation: 'Live trend analysis based on current match status.'
                };
            });

            const items = await Promise.all(predictionPromises);

            return {
                items,
                total: matches.length,
                page: pageNum,
                pageSize: pageSizeNum
            };
        } catch (error) {
            console.error('Failed to fetch live predictions:', error);
            return { items: [], total: 0, page: pageNum, pageSize: pageSizeNum };
        }
    });

    server.get<{ Querystring: { date?: string } }>('/live/streams', async (request) => {
        const { date } = request.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const { matches } = await getHybridMatches(targetDate);
        const liveStreams = matches.filter((m: any) => m.status === '1H' || m.status === '2H' || m.status === 'HT').map((m: any) => ({
            matchId: m.matchId,
            kickoffAt: m.kickoffAt,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            league: m.league,
            status: 'LIVE'
        }));

        return { items: liveStreams, total: liveStreams.length };
    });

    // GET /v1/live/match/:matchId
    server.get<{ Params: { matchId: string } }>('/live/match/:matchId', async (request, reply) => {
        const { matchId } = request.params;
        let fixtureId = parseInt(matchId, 10);

        if (isNaN(fixtureId)) {
            // Try to resolve slug to ID via DB
            try {
                const pool = getPool();
                if (pool) {
                    const client = await pool.connect();
                    try {
                        // Simple slug resolution: split by '-' and try to match team names or slugs
                        // matchId might be "home-away"
                        const parts = matchId.split('-');
                        if (parts.length >= 2) {
                            const res = await client.query(
                                `SELECT m.provider_fixture_id 
                                 FROM matches m
                                 JOIN teams ht ON m.home_team_id = ht.id
                                 JOIN teams at ON m.away_team_id = at.id
                                 WHERE (ht.slug ILIKE $1 AND at.slug ILIKE $2)
                                    OR (ht.name ILIKE $3 AND at.name ILIKE $4)
                                 LIMIT 1`,
                                [`%${parts[0]}%`, `%${parts[parts.length - 1]}%`, `%${parts[0]}%`, `%${parts[parts.length - 1]}%`]
                            );
                            if (res.rows.length > 0) {
                                fixtureId = res.rows[0].provider_fixture_id;
                            }
                        }
                    } finally {
                        client.release();
                    }
                }
            } catch (err) {
                console.warn(`Failed to resolve slug ${matchId}:`, err);
            }
        }

        if (isNaN(fixtureId)) {
            return reply.status(400).send({ error: 'Invalid matchId or slug could not be resolved' });
        }

        try {
            // Priority: Live Direct Data
            const liveDetail = await getFullPredictionDetailDirect(fixtureId);
            if (liveDetail) {
                return liveDetail;
            }

            // Fallback: Original DB Logic
            // Since this file represents the "Live" router, we primarily serve provider data.
            // If provider fails, we redirect or call the internal DB helper.
            // For now, let's just return a placeholder or 404 if provider has nothing live.
            return reply.status(404).send({ error: 'Live data not available for this match' });
        } catch (err) {
            console.error(`Live match detail failed for ${matchId}:`, (err as Error).message);
            return reply.status(500).send({ error: 'Internal server error fetching live match' });
        }
    });
}
