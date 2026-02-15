'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LeaguesResponse } from '@/lib/api';

interface SidebarProps {
  leagueData: LeaguesResponse[];
  _featuredTip?: unknown;
  streams?: Array<{ id: number; home: string; away: string; time: string; icon: string }>;
  mode?: 'default' | 'predictions';
}

export default function Sidebar({ leagueData, _featuredTip, streams = [], mode = 'default' }: SidebarProps) {
  const topLeagues = leagueData;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCountry, setOpenCountry] = useState<string | null>(null);

  const mockPredictions = [
    {
      id: 1,
      leagueName: 'Greek Super League',
      time: '22:00',
      date: 'Wed - 4 Feb 2026',
      homeTeam: { name: 'Asteras Tripolis', logo: '⚽' },
      awayTeam: { name: 'Olympiakos Piraeus', logo: '⚽' },
      prediction: 'Over 2.5 Goals',
      countdown: '1m 41s'
    },
    {
      id: 2,
      leagueName: 'Premier League',
      time: '21:30',
      date: 'Wed - 4 Feb 2026',
      homeTeam: { name: 'Manchester City', logo: '⚽' },
      awayTeam: { name: 'Arsenal', logo: '⚽' },
      prediction: 'Home Win',
      countdown: '15m 20s'
    },
    {
      id: 3,
      leagueName: 'La Liga',
      time: '23:00',
      date: 'Wed - 4 Feb 2026',
      homeTeam: { name: 'Real Madrid', logo: '⚽' },
      awayTeam: { name: 'Barcelona', logo: '⚽' },
      prediction: 'Both Teams To Score',
      countdown: '45m 10s'
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % mockPredictions.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + mockPredictions.length) % mockPredictions.length);

  const mockCompetitions = [
    { country: { name: 'Algeria', flagUrl: 'https://flagcdn.com/dz.svg' }, leagues: [{ id: 101, name: 'Ligue 1', slug: 'algeria-ligue-1' }] },
    { country: { name: 'Argentina', flagUrl: 'https://flagcdn.com/ar.svg' }, leagues: [{ id: 102, name: 'Liga Profesional', slug: 'argentina-liga-profesional' }, { id: 103, name: 'Primera B Nacional', slug: 'argentina-primera-b' }] },
    { country: { name: 'Botswana', flagUrl: 'https://flagcdn.com/bw.svg' }, leagues: [{ id: 104, name: 'Premier League', slug: 'botswana-premier-league' }] },
    { country: { name: 'Brazil', flagUrl: 'https://flagcdn.com/br.svg' }, leagues: [{ id: 105, name: 'Série A', slug: 'brazil-serie-a' }, { id: 106, name: 'Série B', slug: 'brazil-serie-b' }] },
    { country: { name: 'Cameroon', flagUrl: 'https://flagcdn.com/cm.svg' }, leagues: [{ id: 107, name: 'Elite One', slug: 'cameroon-elite-one' }] },
    { country: { name: 'England', flagUrl: 'https://flagcdn.com/gb-eng.svg' }, leagues: [{ id: 108, name: 'Premier League', slug: 'england-premier-league' }, { id: 109, name: 'Championship', slug: 'england-championship' }] },
    { country: { name: 'France', flagUrl: 'https://flagcdn.com/fr.svg' }, leagues: [{ id: 110, name: 'Ligue 1', slug: 'france-ligue-1' }, { id: 111, name: 'Ligue 2', slug: 'france-ligue-2' }] },
    { country: { name: 'Germany', flagUrl: 'https://flagcdn.com/de.svg' }, leagues: [{ id: 112, name: 'Bundesliga', slug: 'germany-bundesliga' }, { id: 113, name: '2. Bundesliga', slug: 'germany-2-bundesliga' }] },
    { country: { name: 'Italy', flagUrl: 'https://flagcdn.com/it.svg' }, leagues: [{ id: 114, name: 'Serie A', slug: 'italy-serie-a' }, { id: 115, name: 'Serie B', slug: 'italy-serie-b' }] },
    { country: { name: 'Spain', flagUrl: 'https://flagcdn.com/es.svg' }, leagues: [{ id: 116, name: 'La Liga', slug: 'spain-la-liga' }, { id: 117, name: 'Segunda División', slug: 'spain-segunda' }] },
  ];

  const competitionsData = (leagueData && leagueData.length > 0) ? leagueData : mockCompetitions;
  const currentPrediction = mockPredictions[currentSlide];

  return (
    <aside className="w-full lg:w-[380px] flex flex-col gap-6">
      <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[28px] p-4 text-white overflow-hidden relative shadow-xl shadow-brand-indigo/30 border border-white/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-black text-lg sm:text-xl tracking-tight">Prediction of the day</h3>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-white/30 text-slate-900">
          <div className="flex items-start gap-2.5 mb-3 border-b border-slate-100 pb-3">
             <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-brand-indigo shadow-sm overflow-hidden">
                <span className="text-lg">🇬🇷</span>
             </div>
             <div>
                <div className="text-sm sm:text-base font-black text-slate-800 leading-tight">{currentPrediction.leagueName}</div>
                <div className="flex items-center gap-2 mt-0.5 text-slate-400 font-bold text-[10px]">
                   <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {currentPrediction.time}
                   </div>
                   <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {currentPrediction.date}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between gap-1 mb-4 mt-4">
            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 border border-slate-100 rounded-full mb-2 flex items-center justify-center text-lg sm:text-xl shadow-sm">
                {currentPrediction.homeTeam.logo}
              </div>
              <div className="text-sm sm:text-base font-black text-slate-800 leading-tight line-clamp-2">
                {currentPrediction.homeTeam.name}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-shrink-0 px-2">
              <div className="text-xs sm:text-sm font-black text-slate-300 mb-0.5">V.S</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 shadow-inner">
                 {currentPrediction.countdown}
              </div>
            </div>

            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 border border-slate-100 rounded-full mb-2 flex items-center justify-center text-lg sm:text-xl shadow-sm">
                {currentPrediction.awayTeam.logo}
              </div>
              <div className="text-sm sm:text-base font-black text-slate-800 leading-tight line-clamp-2">
                {currentPrediction.awayTeam.name}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
             <div className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Prediction</div>
             <div className="font-black text-lg sm:text-xl text-slate-900 leading-tight">{currentPrediction.prediction}</div>
          </div>

          <button className="w-full bg-brand-pink text-white py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-[0.15em] shadow-lg shadow-brand-pink/20 hover:scale-[1.01] transition-all active:scale-[0.99]">
            See Prediction
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
           <div className="flex items-center gap-4">
              <button 
                onClick={prevSlide}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center gap-2">
                 <div className="text-sm sm:text-base font-black text-white/80">{currentSlide + 1} / {mockPredictions.length}</div>
                 <div className="flex items-center gap-1.5">
                    {mockPredictions.map((_, idx) => (
                       <button 
                         key={idx}
                         onClick={() => setCurrentSlide(idx)}
                         className={`h-1.5 rounded-full transition-all border border-white/10 ${idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`}
                       />
                    ))}
                 </div>
              </div>

              <button 
                onClick={nextSlide}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
           </div>
        </div>
      </div>

      {mode === 'default' ? (
        <>
          <div className="card !p-0 overflow-hidden shadow-sm !border-slate-200/60 border-t-4 !border-t-brand-indigo">
            <div className="p-5 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-lg sm:text-xl text-slate-800">Today&apos;s Streams</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {streams.length > 0 ? (
                  streams.map((stream) => (
                    <div key={stream.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-sm shadow-sm">
                          {stream.icon}
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1 group-hover:text-brand-indigo transition-colors">
                            {stream.home} vs {stream.away}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${stream.time === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></span>
                            <span className={`text-xs sm:text-sm font-black uppercase tracking-tighter ${stream.time === 'LIVE' ? 'text-red-500' : 'text-slate-400'}`}>
                              {stream.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-brand-indigo/10 group-hover:text-brand-indigo transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                      <div className="text-sm sm:text-base text-slate-400 font-semibold mb-2">No live events now</div>
                      <Link href="/streams" className="text-xs sm:text-sm text-brand-indigo font-bold hover:underline">View schedule &rarr;</Link>
                  </div>
                )}
            </div>
          </div>

          <div className="card !p-0 overflow-hidden shadow-sm !border-slate-200/60 border-t-4 !border-t-brand-indigo">
            <div className="p-5 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-lg sm:text-xl text-slate-800">Football Leagues</h3>
            </div>
            <div className="flex flex-col">
              {topLeagues.length > 0 ? (topLeagues.map((group) => (
                  <div key={group.country.name}>
                     {group.leagues.map((league) => (
                        <Link 
                          key={league.id} 
                          href={`/leagues/${group.country.name.toLowerCase()}/${league.slug}`} 
                          className="flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0 group"
                        >
                          <div className="flex items-center gap-4">
                            {league.logoUrl ? (
                              <img src={league.logoUrl} alt={league.name} className="w-8 h-8 object-contain rounded shadow-sm border border-slate-100" />
                            ) : (
                              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-brand-indigo/10 group-hover:text-brand-indigo transition-all border border-slate-200/50">
                                  {league.name.substring(0,2).toUpperCase()}
                              </div>
                            )}
                            <div>
                                <div className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-brand-indigo transition-colors line-clamp-1">{league.name}</div>
                                <div className="text-xs sm:text-sm text-slate-400 font-bold tracking-tight">{group.country.name}</div>
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-all translate-x-0 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7-7" />
                          </svg>
                        </Link>
                     ))}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm sm:text-base text-slate-400 font-bold">No data available</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
           <h3 className="font-bold text-xl sm:text-2xl text-slate-800 ml-1">Today&apos;s Competitions</h3>
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {competitionsData.map((group) => (
                  <div key={group.country.name} className="flex flex-col">
                    <button 
                      onClick={() => setOpenCountry(openCountry === group.country.name ? null : group.country.name)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition-transform">
                          {group.country.flagUrl ? (
                            <img src={group.country.flagUrl} alt="" className="w-5 h-4 object-cover rounded-sm" />
                          ) : (
                            <span>🏳️</span>
                          )}
                        </div>
                        <span className="text-base sm:text-lg font-bold text-slate-700 group-hover:text-brand-indigo transition-colors">{group.country.name}</span>
                      </div>
                      <svg 
                        className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${openCountry === group.country.name ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openCountry === group.country.name && (
                      <div className="bg-slate-50/50 px-5 pb-4 space-y-2 pt-1">
                        {group.leagues.map((league) => (
                          <Link 
                            key={league.id} 
                            href={`/predictions?leagueSlug=${league.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:text-brand-indigo transition-all text-sm sm:text-base font-bold text-slate-500"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            {league.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </aside>
  );
}
