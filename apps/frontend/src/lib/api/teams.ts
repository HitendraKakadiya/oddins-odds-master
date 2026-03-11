/**
 * Teams API Module
 */

import { fetchAPI } from './client';
import { TeamDetailResponse, TabResponse, Team } from './types';
import { MOCK_TEAMS, MOCK_TEAM_DETAIL, MOCK_TAB } from './mockTeams';

export async function getFeaturedTeams(): Promise<Team[]> {
    return fetchAPI<Team[]>('/v1/teams/featured');
    // return MOCK_TEAMS;
}

export async function getTeams(_query?: string, _leagueSlug?: string, _leagueId?: number) {
    // const searchParams = new URLSearchParams();
    // if (query) searchParams.set('query', query);
    // if (leagueSlug) searchParams.set('leagueSlug', leagueSlug);
    // if (leagueId) searchParams.set('leagueId', leagueId.toString());

    // const queryStr = searchParams.toString();
    // return fetchAPI(`/v1/teams${queryStr ? `?${queryStr}` : ''}`);
    return MOCK_TEAMS;
}

export async function getTeamDetail(_teamSlug: string, _leagueId?: string): Promise<TeamDetailResponse> {
    // const url = `/v1/team/${teamSlug}${leagueId ? `?league=${leagueId}` : ''}`;
    // return fetchAPI<TeamDetailResponse>(url);
    return MOCK_TEAM_DETAIL;
}

export async function getTeamTab(_teamSlug: string, _tab: string): Promise<TabResponse> {
    // return fetchAPI<TabResponse>(`/v1/team/${teamSlug}/${tab}`);
    return MOCK_TAB;
}
