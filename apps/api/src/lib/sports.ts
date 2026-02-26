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

/**
 * Fetch predictions for a specific fixture
 */
export async function getPredictionsDirect(fixtureId: number) {
    const data: any = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);

    if (!data.response || data.response.length === 0) return null;

    const prediction = data.response[0].predictions;
    const teams = data.response[0].teams;

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
    const data: any = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);

    if (!data.response || data.response.length === 0) return null;

    const res = data.response[0];
    const fixture = res.fixture;
    const league = res.league;
    const teams = res.teams;
    const predictions = res.predictions;
    const comparison = res.comparison;
    const h2h = res.h2h || [];

    // Map match data
    const match = {
        matchId: fixture.id,
        providerFixtureId: fixture.id,
        kickoffAt: fixture.date,
        status: fixture.status.short,
        elapsed: fixture.status.elapsed,
        league: {
            id: league.id,
            name: league.name,
            slug: league.name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: league.logo,
            country: {
                name: league.country,
                flagUrl: league.flag
            }
        },
        homeTeam: {
            id: teams.home.id,
            name: teams.home.name,
            logoUrl: teams.home.logo
        },
        awayTeam: {
            id: teams.away.id,
            name: teams.away.name,
            logoUrl: teams.away.logo
        },
        score: {
            home: res.goals.home,
            away: res.goals.away
        }
    };

    // Helper to map team stats
    const mapTeamStats = (side: 'home' | 'away') => {
        const team = teams[side];
        const leagueStats = team.league;
        return {
            overall: {
                played: leagueStats.fixtures.played.total,
                wins: leagueStats.fixtures.wins.total,
                draws: leagueStats.fixtures.draws.total,
                losses: leagueStats.fixtures.loses.total,
                scored: leagueStats.goals.for.total.total,
                conceded: leagueStats.goals.against.total.total,
                ppg: leagueStats.fixtures.played.total > 0 ?
                    parseFloat(((leagueStats.fixtures.wins.total * 3 + leagueStats.fixtures.draws.total) / leagueStats.fixtures.played.total).toFixed(2)) : 0,
                winRate: Math.round((leagueStats.fixtures.wins.total / leagueStats.fixtures.played.total) * 100),
                scoredAvg: parseFloat(leagueStats.goals.for.average.total),
                concededAvg: parseFloat(leagueStats.goals.against.average.total),
                cleanSheets: leagueStats.clean_sheet.total,
                failedToScore: leagueStats.failed_to_score.total,
                btts: 0, // Not explicitly in this node
            },
            recentMatchesDetailed: [] // API-Football doesn't provide these here in detail, leaving empty to avoid crashes
        };
    };

    const stats = {
        home: mapTeamStats('home'),
        away: mapTeamStats('away'),
        comparison: comparison
    };

    // Map predictions to array
    const mappedPredictions = [
        {
            matchId: fixture.id,
            selection: predictions.winner.name,
            probability: parseInt(predictions.percent.home),
            confidence: 0.85,
            shortExplanation: predictions.advice
        }
    ];

    // Map H2H matches
    const mappedH2H = h2h.map((h: any) => ({
        id: h.fixture.id,
        date: h.fixture.date,
        competition: h.league.name,
        homeTeam: { id: h.teams.home.id, name: h.teams.home.name, logoUrl: h.teams.home.logo },
        awayTeam: { id: h.teams.away.id, name: h.teams.away.name, logoUrl: h.teams.away.logo },
        homeScore: h.goals.home,
        awayScore: h.goals.away
    }));

    return {
        match,
        stats,
        predictions: mappedPredictions,
        h2h: mappedH2H
    };
}
