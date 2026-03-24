import React from 'react';
import { FiTarget, FiZap, FiTarget as FiGoal, FiCornerUpRight, FiMinusCircle, FiTrendingUp } from 'react-icons/fi';

interface Market {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
}

const markets: Market[] = [
  { id: 'btts', name: 'Both Teams to Score', shortName: 'BTTS', icon: <FiTarget className="w-5 h-5 text-indigo-500" /> },
  { id: 'over25', name: 'Over 2.5 Goals', shortName: 'Over 2.5', icon: <FiGoal className="w-5 h-5 text-brand-pink" /> },
  { id: 'team-over15', name: 'Team Over 1.5 Goals', shortName: 'Team O1.5', icon: <FiZap className="w-5 h-5 text-amber-500" /> },
  { id: 'ht-over15', name: 'HT Over 1.5 Goals', shortName: 'HT O1.5', icon: <FiTrendingUp className="w-5 h-5 text-blue-500" /> },
  { id: 'over95-corners', name: 'Over 9.5 Corners', shortName: 'O9.5 Corners', icon: <FiCornerUpRight className="w-5 h-5 text-brand-emerald" /> },
  { id: 'over45-team-corners', name: 'Over 4.5 Team Corners', shortName: 'O4.5 T Corners', icon: <FiCornerUpRight className="w-5 h-5 text-brand-emerald" /> },
  { id: 'both-halves-score', name: 'Team Scored In Both Halves', shortName: 'Scored BH', icon: <FiZap className="w-5 h-5 text-purple-500" /> },
  { id: 'over45-cards', name: 'Over 4.5 Cards', shortName: 'O4.5 Cards', icon: <FiMinusCircle className="w-5 h-5 text-red-500" /> },
];

interface StatSidebarProps {
  activeMarket: string;
  onMarketChange: (marketId: string) => void;
}

export default function StatSidebar({ activeMarket, onMarketChange }: StatSidebarProps) {
  return (
    <div className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-4 sticky top-24">
        <h3 className="text-xl font-black text-slate-900 px-4 py-2 mb-4">Available Stats</h3>
        <div className="space-y-1">
          {markets.map((market) => (
            <button
              key={market.id}
              onClick={() => onMarketChange(market.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                activeMarket === market.id 
                  ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20 lg:scale-[1.02]' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${
                  activeMarket === market.id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-white'
                }`}>
                  {React.cloneElement(market.icon as React.ReactElement, {
                    className: `w-5 h-5 ${activeMarket === market.id ? 'text-white' : ''}`
                  })}
                </div>
                <div className="text-left">
                  <div className={`text-xs font-black uppercase tracking-wider mb-0.5 ${
                    activeMarket === market.id ? 'text-white/80' : 'text-slate-400'
                  }`}>
                    {market.shortName}
                  </div>
                  <div className="text-sm font-bold truncate max-w-[140px]">
                    {market.name}
                  </div>
                </div>
              </div>
              <FiTrendingUp className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                activeMarket === market.id ? 'text-white' : 'text-slate-300'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
