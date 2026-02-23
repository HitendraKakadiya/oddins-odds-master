/**
 * Miscellaneous API Module
 */

import { fetchAPI } from './client';

export async function searchAll(query: string) {
    return fetchAPI(`/v1/search?q=${encodeURIComponent(query)}`);
}

export async function getMeta() {
    return fetchAPI('/v1/meta');
}
