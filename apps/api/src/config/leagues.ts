/**
 * Featured Leagues Configuration (Local copy to avoid monorepo path issues)
 */

export interface FeaturedLeague {
    id: number;
    name: string;
    country: string;
    season: number;
    logo?: string;
}

export const FEATURED_LEAGUES: FeaturedLeague[] = [
    { id: 39, name: 'Premier League', country: 'England', season: 2024 },
    { id: 40, name: 'Championship', country: 'England', season: 2024 },
    { id: 140, name: 'La Liga', country: 'Spain', season: 2024 },
    { id: 141, name: 'Segunda División', country: 'Spain', season: 2024 },
    { id: 78, name: 'Bundesliga', country: 'Germany', season: 2024 },
    { id: 135, name: 'Serie A', country: 'Italy', season: 2024 },
    { id: 61, name: 'Ligue 1', country: 'France', season: 2024 },
    { id: 2, name: 'UEFA Champions League', country: 'World', season: 2024 },
    { id: 3, name: 'UEFA Europa League', country: 'World', season: 2024 },
    { id: 848, name: 'UEFA Europa Conference League', country: 'World', season: 2024 },
    { id: 94, name: 'Primeira Liga', country: 'Portugal', season: 2024 },
    { id: 88, name: 'Eredivisie', country: 'Netherlands', season: 2024 },
    { id: 203, name: 'Super Lig', country: 'Turkey', season: 2024 },
    { id: 235, name: 'Premier League', country: 'Russia', season: 2024 },
    { id: 71, name: 'Série A', country: 'Brazil', season: 2024 },
];

export const getFeaturedLeagueIds = (): number[] => FEATURED_LEAGUES.map(l => l.id);
