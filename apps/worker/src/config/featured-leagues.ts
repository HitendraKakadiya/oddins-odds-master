/**
 * Featured Leagues Configuration
 * 
 * These are the top 15 leagues we'll sync data for.
 * Add more leagues here as needed.
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
 * 
 * Strategy: Focus on major European leagues + international competitions
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

/**
 * Historical data strategy: 24 months (3 seasons)
 * 
 * This covers:
 * - 2023-2024 season (last season - completed)
 * - 2024-2025 season (current season - in progress)
 * - 2025-2026 season (upcoming fixtures)
 */
export const SEASONS_TO_SYNC = [2023, 2024, 2025];

/**
 * Get all season/league combinations to sync
 */
export const getSyncCombinations = () => {
  const combinations: { leagueId: number; season: number; leagueName: string }[] = [];
  
  for (const league of FEATURED_LEAGUES) {
    for (const season of SEASONS_TO_SYNC) {
      combinations.push({
        leagueId: league.id,
        season,
        leagueName: league.name,
      });
    }
  }
  
  return combinations;
};

/**
 * Total API calls for full historical sync:
 * 15 leagues × 3 seasons = 45 calls
 * 
 * This is only 0.06% of the 75,000 daily limit!
 */
export const ESTIMATED_API_CALLS = FEATURED_LEAGUES.length * SEASONS_TO_SYNC.length;

console.log(`Featured Leagues Config:`);
console.log(`  - Leagues: ${FEATURED_LEAGUES.length}`);
console.log(`  - Seasons: ${SEASONS_TO_SYNC.join(', ')}`);
console.log(`  - Total combinations: ${getSyncCombinations().length}`);
console.log(`  - Estimated API calls: ${ESTIMATED_API_CALLS}`);


