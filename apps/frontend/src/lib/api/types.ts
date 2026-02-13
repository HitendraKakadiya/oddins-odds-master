/**
 * Shared Type Definitions for OddinsOdds API
 */

export interface MatchData {
    matchId: number;
    providerFixtureId?: number;
    kickoffAt: string;
    status: string;
    elapsed?: number | null;
    league: {
        id: number;
        name: string;
        slug: string;
        type?: string | null;
        logoUrl?: string | null;
        country: {
            name: string;
            code?: string | null;
            flagUrl?: string | null;
        };
    };
    homeTeam: {
        id: number;
        name: string;
        slug: string;
        logoUrl?: string | null;
    };
    awayTeam: {
        id: number;
        name: string;
        slug: string;
        logoUrl?: string | null;
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

export interface TodayMatchesResponse {
    date: string;
    page: number;
    pageSize: number;
    total: number;
    matches: MatchData[];
}

export interface FeaturedTipsResponse {
    date: string;
    tips: Array<{
        id: number;
        matchId: number;
        title: string;
        shortReason?: string | null;
        isPremium: boolean;
        confidence?: number | null;
        publishedAt?: string | null;
        kickoffAt?: string | null;
        leagueName?: string | null;
        homeTeam?: { name: string; logoUrl?: string | null } | null;
        awayTeam?: { name: string; logoUrl?: string | null } | null;
        countryCode?: string | null;
    }>;
}

export interface LeaguesResponse {
    country: {
        name: string;
        code?: string | null;
        flagUrl?: string | null;
    };
    leagues: Array<{
        id: number;
        name: string;
        slug: string;
        logoUrl?: string | null;
        type?: string | null;
    }>;
}

export interface Article {
    id: number;
    type: string;
    slug: string;
    category?: string | null;
    title: string;
    summary: string;
    publishedAt?: string | null;
    updatedAt?: string | null;
    bodyMd?: string | null;
}

export interface ArticlesResponse {
    page: number;
    pageSize: number;
    total: number;
    items: Article[];
}

export interface StandingsRow {
    rank: number;
    team: {
        id: number;
        slug: string;
        logoUrl?: string | null;
        name: string;
    };
    played: number;
    wins: number;
    draws: number;
    losses: number;
    gf: number;
    ga: number;
    points: number;
}

export interface FAQItem {
    q: string;
    a: string;
}

export interface LeagueDetailResponse {
    league: {
        id: number;
        name: string;
        logoUrl?: string | null;
        country: {
            name: string;
        };
    };
    season: {
        year: number;
    };
    standings: StandingsRow[];
    fixtures: MatchData[];
    results: MatchData[];
    statsSummary?: {
        goalsAvg?: number | null;
        cornersAvg?: number | null;
        cardsAvg?: number | null;
    } | null;
    faq?: FAQItem[] | null;
}

export interface WhereToWatchItem {
    name: string;
    url: string;
}

export interface Market {
    marketKey: string;
    selection?: string | null;
    oddValue: number;
    impliedProb?: number | null;
}

export interface OddsLatest {
    bookmaker: {
        name: string;
    };
    capturedAt: string;
    markets: Market[];
}

export interface H2HMatch {
    date: string;
    competition: string;
    homeTeam: string;
    homeScore: number;
    awayScore: number;
    awayTeam: string;
}

export interface Prediction {
    id?: number;
    matchId?: number;
    title?: string;
    shortReason?: string | null;
    isPremium?: boolean;
    confidence?: number | null;
    kickoffAt?: string;
    league?: {
        name: string;
        slug?: string;
        countryName?: string;
    };
    homeTeam?: {
        name: string;
        logoUrl?: string;
    };
    awayTeam?: {
        name: string;
        logoUrl?: string;
    };
    selection?: string;
    [key: string]: unknown;
}

export interface MatchDetailResponse {
    match: MatchData;
    oddsLatest?: OddsLatest | null;
    predictions?: Prediction[] | null;
    h2h?: H2HMatch[] | null;
    whereToWatch?: WhereToWatchItem[] | null;
}

export interface PredictionsResponse {
    page: number;
    pageSize: number;
    total: number;
    items: Prediction[];
}

export interface StreamItem {
    matchId: number;
    kickoffAt: string;
    league: {
        id: number;
        name: string;
        logoUrl?: string;
    };
    homeTeam: {
        name: string;
        logoUrl?: string;
    };
    awayTeam: {
        name: string;
        logoUrl?: string;
    };
}

export interface StreamsResponse {
    date: string;
    page: number;
    pageSize: number;
    total: number;
    items: StreamItem[];
}

export interface TeamDetailResponse {
    team: {
        id: number;
        name: string;
        logoUrl?: string;
    };
    nextMatch?: MatchData | null;
    recentMatches?: MatchData[] | null;
    statsSummary?: {
        wins?: number;
        draws?: number;
        losses?: number;
        goalsScored?: number;
        goalsConceded?: number;
        cleanSheets?: number;
    } | null;
}

export interface TabItem {
    matchId?: number;
    kickoffAt?: string;
    homeTeamName?: string;
    awayTeamName?: string;
    leagueName?: string;
    stats?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface TabResponse {
    items: TabItem[];
}
