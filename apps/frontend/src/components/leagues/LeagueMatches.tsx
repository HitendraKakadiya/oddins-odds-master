'use client';

import Link from 'next/link';
import { MatchData } from '@/lib/api/types';

interface LeagueMatchesProps {
  fixtures: MatchData[];
  results: MatchData[];
}

export default function LeagueMatches({ fixtures, results }: LeagueMatchesProps) {
  return (
    <div className="space-y-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Fixtures Section */}
      <MatchSection title="Fixtures" matches={fixtures} type="fixtures" />

      {/* Results Section */}
      <MatchSection title="Results" matches={results} type="results" />
    </div>
  );
}

function MatchSection({ title, matches, type }: { title: string; matches: MatchData[]; type: 'fixtures' | 'results' }) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[200px] flex flex-col">
      {/* Header */}
      <div className="bg-[#6347EA] px-10 py-6">
        <h3 className="text-xl font-black text-white uppercase tracking-widest">{title}</h3>
      </div>

      {/* Match Rows or Empty State */}
      <div className="divide-y divide-slate-50 px-2 lg:px-6 flex-1">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 opacity-40">
            <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">No {type} available</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchRow key={match.matchId} match={match} type={type} />
          ))
        )}
      </div>
    </div>
  );
}

function MatchRow({ match, type }: { match: MatchData; type: 'fixtures' | 'results' }) {
  const kickoffDate = new Date(match.kickoffAt);
  const formattedDate = kickoffDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = kickoffDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="py-6 flex items-center group hover:bg-slate-50/50 transition-all duration-300">
      {/* Date & Time */}
      <div className="w-1/4 lg:w-1/5 shrink-0 px-4">
        <span className="text-sm font-bold text-slate-800 tabular-nums">
          {formattedDate} - {formattedTime}
        </span>
      </div>

      {/* Matchup */}
      <div className="flex-1 flex items-center justify-center gap-2 lg:gap-12 px-2">
        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          <span className="text-sm lg:text-base font-black text-slate-700 text-right truncate group-hover:text-brand-emerald transition-colors">
            {match.homeTeam.name}
          </span>
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0">
            <img src={match.homeTeam.logoUrl || ''} alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Score or VS */}
        <div className="w-20 lg:w-32 flex items-center justify-center shrink-0">
          {type === 'results' ? (
            <div className="flex items-center gap-2 lg:gap-4 px-4 py-2 lg:py-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-lg lg:text-xl font-black text-slate-900">{match.score.home ?? 0}</span>
              <span className="text-slate-300 font-black text-sm">:</span>
              <span className="text-lg lg:text-xl font-black text-slate-900">{match.score.away ?? 0}</span>
            </div>
          ) : (
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">v.s</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0">
            <img src={match.awayTeam.logoUrl || ''} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm lg:text-base font-black text-slate-700 text-left truncate group-hover:text-brand-emerald transition-colors">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Actions (Optional - can add See Prediction like in LeagueMatchList if needed) */}
      <div className="hidden lg:flex w-32 justify-end px-4">
        <Link 
          href={`/predictions/${match.matchId}`}
          className="opacity-0 group-hover:opacity-100 bg-brand-emerald/10 text-brand-emerald px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-emerald hover:text-white transition-all shadow-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
