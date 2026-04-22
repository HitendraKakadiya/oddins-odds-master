import Image from 'next/image';
import Link from 'next/link';

export default function WorldCupHero({ season }: { season: number }) {
  return (
    <div className="relative bg-brand-midnight text-white overflow-hidden py-16 sm:py-24">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-brand-emerald/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-72 h-72 bg-brand-emerald/10 rounded-full blur-[80px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="text-sm font-black text-brand-emerald mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
            <span className="text-slate-600">/</span>
            <span>World Cup</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            FIFA World Cup <span className="text-brand-emerald">{season}</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl mb-10 leading-relaxed">
            The largest football tournament in history. 48 teams, 104 matches, hosted across USA, Canada, and Mexico.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm sm:text-base font-bold">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-brand-emerald rounded-full" />
              <span>48 Teams</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-brand-emerald rounded-full" />
              <span>104 Matches</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-brand-emerald rounded-full" />
              <span>3 Host Countries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
