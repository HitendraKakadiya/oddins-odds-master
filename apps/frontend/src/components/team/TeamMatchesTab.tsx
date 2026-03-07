"use client";

import { MatchData } from '@/lib/api/types';

interface TeamMatchesTabProps {
  team: { id: number; name: string; logoUrl: string };
  upcomingMatches: MatchData[];
  lastMatches: MatchData[];
  stats?: any;
  standings?: any[];
}

export default function TeamMatchesTab({ team, upcomingMatches = [], lastMatches = [], stats, standings = [] }: TeamMatchesTabProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const mappedUpcoming = upcomingMatches.map(m => ({
    ...m,
    date: m.kickoffAt ? formatDate(m.kickoffAt) : (m as any).date,
    time: m.kickoffAt ? formatTime(m.kickoffAt) : (m as any).time,
    homeTeam: { name: m.homeTeam.name, logo: (m.homeTeam as any).logo || (m.homeTeam as any).logoUrl || 'https://media.api-sports.io/football/teams/unknown.png' },
    awayTeam: { name: m.awayTeam.name, logo: (m.awayTeam as any).logo || (m.awayTeam as any).logoUrl || 'https://media.api-sports.io/football/teams/unknown.png' }
  }));

  const mappedLast = lastMatches.map(m => {
    let result = (m as any).result;
    if (!result && m.score && m.score.home !== null && m.score.away !== null) {
      const isHome = m.homeTeam.name === team.name;
      if (m.score.home === m.score.away) result = 'D';
      else if (isHome) result = m.score.home > m.score.away ? 'W' : 'L';
      else result = m.score.away > m.score.home ? 'W' : 'L';
    }

    return {
      ...m,
      date: m.kickoffAt ? formatDate(m.kickoffAt) : (m as any).date,
      time: m.kickoffAt ? formatTime(m.kickoffAt) : (m as any).time,
      homeTeam: { name: m.homeTeam.name, logo: (m.homeTeam as any).logo || (m.homeTeam as any).logoUrl || 'https://media.api-sports.io/football/teams/unknown.png' },
      awayTeam: { name: m.awayTeam.name, logo: (m.awayTeam as any).logo || (m.awayTeam as any).logoUrl || 'https://media.api-sports.io/football/teams/unknown.png' },
      result: result as 'W' | 'D' | 'L'
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Matches Content - League selector removed as it's now in the header tabs component */}

      {/* Upcoming Matches Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
        <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            
            <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">Premier League - Upcoming Matches</h3>
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
                <span className="text-xs">📅</span>
            </div>
        </div>
        <div className="divide-y divide-gray-50">
            {mappedUpcoming.map((match) => (
                <div key={match.matchId} className="group hover:bg-gray-50/50 transition-colors duration-200 px-8 py-5 flex items-center justify-between">
                    <div className="flex-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        {match.date} - {match.time}
                    </div>
                    <div className="flex-[3] flex items-center justify-center space-x-12">
                        <div className="flex items-center space-x-3 w-40 justify-end">
                            <span className="text-sm font-bold text-gray-900">{match.homeTeam.name}</span>
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-50 p-1">
                                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-tighter italic">v.s</div>
                        <div className="flex items-center space-x-3 w-40 justify-start">
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-50 p-1">
                                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{match.awayTeam.name}</span>
                        </div>
                    </div>
                    <div className="flex-1"></div>
                </div>
            ))}
            {mappedUpcoming.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                No upcoming matches found
              </div>
            )}
        </div>
      </div>

      {/* Last Matches Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
        <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            
            <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">Premier League - Last Matches</h3>
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
                <span className="text-xs">📊</span>
            </div>
        </div>
        <div className="divide-y divide-gray-50">
            {mappedLast.map((match) => (
                <div key={match.matchId} className="group hover:bg-gray-50/50 transition-colors duration-200 px-8 py-5 flex items-center justify-between">
                    <div className="flex-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        {match.date} - {match.time}
                    </div>
                    <div className="flex-[3] flex items-center justify-center space-x-8">
                        <div className="flex items-center space-x-4 w-48 justify-end">
                            <span className={`text-sm font-bold ${match.homeTeam.name === team.name ? 'text-gray-900 font-extrabold' : 'text-gray-500'}`}>{match.homeTeam.name}</span>
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-50 p-1">
                                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-inner flex items-center space-x-2">
                            <span className="text-sm font-black text-gray-900">{match.score?.home}</span>
                            <span className="text-[10px] text-gray-300 font-black">:</span>
                            <span className="text-sm font-black text-gray-900">{match.score?.away}</span>
                        </div>
                        <div className="flex items-center space-x-4 w-48 justify-start">
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-50 p-1">
                                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
                            </div>
                            <span className={`text-sm font-bold ${match.awayTeam.name === team.name ? 'text-gray-900 font-extrabold' : 'text-gray-500'}`}>{match.awayTeam.name}</span>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-lg transition-transform hover:scale-110 ${
                            match.result === 'W' ? 'bg-brand-emerald shadow-brand-emerald/20' : match.result === 'L' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-amber-500 shadow-amber-500/20'
                        }`}>
                            {match.result}
                        </div>
                    </div>
                </div>
            ))}
            {mappedLast.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                No recent matches found
              </div>
            )}
        </div>
      </div>

      {/* Stats Summary Block */}
      <div className="bg-[#F8FAFC] rounded-[48px] border border-slate-100/80 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex justify-between items-center relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            
            <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">Premier League - Stats</h3>
            <button className="text-[10px] font-black text-white bg-white/10 hover:bg-white hover:text-brand-emerald px-5 py-2.5 rounded-2xl uppercase tracking-widest transition-all backdrop-blur-md border border-white/20 relative z-10 shadow-lg">
                {team.name} Standings →
            </button>
        </div>
        
        <div className="p-10 space-y-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Compact Standings Table */}
                <div className="flex-[2] bg-white rounded-3xl p-8 border border-[#E0E7FF] shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                <th className="pb-4"></th>
                                <th className="pb-4 text-center">MP</th>
                                <th className="pb-4 text-center">W</th>
                                <th className="pb-4 text-center">D</th>
                                <th className="pb-4 text-center">L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { label: 'Overall', data: stats?.overall },
                                { label: 'Home', data: stats?.home },
                                { label: 'Away', data: stats?.away },
                            ].map((row) => (
                                <tr key={row.label} className="group">
                                    <td className="py-4 text-sm font-bold text-gray-400 group-hover:text-brand-emerald transition-colors uppercase tracking-widest text-[10px]">{row.label}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.data?.played || 0}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.data?.wins || 0}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.data?.draws || 0}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.data?.losses || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Scenarios Table (CS, BTTS, FTS) */}
                <div className="flex-[3] bg-white rounded-3xl p-8 border border-[#E0E7FF] shadow-sm relative overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                <th className="pb-4"></th>
                                <th className="pb-4 text-center px-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center space-x-1">
                                            <span>CS</span>
                                            <div className="w-3 h-3 rounded-full border border-gray-200 flex items-center justify-center text-[7px] font-black text-gray-300">i</div>
                                        </div>
                                    </div>
                                </th>
                                <th className="pb-4 text-center px-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center space-x-1">
                                            <span>BTTS</span>
                                            <div className="w-3 h-3 rounded-full border border-gray-200 flex items-center justify-center text-[7px] font-black text-gray-300">i</div>
                                        </div>
                                    </div>
                                </th>
                                <th className="pb-4 text-center px-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center space-x-1">
                                            <span>FTS</span>
                                            <div className="w-3 h-3 rounded-full border border-gray-200 flex items-center justify-center text-[7px] font-black text-gray-300">i</div>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { label: 'Overall', cs: stats?.cleanSheets || 0, btts: stats?.bttsRate ? `${stats.bttsRate}%` : '0%', fts: stats?.failedToScoreRate ? `${stats.failedToScoreRate}%` : '0%' },
                                { label: 'Home', cs: stats?.homeCleanSheets || 0, btts: stats?.homeBttsRate ? `${stats.homeBttsRate}%` : '0%', fts: stats?.homeFailedToScoreRate ? `${stats.homeFailedToScoreRate}%` : '0%' },
                                { label: 'Away', cs: stats?.awayCleanSheets || 0, btts: stats?.awayBttsRate ? `${stats.awayBttsRate}%` : '0%', fts: stats?.awayFailedToScoreRate ? `${stats.awayFailedToScoreRate}%` : '0%' },
                            ].map((row) => (
                                <tr key={row.label} className="group">
                                    <td className="py-4 text-sm font-bold text-gray-400 group-hover:text-primary-600 transition-colors uppercase tracking-widest text-[10px]">{row.label}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.cs}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.btts}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.fts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'PPG', sub: 'Per Match', val: stats?.ppg || '-' },
                  { label: 'Goal Scored', sub: 'Per Match', val: stats?.goalsScoredAvg || '-' },
                  { label: 'Goals Conceded', sub: 'Per Match', val: stats?.goalsConcededAvg || '-' },
                  { label: 'Corners', sub: 'Per Match', val: stats?.cornersAvg || '-' },
                  { label: 'Corners For', sub: 'Per Match', val: stats?.cornersForAvg || '-' },
                  { label: 'Corners Against', sub: 'Per Match', val: stats?.cornersAgainstAvg || '-' },
                  { label: 'Cards / Match', sub: 'Per Match', val: stats?.cardsAvg || '-' },
                  { label: 'Cards For', sub: 'Per Match', val: stats?.cardsForAvg || '-' },
                  { label: 'Cards Against', sub: 'Per Match', val: stats?.cardsAgainstAvg || '-' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm flex items-center justify-between group hover:border-brand-emerald/30 transition-all duration-300 cursor-default">
                        <div>
                            <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{item.label}</p>
                            <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5">{item.sub}</p>
                        </div>
                        <div className="text-lg font-black text-gray-900 group-hover:text-brand-emerald transition-colors">{item.val}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
