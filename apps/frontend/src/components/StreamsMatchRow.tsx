'use client';

import { useIsMounted } from '@/hooks/useIsMounted';
import Link from 'next/link';
import type { StreamItem } from '@/lib/api';

interface StreamsMatchRowProps {
  match: StreamItem;
}

export default function StreamsMatchRow({ match }: StreamsMatchRowProps) {
  const isMounted = useIsMounted();
  const kickoffTime = isMounted 
    ? new Date(match.kickoffAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    : '--:--';

  return (
    <div className="group flex items-center justify-between p-3 sm:p-4 px-2 sm:px-6 hover:bg-slate-50/80 transition-all duration-300 relative">
      {/* Time and Status */}
      <div className="flex flex-col items-center justify-center min-w-[55px] sm:min-w-[70px] border-r border-slate-100 pr-1.5 sm:pr-4 shrink-0">
        <span className="text-[13px] font-black text-slate-900 tracking-tight">{kickoffTime}</span>
        {match.status && match.status !== 'NS' && (
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
            {match.status === 'LIVE' || match.status?.includes('1') || match.status?.includes('2') ? 'LIVE' : match.status}
          </span>
        )}
      </div>

      {/* Teams Section */}
      <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-8 px-1 sm:px-4 min-w-0">
        {/* Home Team */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-1 min-w-0">
          <span className="text-[12px] sm:text-[14px] font-bold text-slate-800 truncate text-right">{match.homeTeam.name}</span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center p-1 sm:p-1.5 shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-300">
            {match.homeTeam.logoUrl ? (
              <img src={match.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl">⚽</span>
            )}
          </div>
        </div>

        {/* Score or VS */}
        <div className="flex flex-col items-center justify-center min-w-[50px]">
          {match.score && (match.score.home !== null || match.score.away !== null) ? (
            <div className="bg-slate-900 text-white px-2 sm:px-3 py-1 rounded-lg text-[12px] sm:text-[14px] font-black tracking-tighter shadow-sm whitespace-nowrap">
              {match.score.home ?? 0} - {match.score.away ?? 0}
            </div>
          ) : (
            <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-start gap-1.5 sm:gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center p-1 sm:p-1.5 shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-300">
            {match.awayTeam.logoUrl ? (
              <img src={match.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl">⚽</span>
            )}
          </div>
          <span className="text-[12px] sm:text-[14px] font-bold text-slate-800 truncate">{match.awayTeam.name}</span>
        </div>
      </div>

      {/* Where to Watch Button */}
      <div className="flex items-center justify-end min-w-fit sm:min-w-[140px] pl-1.5 sm:pl-4 shrink-0">
        <Link 
          href="/betting-sites"
          className="bg-brand-emerald text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-[18px] text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 flex items-center gap-1.5 sm:gap-2 group/btn"
        >
          <span className="hidden sm:inline">Watch</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

