/**
 * Streams API Module
 */

import { fetchAPI } from './client';
import { StreamsResponse } from './types';

export async function getStreams(date?: string, region?: string, page: number = 1, pageSize: number = 20): Promise<StreamsResponse> {
    const searchParams = new URLSearchParams();
    if (date) searchParams.set('date', date);
    if (region) searchParams.set('region', region);
    searchParams.set('page', page.toString());
    searchParams.set('pageSize', pageSize.toString());

    const query = searchParams.toString();
    return fetchAPI<StreamsResponse>(`/v1/streams${query ? `?${query}` : ''}`);
}
