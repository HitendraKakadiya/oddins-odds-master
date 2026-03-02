'use client';

import React from 'react';

export type StatsCategory = 
  | 'goals' 
  | 'cards' 
  | '1st-half' 
  | '2nd-half' 
  | 'over-under' 
  | 'clean-sheet' 
  | 'btts' 
  | 'scoring-first';

interface LeagueStatsSubNavProps {
  activeCategory: StatsCategory;
  onCategoryChange: (category: StatsCategory) => void;
}

const categories: { id: StatsCategory; label: string }[] = [
  { id: 'goals', label: 'Goals' },
  { id: 'cards', label: 'Cards' },
  { id: '1st-half', label: '1st Half' },
  { id: '2nd-half', label: '2nd Half' },
  { id: 'over-under', label: 'Over/Under Goals' },
  { id: 'clean-sheet', label: 'Clean Sheet' },
  { id: 'btts', label: 'BTTS' },
  { id: 'scoring-first', label: 'Match Scoring / Conceding First' },
];

export default function LeagueStatsSubNav({ activeCategory, onCategoryChange }: LeagueStatsSubNavProps) {
  return (
    <div className="w-full bg-white border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
      <div className="flex min-w-max px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-6 py-4 text-xs font-black transition-all relative whitespace-nowrap ${
              activeCategory === cat.id
                ? 'text-brand-indigo'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-indigo animate-in fade-in slide-in-from-bottom-1 duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
