"use client";

import React from 'react';

interface PlayerStat {
  id: number;
  name: string;
  photo: string;
  description: string;
  value: number;
}

export default function TeamTopPerformersTab() {
  const topScorers: PlayerStat[] = [
    { id: 1, name: 'Viktor Gyökeres', photo: 'https://media.api-sports.io/football/players/1484.png', description: 'Originally from Sweden - 27 years old', value: 10 },
    { id: 2, name: 'Eberechi Eze', photo: 'https://media.api-sports.io/football/players/1802.png', description: 'Originally from England - 27 years old', value: 6 },
    { id: 3, name: 'Leandro Trossard', photo: 'https://media.api-sports.io/football/players/534.png', description: 'Originally from Belgium - 31 years old', value: 5 },
    { id: 4, name: 'Bukayo Saka', photo: 'https://media.api-sports.io/football/players/1465.png', description: 'Originally from England - 24 years old', value: 5 },
    { id: 5, name: 'Martín Zubimendi', photo: 'https://media.api-sports.io/football/players/10398.png', description: 'Originally from Spain - 27 years old', value: 5 },
    { id: 6, name: 'Declan Rice', photo: 'https://media.api-sports.io/football/players/182.png', description: 'Originally from England - 27 years old', value: 4 },
    { id: 7, name: 'Mikel Merino', photo: 'https://media.api-sports.io/football/players/1908.png', description: 'Originally from Spain - 29 years old', value: 4 },
  ];

  const topAssists: PlayerStat[] = [
    { id: 8, name: 'Leandro Trossard', photo: 'https://media.api-sports.io/football/players/534.png', description: 'Originally from Belgium - 31 years old', value: 5 },
    { id: 9, name: 'Martin Ødegaard', photo: 'https://media.api-sports.io/football/players/135.png', description: 'Originally from Norway - 27 years old', value: 5 },
    { id: 10, name: 'Declan Rice', photo: 'https://media.api-sports.io/football/players/182.png', description: 'Originally from England - 27 years old', value: 5 },
    { id: 11, name: 'Bukayo Saka', photo: 'https://media.api-sports.io/football/players/1465.png', description: 'Originally from England - 24 years old', value: 4 },
    { id: 12, name: 'Jurriën Timber', photo: 'https://media.api-sports.io/football/players/1273.png', description: 'Originally from Netherlands - 24 years old', value: 4 },
    { id: 13, name: 'Gabriel Magalhães', photo: 'https://media.api-sports.io/football/players/1458.png', description: 'Originally from Brazil - 28 years old', value: 4 },
    { id: 14, name: 'Mikel Merino', photo: 'https://media.api-sports.io/football/players/1908.png', description: 'Originally from Spain - 29 years old', value: 3 },
  ];

  const PlayerCard = ({ player }: { player: PlayerStat }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-50 hover:border-brand-emerald/20 hover:bg-slate-50/50 transition-all duration-300 group cursor-default">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-brand-emerald transition-colors">
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-[10px] font-black text-brand-emerald">
            {player.id > 7 ? '🅰️' : '⚽'}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 group-hover:text-brand-emerald transition-colors leading-tight">
            {player.name}
          </h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
            {player.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg font-black text-slate-900 group-hover:scale-110 transition-transform">
          {player.value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers Section */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group/column">
          <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            
            <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">Top Scorers</h3>
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
              <span className="text-xs">⚽</span>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {topScorers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>

        {/* Top Assists Section */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group/column">
          <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            
            <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">Top Assists</h3>
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
              <span className="text-xs">🅰️</span>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {topAssists.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats Placeholders (Matches aesthetic of the screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="bg-gradient-to-br from-brand-midnight to-slate-800 rounded-[32px] p-8 relative overflow-hidden border border-slate-700 shadow-xl group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-emerald/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand-emerald/20 transition-all duration-700"></div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 relative z-10">Next Match Statistics</h4>
          <p className="text-slate-400 text-xs font-bold relative z-10">Probabilistic analysis based on recent form and historical data.</p>
          <div className="mt-8 flex items-center justify-center relative z-10 h-20">
             <div className="text-brand-emerald/20 font-black text-4xl uppercase tracking-[0.2em]">Live Soon</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-emerald/90 to-emerald-800 rounded-[32px] p-8 relative overflow-hidden shadow-xl border border-emerald-400/20 group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 relative z-10">Next Live Streaming</h4>
          <p className="text-emerald-100/60 text-xs font-bold relative z-10">Coming up next across major sports networks.</p>
          <div className="mt-8 flex items-center justify-center relative z-10 h-20">
             <div className="text-white/20 font-black text-4xl uppercase tracking-[0.2em]">Schedule Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
