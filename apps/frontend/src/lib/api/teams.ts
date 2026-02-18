/**
 * Teams API Module
 */

import { fetchAPI } from './client';
import { TeamDetailResponse, TabResponse } from './types';

export async function getFeaturedTeams(): Promise<any[]> {
    return fetchAPI<any[]>('/v1/teams/featured');
}

export async function getTeams(query?: string, leagueSlug?: string) {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('query', query);
    if (leagueSlug) searchParams.set('leagueSlug', leagueSlug);

    const queryStr = searchParams.toString();
    return fetchAPI(`/v1/teams${queryStr ? `?${queryStr}` : ''}`);
}

export async function getTeamDetail(teamSlug: string): Promise<TeamDetailResponse> {
    return fetchAPI<TeamDetailResponse>(`/v1/team/${teamSlug}`);
}

export async function getTeamTab(teamSlug: string, tab: string): Promise<TabResponse> {
    return fetchAPI<TabResponse>(`/v1/team/${teamSlug}/${tab}`);
}
