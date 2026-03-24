import React, { useState } from 'react';
import Link from 'next/link';
import { FiRefreshCw } from 'react-icons/fi';

interface HotStatMatch {
  matchId: number;
  kickoffAt: string;
  league: {
    name: string;
    country: string;
    logoUrl: string;
  };
  homeTeam: {
    name: string;
    logoUrl: string;
  };
  awayTeam: {
    name: string;
    logoUrl: string;
  };
  market: string;
  probability: number;
}

export default function HotStatCard({ match }: { match: HotStatMatch }) {
  const [mounted, setMounted] = React.useState(false);
  const [loadingType, setLoadingType] = useState<'match' | 'prediction' | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = Math.round(match.probability * 100);
  
  // Custom color based on probability
  const getProbColor = (prob: number) => {
    if (prob >= 0.9) return 'bg-brand-emerald text-white';
    if (prob >= 0.8) return 'bg-indigo-500 text-white';
    return 'bg-amber-500 text-white';
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-emerald/5 transition-all duration-300 overflow-hidden group">
      {/* Top Bar: League & Time */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-2">
          {match.league.logoUrl && (
            <img src={match.league.logoUrl} alt={match.league.name} className="w-4 h-4 object-contain" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {match.league.name} • {mounted ? new Date(match.kickoffAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[11px] font-black shadow-sm ${getProbColor(match.probability)}`}>
          {percentage}%
        </div>
      </div>

      <div className="p-6">
        {/* Teams Section */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3 group-hover:bg-white transition-colors">
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-black text-slate-900 text-center line-clamp-1">{match.homeTeam.name}</span>
          </div>
          
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-slate-300 uppercase italic">vs</span>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3 group-hover:bg-white transition-colors">
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-black text-slate-900 text-center line-clamp-1">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Market Badge */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100/50 mb-6">
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Probability Market</span>
           <span className="text-lg font-black text-slate-900">{match.market}</span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href={`/match/${match.matchId}`}
            onClick={() => setLoadingType('match')}
            className={`flex items-center justify-center py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              loadingType === 'match' ? 'opacity-80 pointer-events-none' : 'hover:bg-slate-800'
            }`}
          >
            {loadingType === 'match' ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              'View Match'
            )}
          </Link>
          <Link 
            href={`/predictions/${match.matchId}`}
            onClick={() => setLoadingType('prediction')}
            className={`flex items-center justify-center py-3 bg-white text-brand-emerald border-2 border-brand-emerald rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              loadingType === 'prediction' ? 'opacity-40 pointer-events-none' : 'hover:bg-brand-emerald/5'
            }`}
          >
            {loadingType === 'prediction' ? (
              <FiRefreshCw className="w-4 h-4 animate-spin text-brand-emerald" />
            ) : (
              'Prediction'
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
