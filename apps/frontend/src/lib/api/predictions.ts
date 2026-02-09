/**
 * Predictions API Module
 */

import { fetchAPI } from './client';
import { PredictionsResponse, FeaturedTipsResponse } from './types';

export async function getPredictions(params?: {
    date?: string;
    region?: string;
    leagueSlug?: string;
    marketKey?: string;
    page?: number;
    pageSize?: number;
}): Promise<PredictionsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.set('date', params.date);
    if (params?.region) searchParams.set('region', params.region);
    if (params?.leagueSlug) searchParams.set('leagueSlug', params.leagueSlug);
    if (params?.marketKey) searchParams.set('marketKey', params.marketKey);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());

    const query = searchParams.toString();
    return fetchAPI<PredictionsResponse>(`/v1/predictions${query ? `?${query}` : ''}`);
}

export async function getFeaturedTips(date?: string): Promise<FeaturedTipsResponse> {
    const dateParam = date || new Date().toISOString().split('T')[0];
    return fetchAPI<FeaturedTipsResponse>(`/v1/tips/featured?date=${dateParam}`);
}
