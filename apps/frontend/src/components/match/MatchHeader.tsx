'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { MatchData } from '@/lib/api/types';

interface MatchHeaderProps {
  match: MatchData;
  prevMatch?: { matchId: number; homeTeam: { logoUrl?: string | null }; awayTeam: { logoUrl?: string | null } } | null;
  nextMatch?: { matchId: number; homeTeam: { logoUrl?: string | null }; awayTeam: { logoUrl?: string | null } } | null;
  stats?: {
    home: { overall: { winRate: number } };
    away: { overall: { winRate: number } };
  } | null;
}

export default function MatchHeader({ match, prevMatch, nextMatch, stats }: MatchHeaderProps) {
  const router = useRouter();
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const handlePrevClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setIsLoadingPrev(true);
    router.push(`/match/${id}`);
  };

  const handleNextClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setIsLoadingNext(true);
    router.push(`/match/${id}`);
  };

  const kickoffTime = new Date(match.kickoffAt);
  const formattedDate = kickoffTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = kickoffTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="relative mb-8">
      {/* Floating Navigation */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[60%] z-20 hidden xl:block">
        {prevMatch && (
            <button 
              onClick={(e) => handlePrevClick(e, prevMatch.matchId)}
              disabled={isLoadingPrev}
              className="group flex flex-col items-center w-14 h-32 rounded-[28px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 justify-between py-2 transition-all duration-300 hover:border-brand-emerald hover:shadow-brand-emerald/20 hover:-translate-x-2 focus:outline-none"
            >
              <div className="flex flex-col -space-y-2 mt-2">
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm z-10">
                  {prevMatch.homeTeam?.logoUrl ? (
                    <img src={prevMatch.homeTeam.logoUrl} className="w-full h-full object-contain p-1" />
                  ) : <span className="text-xs">⚽</span>}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                  {prevMatch.awayTeam?.logoUrl ? (
                    <img src={prevMatch.awayTeam.logoUrl} className="w-full h-full object-contain p-1" />
                  ) : <span className="text-xs">⚽</span>}
                </div>
              </div>
              
              <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center transition-colors mb-1 ${isLoadingPrev ? 'bg-brand-emerald text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-emerald group-hover:text-white'}`}>
                {isLoadingPrev ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-4 h-4 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                )}
              </div>
              
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">Previous</span>
              </div>
            </button>
        )}
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[60%] z-20 hidden xl:block">
        {nextMatch && (
            <button 
              onClick={(e) => handleNextClick(e, nextMatch.matchId)}
              disabled={isLoadingNext}
              className="group flex flex-col items-center w-14 h-32 rounded-[28px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 justify-between py-2 transition-all duration-300 hover:border-brand-emerald hover:shadow-brand-emerald/20 hover:translate-x-2 focus:outline-none"
            >
              <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center transition-colors mt-1 ${isLoadingNext ? 'bg-brand-emerald text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-emerald group-hover:text-white'}`}>
                {isLoadingNext ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-4 h-4 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                )}
              </div>
              
              <div className="flex flex-col -space-y-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm z-10">
                  {nextMatch.homeTeam?.logoUrl ? (
                    <img src={nextMatch.homeTeam.logoUrl} className="w-full h-full object-contain p-1" />
                  ) : <span className="text-xs">⚽</span>}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                  {nextMatch.awayTeam?.logoUrl ? (
                    <img src={nextMatch.awayTeam.logoUrl} className="w-full h-full object-contain p-1" />
                  ) : <span className="text-xs">⚽</span>}
                </div>
              </div>

              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">Next</span>
              </div>
            </button>
        )}
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Top Bar: League & Favorite */}
        <div className="px-8 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-1.5 shadow-sm">
              {match.league.logoUrl ? (
                <img src={match.league.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-base">⚽</span>
              )}
            </div>
            <div>
              <div className="text-sm font-black text-slate-800">{match.league.country.name}</div>
              <div className="text-[11px] font-bold text-slate-400">{match.league.name}</div>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-white hover:border-brand-emerald transition-all group">
            <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-emerald group-hover:fill-brand-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-black text-slate-500 group-hover:text-brand-emerald">Favourite this Match</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3 order-2 md:order-1">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 md:p-6 shadow-sm mb-6 group-hover:scale-105 transition-transform">
              {match.homeTeam.logoUrl ? (
                <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-full h-full object-contain drop-shadow-md" />
              ) : (
                <span className="text-4xl">⚽</span>
              )}
            </div>
            
            {/* Strength Gauge Placeholder */}
            <div className="flex flex-col items-center mb-4">
               <div className="relative w-24 h-12 overflow-hidden mb-2">
                  <div className="absolute inset-0 border-[6px] border-slate-100 rounded-t-full"></div>
                  <div className="absolute inset-0 border-[6px] border-orange-500 rounded-t-full" style={{ clipPath: `inset(0 ${100 - (stats?.home.overall.winRate || 50)}% 0 0)` }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
               </div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  {(stats?.home.overall.winRate ? (stats.home.overall.winRate / 10).toFixed(1) : '5.0')} out of 10
                  <svg className="w-3 h-3 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
               </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 line-clamp-2">{match.homeTeam.name}</h2>
          </div>

          {/* VS & Match Info */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 relative z-10 order-1 md:order-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-emerald/5 rounded-full blur-3xl -z-10"></div>
            
            <h1 className="text-lg md:text-xl font-black text-slate-800 text-center mb-4 max-w-[280px]">
              {match.homeTeam.name} vs {match.awayTeam.name} stats, standings and H2H
            </h1>
            
            <div className="flex flex-col items-center gap-1 mb-6">
              <div className="text-sm font-black text-slate-400 capitalize">{formattedDate}</div>
              <div className="text-lg font-black text-slate-800 tracking-tight">{formattedTime}</div>
            </div>

              {['LIVE', '1H', 'HT', '2H', 'ET', 'BT', 'P', 'FT', 'AET', 'PEN'].includes(match.status) ? (
               <div className="flex items-center gap-6 mb-4">
                  <span className="text-5xl md:text-6xl font-black text-slate-900">{match.score.home ?? 0}</span>
                  <div className="flex flex-col items-center">
                     <span className="text-xs font-black text-slate-200 italic mb-1 uppercase tracking-widest">VS</span>
                     <div className={`px-3 py-1 rounded-full ${['LIVE', '1H', 'HT', '2H', 'ET', 'BT', 'P'].includes(match.status) ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'} text-[10px] font-black uppercase tracking-widest`}>
                        {['LIVE', '1H', 'HT', '2H', 'ET', 'BT', 'P'].includes(match.status) ? `LIVE ${match.elapsed}'` : 'FINISHED'}
                     </div>
                  </div>
                  <span className="text-5xl md:text-6xl font-black text-slate-900">{match.score.away ?? 0}</span>
               </div>
            ) : (
               <div className="w-16 h-16 rounded-3xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center shadow-inner mb-4">
                  <span className="text-xl font-black text-slate-300 italic">VS</span>
               </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3 order-3">
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 md:p-6 shadow-sm mb-6 group-hover:scale-105 transition-transform">
              {match.awayTeam.logoUrl ? (
                <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-full h-full object-contain drop-shadow-md" />
              ) : (
                <span className="text-4xl">⚽</span>
              )}
            </div>

            {/* Strength Gauge Placeholder */}
            <div className="flex flex-col items-center mb-4">
               <div className="relative w-24 h-12 overflow-hidden mb-2">
                  <div className="absolute inset-0 border-[6px] border-slate-100 rounded-t-full"></div>
                  <div className="absolute inset-0 border-[6px] border-red-500 rounded-t-full" style={{ clipPath: `inset(0 0 0 ${100 - (stats?.away.overall.winRate || 50)}%)` }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
               </div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  {(stats?.away.overall.winRate ? (stats.away.overall.winRate / 10).toFixed(1) : '5.0')} out of 10
                  <svg className="w-3 h-3 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
               </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 line-clamp-2">{match.awayTeam.name}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
