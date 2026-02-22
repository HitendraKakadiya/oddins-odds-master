'use client';

import type { MatchData } from '@/lib/api/types';

interface WatchBannerProps {
  match: MatchData;
}

export function WatchBanner({ match }: WatchBannerProps) {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-brand-dark-blue">Where to watch {match.homeTeam.name} vs {match.awayTeam.name} live?</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
             Check out the <strong>live stream of {match.homeTeam.name} vs {match.awayTeam.name}</strong> below and follow the match in real time.
          </p>
       </div>

       <div className="relative h-[120px] md:h-[180px] rounded-[32px] overflow-hidden group cursor-pointer shadow-xl shadow-slate-200/50">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1574629810360-70f11279ce8?q=80&w=2070&auto=format&fit=crop")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-blue/90 via-brand-dark-blue/70 to-brand-dark-blue/40"></div>
          
          <div className="relative h-full px-8 md:px-12 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="text-xl md:text-4xl font-black text-white italic drop-shadow-lg">Watch this<br/>match</div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                   <img src={match.homeTeam.logoUrl || ''} alt="" className="w-8 h-8 object-contain" />
                   <span className="text-white/40 font-black italic">X</span>
                   <img src={match.awayTeam.logoUrl || ''} alt="" className="w-8 h-8 object-contain" />
                </div>
             </div>

             <button className="bg-brand-pink text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-black flex items-center gap-3 shadow-lg shadow-brand-pink/40 hover:scale-105 transition-transform">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                   <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                </div>
                <span>Where to Watch</span>
             </button>
          </div>
       </div>
    </div>
  );
}
