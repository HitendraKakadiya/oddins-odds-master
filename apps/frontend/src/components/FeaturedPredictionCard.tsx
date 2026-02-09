'use client';

import Link from 'next/link';

interface FeaturedPredictionCardProps {
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
    selection: string;
  };
}

export default function FeaturedPredictionCard({ prediction }: FeaturedPredictionCardProps) {
  const date = new Date(prediction.kickoffAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Link href={`/match/${prediction.matchId}`} className="block relative min-h-[280px] sm:h-[320px] rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-xl hover:shadow-2xl transition-all border border-slate-200/60 bg-[#1F1D36]">
      {/* Background with gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D2A4A] to-[#1F1D36]"></div>
      
      {/* Abstract patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/20 rounded-full scale-150"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full scale-110"></div>
      </div>
      
      {/* Decorative center badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#444070] px-4 sm:px-6 py-1 sm:py-1.5 rounded-b-2xl border-x border-b border-white/10 z-20 shadow-lg shadow-black/20">
         <div className="text-[8px] sm:text-[9px] font-black tracking-[0.15em] sm:tracking-[0.2em] text-white text-center uppercase whitespace-nowrap">
            {prediction.league.countryName} <span className="opacity-40 px-1">•</span> {prediction.league.name}
         </div>
      </div>

      <div className="relative z-10 h-full pt-10 sm:pt-14 pb-14 sm:pb-16 px-4 sm:px-6 flex flex-col justify-between items-center text-white">
          <div className="text-center font-black text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-white/60 uppercase">{date}</div>
          
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full px-1">
             <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                   {prediction.homeTeam.logoUrl ? (
                     <img src={prediction.homeTeam.logoUrl} alt="" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg" />
                   ) : (
                     <span className="text-xl sm:text-2xl">⚽</span>
                   )}
                </div>
                <span className="text-[10px] sm:text-xs font-black text-center line-clamp-2 max-w-[80px] sm:max-w-[100px] leading-tight h-7 sm:h-8 flex items-center">{prediction.homeTeam.name}</span>
             </div>

             <div className="flex flex-col items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                   <span className="text-[8px] sm:text-[10px] font-black italic text-white/40">VS</span>
                </div>
                <div className="bg-brand-pink px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-lg shadow-brand-pink/30 hover:scale-105 transition-transform">
                   <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-white">PREDICTION</span>
                </div>
             </div>

             <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                   {prediction.awayTeam.logoUrl ? (
                     <img src={prediction.awayTeam.logoUrl} alt="" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg" />
                   ) : (
                     <span className="text-xl sm:text-2xl">⚽</span>
                   )}
                </div>
                <span className="text-[10px] sm:text-xs font-black text-center line-clamp-2 max-w-[80px] sm:max-w-[100px] leading-tight h-7 sm:h-8 flex items-center">{prediction.awayTeam.name}</span>
             </div>
          </div>

          <div className="text-[10px] sm:text-[11px] font-bold text-white/40 italic text-center">Match Analysis & Insights</div>
      </div>

      {/* Footer bar for the card */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center justify-between z-20">
         <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs">🏳️</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate">{prediction.league.name} • {date}</span>
         </div>
         <div className="text-brand-indigo font-black text-[9px] sm:text-[10px] group-hover:underline whitespace-nowrap ml-2 sm:ml-4 flex-shrink-0">
            See Details →
         </div>
      </div>
    </Link>
  );
}
