/**
 * Teams API Module
 */

import { fetchAPI } from './client';
import { TeamDetailResponse, TabResponse, Team } from './types';

export async function getFeaturedTeams(): Promise<Team[]> {
    return fetchAPI<Team[]>('/v1/teams/featured');
}

export async function getTeams(query?: string, leagueSlug?: string, leagueId?: number) {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('query', query);
    if (leagueSlug) searchParams.set('leagueSlug', leagueSlug);
    if (leagueId) searchParams.set('leagueId', leagueId.toString());

    const queryStr = searchParams.toString();
    return fetchAPI(`/v1/teams${queryStr ? `?${queryStr}` : ''}`);
}

export async function getTeamDetail(teamSlug: string, leagueId?: string): Promise<TeamDetailResponse> {
    const url = `/v1/team/${teamSlug}${leagueId ? `?league=${leagueId}` : ''}`;
    return fetchAPI<TeamDetailResponse>(url);
}

export async function getTeamTab(teamSlug: string, tab: string): Promise<TabResponse> {
    return fetchAPI<TabResponse>(`/v1/team/${teamSlug}/${tab}`);
}
