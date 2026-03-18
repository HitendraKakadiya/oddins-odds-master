import React from 'react';
import Link from 'next/link';
import { InsightItem } from '@/lib/api/types';
import { FiChevronRight, FiTrendingUp } from 'react-icons/fi';

interface InsightCardProps {
  insight: InsightItem;
}

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <Link 
      href={`/match/${insight.matchId}`}
      className="group bg-white rounded-[32px] p-0 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-emerald/5 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Card Header - Teams */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
             <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
               {insight.homeTeam.logoUrl ? (
                 <img src={insight.homeTeam.logoUrl} alt={insight.homeTeam.name} className="w-5 h-5 object-contain" />
               ) : (
                 <span className="text-[10px] font-bold text-slate-400">{insight.homeTeam.name.slice(0, 2)}</span>
               )}
             </div>
             <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
               {insight.awayTeam.logoUrl ? (
                 <img src={insight.awayTeam.logoUrl} alt={insight.awayTeam.name} className="w-5 h-5 object-contain" />
               ) : (
                 <span className="text-[10px] font-bold text-slate-400">{insight.awayTeam.name.slice(0, 2)}</span>
               )}
             </div>
          </div>
          <div className="text-[13px] font-black text-slate-900 group-hover:text-brand-emerald transition-colors line-clamp-1">
            {insight.homeTeam.name} <span className="text-slate-300 mx-1">vs</span> {insight.awayTeam.name}
          </div>
        </div>
        <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" />
      </div>

      {/* Card Body - Trend Info */}
      <div className="flex items-center gap-5 p-6 bg-white">
        {/* Trend Icon Box */}
        <div className="w-16 h-16 bg-brand-emerald/5 rounded-[24px] flex items-center justify-center shrink-0 group-hover:bg-brand-emerald group-hover:text-white transition-all duration-300">
          <FiTrendingUp className="w-8 h-8 text-brand-emerald group-hover:text-white transition-colors" />
        </div>
        
        {/* Trend Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[19px] font-black text-slate-900 mb-1 group-hover:text-brand-emerald transition-colors leading-tight">
            {insight.trend.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
              {insight.league.country.name}
            </span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 line-clamp-1">
              {insight.league.name}
            </span>
          </div>
        </div>

        {/* Trend Value */}
        <div className="text-[38px] font-black text-slate-900 group-hover:text-brand-emerald transition-colors tabular-nums">
          {insight.trend.value}
        </div>
      </div>
    </Link>
  );
}
