'use client';

import type { H2HMatch, TeamStats } from '@/lib/api/types';

interface H2HComparisonProps {
  homeTeam: { name: string; logoUrl?: string; country?: string };
  awayTeam: { name: string; logoUrl?: string; country?: string };
  homeStats: TeamStats;
  awayStats: TeamStats;
  h2hMatches?: H2HMatch[];
}

export default function H2HComparison({ homeTeam, awayTeam, homeStats, awayStats, h2hMatches = [] }: H2HComparisonProps) {
  return (
    <div className="flex flex-col gap-12">
       <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-black text-brand-dark-blue">Head to head: {homeTeam.name} vs {awayTeam.name}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
             Review the head-to-head record between the teams, featuring key data to support your match prediction.
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Home Team Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
             <div className="bg-brand-indigo h-2 w-full"></div>
             <div className="p-8 flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 p-4 mb-6 shadow-sm">
                   <img src={homeTeam.logoUrl || ''} alt={homeTeam.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{homeTeam.name}</h3>
                <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">{homeTeam.country || 'Qatar'} - {homeTeam.name} Stats</p>

                <div className="w-full space-y-6">
                   <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <span className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Form</span>
                      <FormCircles results={homeStats?.last5 || []} size="md" />
                   </div>

                   <MetricRow label="Overall" ppg={homeStats?.overall?.ppg || 0} results={homeStats?.last5 || []} />
                   <MetricRow label="Home" ppg={homeStats?.home?.ppg || 0} results={homeStats?.last5Home || []} />
                   <MetricRow label="Away" ppg={homeStats?.away?.ppg || 0} results={homeStats?.last5Away || []} />
                </div>

                <button className="mt-10 bg-brand-pink text-white px-8 py-3 rounded-full font-black text-sm shadow-lg shadow-brand-pink/30 hover:scale-105 transition-transform">
                   More Information +
                </button>
             </div>
          </div>

          {/* Away Team Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
             <div className="bg-brand-indigo h-2 w-full"></div>
             <div className="p-8 flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 p-4 mb-6 shadow-sm">
                   <img src={awayTeam.logoUrl || ''} alt={awayTeam.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{awayTeam.name}</h3>
                <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">{awayTeam.country || 'Qatar'} - {awayTeam.name} Stats</p>

                <div className="w-full space-y-6">
                   <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <span className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Form</span>
                      <FormCircles results={awayStats?.last5 || []} size="md" />
                   </div>

                   <MetricRow label="Overall" ppg={awayStats?.overall?.ppg || 0} results={awayStats?.last5 || []} />
                   <MetricRow label="Home" ppg={awayStats?.home?.ppg || 0} results={awayStats?.last5Home || []} />
                   <MetricRow label="Away" ppg={awayStats?.away?.ppg || 0} results={awayStats?.last5Away || []} />
                </div>

                <button className="mt-10 bg-brand-pink text-white px-8 py-3 rounded-full font-black text-sm shadow-lg shadow-brand-pink/30 hover:scale-105 transition-transform">
                   More Information +
                </button>
             </div>
          </div>
       </div>

       {/* H2H Match Detail History */}
       {h2hMatches.length > 0 && (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Head to Head History</h3>
                <span className="bg-brand-indigo/10 text-brand-indigo px-4 py-1 rounded-full text-xs font-black">Last {h2hMatches.slice(0, 5).length} Matches</span>
             </div>
             <div className="divide-y divide-slate-50">
                {h2hMatches.slice(0, 5).map((m, idx) => (
                   <div key={idx} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col gap-1 w-32 shrink-0">
                         <span className="text-xs font-black text-slate-400 uppercase">{new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                         <span className="text-[10px] font-bold text-slate-300 truncate">{m.competition}</span>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center gap-4 md:gap-8">
                         <div className="flex items-center gap-3 w-1/3 justify-end">
                            <span className="text-sm md:text-base font-black text-slate-700 text-right truncate">{m.homeTeam.name}</span>
                            <img src={m.homeTeam.logoUrl || ''} alt={m.homeTeam.name} className="w-8 h-8 object-contain" />
                         </div>
                         
                         <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 min-w-[80px] justify-center">
                            <span className="text-lg font-black text-brand-dark-blue">{m.homeScore}</span>
                            <span className="text-slate-300 font-black">-</span>
                            <span className="text-lg font-black text-brand-dark-blue">{m.awayScore}</span>
                         </div>
                         
                         <div className="flex items-center gap-3 w-1/3 justify-start">
                            <img src={m.awayTeam.logoUrl || ''} alt={m.awayTeam.name} className="w-8 h-8 object-contain" />
                            <span className="text-sm md:text-base font-black text-slate-700 truncate">{m.awayTeam.name}</span>
                         </div>
                      </div>

                      <div className="w-24 flex justify-end">
                         {m.homeScore > m.awayScore ? (
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter bg-green-50 px-2 py-1 rounded-md">Home Win</span>
                         ) : m.awayScore > m.homeScore ? (
                            <span className="text-[10px] font-black text-brand-pink uppercase tracking-tighter bg-brand-pink/5 px-2 py-1 rounded-md">Away Win</span>
                         ) : (
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter bg-orange-50 px-2 py-1 rounded-md">Draw</span>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
       )}
    </div>
  );
}

function FormCircles({ results, size = 'sm' }: { results: string[]; size?: 'sm' | 'md' }) {
   const padded = [...results].slice(0, 5);
   while (padded.length < 5) padded.push('-');
   
   return (
      <div className="flex gap-1.5 md:gap-2">
         {padded.map((res, i) => (
            <div key={i} className={`${size === 'md' ? 'w-8 h-8 text-[10px]' : 'w-6 h-6 text-[8px]'} rounded-full flex items-center justify-center font-black shadow-sm ${
               res === 'W' ? 'bg-green-500 text-white' : 
               res === 'L' ? 'bg-red-500 text-white' : 
               res === 'D' ? 'bg-orange-500 text-white' : 
               'bg-slate-100 text-slate-300 border border-slate-200/50'
            }`}>
               {res === '-' ? '' : res}
            </div>
         ))}
      </div>
   );
}

function MetricRow({ label, ppg, results }: { label: string; ppg: number; results: string[] }) {
  return (
    <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
       <span className="text-sm font-black text-slate-800 uppercase tracking-widest shrink-0">{label}</span>
       <div className="flex items-center gap-3">
          <FormCircles results={results} />
          <div className="bg-brand-indigo/10 text-brand-indigo px-3 py-1.5 rounded-lg text-xs font-black min-w-[50px] text-center border border-brand-indigo/20">
             {(ppg || 0).toFixed(2)}
          </div>
       </div>
    </div>
  );
}
