import React from 'react';

interface TeamStatsSectionProps {
  teamName: string;
  venue?: string;
  city?: string;
  stats: {
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
  };
  nextMatch?: any;
}

export default function TeamStatsSection({ teamName, venue, city, stats, nextMatch }: TeamStatsSectionProps) {
  const totalMatches = (stats?.wins || 0) + (stats?.draws || 0) + (stats?.losses || 0);
  const points = (stats?.wins || 0) * 3 + (stats?.draws || 0);
  const ppg = totalMatches > 0 ? (points / totalMatches).toFixed(2) : '0.00';
  const winRate = totalMatches > 0 ? (((stats?.wins || 0) / totalMatches) * 100).toFixed(1) : '0.0';

  // Calculate countdown for next match
  const getCountdown = () => {
    if (!nextMatch?.kickoffAt) return "No match scheduled";
    const now = new Date();
    const kickoff = new Date(nextMatch.kickoffAt);
    const diff = kickoff.getTime() - now.getTime();
    
    if (diff <= 0) return "Match Live / Finished";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `In ${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Next Match Statistics Card (Simplified for now) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-brand-emerald p-4">
          <h3 className="text-center font-bold text-white uppercase tracking-widest text-xs">Next Match Statistics</h3>
        </div>
        <div className="p-8 flex-1 flex flex-col justify-center items-center">
            <div className="text-center mb-6">
                <span className="text-5xl font-black text-brand-emerald">{getCountdown()}</span>
                {nextMatch?.kickoffAt && (
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                    {formatDate(nextMatch.kickoffAt)}
                  </p>
                )}
            </div>
          <div className="w-full space-y-4 max-w-xs">
            <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-brand-emerald">{winRate}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-emerald rounded-full transition-all duration-1000" 
                    style={{ width: `${winRate}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Points Per Game</span>
                <span className="text-gray-900">{ppg}</span>
            </div>
          </div>
          <button className="btn-primary mt-8">
            View Full Prediction
          </button>
        </div>
      </div>

      {/* Textual Summary Section */}
      <div className="flex flex-col justify-center space-y-8 px-4">
        <div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">{teamName} Standings & Team Stats 2026</h2>
            <p className="text-gray-500 leading-relaxed font-medium">
                Here you can check {teamName} standings for the 2025/26 season, upcoming matches, recent results, full squad, live match info, and team stats.
                This helps you understand how the team has been performing over the year and gives insights that only APWin users get.
            </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start">
                <div className="w-2 h-10 bg-brand-emerald rounded-full mr-4"></div>
                <div>
                   <span className="text-2xl font-black text-gray-900">{stats.goalsScored}</span>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Goals Scored</p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="w-2 h-10 bg-brand-light-emerald border border-brand-emerald/10 rounded-full mr-4"></div>
                <div>
                   <span className="text-2xl font-black text-gray-900">{stats.goalsConceded}</span>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Goals Conceded</p>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{teamName}: Basic Info</h3>
            <p className="text-gray-500 font-medium">
                Stadium: {venue || 'Unknown Stadium'}<br />
                Location: {city || 'Unknown City'}
            </p>
        </div>
      </div>
    </div>
  );
}
