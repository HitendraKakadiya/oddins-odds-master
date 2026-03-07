'use client';

import Link from 'next/link';
import { MatchData } from '@/lib/api/types';

interface LeagueMatchListProps {
  title: string;
  matches: MatchData[];
  type: 'results' | 'fixtures';
}

export default function LeagueMatchList({ title, matches, type }: LeagueMatchListProps) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">{title}</h3>
        <Link href="#" className="text-xs font-black text-brand-emerald hover:underline flex items-center gap-1">
           View More
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
           </svg>
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {matches.length === 0 ? (
          <div className="p-12 text-center">
             <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No matches found</p>
          </div>
        ) : (
          matches.map((m) => (
            <div key={m.matchId} className="px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-2 hover:bg-slate-50/50 transition-all group">
              {/* Date & Time */}
              <div className="flex flex-col gap-0.5 min-w-[100px] shrink-0 items-center sm:items-start">
                <span className="text-[11px] font-black text-slate-800 tracking-tight">
                  {new Date(m.kickoffAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(m.kickoffAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>

              {/* Matchup */}
              <div className="flex-1 flex items-center justify-center gap-2 md:gap-4 w-full">
                {/* Home Team */}
                <div className="flex-1 flex items-center gap-3 justify-end min-w-0">
                  <span className="text-sm font-black text-slate-700 truncate group-hover:text-brand-emerald transition-colors">
                    {m.homeTeam.name}
                  </span>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 md:p-2 shadow-sm shrink-0 overflow-hidden">
                    {m.homeTeam.logoUrl ? (
                      <img src={m.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs font-black text-slate-300">{m.homeTeam.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                </div>

                {/* Score / VS */}
                <div className="shrink-0">
                  {type === 'results' ? (
                    <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/60 min-w-[64px] justify-center shadow-inner tabular-nums">
                      <span className="text-sm font-black text-brand-midnight">{m.score.home ?? 0}</span>
                      <span className="text-slate-300 font-bold">-</span>
                      <span className="text-sm font-black text-brand-midnight">{m.score.away ?? 0}</span>
                    </div>
                  ) : (
                    <div className="bg-brand-emerald/5 px-3 py-1.5 rounded-lg border border-brand-emerald/10 text-brand-emerald text-[10px] font-black italic min-w-[64px] text-center">
                      VS
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center gap-3 justify-start min-w-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 md:p-2 shadow-sm shrink-0 overflow-hidden">
                    {m.awayTeam.logoUrl ? (
                      <img src={m.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs font-black text-slate-300">{m.awayTeam.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-black text-slate-700 truncate group-hover:text-brand-emerald transition-colors">
                    {m.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Action - More subtle/Responsive */}
              <div className="shrink-0 flex items-center justify-center">
                 <Link 
                   href={`/match/${m.matchId}`}
                   className="w-8 h-8 md:w-9 md:h-9 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-brand-emerald hover:text-white transition-all shadow-sm border border-slate-100"
                   title="Match Detail"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                   </svg>
                 </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
