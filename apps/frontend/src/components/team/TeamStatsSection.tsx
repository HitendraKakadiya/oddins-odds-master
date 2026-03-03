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
}

export default function TeamStatsSection({ teamName, venue, city, stats }: TeamStatsSectionProps) {
  const totalMatches = stats.wins + stats.draws + stats.losses;
  const points = stats.wins * 3 + stats.draws;
  const ppg = totalMatches > 0 ? (points / totalMatches).toFixed(2) : '0.00';
  const winRate = totalMatches > 0 ? ((stats.wins / totalMatches) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Next Match Statistics Card (Simplified for now) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-brand-indigo p-4">
          <h3 className="text-center font-bold text-white uppercase tracking-widest text-xs">Next Match Statistics</h3>
        </div>
        <div className="p-8 flex-1 flex flex-col justify-center items-center">
            <div className="text-center mb-6">
                <span className="text-5xl font-black text-brand-indigo">In 1 days</span>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Sun, 01 March 2026 - 22:00</p>
            </div>
          <div className="w-full space-y-4 max-w-xs">
            <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-brand-indigo">{winRate}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-indigo rounded-full transition-all duration-1000" 
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
                <div className="w-2 h-10 bg-brand-indigo rounded-full mr-4"></div>
                <div>
                   <span className="text-2xl font-black text-gray-900">{stats.goalsScored}</span>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Goals Scored</p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="w-2 h-10 bg-brand-light-indigo border border-brand-indigo/10 rounded-full mr-4"></div>
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
