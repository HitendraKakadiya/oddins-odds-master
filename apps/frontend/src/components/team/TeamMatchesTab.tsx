"use client";

import React from 'react';

interface Match {
  id: number;
  date: string;
  time: string;
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
  score?: { home: number; away: number };
  status?: string;
  result?: 'W' | 'D' | 'L';
}

interface TeamMatchesTabProps {
  team: { id: number; name: string; logoUrl: string };
}

export default function TeamMatchesTab({ team }: TeamMatchesTabProps) {
  // Mock data for UI demonstration based on the screenshots provided
  const upcomingMatches: Match[] = [
    { id: 1, date: '05/03/2026', time: '01:00', homeTeam: { name: 'Brighton', logo: 'https://media.api-sports.io/football/teams/33.png' }, awayTeam: { name: 'Arsenal', logo: team.logoUrl } },
    { id: 2, date: '14/03/2026', time: '23:00', homeTeam: { name: 'Arsenal', logo: team.logoUrl }, awayTeam: { name: 'Everton', logo: 'https://media.api-sports.io/football/teams/45.png' } },
    { id: 3, date: '11/04/2026', time: '19:30', homeTeam: { name: 'Arsenal', logo: team.logoUrl }, awayTeam: { name: 'Bournemouth', logo: 'https://media.api-sports.io/football/teams/35.png' } },
    { id: 4, date: '18/04/2026', time: '19:30', homeTeam: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' }, awayTeam: { name: team.name, logo: team.logoUrl } },
    { id: 5, date: '25/04/2026', time: '19:30', homeTeam: { name: team.name, logo: team.logoUrl }, awayTeam: { name: 'Newcastle United', logo: 'https://media.api-sports.io/football/teams/34.png' } },
  ];

  const lastMatches: Match[] = [
    { id: 101, date: '01/03/2026', time: '22:00', homeTeam: { name: 'Arsenal', logo: team.logoUrl }, awayTeam: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' }, score: { home: 2, away: 1 }, result: 'W' },
    { id: 102, date: '22/02/2026', time: '22:00', homeTeam: { name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' }, awayTeam: { name: 'Arsenal', logo: team.logoUrl }, score: { home: 1, away: 4 }, result: 'W' },
    { id: 103, date: '19/02/2026', time: '01:30', homeTeam: { name: 'Wolverhampton', logo: 'https://media.api-sports.io/football/teams/39.png' }, awayTeam: { name: 'Arsenal', logo: team.logoUrl }, score: { home: 2, away: 2 }, result: 'D' },
    { id: 104, date: '13/02/2026', time: '01:30', homeTeam: { name: 'Brentford', logo: 'https://media.api-sports.io/football/teams/55.png' }, awayTeam: { name: 'Arsenal', logo: team.logoUrl }, score: { home: 1, away: 1 }, result: 'D' },
    { id: 105, date: '07/02/2026', time: '20:30', homeTeam: { name: 'Arsenal', logo: team.logoUrl }, awayTeam: { name: 'Sunderland', logo: 'https://media.api-sports.io/football/teams/59.png' }, score: { home: 3, away: 0 }, result: 'W' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header with League Selector */}
      <div className="flex justify-end">
        <div className="relative group">
          <button className="flex items-center space-x-3 bg-white border border-gray-100 px-6 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-5 h-5 flex items-center justify-center">
              <img src="https://media.api-sports.io/football/leagues/39.png" alt="PL" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-700">Premier League</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Upcoming Matches Section */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#4F46E5] p-5">
            <h3 className="text-white font-bold tracking-wide">Premier League - Upcoming Matches</h3>
        </div>
        <div className="divide-y divide-gray-50">
            {upcomingMatches.map((match) => (
                <div key={match.id} className="group hover:bg-gray-50/50 transition-colors duration-200 px-8 py-5 flex items-center justify-between">
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
        </div>
      </div>

      {/* Last Matches Section */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#4F46E5] p-5">
            <h3 className="text-white font-bold tracking-wide">Premier League - Last Matches</h3>
        </div>
        <div className="divide-y divide-gray-50">
            {lastMatches.map((match) => (
                <div key={match.id} className="group hover:bg-gray-50/50 transition-colors duration-200 px-8 py-5 flex items-center justify-between">
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
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm ${
                            match.result === 'W' ? 'bg-[#00D07E]' : match.result === 'L' ? 'bg-[#FF4B4B]' : 'bg-[#FFA500]'
                        }`}>
                            {match.result}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Stats Summary Block */}
      <div className="bg-[#F5F7FF] rounded-[32px] overflow-hidden">
        <div className="bg-[#4F46E5] p-5 flex justify-between items-center">
            <h3 className="text-white font-bold tracking-wide">Premier League - Stats</h3>
            <button className="text-[10px] font-black text-white/70 uppercase tracking-widest hover:text-white transition-colors">
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
                                { label: 'Overall', mp: 29, w: 19, d: 7, l: 3 },
                                { label: 'Home', mp: 14, w: 11, d: 2, l: 1 },
                                { label: 'Away', mp: 15, w: 8, d: 5, l: 2 },
                            ].map((row) => (
                                <tr key={row.label} className="group">
                                    <td className="py-4 text-sm font-bold text-gray-400 group-hover:text-[#4F46E5] transition-colors uppercase tracking-widest text-[10px]">{row.label}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.mp}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.w}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.d}</td>
                                    <td className="py-4 text-center text-sm font-bold text-gray-900">{row.l}</td>
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
                                { label: 'Overall', cs: '45%', btts: '52%', fts: '10%' },
                                { label: 'Home', cs: '50%', btts: '50%', fts: '7%' },
                                { label: 'Away', cs: '40%', btts: '53%', fts: '13%' },
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
                  { label: 'PPG', sub: 'Per Match', val: '2.21' },
                  { label: 'Goal Scored', sub: 'Per Match', val: '2.00' },
                  { label: 'Goals Conceded', sub: 'Per Match', val: '0.76' },
                  { label: 'Corners', sub: 'Per Match', val: '9.10' },
                  { label: 'Corners For', sub: 'Per Match', val: '5.86' },
                  { label: 'Corners Against', sub: 'Per Match', val: '3.24' },
                  { label: 'Cards / Match', sub: 'Per Match', val: '3.28' },
                  { label: 'Cards For', sub: 'Per Match', val: '1.34' },
                  { label: 'Cards Against', sub: 'Per Match', val: '1.93' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm flex items-center justify-between group hover:border-[#614CE1]/30 transition-all duration-300 cursor-default">
                        <div>
                            <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{item.label}</p>
                            <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5">{item.sub}</p>
                        </div>
                        <div className="text-lg font-black text-gray-900 group-hover:text-[#614CE1] transition-colors">{item.val}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
