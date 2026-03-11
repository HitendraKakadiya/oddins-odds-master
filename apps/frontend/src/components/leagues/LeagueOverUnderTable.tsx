'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StandingsRow } from '@/lib/api/types';

interface LeagueOverUnderTableProps {
  standings: StandingsRow[];
}

export default function LeagueOverUnderTable({ standings }: LeagueOverUnderTableProps) {
  const [threshold, setThreshold] = useState<'05' | '15' | '25' | '35' | '45' | '55'>('25');
  const [type, setType] = useState<'over' | 'under'>('over');

  const thresholds = [
    { value: '05', label: '0.5' },
    { value: '15', label: '1.5' },
    { value: '25', label: '2.5' },
    { value: '35', label: '3.5' },
    { value: '45', label: '4.5' },
    { value: '55', label: '5.5' },
  ];

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Table Header / Filters */}
      <div className="bg-brand-emerald px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Over/Under Goals</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
             <span className="px-3 py-2 text-xs font-black text-white/60 uppercase">Threshold:</span>
             <select 
              value={threshold}
              onChange={(e) => setThreshold(e.target.value as '05' | '15' | '25' | '35' | '45' | '55')}
              className="bg-transparent text-white text-xs font-black focus:outline-none cursor-pointer pr-2"
             >
               {thresholds.map(t => <option key={t.value} value={t.value} className="text-slate-800">{t.label}</option>)}
             </select>
          </div>

          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
            <button 
              onClick={() => setType('over')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${type === 'over' ? 'bg-brand-emerald text-white' : 'text-white/60 hover:text-white'}`}
            >
              Over
            </button>
            <button 
              onClick={() => setType('under')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${type === 'under' ? 'bg-brand-emerald text-white' : 'text-white/60 hover:text-white'}`}
            >
              Under
            </button>
          </div>
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
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{type === 'over' ? 'Over' : 'Under'}</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall %</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Home %</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Away %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {standings.map((row, idx) => {
              const key = `${type}${threshold}` as keyof NonNullable<typeof row.overall.overUnder>;
              const overall = row.overall.overUnder?.[key] || { count: 0, percentage: 0 };
              const home = row.home.overUnder?.[key] || { count: 0, percentage: 0 };
              const away = row.away.overUnder?.[key] || { count: 0, percentage: 0 };

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
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-600">{row.overall.played}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-800">{overall.count}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-slate-700 italic">{overall.percentage}%</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500 italic">{home.percentage}%</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500 italic">{away.percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
