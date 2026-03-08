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

    return data.response.map((item: any) => mapMatch(item.fixture, item.league, item.teams, item));
}

/**
 * Fetch odds for all matches on a specific date
 */
export async function getTodayOddsDirect(date: string) {
    const data: any = await fetchFromSportsProvider(`/odds?date=${date}`);

    if (!data.response) return [];

    return data.response.map((item: any) => ({
        matchId: item.fixture.id,
        bookmakers: item.bookmakers.map((bm: any) => ({
            id: bm.id,
            name: bm.name,
            markets: bm.markets.map((m: any) => ({
                id: m.id,
                name: m.name,
                values: m.values.map((v: any) => ({
                    value: v.value,
                    odd: v.odd
                }))
            }))
        }))
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
 * Fetch events for a specific fixture
 */
export async function getMatchEventsDirect(fixtureId: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/fixtures/events?fixture=${fixtureId}`);
        return data.response || [];
    } catch (err) {
        console.warn(`Failed to fetch events for fixture ${fixtureId}:`, (err as any).message);
        return [];
    }
}

export async function getFixtureStatisticsDirect(fixtureId: number) {
    try {
        const data: any = await fetchFromSportsProvider(`/fixtures/statistics?fixture=${fixtureId}`);
        return data.response || [];
    } catch (err) {
        console.warn(`Failed to fetch statistics for fixture ${fixtureId}:`, (err as any).message);
        return [];
    }
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

        const getFormFromMatches = (matches: any[], limit: number = 5) => {
            return (matches || []).slice(0, limit).map(m => {
                const teamIdNum = Number(m.homeTeam?.id);
                const isHome = teamIdNum === teamId;
                const scoreHome = m.score?.home ?? (m as any).goals?.home;
                const scoreAway = m.score?.away ?? (m as any).goals?.away;
                if (scoreHome === undefined || scoreAway === undefined || scoreHome === null || scoreAway === null) return '-';
                if (scoreHome === scoreAway) return 'D';
                if (isHome) return scoreHome > scoreAway ? 'W' : 'L';
                return scoreAway > scoreHome ? 'W' : 'L';
            });
        };

        // Helper to calculate OVER X.5 given an array of matches
        const calculateOverRates = (matches: any[]) => {
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

            matches.forEach(m => {
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

        const homeMatches = allMatches.filter(m => Number(m.homeTeam?.id) === teamId);
        const awayMatches = allMatches.filter(m => Number(m.awayTeam?.id) === teamId);

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
    const homeId = teams?.home?.id || fixture?.homeTeam?.id || 0;
    const awayId = teams?.away?.id || fixture?.awayTeam?.id || 0;

    const [homeRecent, awayRecent, events, homeNext] = await Promise.all([
        homeId ? getTeamMatchesDirect(homeId, 'last', 20) : Promise.resolve([]),
        awayId ? getTeamMatchesDirect(awayId, 'last', 20) : Promise.resolve([]),
        getMatchEventsDirect(fixtureId),
        homeId ? getTeamMatchesDirect(homeId, 'next', 10) : Promise.resolve([])
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

    // Calculate H2H Summary
    const h2hSummary = {
        total: mappedH2H.length,
        homeTeam: {
            wins: mappedH2H.filter((m: any) => (m.homeTeam.id === homeId && m.homeScore > m.awayScore) || (m.awayTeam.id === homeId && m.awayScore > m.homeScore)).length,
            cleanSheets: mappedH2H.filter((m: any) => (m.homeTeam.id === homeId && m.awayScore === 0) || (m.awayTeam.id === homeId && m.homeScore === 0)).length
        },
        awayTeam: {
            wins: mappedH2H.filter((m: any) => (m.homeTeam.id === awayId && m.homeScore > m.awayScore) || (m.awayTeam.id === awayId && m.awayScore > m.homeScore)).length,
            cleanSheets: mappedH2H.filter((m: any) => (m.homeTeam.id === awayId && m.awayScore === 0) || (m.awayTeam.id === awayId && m.homeScore === 0)).length
        },
        draws: mappedH2H.filter((m: any) => m.homeScore === m.awayScore).length,
        btts: mappedH2H.filter((m: any) => m.homeScore > 0 && m.awayScore > 0).length,
        over05: mappedH2H.filter((m: any) => (m.homeScore + m.awayScore) > 0.5).length,
        over15: mappedH2H.filter((m: any) => (m.homeScore + m.awayScore) > 1.5).length,
        over25: mappedH2H.filter((m: any) => (m.homeScore + m.awayScore) > 2.5).length,
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
        predictions: mappedPredictions,
        h2h: mappedH2H,
        h2hSummary,
        standings: standings.length > 0 ? standings : null
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
            home: res?.goals?.home ?? res?.score?.fulltime?.home ?? (fixture as any)?.score?.home ?? (fixture?.status?.short === 'NS' ? null : 0),
            away: res?.goals?.away ?? res?.score?.fulltime?.away ?? (fixture as any)?.score?.away ?? (fixture?.status?.short === 'NS' ? null : 0)
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

        if (!data.response || data.response.length === 0) {
            throw new Error(`No standings found for league ${leagueId} in season ${season}`);
        }

        const league = data.response[0].league;
        // Flatten standings groups (e.g., Group A, Group B, or just one league table)
        const allStandings = league.standings.flat();

        // Map basic standings
        const mappedRows = allStandings.map((item: any) => {
            const mapSplit = (split: any) => ({
                played: split?.played || 0,
                wins: split?.win || 0,
                draws: split?.draw || 0,
                losses: split?.lose || 0,
                gf: split?.goals?.for || 0,
                ga: split?.goals?.against || 0,
                gd: item?.goalsDiff || 0,
                points: item?.points || 0,
                ppg: (split?.played || 0) > 0 ? parseFloat(((item?.points || 0) / split.played).toFixed(2)) : 0,
                avgScored: (split?.played || 0) > 0 ? parseFloat(((split?.goals?.for || 0) / split.played).toFixed(2)) : 0,
                avgConceded: (split?.played || 0) > 0 ? parseFloat(((split?.goals?.against || 0) / split.played).toFixed(2)) : 0
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

        // Enrichment: Fetch Corner Stats for each team (Parallel with sampled fixtures for actual data)
        const fixtureStatsCache = new Map<number, any>();
        const getCachedFixtureStats = async (fixtureId: number) => {
            if (fixtureStatsCache.has(fixtureId)) return fixtureStatsCache.get(fixtureId);
            const stats = await getFixtureStatisticsDirect(fixtureId);
            fixtureStatsCache.set(fixtureId, stats);
            return stats;
        };

        try {
            const enrichedRows = await Promise.all(mappedRows.map(async (row: any) => {
                // Fetch completed matches for this team in this league/season for aggregation
                const fixtures: any = await fetchFromSportsProvider(`/fixtures?team=${row.team.id}&league=${leagueId}&season=${season}&status=FT`);

                if (fixtures.response && fixtures.response.length > 0) {
                    const createHalf = () => ({ played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0, ppg: 0 });
                    const createCS = () => ({ count: 0, percentage: 0 });
                    const createOU = () => ({
                        over05: { count: 0, percentage: 0 }, over15: { count: 0, percentage: 0 },
                        over25: { count: 0, percentage: 0 }, over35: { count: 0, percentage: 0 },
                        over45: { count: 0, percentage: 0 }, over55: { count: 0, percentage: 0 }
                    });
                    const createBtts = () => ({ count: 0, percentage: 0 });
                    const createScoringFirst = () => ({ count: 0, percentage: 0 });
                    const createConcedingFirst = () => ({ count: 0, percentage: 0 });

                    const updateHalf = (split: any, gf: number, ga: number) => {
                        split.played++; split.gf += gf; split.ga += ga; split.gd += (gf - ga);
                        if (gf > ga) { split.wins++; split.points += 3; }
                        else if (gf === ga) { split.draws++; split.points += 1; }
                        else { split.losses++; }
                        split.ppg = parseFloat((split.points / split.played).toFixed(2));
                    };

                    const updateCS = (split: any, played: number, ga: number) => {
                        if (ga === 0) split.count++;
                        split.percentage = played > 0 ? Math.round((split.count / played) * 100) : 0;
                    };

                    const updateOU = (split: any, played: number, goals: number) => {
                        if (goals > 0.5) split.over05.count++; split.over05.percentage = Math.round((split.over05.count / played) * 100);
                        if (goals > 1.5) split.over15.count++; split.over15.percentage = Math.round((split.over15.count / played) * 100);
                        if (goals > 2.5) split.over25.count++; split.over25.percentage = Math.round((split.over25.count / played) * 100);
                        if (goals > 3.5) split.over35.count++; split.over35.percentage = Math.round((split.over35.count / played) * 100);
                        if (goals > 4.5) split.over45.count++; split.over45.percentage = Math.round((split.over45.count / played) * 100);
                        if (goals > 5.5) split.over55.count++; split.over55.percentage = Math.round((split.over55.count / played) * 100);
                    };

                    const updateBtts = (split: any, played: number, gf: number, ga: number) => {
                        if (gf > 0 && ga > 0) split.count++;
                        split.percentage = played > 0 ? Math.round((split.count / played) * 100) : 0;
                    };

                    const getGoalsArr = async (fixtureId: number, hasGoals: boolean) => {
                        if (!hasGoals) return [];
                        try {
                            const events = await getMatchEventsDirect(fixtureId);
                            if (events && events.length > 0) {
                                return events.filter((e: any) => e.type === 'Goal' && !e.detail.includes('Missed'));
                            }
                        } catch (e) { }
                        return [];
                    };

                    const updateScoringFirst = (splitSF: any, splitCF: any, played: number, goalsArray: any[], teamId: number) => {
                        if (goalsArray && goalsArray.length > 0) {
                            // goals[0] might have team.id to specify who scored
                            const firstGoal = goalsArray[0];
                            if (firstGoal && firstGoal.team && firstGoal.team.id === teamId) {
                                splitSF.count++;
                            } else if (firstGoal && firstGoal.team && firstGoal.team.id !== teamId) {
                                splitCF.count++;
                            }
                        }
                        splitSF.percentage = played > 0 ? Math.round((splitSF.count / played) * 100) : 0;
                        splitCF.percentage = played > 0 ? Math.round((splitCF.count / played) * 100) : 0;
                    };

                    const stats = {
                        overall: { firstHalf: createHalf(), secondHalf: createHalf(), cleanSheets: createCS(), overUnder: createOU(), btts: createBtts(), scoringFirst: createScoringFirst(), concedingFirst: createConcedingFirst() },
                        home: { firstHalf: createHalf(), secondHalf: createHalf(), cleanSheets: createCS(), overUnder: createOU(), btts: createBtts(), scoringFirst: createScoringFirst(), concedingFirst: createConcedingFirst() },
                        away: { firstHalf: createHalf(), secondHalf: createHalf(), cleanSheets: createCS(), overUnder: createOU(), btts: createBtts(), scoringFirst: createScoringFirst(), concedingFirst: createConcedingFirst() }
                    };

                    let homeMatches = 0; let awayMatches = 0;

                    for (const f of fixtures.response) {
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

                        updateCS(stats.overall.cleanSheets, totalPlayed, oppFt); updateCS(stats[splitKey].cleanSheets, matchesPlayed, oppFt);
                        updateOU(stats.overall.overUnder, totalPlayed, totalGoals); updateOU(stats[splitKey].overUnder, matchesPlayed, totalGoals);
                        updateBtts(stats.overall.btts, totalPlayed, teamFt, oppFt); updateBtts(stats[splitKey].btts, matchesPlayed, teamFt, oppFt);

                        const goalsArr = f.events ? f.events.filter((e: any) => e.type === 'Goal' && !e.detail.includes('Missed')) : await getGoalsArr(f.fixture.id, totalGoals > 0);

                        updateScoringFirst(stats.overall.scoringFirst, stats.overall.concedingFirst, totalPlayed, goalsArr, row.team.id);
                        updateScoringFirst(stats[splitKey].scoringFirst, stats[splitKey].concedingFirst, matchesPlayed, goalsArr, row.team.id);
                    }

                    // For corners/cards use up to 5 most recent matches like before
                    const recentFixtures = fixtures.response.slice(-5);
                    let totalMatchCorners = 0;
                    let cornerOvers = { 75: 0, 85: 0, 95: 0, 105: 0, 115: 0, 125: 0, 135: 0 };
                    let cardOvers = { overall: { 35: 0, 45: 0, 55: 0 }, for: { 35: 0, 45: 0, 55: 0 }, against: { 35: 0, 45: 0, 55: 0 } };
                    const sampleSize = recentFixtures.length;

                    for (const f of recentFixtures) {
                        const fStats = await getCachedFixtureStats(f.fixture.id);

                        const getTeamCardCount = (teamStats: any) => {
                            const yellow = parseInt(teamStats.statistics.find((s: any) => s.type === 'Yellow Cards')?.value || '0');
                            const red = parseInt(teamStats.statistics.find((s: any) => s.type === 'Red Cards')?.value || '0');
                            return yellow + red;
                        };

                        const getCorners = (teamStats: any) => {
                            const cornerStat = teamStats.statistics.find((s: any) => s.type === 'Corner Kicks');
                            return parseInt(cornerStat?.value || '0');
                        };

                        if (fStats.length >= 2) {
                            const corners = getCorners(fStats[0]) + getCorners(fStats[1]);
                            totalMatchCorners += corners;
                            if (corners > 7.5) cornerOvers[75]++; if (corners > 8.5) cornerOvers[85]++;
                            if (corners > 9.5) cornerOvers[95]++; if (corners > 10.5) cornerOvers[105]++;
                            if (corners > 11.5) cornerOvers[115]++; if (corners > 12.5) cornerOvers[125]++;
                            if (corners > 13.5) cornerOvers[135]++;

                            const homeCards = getTeamCardCount(fStats[0]); const awayCards = getTeamCardCount(fStats[1]);
                            const isHome = fStats[0].team.id === row.team.id;
                            const teamCards = isHome ? homeCards : awayCards; const oppCards = isHome ? awayCards : homeCards;
                            const totalMatchCards = homeCards + awayCards;

                            if (totalMatchCards > 3.5) cardOvers.overall[35]++; if (totalMatchCards > 4.5) cardOvers.overall[45]++; if (totalMatchCards > 5.5) cardOvers.overall[55]++;
                            if (teamCards > 3.5) cardOvers.for[35]++; if (teamCards > 4.5) cardOvers.for[45]++; if (teamCards > 5.5) cardOvers.for[55]++;
                            if (oppCards > 3.5) cardOvers.against[35]++; if (oppCards > 4.5) cardOvers.against[45]++; if (oppCards > 5.5) cardOvers.against[55]++;
                        }

                    }

                    const mapCorners = () => ({
                        average: sampleSize > 0 ? parseFloat((totalMatchCorners / sampleSize).toFixed(1)) : 0,
                        over75: sampleSize > 0 ? Math.round((cornerOvers[75] / sampleSize) * 100) : 0,
                        over85: sampleSize > 0 ? Math.round((cornerOvers[85] / sampleSize) * 100) : 0,
                        over95: sampleSize > 0 ? Math.round((cornerOvers[95] / sampleSize) * 100) : 0,
                        over105: sampleSize > 0 ? Math.round((cornerOvers[105] / sampleSize) * 100) : 0,
                        over115: sampleSize > 0 ? Math.round((cornerOvers[115] / sampleSize) * 100) : 0,
                        over125: sampleSize > 0 ? Math.round((cornerOvers[125] / sampleSize) * 100) : 0,
                        over135: sampleSize > 0 ? Math.round((cornerOvers[135] / sampleSize) * 100) : 0
                    });

                    const mapCards = (type: 'overall' | 'for' | 'against') => ({
                        over35: sampleSize > 0 ? Math.round((cardOvers[type][35] / sampleSize) * 100) : 0,
                        over45: sampleSize > 0 ? Math.round((cardOvers[type][45] / sampleSize) * 100) : 0,
                        over55: sampleSize > 0 ? Math.round((cardOvers[type][55] / sampleSize) * 100) : 0
                    });

                    return {
                        ...row,
                        overall: {
                            ...row.overall,
                            ...stats.overall,
                            corners: mapCorners(),
                            cards: mapCards('overall')
                        },
                        home: {
                            ...row.home,
                            ...stats.home,
                            corners: mapCorners(),
                            cards: mapCards('for')
                        },
                        away: {
                            ...row.away,
                            ...stats.away,
                            corners: mapCorners(),
                            cards: mapCards('against')
                        }
                    };
                }
                return row;
            }));
            return enrichedRows;
        } catch (err) {
            console.warn('Corner enrichment failed:', err);
            return mappedRows;
        }
    } catch (err) {
        console.warn(`Failed to fetch standings for league ${leagueId}:`, (err as any).message);
        return []; // Return empty array instead of throwing to prevent page crash
    }
}

/**
 * Calculate "Virtual Standings" from a list of fixture results.
 * Useful when the official API standings are missing for a cup or tournament.
 */
export function calculateVirtualStandings(fixtures: any[]) {
    const teams: Record<number, any> = {};

    const getOrCreateTeam = (teamData: any) => {
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

    fixtures.forEach(f => {
        // Only count finished matches
        const status = f.fixture?.status?.short;
        if (!['FT', 'AET', 'PEN'].includes(status)) return;

        const home = getOrCreateTeam(f.teams.home);
        const away = getOrCreateTeam(f.teams.away);

        const hGoals = f.goals.home ?? 0;
        const aGoals = f.goals.away ?? 0;

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
    const result = Object.values(teams).map((t: any) => {
        t.form = t.form.slice(-5); // Keep last 5 results for form
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
            id: item.player?.id,
            name: item.player?.name,
            photo: item.player?.photo
        },
        statistics: item.statistics?.[0] || {}
    }));
}

export async function getTopAssistsDirect(leagueId: number, season: number) {
    const data: any = await fetchFromSportsProvider(`/players/topassists?league=${leagueId}&season=${season}`);
    if (!data.response || data.response.length === 0) return [];
    return data.response.map((item: any) => ({
        player: {
            id: item.player?.id,
            name: item.player?.name,
            photo: item.player?.photo
        },
        statistics: item.statistics?.[0] || {}
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
            // Priority matching: Exact name match first, then closest match
            const exactMatch = data.response.find((r: any) =>
                r.team.name.toLowerCase() === searchTerm.toLowerCase()
            );

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

export async function getTeamMatchesDirect(teamId: number, type: 'next' | 'last' = 'next', count: number = 5, leagueId?: number | null) {
    try {
        let endpoint = `/fixtures?team=${teamId}&${type}=${count}`;
        if (leagueId) {
            endpoint += `&league=${leagueId}`;
        }
        const data: any = await fetchFromSportsProvider(endpoint);
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
            return data.response
                .filter((item: any) => item.seasons.some((s: any) => s.current)) // Only active leagues
                .map((item: any) => ({
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
