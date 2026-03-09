'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StandingsRow } from '@/lib/api/types';

interface LeagueStandingsTableProps {
  standings: StandingsRow[];
}

export default function LeagueStandingsTable({ standings }: LeagueStandingsTableProps) {
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
      {/* Table Header / Filters */}
      <div className="bg-brand-emerald/10 px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">Standing Table</h3>
        
        <div className="flex flex-wrap items-center gap-3">
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
        {standings && standings.length > 0 ? (
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
              {standings.map((row, idx) => {
                const stats = row[filter];
                return (
                  <tr key={`${row.team.id}-${idx}`} className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-slate-400 tabular-nums">{row.rank < 10 ? `0${row.rank}` : row.rank}</span>
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
                    <td className="px-4 py-4 text-center text-xs font-black text-slate-600 tabular-nums">{stats.gf - stats.ga}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-brand-emerald/10 text-brand-emerald px-2.5 py-1 rounded-lg text-sm font-black min-w-[32px]">
                          {stats.points}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-400 italic">{(stats.ppg || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        {(row.form || []).map((res, i) => (
                          <div 
                            key={i} 
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-sm transition-transform hover:scale-110 cursor-default ${
                              res === 'W' ? 'bg-green-500' : res === 'L' ? 'bg-red-500' : 'bg-orange-400'
                            }`}
                            title={res === 'W' ? 'Win' : res === 'L' ? 'Loss' : 'Draw'}
                          >
                            {res}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic transition-transform hover:scale-110 duration-500">
               <span className="text-2xl text-slate-400">📊</span>
            </div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">No standing table available</h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-bold italic">
               Some cup, play-off, or friendly competitions do not have a standard league standings table in our data source.
            </p>
          </div>
        )}
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
          ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/30' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
      }`}
    >
      {label}
    </button>
  );
}
