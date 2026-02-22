'use client';

import type { TeamStats, MatchData } from '@/lib/api/types';

interface TeamPreviewDetailProps {
  teamName: string;
  leagueName: string;
  stats: TeamStats['overall'];
  recentMatches: MatchData[];
  isHome: boolean;
}

export default function TeamPreviewDetail({ teamName, leagueName, stats, recentMatches, isHome }: TeamPreviewDetailProps) {
  return (
    <div className="flex flex-col gap-6">
       <h2 className="text-2xl md:text-3xl font-black text-brand-dark-blue">{teamName} Preview</h2>
       
       <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed">
          <p>
            <strong>{teamName}</strong> has played <strong>{stats.played}</strong> matches in the <strong>{leagueName}</strong> so far, with <strong>{stats.wins} wins, {stats.draws} draws, and {stats.losses} losses</strong>. This results in an <strong>average of {(stats.ppg || 0).toFixed(2)} points</strong> per match.
          </p>
          <p>
            In the 2025/26 season, the team has recorded <strong>{stats.wins} wins in {stats.played} matches</strong>. The team has scored <strong>{stats.scored} goals</strong>, which gives an average of <strong>{(stats.scoredAvg || 0).toFixed(2)} goals</strong> per league match. 
            Defensively, {teamName} has conceded <strong>{stats.conceded} goals</strong> in the league (an average of <strong>{(stats.concededAvg || 0).toFixed(2)}</strong>) and kept <strong>{stats.cleanSheets} clean sheets</strong> throughout the season.
          </p>
       </div>

       <div className="mt-4">
          <div className="bg-brand-indigo rounded-t-2xl px-6 py-4 flex items-center justify-between shadow-lg">
             <h3 className="text-white font-black uppercase tracking-widest text-sm">{teamName}&apos;s Latest Results</h3>
          </div>
          <div className="bg-white border-x border-b border-slate-100 rounded-b-2xl overflow-hidden shadow-sm">
             {recentMatches.slice(0, 5).map((match, index) => {
                const date = new Date(match.kickoffAt).toLocaleDateString('en-GB', {
                   day: '2-digit',
                   month: '2-digit',
                   year: 'numeric'
                });
                
                // Determine result for the displayed team
                const isHomeMatched = (isHome && match.homeTeam.name === teamName) || (!isHome && match.homeTeam.name === teamName);
                const scoreHome = match.score.home ?? 0;
                const scoreAway = match.score.away ?? 0;
                
                let result: 'W' | 'D' | 'L' = 'D';
                if (scoreHome === scoreAway) result = 'D';
                else if (isHomeMatched) {
                   result = scoreHome > scoreAway ? 'W' : 'L';
                } else {
                   result = scoreAway > scoreHome ? 'W' : 'L';
                }

                const opponent = isHomeMatched ? match.awayTeam : match.homeTeam;

                return (
                   <div key={index} className={`flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                      <div className="text-sm font-bold text-slate-400 w-24 shrink-0">{date}</div>
                      <div className="flex-1 flex items-center gap-4">
                         <div className="text-slate-800 font-black text-right flex-1 truncate">{teamName}</div>
                         <div className="w-6 h-6 shrink-0">
                            <img src={isHomeMatched ? match.homeTeam.logoUrl || '' : match.awayTeam.logoUrl || ''} alt="" className="w-full h-full object-contain" />
                         </div>
                         <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1 rounded-lg">
                            <span className="text-sm font-black text-slate-900">{match.score.home} - {match.score.away}</span>
                         </div>
                         <div className="w-6 h-6 shrink-0">
                            <img src={isHomeMatched ? match.awayTeam.logoUrl || '' : match.homeTeam.logoUrl || ''} alt="" className="w-full h-full object-contain" />
                         </div>
                         <div className="text-slate-800 font-black flex-1 truncate">{opponent.name}</div>
                      </div>
                      <div className="w-12 flex justify-end">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${
                            result === 'W' ? 'bg-green-500' : result === 'L' ? 'bg-red-500' : 'bg-orange-500'
                         }`}>
                            {result}
                         </div>
                      </div>
                   </div>
                );
             })}
          </div>
       </div>
    </div>
  );
}
