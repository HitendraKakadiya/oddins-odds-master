/**
 * Direct API-Football Client for Backend Proxy
 */

const API_FOOTBALL_KEY = process.env.SPORTS_PROVIDER_API_KEY;
const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';

export async function fetchFromSportsProvider(endpoint: string) {
    if (!API_FOOTBALL_KEY) {
        throw new Error('SPORTS_PROVIDER_API_KEY is not configured');
    }

    const response = await fetch(`${API_FOOTBALL_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'x-apisports-key': API_FOOTBALL_KEY,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Sports Provider API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Fetch matches for a specific date and transform them for the UI
 */
export async function getLiveMatchesDirect(date: string) {
    const data: any = await fetchFromSportsProvider(`/fixtures?date=${date}`);

    if (!data.response) return [];

    return data.response.map((item: any) => ({
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
                name: item.league.country,
                flagUrl: item.league.flag
            }
        },
        homeTeam: {
            id: item.teams.home.id,
            name: item.teams.home.name,
            slug: item.teams.home.name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: item.teams.home.logo
        },
        awayTeam: {
            id: item.teams.away.id,
            name: item.teams.away.name,
            slug: item.teams.away.name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: item.teams.away.logo
        },
        score: {
            home: item.goals.home,
            away: item.goals.away
        }
    }));
}

export async function getFixtureDetailDirect(fixtureId: number) {
    const data: any = await fetchFromSportsProvider(`/fixtures?id=${fixtureId}`);

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
                name: item.league.country,
                flagUrl: item.league.flag
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
    const data: any = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);

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
 * Fetch full prediction detail (stats, h2h, predictions) for a fixture
 */
export async function getFullPredictionDetailDirect(fixtureId: number) {
    let predictionData: any = null;
    let fixture: any = null;
    try {
        predictionData = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);
    } catch (err) {
        console.warn(`Failed to fetch predictions for fixture ${fixtureId}:`, (err as any).message);
    }
    if (!predictionData || !predictionData.response || predictionData.response.length === 0) {
        fixture = await getFixtureDetailDirect(fixtureId);
        if (!fixture) {
            fixture = {
                id: fixtureId,
                date: new Date().toISOString(),
                status: { short: 'NS', elapsed: 0 }
            };
        }

        return {
            match: mapMatch(fixture, null, null, null),
            stats: {
                home: getEmptyTeamStats(),
                away: getEmptyTeamStats(),
                comparison: {}
            },
            predictions: [],
            h2h: []
        };
    }

    const res = predictionData.response[0];
    fixture = res.fixture;
    const league = res.league;
    const teams = res.teams;
    const predictions = res.predictions;
    const comparison = res.comparison;
    const h2h = res.h2h || [];

    // If fixture info is missing from predictions (some plans/endpoints), fetch it explicitly
    if (!fixture) {
        fixture = await getFixtureDetailDirect(fixtureId);
    }

    if (!fixture) {
        // Fallback construct if even getter fails
        fixture = {
            id: fixtureId,
            date: new Date().toISOString(),
            status: { short: 'NS', elapsed: 0 }
        };
    }

    // Map match data
    const match = mapMatch(fixture, league, teams, res);

    // Helper to map team stats
    const mapTeamStats = (side: 'home' | 'away') => {
        const team = teams?.[side];
        const leagueStats = team?.league;
        const formStr = leagueStats?.form || '';

        // Parse form string "WLDWW" into ["W", "L", "D", "W", "W"]
        const parseForm = (str: string) => str ? str.split('').reverse().slice(0, 5) : [];

        const mapDetail = (node: any) => ({
            played: node?.fixtures?.played?.total || 0,
            wins: node?.fixtures?.wins?.total || 0,
            draws: node?.fixtures?.draws?.total || 0,
            losses: node?.fixtures?.loses?.total || 0,
            scored: node?.goals?.for?.total?.total || 0,
            conceded: node?.goals?.against?.total?.total || 0,
            ppg: node?.fixtures?.played?.total > 0 ?
                parseFloat(((node?.fixtures?.wins?.total * 3 + node?.fixtures?.draws?.total) / node?.fixtures?.played?.total).toFixed(2)) : 0,
            winRate: node?.fixtures?.played?.total > 0 ? Math.round((node?.fixtures?.wins?.total / node?.fixtures?.played?.total) * 100) : 0,
            scoredAvg: parseFloat(node?.goals?.for?.average?.total || '0'),
            concededAvg: parseFloat(node?.goals?.against?.average?.total || '0'),
            cleanSheets: node?.clean_sheet?.total || 0,
            failedToScore: node?.failed_to_score?.total || 0,
            btts: 0,
            bttsRate: 0,
            cleanSheetRate: node?.fixtures?.played?.total > 0 ? Math.round((node?.clean_sheet?.total / node?.fixtures?.played?.total) * 100) : 0,
            failedToScoreRate: node?.fixtures?.played?.total > 0 ? Math.round((node?.failed_to_score?.total / node?.fixtures?.played?.total) * 100) : 0,
            over05Rate: 0,
            over15Rate: 0,
            over25Rate: 0,
            over35Rate: 0,
            over45Rate: 0,
            over55Rate: 0,
        });

        return {
            overall: mapDetail(leagueStats),
            home: mapDetail(leagueStats?.fixtures?.home),
            away: mapDetail(leagueStats?.fixtures?.away),
            last5: parseForm(formStr),
            last5Home: parseForm(leagueStats?.fixtures?.home?.form || ''),
            last5Away: parseForm(leagueStats?.fixtures?.away?.form || ''),
            recentMatchesDetailed: []
        };
    };

    const stats = {
        home: mapTeamStats('home'),
        away: mapTeamStats('away'),
        comparison: comparison || {}
    };

    // Map predictions to array
    const mappedPredictions = predictions ? [
        {
            matchId: fixture?.id || fixtureId,
            selection: predictions?.winner?.name || 'N/A',
            probability: predictions?.percent?.home ? parseInt(predictions.percent.home) : 0,
            confidence: 0.85,
            shortExplanation: predictions?.advice || 'Analysis coming soon...'
        }
    ] : [];

    // Map H2H matches
    const mappedH2H = (h2h || []).map((h: any) => ({
        id: h?.fixture?.id,
        date: h?.fixture?.date,
        competition: h?.league?.name,
        homeTeam: { id: h?.teams?.home?.id, name: h?.teams?.home?.name, logoUrl: h?.teams?.home?.logo },
        awayTeam: { id: h?.teams?.away?.id, name: h?.teams?.away?.name, logoUrl: h?.teams?.away?.logo },
        homeScore: h?.goals?.home,
        awayScore: h?.goals?.away
    }));

    function mapMatch(fixture: any, league: any, teams: any, res: any) {
        const fId = fixture?.id || fixture?.matchId || fixtureId;
        const statusStr = fixture?.status?.short || (typeof fixture?.status === 'string' ? fixture.status : 'NS');
        const elapsedVal = fixture?.status?.elapsed || fixture?.elapsed || 0;
        const kickoff = fixture?.date || fixture?.kickoffAt || new Date().toISOString();

        return {
            matchId: fId,
            providerFixtureId: fId,
            kickoffAt: kickoff,
            status: statusStr,
            elapsed: elapsedVal,
            league: {
                id: league?.id || fixture?.league?.id || 0,
                name: league?.name || fixture?.league?.name || 'Unknown League',
                slug: (league?.name || fixture?.league?.name || 'unknown-league').toLowerCase().replace(/\s+/g, '-'),
                logoUrl: league?.logo || fixture?.league?.logoUrl || '',
                country: {
                    name: league?.country || fixture?.league?.country?.name || '',
                    flagUrl: league?.flag || fixture?.league?.country?.flagUrl || ''
                }
            },
            homeTeam: {
                id: teams?.home?.id || fixture?.homeTeam?.id || 0,
                name: teams?.home?.name || fixture?.homeTeam?.name || 'Home Team',
                logoUrl: teams?.home?.logo || fixture?.homeTeam?.logoUrl || ''
            },
            awayTeam: {
                id: teams?.away?.id || fixture?.awayTeam?.id || 0,
                name: teams?.away?.name || fixture?.awayTeam?.name || 'Away Team',
                logoUrl: teams?.away?.logo || fixture?.awayTeam?.logoUrl || ''
            },
            score: {
                home: res?.goals?.home ?? fixture?.score?.home ?? 0,
                away: res?.goals?.away ?? fixture?.score?.away ?? 0
            }
        };
    }

    function getEmptyTeamStatsDetail() {
        return {
            played: 0, wins: 0, draws: 0, losses: 0, scored: 0, conceded: 0,
            btts: 0, cleanSheets: 0, failedToScore: 0, ppg: 0, winRate: 0,
            scoredAvg: 0, concededAvg: 0, bttsRate: 0, cleanSheetRate: 0,
            failedToScoreRate: 0, over05Rate: 0, over15Rate: 0, over25Rate: 0,
            over35Rate: 0, over45Rate: 0, over55Rate: 0
        };
    }

    function getEmptyTeamStats() {
        return {
            overall: getEmptyTeamStatsDetail(),
            home: getEmptyTeamStatsDetail(),
            away: getEmptyTeamStatsDetail(),
            last5: [],
            last5Home: [],
            last5Away: [],
            recentMatchesDetailed: []
        };
    }
    return {
        match,
        stats,
        predictions: mappedPredictions,
        h2h: mappedH2H
    };
}
