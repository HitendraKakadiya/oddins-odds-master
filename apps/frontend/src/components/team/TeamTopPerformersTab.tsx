"use client";

import React from 'react';

interface PlayerStat {
  id: number;
  name: string;
  photo: string;
  description: string;
  value: number;
}

interface TeamTopPerformersTabProps {
  topScorers?: any[];
  topAssists?: any[];
  nextMatch?: any;
  nextMatchDetail?: any;
}

export default function TeamTopPerformersTab({ 
  topScorers = [], 
  topAssists = [],
  nextMatch,
  nextMatchDetail
}: TeamTopPerformersTabProps) {
  const mappedScorers: PlayerStat[] = topScorers.map((s, idx) => ({
    id: s.player?.id || idx,
    name: s.player?.name || 'Unknown Player',
    photo: s.player?.photo || 'https://via.placeholder.com/150',
    description: `Originally from ${s.player?.nationality || 'Unknown'} - ${s.player?.age || '??'} years old`,
    value: s.statistics?.[0]?.goals?.total || 0
  }));

  const mappedAssists: PlayerStat[] = topAssists.map((s, idx) => ({
    id: s.player?.id || idx,
    name: s.player?.name || 'Unknown Player',
    photo: s.player?.photo || 'https://via.placeholder.com/150',
    description: `Originally from ${s.player?.nationality || 'Unknown'} - ${s.player?.age || '??'} years old`,
    value: s.statistics?.[0]?.goals?.assists || 0
  }));

  const nextMatchInfo = nextMatchDetail?.match || nextMatch;
  const predictions = nextMatchDetail?.predictions;
  const winPercent = predictions?.percent;

  const getKickoffStatus = () => {
    if (!nextMatchInfo?.kickoffAt) return 'Schedule Ready';
    const date = new Date(nextMatchInfo.kickoffAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0 && diff > -7200000) return 'Live Now';
    if (diff < 3600000) return 'Starts Soon';
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
            {mappedScorers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
            {mappedScorers.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                No top scorers data found
              </div>
            )}
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
            {mappedAssists.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
            {mappedAssists.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                No top assists data found
              </div>
            )}
          </div>
        </div>
      </div>

      {nextMatchInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          <div className="bg-gradient-to-br from-brand-midnight to-slate-800 rounded-[32px] p-8 relative overflow-hidden border border-slate-700 shadow-xl group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-emerald/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand-emerald/20 transition-all duration-700"></div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 relative z-10">Next Match Statistics</h4>
            <p className="text-slate-400 text-xs font-bold relative z-10">Probabilistic analysis based on recent form and historical data.</p>
            <div className="mt-8 flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-emerald-400 font-black text-2xl tracking-tighter">{winPercent?.home || '33%'}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Home Win</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-300 font-black text-2xl tracking-tighter">{winPercent?.draw || '34%'}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Draw</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-red-400 font-black text-2xl tracking-tighter">{winPercent?.away || '33%'}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Away Win</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-emerald/90 to-emerald-800 rounded-[32px] p-8 relative overflow-hidden shadow-xl border border-emerald-400/20 group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 relative z-10">Next Live Streaming</h4>
            <p className="text-emerald-100/60 text-xs font-bold relative z-10">Coming up next across major sports networks.</p>
            <div className="mt-8 flex items-center justify-center relative z-10 h-20">
              <div className="text-white font-black text-3xl uppercase tracking-[0.1em] drop-shadow-lg">
                  {getKickoffStatus()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
