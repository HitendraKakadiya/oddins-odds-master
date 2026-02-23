/**
 * Matches & Home API Module
 */

import { fetchAPI } from './client';
import { TodayMatchesResponse, MatchDetailResponse } from './types';

export async function getTodayMatches(date?: string): Promise<TodayMatchesResponse> {
    const dateParam = date || new Date().toISOString().split('T')[0];
    return fetchAPI<TodayMatchesResponse>(`/v1/matches/today?date=${dateParam}`);
}

export async function getMatchDetail(matchId: string | number): Promise<MatchDetailResponse> {
    return fetchAPI<MatchDetailResponse>(`/v1/match/${matchId}`);
}
