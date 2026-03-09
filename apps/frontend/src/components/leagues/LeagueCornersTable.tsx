'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StandingsRow } from '@/lib/api/types';

interface LeagueCornersTableProps {
  standings: StandingsRow[];
}

type CornerType = 'corners' | 'corners-home' | 'corners-away';
type FilterType = 'overall' | 'home' | 'away';

export default function LeagueCornersTable({ standings }: LeagueCornersTableProps) {
  const [filter, setFilter] = useState<FilterType>('overall');
  const [cornerType, setCornerType] = useState<CornerType>('corners');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const typeLabels: Record<CornerType, string> = {
    corners: 'Corners',
    'corners-home': 'Corners Home',
    'corners-away': 'Corners Away',
  };

  // Build sorted rows from standings enriched data
  const rows = standings.map((row, idx) => {
    const stats = (row[filter] as any);
    const corners = stats?.corners || null;
    const mp = stats?.played || 0;

    // Show N/A when corners data is not available for this league
    const pct = (val: number | undefined) => corners ? (val != null ? `${val}%` : '0%') : 'N/A';

    return {
      rank: idx + 1,
      team: row.team,
      mp,
      over75:  pct(corners?.over75),
      over85:  pct(corners?.over85),
      over95:  pct(corners?.over95),
      over105: pct(corners?.over105),
      over115: pct(corners?.over115),
      over125: pct(corners?.over125),
      over135: pct(corners?.over135),
      average: corners?.average ?? null,
      hasData: corners != null,
    };
  }).sort((a, b) => (b.average ?? -1) - (a.average ?? -1));

  const noDataForLeague = rows.length > 0 && rows.every(r => !r.hasData);

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 mb-12">
      {/* Header Bar */}
      <div className="bg-brand-indigo px-8 py-5">
        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Corners</h3>
      </div>

      {/* Filters Row */}
      <div className="px-6 py-4 flex flex-wrap items-center gap-4 border-b border-slate-100">
        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slate-200 text-xs font-black text-slate-700 bg-white hover:border-brand-indigo transition-colors"
          >
            {typeLabels[cornerType]}
            <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 z-10 overflow-hidden min-w-[160px]">
              {(Object.keys(typeLabels) as CornerType[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setCornerType(t); setDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-3 text-xs font-black transition-colors ${cornerType === t ? 'bg-brand-indigo/10 text-brand-indigo' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Overall/Home/Away Pills */}
        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 gap-1">
          {(['overall', 'home', 'away'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-1.5 rounded-full text-xs font-black transition-all ${
                filter === f
                  ? 'bg-brand-indigo text-white shadow-md shadow-brand-indigo/30'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-14">#</th>
              <th className="px-4 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[180px]">Team</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MP</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 7.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 8.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 9.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 10.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 11.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 12.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Over 13.5</th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, idx) => (
              <tr key={`${row.team.id}-${idx}`} className={`hover:bg-slate-50/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                <td className="px-6 py-4">
                  <span className="text-xs font-black text-slate-400 tabular-nums">{row.rank}</span>
                </td>
                <td className="px-4 py-4">
                  <Link href={`/teams/${row.team.slug}`} className="flex items-center gap-3 group min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden group-hover:border-brand-indigo/30 transition-colors">
                      <img src={row.team.logoUrl || ''} alt={row.team.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-brand-indigo transition-colors truncate">
                      {row.team.name}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-4 text-center text-xs font-black text-slate-600">{row.mp}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over75}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over85}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over95}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over105}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over115}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over125}</td>
                <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.over135}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center bg-brand-indigo/10 text-brand-indigo px-2.5 py-1 rounded-lg text-sm font-black min-w-[40px]">
                    {row.average != null ? row.average.toFixed(1) : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <span className="text-3xl mb-4">📐</span>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">No Corner Data Available</h4>
            <p className="text-xs text-slate-400 max-w-sm font-bold italic">
              Corner statistics require individual match event data. This detailed data may not be available for all competitions.
            </p>
          </div>
        )}
        {noDataForLeague && rows.length > 0 && (
          <div className="mx-6 mb-6 mt-2 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-start gap-3">
            <span className="text-amber-500 text-lg shrink-0 mt-0.5">⚠️</span>
            <p className="text-xs font-bold text-amber-700">
              Corner statistics are not available for this league in the current data source. This feature is supported for top-tier competitions (e.g. Premier League, La Liga, Serie A).
            </p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 italic">
          Corner statistics are aggregated from all completed matches in this season. Average is calculated per team per match.
        </p>
      </div>
    </div>
  );
}
