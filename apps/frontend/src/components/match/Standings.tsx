'use client';

import { useState } from 'react';
import type { StandingsRow } from '@/lib/api/types';

interface StandingsProps {
  standings: StandingsRow[];
}

export default function Standings({ standings }: StandingsProps) {
  const [activeSubTab, setActiveSubTab] = useState('Table');
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');

  const subTabs = [
    'Table', 'Goals', 'Corners', 'Cards', '1st Half', '2nd Half', 'Over Under Goals', 'Clean Sheet', 'BTTS', 'Match Scoring / Conceding First'
  ];

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-emerald-500';
      case 'D': return 'bg-amber-500';
      case 'L': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Sub-Navigation */}
      <div className="relative mb-8 pb-1 group">
         <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {subTabs.map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-4 py-3 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
                     activeSubTab === tab 
                        ? 'text-brand-indigo outline-none' 
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
               >
                  {tab}
                  {activeSubTab === tab && (
                     <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-indigo rounded-full" />
                  )}
               </button>
            ))}
         </div>
         {/* Scroll Indicators (Optional/Visual) */}
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-slate-100">
            <span className="text-[10px]">◀</span>
         </div>
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-slate-100">
            <span className="text-[10px]">▶</span>
         </div>
      </div>

      {/* Standings Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-brand-indigo px-8 py-4">
          <h3 className="text-sm font-black text-white italic">{activeSubTab}</h3>
        </div>
        
        <div className="p-8">
          {/* Toggles */}
          <div className="flex gap-2 mb-8">
             {['overall', 'home', 'away'].map((type) => (
                <button
                   key={type}
                   onClick={() => setFilter(type as any)}
                   className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      filter === type 
                         ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                         : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                   }`}
                >
                   {type}
                </button>
             ))}
          </div>

          <div className="overflow-x-auto">
             <table className="w-full">
                <thead>
                   <tr className="text-left border-b border-slate-100">
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 w-10">#</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2">Team</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">MP</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">W</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">D</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">L</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">GF</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">GA</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">GD</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">Pts</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">PPG</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase px-2 text-center">Last 5</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {standings.map((row) => {
                      const data = row[filter];
                      return (
                         <tr key={row.team.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 text-[11px] font-bold text-slate-400 px-2">{row.rank}</td>
                            <td className="py-4 px-2">
                               <div className="flex items-center gap-3">
                                  {row.team.logoUrl && (
                                     <img src={row.team.logoUrl} alt={row.team.name} className="w-6 h-6 object-contain" />
                                  )}
                                  <span className="text-[11px] font-black text-slate-700">{row.team.name}</span>
                               </div>
                            </td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.played}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.wins}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.draws}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.losses}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.gf}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.ga}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.gd}</td>
                            <td className="py-4 text-[11px] font-black text-slate-800 px-2 text-center">{data.points}</td>
                            <td className="py-4 text-[11px] font-bold text-slate-600 px-2 text-center">{data.ppg.toFixed(2)}</td>
                            <td className="py-4 px-2">
                               <div className="flex items-center justify-center gap-1.5">
                                  {row.form.map((res, i) => (
                                     <div 
                                        key={i} 
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white ${getFormColor(res)}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
