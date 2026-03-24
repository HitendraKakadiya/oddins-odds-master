'use client';

import { useState } from 'react';
import type { H2HMatch, H2HSummary } from '@/lib/api/types';

interface HeadToHeadProps {
  homeTeam: { id: number; name: string; logoUrl?: string | null };
  awayTeam: { id: number; name: string; logoUrl?: string | null };
  h2h: H2HMatch[];
  h2hSummary: H2HSummary;
}

export default function HeadToHead({ homeTeam, awayTeam, h2h, h2hSummary }: HeadToHeadProps) {
  const [filter, setFilter] = useState<'overall' | 'home_away'>('overall');

  const filteredH2H = filter === 'overall' 
    ? h2h 
    : h2h.filter(m => 
        (m.homeTeam.id === homeTeam.id && m.awayTeam.id === awayTeam.id)
      );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      {/* Toggles */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => setFilter('overall')}
            className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              filter === 'overall' 
              ? 'bg-brand-emerald text-white shadow-xl shadow-brand-emerald/20' 
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
        >
          Overall
        </button>
        <button
          onClick={() => setFilter('home_away')}
            className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              filter === 'home_away' 
              ? 'bg-brand-emerald text-white shadow-xl shadow-brand-emerald/20' 
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
        >
          Home & Away
        </button>
      </div>

      {/* Main H2H History Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="bg-brand-emerald px-8 py-5">
          <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">
            {filter === 'overall' ? 'Overall - Head to Head' : 'Home & Away - Head to Head'}
          </h3>
        </div>
        
        <div className="p-2 md:p-4">
           {filteredH2H.slice(0, 5).map((match, idx) => (
             <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 md:py-6 hover:bg-slate-50/50 transition-all rounded-[24px] group border border-slate-50 md:border-transparent mb-2 md:mb-0">
                {/* Date/Time - Top on Mobile, Left on Desktop */}
                <div className="flex items-center gap-3 shrink-0 mb-4 md:mb-0">
                   <div className="p-2 bg-slate-50 rounded-lg">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-800 tabular-nums">
                         {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                         {new Date(match.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                   </div>
                </div>

                {/* Match Score & Teams */}
                <div className="flex items-center justify-between md:justify-center flex-1 gap-2 md:gap-8">
                   {/* Home Team */}
                   <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end min-w-0">
                      <span className="text-xs md:text-sm font-black text-slate-700 truncate group-hover:text-brand-emerald transition-colors text-right">{match.homeTeam.name}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-100 p-1.5 md:p-2 shadow-sm shrink-0">
                         {match.homeTeam.logoUrl ? <img src={match.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300">⚽</div>}
                      </div>
                   </div>

                   {/* Score */}
                   <div className="flex items-center gap-1.5 md:gap-2 font-black text-slate-900 bg-slate-50 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-slate-100 shadow-inner tabular-nums shrink-0">
                      <span className="text-sm md:text-base">{match.homeScore}</span>
                      <span className="text-slate-200 text-sm md:text-base">:</span>
                      <span className="text-sm md:text-base">{match.awayScore}</span>
                   </div>

                   {/* Away Team */}
                   <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-100 p-1.5 md:p-2 shadow-sm shrink-0">
                         {match.awayTeam.logoUrl ? <img src={match.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300">⚽</div>}
                      </div>
                      <span className="text-xs md:text-sm font-black text-slate-700 truncate group-hover:text-brand-emerald transition-colors">{match.awayTeam.name}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
  
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <H2HStatCard 
            title="Clean Sheet" 
            content={
               <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shadow-sm">
                        {homeTeam.logoUrl ? <img src={homeTeam.logoUrl} alt="" className="w-full h-full object-contain" /> : <span className="text-lg">🛡️</span>}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 truncate max-w-[120px]">{homeTeam.name}</span>
                        <span className="text-lg font-black text-rose-500 italic">
                           {Math.round((h2hSummary.homeTeam.cleanSheets / (h2hSummary.total || 1)) * 100)}%
                        </span>
                     </div>
                  </div>
               </div>
            }
         />
  
         <H2HStatCard 
            title="Head to Head Results" 
            content={
               <div className="flex items-center justify-between w-full px-6">
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 p-1.5 border border-slate-100 flex items-center justify-center shadow-sm">
                        {homeTeam.logoUrl ? <img src={homeTeam.logoUrl} alt="" className="w-full h-full object-contain" /> : <span className="text-sm">⚽</span>}
                     </div>
                     <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-slate-800 tabular-nums leading-none">{h2hSummary.homeTeam.wins}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Wins</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                     <div className="text-[10px] text-slate-200 mt-2 mb-1">
                        <svg className="w-10 h-10 opacity-10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                     </div>
                     <span className="text-xl font-black text-slate-800 tabular-nums leading-none">{h2hSummary.draws}</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Draw</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 p-1.5 border border-slate-100 flex items-center justify-center shadow-sm">
                        {awayTeam.logoUrl ? <img src={awayTeam.logoUrl} alt="" className="w-full h-full object-contain" /> : <span className="text-sm">⚽</span>}
                     </div>
                     <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-slate-800 tabular-nums leading-none">{h2hSummary.awayTeam.wins}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Wins</span>
                     </div>
                  </div>
               </div>
            }
         />
  
         <H2HStatCard 
            title="Clean Sheet" 
            content={
               <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shadow-sm">
                        {awayTeam.logoUrl ? <img src={awayTeam.logoUrl} alt="" className="w-full h-full object-contain" /> : <span className="text-lg">🛡️</span>}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 truncate max-w-[120px]">{awayTeam.name}</span>
                        <span className="text-lg font-black text-rose-500 italic">
                           {Math.round((h2hSummary.awayTeam.cleanSheets / (h2hSummary.total || 1)) * 100)}%
                        </span>
                     </div>
                  </div>
               </div>
            }
         />
      </div>

      {/* Probability Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <H2HStatCard 
            title="Both Teams to Score" 
            content={
               <div className="text-center py-2">
                  <div className="text-3xl font-black text-slate-800 mb-1">{Math.round((h2hSummary.btts / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{h2hSummary.btts}/{h2hSummary.total} Matches</div>
               </div>
            }
         />
  
         <H2HStatCard 
            title="Over 0.5+" 
            content={
               <div className="text-center py-2">
                  <div className="text-3xl font-black text-brand-emerald mb-1 italic">{Math.round((h2hSummary.over05 / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{h2hSummary.over05}/{h2hSummary.total} Matches</div>
               </div>
            }
         />
  
         <H2HStatCard 
            title="Over 1.5+" 
            content={
               <div className="text-center py-2">
                  <div className="text-3xl font-black text-brand-emerald mb-1 italic">{Math.round((h2hSummary.over15 / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{h2hSummary.over15}/{h2hSummary.total} Matches</div>
               </div>
            }
         />
         
         <H2HStatCard 
            title="Over 2.5+" 
            content={
               <div className="text-center py-2">
                  <div className="text-3xl font-black text-brand-emerald mb-1 italic">{Math.round((h2hSummary.over25 / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{h2hSummary.over25}/{h2hSummary.total} Matches</div>
               </div>
            }
         />
      </div>
    </div>
  );
}
 
function H2HStatCard({ title, content }: { title: string; content: React.ReactNode }) {
   return (
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group hover:border-brand-emerald/30 transition-all">
         <div className="bg-brand-emerald/90 py-3.5 px-6 text-center">
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{title}</h4>
         </div>
         <div className="p-8 flex-1 flex items-center justify-center bg-gradient-to-b from-white to-slate-50/30">
            {content}
         </div>
      </div>
   );
}
