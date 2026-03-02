import React from 'react';
import Link from 'next/link';

interface TeamNavigationProps {
  prevTeam?: { name: string; slug: string; logoUrl?: string };
  nextTeam?: { name: string; slug: string; logoUrl?: string };
}

export default function TeamNavigation({ prevTeam, nextTeam }: TeamNavigationProps) {
  return (
    <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-50 flex items-center justify-between px-0">
        {/* Left / Previous Team */}
        {prevTeam && (
          <Link 
            href={`/team/${prevTeam.slug}`}
            className="pointer-events-auto group flex items-center"
          >
            <div className="flex flex-col items-center bg-white border border-gray-100 border-l-0 rounded-r-[2rem] py-8 px-3 shadow-[4px_0_24px_rgba(30,64,175,0.08)] transition-all duration-500 hover:pl-6 hover:pr-4 hover:bg-primary-50 active:scale-95 group transform -translate-x-2 hover:translate-x-0">
                <div className="w-10 h-10 mb-4 p-1.5 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                    {prevTeam.logoUrl ? (
                        <img src={prevTeam.logoUrl} alt={prevTeam.name} className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-xl">⚽</span>
                    )}
                </div>
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-4 h-4 text-primary-600 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="flex flex-col items-center">
                        <span className="[writing-mode:vertical-lr] rotate-180 text-[9px] font-black text-primary-600/40 uppercase tracking-[0.2em]">Previous</span>
                        <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black text-gray-900 uppercase tracking-widest mt-2">{prevTeam.name}</span>
                    </div>
                </div>
            </div>
          </Link>
        )}

        {/* Right / Next Team */}
        {nextTeam && (
          <Link 
            href={`/team/${nextTeam.slug}`}
            className="pointer-events-auto group flex items-center"
          >
            <div className="flex flex-col items-center bg-white border border-gray-100 border-r-0 rounded-l-[2rem] py-8 px-3 shadow-[-4px_0_24px_rgba(30,64,175,0.08)] transition-all duration-500 hover:pr-6 hover:pl-4 hover:bg-primary-50 active:scale-95 group transform translate-x-2 hover:translate-x-0">
                <div className="w-10 h-10 mb-4 p-1.5 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                    {nextTeam.logoUrl ? (
                        <img src={nextTeam.logoUrl} alt={nextTeam.name} className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-xl">⚽</span>
                    )}
                </div>
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-4 h-4 text-primary-600 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="flex flex-col items-center">
                        <span className="[writing-mode:vertical-lr] text-[9px] font-black text-primary-600/40 uppercase tracking-[0.2em]">Next</span>
                        <span className="[writing-mode:vertical-lr] text-[10px] font-black text-gray-900 uppercase tracking-widest mt-2">{nextTeam.name}</span>
                    </div>
                </div>
            </div>
          </Link>
        )}
    </div>
  );
}
