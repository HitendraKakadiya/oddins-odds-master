'use client';

import { useIsMounted } from '@/hooks/useIsMounted';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiPlayCircle, FiTv, FiLoader, FiGrid } from 'react-icons/fi';
import Link from 'next/link';
import { getLiveTodayMatches } from '@/lib/api/matches';
import { MatchData } from '@/lib/api/types';

export default function ComboSidebar() {
    const [matches, setMatches] = useState<MatchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    const isMounted = useIsMounted();

    const fetchStreams = useCallback(async (pageNum: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            // Use getLiveTodayMatches to fetch from 3rd party API instead of DB
            const data = await getLiveTodayMatches(today, pageNum, 10);
            
            const newMatches = data.matches || [];
            if (isInitial) {
                setMatches(newMatches);
            } else {
                setMatches(prev => [...prev, ...newMatches]);
            }
            
            setHasMore(newMatches.length === 10);
        } catch (error) {
            console.error('Failed to fetch matches for sidebar:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchStreams(1, true);
    }, [fetchStreams]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    setPage(prev => {
                        const next = prev + 1;
                        fetchStreams(next);
                        return next;
                    });
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading, fetchStreams]);

    if (loading && page === 1) {
        return (
            <aside className="w-full">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-12 flex flex-col items-center justify-center text-slate-400 h-[850px]">
                    <FiLoader className="w-8 h-8 animate-spin mb-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading Streams...</span>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full overflow-hidden">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[850px]">
                {/* Header - Fixed */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
                    <h3 className="font-black text-slate-900 flex items-center gap-2">
                        <FiTv className="text-brand-pink" />
                        Today&apos;s Streams
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></span>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
                    {matches.length === 0 && !loading ? (
                         <div className="p-12 flex flex-col items-center justify-center text-slate-400 h-full">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <FiTv className="w-6 h-6 text-slate-300" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-center">No Streams Scheduled</span>
                            <p className="text-[10px] text-slate-400 mt-2 text-center px-4">Check back later for live match coverage.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100/50">
                            {matches.map((match, idx) => (
                                <div key={`${match.matchId}-${idx}`} className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors group/match">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 mb-4 uppercase tracking-[0.15em]">
                                        <div className="w-4 h-4 rounded bg-brand-emerald/10 flex items-center justify-center">
                                            <FiGrid className="w-2.5 h-2.5 text-brand-emerald" />
                                        </div>
                                        {match.league.name}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center p-1 relative z-10 shadow-sm border border-slate-100">
                                                    <img src={match.homeTeam.logoUrl || 'https://media.api-sports.io/football/teams/placeholder.png'} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-700 group-hover/match:text-brand-emerald transition-colors line-clamp-1">{match.homeTeam.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300 tabular-nums shrink-0 ml-2">
                                                {isMounted ? new Date(match.kickoffAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center p-1 relative z-10 shadow-sm border border-slate-100">
                                                    <img src={match.awayTeam.logoUrl || 'https://media.api-sports.io/football/teams/placeholder.png'} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-700 group-hover/match:text-brand-emerald transition-colors line-clamp-1">{match.awayTeam.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Link 
                                            href={`/match/${match.matchId}`}
                                            className="bg-brand-pink text-white text-[10px] font-black py-3 rounded-xl text-center hover:bg-brand-pink/90 transition-all shadow-md shadow-brand-pink/10 active:scale-[0.98]"
                                        >
                                            PREDICTION
                                        </Link>
                                        <Link 
                                            href="/betting-sites"
                                            className="border-2 border-slate-100 text-slate-400 text-[10px] font-black py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 hover:text-brand-pink hover:border-brand-pink/20 transition-all active:scale-[0.98]"
                                        >
                                            <FiPlayCircle className="w-3.5 h-3.5" />
                                            WATCH
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Infinite Scroll Loader */}
                            <div ref={loaderRef} className="p-8 flex justify-center">
                                {loadingMore && <FiLoader className="w-6 h-6 animate-spin text-brand-emerald/40" />}
                                {!hasMore && matches.length > 0 && (
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">End of today&apos;s schedule</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
