export interface ApiFixture {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
        first: number | null;
        second: number | null;
    };
    venue: {
        id: number | null;
        name: string | null;
        city: string | null;
    };
    status: {
        long: string;
        short: string;
        elapsed: number | null;
    };
}

export interface ApiLeague {
    id: number;
    name: string;
    type: string;
    logo: string;
    country?: string;
    flag?: string | null;
    season?: number;
}

export interface ApiCountry {
    name: string;
    code: string | null;
    flag: string | null;
}

export interface ApiSeason {
    year: number;
    start: string;
    end: string;
    current: boolean;
    coverage: Record<string, unknown>;
}

export interface ApiLeagueRecord {
    league: ApiLeague;
    country: ApiCountry;
    seasons: ApiSeason[];
}

export interface ApiLeagueStandings {
    league: ApiLeague & {
        country: string;
        flag: string | null;
        season: number;
        standings: ApiStanding[][];
    };
}

export interface ApiTeam {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
}

export interface ApiTeams {
    home: ApiTeam;
    away: ApiTeam;
}

export interface ApiGoals {
    home: number | null;
    away: number | null;
}

export interface ApiScore {
    halftime: ApiGoals;
    fulltime: ApiGoals;
    extratime: ApiGoals;
    penalty: ApiGoals;
}

export interface ApiFixtureResponse {
    fixture: ApiFixture;
    league: ApiLeague;
    teams: ApiTeams;
    goals: ApiGoals;
    score: ApiScore;
    events?: unknown[];
    statistics?: unknown[];
}

export interface ApiPrediction {
    winner: {
        id: number;
        name: string;
        comment: string | null;
    };
    win_or_draw: boolean;
    under_over: string | null;
    goals: {
        home: string | null;
        away: string | null;
    };
    advice: string | null;
    percent: {
        home: string;
        draw: string;
        away: string;
    };
}

export interface ApiPredictionResponse {
    predictions: ApiPrediction;
    league: ApiLeague;
    teams: ApiTeams;
    comparison: Record<string, unknown>;
    h2h: unknown[];
}

export interface ApiStanding {
    rank: number;
    team: {
        id: number;
        name: string;
        logo: string;
    };
    group: string;
    form: string;
    status: string;
    description: string | null;
    all: ApiStandingStats;
    home: ApiStandingStats;
    away: ApiStandingStats;
    goalsDiff: number;
    points: number;
    lastUpdate: string;
}

export interface ApiStandingStats {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
        for: number;
        against: number;
    };
}


export interface ApiProviderResponse<T> {
    get: string;
    parameters: Record<string, string | number | boolean | undefined>;
    errors: unknown[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: T[];
}
