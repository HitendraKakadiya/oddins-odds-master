'use client';

import { useState } from 'react';
import Image from 'next/image';
import StreamsMatchRow from './StreamsMatchRow';
import type { StreamItem } from '@/lib/api';

interface StreamsLeagueGroupProps {
  league: {
    id: number;
    name: string;
    logoUrl?: string | null;
  };
  matches: StreamItem[];
}

export default function StreamsLeagueGroup({ league, matches }: StreamsLeagueGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4 sm:mb-6 rounded-2xl overflow-hidden bg-white border border-slate-200/60 shadow-sm transition-all duration-300">
      <div 
        className="bg-[#E8E8FF] p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-[#DEDEFF] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {league.logoUrl ? (
            <Image src={league.logoUrl} alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          ) : (
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-brand-indigo shadow-sm">
              ⚽
            </div>
          )}
          <h3 className="font-black text-slate-800 text-xs sm:text-sm tracking-tight">{league.name}</h3>
        </div>
        
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 12H6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            )}
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          {matches.map((match) => (
            <StreamsMatchRow key={match.matchId} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
