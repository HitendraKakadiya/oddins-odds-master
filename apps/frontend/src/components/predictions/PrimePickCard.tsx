'use client';

import React from 'react';
import { Prediction } from '@/lib/api/types';
import Link from 'next/link';

interface PrimePickCardProps {
    tip: Prediction;
}

export default function PrimePickCard({ tip }: PrimePickCardProps) {
    return (
        <div className="bg-white rounded-[28px] overflow-hidden shadow-xl border border-slate-100 flex flex-col h-full max-w-[420px] mx-auto transition-all duration-300 hover:shadow-2xl">
            {/* Inner Content Header */}
            <div className="p-5 pb-1">
                <div className="flex items-center gap-2 text-slate-400 mb-4 px-1">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">
                         <span className="text-brand-emerald text-[8px]">●</span> {tip.league?.countryName || 'Global'}
                    </span>
                    <span className="text-[11px] font-semibold truncate">{tip.league?.name || 'Top competition'}</span>
                </div>
                
                <div className="flex items-center justify-between gap-3 mb-6 px-1">
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2.5 border border-slate-50 shadow-sm transition-transform group-hover:scale-105">
                            <img src={tip.homeTeam?.logoUrl || ''} alt={tip.homeTeam?.name || ''} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-800 text-center leading-tight truncate w-full">{tip.homeTeam?.name}</span>
                    </div>

                    <div className="flex flex-col items-center flex-shrink-0 px-2">
                         <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest mb-0.5">VS</span>
                         <span className="text-base font-black text-slate-900 leading-none">NOW</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2.5 border border-slate-50 shadow-sm transition-transform group-hover:scale-105">
                            <img src={tip.awayTeam?.logoUrl || ''} alt={tip.awayTeam?.name || ''} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-800 text-center leading-tight truncate w-full">{tip.awayTeam?.name}</span>
                    </div>
                </div>
            </div>

            {/* Prediction Area */}
            <div className="px-5 pb-5 mt-auto">
                <div className="bg-slate-50 rounded-2xl p-3 mb-4 text-center border border-slate-100/50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Expert Prediction</p>
                    <p className="text-base font-black text-slate-900 italic tracking-tight">{tip.selection || 'Analyze now'}</p>
                </div>

                <Link 
                    href={`/match/${tip.matchId}`}
                    className="w-full bg-brand-pink text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-pink/90 transition-all shadow-md shadow-brand-pink/10 active:scale-[0.98] text-[13px] tracking-wide"
                >
                    SEE FULL PREDICTION
                </Link>
            </div>
        </div>
    );
}
