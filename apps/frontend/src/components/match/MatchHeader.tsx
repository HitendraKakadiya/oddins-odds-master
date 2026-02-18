'use client';

import Link from 'next/link';
import type { MatchData } from '@/lib/api/types';

interface MatchHeaderProps {
  match: MatchData;
  prevMatchId?: number;
  nextMatchId?: number;
}

export default function MatchHeader({ match, prevMatchId, nextMatchId }: MatchHeaderProps) {
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
        <Link 
          href={prevMatchId ? `/match/${prevMatchId}` : '#'}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-16 h-24 rounded-full bg-white border-2 border-slate-200 shadow-lg flex flex-col items-center justify-center transition-all hover:border-brand-indigo hover:scale-105">
            <div className="flex -space-x-2 mb-2">
               <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px]">⚽</div>
               <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px]">⚽</div>
            </div>
            <div className="text-brand-indigo mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 text-center leading-tight">Previous<br/>Match</span>
          </div>
        </Link>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[60%] z-20 hidden xl:block">
        <Link 
          href={nextMatchId ? `/match/${nextMatchId}` : '#'}
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-16 h-24 rounded-full bg-white border-2 border-slate-200 shadow-lg flex flex-col items-center justify-center transition-all hover:border-brand-indigo hover:scale-105">
            <div className="flex -space-x-2 mb-2">
               <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px]">⚽</div>
               <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px]">⚽</div>
            </div>
            <div className="text-brand-indigo mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 text-center leading-tight">Next<br/>Match</span>
          </div>
        </Link>
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
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-white hover:border-brand-indigo transition-all group">
            <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-indigo group-hover:fill-brand-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-black text-slate-500 group-hover:text-brand-indigo">Favourite this Match</span>
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
                  <div className="absolute inset-0 border-[6px] border-orange-500 rounded-t-full" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
               </div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  5 out of 10
                  <svg className="w-3 h-3 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
               </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 line-clamp-2">{match.homeTeam.name}</h2>
          </div>

          {/* VS & Match Info */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 relative z-10 order-1 md:order-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-indigo/5 rounded-full blur-3xl -z-10"></div>
            
            <h1 className="text-lg md:text-xl font-black text-slate-800 text-center mb-4 max-w-[280px]">
              {match.homeTeam.name} vs {match.awayTeam.name} stats, standings and H2H
            </h1>
            
            <div className="flex flex-col items-center gap-1 mb-6">
              <div className="text-sm font-black text-slate-400 capitalize">{formattedDate}</div>
              <div className="text-lg font-black text-slate-800 tracking-tight">{formattedTime}</div>
            </div>

            {match.status === 'LIVE' || match.status === 'FT' ? (
               <div className="flex items-center gap-6 mb-4">
                  <span className="text-5xl md:text-6xl font-black text-slate-900">{match.score.home}</span>
                  <div className="flex flex-col items-center">
                     <span className="text-xs font-black text-slate-200 italic mb-1 uppercase tracking-widest">VS</span>
                     <div className={`px-3 py-1 rounded-full ${match.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'} text-[10px] font-black uppercase tracking-widest`}>
                        {match.status === 'LIVE' ? `LIVE ${match.elapsed}'` : 'FINISHED'}
                     </div>
                  </div>
                  <span className="text-5xl md:text-6xl font-black text-slate-900">{match.score.away}</span>
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
                  <div className="absolute inset-0 border-[6px] border-red-500 rounded-t-full" style={{ clipPath: 'inset(0 0 0 70%)' }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
               </div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  3 out of 10
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
