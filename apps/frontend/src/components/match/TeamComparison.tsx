'use client';

import type { MatchData, TeamStats } from '@/lib/api/types';

interface TeamComparisonProps {
  match: MatchData;
  homeStats?: TeamStats | null;
  awayStats?: TeamStats | null;
  homeStatsSource?: 'league' | 'all' | 'any';
  awayStatsSource?: 'league' | 'all' | 'any';
}

interface StatRowProps {
  label: string;
  overall: string | number;
  homeAway: string | number;
  awayHome: string | number;
  highlight?: boolean;
}

function StatRow({ label, overall, homeAway, awayHome, highlight }: StatRowProps) {
  return (
    <div className={`grid grid-cols-4 py-2.5 md:py-3 px-3 md:px-4 ${highlight ? 'bg-emerald-50/50' : ''}`}>
      <div className="col-span-1 text-[9px] md:text-[11px] font-black text-slate-800 uppercase tracking-tight flex items-center leading-tight">{label}</div>
      <div className="col-span-1 text-center text-[11px] md:text-xs font-bold text-slate-600 flex items-center justify-center">{overall}</div>
      <div className={`col-span-1 text-center text-[11px] md:text-xs font-black ${highlight ? 'text-emerald-600' : 'text-slate-800'} flex items-center justify-center`}>{homeAway}</div>
      <div className="col-span-1 text-center text-[11px] md:text-xs font-bold text-slate-600 flex items-center justify-center">{awayHome}</div>
    </div>
  );
}

function FormDot({ result }: { result: string }) {
  const colors: Record<string, string> = {
    W: 'bg-emerald-500',
    L: 'bg-rose-500',
    D: 'bg-amber-500'
  };
  return (
    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${colors[result] || 'bg-slate-200'} flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shadow-sm shrink-0`}>
      {result}
    </div>
  );
}

const mapStatsData = (stats: TeamStats) => [
  { label: 'Win %', overall: `${stats.overall.winRate || 0}%`, homeAway: `${stats.home.winRate || 0}%`, awayHome: `${stats.away.winRate || 0}%`, highlight: true },
  { label: 'Goals', overall: (stats.overall.scoredAvg + stats.overall.concededAvg).toFixed(2), homeAway: (stats.home.scoredAvg + stats.home.concededAvg).toFixed(2), awayHome: (stats.away.scoredAvg + stats.away.concededAvg).toFixed(2) },
  { label: 'Scored', overall: stats.overall.scoredAvg || 0, homeAway: stats.home.scoredAvg || 0, awayHome: stats.away.scoredAvg || 0, highlight: true },
  { label: 'Conceded', overall: stats.overall.concededAvg || 0, homeAway: stats.home.concededAvg || 0, awayHome: stats.away.concededAvg || 0, highlight: true },
  { label: 'BTTS %', overall: `${stats.overall.bttsRate || 0}%`, homeAway: `${stats.home.bttsRate || 0}%`, awayHome: `${stats.away.bttsRate || 0}%` },
  { label: 'Clean Sheets', overall: `${stats.overall.cleanSheetRate || 0}%`, homeAway: `${stats.home.cleanSheetRate || 0}%`, awayHome: `${stats.away.cleanSheetRate || 0}%`, highlight: true },
  { label: 'Failed to Score', overall: `${stats.overall.failedToScoreRate || 0}%`, homeAway: `${stats.home.failedToScoreRate || 0}%`, awayHome: `${stats.away.failedToScoreRate || 0}%` },
  { label: 'xG', overall: '0.00', homeAway: '0.00', awayHome: '0.00' }, // Placeholder
  { label: 'xGA', overall: '0.00', homeAway: '0.00', awayHome: '0.00' }  // Placeholder
];

export default function TeamComparison({ match, homeStats, awayStats, homeStatsSource, awayStatsSource }: TeamComparisonProps) {
  if (!homeStats || !awayStats) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
      {/* Home Team Section */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-brand-indigo py-3 md:py-4 text-center">
          <span className="text-white text-[11px] md:text-sm font-black uppercase tracking-widest">Home Team Stats</span>
        </div>
        <div className="p-5 md:p-8 pb-0">
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 md:p-3 shrink-0">
              {match.homeTeam.logoUrl ? (
                <img src={match.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl md:text-2xl">⚽</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-0.5 md:mb-1 truncate">{match.homeTeam.name}</h3>
              <div className="text-[10px] md:text-xs font-bold text-slate-400 capitalize truncate">{match.league.country.name} - {match.league.name}</div>
              {(homeStatsSource === 'all' || homeStatsSource === 'any') && (
                <div className="mt-1.5 inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">
                  <svg className="w-2.5 h-2.5 md:w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Historical
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div className="grid grid-cols-4 px-2 md:px-4 text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <div>Form</div>
              <div className="text-center col-span-2">Last 5 Matches</div>
              <div className="text-center">PPG</div>
            </div>

            {/* Overall Form */}
            <div className="grid grid-cols-4 items-center px-2 md:px-4 bg-slate-50/50 py-2.5 md:py-3 rounded-xl md:rounded-2xl">
              <div className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase italic">Overall</div>
              <div className="col-span-2 flex justify-center gap-1 md:gap-1.5 overflow-hidden">
                {(homeStats.last5 || []).map((r, i) => <FormDot key={i} result={r} />)}
              </div>
              <div className="flex justify-center">
                <div className="bg-brand-indigo/10 text-brand-indigo px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-black">{homeStats.overall.ppg || 0}</div>
              </div>
            </div>

            {/* Home Form */}
            <div className="grid grid-cols-4 items-center px-2 md:px-4 py-1">
              <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase italic">Home</div>
              <div className="col-span-2 flex justify-center gap-1 md:gap-1.5">
                {(homeStats.last5Home || []).map((r, i) => <FormDot key={i} result={r} />)}
              </div>
              <div className="flex justify-center">
                <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-black ${(homeStats.home.ppg || 0) >= 1.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {homeStats.home.ppg || 0}
                </div>
              </div>
            </div>

             {/* Away Form */}
             <div className="grid grid-cols-4 items-center px-2 md:px-4 py-1">
              <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase italic">Away</div>
              <div className="col-span-2 flex justify-center gap-1 md:gap-1.5">
                {(homeStats.last5Away || []).map((r, i) => <FormDot key={i} result={r} />)}
              </div>
              <div className="flex justify-center">
                <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-black ${(homeStats.away.ppg || 0) >= 1.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {homeStats.away.ppg || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 px-5 md:px-8 py-1 bg-slate-50/30 border-y border-slate-50 text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <div>Stats</div>
          <div className="text-center">Total</div>
          <div className="text-center">Home</div>
          <div className="text-center">Away</div>
        </div>

        <div className="divide-y divide-slate-50 px-2 md:px-4 pb-6 md:pb-8">
          {mapStatsData(homeStats).map((stat, idx) => (
            <StatRow key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* Away Team Section */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-brand-indigo py-3 md:py-4 text-center">
          <span className="text-white text-[11px] md:text-sm font-black uppercase tracking-widest">Away Team Stats</span>
        </div>
        <div className="p-5 md:p-8 pb-0">
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 md:p-3 shrink-0">
              {match.awayTeam.logoUrl ? (
                <img src={match.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl md:text-2xl">⚽</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-0.5 md:mb-1 truncate">{match.awayTeam.name}</h3>
              <div className="text-[10px] md:text-xs font-bold text-slate-400 capitalize truncate">{match.league.country.name} - {match.league.name}</div>
              {(awayStatsSource === 'all' || awayStatsSource === 'any') && (
                <div className="mt-1.5 inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Historical
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div className="grid grid-cols-4 px-2 md:px-4 text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <div>Form</div>
              <div className="text-center col-span-2">Last 5 Matches</div>
              <div className="text-center">PPG</div>
            </div>

            {/* Overall Form */}
            <div className="grid grid-cols-4 items-center px-2 md:px-4 bg-slate-50/50 py-2.5 md:py-3 rounded-xl md:rounded-2xl">
              <div className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase italic">Overall</div>
              <div className="col-span-2 flex justify-center gap-1 md:gap-1.5 overflow-hidden">
                {(awayStats.last5 || []).map((r, i) => <FormDot key={i} result={r} />)}
              </div>
              <div className="flex justify-center">
                <div className="bg-brand-indigo/10 text-brand-indigo px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-black">{awayStats.overall.ppg || 0}</div>
              </div>
            </div>

            {/* Home Form */}
            <div className="grid grid-cols-4 items-center px-2 md:px-4 py-1">
              <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase italic">Home</div>
              <div className="col-span-2 flex justify-center gap-1 md:gap-1.5">
                {(awayStats.last5Home || []).map((r, i) => <FormDot key={i} result={r} />)}
              </div>
              <div className="flex justify-center">
                <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-black ${(awayStats.home.ppg || 0) >= 1.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {awayStats.home.ppg || 0}
                </div>
              </div>
            </div>

             {/* Away Form */}
             <div className="grid grid-cols-4 items-center px-2 md:px-4 py-1">
              <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase italic">Away</div>
              <div className="col-span-2 flex justify-center gap-1 md:gap-1.5">
                {(awayStats.last5Away || []).map((r, i) => <FormDot key={i} result={r} />)}
              </div>
              <div className="flex justify-center">
                <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-black ${(awayStats.away.ppg || 0) >= 1.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {awayStats.away.ppg || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 px-5 md:px-8 py-1 bg-slate-50/30 border-y border-slate-50 text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <div>Stats</div>
          <div className="text-center">Total</div>
          <div className="text-center">Home</div>
          <div className="text-center">Away</div>
        </div>

        <div className="divide-y divide-slate-50 px-2 md:px-4 pb-6 md:pb-8">
          {mapStatsData(awayStats).map((stat, idx) => (
            <StatRow key={idx} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
