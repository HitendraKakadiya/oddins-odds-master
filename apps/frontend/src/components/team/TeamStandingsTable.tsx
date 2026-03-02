"use client";

import React, { useState } from 'react';

interface StandingRow {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
        for: number;
        against: number;
    }
  };
  points: number;
  goalsDiff: number;
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
      <div className="bg-primary-600 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-white">Table</h3>
        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
          {(['overall', 'home', 'away'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-white text-primary-600 shadow-lg scale-105' 
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
            {standings.map((row) => {
              const isCurrent = row.team.id === currentTeamId;
              const ppg = (row.points / row.all.played).toFixed(2);
              
              return (
                <tr 
                  key={row.team.id} 
                  className={`group transition-colors duration-200 hover:bg-gray-50/50 ${
                    isCurrent ? 'bg-primary-50/30' : ''
                  }`}
                >
                  <td className="py-5 pl-8 pr-4">
                    <span className={`text-sm font-black ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>{row.rank}</span>
                  </td>
                  <td className="py-5 px-4 min-w-[200px]">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                        <img src={row.team.logo} alt={row.team.name} className="w-full h-full object-contain" />
                      </div>
                      <span className={`text-sm font-bold ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>
                        {row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.all.played}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.all.win}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.all.draw}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.all.lose}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.all.goals.for}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.all.goals.against}</td>
                  <td className="py-5 px-2 text-center text-sm font-medium text-gray-600">{row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}</td>
                  <td className="py-5 px-2 text-center text-sm font-black text-gray-900">{row.points}</td>
                  <td className="py-5 px-2 text-center text-sm font-bold text-gray-500">{ppg}</td>
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
