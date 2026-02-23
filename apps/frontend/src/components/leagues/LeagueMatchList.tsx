'use client';

import Link from 'next/link';

interface MatchItem {
  id: number;
  kickoffAt: string;
  homeTeam: { name: string; logoUrl?: string };
  awayTeam: { name: string; logoUrl?: string };
  homeScore?: number | null;
  awayScore?: number | null;
  status: string;
}

interface LeagueMatchListProps {
  title: string;
  matches: MatchItem[];
  type: 'results' | 'fixtures';
}

export default function LeagueMatchList({ title, matches, type }: LeagueMatchListProps) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">{title}</h3>
        <Link href="#" className="text-xs font-black text-brand-indigo hover:underline flex items-center gap-1">
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
            <div key={m.id} className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors group">
              {/* Date & Time */}
              <div className="flex flex-col gap-1 w-full md:w-48 shrink-0 items-center md:items-start">
                <span className="text-xs font-black text-slate-400 uppercase">
                  {new Date(m.kickoffAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[10px] font-bold text-slate-300">
                  {new Date(m.kickoffAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>

              {/* Matchup */}
              <div className="flex-1 flex items-center justify-center gap-4 md:gap-12 w-full">
                <div className="flex items-center gap-4 w-[40%] justify-end">
                  <span className="text-sm md:text-base font-black text-slate-700 text-right truncate group-hover:text-brand-indigo transition-colors">{m.homeTeam.name}</span>
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                    <img src={m.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>

                {type === 'results' ? (
                  <div className="flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200 min-w-[100px] justify-center shadow-inner">
                    <span className="text-xl font-black text-brand-dark-blue">{m.homeScore ?? 0}</span>
                    <span className="text-slate-300 font-black">-</span>
                    <span className="text-xl font-black text-brand-dark-blue">{m.awayScore ?? 0}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                     <div className="bg-brand-indigo/5 px-4 py-2 rounded-xl border border-brand-indigo/10 text-brand-indigo text-sm font-black italic">
                        VS
                     </div>
                  </div>
                )}

                <div className="flex items-center gap-4 w-[40%] justify-start">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                    <img src={m.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm md:text-base font-black text-slate-700 text-left truncate group-hover:text-brand-indigo transition-colors">{m.awayTeam.name}</span>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-32 flex md:justify-end justify-center">
                 <Link 
                   href={`/predictions/${m.id}`}
                   className="bg-brand-indigo/10 text-brand-indigo px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-indigo hover:text-white transition-all shadow-sm"
                 >
                   See Prediction
                 </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
