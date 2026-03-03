"use client";

import React, { useState } from 'react';

interface StatsRow {
  rank: number;
  team: { name: string; logo: string };
  mp: number;
  val: number;
  avgOverall: string;
  avgHome: string;
  avgAway: string;
}

const subTabs = [
  { key: 'goals', label: 'Goals' },
  { key: 'cards', label: 'Cards' },
  { key: '1st-half', label: '1st Half' },
  { key: '2nd-half', label: '2nd Half' },
  { key: 'over-under', label: 'Over Under Goals' },
  { key: 'clean-sheet', label: 'Clean Sheet' },
  { key: 'btts', label: 'BTTS' },
  { key: 'scoring-first', label: 'Match Scoring / Conceding First' },
];

export default function TeamStatsTab() {
  const [activeSubTab, setActiveSubTab] = useState('goals');
  const [filter, setFilter] = useState<'Overall' | 'Home' | 'Away'>('Overall');
  const [metric, setMetric] = useState('Goal Scored');

  const statsData: StatsRow[] = [
    { rank: 1, team: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' }, mp: 29, val: 58, avgOverall: '2', avgHome: '2.36', avgAway: '1.67' },
    { rank: 2, team: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' }, mp: 28, val: 57, avgOverall: '2.04', avgHome: '2.43', avgAway: '1.64' },
    { rank: 3, team: { name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' }, mp: 28, val: 50, avgOverall: '1.79', avgHome: '1.93', avgAway: '1.64' },
    { rank: 4, team: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' }, mp: 28, val: 49, avgOverall: '1.75', avgHome: '1.64', avgAway: '1.86' },
    { rank: 5, team: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' }, mp: 28, val: 47, avgOverall: '1.68', avgHome: '1.86', avgAway: '1.5' },
    { rank: 6, team: { name: 'Bournemouth', logo: 'https://media.api-sports.io/football/teams/35.png' }, mp: 28, val: 44, avgOverall: '1.57', avgHome: '1.5', avgAway: '1.64' },
    { rank: 7, team: { name: 'Brentford', logo: 'https://media.api-sports.io/football/teams/55.png' }, mp: 28, val: 44, avgOverall: '1.57', avgHome: '1.71', avgAway: '1.43' },
    { rank: 8, team: { name: 'Newcastle United', logo: 'https://media.api-sports.io/football/teams/34.png' }, mp: 28, val: 40, avgOverall: '1.43', avgHome: '1.86', avg1: '1' } as any,
    { rank: 9, team: { name: 'Fulham', logo: 'https://media.api-sports.io/football/teams/36.png' }, mp: 28, val: 40, avgOverall: '1.43', avgHome: '1.71', avgAway: '1.14' },
    { rank: 10, team: { name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' }, mp: 28, val: 38, avgOverall: '1.36', avgHome: '1.21', avgAway: '1.5' },
    { rank: 11, team: { name: 'Aston Villa', logo: 'https://media.api-sports.io/football/teams/66.png' }, mp: 28, val: 38, avgOverall: '1.36', avgHome: '1.43', avgAway: '1.29' },
    { rank: 12, team: { name: 'Brighton', logo: 'https://media.api-sports.io/football/teams/33.png' }, mp: 28, val: 38, avgOverall: '1.36', avgHome: '1.57', avgAway: '1.14' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Sub-navigation */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide">
        <div className="flex px-2">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`px-6 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeSubTab === tab.key 
                  ? 'text-brand-emerald' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeSubTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-emerald animate-in slide-in-from-left duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
        {/* Section Header */}
        <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          
          <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">
            {subTabs.find(t => t.key === activeSubTab)?.label}
          </h3>
          <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
            <span className="text-xs">📈</span>
          </div>
        </div>

        <div className="p-8">
          {/* Controls: Dropdown & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="relative group/select w-full sm:w-64">
              <select 
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none appearance-none cursor-pointer focus:border-brand-emerald/30 focus:bg-white transition-all"
              >
                <option>Goal Scored</option>
                <option>Goal Conceded</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-[20px] border border-slate-100 shadow-inner">
              {(['Overall', 'Home', 'Away'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-8 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    filter === item
                      ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20 scale-105'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-5">#</th>
                    <th className="px-6 py-5">Team</th>
                    <th className="px-4 py-5 text-center">MP</th>
                    <th className="px-4 py-5 text-center">{metric}</th>
                    <th className="px-4 py-5 text-center">Avg. Overall</th>
                    <th className="px-4 py-5 text-center">Avg. Home</th>
                    <th className="px-6 py-5 text-right">Avg. Away</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {statsData.map((stat) => (
                    <tr key={stat.rank} className="group hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-300 group-hover:text-brand-emerald transition-colors">{stat.rank}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 p-1.5 transition-transform group-hover:scale-110">
                            <img src={stat.team.logo} alt={stat.team.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{stat.team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-bold text-slate-900">{stat.mp}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-black text-slate-900 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                          {stat.val}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-500">{stat.avgOverall}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-500">{stat.avgHome}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-4 py-1.5 bg-brand-light-emerald rounded-xl text-xs font-black text-brand-emerald border border-brand-emerald/10">
                          {stat.avgAway || '1.00'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
