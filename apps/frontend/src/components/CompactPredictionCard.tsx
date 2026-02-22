'use client';

import Link from 'next/link';

interface CompactPredictionCardProps {
  prediction: {
    matchId: number;
    kickoffAt: string;
    league: {
      name: string;
      slug: string;
      countryName: string;
    };
    homeTeam: {
      name: string;
      logoUrl?: string | null;
    };
    awayTeam: {
      name: string;
      logoUrl?: string | null;
    };
  };
}

export default function CompactPredictionCard({ prediction }: CompactPredictionCardProps) {
  const date = new Date(prediction.kickoffAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Link href={`/predictions/${prediction.matchId}`} className="group py-6 flex items-center gap-6 transition-all hover:bg-slate-50/50 px-4">
       <div className="relative w-[180px] h-[100px] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-950 opacity-90"></div>
          <div className="relative z-10 h-full flex items-center justify-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shadow-inner">
                {prediction.homeTeam.logoUrl ? <img src={prediction.homeTeam.logoUrl} alt="" className="w-6 h-6 object-contain" /> : <span className="text-xs">⚽</span>}
             </div>
             <span className="text-[10px] font-black text-white italic opacity-30">VS</span>
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shadow-inner">
                {prediction.awayTeam.logoUrl ? <img src={prediction.awayTeam.logoUrl} alt="" className="w-6 h-6 object-contain" /> : <span className="text-xs">⚽</span>}
             </div>
          </div>
          <div className="absolute top-2 left-2 bg-brand-pink text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm tracking-widest">PREDICTION</div>
       </div>

       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
             <span className="text-brand-pink font-bold">+</span>
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{prediction.league.name} <span className="opacity-30 px-1">•</span> {date}</span>
          </div>
          <h4 className="text-lg font-black text-slate-800 group-hover:text-brand-indigo transition-colors line-clamp-2 leading-tight">
             {prediction.homeTeam.name} vs {prediction.awayTeam.name} Prediction | {prediction.league.name} | {date.split('/')[0]}/{date.split('/')[1]}
          </h4>
       </div>

       <div className="hidden sm:flex w-10 h-10 rounded-full border border-slate-100 items-center justify-center text-slate-300 group-hover:bg-brand-indigo group-hover:text-white group-hover:border-brand-indigo transition-all shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 18l6-6-6-6" /></svg>
       </div>
    </Link>
  );
}
