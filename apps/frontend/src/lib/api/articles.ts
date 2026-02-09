/**
 * Articles API Module
 */

import { fetchAPI } from './client';
import { ArticlesResponse } from './types';

export async function getArticles(type: 'academy' | 'blog', category?: string, page?: number, pageSize?: number): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set('type', type);
    if (category) searchParams.set('category', category);
    if (page) searchParams.set('page', page.toString());
    if (pageSize) searchParams.set('pageSize', pageSize.toString());

    return fetchAPI<ArticlesResponse>(`/v1/articles?${searchParams.toString()}`);
}

export async function getArticleDetail(type: 'academy' | 'blog', slug: string) {
    return fetchAPI(`/v1/articles/${type}/${slug}`);
}
