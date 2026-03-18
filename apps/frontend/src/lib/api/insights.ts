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
