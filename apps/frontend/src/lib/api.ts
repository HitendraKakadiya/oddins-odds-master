/**
 * API Client for OddinsOdds
 * Connects to localhost:3001 (local API)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type definitions (matching API responses)
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

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(`Failed to fetch ${endpoint}: ${error}`);
  }
}

// Home Page
export async function getTodayMatches(date?: string): Promise<TodayMatchesResponse> {
  const dateParam = date || new Date().toISOString().split('T')[0];
  return fetchAPI<TodayMatchesResponse>(`/v1/matches/today?date=${dateParam}`);
}

export async function getFeaturedTips(date?: string): Promise<FeaturedTipsResponse> {
  const dateParam = date || new Date().toISOString().split('T')[0];
  return fetchAPI<FeaturedTipsResponse>(`/v1/tips/featured?date=${dateParam}`);
}

// Predictions
export async function getPredictions(params?: {
  date?: string;
  region?: string;
  leagueSlug?: string;
  marketKey?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.set('date', params.date);
  if (params?.region) searchParams.set('region', params.region);
  if (params?.leagueSlug) searchParams.set('leagueSlug', params.leagueSlug);
  if (params?.marketKey) searchParams.set('marketKey', params.marketKey);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());

  const query = searchParams.toString();
  return fetchAPI(`/v1/predictions${query ? `?${query}` : ''}`);
}

// Leagues
export async function getLeagues(): Promise<LeaguesResponse[]> {
  return fetchAPI<LeaguesResponse[]>('/v1/leagues');
}

export async function getLeagueDetail(countrySlug: string, leagueSlug: string) {
  return fetchAPI(`/v1/league/${countrySlug}/${leagueSlug}`);
}

// Teams
export async function getTeams(query?: string, leagueSlug?: string) {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('query', query);
  if (leagueSlug) searchParams.set('leagueSlug', leagueSlug);

  const queryStr = searchParams.toString();
  return fetchAPI(`/v1/teams${queryStr ? `?${queryStr}` : ''}`);
}

export async function getTeamDetail(teamSlug: string) {
  return fetchAPI(`/v1/team/${teamSlug}`);
}

export async function getTeamTab(teamSlug: string, tab: string) {
  return fetchAPI(`/v1/team/${teamSlug}/${tab}`);
}

// Streams
export async function getStreams(date?: string, region?: string) {
  const searchParams = new URLSearchParams();
  if (date) searchParams.set('date', date);
  if (region) searchParams.set('region', region);

  const query = searchParams.toString();
  return fetchAPI(`/v1/streams${query ? `?${query}` : ''}`);
}

// Match Detail
export async function getMatchDetail(matchId: string | number) {
  return fetchAPI(`/v1/match/${matchId}`);
}

// Articles
export async function getArticles(type: 'academy' | 'blog', category?: string, page?: number, pageSize?: number) {
  const searchParams = new URLSearchParams();
  searchParams.set('type', type);
  if (category) searchParams.set('category', category);
  if (page) searchParams.set('page', page.toString());
  if (pageSize) searchParams.set('pageSize', pageSize.toString());

  return fetchAPI(`/v1/articles?${searchParams.toString()}`);
}

export async function getArticleDetail(type: 'academy' | 'blog', slug: string) {
  return fetchAPI(`/v1/articles/${type}/${slug}`);
}

// Search
export async function searchAll(query: string) {
  return fetchAPI(`/v1/search?q=${encodeURIComponent(query)}`);
}

// Meta
export async function getMeta() {
  return fetchAPI('/v1/meta');
}

