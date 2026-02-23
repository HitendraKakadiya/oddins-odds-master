'use client';

import Link from 'next/link';

interface LeagueNavigationProps {
  prevLeague?: {
    name: string;
    logoUrl?: string;
    slug: string;
    countrySlug: string;
  };
  nextLeague?: {
    name: string;
    logoUrl?: string;
    slug: string;
    countrySlug: string;
  };
}

export default function LeagueNavigation({ prevLeague, nextLeague }: LeagueNavigationProps) {
  return (
    <>
      {/* Previous League */}
      {prevLeague && (
        <Link 
          href={`/leagues/${prevLeague.countrySlug}/${prevLeague.slug}`}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 group hidden xl:flex flex-col items-center gap-3"
        >
          <div className="w-16 h-28 bg-white border border-slate-100 rounded-full shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-3 group-hover:bg-brand-indigo group-hover:border-brand-indigo transition-all duration-300">
             <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden mb-2 group-hover:scale-110 transition-transform">
                <img src={prevLeague.logoUrl || ''} alt="" className="w-6 h-6 object-contain" />
             </div>
             <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
             </svg>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-lg text-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none w-32">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous</p>
             <p className="text-xs font-black text-brand-dark-blue truncate leading-tight">{prevLeague.name}</p>
          </div>
        </Link>
      )}

      {/* Next League */}
      {nextLeague && (
        <Link 
          href={`/leagues/${nextLeague.countrySlug}/${nextLeague.slug}`}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 group hidden xl:flex flex-col items-center gap-3"
        >
          <div className="w-16 h-28 bg-white border border-slate-100 rounded-full shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-3 group-hover:bg-brand-indigo group-hover:border-brand-indigo transition-all duration-300">
             <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden mb-2 group-hover:scale-110 transition-transform">
                <img src={nextLeague.logoUrl || ''} alt="" className="w-6 h-6 object-contain" />
             </div>
             <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
             </svg>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-lg text-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none w-32">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next League</p>
             <p className="text-xs font-black text-brand-dark-blue truncate leading-tight">{nextLeague.name}</p>
          </div>
        </Link>
      )}
    </>
  );
}
