/**
 * Streams API Module
 */

import { fetchAPI } from './client';
import { StreamsResponse } from './types';

export async function getStreams(region?: string, date?: string, page?: number, pageSize?: number, search?: string, sort?: string): Promise<StreamsResponse> {
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (date) params.set('date', date);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    const query = params.toString();
    return fetchAPI<StreamsResponse>(`/v1/streams${query ? `?${query}` : ''}`);
}

export async function getLiveStreams(date?: string): Promise<StreamsResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    const query = params.toString();
    return fetchAPI<StreamsResponse>(`/v1/live/streams${query ? `?${query}` : ''}`);
}
