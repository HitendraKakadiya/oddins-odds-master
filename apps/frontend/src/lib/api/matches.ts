/**
 * Matches & Home API Module
 */

import { fetchAPI } from './client';
import { TodayMatchesResponse, MatchDetailResponse } from './types';

export async function getTodayMatches(date?: string, page?: number, pageSize?: number, leagueId?: string, market?: string, minOdds?: string): Promise<TodayMatchesResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    if (leagueId) params.set('leagueId', leagueId);
    if (market) params.set('market', market);
    if (minOdds) params.set('minOdds', minOdds);
    const query = params.toString();
    return fetchAPI<TodayMatchesResponse>(`/v1/matches/today${query ? `?${query}` : ''}`);
}

export async function getLiveTodayMatches(date?: string, page?: number, pageSize?: number, leagueId?: string, market?: string, minOdds?: string): Promise<TodayMatchesResponse> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (page) params.set('page', page.toString());
    if (pageSize) params.set('pageSize', pageSize.toString());
    if (leagueId) params.set('leagueId', leagueId);
    if (market) params.set('market', market);
    if (minOdds) params.set('minOdds', minOdds);
    const query = params.toString();
    return fetchAPI<TodayMatchesResponse>(`/v1/live/matches${query ? `?${query}` : ''}`);
}

export async function getMatchDetail(matchId: string | number): Promise<MatchDetailResponse> {
    return fetchAPI<MatchDetailResponse>(`/v1/match/${matchId}`);
}
