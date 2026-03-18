/**
 * Shared Type Definitions for OddinsOdds API
 */

export interface Team {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string; 
    logo?: string;
    country: string; 
}

export interface League {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string | null;
    countryCode?: string;
}

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
        season?: number | string | null;
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
    avgScored: number;
    avgConceded: number;
    corners?: {
        average: number;
        over75: number;
        over85: number;
        over95: number;
        over105: number;
        over115: number;
        over125: number;
        over135: number;
    };
    cards?: {
        over35: number;
        over45: number;
        over55: number;
    };
    firstHalf?: {
        played: number; wins: number; draws: number; losses: number;
        gf: number; ga: number; gd: number; points: number; ppg: number;
    };
    secondHalf?: {
        played: number; wins: number; draws: number; losses: number;
        gf: number; ga: number; gd: number; points: number; ppg: number;
    };
    cleanSheets?: { count: number; percentage: number };
    overUnder?: {
        over05: { count: number; percentage: number }; under05: { count: number; percentage: number };
        over15: { count: number; percentage: number }; under15: { count: number; percentage: number };
        over25: { count: number; percentage: number }; under25: { count: number; percentage: number };
        over35: { count: number; percentage: number }; under35: { count: number; percentage: number };
        over45: { count: number; percentage: number }; under45: { count: number; percentage: number };
        over55: { count: number; percentage: number }; under55: { count: number; percentage: number };
    };
    btts?: { count: number; percentage: number };
    scoringFirst?: { count: number; percentage: number };
    concedingFirst?: { count: number; percentage: number };
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
            code?: string | null;
            flagUrl?: string | null;
        };
    };
    season: {
        year: number;
        isCurrent: boolean;
    };
    standings: StandingsRow[];
    fixtures: MatchData[];
    results: MatchData[];
    statsSummary: {
        matchesPlayed: number;
        totalMatches: number;
        totalGoals: number;
        avgGoals: number;
        homeWins: number;
        awayWins: number;
        draws: number;
        over25Percent: number;
        under25Percent: number;
        mostCommonScore: string;
        offensive: {
            best: string;
            worst: string;
            bestGoals: number;
            worstGoals: number
        };
        defensive: {
            best: string;
            worst: string;
            bestGoals: number;
            worstGoals: number
        };
        consistency: {
            mostWins: string;
            fewestWins: string;
            mostDraws: string;
            fewestDraws: string;
            mostLosses: string;
            fewestLosses: string
        };
        playerStats: {
            topScorer: string;
            topScorerGoals: number;
            topAssist: string;
            topAssistCount: number;
        };
        goalsAvg?: string | number | null;
        cornersAvg?: string | number | null;
        cardsAvg?: string | number | null;
    };
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
    id: number;
    matchId: number;
    title: string;
    shortReason?: string | null;
    isPremium?: boolean;
    confidence?: number | null;
    kickoffAt?: string | null;
    league?: {
        name: string;
        slug?: string;
        countryName?: string;
        countryCode?: string | null;
        country?: {
            name: string;
            code?: string | null;
        };
    } | null;
    homeTeam?: {
        name: string;
        logoUrl?: string | null;
    } | null;
    awayTeam?: {
        name: string;
        logoUrl?: string | null;
    } | null;
    selection?: string | null;
    leagueName?: string;
    marketKey?: string;
    line?: string | number;
    probability?: string | number;
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

export interface MatchEvent {
    time: {
        elapsed: number;
        extra?: number | null;
    };
    team: {
        id: number;
        name: string;
        logo?: string | null;
    };
    player: {
        id: number | null;
        name: string | null;
    };
    assist: {
        id: number | null;
        name: string | null;
    };
    type: 'Goal' | 'Card' | 'subst' | 'Var';
    detail: string;
    comments?: string | null;
}

export interface MatchDetailResponse {
    match: MatchData;
    prevMatch?: { matchId: number; homeTeam: { logoUrl?: string | null }; awayTeam: { logoUrl?: string | null } } | null;
    nextMatch?: { matchId: number; homeTeam: { logoUrl?: string | null }; awayTeam: { logoUrl?: string | null } } | null;
    events?: MatchEvent[] | null;
    matchStats?: any[] | null;
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

export interface SquadPlayer {
    id: number;
    name: string;
    position: string;
    number?: number | null;
    photo?: string | null;
}

export interface PlayerStatRow {
    player?: {
        id: number;
        name: string;
        photo?: string;
        nationality?: string;
        age?: number;
    };
    statistics?: Array<{
        goals?: {
            total?: number;
            assists?: number;
        };
    }>;
    playerId?: number;
    playerName?: string;
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
    appearences?: number;
}

export interface TeamDetailResponse {
    team: {
        id: number;
        name: string;
        slug: string;
        logoUrl?: string;
        country?: string;
        venue?: string;
        city?: string;
    };
    nextMatch?: MatchData | null;
    recentMatches?: MatchData[] | null;
    statsSummary?: {
        overall: { played: number; wins: number; draws: number; losses: number };
        home: { played: number; wins: number; draws: number; losses: number };
        away: { played: number; wins: number; draws: number; losses: number };
        cleanSheets: number;
        homeCleanSheets: number;
        awayCleanSheets: number;
        bttsRate: number;
        homeBttsRate: number;
        awayBttsRate: number;
        failedToScoreRate: number;
        homeFailedToScoreRate: number;
        awayFailedToScoreRate: number;
        ppg: number;
        goalsScoredAvg: number;
        goalsConcededAvg: number;
        cornersAvg: number;
        cardsAvg: number;
        cornersForAvg: number;
        cornersAgainstAvg: number;
        cardsForAvg: number;
        cardsAgainstAvg: number;
        winRate?: number;
    } | null;
    standings?: StandingsRow[] | null;
    squad?: SquadPlayer[] | null;
    topScorers?: PlayerStatRow[] | null;
    topAssists?: PlayerStatRow[] | null;
    detailedStats?: TeamStats | null;
    competitions?: Array<{
        id: number;
        name: string;
        slug: string;
        logoUrl?: string;
        type?: string;
    }> | null;
    nextMatchDetail?: {
        match: MatchData;
        standings: StandingsRow[];
        stats: {
            home: { overall: TeamStatsDetail };
            away: { overall: TeamStatsDetail };
            comparison: Record<string, { home: string | number; away: string | number; value?: number; homeValue?: number; awayValue?: number }>;
        };
    } | null;
    activeLeagueId?: number;
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

export interface InsightItem {
    matchId: number;
    kickoffAt: string;
    status: string;
    league: {
        id: number;
        name: string;
        slug: string;
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
    trend: {
        name: string;
        value: number | string;
        icon?: string;
    };
}

export interface InsightResponse {
    items: InsightItem[];
    total: number;
    page: number;
    pageSize: number;
    date: string;
}
