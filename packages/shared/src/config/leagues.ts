/**
 * Featured Leagues Configuration
 */

export interface FeaturedLeague {
    id: number;
    name: string;
    country: string;
    season: number; // Current season year
    logo?: string;
}

/**
 * Top 15 leagues for initial MVP
 */
export const FEATURED_LEAGUES: FeaturedLeague[] = [
    // England
    { id: 39, name: 'Premier League', country: 'England', season: 2024 },
    { id: 40, name: 'Championship', country: 'England', season: 2024 },

    // Spain
    { id: 140, name: 'La Liga', country: 'Spain', season: 2024 },
    { id: 141, name: 'Segunda División', country: 'Spain', season: 2024 },

    // Germany
    { id: 78, name: 'Bundesliga', country: 'Germany', season: 2024 },

    // Italy
    { id: 135, name: 'Serie A', country: 'Italy', season: 2024 },

    // France
    { id: 61, name: 'Ligue 1', country: 'France', season: 2024 },

    // International Competitions
    { id: 2, name: 'UEFA Champions League', country: 'World', season: 2024 },
    { id: 3, name: 'UEFA Europa League', country: 'World', season: 2024 },
    { id: 848, name: 'UEFA Europa Conference League', country: 'World', season: 2024 },

    // Other Major Leagues
    { id: 94, name: 'Primeira Liga', country: 'Portugal', season: 2024 },
    { id: 88, name: 'Eredivisie', country: 'Netherlands', season: 2024 },
    { id: 203, name: 'Super Lig', country: 'Turkey', season: 2024 },
    { id: 235, name: 'Premier League', country: 'Russia', season: 2024 },
    { id: 71, name: 'Série A', country: 'Brazil', season: 2024 },
];

/**
 * Get all featured league IDs
 */
export const getFeaturedLeagueIds = (): number[] => {
    return FEATURED_LEAGUES.map(league => league.id);
};

/**
 * Get featured league by ID
 */
export const getFeaturedLeagueById = (id: number): FeaturedLeague | undefined => {
    return FEATURED_LEAGUES.find(league => league.id === id);
};

export const SEASONS_TO_SYNC = [2023, 2024, 2025];
