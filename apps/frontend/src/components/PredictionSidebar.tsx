'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { LeaguesResponse } from '@/lib/api';

interface PredictionSidebarProps {
  leagues: LeaguesResponse[];
}

export default function PredictionSidebar({ leagues }: PredictionSidebarProps) {
  const [currentSlide] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>('England');

  const mockPredictions = [
    {
      id: 1,
      leagueName: 'Egyptian Premier League',
      time: '20:30',
      date: 'Wed - 4 Feb 2026',
      homeTeam: { name: 'Smouha SC', logo: '⚽' },
      awayTeam: { name: 'Pyramids', logo: '⚽' },
      prediction: 'Under 2.5 Goals',
      status: 'Match Finished'
    }
  ];

  const currentPrediction = mockPredictions[currentSlide];

  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-8">
      {/* Prediction of the day card */}
      <div className="bg-brand-indigo rounded-[32px] p-6 text-white text-center shadow-2xl shadow-brand-indigo/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
             <span className="text-[10px]">⚽</span>
          </div>
          <span className="text-sm font-black tracking-tight">Prediction of the day</span>
        </div>

        <div className="bg-white rounded-2xl p-4 text-slate-800 text-left mb-6 shadow-xl relative z-10">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-slate-400">
             <span>🇪🇬</span>
             <span>{currentPrediction.leagueName}</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
             <div className="flex flex-col items-center gap-2 w-[80px]">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm text-lg">
                   {currentPrediction.homeTeam.logo}
                </div>
                <span className="text-[10px] font-black text-center line-clamp-1">{currentPrediction.homeTeam.name}</span>
             </div>
             
             <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-300 mb-1">V.S</span>
                <span className="text-[8px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 whitespace-nowrap">
                   {currentPrediction.status}
                </span>
             </div>

             <div className="flex flex-col items-center gap-2 w-[80px]">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm text-lg">
                   {currentPrediction.awayTeam.logo}
                </div>
                <span className="text-[10px] font-black text-center line-clamp-1">{currentPrediction.awayTeam.name}</span>
             </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 mb-4">
             <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Prediction</span>
             <span className="block text-sm font-black text-slate-900">{currentPrediction.prediction}</span>
          </div>

          <button className="w-full bg-brand-pink text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-pink/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
             See Prediction
          </button>
        </div>

        <div className="flex items-center justify-between">
           <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-black opacity-60">2 / 3</span>
              <div className="flex gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              </div>
           </div>
           <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>
      </div>

      {/* Competitions sections */}
      <div>
         <h3 className="text-lg font-black text-slate-800 mb-6">Today&apos;s Competitions</h3>
         <div className="space-y-2">
            {leagues.map((country) => (
               <div key={country.country.name} className="border-b border-slate-100 pb-2">
                  <button 
                    onClick={() => setOpenSection(openSection === country.country.name ? null : country.country.name)}
                    className="w-full flex items-center justify-between py-2 group"
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-base grayscale group-hover:grayscale-0 transition-all">
                           {country.country.flagUrl ? <Image src={country.country.flagUrl} alt="" width={16} height={12} className="w-4 h-3 object-cover rounded-sm shadow-sm" /> : '🏳️'}
                        </span>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-brand-indigo transition-colors">{country.country.name}</span>
                     </div>
                     <svg className={`w-4 h-4 text-slate-300 transition-transform ${openSection === country.country.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                     </svg>
                  </button>
                  {openSection === country.country.name && (
                     <div className="pl-7 py-2 space-y-2">
                        {country.leagues.map((league) => (
                           <Link 
                             key={league.id} 
                             href={`/predictions?leagueSlug=${league.slug}`}
                             className="block text-xs font-medium text-slate-500 hover:text-brand-indigo transition-colors"
                           >
                              {league.name}
                           </Link>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
    </aside>
  );
}
