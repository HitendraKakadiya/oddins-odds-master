'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CornerStatsRow {
  rank: number;
  team: {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  mp: number;
  over75: string;
  over85: string;
  over95: string;
  over105: string;
  over115: string;
  over125: string;
  over135: string;
  average: number | string;
}

interface LeagueCornersTableProps {
  data: CornerStatsRow[];
}

export default function LeagueCornersTable({ data }: LeagueCornersTableProps) {
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Table Header */}
      <div className="bg-brand-indigo px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Corners</h3>
        
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
              <th className="px-4 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12">#</th>
              <th className="px-4 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Team</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MP</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 7.5</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 8.5</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 9.5</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 10.5</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 11.5</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 12.5</th>
              <th className="px-2 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 13.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, idx) => (
              <tr key={row.team.id} className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFF]/40'}`}>
                <td className="px-4 py-5">
                  <span className="text-sm font-black text-slate-400 italic">{row.rank}</span>
                </td>
                <td className="px-4 py-5">
                  <Link href={`/teams/${row.team.slug}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0">
                      <img src={row.team.logoUrl || ''} alt={row.team.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-brand-indigo transition-colors whitespace-nowrap">
                      {row.team.name}
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-600 italic">{row.mp}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over75}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over85}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over95}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over105}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over115}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over125}</td>
                <td className="px-2 py-5 text-center text-sm font-black text-slate-800">{row.over135}</td>
                <td className="px-4 py-5 text-center text-sm font-black text-slate-900 italic">{row.average}</td>
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
          ? 'bg-brand-pink text-white shadow-lg' 
          : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
