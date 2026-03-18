/**
 * Direct API-Football Client for Backend Proxy
 */

import {
    ApiProviderResponse,
    ApiFixtureResponse,
    ApiPredictionResponse,
    ApiLeagueStandings,
    ApiLeagueRecord,
    ApiStanding,
    ApiStandingStats
} from './provider-types';

const API_FOOTBALL_KEY = process.env.SPORTS_PROVIDER_API_KEY;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_FOOTBALL_BASE_URL: any = 'https://v3.football.api-sports.io';

const providerCache = new Map<string, { data: unknown, timestamp: number }>();
export { providerCache };
const PROVIDER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchFromSportsProvider<T = unknown>(endpoint: string): Promise<T> {
    if (!API_FOOTBALL_KEY) {
        throw new Error('SPORTS_PROVIDER_API_KEY is not configured');
    }

    const cacheKey = endpoint;
    const cached = providerCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < PROVIDER_CACHE_TTL)) {
        return cached.data as T;
    }

    const url = `${API_FOOTBALL_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-apisports-key': API_FOOTBALL_KEY,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Sports Provider API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as T;
    providerCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
}

function generateTeamSlug(id: number, name: string) {
    const cleanName = name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
    return `${id}-${cleanName}`;
}

/**
 * Fetch matches for a specific date and transform them for the UI
 */
export async function getLiveMatchesDirect(date: string) {
    const data: ApiProviderResponse<ApiFixtureResponse> = await fetchFromSportsProvider(`/fixtures?date=${date}`);
    if (!data.response) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.response.map((item) => mapMatch(item.fixture as any, item.league as any, item.teams as any, item));
}

/**
 * Fetch odds for all matches on a specific date
 */
export async function getTodayOddsDirect(date: string) {
    const data: ApiProviderResponse<{
        fixture: { id: number };
        bookmakers: {
            id: number;
            name: string;
            markets: {
                id: number;
                name: string;
                values: { value: string; odd: string }[];
            }[];
        }[];
    }> = await fetchFromSportsProvider(`/odds?date=${date}`);

    if (!data.response) return [];

    return data.response.map((item) => ({
        matchId: item.fixture.id,
        bookmakers: item.bookmakers.map((bm) => ({
            id: bm.id,
            name: bm.name,
            markets: bm.markets.map((m) => ({
                id: m.id,
                name: m.name,
                values: m.values.map((v) => ({
                    value: v.value,
                    odd: v.odd
                }))
            }))
        }))
    }));
}

export async function getFixtureDetailDirect(fixtureId: number) {
    const data: ApiProviderResponse<ApiFixtureResponse> = await fetchFromSportsProvider(`/fixtures?id=${fixtureId}`);

    if (!data.response || data.response.length === 0) return null;

    const item = data.response[0];
    return {
        matchId: item.fixture.id,
        providerFixtureId: item.fixture.id,
        kickoffAt: item.fixture.date,
        status: item.fixture.status.short,
        elapsed: item.fixture.status.elapsed,
        league: {
            id: item.league.id,
            name: item.league.name,
            slug: item.league.name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: item.league.logo,
            country: {
                name: item.league.country || '',
                flagUrl: item.league.flag || ''
            }
        },
        homeTeam: {
            id: item.teams.home.id,
            name: item.teams.home.name,
            logoUrl: item.teams.home.logo
        },
        awayTeam: {
            id: item.teams.away.id,
            name: item.teams.away.name,
            logoUrl: item.teams.away.logo
        },
        score: {
            home: item.goals.home,
            away: item.goals.away
        }
    };
}

/**
 * Fetch predictions for a specific fixture
 */
export async function getPredictionsDirect(fixtureId: number) {
    const data: ApiProviderResponse<ApiPredictionResponse> = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);

    if (!data.response || data.response.length === 0) return null;

    const prediction = data.response[0].predictions;

    return {
        matchId: fixtureId,
        selection: prediction.winner.name || 'N/A',
        advice: prediction.advice || 'No specific advice available.',
        probabilities: {
            home: prediction.percent.home,
            draw: prediction.percent.draw,
            away: prediction.percent.away
        },
        goals: {
            home: prediction.goals.home,
            away: prediction.goals.away
        },
        comparison: data.response[0].comparison || {}
    };
}

/**
 * Fetch events for a specific fixture
 */
export async function getMatchEventsDirect(fixtureId: number) {
    try {
        const data = await fetchFromSportsProvider<ApiProviderResponse<unknown>>(`/fixtures/events?fixture=${fixtureId}`);
        return data.response || [];
    } catch (err) {
        console.warn(`Failed to fetch events for fixture ${fixtureId}:`, (err as Error).message);
        return [];
    }
}

export async function getFixtureStatisticsDirect(fixtureId: number) {
    try {
        const data = await fetchFromSportsProvider<ApiProviderResponse<unknown>>(`/fixtures/statistics?fixture=${fixtureId}`);
        return data.response || [];
    } catch (err) {
        console.warn(`Failed to fetch statistics for fixture ${fixtureId}:`, (err as Error).message);
        return [];
    }
}

/**
 * Fetch full prediction detail (stats, h2h, predictions) for a fixture
 */
export async function getFullPredictionDetailDirect(fixtureId: number) {
    let predictionData: ApiProviderResponse<ApiPredictionResponse | unknown> | null = null;
    try {
        predictionData = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);
    } catch (err) {
        console.warn(`Failed to fetch predictions for fixture ${fixtureId}:`, (err as Error).message);
    }

    const res = predictionData?.response?.[0] as ApiPredictionResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fixture = (res as any)?.fixture;
    let league = res?.league;
    let teams = res?.teams;
    const predictions = res?.predictions;
    const comparison = res?.comparison;
    const h2h = res?.h2h || [];

    // If fixture info is missing from predictions (some plans/endpoints), fetch it explicitly
    if (!fixture || !teams) {
        const fixtureDetail = await getFixtureDetailDirect(fixtureId);
        if (fixtureDetail) {
            fixture = fixtureDetail;
            league = league || fixtureDetail.league;
            teams = teams || {
                home: fixtureDetail.homeTeam,
                away: fixtureDetail.awayTeam
            };
        }
    }

    if (!fixture) {
        fixture = {
            id: fixtureId,
            date: new Date().toISOString(),
            status: { short: 'NS', elapsed: 0 }
        };
    }

    // Helper to map team stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapTeamStats = (side: 'home' | 'away', allMatches: any[] = []) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const team = (teams as any)?.[side];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leagueStats = (team as any)?.league;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const teamId = Number(team?.id || (side === 'home' ? (fixture as any)?.homeTeam?.id : (fixture as any)?.awayTeam?.id) || 0);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapDetail = (node: any, split: 'total' | 'home' | 'away' = 'total') => ({
            played: node?.fixtures?.played?.[split] || 0,
            wins: node?.fixtures?.wins?.[split] || 0,
            draws: node?.fixtures?.draws?.[split] || 0,
            losses: node?.fixtures?.loses?.[split] || 0,
            scored: node?.goals?.for?.total?.[split] || 0,
            conceded: node?.goals?.against?.total?.[split] || 0,
            ppg: (node?.fixtures?.played?.[split] || 0) > 0 ?
                parseFloat((((node?.fixtures?.wins?.[split] || 0) * 3 + (node?.fixtures?.draws?.[split] || 0)) / node.fixtures.played[split]).toFixed(2)) : 0,
            winRate: (node?.fixtures?.played?.[split] || 0) > 0 ? Math.round(((node?.fixtures?.wins?.[split] || 0) / node.fixtures.played[split]) * 100) : 0,
            scoredAvg: parseFloat(node?.goals?.for?.average?.[split] || '0'),
            concededAvg: parseFloat(node?.goals?.against?.average?.[split] || '0'),
            cleanSheets: node?.clean_sheet?.[split] || 0,
            failedToScore: node?.failed_to_score?.[split] || 0,
            btts: 0,
            bttsRate: 0,
            cleanSheetRate: (node?.fixtures?.played?.[split] || 0) > 0 ? Math.round(((node?.clean_sheet?.[split] || 0) / node.fixtures.played[split]) * 100) : 0,
            failedToScoreRate: (node?.fixtures?.played?.[split] || 0) > 0 ? Math.round(((node?.failed_to_score?.[split] || 0) / node.fixtures.played[split]) * 100) : 0,
            over05Rate: 0,
            over15Rate: 0,
            over25Rate: 0,
            over35Rate: 0,
            over45Rate: 0,
            over55Rate: 0,
        });

        const getFormFromMatches = (matches: unknown[], limit: number = 5) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (matches || []).slice(0, limit).map((m: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const homeTeamId = Number((m as any).homeTeam?.id);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const awayTeamId = Number((m as any).awayTeam?.id);
                const isHome = homeTeamId === teamId;
                const isAway = awayTeamId === teamId;
                const scoreHome = m.score?.home ?? m.goals?.home;
                const scoreAway = m.score?.away ?? m.goals?.away;

                if (scoreHome === undefined || scoreAway === undefined || scoreHome === null || scoreAway === null) return '-';
                if (scoreHome === scoreAway) return 'D';

                if (isHome) {
                    return scoreHome > scoreAway ? 'W' : 'L';
                } else if (isAway) {
                    return scoreAway > scoreHome ? 'W' : 'L';
                }

                return '-';
            });
        };

        // Helper to calculate OVER X.5 given an array of matches
        const calculateOverRates = (matches: unknown[]) => {
            if (!matches || matches.length === 0) {
                return {
                    over05Rate: 0,
                    over15Rate: 0,
                    over25Rate: 0,
                    over35Rate: 0,
                    over45Rate: 0,
                    over55Rate: 0
                };
            }

            const rates = {
                over05: 0, over15: 0, over25: 0, over35: 0, over45: 0, over55: 0
            };

            let validMatches = 0;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            matches.forEach((m: any) => {
                if (m.score && typeof m.score.home === 'number' && typeof m.score.away === 'number') {
                    const totalGoals = m.score.home + m.score.away;
                    validMatches++;

                    if (totalGoals > 0.5) rates.over05++;
                    if (totalGoals > 1.5) rates.over15++;
                    if (totalGoals > 2.5) rates.over25++;
                    if (totalGoals > 3.5) rates.over35++;
                    if (totalGoals > 4.5) rates.over45++;
                    if (totalGoals > 5.5) rates.over55++;
                }
            });

            if (validMatches === 0) {
                return {
                    over05Rate: 0,
                    over15Rate: 0,
                    over25Rate: 0,
                    over35Rate: 0,
                    over45Rate: 0,
                    over55Rate: 0
                };
            }

            return {
                over05Rate: Math.round((rates.over05 / validMatches) * 100),
                over15Rate: Math.round((rates.over15 / validMatches) * 100),
                over25Rate: Math.round((rates.over25 / validMatches) * 100),
                over35Rate: Math.round((rates.over35 / validMatches) * 100),
                over45Rate: Math.round((rates.over45 / validMatches) * 100),
                over55Rate: Math.round((rates.over55 / validMatches) * 100),
            };
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const homeMatches = allMatches.filter(m => Number((m as any).homeTeam?.id) === teamId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const awayMatches = allMatches.filter(m => Number((m as any).awayTeam?.id) === teamId);

        return {
            overall: { ...mapDetail(leagueStats, 'total'), ...calculateOverRates(allMatches) },
            home: { ...mapDetail(leagueStats, 'home'), ...calculateOverRates(homeMatches) },
            away: { ...mapDetail(leagueStats, 'away'), ...calculateOverRates(awayMatches) },
            last5: getFormFromMatches(allMatches),
            last5Home: getFormFromMatches(homeMatches),
            last5Away: getFormFromMatches(awayMatches),
            recentMatchesDetailed: allMatches.slice(0, 5)
        };
    };

    // Fetch recent matches for both teams (fetch more to allow splits)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const homeId = (teams as any)?.home?.id || (fixture as any)?.homeTeam?.id || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const awayId = (teams as any)?.away?.id || (fixture as any)?.awayTeam?.id || 0;

    const [homeRecent, awayRecent, events, homeNext, matchStats] = await Promise.all([
        homeId ? getTeamMatchesDirect(homeId, 'last', 20) : Promise.resolve([]),
        awayId ? getTeamMatchesDirect(awayId, 'last', 20) : Promise.resolve([]),
        getMatchEventsDirect(fixtureId),
        homeId ? getTeamMatchesDirect(homeId, 'next', 10) : Promise.resolve([]),
        getFixtureStatisticsDirect(fixtureId)
    ]);

    // Map matches and stats
    const stats = {
        home: mapTeamStats('home', homeRecent),
        away: mapTeamStats('away', awayRecent),
        comparison: comparison || {}
    };

    // Map predictions to array
    const mappedPredictions = predictions ? [
        {
            matchId: fixture?.id || fixtureId,
            selection: predictions?.winner?.name || 'N/A',
            probability: predictions?.percent?.home ? parseInt(predictions.percent.home) : 0,
            confidence: 0.85,
            shortReason: predictions?.advice || 'Analysis coming soon...'
        }
    ] : [];

    // Map H2H matches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedH2H = ((h2h || []) as any[]).map((h: any) => ({
        id: h?.fixture?.id,
        date: h?.fixture?.date,
        competition: h?.league?.name,
        homeTeam: { id: h?.teams?.home?.id, name: h?.teams?.home?.name, logoUrl: h?.teams?.home?.logo },
        awayTeam: { id: h?.teams?.away?.id, name: h?.teams?.away?.name, logoUrl: h?.teams?.away?.logo },
        homeScore: h?.goals?.home,
        awayScore: h?.goals?.away
    }));

    // Calculate H2H Summary
    const h2hSummary = {
        total: mappedH2H.length,
        homeTeam: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            wins: mappedH2H.filter((m: any) => (m.homeTeam.id === homeId && m.homeScore! > m.awayScore!) || (m.awayTeam.id === homeId && m.awayScore! > m.homeScore!)).length,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cleanSheets: mappedH2H.filter((m: any) => (m.homeTeam.id === homeId && m.awayScore === 0) || (m.awayTeam.id === homeId && m.homeScore === 0)).length
        },
        awayTeam: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            wins: mappedH2H.filter((m: any) => (m.homeTeam.id === awayId && m.homeScore! > m.awayScore!) || (m.awayTeam.id === awayId && m.awayScore! > m.homeScore!)).length,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cleanSheets: mappedH2H.filter((m: any) => (m.homeTeam.id === awayId && m.awayScore === 0) || (m.awayTeam.id === awayId && m.homeScore === 0)).length
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        draws: mappedH2H.filter((m: any) => m.homeScore === m.awayScore).length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        btts: mappedH2H.filter((m: any) => m.homeScore! > 0 && m.awayScore! > 0).length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        over05: mappedH2H.filter((m: any) => (m.homeScore! + m.awayScore!) > 0.5).length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        over15: mappedH2H.filter((m: any) => (m.homeScore! + m.awayScore!) > 1.5).length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        over25: mappedH2H.filter((m: any) => (m.homeScore! + m.awayScore!) > 2.5).length,
    };

    // Fetch standings
    const leagueId = league?.id || fixture?.league?.id || 0;
    const season = league?.season || new Date().getFullYear();
    const standings = leagueId ? await getLeagueStandingsDirect(leagueId, season) : [];

    // Identify next and prev matches (from Home Team's perspective)
    let prevMatchDetails = null;
    let nextMatchDetails = null;

    if (homeRecent.length > 0) {
        // homeRecent is usually ordered descending (newest past match first). 
        // We'll just take the most recent 'past' match as prev match,
        // UNLESS the current match itself is somehow in that array, then we'd pick the one right after it.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentMatchIndex = homeRecent.findIndex((m: any) => m.matchId === fixtureId);
        if (currentMatchIndex !== -1 && currentMatchIndex + 1 < homeRecent.length) {
            const pMatch = homeRecent[currentMatchIndex + 1];
            prevMatchDetails = { matchId: pMatch.matchId, homeTeam: { logoUrl: pMatch.homeTeam.logoUrl }, awayTeam: { logoUrl: pMatch.awayTeam.logoUrl } };
        } else if (currentMatchIndex === -1) {
            // Not in array, take the 0th element (most recent)
            const pMatch = homeRecent[0];
            prevMatchDetails = { matchId: pMatch.matchId, homeTeam: { logoUrl: pMatch.homeTeam.logoUrl }, awayTeam: { logoUrl: pMatch.awayTeam.logoUrl } };
        }
    }

    if (homeNext && homeNext.length > 0) {
        // homeNext is usually ordered ascending (soonest next match first).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentMatchIndex = homeNext.findIndex((m: any) => m.matchId === fixtureId);
        if (currentMatchIndex !== -1 && currentMatchIndex + 1 < homeNext.length) {
            const nMatch = homeNext[currentMatchIndex + 1];
            nextMatchDetails = { matchId: nMatch.matchId, homeTeam: { logoUrl: nMatch.homeTeam.logoUrl }, awayTeam: { logoUrl: nMatch.awayTeam.logoUrl } };
        } else if (currentMatchIndex === -1) {
            // Not in array, take the 0th element
            const nMatch = homeNext[0];
            nextMatchDetails = { matchId: nMatch.matchId, homeTeam: { logoUrl: nMatch.homeTeam.logoUrl }, awayTeam: { logoUrl: nMatch.awayTeam.logoUrl } };
        }
    }

    return {
        match: mapMatch(fixture, league, teams, res),
        prevMatch: prevMatchDetails,
        nextMatch: nextMatchDetails,
        stats,
        events,
        matchStats,
        predictions: mappedPredictions,
        h2h: mappedH2H,
        h2hSummary,
        standings: standings.length > 0 ? standings : null
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapMatch(fixture: any, league: any, teams: any, res: any) {
    const fId = (fixture?.id || fixture?.matchId) as number;
    const fixtureStatus = (fixture?.status as Record<string, unknown>) || {};
    const statusStr = (fixtureStatus?.short as string) || (typeof fixture?.status === 'string' ? fixture.status : 'NS');
    const elapsedVal = (fixtureStatus?.elapsed as number) || (fixture?.elapsed as number) || 0;
    const kickoff = (fixture?.date || fixture?.kickoffAt || new Date().toISOString()) as string;

    const fixtureLeague = (fixture?.league as Record<string, unknown>) || {};
    const fixtureHome = (fixture?.homeTeam as Record<string, unknown>) || {};
    const fixtureAway = (fixture?.awayTeam as Record<string, unknown>) || {};

    return {
        matchId: fId,
        providerFixtureId: fId,
        kickoffAt: kickoff,
        status: statusStr,
        elapsed: elapsedVal,
        league: {
            id: (league?.id || fixtureLeague?.id || 0) as number,
            name: (league?.name || fixtureLeague?.name || 'Unknown League') as string,
            slug: ((league?.name || fixtureLeague?.name || 'unknown-league') as string).toLowerCase().replace(/\s+/g, '-'),
            logoUrl: (league?.logo || (league as Record<string, unknown>)?.logo || fixtureLeague?.logo || '') as string,
            season: (league?.season || (league as Record<string, unknown>)?.season || fixtureLeague?.season) as number,
            country: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name: ((league as Record<string, unknown>)?.country as any)?.name || league?.country || fixtureLeague?.country || '',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code: ((league as Record<string, unknown>)?.country as any)?.code || null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                flagUrl: ((league as Record<string, unknown>)?.country as any)?.flag || league?.flag || fixtureLeague?.flag || ''
            }
        },
        homeTeam: {
            id: ((teams?.home as Record<string, unknown>)?.id || fixtureHome?.id || 0) as number,
            name: ((teams?.home as Record<string, unknown>)?.name || fixtureHome?.name || 'Home Team') as string,
            logoUrl: ((teams?.home as Record<string, unknown>)?.logo || fixtureHome?.logoUrl || '') as string
        },
        awayTeam: {
            id: ((teams?.away as Record<string, unknown>)?.id || fixtureAway?.id || 0) as number,
            name: ((teams?.away as Record<string, unknown>)?.name || fixtureAway?.name || 'Away Team') as string,
            logoUrl: ((teams?.away as Record<string, unknown>)?.logo || fixtureAway?.logoUrl || '') as string
        },
        score: {
            home: (res?.goals as Record<string, unknown>)?.home ?? ((res?.score as Record<string, unknown>)?.fulltime as Record<string, unknown>)?.home ?? ((fixture?.score as Record<string, unknown>)?.home) ?? (statusStr === 'NS' ? null : 0),
            away: (res?.goals as Record<string, unknown>)?.away ?? ((res?.score as Record<string, unknown>)?.fulltime as Record<string, unknown>)?.away ?? ((fixture?.score as Record<string, unknown>)?.away) ?? (statusStr === 'NS' ? null : 0)
        }
    };
}

let leaguesCache: ApiLeagueRecord[] | null = null;
let lastLeaguesFetch = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getLeaguesDirect() {
    const now = Date.now();
    if (leaguesCache && (now - lastLeaguesFetch < CACHE_TTL)) {
        return leaguesCache;
    }

    try {
        const data: ApiProviderResponse<ApiLeagueRecord> = await fetchFromSportsProvider('/leagues');
        if (data.response) {
            leaguesCache = data.response;
            lastLeaguesFetch = now;
            return leaguesCache;
        }
    } catch (err) {
        console.error('Failed to fetch leagues from provider:', (err as Error).message);
    }

    return leaguesCache || [];
}

export async function getLeaguesBySearchDirect(search: string) {
    try {
        const data: ApiProviderResponse<ApiLeagueRecord> = await fetchFromSportsProvider(`/leagues?search=${encodeURIComponent(search)}`);
        return data.response || [];
    } catch (err) {
        console.error('Failed to search leagues from provider:', (err as Error).message);
        return [];
    }
}

export async function getLeagueStandingsDirect(leagueId: number, season: number) {
    try {
        const data: ApiProviderResponse<ApiLeagueStandings> = await fetchFromSportsProvider(`/standings?league=${leagueId}&season=${season}`);

        if (!data.response || data.response.length === 0) {
            throw new Error(`No standings found for league ${leagueId} in season ${season}`);
        }

        const league = data.response[0].league;
        // Flatten standings groups (e.g., Group A, Group B, or just one league table)
        const allStandings = league.standings.flat();

        // Map basic standings
        const mappedRows = allStandings.map((item: ApiStanding) => {
            const mapSplit = (split: ApiStandingStats | undefined) => ({
                played: split?.played || 0,
                wins: split?.win || 0,
                draws: split?.draw || 0,
                losses: split?.lose || 0,
                gf: split?.goals?.for || 0,
                ga: split?.goals?.against || 0,
                gd: item?.goalsDiff || 0,
                points: item?.points || 0,
                ppg: (split?.played || 0) > 0 ? parseFloat((item.points / split!.played).toFixed(2)) : 0,
                avgScored: (split?.played || 0) > 0 ? parseFloat(((split?.goals?.for || 0) / split!.played).toFixed(2)) : 0,
                avgConceded: (split?.played || 0) > 0 ? parseFloat(((split?.goals?.against || 0) / split!.played).toFixed(2)) : 0
            });

            return {
                rank: item?.rank || 0,
                group: item?.group || 'League',
                team: {
                    id: item?.team?.id || 0,
                    name: item?.team?.name || 'Unknown',
                    slug: generateTeamSlug(item?.team?.id || 0, item?.team?.name || 'unknown'),
                    logoUrl: item?.team?.logo || ''
                },
                overall: mapSplit(item?.all),
                home: mapSplit(item?.home),
                away: mapSplit(item?.away),
                form: item?.form ? item.form.split('') : []
            };
        });

        // Enrichment: Fetch all finished fixtures for this league once to aggregate stats
        try {
            let allFixturesData: ApiProviderResponse<ApiFixtureResponse> = await fetchFromSportsProvider(`/fixtures?league=${leagueId}&season=${season}&status=FT`);
            let allFixtures = allFixturesData.response || [];

            // Fallback: some leagues use different statuses, try without status filter if empty
            if (allFixtures.length === 0) {
                console.log(`[Standings] No FT fixtures for league ${leagueId} season ${season}, trying without status filter`);
                allFixturesData = await fetchFromSportsProvider<ApiProviderResponse<ApiFixtureResponse>>(`/fixtures?league=${leagueId}&season=${season}&last=50`);
                allFixtures = allFixturesData.response || [];
                // Filter only completed fixtures
                allFixtures = allFixtures.filter((f) => {
                    const status = f.fixture?.status?.short;
                    return ['FT', 'AET', 'PEN', 'AWD'].includes(status || '');
                });
            }

            console.log(`[Standings] League ${leagueId} season ${season}: ${allFixtures.length} fixtures loaded`);

            // Group fixtures by team
            const teamFixturesMap = new Map<number, ApiFixtureResponse[]>();
            allFixtures.forEach((f) => {
                const hId = f.teams.home.id;
                const aId = f.teams.away.id;
                if (!teamFixturesMap.has(hId)) teamFixturesMap.set(hId, []);
                if (!teamFixturesMap.has(aId)) teamFixturesMap.set(aId, []);
                teamFixturesMap.get(hId)!.push(f);
                teamFixturesMap.get(aId)!.push(f);
            });

            // Reusable calculation helpers
            const createHalf = () => ({ played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0, ppg: 0 });
            const createCS = () => ({ count: 0, percentage: 0 });
            const createOU = () => ({
                over05: { count: 0, percentage: 0 }, under05: { count: 0, percentage: 0 },
                over15: { count: 0, percentage: 0 }, under15: { count: 0, percentage: 0 },
                over25: { count: 0, percentage: 0 }, under25: { count: 0, percentage: 0 },
                over35: { count: 0, percentage: 0 }, under35: { count: 0, percentage: 0 },
                over45: { count: 0, percentage: 0 }, under45: { count: 0, percentage: 0 },
                over55: { count: 0, percentage: 0 }, under55: { count: 0, percentage: 0 }
            });
            const createBtts = () => ({ count: 0, percentage: 0 });
            const createScoringFirst = () => ({ count: 0, percentage: 0 });
            const createConcedingFirst = () => ({ count: 0, percentage: 0 });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateHalf = (split: Record<string, any>, gf: number, ga: number) => {
                split.played++; split.gf += gf; split.ga += ga; split.gd += (gf - ga);
                if (gf > ga) { split.wins++; split.points += 3; }
                else if (gf === ga) { split.draws++; split.points += 1; }
                else { split.losses++; }
                split.ppg = parseFloat((split.points / split.played).toFixed(2));
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateOUThreshold = (split: Record<string, any>, played: number, goals: number) => {
                if (goals > 0.5) split.over05.count++; split.over05.percentage = Math.round((split.over05.count / played) * 100);
                if (goals > 1.5) split.over15.count++; split.over15.percentage = Math.round((split.over15.count / played) * 100);
                if (goals > 2.5) split.over25.count++; split.over25.percentage = Math.round((split.over25.count / played) * 100);
                if (goals > 3.5) split.over35.count++; split.over35.percentage = Math.round((split.over35.count / played) * 100);
                if (goals > 4.5) split.over45.count++; split.over45.percentage = Math.round((split.over45.count / played) * 100);
                if (goals > 5.5) split.over55.count++; split.over55.percentage = Math.round((split.over55.count / played) * 100);

                split.under05.count = played - split.over05.count; split.under05.percentage = 100 - split.over05.percentage;
                split.under15.count = played - split.over15.count; split.under15.percentage = 100 - split.over15.percentage;
                split.under25.count = played - split.over25.count; split.under25.percentage = 100 - split.over25.percentage;
                split.under35.count = played - split.over35.count; split.under35.percentage = 100 - split.over35.percentage;
                split.under45.count = played - split.over45.count; split.under45.percentage = 100 - split.over45.percentage;
                split.under55.count = played - split.over55.count; split.under55.percentage = 100 - split.over55.percentage;
            };

            const enrichedRows = mappedRows.map((row) => {
                const teamFixtures = teamFixturesMap.get(row.team.id) || [];
                if (teamFixtures.length === 0) return row;

                const stats = {
                    overall: { firstHalf: createHalf(), secondHalf: createHalf(), cleanSheets: createCS(), overUnder: createOU(), btts: createBtts(), scoringFirst: createScoringFirst(), concedingFirst: createConcedingFirst() },
                    home: { firstHalf: createHalf(), secondHalf: createHalf(), cleanSheets: createCS(), overUnder: createOU(), btts: createBtts(), scoringFirst: createScoringFirst(), concedingFirst: createConcedingFirst() },
                    away: { firstHalf: createHalf(), secondHalf: createHalf(), cleanSheets: createCS(), overUnder: createOU(), btts: createBtts(), scoringFirst: createScoringFirst(), concedingFirst: createConcedingFirst() }
                };

                let homeMatches = 0; let awayMatches = 0;

                teamFixtures.forEach((f) => {
                    const isHome = f.teams.home.id === row.team.id;
                    const splitKey = isHome ? 'home' : 'away';
                    if (isHome) homeMatches++; else awayMatches++;
                    const matchesPlayed = isHome ? homeMatches : awayMatches;
                    const totalPlayed = homeMatches + awayMatches;

                    const htHome = f.score?.halftime?.home ?? 0;
                    const htAway = f.score?.halftime?.away ?? 0;
                    const ftHome = f.score?.fulltime?.home ?? f.goals?.home ?? 0;
                    const ftAway = f.score?.fulltime?.away ?? f.goals?.away ?? 0;

                    const shHome = ftHome - htHome;
                    const shAway = ftAway - htAway;

                    const teamHt = isHome ? htHome : htAway; const oppHt = isHome ? htAway : htHome;
                    const teamSh = isHome ? shHome : shAway; const oppSh = isHome ? shAway : shHome;
                    const teamFt = isHome ? ftHome : ftAway; const oppFt = isHome ? ftAway : ftHome;
                    const totalGoals = ftHome + ftAway;

                    updateHalf(stats.overall.firstHalf, teamHt, oppHt); updateHalf(stats[splitKey].firstHalf, teamHt, oppHt);
                    updateHalf(stats.overall.secondHalf, teamSh, oppSh); updateHalf(stats[splitKey].secondHalf, teamSh, oppSh);

                    if (oppFt === 0) { stats.overall.cleanSheets.count++; stats[splitKey].cleanSheets.count++; }
                    stats.overall.cleanSheets.percentage = Math.round((stats.overall.cleanSheets.count / totalPlayed) * 100);
                    stats[splitKey].cleanSheets.percentage = Math.round((stats[splitKey].cleanSheets.count / matchesPlayed) * 100);

                    updateOUThreshold(stats.overall.overUnder, totalPlayed, totalGoals);
                    updateOUThreshold(stats[splitKey].overUnder, matchesPlayed, totalGoals);

                    if (teamFt > 0 && oppFt > 0) { stats.overall.btts.count++; stats[splitKey].btts.count++; }
                    stats.overall.btts.percentage = Math.round((stats.overall.btts.count / totalPlayed) * 100);
                    stats[splitKey].btts.percentage = Math.round((stats[splitKey].btts.count / matchesPlayed) * 100);

                    // Scoring First (using events if already present)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const goalsFirst = (f as any).events
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? (f as any).events.find((e: any) => e.type === 'Goal' && !e.detail.includes('Missed'))
                        : null;

                    if (goalsFirst && goalsFirst.team) {
                        if (goalsFirst.team.id === row.team.id) {
                            stats.overall.scoringFirst.count++; stats[splitKey].scoringFirst.count++;
                        } else {
                            stats.overall.concedingFirst.count++; stats[splitKey].concedingFirst.count++;
                        }
                        stats.overall.scoringFirst.percentage = Math.round((stats.overall.scoringFirst.count / totalPlayed) * 100);
                        stats[splitKey].scoringFirst.percentage = Math.round((stats[splitKey].scoringFirst.count / matchesPlayed) * 100);
                        stats.overall.concedingFirst.percentage = Math.round((stats.overall.concedingFirst.count / totalPlayed) * 100);
                        stats[splitKey].concedingFirst.percentage = Math.round((stats[splitKey].concedingFirst.count / matchesPlayed) * 100);
                    }
                });

                return {
                    ...row,
                    overall: { ...row.overall, ...stats.overall },
                    home: { ...row.home, ...stats.home },
                    away: { ...row.away, ...stats.away }
                };
            });

            // --- Corner stats via /fixtures/statistics ---
            // This endpoint has Corner Kicks data for top-tier leagues only (Premier League, La Liga, etc.)
            // For leagues without coverage, no corners field is set; frontend shows N/A.

            const MAX_FIXTURES = 30;
            const recentFixtures = [...allFixtures]
                .sort((a, b) => b.fixture.timestamp - a.fixture.timestamp)
                .slice(0, MAX_FIXTURES);

            const teamStatsMap = new Map<number, { corners: { overall: number[]; home: number[]; away: number[] }; cards: { overall: number[]; home: number[]; away: number[] } }>();
            const initStatsEntry = () => ({
                corners: { overall: [] as number[], home: [] as number[], away: [] as number[] },
                cards: { overall: [] as number[], home: [] as number[], away: [] as number[] }
            });
            const processFixtureStats = (sd: ApiProviderResponse<{ team: { id: number }; statistics: { type: string, value: string | number | null }[] }>, fixture: { teams?: { home?: { id: number }, away?: { id: number } } }) => {
                const teamsData = sd?.response || [];
                // For cards/match, we need data from both teams for the same match to get TOTAL cards in that match
                let matchTotalCards = 0;
                let cardsFoundForMatch = false;

                teamsData.forEach((te) => {
                    const teamId = te?.team?.id;
                    if (!teamId) return;
                    if (!teamStatsMap.has(teamId)) teamStatsMap.set(teamId, initStatsEntry());
                    const entry = teamStatsMap.get(teamId)!;

                    // Corner Kicks
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const cornerStat = (te?.statistics || []).find((s: any) => s.type === 'Corner Kicks');
                    const cornerVal = cornerStat?.value ?? null;
                    if (cornerVal !== null) {
                        const n = typeof cornerVal === 'string' ? parseInt(cornerVal, 10) : (cornerVal as number);
                        if (!isNaN(n)) {
                            entry.corners.overall.push(n);
                            if (fixture.teams?.home?.id === teamId) entry.corners.home.push(n); else entry.corners.away.push(n);
                        }
                    }

                    // Card Stats (Yellow and Red)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const yellowStat = (te?.statistics || []).find((s: any) => s.type === 'Yellow Cards');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const redStat = (te?.statistics || []).find((s: any) => s.type === 'Red Cards');

                    const y = yellowStat?.value ?? 0;
                    const r = redStat?.value ?? 0;

                    const yn = typeof y === 'string' ? parseInt(y as string, 10) : (y as number || 0);
                    const rn = typeof r === 'string' ? parseInt(r as string, 10) : (r as number || 0);

                    if (yellowStat || redStat) {
                        cardsFoundForMatch = true;
                        matchTotalCards += (yn + rn);
                    }
                });

                // If cards were found, we attribute the total match cards to both teams to calculate "Over X.5 cards in matches involving Team Y"
                if (cardsFoundForMatch) {
                    teamsData.forEach((te) => {
                        const teamId = te?.team?.id;
                        if (!teamId) return;
                        const entry = teamStatsMap.get(teamId)!;
                        entry.cards.overall.push(matchTotalCards);
                        if (fixture.teams?.home?.id === teamId) entry.cards.home.push(matchTotalCards); else entry.cards.away.push(matchTotalCards);
                    });
                }
            };

            // Probe first 5 fixtures to detect coverage, then fetch the rest if covered
            let hasCoverage = false;
            if (recentFixtures.length > 0) {
                await Promise.all(recentFixtures.slice(0, 5).map(async (fixture) => {
                    const fId = fixture.fixture?.id;
                    if (!fId) return;
                    try {
                        const sd = await fetchFromSportsProvider<ApiProviderResponse<{ team: { id: number }; statistics: { type: string, value: string | number | null }[] }>>(`/fixtures/statistics?fixture=${fId}`);
                        const sizeBefore = teamStatsMap.size;
                        processFixtureStats(sd, fixture);
                        if (teamStatsMap.size > sizeBefore) hasCoverage = true;
                    } catch (_) {
                        // Ignore error
                    }
                }));
            }

            if (hasCoverage && recentFixtures.length > 5) {
                const FIX_BATCH = 5;
                for (let bi = 5; bi < recentFixtures.length; bi += FIX_BATCH) {
                    await Promise.all(recentFixtures.slice(bi, bi + FIX_BATCH).map(async (fixture) => {
                        const fId = fixture.fixture?.id;
                        if (!fId) return;
                        try {
                            const sd = await fetchFromSportsProvider<ApiProviderResponse<{ team: { id: number }; statistics: { type: string, value: string | number | null }[] }>>(`/fixtures/statistics?fixture=${fId}`);
                            processFixtureStats(sd, fixture);
                        } catch (_) {
                            // Ignore error
                        }
                    }));
                }
            }

            // Build corner stats from match counts (Tier 1)
            const computeCornerStats = (counts: number[]) => {
                if (counts.length === 0) return null;
                const avg = parseFloat((counts.reduce((s, v) => s + v, 0) / counts.length).toFixed(2));
                const overPct = (t: number) => Math.round((counts.filter(v => v > t).length / counts.length) * 100);
                return {
                    average: avg, over75: overPct(7.5), over85: overPct(8.5), over95: overPct(9.5),
                    over105: overPct(10.5), over115: overPct(11.5), over125: overPct(12.5), over135: overPct(13.5)
                };
            };

            const computeCardStats = (counts: number[]) => {
                if (counts.length === 0) return null;
                const avg = parseFloat((counts.reduce((s, v) => s + v, 0) / counts.length).toFixed(2));
                const overPct = (t: number) => Math.round((counts.filter(v => v > t).length / counts.length) * 100);
                return {
                    average: avg,
                    over35: overPct(3.5),
                    over45: overPct(4.5),
                    over55: overPct(5.5)
                };
            };

            // Merge corner and card stats into final rows
            const finalRows = enrichedRows.map((row) => {
                const entry = teamStatsMap.get(row.team.id);
                if (entry) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const enriched: Record<string, any> = { ...row };
                    if (entry.corners.overall.length > 0) {
                        enriched.overall = { ...enriched.overall, corners: computeCornerStats(entry.corners.overall) };
                        enriched.home = { ...enriched.home, corners: computeCornerStats(entry.corners.home) };
                        enriched.away = { ...enriched.away, corners: computeCornerStats(entry.corners.away) };
                    }
                    if (entry.cards.overall.length > 0) {
                        enriched.overall = { ...enriched.overall, cards: computeCardStats(entry.cards.overall) };
                        enriched.home = { ...enriched.home, cards: computeCardStats(entry.cards.home) };
                        enriched.away = { ...enriched.away, cards: computeCardStats(entry.cards.away) };
                    }
                    return enriched;
                }

                // Fallback to cached corner stats if available
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cs = (row as any).__cornerStats;
                if (cs) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const cleanRow = { ...row } as Record<string, any>;
                    delete cleanRow.__cornerStats;
                    return {
                        ...cleanRow,
                        overall: { ...cleanRow.overall, corners: cs.overall },
                        home: { ...cleanRow.home, corners: cs.home },
                        away: { ...cleanRow.away, corners: cs.away }
                    };
                }
                return row;
            });

            return finalRows;
        } catch (err) {
            console.warn('Enrichment failed:', err);
            return mappedRows;
        }
    } catch (err) {
        console.warn(`Failed to fetch standings for league ${leagueId}:`, (err as Error).message);
        return []; // Return empty array instead of throwing to prevent page crash
    }
}

/**
 * Calculate "Virtual Standings" from a list of fixture results.
 * Useful when the official API standings are missing for a cup or tournament.
 */
export function calculateVirtualStandings(fixtures: ApiFixtureResponse[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teams: Record<number, any> = {};

    const getOrCreateTeam = (teamData: { id: number; name: string; logo?: string; logoUrl?: string }) => {
        if (!teams[teamData.id]) {
            teams[teamData.id] = {
                team: {
                    id: teamData.id,
                    name: teamData.name,
                    slug: generateTeamSlug(teamData.id, teamData.name),
                    logoUrl: teamData.logo || teamData.logoUrl
                },
                overall: { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0, ppg: 0, avgScored: 0, avgConceded: 0 },
                home: { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0, ppg: 0, avgScored: 0, avgConceded: 0 },
                away: { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0, ppg: 0, avgScored: 0, avgConceded: 0 },
                form: []
            };
        }
        return teams[teamData.id];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fixtures.forEach((f: any) => {
        // Support both raw API format and mapped match format
        const status = f.status || f.fixture?.status?.short;
        if (!['FT', 'AET', 'PEN'].includes(status)) return;

        const homeData = f.homeTeam || f.teams?.home;
        const awayData = f.awayTeam || f.teams?.away;
        if (!homeData || !awayData) return;

        const home = getOrCreateTeam(homeData);
        const away = getOrCreateTeam(awayData);

        const hGoals = f.score?.home ?? f.goals?.home ?? 0;
        const aGoals = f.score?.away ?? f.goals?.away ?? 0;

        // Update Overall
        home.overall.played++;
        home.overall.gf += hGoals;
        home.overall.ga += aGoals;
        home.overall.gd = home.overall.gf - home.overall.ga;

        away.overall.played++;
        away.overall.gf += aGoals;
        away.overall.ga += hGoals;
        away.overall.gd = away.overall.gf - away.overall.ga;

        // Update Home/Away splits
        home.home.played++;
        home.home.gf += hGoals;
        home.home.ga += aGoals;
        home.home.gd = home.home.gf - home.home.ga;

        away.away.played++;
        away.away.gf += aGoals;
        away.away.ga += hGoals;
        away.away.gd = away.away.gf - away.away.ga;

        if (hGoals > aGoals) {
            home.overall.wins++;
            home.overall.points += 3;
            home.home.wins++;
            home.home.points += 3;
            home.form.push('W');

            away.overall.losses++;
            away.away.losses++;
            away.form.push('L');
        } else if (hGoals < aGoals) {
            away.overall.wins++;
            away.overall.points += 3;
            away.away.wins++;
            away.away.points += 3;
            away.form.push('W');

            home.overall.losses++;
            home.home.losses++;
            home.form.push('L');
        } else {
            home.overall.draws++;
            home.overall.points += 1;
            home.home.draws++;
            home.home.points += 1;
            home.form.push('D');

            away.overall.draws++;
            away.overall.points += 1;
            away.away.draws++;
            away.away.points += 1;
            away.form.push('D');
        }
    });

    // Final calculations (PPG and Avg) and Ranking
    const result = Object.values(teams).map((t) => {
        t.form = t.form.slice(-5); // Keep last 5 results for form
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const finalize = (stats: any) => {
            if (stats.played > 0) {
                stats.ppg = parseFloat((stats.points / stats.played).toFixed(2));
                stats.avgScored = parseFloat((stats.gf / stats.played).toFixed(2));
                stats.avgConceded = parseFloat((stats.ga / stats.played).toFixed(2));
            }
        };
        finalize(t.overall);
        finalize(t.home);
        finalize(t.away);
        return {
            ...t,
            group: 'League' // Default group name
        };
    });

    // Sort by Points, then Goal Difference, then Goals For
    return result.sort((a, b) => {
        if (b.overall.points !== a.overall.points) return b.overall.points - a.overall.points;
        if (b.overall.gd !== a.overall.gd) return b.overall.gd - a.overall.gd;
        return b.overall.gf - a.overall.gf;
    }).map((t, index) => ({
        ...t,
        rank: index + 1
    }));
}


//     return {
//         overall: getEmptyTeamStatsDetail(),
//         home: getEmptyTeamStatsDetail(),
//         away: getEmptyTeamStatsDetail(),
//         last5: [],
//         last5Home: [],
//         last5Away: [],
//         recentMatchesDetailed: []
//     };
// }

export async function getLeagueFixturesDirect(leagueId: number, season: number, type: 'next' | 'last' = 'next', count: number = 10) {
    const data: ApiProviderResponse<ApiFixtureResponse> = await fetchFromSportsProvider(`/fixtures?league=${leagueId}&season=${season}&${type}=${count}`);
    if (!data.response) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.response.map((item: any) => mapMatch(item.fixture, item.league, item.teams, item));
}

export async function getTopScorersDirect(leagueId: number, season: number) {
    const data: ApiProviderResponse<{
        player: { id: number; name: string; photo: string; nationality: string; age: number };
        statistics: unknown[];
    }> = await fetchFromSportsProvider(`/players/topscorers?league=${leagueId}&season=${season}`);
    if (!data.response || data.response.length === 0) return [];
    return data.response.map((item) => ({
        player: {
            id: item.player?.id,
            name: item.player?.name,
            photo: item.player?.photo,
            nationality: item.player?.nationality,
            age: item.player?.age
        },
        statistics: item.statistics || []
    }));
}

export async function getTopAssistsDirect(leagueId: number, season: number) {
    const data: ApiProviderResponse<{
        player: { id: number; name: string; photo: string; nationality: string; age: number };
        statistics: unknown[];
    }> = await fetchFromSportsProvider(`/players/topassists?league=${leagueId}&season=${season}`);
    if (!data.response || data.response.length === 0) return [];
    return data.response.map((item) => ({
        player: {
            id: item.player?.id,
            name: item.player?.name,
            photo: item.player?.photo,
            nationality: item.player?.nationality,
            age: item.player?.age
        },
        statistics: item.statistics || []
    }));
}

export async function getTeamByIdDirect(id: number) {
    try {
        const data = await fetchFromSportsProvider<ApiProviderResponse<{ team: { id: number, name: string, logo: string, country?: string }, venue?: { country?: string } }>>(`/teams?id=${id}`);
        if (data.response && data.response.length > 0) {
            const item = data.response[0];

            return {
                id: item.team.id,
                name: item.team.name,
                logo: item.team.logo,
                country: item.team.country || item.venue?.country || 'Unknown',
                venue: item.venue,
                leagues: [],
                leagueId: undefined
            };
        }
    } catch (err) {
        console.warn(`Fetch by ID failed for ${id}:`, (err as Error).message);
    }

    return null;
}

export async function getTeamBySlugDirect(slug: string) {
    // Try direct Live Search for the team
    const searchTerm = slug.replace(/-/g, ' ');
    try {
        const data = await fetchFromSportsProvider<ApiProviderResponse<{ team: { id: number, name: string, logo: string, country?: string }, venue?: { country?: string } }>>(`/teams?search=${encodeURIComponent(searchTerm)}`);
        if (data.response && data.response.length > 0) {
            // Priority matching: Exact name match first, then closest match
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exactMatch = data.response.find((r: any) =>
                r.team.name.toLowerCase() === searchTerm.toLowerCase()
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item = exactMatch || data.response.find((r: any) =>
                r.team.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) || data.response[0];

            return {
                id: item.team.id,
                name: item.team.name,
                logo: item.team.logo,
                country: item.team.country || item.venue?.country || 'Unknown',
                venue: item.venue,
                leagues: [],
                leagueId: undefined
            };
        }
    } catch (err) {
        console.warn(`Live search failed for ${slug}:`, (err as Error).message);
    }

    return null;
}

export async function getTeamStatsDirect(teamId: number, leagueId: number, season: number) {
    try {
        const data = await fetchFromSportsProvider<ApiProviderResponse<unknown>>(`/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`);
        if (data.response && !Array.isArray(data.response) && Object.keys(data.response).length > 0) return data.response;
        if (Array.isArray(data.response) && data.response.length > 0) return data.response[0];
    } catch (err) {
        console.warn(`Failed to fetch stats for team ${teamId}:`, (err as Error).message);
    }

    return null;
}

export async function getTeamMatchesDirect(teamId: number, type: 'next' | 'last' = 'next', count: number = 5, leagueId?: number | null, season?: number | null) {
    try {
        let endpoint = `/fixtures?team=${teamId}&${type}=${count}`;
        if (leagueId) {
            endpoint += `&league=${leagueId}`;
        }
        if (season) {
            endpoint += `&season=${season}`;
        }
        const data = await fetchFromSportsProvider<ApiProviderResponse<ApiFixtureResponse>>(endpoint);
        if (data.response && data.response.length > 0) {
            return data.response.map((item) => mapMatch(item.fixture, item.league, item.teams, item));
        }
    } catch (err) {
        console.warn(`Failed to fetch ${type} matches for team ${teamId}:`, (err as Error).message);
    }

    return [];
}


export async function getTeamSquadDirect(teamId: number) {
    try {
        const data: ApiProviderResponse<{ players: { id: number, name: string, age: number, number: number, position: string, photo: string }[] }> = await fetchFromSportsProvider(`/players/squads?team=${teamId}`);
        if (data.response && data.response.length > 0) {
            return data.response[0].players.map((p) => ({
                id: p.id,
                name: p.name,
                age: p.age,
                number: p.number,
                position: p.position,
                photo: p.photo
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch squad for team ${teamId}:`, (err as Error).message);
    }

    return [];
}

const workingSeasonsCache = new Map<number, number>();

export async function getTeamsByLeagueDirect(leagueId: number, season?: number) {
    try {
        let activeSeason = season || workingSeasonsCache.get(leagueId);

        if (activeSeason === undefined) {
            const leagues = await getLeaguesDirect() || [];
            const league = leagues.find((l) => l.league.id === leagueId);
            activeSeason = (league?.seasons?.find((s) => s.current)?.year || new Date().getFullYear()) as number;
        }

        // Try primary season
        let data: ApiProviderResponse<unknown> = await fetchFromSportsProvider(`/teams?league=${leagueId}&season=${activeSeason}`);

        // Defensive: If 0 teams and we haven't tried the previous season yet, try (activeSeason - 1)
        if ((!data.response || data.response.length === 0) && !season) {
            const prevSeason = (activeSeason as number) - 1;
            console.log(`No teams for ${leagueId} in ${activeSeason}, trying ${prevSeason}...`);
            const fallbackData = await fetchFromSportsProvider<ApiProviderResponse<unknown>>(`/teams?league=${leagueId}&season=${prevSeason}`);

            if (fallbackData.response && fallbackData.response.length > 0) {
                activeSeason = prevSeason;
                data = fallbackData;
            }
        }

        if (data.response && data.response.length > 0) {
            workingSeasonsCache.set(leagueId, activeSeason as number);
            return (data.response as { team: { id: number, name: string, logo: string, country?: string }, venue?: { country?: string } }[]).map((item) => ({
                id: item.team.id,
                name: item.team.name,
                slug: generateTeamSlug(item.team.id, item.team.name),
                logoUrl: item.team.logo,
                country: item.team.country || item.venue?.country || 'Unknown'
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch teams for league ${leagueId}:`, (err as Error).message);
    }
    return [];
}

export async function getPopularTeamsDirect(ids: number[]) {
    try {
        const idBatch = ids.join('-');
        const data: ApiProviderResponse<{ team: { id: number, name: string, logo: string, country?: string }, venue?: { country?: string } }> = await fetchFromSportsProvider(`/teams?id=${idBatch}`);
        if (data.response && data.response.length > 0) {
            return data.response.map((item) => ({
                id: item.team.id,
                name: item.team.name,
                slug: generateTeamSlug(item.team.id, item.team.name),
                logoUrl: item.team.logo,
                country: item.team.country || item.venue?.country || 'Unknown'
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch popular teams:`, (err as Error).message);
    }
    return [];
}

export async function getTeamLeaguesDirect(teamId: number) {
    try {
        const data: ApiProviderResponse<ApiLeagueRecord> = await fetchFromSportsProvider(`/leagues?team=${teamId}`);
        if (data.response) {
            return data.response
                .filter((item) => item.seasons.some((s) => s.current)) // Only active leagues
                .map((item) => ({
                    id: item.league.id,
                    name: item.league.name,
                    logo: item.league.logo,
                    type: item.league.type,
                    country: item.country.name,
                    season: item.seasons.find((s) => s.current)?.year
                }));
        }
    } catch (err) {
        console.warn(`Failed to fetch leagues for team ${teamId}:`, (err as Error).message);
    }
    return [];
}
