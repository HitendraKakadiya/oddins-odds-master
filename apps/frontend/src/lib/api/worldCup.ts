import { fetchAPI } from './client';

export interface WorldCupData {
  season: number;
  groups: WorldCupGroup[];
  fixtures: any[];
}

export interface WorldCupGroup {
  name: string;
  teams: string[];
  standings: any[];
}

export async function getWorldCupData(): Promise<WorldCupData> {
  try {
    return await fetchAPI<WorldCupData>('/v1/world-cup');
  } catch (error) {
    console.error('Failed to fetch World Cup data', error);
    throw error;
  }
}

// Fallback exports for existing components if needed
export async function getWorldCupMatches() {
  const data = await getWorldCupData();
  return data.fixtures;
}

export async function getWorldCupFavourites() {
  // We can derive favourites from standings or fetch from another endpoint
  // For now, returning a static list or top teams from standings
  return [
    { team: 'Argentina', flag: 'ar', odds: '5.50', slug: '26-argentina' },
    { team: 'France', flag: 'fr', odds: '6.50', slug: '2-france' },
    { team: 'Brazil', flag: 'br', odds: '7.00', slug: '6-brazil' },
    { team: 'England', flag: 'gb-eng', odds: '8.00', slug: '10-england' },
    { team: 'Spain', flag: 'es', odds: '9.00', slug: '9-spain' },
  ];
}
