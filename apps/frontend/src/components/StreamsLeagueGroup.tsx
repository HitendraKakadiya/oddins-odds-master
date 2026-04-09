'use client';

import { useState } from 'react';
import StreamsMatchRow from './StreamsMatchRow';
import type { StreamItem } from '@/lib/api';

interface StreamsLeagueGroupProps {
  league: {
    id: number;
    name: string;
    logoUrl?: string | null;
  };
  matches: StreamItem[];
  date?: string; // Optional date for display
}

export default function StreamsLeagueGroup({ league, matches, date }: StreamsLeagueGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const displayDate = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Today';
  const label = `${matches.length} Match${matches.length !== 1 ? 'es' : ''} ${date ? `on ${displayDate}` : 'Today'}`;

  return (
    <div className="mb-8 rounded-[28px] overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/30 transition-all duration-500 hover:shadow-slate-200/50">
      <div 
        className="bg-brand-emerald p-3.5 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-emerald-600 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md border border-brand-emerald/10 overflow-hidden p-2">
            {league.logoUrl ? (
              <img src={league.logoUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl">⚽</span>
            )}
          </div>
          <div>
            <h3 className="font-black text-white text-base tracking-tight leading-tight">{league.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[9px] font-black text-emerald-50/80 uppercase tracking-widest leading-none">{label}</span>
            </div>
          </div>
        </div>
        
        <button className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-emerald transition-all backdrop-blur-md border border-white/10 shadow-sm">
          {isExpanded ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>
      
      <div 
        className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="divide-y divide-slate-50">
            {matches.map((match) => (
              <StreamsMatchRow key={match.matchId} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

