'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StandingsRow {
  rank: number;
  team: {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  points: number;
  ppg: number;
  form?: string[];
}

interface LeagueStandingsTableProps {
  standings: StandingsRow[];
}

export default function LeagueStandingsTable({ standings }: LeagueStandingsTableProps) {
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
      {/* Table Header / Filters */}
      <div className="bg-brand-indigo/10 px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">Standing Table</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[160px]">
            <select className="appearance-none w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 transition-all cursor-pointer">
              <option>League Stage</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <FilterButton 
              active={filter === 'overall'} 
              onClick={() => setFilter('overall')} 
              label="Overall" 
            />
            <FilterButton 
              active={filter === 'home'} 
              onClick={() => setFilter('home')} 
              label="Home" 
            />
            <FilterButton 
              active={filter === 'away'} 
              onClick={() => setFilter('away')} 
              label="Away" 
            />
          </div>
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white border-b border-slate-50">
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">#</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Team</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MP</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">W</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">D</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">L</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">GF</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">GA</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">GD</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pts</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PPG</th>
              <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Last 5</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {standings.map((row, idx) => (
              <tr key={row.team.id} className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFF]/40'}`}>
                <td className="px-6 py-5">
                   <span className="text-sm font-black text-slate-400 italic">0{row.rank}</span>
                </td>
                <td className="px-6 py-5">
                  <Link href={`/teams/${row.team.slug}`} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                      <img src={row.team.logoUrl || ''} alt={row.team.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-brand-indigo transition-colors whitespace-nowrap">
                      {row.team.name}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-600 italic">{row.played}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-600">{row.wins}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-500">{row.draws}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-500">{row.losses}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-500">{row.gf}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-500">{row.ga}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-600">{row.gf - row.ga}</td>
                <td className="px-4 py-5 text-center">
                   <div className="inline-block bg-brand-indigo/10 text-brand-indigo px-3 py-1 rounded-lg text-sm font-black">
                      {row.points}
                   </div>
                </td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-500 italic">{(row.ppg || 0).toFixed(2)}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1.5">
                    {(row.form || ['W', 'D', 'L', 'W', 'W']).map((res, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm ${
                          res === 'W' ? 'bg-green-500' : res === 'L' ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                      >
                        {res}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-xs font-black transition-all duration-300 ${
        active 
          ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
      }`}
    >
      {label}
    </button>
  );
}
