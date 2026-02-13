/**
 * Leagues API Module
 */

import { fetchAPI } from './client';
import { LeaguesResponse, LeagueDetailResponse } from './types';

export async function getLeagues(page?: number, pageSize?: number): Promise<{ page: number; pageSize: number; total: number; items: LeaguesResponse[] }> {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    const query = params.toString();
    return fetchAPI<{ page: number; pageSize: number; total: number; items: LeaguesResponse[] }>(`/v1/leagues${query ? `?${query}` : ''}`);
}

export async function getLiveLeagues(page?: number, pageSize?: number): Promise<{ page: number; pageSize: number; total: number; items: LeaguesResponse[] }> {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    const query = params.toString();
    return fetchAPI<{ page: number; pageSize: number; total: number; items: LeaguesResponse[] }>(`/v1/live/leagues${query ? `?${query}` : ''}`);
}

export async function getLeagueDetail(countrySlug: string, leagueSlug: string): Promise<LeagueDetailResponse> {
    return fetchAPI<LeagueDetailResponse>(`/v1/league/${countrySlug}/${leagueSlug}`);
}
