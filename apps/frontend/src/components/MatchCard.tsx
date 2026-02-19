'use client';

import { useState } from 'react';
import type { MatchData } from '@/lib/api';

interface MatchProps {
  match: {
    matchId: number;
    kickoffAt: string;
    status: string;
    homeTeam: {
      name: string;
      logoUrl?: string | null;
    };
    awayTeam: {
      name: string;
      logoUrl?: string | null;
    };
    score: {
      home: number | null;
      away: number | null;
    };
    featuredTip?: {
      title: string;
    } | null;
  };
}

export function MatchRow({ match }: MatchProps) {
  const kickoffTime = new Date(match.kickoffAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="bg-white p-4 md:p-6 flex flex-col gap-4 md:gap-5 group hover:bg-slate-50/40 transition-all border-b border-slate-100/60 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
          <div className="text-slate-400 text-[10px] md:text-[11px] font-black w-8 md:w-10 tracking-tighter shrink-0">
            {kickoffTime}
          </div>
          <div className="flex flex-1 items-center gap-2 md:gap-10 justify-center min-w-0">
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end min-w-0">
              <span className="font-bold text-[13px] md:text-sm text-slate-800 group-hover:text-brand-indigo transition-colors truncate">{match.homeTeam.name}</span>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center text-[9px] md:text-[10px] font-black text-slate-400 border border-slate-100 shrink-0 overflow-hidden">
                {match.homeTeam.logoUrl ? (
                  <img src={match.homeTeam.logoUrl} alt="" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                ) : (
                  match.homeTeam.name.substring(0,2).toUpperCase()
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 font-black text-slate-900 bg-slate-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-100/60 shadow-inner shrink-0 tabular-nums text-[13px] md:text-sm">
              <span className={match.score.home !== null ? 'text-brand-pink' : 'text-slate-300'}>{match.score.home ?? '-'}</span>
              <span className="text-slate-200">-</span>
              <span className={match.score.away !== null ? 'text-brand-pink' : 'text-slate-300'}>{match.score.away ?? '-'}</span>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center text-[9px] md:text-[10px] font-black text-slate-400 border border-slate-100 shrink-0 overflow-hidden">
                {match.awayTeam.logoUrl ? (
                  <img src={match.awayTeam.logoUrl} alt="" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                ) : (
                  match.awayTeam.name.substring(0,2).toUpperCase()
                )}
              </div>
              <span className="font-bold text-[13px] md:text-sm text-slate-800 group-hover:text-brand-indigo transition-colors truncate">{match.awayTeam.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center shrink-0">
           <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl hover:bg-slate-100 text-slate-300 hover:text-amber-400 transition-all">
             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
             </svg>
           </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 md:pl-16">
        <div className="flex-1 bg-slate-50/80 rounded-xl p-3 md:p-3.5 text-center italic text-[10px] md:text-[11px] font-bold text-slate-500 border border-slate-100 group-hover:border-brand-indigo/20 transition-all shadow-sm">
          &quot;{match.featuredTip?.title || 'Waiting for prediction analysis...'}&quot;
        </div>
        <div className="flex gap-2 justify-center sm:justify-start">
            <button className="flex-1 sm:flex-none btn-pink !py-2 md:!py-2.5 !px-4 md:!px-5 !rounded-lg md:!rounded-xl text-[9px] md:text-[10px] uppercase font-black tracking-widest shadow-sm border border-brand-pink/10">Prediction</button>
            <button className="flex-1 sm:flex-none bg-slate-50 text-slate-700 font-black py-2 md:py-2.5 px-4 md:px-5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-100 border border-slate-200/60 transition-all shadow-sm">Stats</button>
        </div>
      </div>
    </div>
  );
}

export function LeagueGroup({ leagueName, country, matches, initialOpen = false }: { leagueName: string; country: string; matches: MatchData[]; initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="card !p-0 overflow-hidden mb-6 md:mb-8 !border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="bg-slate-50/50 p-4 md:p-6 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-2.5 bg-brand-indigo/10 rounded-lg md:rounded-xl shadow-inner border border-brand-indigo/5">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-brand-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-[12px] md:text-sm text-slate-900 uppercase tracking-widest leading-tight">{leagueName}</h3>
              <span className="text-[9px] md:text-[10px] bg-slate-200/50 text-slate-500 px-1.5 md:px-2 py-0.5 rounded-full font-bold">{matches.length}</span>
            </div>
            <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{country}</div>
          </div>
        </div>

        <button 
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl bg-white border border-slate-200/60 text-slate-400 hover:text-brand-indigo hover:border-brand-indigo/30 transition-all shadow-sm active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <svg 
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isOpen ? "M20 12H4" : "M12 4v16m8-8H4"} />
          </svg>
        </button>
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {matches.map((match) => (
          <MatchRow key={match.matchId} match={match} />
        ))}
      </div>
    </div>
  );
}

export default MatchRow;
