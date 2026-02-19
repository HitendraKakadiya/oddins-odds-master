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
        selection?: string | null;
        isPremium: boolean;
        confidence?: number | null;
        publishedAt?: string | null;
        kickoffAt?: string | null;
        league?: {
            name: string;
            slug: string;
            countryName: string;
            countryCode?: string | null;
        } | null;
        homeTeam?: { name: string; logoUrl?: string | null } | null;
        awayTeam?: { name: string; logoUrl?: string | null } | null;
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

export interface StandingsSplit {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    ppg: number;
}

export interface StandingsRow {
    rank: number;
    team: {
        id: number;
        slug: string;
        logoUrl?: string | null;
        name: string;
    };
    overall: StandingsSplit;
    home: StandingsSplit;
    away: StandingsSplit;
    form: string[];
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
    id: number;
    date: string;
    competition: string;
    homeTeam: { id: number; name: string; logoUrl?: string | null };
    awayTeam: { id: number; name: string; logoUrl?: string | null };
    homeScore: number;
    awayScore: number;
}

export interface H2HSummary {
    total: number;
    homeTeam: { wins: number; cleanSheets: number };
    awayTeam: { wins: number; cleanSheets: number };
    draws: number;
    btts: number;
    over05: number;
    over15: number;
    over25: number;
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

export interface TeamStatsDetail {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    scored: number;
    conceded: number;
    btts: number;
    cleanSheets: number;
    failedToScore: number;
    ppg: number;
    winRate: number;
    scoredAvg: number;
    concededAvg: number;
    bttsRate: number;
    cleanSheetRate: number;
    failedToScoreRate: number;
    over05Rate: number;
    over15Rate: number;
    over25Rate: number;
    over35Rate: number;
    over45Rate: number;
    over55Rate: number;
}

export interface DetailedRecentMatch {
    id: number;
    kickoffAt: string;
    homeTeam: { id: number; name: string; logoUrl?: string };
    awayTeam: { id: number; name: string; logoUrl?: string };
    score: { home: number; away: number };
    leagueName: string;
    result: 'W' | 'L' | 'D';
    isHome: boolean;
}

export interface TeamStats {
    overall: TeamStatsDetail;
    home: TeamStatsDetail;
    away: TeamStatsDetail;
    last5: string[];
    last5Home: string[];
    last5Away: string[];
    recentMatchesDetailed: DetailedRecentMatch[];
}

export interface LeagueStats {
    goalsAvg: string;
    bttsRate: number;
    over25Rate: number;
    over15Rate: number;
}

export interface MatchDetailResponse {
    match: MatchData;
    oddsLatest?: OddsLatest | null;
    predictions?: Prediction[] | null;
    h2h?: H2HMatch[] | null;
    h2hSummary?: H2HSummary | null;
    standings?: StandingsRow[] | null;
    whereToWatch?: WhereToWatchItem[] | null;
    stats?: {
        home: TeamStats;
        away: TeamStats;
        homeStatsSource?: 'league' | 'all' | 'any';
        awayStatsSource?: 'league' | 'all' | 'any';
        league: LeagueStats;
    } | null;
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
