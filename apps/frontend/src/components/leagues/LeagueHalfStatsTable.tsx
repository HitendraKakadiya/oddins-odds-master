'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StandingsRow } from '@/lib/api/types';

interface LeagueHalfStatsTableProps {
  standings: StandingsRow[];
  type: 'firstHalf' | 'secondHalf';
}

export default function LeagueHalfStatsTable({ standings, type }: LeagueHalfStatsTableProps) {
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Table Header */}
      <div className="bg-brand-emerald px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">
          {type === 'firstHalf' ? '1st Half Goals' : '2nd Half Goals'}
        </h3>
        
        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
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

      {/* Stats Table */}
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {standings.map((row, idx) => {
              const fullStats = row[filter];
              const stats = fullStats[type];
              
              if (!stats) return null;

              return (
                <tr key={`${row.team.id}-${idx}`} className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFF]/40'}`}>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-400 tabular-nums">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/teams/${row.team.slug}`} className="flex items-center gap-3 group min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden group-hover:bg-brand-emerald/5 transition-colors">
                        <img src={row.team.logoUrl || ''} alt={row.team.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-black text-slate-700 group-hover:text-brand-emerald transition-colors truncate">
                        {row.team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-600">{stats.played}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-600">{stats.wins}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{stats.draws}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{stats.losses}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-400 tabular-nums">{stats.gf}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-400 tabular-nums">{stats.ga}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-600 tabular-nums">{stats.gd}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-brand-emerald/10 text-brand-emerald px-2.5 py-1 rounded-lg text-sm font-black min-w-[32px]">
                        {stats.points}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-400 italic">{(stats.ppg || 0).toFixed(2)}</td>
                </tr>
              );
            })}
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
          ? 'bg-brand-emerald text-white shadow-lg' 
          : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
