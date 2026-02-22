'use client';

import Link from 'next/link';
import type { Prediction } from '@/lib/api/types';

interface PredictionStickySidebarProps {
  mainPrediction?: Prediction;
  todayPredictions: Prediction[];
}

export default function PredictionStickySidebar({ mainPrediction, todayPredictions }: PredictionStickySidebarProps) {
  return (
    <aside className="w-full lg:w-[380px] shrink-0">
       <div className="sticky top-8 flex flex-col gap-6">
          {/* Main Prediction Card */}
          <div className="bg-brand-indigo rounded-[32px] overflow-hidden shadow-2xl shadow-brand-indigo/30 p-1">
             <div className="bg-white rounded-[31px] p-8 flex flex-col items-center">
                <h3 className="text-2xl font-black text-brand-indigo mb-2">
                   {mainPrediction?.selection || mainPrediction?.title || 'HT/FT - 2/2'}
                </h3>
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-6">
                   Odds of Prediction: { (mainPrediction as any)?.odds || '5.50' }
                </p>
                
                <div className="w-full h-px bg-slate-100 mb-6"></div>
                
                <Link href="/predictions" className="text-brand-pink font-black text-sm hover:underline mb-4">
                   See more predictions
                </Link>
             </div>
             <div className="py-4 text-center">
                <span className="text-white font-black text-xs uppercase tracking-[0.3em] opacity-80">Closed</span>
             </div>
          </div>

          {/* Today Prediction List */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-sm shadow-inner">⚽</div>
                <h4 className="text-lg font-black text-slate-800">Today Prediction</h4>
             </div>

             <div className="space-y-6">
                {todayPredictions.map((pred, i) => (
                   <Link key={i} href={`/predictions/${pred.id}`} className="flex gap-4 group">
                      <div className="w-24 h-14 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                         <div className="relative h-full flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <img src={pred.homeTeam?.logoUrl || ''} className="w-6 h-6 object-contain" alt="" />
                            <span className="text-[8px] font-black text-white/20 italic">VS</span>
                            <img src={pred.awayTeam?.logoUrl || ''} className="w-6 h-6 object-contain" alt="" />
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                               {pred.league?.name || 'League'}
                            </span>
                         </div>
                         <h5 className="text-xs font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-indigo transition-colors uppercase">
                            {pred.homeTeam?.name} vs {pred.awayTeam?.name} | Prediction | {pred.league?.name} | {new Date(pred.kickoffAt || '').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
                         </h5>
                      </div>
                   </Link>
                ))}
             </div>
          </div>
       </div>
    </aside>
  );
}
