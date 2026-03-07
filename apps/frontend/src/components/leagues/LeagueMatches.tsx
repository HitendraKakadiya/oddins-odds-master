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
      <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] px-10 py-6 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] relative z-10">{title}</h3>
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
    <div className="py-5 flex flex-col sm:flex-row items-center group hover:bg-slate-50/50 transition-all duration-300 gap-4 sm:gap-0">
      {/* Date & Time */}
      <div className="w-full sm:w-1/4 lg:w-1/5 shrink-0 px-4 flex flex-col items-center sm:items-start">
        <span className="text-[11px] font-black text-slate-800 tabular-nums">
          {formattedDate}
        </span>
        <span className="text-[10px] font-bold text-slate-400">
          {formattedTime}
        </span>
      </div>

      {/* Matchup */}
      <div className="flex-1 flex items-center justify-center gap-2 lg:gap-8 px-2 w-full">
        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          <span className="text-sm font-black text-slate-700 text-right truncate group-hover:text-brand-emerald transition-colors">
            {match.homeTeam.name}
          </span>
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden">
            {match.homeTeam.logoUrl ? (
              <img src={match.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs font-black text-slate-300">{match.homeTeam.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Score or VS */}
        <div className="shrink-0">
          {type === 'results' ? (
            <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/60 min-w-[64px] justify-center shadow-inner tabular-nums">
              <span className="text-sm font-black text-brand-midnight">{match.score.home ?? 0}</span>
              <span className="text-slate-300 font-bold">-</span>
              <span className="text-sm font-black text-brand-midnight">{match.score.away ?? 0}</span>
            </div>
          ) : (
            <div className="bg-brand-emerald/5 px-3 py-1.5 rounded-lg border border-brand-emerald/10 text-brand-emerald text-[10px] font-black italic min-w-[64px] text-center">
              VS
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden">
            {match.awayTeam.logoUrl ? (
              <img src={match.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs font-black text-slate-300">{match.awayTeam.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <span className="text-sm font-black text-slate-700 text-left truncate group-hover:text-brand-emerald transition-colors">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full sm:w-24 lg:w-32 flex justify-center sm:justify-end px-4">
        <Link 
          href={`/match/${match.matchId}`}
          className="bg-slate-50 text-slate-400 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-brand-emerald hover:text-white transition-all shadow-sm border border-slate-100"
          title="Match Detail"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
