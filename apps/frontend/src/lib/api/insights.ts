/**
 * Insights API Module (formerly Trends)
 */

import { fetchAPI } from './client';
import { InsightResponse } from './types';

/**
 * Fetch match insights for a specific date
 * @param date YYYY-MM-DD
 * @param page Page number
 * @param pageSize Number of items per page
 * @returns 
 */
export async function getInsights(date?: string, page?: number, pageSize?: number): Promise<InsightResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    const query = params.toString();
    return fetchAPI<InsightResponse>(`/v1/insights${query ? `?${query}` : ''}`);
}

/**
 * Fetch hot stats (high probability patterns)
 * @param market Market ID (btts, over25, etc.)
 * @param date YYYY-MM-DD
 * @returns 
 */
export async function getHotStats(market?: string, date?: string, sortBy?: string, leagueId?: string, page?: number, pageSize?: number): Promise<{ matches: any[], leagues: any[], total: number, page: number, pageSize: number }> {
    const params = new URLSearchParams();
    if (market) params.set('market', market);
    if (date) params.set('date', date);
    if (sortBy) params.set('sortBy', sortBy);
    if (leagueId && leagueId !== 'all') params.set('leagueId', leagueId);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    const query = params.toString();
    return fetchAPI<{ matches: any[], leagues: any[], total: number, page: number, pageSize: number }>(`/v1/hot-stats${query ? `?${query}` : ''}`);
}
