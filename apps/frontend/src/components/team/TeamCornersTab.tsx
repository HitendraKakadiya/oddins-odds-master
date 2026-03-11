"use client";

import React, { useState } from 'react';
import type { TeamStats } from '@/lib/api/types';



interface TeamCornersTabProps {
  detailedStats?: (TeamStats & { corners?: Record<string, Record<string, string | number> | undefined> }) | null;
}

export default function TeamCornersTab({ detailedStats }: TeamCornersTabProps) {
  const [filter, setFilter] = useState<'Overall' | 'Home' | 'Away'>('Overall');

  const cornerStats = detailedStats?.corners || {};
  
  const getStat = (key: string) => {
    const section = filter.toLowerCase();
    return cornerStats[key]?.[section] || '0%';
  };

  const currentStats = [
    { label: 'Over 7.5', val: getStat('over_7_5') },
    { label: 'Over 8.5', val: getStat('over_8_5') },
    { label: 'Over 9.5', val: getStat('over_9_5') },
    { label: 'Over 10.5', val: getStat('over_10_5') },
    { label: 'Over 11.5', val: getStat('over_11_5') },
    { label: 'Over 12.5', val: getStat('over_12_5') },
    { label: 'Over 13.5', val: getStat('over_13_5') },
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {currentStats.map((stat: { label: string; val: string | number }) => (
              <div key={stat.label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center group hover:border-brand-emerald/30 transition-all duration-300">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</span>
                <span className="text-xl font-black text-slate-900 group-hover:text-brand-emerald transition-colors">{stat.val}</span>
              </div>
            ))}
          </div>

          {/* Average Info */}
          <div className="mt-8 bg-brand-light-emerald/30 rounded-[32px] p-8 border border-brand-emerald/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald flex items-center justify-center text-white text-xl shadow-lg shadow-brand-emerald/20">
                ⛳
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Average Corners</h4>
                <p className="text-[10px] font-bold text-brand-emerald uppercase mt-1">Per match contribution</p>
              </div>
            </div>
            <div className="text-3xl font-black text-brand-emerald">
              {detailedStats?.corners?.average?.[filter.toLowerCase()] || '0.00'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
