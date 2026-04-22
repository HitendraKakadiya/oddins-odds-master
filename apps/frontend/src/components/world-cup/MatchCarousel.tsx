import Link from 'next/link';

interface Match {
  id: number;
  homeTeam: { name: string; logo: string; id: number; slug: string };
  awayTeam: { name: string; logo: string; id: number; slug: string };
  date: string;
  venue: string;
  round: string;
}

export default function MatchCarousel({ matches }: { matches: Match[] }) {
  if (!matches || matches.length === 0) return null;
  
  // For now we show the first match as featured
  const match = matches[0];
  const formattedDate = new Date(match.date).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const formattedTime = new Date(match.date).toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-brand-midnight whitespace-nowrap">
          Featured Match
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
      </div>

      <div className="relative group rounded-[32px] overflow-hidden bg-brand-midnight shadow-2xl shadow-brand-midnight/20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/world-cup-stadium-hero.png" 
            alt="Stadium" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-midnight to-transparent hidden lg:block"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col lg:flex-row min-h-[500px]">
          {/* Left: Match Info */}
          <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
               <span className="bg-brand-emerald text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-brand-emerald/20">
                 {match.round}
               </span>
               <div className="h-px w-12 bg-white/20"></div>
               <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{match.venue}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-16 mb-12">
              <Link href={`/team/${match.homeTeam.slug}`} className="flex flex-col items-center sm:items-start gap-4 group/home">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 group-hover/home:bg-white/20 transition-all duration-300">
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl sm:text-4xl font-black text-white group-hover/home:text-brand-emerald transition-colors">{match.homeTeam.name}</span>
              </Link>

              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl font-black text-white/10 italic">VS</span>
              </div>

              <Link href={`/team/${match.awayTeam.slug}`} className="flex flex-col items-center sm:items-start gap-4 group/away">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 group-hover/away:bg-white/20 transition-all duration-300">
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl sm:text-4xl font-black text-white group-hover/away:text-brand-emerald transition-colors">{match.awayTeam.name}</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Match Date</span>
                <span className="text-white text-lg font-bold">{formattedDate}</span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Kickoff Time</span>
                <span className="text-white text-lg font-bold">{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Right: Call to Action */}
          <div className="lg:w-1/3 p-8 lg:p-16 flex flex-col justify-end lg:items-end bg-white/5 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="mb-10 lg:text-right">
              <h4 className="text-white text-xl font-black mb-2 italic">Ready for Analysis?</h4>
              <p className="text-white/60 text-sm font-medium">Get deep insights, team statistics, and the latest odds for this match-up.</p>
            </div>
            <Link 
              href={`/match/${match.id}`} 
              className="btn-primary !py-5 !px-12 text-lg shadow-2xl shadow-brand-emerald/40 hover:translate-y-[-2px] transition-all"
            >
              Match Insights →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
