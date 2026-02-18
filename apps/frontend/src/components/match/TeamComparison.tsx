'use client';

import type { MatchData } from '@/lib/api/types';

interface TeamStatsProps {
  label: string;
  overall: string | number;
  homeAway: string | number;
  awayHome: string | number;
  highlight?: boolean;
}

function StatRow({ label, overall, homeAway, awayHome, highlight }: TeamStatsProps) {
  return (
    <div className={`grid grid-cols-4 py-3 px-4 ${highlight ? 'bg-emerald-50/50' : ''}`}>
      <div className="col-span-1 text-[11px] font-black text-slate-800 uppercase tracking-tight flex items-center">{label}</div>
      <div className="col-span-1 text-center text-xs font-bold text-slate-600 flex items-center justify-center">{overall}</div>
      <div className={`col-span-1 text-center text-xs font-black ${highlight ? 'text-emerald-600' : 'text-slate-800'} flex items-center justify-center`}>{homeAway}</div>
      <div className="col-span-1 text-center text-xs font-bold text-slate-600 flex items-center justify-center">{awayHome}</div>
    </div>
  );
}

function FormDot({ result }: { result: 'W' | 'L' | 'D' }) {
  const colors = {
    W: 'bg-emerald-500',
    L: 'bg-rose-500',
    D: 'bg-amber-500'
  };
  return (
    <div className={`w-6 h-6 rounded-full ${colors[result]} flex items-center justify-center text-[10px] font-black text-white shadow-sm`}>
      {result}
    </div>
  );
}

export default function TeamComparison({ match }: { match: MatchData }) {
  const homeStats = [
    { label: 'Win %', overall: '26%', homeAway: '23%', awayHome: '29%', highlight: true },
    { label: 'Goals', overall: '3.15', homeAway: '3.08', awayHome: '3.21' },
    { label: 'Scored', overall: '1.26', homeAway: '1.08', awayHome: '1.43', highlight: true },
    { label: 'Conceded', overall: '1.89', homeAway: '2', awayHome: '1.79', highlight: true },
    { label: 'Both Teams to Score', overall: '63%', homeAway: '62%', awayHome: '64%' },
    { label: 'Without Conceding', overall: '19%', homeAway: '23%', awayHome: '14%', highlight: true },
    { label: 'Failed to Score', overall: '26%', homeAway: '23%', awayHome: '29%' },
    { label: '1st to Score', overall: '22%', homeAway: '15%', awayHome: '29%', highlight: true },
    { label: 'xG', overall: '-0.39', homeAway: '0.61', awayHome: '0' },
    { label: 'xGA', overall: '-0.48', homeAway: '0.52', awayHome: '0' }
  ];

  const awayStats = [
    { label: 'Win %', overall: '0%', homeAway: '0%', awayHome: '0%', highlight: true },
    { label: 'Goals', overall: '4.32', homeAway: '4.23', awayHome: '4.42' },
    { label: 'Scored', overall: '0.72', homeAway: '0.85', awayHome: '0.58', highlight: true },
    { label: 'Conceded', overall: '3.6', homeAway: '3.38', awayHome: '3.83', highlight: true },
    { label: 'Both Teams to Score', overall: '56%', homeAway: '62%', awayHome: '50%' },
    { label: 'Without Conceding', overall: '0%', homeAway: '0%', awayHome: '0%', highlight: true },
    { label: 'Failed to Score', overall: '44%', homeAway: '38%', awayHome: '50%' },
    { label: '1st to Score', overall: '22%', homeAway: '38%', awayHome: '17%', highlight: true },
    { label: 'xG', overall: '-0.39', homeAway: '0.61', awayHome: '0' },
    { label: 'xGA', overall: '-0.48', homeAway: '0.52', awayHome: '0' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Home Team Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-brand-indigo py-4 text-center">
          <span className="text-white text-sm font-black uppercase tracking-widest">Home Team</span>
        </div>
        <div className="p-8 pb-0">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
              {match.homeTeam.logoUrl ? (
                <img src={match.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl">⚽</span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">{match.homeTeam.name}</h3>
              <div className="text-xs font-bold text-slate-400 capitalize">{match.league.country.name} - {match.league.name}</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {/* Form & PPG Header */}
            <div className="grid grid-cols-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <div>Form</div>
              <div className="text-center col-span-2">Last 5</div>
              <div className="text-center">PPG</div>
            </div>

            {/* Overall Form */}
            <div className="grid grid-cols-4 items-center px-4 bg-slate-50/50 py-3 rounded-2xl">
              <div className="text-[11px] font-black text-slate-800 uppercase italic">Overall</div>
              <div className="col-span-2 flex justify-center gap-1.5">
                <FormDot result="W" />
                <FormDot result="L" />
                <FormDot result="W" />
                <FormDot result="L" />
                <FormDot result="W" />
              </div>
              <div className="flex justify-center">
                <div className="bg-brand-indigo/10 text-brand-indigo px-3 py-1 rounded-lg text-xs font-black">1.04</div>
              </div>
            </div>

            {/* Home Form */}
            <div className="grid grid-cols-4 items-center px-4 py-1">
              <div className="text-[11px] font-black text-slate-400 uppercase italic">Home</div>
              <div className="col-span-2 flex justify-center gap-1.5">
                <FormDot result="L" />
                <FormDot result="W" />
                <FormDot result="L" />
                <FormDot result="L" />
                <FormDot result="L" />
              </div>
              <div className="flex justify-center">
                <div className="bg-rose-50 text-rose-500 px-3 py-1 rounded-lg text-xs font-black">0.92</div>
              </div>
            </div>

            {/* Away Form */}
            <div className="grid grid-cols-4 items-center px-4 py-1">
              <div className="text-[11px] font-black text-slate-400 uppercase italic">Away</div>
              <div className="col-span-2 flex justify-center gap-1.5">
                <FormDot result="W" />
                <FormDot result="L" />
                <FormDot result="W" />
                <FormDot result="W" />
                <FormDot result="L" />
              </div>
              <div className="flex justify-center">
                <div className="bg-brand-indigo/10 text-brand-indigo px-3 py-1 rounded-lg text-xs font-black">1.14</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Table Headers */}
        <div className="grid grid-cols-4 px-8 py-3 bg-slate-50/30 border-y border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <div>Stats</div>
          <div className="text-center">Overall</div>
          <div className="text-center">Home</div>
          <div className="text-center">Away</div>
        </div>

        <div className="divide-y divide-slate-50 px-4 pb-8">
          {homeStats.map((stat, idx) => (
            <StatRow key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* Away Team Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-brand-indigo py-4 text-center">
          <span className="text-white text-sm font-black uppercase tracking-widest">Away Team</span>
        </div>
        <div className="p-8 pb-0">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
              {match.awayTeam.logoUrl ? (
                <img src={match.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl">⚽</span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">{match.awayTeam.name}</h3>
              <div className="text-xs font-bold text-slate-400 capitalize">{match.league.country.name} - {match.league.name}</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
             {/* Form & PPG Header */}
             <div className="grid grid-cols-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <div>Form</div>
              <div className="text-center col-span-2">Last 5</div>
              <div className="text-center">PPG</div>
            </div>

            {/* Overall Form */}
            <div className="grid grid-cols-4 items-center px-4 bg-rose-50/30 py-3 rounded-2xl border border-rose-100/50">
              <div className="text-[11px] font-black text-slate-800 uppercase italic">Overall</div>
              <div className="col-span-2 flex justify-center gap-1.5">
                <FormDot result="L" />
                <FormDot result="L" />
                <FormDot result="D" />
                <FormDot result="L" />
                <FormDot result="L" />
              </div>
              <div className="flex justify-center">
                <div className="bg-rose-500 text-white px-3 py-1 rounded-lg text-xs font-black shadow-sm">0.08</div>
              </div>
            </div>

            {/* Home Form */}
            <div className="grid grid-cols-4 items-center px-4 py-1">
              <div className="text-[11px] font-black text-slate-400 uppercase italic">Home</div>
              <div className="col-span-2 flex justify-center gap-1.5">
                <FormDot result="L" />
                <FormDot result="D" />
                <FormDot result="L" />
                <FormDot result="L" />
                <FormDot result="D" />
              </div>
              <div className="flex justify-center">
                <div className="bg-rose-50 text-rose-500 px-3 py-1 rounded-lg text-xs font-black">0.15</div>
              </div>
            </div>

            {/* Away Form */}
            <div className="grid grid-cols-4 items-center px-4 py-1">
              <div className="text-[11px] font-black text-slate-400 uppercase italic">Away</div>
              <div className="col-span-2 flex justify-center gap-1.5">
                <FormDot result="L" />
                <FormDot result="L" />
                <FormDot result="L" />
                <FormDot result="L" />
                <FormDot result="L" />
              </div>
              <div className="flex justify-center">
                <div className="bg-rose-500 text-white px-3 py-1 rounded-lg text-xs font-black shadow-sm">0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Table Headers */}
        <div className="grid grid-cols-4 px-8 py-3 bg-slate-50/30 border-y border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <div>Stats</div>
          <div className="text-center">Overall</div>
          <div className="text-center">Home</div>
          <div className="text-center">Away</div>
        </div>

        <div className="divide-y divide-slate-50 px-4 pb-8">
          {awayStats.map((stat, idx) => (
            <StatRow key={idx} {...stat} highlight={stat.highlight} />
          ))}
        </div>
      </div>
    </div>
  );
}
