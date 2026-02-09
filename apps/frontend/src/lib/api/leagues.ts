/**
 * Leagues API Module
 */

import { fetchAPI } from './client';
import { LeaguesResponse, LeagueDetailResponse } from './types';

export async function getLeagues(): Promise<LeaguesResponse[]> {
    return fetchAPI<LeaguesResponse[]>('/v1/leagues');
}

export async function getLeagueDetail(countrySlug: string, leagueSlug: string): Promise<LeagueDetailResponse> {
    return fetchAPI<LeagueDetailResponse>(`/v1/league/${countrySlug}/${leagueSlug}`);
}
