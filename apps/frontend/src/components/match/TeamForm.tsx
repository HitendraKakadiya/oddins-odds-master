'use client';

import { useState } from 'react';
import type { TeamStats, DetailedRecentMatch } from '@/lib/api/types';

interface TeamFormProps {
  homeTeam: { name: string; logoUrl?: string | null; id: number };
  awayTeam: { name: string; logoUrl?: string | null; id: number };
  homeStats: TeamStats;
  awayStats: TeamStats;
}

export default function TeamForm({ homeTeam, awayTeam, homeStats, awayStats }: TeamFormProps) {
  const [filter, setFilter] = useState<'overall' | 'home_away'>('overall');

  const homeMatches = filter === 'overall' 
    ? (homeStats.recentMatchesDetailed || []) 
    : (homeStats.recentMatchesDetailed || []).filter(m => m.homeTeam.id === homeTeam.id);

  const awayMatches = filter === 'overall' 
    ? (awayStats.recentMatchesDetailed || []) 
    : (awayStats.recentMatchesDetailed || []).filter(m => m.awayTeam.id === awayTeam.id);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Home Team Form */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="bg-brand-indigo px-8 py-4 flex items-center gap-3">
             {homeTeam.logoUrl && (
                <div className="w-8 h-8 bg-white/10 rounded-lg p-1">
                   <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-full h-full object-contain" />
                </div>
             )}
             <h3 className="text-sm font-black text-white italic">{homeTeam.name} - Last Matches</h3>
          </div>
          <div className="p-2">
            <div className="divide-y divide-slate-50">
              {homeMatches.map((m, idx) => (
                <MatchRow key={idx} match={m} currentTeamId={homeTeam.id} />
              ))}
              {homeMatches.length === 0 && <div className="py-12 text-center text-slate-400 font-bold">No results found</div>}
            </div>
          </div>
        </div>

        {/* Away Team Form */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="bg-brand-indigo px-8 py-4 flex items-center gap-3">
             {awayTeam.logoUrl && (
                <div className="w-8 h-8 bg-white/10 rounded-lg p-1">
                   <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-full h-full object-contain" />
                </div>
             )}
             <h3 className="text-sm font-black text-white italic">{awayTeam.name} - Last Matches</h3>
          </div>
          <div className="p-2">
            <div className="divide-y divide-slate-50">
              {awayMatches.map((m, idx) => (
                <MatchRow key={idx} match={m} currentTeamId={awayTeam.id} />
              ))}
              {awayMatches.length === 0 && <div className="py-12 text-center text-slate-400 font-bold">No results found</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatComparisonCard 
            title="Form" 
            homeValue={filter === 'overall' ? homeStats.overall.ppg : homeStats.home.ppg} 
            awayValue={filter === 'overall' ? awayStats.overall.ppg : awayStats.away.ppg}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            unit="/Match"
        />
        <StatComparisonCard 
            title="Form - Last 5" 
            homeValue={filter === 'overall' ? homeStats.overall.ppg : homeStats.home.ppg}
            awayValue={filter === 'overall' ? awayStats.overall.ppg : awayStats.away.ppg}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            unit="/Match"
        />
        <StatComparisonCard 
            title="Goal Scored" 
            homeValue={filter === 'overall' ? homeStats.overall.scoredAvg : homeStats.home.scoredAvg} 
            awayValue={filter === 'overall' ? awayStats.overall.scoredAvg : awayStats.away.scoredAvg}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            unit="/Match"
        />
        <StatComparisonCard 
            title="Goals Conceded" 
            homeValue={filter === 'overall' ? homeStats.overall.concededAvg : homeStats.home.concededAvg} 
            awayValue={filter === 'overall' ? awayStats.overall.concededAvg : awayStats.away.concededAvg}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            unit="/Match"
            lowerIsBetter
        />
      </div>
    </div>
  );
}

function MatchRow({ match, currentTeamId }: { match: DetailedRecentMatch; currentTeamId: number }) {
  const isHome = match.homeTeam.id === currentTeamId;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors group gap-2 sm:gap-0">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
        <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 w-16 sm:w-24 shrink-0">
          {new Date(match.kickoffAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </span>
        <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial min-w-0">
          <div className="w-16 sm:w-20 text-right">
             <span className={`text-[10px] sm:text-[11px] font-black truncate block ${isHome ? 'text-slate-800' : 'text-slate-400'}`}>
                {match.homeTeam.name}
             </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black text-slate-600 shrink-0">
            <span>{match.score.home}</span>
            <span className="text-slate-300">:</span>
            <span>{match.score.away}</span>
          </div>
          <div className="w-16 sm:w-20 text-left">
             <span className={`text-[10px] sm:text-[11px] font-black truncate block ${!isHome ? 'text-slate-800' : 'text-slate-400'}`}>
                {match.awayTeam.name}
             </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="flex items-center gap-2">
           <span className="text-[9px] font-bold text-slate-300 sm:hidden uppercase tabular-nums">Opponent</span>
           {opponent.logoUrl && (
               <img src={opponent.logoUrl} alt={opponent.name} className="w-4 h-4 sm:w-5 sm:h-5 object-contain grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
           )}
        </div>
        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white shadow-sm
          ${match.result === 'W' ? 'bg-emerald-500 shadow-emerald-100' : 
            match.result === 'D' ? 'bg-amber-500 shadow-amber-100' : 
            'bg-rose-500 shadow-rose-100'}`}>
          {match.result}
        </div>
      </div>
    </div>
  );
}

function StatComparisonCard({ title, homeValue, awayValue, homeTeam, awayTeam, unit = '', lowerIsBetter = false }: { 
    title: string; 
    homeValue: number; 
    awayValue: number;
    homeTeam: any;
    awayTeam: any;
    unit?: string;
    lowerIsBetter?: boolean;
}) {
  const diff = homeValue > 0 ? ((homeValue - awayValue) / (lowerIsBetter ? homeValue : awayValue)) * 100 : 0;
  const isBetter = lowerIsBetter ? homeValue < awayValue : homeValue > awayValue;
  const betterTeam = isBetter ? homeTeam : awayTeam;
  const percentLabel = Math.abs(Math.round(diff || 0));

  return (
    <div className="bg-white rounded-[24px] md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-brand-indigo py-2.5 md:py-3 px-6 text-center">
        <h4 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-wider">{title}</h4>
      </div>
      <div className="p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4 sm:gap-0">
           <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
              {homeTeam.logoUrl && (
                  <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
              )}
              <div className="text-base sm:text-lg font-black text-slate-800">{homeValue}{unit}</div>
           </div>

           <div className="flex-1 px-4 md:px-8 text-center">
              <div className="text-[9px] md:text-[10px] font-black text-brand-indigo uppercase mb-0.5 md:mb-1">
                 {percentLabel}% Better
              </div>
              <div className="text-[9px] md:text-[10px] font-bold text-slate-400 leading-tight max-w-[150px] mx-auto">
                 {betterTeam.id === homeTeam.id ? homeTeam.name : awayTeam.name} is {percentLabel}% better in {title}
              </div>
           </div>

           <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
              {awayTeam.logoUrl && (
                  <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
              )}
              <div className="text-base sm:text-lg font-black text-slate-800">{awayValue}{unit}</div>
           </div>
        </div>
        
        {/* Progress Bar comparison */}
        <div className="h-1 bg-slate-50 rounded-full overflow-hidden flex">
            <div 
                className={`h-full transition-all duration-1000 ${isBetter ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                style={{ width: `${(homeValue / (homeValue + awayValue || 1)) * 100}%` }}
            />
            <div 
                className={`h-full transition-all duration-1000 ${!isBetter ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                style={{ width: `${(awayValue / (homeValue + awayValue || 1)) * 100}%` }}
            />
        </div>
      </div>
    </div>
  );
}
