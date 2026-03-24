'use client';

import React from 'react';

interface StatItem {
  type: string;
  value: string | number | null;
}

interface TeamStat {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: StatItem[];
}

interface MatchLiveStatsProps {
  matchStats: TeamStat[];
}

export default function MatchLiveStats({ matchStats }: MatchLiveStatsProps) {
  if (!matchStats || matchStats.length < 2) return null;

  const homeTeam = matchStats[0];
  const awayTeam = matchStats[1];

  // Common stats to display
  const statTypes = [
    'Ball Possession',
    'Total Shots',
    'Shots on Goal',
    'Shots off Goal',
    'Corner Kicks',
    'Offsides',
    'Fouls',
    'Yellow Cards',
    'Red Cards',
    'Goalkeeper Saves',
    'Total passes',
    'Passes %'
  ];

  const getStatValue = (team: TeamStat, type: string) => {
    const stat = team.statistics.find(s => s.type === type);
    return stat ? stat.value : 0;
  };

  const parseValue = (val: string | number | null) => {
    if (typeof val === 'string' && val.endsWith('%')) {
      return parseInt(val.replace('%', ''), 10);
    }
    return parseInt(val as string, 10) || 0;
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-slate-800 font-black uppercase tracking-[0.2em] text-sm">Match Statistics</h3>
        <div className="flex gap-8">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-emerald"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{homeTeam.team.name}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{awayTeam.team.name}</span>
           </div>
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-8">
        {statTypes.map((type, index) => {
          const homeVal = getStatValue(homeTeam, type);
          const awayVal = getStatValue(awayTeam, type);

          // If both are 0 or null, skip this stat
          if (!homeVal && !awayVal) return null;

          const homeNum = parseValue(homeVal);
          const awayNum = parseValue(awayVal);
          const total = homeNum + awayNum || 1;
          const homeWidth = (homeNum / total) * 100;

          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-black text-slate-700">{homeVal ?? 0}</span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
                <span className="text-sm font-black text-slate-700">{awayVal ?? 0}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-brand-emerald transition-all duration-1000" 
                  style={{ width: `${homeWidth}%` }}
                ></div>
                <div 
                  className="h-full bg-slate-300 transition-all duration-1000" 
                  style={{ width: `${100 - homeWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
