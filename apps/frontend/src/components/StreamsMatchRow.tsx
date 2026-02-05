import Image from 'next/image';
import Link from 'next/link';

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
    <div className="flex items-center justify-between p-4 py-6 bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      {/* Time and Icon */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex flex-col text-slate-400 font-bold items-start min-w-[120px]">
          <span className="text-sm">{kickoffDate} {kickoffTime}</span>
        </div>
        
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-50 border border-pink-100">
           <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
        </div>

        {/* Teams */}
        <div className="flex items-center gap-4 flex-grow justify-center max-w-md mx-auto">
          <div className="flex items-center gap-3 flex-1 justify-end">
             <span className="font-bold text-slate-700 text-sm sm:text-base">{match.homeTeam.name}</span>
             {match.homeTeam.logoUrl ? (
               <Image 
                 src={match.homeTeam.logoUrl} 
                 alt={match.homeTeam.name} 
                 width={24} 
                 height={24} 
                 className="object-contain" 
               />
             ) : (
               <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400">
                 {match.homeTeam.name.substring(0, 1)}
               </div>
             )}
          </div>
          
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest px-2">v.s</span>
          
          <div className="flex items-center gap-3 flex-1 justify-start">
             {match.awayTeam.logoUrl ? (
               <Image 
                 src={match.awayTeam.logoUrl} 
                 alt={match.awayTeam.name} 
                 width={24} 
                 height={24} 
                 className="object-contain" 
               />
             ) : (
               <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400">
                 {match.awayTeam.name.substring(0, 1)}
               </div>
             )}
             <span className="font-bold text-slate-700 text-sm sm:text-base">{match.awayTeam.name}</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="ml-4">
        <Link 
          href={`/match/${match.matchId}`} 
          className="flex items-center gap-2 border-2 border-brand-pink text-brand-pink px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-brand-pink hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-brand-pink/20"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Where to Watch
        </Link>
      </div>
    </div>
  );
}
