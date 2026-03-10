/**
 * Shared types for Sports Provider API and Internal Models
 */

export interface SportsProviderResponse<T> {
    get: string;
    parameters: Record<string, string | number>;
    errors: unknown[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: T[];
}

export interface Team {
    id: number;
    name: string;
    logo: string;
    logoUrl?: string; // Mapped field
    winner?: boolean;
}

export interface Venue {
    id: number | null;
    name: string;
    city: string;
}

export interface Fixture {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
        first: number | null;
        second: number | null;
    };
    venue: Venue;
    status: {
        long: string;
        short: string;
        elapsed: number;
    };
}

export interface League {
    id: number;
    name: string;
    country: string | {
        name: string;
        code: string | null;
        flag: string | null;
    };
    logo: string;
    logoUrl?: string; // Mapped
    flag: string | null;
    season: number;
    round?: string;
    type?: string;
    seasons?: {
        year: number;
        current: boolean;
    }[];
}

export interface Score {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
    home?: number | null; // Some responses have these directly
    away?: number | null;
}

export interface Goals {
    home: number | null;
    away: number | null;
}

export interface ProviderFixtureResponse {
    fixture: Fixture;
    league: League;
    teams: {
        home: Team;
        away: Team;
    };
    goals: Goals;
    score: Score;
}

export interface OddValue {
    value: string;
    odd: string;
}

export interface OddMarket {
    id: number;
    name: string;
    values: OddValue[];
}

export interface OddBookmaker {
    id: number;
    name: string;
    markets: OddMarket[];
}

export interface ProviderOddsResponse {
    league: League;
    fixture: {
        id: number;
        timezone: string;
        date: string;
        timestamp: number;
    };
    update: string;
    bookmakers: OddBookmaker[];
}

export interface StandingsRow {
    rank: number;
    team: {
        id: number;
        name: string;
        logo: string;
    };
    points: number;
    goalsDiff: number;
    group: string;
    form: string;
    status: string;
    description: string | null;
    all: StandingsSplit;
    home: StandingsSplit;
    away: StandingsSplit;
    update: string;
}

export interface StandingsSplit {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
        for: number;
        against: number;
    };
}

export interface ProviderStandingsResponse {
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string | null;
        season: number;
        standings: StandingsRow[][];
    };
}

export interface ProviderLeagueResponse {
    league: {
        id: number;
        name: string;
        type: string;
        logo: string;
    };
    country: {
        name: string;
        code: string | null;
        flag: string | null;
    };
    seasons: {
        year: number;
        start: string;
        end: string;
        current: boolean;
        coverage: Record<string, unknown>;
    }[];
}

export interface ProviderPredictionResponse {
    predictions: {
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
        advice: string;
        percent: {
            home: string;
            draw: string;
            away: string;
        };
    };
    league: League;
    teams: {
        home: Team & { league?: Record<string, unknown> };
        away: Team & { league?: Record<string, unknown> };
    };
    fixture?: Fixture;
    comparison: Record<string, unknown>;
    h2h: Record<string, unknown>[];
}

export interface InternalMatch {
    matchId: number;
    providerFixtureId: number;
    // ... (rest of InternalMatch)
    kickoffAt: string;
    status: string;
    elapsed: number;
    league: {
        id: number;
        name: string;
        slug: string;
        logoUrl: string;
        type: string;
        season: number;
        country: {
            name: string;
            code: string | null;
            flagUrl: string | null;
        };
    };
    homeTeam: {
        id: number;
        name: string;
        logoUrl: string;
    };
    awayTeam: {
        id: number;
        name: string;
        logoUrl: string;
    };
    score: {
        home: number | null;
        away: number | null;
    };
    featuredTip?: {
        id: number;
        title: string;
        isPremium: boolean;
        confidence?: number | null;
    } | null;
}

export interface ProviderStatsNode {
    fixtures?: {
        played?: Record<string, number>;
        wins?: Record<string, number>;
        draws?: Record<string, number>;
        loses?: Record<string, number>;
    };
    goals?: {
        for?: {
            total?: Record<string, number>;
            average?: Record<string, string>;
        };
        against?: {
            total?: Record<string, number>;
            average?: Record<string, string>;
        };
    };
    clean_sheet?: Record<string, number>;
    failed_to_score?: Record<string, number>;
    penalty?: Record<string, unknown>;
    lineups?: unknown[];
    cards?: Record<string, unknown>;
}

export type FixtureUnion = Fixture | InternalMatch;

