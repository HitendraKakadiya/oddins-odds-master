"use client";

import React, { useState } from 'react';

interface CornerStat {
  rank: number;
  team: { name: string; logo: string };
  mp: number;
  over7_5: string;
  over8_5: string;
  over9_5: string;
  over10_5: string;
  over11_5: string;
  over12_5: string;
  over13_5: string;
  average: string;
}

export default function TeamCornersTab() {
  const [filter, setFilter] = useState<'Overall' | 'Home' | 'Away'>('Overall');

  const cornerStats: CornerStat[] = [
    { rank: 1, team: { name: 'Newcastle United', logo: 'https://media.api-sports.io/football/teams/34.png' }, mp: 28, over7_5: '89%', over8_5: '82%', over9_5: '68%', over10_5: '57%', over11_5: '50%', over12_5: '39%', over13_5: '29%', average: '11.82' },
    { rank: 2, team: { name: 'West Ham', logo: 'https://media.api-sports.io/football/teams/48.png' }, mp: 28, over7_5: '86%', over8_5: '75%', over9_5: '68%', over10_5: '64%', over11_5: '50%', over12_5: '36%', over13_5: '29%', average: '11.43' },
    { rank: 3, team: { name: 'Bournemouth', logo: 'https://media.api-sports.io/football/teams/35.png' }, mp: 28, over7_5: '86%', over8_5: '75%', over9_5: '64%', over10_5: '54%', over11_5: '36%', over12_5: '32%', over13_5: '25%', average: '10.97' },
    { rank: 4, team: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' }, mp: 28, over7_5: '89%', over8_5: '79%', over9_5: '54%', over10_5: '43%', over11_5: '32%', over12_5: '32%', over13_5: '25%', average: '10.39' },
    { rank: 5, team: { name: 'Fulham', logo: 'https://media.api-sports.io/football/teams/36.png' }, mp: 28, over7_5: '82%', over8_5: '79%', over9_5: '68%', over10_5: '43%', over11_5: '32%', over12_5: '18%', over13_5: '11%', average: '10.35' },
    { rank: 6, team: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' }, mp: 28, over7_5: '79%', over8_5: '79%', over9_5: '71%', over10_5: '50%', over11_5: '36%', over12_5: '21%', over13_5: '11%', average: '10.32' },
    { rank: 7, team: { name: 'Nottingham Forest', logo: 'https://media.api-sports.io/football/teams/65.png' }, mp: 28, over7_5: '86%', over8_5: '79%', over9_5: '64%', over10_5: '46%', over11_5: '25%', over12_5: '18%', over13_5: '11%', average: '10.22' },
    { rank: 8, team: { name: 'Brentford', logo: 'https://media.api-sports.io/football/teams/55.png' }, mp: 28, over7_5: '79%', over8_5: '75%', over9_5: '68%', over10_5: '57%', over11_5: '32%', over12_5: '14%', over13_5: '7%', average: '10.14' },
    { rank: 9, team: { name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' }, mp: 28, over7_5: '68%', over8_5: '54%', over9_5: '50%', over10_5: '43%', over11_5: '36%', over12_5: '29%', over13_5: '21%', average: '10.11' },
    { rank: 10, team: { name: 'Aston Villa', logo: 'https://media.api-sports.io/football/teams/66.png' }, mp: 28, over7_5: '82%', over8_5: '71%', over9_5: '64%', over10_5: '46%', over11_5: '25%', over12_5: '18%', over13_5: '7%', average: '9.96' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
        <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          
          <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">Corners</h3>
          <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
            <span className="text-xs">⛳</span>
          </div>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-8">
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

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-5">#</th>
                    <th className="px-6 py-5">Team</th>
                    <th className="px-4 py-5 text-center">MP</th>
                    <th className="px-4 py-5 text-center">Over 7.5</th>
                    <th className="px-4 py-5 text-center">Over 8.5</th>
                    <th className="px-4 py-5 text-center">Over 9.5</th>
                    <th className="px-4 py-5 text-center">Over 10.5</th>
                    <th className="px-4 py-5 text-center">Over 11.5</th>
                    <th className="px-4 py-5 text-center">Over 12.5</th>
                    <th className="px-4 py-5 text-center">Over 13.5</th>
                    <th className="px-6 py-5 text-right">Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cornerStats.map((stat) => (
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
                        <span className="text-sm font-medium text-slate-600">{stat.over7_5}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600">{stat.over8_5}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600">{stat.over9_5}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600 font-bold text-slate-900">{stat.over10_5}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600">{stat.over11_5}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600">{stat.over12_5}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600">{stat.over13_5}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 bg-brand-light-emerald rounded-lg text-xs font-black text-brand-emerald border border-brand-emerald/10">
                          {stat.average}
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
