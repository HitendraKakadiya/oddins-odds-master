"use client";

import React, { useState } from 'react';

interface SplitData {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  ppg: number;
}

interface StandingRow {
  rank: number;
  team: {
    id: number;
    name: string;
    logoUrl: string;
  };
  overall: SplitData;
  home: SplitData;
  away: SplitData;
  form: string[];
}

interface TeamStandingsTableProps {
  standings: StandingRow[];
  currentTeamId: number;
}

export default function TeamStandingsTable({ standings, currentTeamId }: TeamStandingsTableProps) {
  const [activeTab, setActiveTab] = useState<'overall' | 'home' | 'away'>('overall');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      {/* Table Header/Toolbar */}
      <div className="bg-brand-emerald p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-white">Table</h3>
        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
          {(['overall', 'home', 'away'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-white text-brand-emerald shadow-lg scale-105' 
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              } capitalize`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
              <th className="py-4 pl-8 pr-4">#</th>
              <th className="py-4 px-4 text-left">Team</th>
              <th className="py-4 px-2 text-center">MP</th>
              <th className="py-4 px-2 text-center">W</th>
              <th className="py-4 px-2 text-center">D</th>
              <th className="py-4 px-2 text-center">L</th>
              <th className="py-4 px-2 text-center">GF</th>
              <th className="py-4 px-2 text-center">GA</th>
              <th className="py-4 px-2 text-center">GD</th>
              <th className="py-4 px-2 text-center">Pts</th>
              <th className="py-4 px-2 text-center">PPG</th>
              <th className="py-4 px-8 text-center">Last 5</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {standings.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">No standings data available for this competition</span>
                    <p className="text-xs text-slate-300">This might be a cup, friendly, or the season hasn't started yet.</p>
                  </div>
                </td>
              </tr>
            ) : standings.map((row) => {
              const isCurrent = row.team.id === currentTeamId;
              const data = row[activeTab];
              
              return (
                <tr 
                  key={row.team.id} 
                  className={`group transition-colors duration-200 hover:bg-gray-50/50 ${
                    isCurrent ? 'bg-brand-light-emerald/60' : ''
                  }`}
                >
                  <td className="py-5 pl-8 pr-4">
                    <span className={`text-sm font-black ${isCurrent ? 'text-brand-emerald' : 'text-gray-900'}`}>{row.rank}</span>
                  </td>
                  <td className="py-5 px-4 min-w-[200px]">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                        <img src={row.team.logoUrl} alt={row.team.name} className="w-full h-full object-contain" />
                      </div>
                      <span className={`text-sm font-bold ${isCurrent ? 'text-brand-emerald' : 'text-gray-900'}`}>
                        {row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.played}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.wins}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.draws}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.losses}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.gf}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.ga}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{data.gd > 0 ? `+${data.gd}` : data.gd}</td>
                  <td className="py-5 px-2 text-center text-sm font-black text-gray-900">{data.points}</td>
                  <td className="py-5 px-2 text-center text-sm font-bold text-gray-500">{data.ppg}</td>
                  <td className="py-5 pl-4 pr-8">
                    <div className="flex justify-center space-x-1">
                      {row.form.map((res, i) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm transform transition-transform duration-200 hover:scale-125 hover:z-10 cursor-default ${
                            res === 'W' ? 'bg-green-500' : res === 'L' ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                        >
                          {res}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

