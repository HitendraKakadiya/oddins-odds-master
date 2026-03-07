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
    try {
        predictionData = await fetchFromSportsProvider(`/predictions?fixture=${fixtureId}`);
    } catch (err) {
        console.warn(`Failed to fetch predictions for fixture ${fixtureId}:`, (err as any).message);
    }

    const res = predictionData?.response?.[0];
    let fixture = res?.fixture;
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

    // Map match data
    const match = mapMatch(fixture, league, teams, res);

    // Helper to map team stats
    const mapTeamStats = (side: 'home' | 'away', allMatches: any[] = []) => {
        const team = teams?.[side];
        const leagueStats = team?.league;
        const teamId = Number(team?.id || (side === 'home' ? fixture?.homeTeam?.id : fixture?.awayTeam?.id) || 0);

        const mapDetail = (node: any, split: 'total' | 'home' | 'away' = 'total') => ({
            played: node?.fixtures?.played?.[split] || 0,
            wins: node?.fixtures?.wins?.[split] || 0,
            draws: node?.fixtures?.draws?.[split] || 0,
            losses: node?.fixtures?.loses?.[split] || 0,
            scored: node?.goals?.for?.total?.[split] || 0,
            conceded: node?.goals?.against?.total?.[split] || 0,
            ppg: node?.fixtures?.played?.[split] > 0 ?
                parseFloat(((node?.fixtures?.wins?.[split] * 3 + node?.fixtures?.draws?.[split]) / node?.fixtures?.played?.[split]).toFixed(2)) : 0,
            winRate: node?.fixtures?.played?.[split] > 0 ? Math.round((node?.fixtures?.wins?.[split] / node?.fixtures?.played?.[split]) * 100) : 0,
            scoredAvg: parseFloat(node?.goals?.for?.average?.[split] || '0'),
            concededAvg: parseFloat(node?.goals?.against?.average?.[split] || '0'),
            cleanSheets: node?.clean_sheet?.[split] || 0,
            failedToScore: node?.failed_to_score?.[split] || 0,
            btts: 0,
            bttsRate: 0,
            cleanSheetRate: node?.fixtures?.played?.[split] > 0 ? Math.round((node?.clean_sheet?.[split] / node?.fixtures?.played?.[split]) * 100) : 0,
            failedToScoreRate: node?.fixtures?.played?.[split] > 0 ? Math.round((node?.failed_to_score?.[split] / node?.fixtures?.played?.[split]) * 100) : 0,
            over05Rate: 0,
            over15Rate: 0,
            over25Rate: 0,
            over35Rate: 0,
            over45Rate: 0,
            over55Rate: 0,
        });

        // Helper to get form from matches
        const getFormFromMatches = (matches: any[], limit: number = 5) => {
            return matches.slice(0, limit).map(m => {
                const isHome = Number(m.homeTeam?.id) === teamId;
                const scoreHome = m.score.home;
                const scoreAway = m.score.away;
                if (scoreHome === null || scoreAway === null) return '-';
                if (scoreHome === scoreAway) return 'D';
                if (isHome) return scoreHome > scoreAway ? 'W' : 'L';
                return scoreAway > scoreHome ? 'W' : 'L';
            });
        };

        const homeMatches = allMatches.filter(m => Number(m.homeTeam?.id) === teamId);
        const awayMatches = allMatches.filter(m => Number(m.awayTeam?.id) === teamId);

        return {
            overall: mapDetail(leagueStats, 'total'),
            home: mapDetail(leagueStats, 'home'),
            away: mapDetail(leagueStats, 'away'),
            last5: getFormFromMatches(allMatches),
            last5Home: getFormFromMatches(homeMatches),
            last5Away: getFormFromMatches(awayMatches),
            recentMatchesDetailed: allMatches.slice(0, 5)
        };
    };

    // Fetch recent matches for both teams (fetch more to allow splits)
    const homeId = teams?.home?.id || fixture?.homeTeam?.id || 0;
    const awayId = teams?.away?.id || fixture?.awayTeam?.id || 0;

    const [homeRecent, awayRecent] = await Promise.all([
        homeId ? getTeamMatchesDirect(homeId, 'last', 20) : Promise.resolve([]),
        awayId ? getTeamMatchesDirect(awayId, 'last', 20) : Promise.resolve([])
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
    const mappedH2H = (h2h || []).map((h: any) => ({
        id: h?.fixture?.id,
        date: h?.fixture?.date,
        competition: h?.league?.name,
        homeTeam: { id: h?.teams?.home?.id, name: h?.teams?.home?.name, logoUrl: h?.teams?.home?.logo },
        awayTeam: { id: h?.teams?.away?.id, name: h?.teams?.away?.name, logoUrl: h?.teams?.away?.logo },
        homeScore: h?.goals?.home,
        awayScore: h?.goals?.away
    }));

    return {
        match: mapMatch(fixture, league, teams, res),
        stats,
        predictions: mappedPredictions,
        h2h: mappedH2H
    };
}

export function mapMatch(fixture: any, league: any, teams: any, res: any) {
    const fId = fixture?.id || fixture?.matchId;
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

let leaguesCache: any[] | null = null;
let lastLeaguesFetch = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getLeaguesDirect() {
    const now = Date.now();
    if (leaguesCache && (now - lastLeaguesFetch < CACHE_TTL)) {
        return leaguesCache;
    }

    try {
        const data: any = await fetchFromSportsProvider('/leagues');
        if (data.response) {
            leaguesCache = data.response;
            lastLeaguesFetch = now;
            return leaguesCache;
        }
    } catch (err) {
        console.error('Failed to fetch leagues from provider:', err);
    }

    return leaguesCache || [];
}

export async function getLeaguesBySearchDirect(search: string) {
    try {
        const data: any = await fetchFromSportsProvider(`/leagues?search=${encodeURIComponent(search)}`);
        return data.response || [];
    } catch (err) {
        console.error('Failed to search leagues from provider:', err);
        return [];
    }
}

export async function getLeagueStandingsDirect(leagueId: number, season: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/standings?league=${leagueId}&season=${season}`);
        if (data.response && data.response.length > 0) {
            const league = data.response[0].league;
            return league.standings[0].map((item: any) => ({
                rank: item.rank,
                team: {
                    id: item.team.id,
                    name: item.team.name,
                    logo: item.team.logo
                },
                all: item.all,
                home: item.home,
                away: item.away,
                points: item.points,
                goalsDiff: item.goalsDiff,
                form: item.form ? item.form.split('') : []
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch standings for league ${leagueId}:`, (err as any).message);
    }

    return [];
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

export async function getLeagueFixturesDirect(leagueId: number, season: number, type: 'next' | 'last' = 'next', count: number = 10) {
    const data: any = await fetchFromSportsProvider(`/fixtures?league=${leagueId}&season=${season}&${type}=${count}`);
    if (!data.response) return [];
    return data.response.map((item: any) => mapMatch(item.fixture, item.league, item.teams, item));
}

export async function getTopScorersDirect(leagueId: number, season: number) {
    const data: any = await fetchFromSportsProvider(`/players/topscorers?league=${leagueId}&season=${season}`);
    if (!data.response || data.response.length === 0) return [];
    return data.response.map((item: any) => ({
        player: {
            id: item.player.id,
            name: item.player.name,
            photo: item.player.photo
        },
        statistics: item.statistics[0]
    }));
}

export async function getTopAssistsDirect(leagueId: number, season: number) {
    const data: any = await fetchFromSportsProvider(`/players/topassists?league=${leagueId}&season=${season}`);
    if (!data.response || data.response.length === 0) return [];
    return data.response.map((item: any) => ({
        player: {
            id: item.player.id,
            name: item.player.name,
            photo: item.player.photo
        },
        statistics: item.statistics[0]
    }));
}

export async function getTeamByIdDirect(id: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/teams?id=${id}`);
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
        console.warn(`Fetch by ID failed for ${id}:`, (err as any).message);
    }

    return null;
}

export async function getTeamBySlugDirect(slug: string) {
    // Try direct Live Search for the team
    const searchTerm = slug.replace(/-/g, ' ');
    try {
        const data: any = await fetchFromSportsProvider(`/teams?search=${encodeURIComponent(searchTerm)}`);
        if (data.response && data.response.length > 0) {
            const item = data.response.find((r: any) =>
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
        console.warn(`Live search failed for ${slug}:`, (err as any).message);
    }

    return null;
}

export async function getTeamStatsDirect(teamId: number, leagueId: number, season: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`);
        if (data.response && !Array.isArray(data.response) && Object.keys(data.response).length > 0) return data.response;
        if (Array.isArray(data.response) && data.response.length > 0) return data.response[0];
    } catch (err) {
        console.warn(`Failed to fetch stats for team ${teamId}:`, (err as any).message);
    }

    return null;
}

export async function getTeamMatchesDirect(teamId: number, type: 'next' | 'last' = 'next', count: number = 5) {
    try {
        const data: any = await fetchFromSportsProvider(`/fixtures?team=${teamId}&${type}=${count}`);
        if (data.response && data.response.length > 0) {
            return data.response.map((item: any) => mapMatch(item.fixture, item.league, item.teams, item));
        }
    } catch (err) {
        console.warn(`Failed to fetch ${type} matches for team ${teamId}:`, (err as any).message);
    }

    return [];
}


export async function getTeamSquadDirect(teamId: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/players/squads?team=${teamId}`);
        if (data.response && data.response.length > 0) {
            return data.response[0].players.map((p: any) => ({
                id: p.id,
                name: p.name,
                age: p.age,
                number: p.number,
                position: p.position,
                photo: p.photo
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch squad for team ${teamId}:`, (err as any).message);
    }

    return [];
}

const workingSeasonsCache = new Map<number, number>();

export async function getTeamsByLeagueDirect(leagueId: number, season?: number) {
    try {
        let activeSeason = season || workingSeasonsCache.get(leagueId);

        if (activeSeason === undefined) {
            const leagues = await getLeaguesDirect() || [];
            const league = leagues.find((l: any) => l.league.id === leagueId);
            activeSeason = (league?.seasons?.find((s: any) => s.current)?.year || new Date().getFullYear()) as number;
        }

        // Try primary season
        let data: any = await fetchFromSportsProvider(`/teams?league=${leagueId}&season=${activeSeason}`);

        // Defensive: If 0 teams and we haven't tried the previous season yet, try (activeSeason - 1)
        if ((!data.response || data.response.length === 0) && !season) {
            const prevSeason = (activeSeason as number) - 1;
            console.log(`No teams for ${leagueId} in ${activeSeason}, trying ${prevSeason}...`);
            const fallbackData: any = await fetchFromSportsProvider(`/teams?league=${leagueId}&season=${prevSeason}`);

            if (fallbackData.response && fallbackData.response.length > 0) {
                activeSeason = prevSeason;
                data = fallbackData;
            }
        }

        if (data.response && data.response.length > 0) {
            workingSeasonsCache.set(leagueId, activeSeason as number);
            return data.response.map((item: any) => ({
                id: item.team.id,
                name: item.team.name,
                slug: generateTeamSlug(item.team.id, item.team.name),
                logoUrl: item.team.logo,
                country: item.team.country || item.venue?.country || 'Unknown'
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch teams for league ${leagueId}:`, (err as any).message);
    }
    return [];
}

export async function getPopularTeamsDirect(ids: number[]) {
    try {
        const idBatch = ids.join('-');
        const data: any = await fetchFromSportsProvider(`/teams?id=${idBatch}`);
        if (data.response && data.response.length > 0) {
            return data.response.map((item: any) => ({
                id: item.team.id,
                name: item.team.name,
                slug: generateTeamSlug(item.team.id, item.team.name),
                logoUrl: item.team.logo,
                country: item.team.country || item.venue?.country || 'Unknown'
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch popular teams:`, (err as any).message);
    }
    return [];
}

export async function getTeamLeaguesDirect(teamId: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/leagues?team=${teamId}`);
        if (data.response) {
            return data.response.map((item: any) => ({
                id: item.league.id,
                name: item.league.name,
                logo: item.league.logo,
                type: item.league.type,
                country: item.country.name,
                season: item.seasons.find((s: any) => s.current)?.year
            }));
        }
    } catch (err) {
        console.warn(`Failed to fetch leagues for team ${teamId}:`, (err as any).message);
    }
    return [];
}
