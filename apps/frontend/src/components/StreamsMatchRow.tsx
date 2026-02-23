'use client';

import Link from 'next/link';
import Image from 'next/image';

interface StreamsMatchRowProps {
  match: {
    matchId: number;
    kickoffAt: string;
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

export default function StreamsMatchRow({ match }: StreamsMatchRowProps) {
  const kickoffTime = new Date(match.kickoffAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const kickoffDate = new Date(match.kickoffAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group gap-4 sm:gap-6">
      {/* Time and Teams Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 w-full">
        {/* Time and Icon */}
        <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-1 min-w-fit sm:min-w-[120px] text-slate-400 font-bold">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">{kickoffDate}</span>
          <span className="text-sm sm:text-base text-slate-600 sm:text-slate-400">{kickoffTime}</span>
        </div>
        
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-pink-50 border border-pink-100 shrink-0">
           <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
        </div>

        {/* Teams */}
        <div className="flex items-center gap-3 sm:gap-4 flex-grow justify-center w-full max-w-md">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
             <span className="font-bold text-slate-700 text-xs sm:text-base text-right leading-tight">{match.homeTeam.name}</span>
             {match.homeTeam.logoUrl ? (
               <Image src={match.homeTeam.logoUrl} alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
             ) : (
               <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 shrink-0">
                 {match.homeTeam.name.substring(0, 1)}
               </div>
             )}
          </div>
          
          <span className="text-slate-300 font-black text-[9px] sm:text-xs uppercase tracking-widest px-1 sm:px-2">vs</span>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start">
             {match.awayTeam.logoUrl ? (
               <Image src={match.awayTeam.logoUrl} alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
             ) : (
               <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 shrink-0">
                 {match.awayTeam.name.substring(0, 1)}
               </div>
             )}
             <span className="font-bold text-slate-700 text-xs sm:text-base text-left leading-tight">{match.awayTeam.name}</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="w-full sm:w-auto">
        <Link 
          href={`/match/${match.matchId}`} 
          className="flex items-center justify-center gap-2 border-2 border-brand-pink text-brand-pink px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider hover:bg-brand-pink hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-brand-pink/20 w-full sm:min-w-[160px]"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Where to Watch
        </Link>
      </div>
    </div>
  );
}
