'use client';

import type { MatchData } from '@/lib/api/types';

interface PredictionHeroProps {
  match: MatchData & { venue?: string };
}

export default function PredictionHero({ match }: PredictionHeroProps) {
  const kickoffTime = new Date(match.kickoffAt);
  const formattedDate = kickoffTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = kickoffTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
       {/* Background Image with Overlay */}
       <div 
         className="absolute inset-0 bg-cover bg-center" 
         style={{ 
           backgroundImage: 'url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop")',
         }}
       >
          <div className="absolute inset-0 bg-brand-dark-blue/70 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-transparent to-brand-dark-blue/40"></div>
       </div>

       {/* Content */}
       <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-white">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-white/60 mb-6 flex flex-col items-center">
             <span className="mb-2">{match.league.name}</span>
             <div className="w-12 h-0.5 bg-brand-pink rounded-full"></div>
          </div>

          <div className="flex items-center justify-center gap-6 md:gap-24 mb-10 w-full max-w-5xl">
             {/* Home Team */}
             <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 md:p-6 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-500">
                   {match.homeTeam.logoUrl ? (
                     <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-full h-full object-contain drop-shadow-2xl" />
                   ) : (
                     <span className="text-4xl text-white/20">⚽</span>
                   )}
                </div>
                <h2 className="text-xl md:text-4xl font-black text-center leading-tight drop-shadow-lg">
                  {match.homeTeam.name}
                </h2>
             </div>

             {/* VS */}
             <div className="flex flex-col items-center shrink-0">
                <div className="text-3xl md:text-5xl font-black text-white italic opacity-40">VS</div>
             </div>

             {/* Away Team */}
             <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 md:p-6 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-500">
                   {match.awayTeam.logoUrl ? (
                     <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-full h-full object-contain drop-shadow-2xl" />
                   ) : (
                     <span className="text-4xl text-white/20">⚽</span>
                   )}
                </div>
                <h2 className="text-xl md:text-4xl font-black text-center leading-tight drop-shadow-lg">
                  {match.awayTeam.name}
                </h2>
             </div>
          </div>

          <div className="flex flex-col items-center gap-4 bg-black/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/5">
             <div className="text-base md:text-xl font-black tracking-wide">
                {formattedDate} - {formattedTime}
             </div>
             <div className="text-[10px] md:text-xs font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Venue: {match.venue || 'TBA'}
             </div>
          </div>
       </div>
    </div>
  );
}
