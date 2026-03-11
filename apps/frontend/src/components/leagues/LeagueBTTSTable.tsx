'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StandingsRow } from '@/lib/api/types';

interface LeagueBTTSTableProps {
  standings: StandingsRow[];
}

export default function LeagueBTTSTable({ standings }: LeagueBTTSTableProps) {
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');

  const sorted = [...standings].sort((a, b) => {
    const aCount = a[filter]?.btts?.count || 0;
    const bCount = b[filter]?.btts?.count || 0;
    return bCount - aCount;
  });

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-brand-emerald px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Both Teams to Score</h3>
        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
          {(['overall', 'home', 'away'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all duration-300 ${filter === f ? 'bg-white text-brand-emerald shadow-lg' : 'text-white/70 hover:text-white'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white border-b border-slate-50">
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">#</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Team</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MP</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">BTTS</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">BTTS%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((row, idx) => {
              const stats = row[filter];
              const btts = stats?.btts || { count: 0, percentage: 0 };
              return (
                <tr key={`${row.team.id}-${idx}`} className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-400 tabular-nums">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/teams/${row.team.slug}`} className="flex items-center gap-3 group min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden group-hover:bg-brand-emerald/5 transition-colors">
                        <img src={row.team.logoUrl || ''} alt={row.team.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-black text-slate-700 group-hover:text-brand-emerald transition-colors truncate">{row.team.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-600">{stats?.played || 0}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-800">{btts.count}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-brand-emerald/10 text-brand-emerald px-3 py-1 rounded-lg text-xs font-black">
                      {btts.percentage} %
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
