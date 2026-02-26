/**
 * Predictions API Module
 */

import { fetchAPI } from './client';
import { PredictionsResponse, FeaturedTipsResponse } from './types';

export async function getPredictions(date?: string, region?: string, leagueSlug?: string, marketKey?: string, page?: number, pageSize?: number): Promise<PredictionsResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (region) params.set('region', region);
    if (leagueSlug) params.set('leagueSlug', leagueSlug);
    if (marketKey) params.set('marketKey', marketKey);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    const query = params.toString();
    return fetchAPI<PredictionsResponse>(`/v1/predictions${query ? `?${query}` : ''}`);
}

export async function getLivePredictions(date?: string, page?: number, pageSize?: number): Promise<PredictionsResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    const query = params.toString();
    return fetchAPI<PredictionsResponse>(`/v1/live/predictions${query ? `?${query}` : ''}`);
}

export async function getLiveFeaturedTips(date?: string): Promise<FeaturedTipsResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    const query = params.toString();
    const data = await fetchAPI<any>(`/v1/live/predictions${query ? `?${query}` : ''}`);
    return {
        date: date || new Date().toISOString().split('T')[0],
        tips: data.items || []
    };
}

export async function getFeaturedTips(date?: string): Promise<FeaturedTipsResponse> {
    const dateParam = date || new Date().toISOString().split('T')[0];
    return fetchAPI<FeaturedTipsResponse>(`/v1/tips/featured?date=${dateParam}`);
}

export async function getPredictionDetail(matchId: number): Promise<{ predictions: any[] }> {
    return fetchAPI<{ predictions: any[] }>(`/v1/predictions/${matchId}/detail`);
}
