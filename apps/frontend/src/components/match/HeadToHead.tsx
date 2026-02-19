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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Toggles */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilter('overall')}
          className={`px-8 py-2.5 rounded-2xl text-xs font-black transition-all ${
            filter === 'overall'
              ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20'
              : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          Overall
        </button>
        <button
          onClick={() => setFilter('home_away')}
          className={`px-8 py-2.5 rounded-2xl text-xs font-black transition-all ${
            filter === 'home_away'
              ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20'
              : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          Home & Away
        </button>
      </div>

      {/* H2H Matches List */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-12">
        <div className="bg-brand-indigo px-8 py-4">
          <h3 className="text-sm font-black text-white italic">Overall - Head to Head</h3>
        </div>
        <div className="p-2">
          <div className="divide-y divide-slate-50">
            {filteredH2H.map((match, idx) => (
              <div key={idx} className="flex items-center justify-between px-8 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-6 flex-1">
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-brand-indigo/10 rounded-full flex items-center justify-center">
                         <div className="w-2 h-2 bg-brand-indigo rounded-full" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 w-32">
                        {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date(match.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                   
                   <div className="flex items-center justify-center flex-1 gap-4">
                      <div className="flex items-center gap-2 justify-end flex-1">
                         <span className="text-xs font-black text-slate-700">{match.homeTeam.name}</span>
                         {match.homeTeam.logoUrl && (
                            <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
                         )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">
                        <span>{match.homeScore}</span>
                        <span className="text-slate-300">:</span>
                        <span>{match.awayScore}</span>
                      </div>

                      <div className="flex items-center gap-2 justify-start flex-1">
                         {match.awayTeam.logoUrl && (
                            <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
                         )}
                         <span className="text-xs font-black text-slate-700">{match.awayTeam.name}</span>
                      </div>
                   </div>
                   
                   <div className="w-32 text-right">
                      <span className="text-[10px] font-bold text-slate-400 italic">{match.competition}</span>
                   </div>
                </div>
              </div>
            ))}
            {filteredH2H.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-bold italic">No head to head matches found</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         {/* Clean Sheet Home */}
         <H2HStatCard 
            title="Clean Sheet" 
            content={
               <div className="flex items-center gap-4">
                  {homeTeam.logoUrl && <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8 object-contain" />}
                  <div>
                     <div className="text-xs font-black text-slate-700">{homeTeam.name}</div>
                     <div className="text-xs font-bold text-rose-500">{Math.round((h2hSummary.homeTeam.cleanSheets / (h2hSummary.total || 1)) * 100)}%</div>
                  </div>
               </div>
            }
         />

         {/* H2H Results */}
         <H2HStatCard 
            title="Head to Head Results" 
            content={
               <div className="flex items-center justify-between w-full px-4">
                  <div className="text-center">
                     {homeTeam.logoUrl && <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-6 h-6 object-contain mx-auto mb-1" />}
                     <div className="text-xs font-black text-slate-700">{h2hSummary.homeTeam.wins}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">Wins</div>
                  </div>
                  <div className="text-center">
                     <div className="text-lg font-black text-slate-300 mt-2">—</div>
                     <div className="text-xs font-black text-slate-700">{h2hSummary.draws}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">Draw</div>
                  </div>
                  <div className="text-center">
                     {awayTeam.logoUrl && <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-6 h-6 object-contain mx-auto mb-1" />}
                     <div className="text-xs font-black text-slate-700">{h2hSummary.awayTeam.wins}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">Wins</div>
                  </div>
               </div>
            }
         />

         {/* Clean Sheet Away */}
         <H2HStatCard 
            title="Clean Sheet" 
            content={
               <div className="flex items-center gap-4">
                  {awayTeam.logoUrl && <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-8 h-8 object-contain" />}
                  <div>
                     <div className="text-xs font-black text-slate-700">{awayTeam.name}</div>
                     <div className="text-xs font-bold text-rose-500">{Math.round((h2hSummary.awayTeam.cleanSheets / (h2hSummary.total || 1)) * 100)}%</div>
                  </div>
               </div>
            }
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* BTTS */}
         <H2HStatCard 
            title="Both Teams to Score" 
            content={
               <div className="text-center">
                  <div className="text-sm font-black text-emerald-500 mb-1">{Math.round((h2hSummary.btts / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-xs font-bold text-slate-400">{h2hSummary.btts}/{h2hSummary.total} Matches</div>
               </div>
            }
         />

         {/* Over 0.5+ */}
         <H2HStatCard 
            title="Over 0.5+" 
            content={
               <div className="text-center">
                  <div className="text-sm font-black text-emerald-500 mb-1">{Math.round((h2hSummary.over05 / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-xs font-bold text-slate-400">{h2hSummary.over05}/{h2hSummary.total} Matches</div>
               </div>
            }
         />

         {/* Over 1.5+ */}
         <H2HStatCard 
            title="Over 1.5+" 
            content={
               <div className="text-center">
                  <div className="text-sm font-black text-slate-800 mb-1">{Math.round((h2hSummary.over15 / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-xs font-bold text-slate-400">{h2hSummary.over15}/{h2hSummary.total} Matches</div>
               </div>
            }
         />
         
         {/* Over 2.5+ */}
         <H2HStatCard 
            title="Over 2.5+" 
            content={
               <div className="text-center">
                  <div className="text-sm font-black text-slate-800 mb-1">{Math.round((h2hSummary.over25 / (h2hSummary.total || 1)) * 100)}%</div>
                  <div className="text-xs font-bold text-slate-400">{h2hSummary.over25}/{h2hSummary.total} Matches</div>
               </div>
            }
         />
      </div>
    </div>
  );
}

function H2HStatCard({ title, content }: { title: string; content: React.ReactNode }) {
   return (
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="bg-brand-indigo py-2 px-6 text-center">
            <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{title}</h4>
         </div>
         <div className="p-5 flex-1 flex items-center justify-center">
            {content}
         </div>
      </div>
   );
}
