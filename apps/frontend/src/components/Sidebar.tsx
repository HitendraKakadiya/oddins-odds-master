'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { LeaguesResponse, Prediction } from '@/lib/api';
import { getLiveLeagues } from '@/lib/api';

interface SidebarProps {
  leagueData: LeaguesResponse[];
  initialTotal?: number;
  featuredTips?: Prediction[];
  mode?: 'default' | 'predictions';
  date?: string;
}

interface SidebarPrediction {
  id?: string | number;
  kickoffAt?: string | null;
  leagueName?: string;
  league?: { name: string; slug?: string; countryName?: string; countryCode?: string | null; country?: { name: string; code?: string | null } } | null;
  prediction?: string;
  title?: string;
  selection?: string | null;
  matchId?: string | number;
  time?: string;
  date?: string;
  homeTeam?: { name: string; logoUrl?: string | null; logo?: string | null } | null;
  awayTeam?: { name: string; logoUrl?: string | null; logo?: string | null } | null;
  countryCode?: string;
}

export default function Sidebar({ 
  leagueData, 
  initialTotal = 0, 
  featuredTips = [], 
  date, 
  mode = 'default' 
}: SidebarProps) {
  // Leagues State
  const [competitions, setCompetitions] = useState<LeaguesResponse[]>(leagueData || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState((leagueData || []).length < initialTotal);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCountries, setOpenCountries] = useState<string[]>(() => {
    return (leagueData || []).slice(0, 5).map(group => group.country.name);
  });

  // Sync Leagues State with Props
  useEffect(() => {
    setCompetitions(leagueData || []);
    setPage(1);
    setHasMore((leagueData || []).length < initialTotal);
  }, [leagueData, initialTotal]);

  // Load More Leagues
  const loadMoreLeagues = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await getLiveLeagues(nextPage, 20, date);
      
      if (response && response.items) {
        setCompetitions(prev => [...prev, ...response.items]);
        setPage(nextPage);
        setHasMore((competitions.length + response.items.length) < response.total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more leagues:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, competitions.length, date]);

  // Observer for Leagues
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreLeagues();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreLeagues, hasMore]);

  const toggleCountry = (countryName: string) => {
    setOpenCountries(prev => 
      prev.includes(countryName) 
        ? prev.filter(name => name !== countryName) 
        : [...prev, countryName]
    );
  };

  const today = new Date();
  
  const FALLBACK_PREDICTIONS = [
    {
      id: 'fallback-1',
      leagueName: 'English Premier League',
      time: '19:45',
      date: 'Sat - 7 Mar 2026',
      homeTeam: { name: 'Manchester City', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop' },
      awayTeam: { name: 'Liverpool', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop' },
      prediction: 'Over 2.5 Goals',
      countryCode: 'GB'
    },
    {
      id: 'fallback-2',
      leagueName: 'Spanish La Liga',
      time: '20:00',
      date: 'Sun - 8 Mar 2026',
      homeTeam: { name: 'Real Madrid', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop' },
      awayTeam: { name: 'Barcelona', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop' },
      prediction: 'Both Teams to Score',
      countryCode: 'ES'
    },
    {
      id: 'fallback-3',
      leagueName: 'German Bundesliga',
      time: '14:30',
      date: 'Sat - 7 Mar 2026',
      homeTeam: { name: 'Bayern Munich', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop' },
      awayTeam: { name: 'Dortmund', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop' },
      prediction: 'Home Win',
      countryCode: 'DE'
    }
  ];

  const sourcePredictions = (featuredTips && featuredTips.length > 0 ? featuredTips : FALLBACK_PREDICTIONS).slice(0, 3);
  
  const displayPredictions = sourcePredictions.map((tip: SidebarPrediction, index: number) => {
    const kickoffDate = tip.kickoffAt ? new Date(tip.kickoffAt) : null;
    const leagueName = tip.leagueName || tip.league?.name || 'Elite Competition';
    const predictionText = tip.prediction || tip.title || tip.selection || 'Expert Analysis';
    
    return {
      id: (tip.id || tip.matchId || `tip-${index}`).toString(),
      leagueName: leagueName,
      time: kickoffDate ? kickoffDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : (tip.time || '20:00'),
      date: kickoffDate ? kickoffDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : (tip.date || 'Today'),
      homeTeam: { 
        name: tip.homeTeam?.name || 'Home Team', 
        logo: tip.homeTeam?.logoUrl || tip.homeTeam?.logo || 'https://via.placeholder.com/100' 
      },
      awayTeam: { 
        name: tip.awayTeam?.name || 'Away Team', 
        logo: tip.awayTeam?.logoUrl || tip.awayTeam?.logo || 'https://via.placeholder.com/100' 
      },
      prediction: predictionText,
      countryCode: tip.countryCode || tip.league?.countryCode || tip.league?.country?.code || 'EU'
    };
  });
  
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayPredictions.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayPredictions.length) % displayPredictions.length);

  const currentPrediction = displayPredictions[currentSlide] || displayPredictions[0];

  return (
    <aside className="w-full lg:w-[380px] flex flex-col gap-6 ">
      {currentPrediction && (
        <div className="bg-gradient-to-br from-[#059669] via-[#10B981] to-[#047857] rounded-[36px] p-1 text-white overflow-hidden relative shadow-2xl shadow-emerald-500/20 group border border-white/10">
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#064E3B]/40 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
           
           <div className="relative z-10 p-4 pt-3">
             <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                 <span className="text-[10px]">🏆</span>
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-emerald-50">Prediction of the day</h3>
            </div>
    
            <div className="bg-white rounded-[28px] p-4 shadow-2xl shadow-emerald-950/20 mb-4 text-slate-900 border border-white/50 relative z-10">
              {/* League & Date Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50/80">
                 <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-brand-emerald shadow-sm overflow-hidden shrink-0">
                    {currentPrediction.countryCode ? (
                      <img 
                        src={`https://flagcdn.com/${currentPrediction.countryCode.toLowerCase()}.svg`} 
                        alt={currentPrediction.leagueName} 
                        className="w-6 h-4 object-cover rounded-sm" 
                      />
                    ) : (
                      <span className="text-xl">⚽</span>
                    )}
                 </div>
                 <div className="min-w-0">
                    <div className="text-[13px] font-black text-slate-800 leading-tight truncate tracking-tight">{currentPrediction.leagueName}</div>
                    <div className="flex items-center gap-2 mt-1 text-slate-400 font-bold text-[8px] uppercase tracking-widest">
                       <span className="bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100/50">{currentPrediction.time}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                       <span>{currentPrediction.date}</span>
                    </div>
                 </div>
              </div>
    
              {/* Teams & VS Section */}
              <div className="flex items-center justify-between gap-1 mb-6 mt-1 px-1">
                <div className="flex flex-col items-center w-[100px] group/team">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl mb-2 flex items-center justify-center p-2.5 shadow-sm group-hover/team:scale-105 group-hover/team:-rotate-2 transition-all duration-300">
                    {currentPrediction.homeTeam.logo ? (
                      <img src={currentPrediction.homeTeam.logo} alt={currentPrediction.homeTeam.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">⚽</span>
                    )}
                  </div>
                  <div className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight text-center tracking-tight h-[2.2em] flex items-center">{currentPrediction.homeTeam.name}</div>
                </div>
    
                <div className="flex flex-col items-center gap-1 opacity-20">
                   <div className="w-[1px] h-6 bg-slate-900"></div>
                   <div className="text-[8px] font-black tracking-widest text-slate-900">VS</div>
                   <div className="w-[1px] h-6 bg-slate-900"></div>
                </div>
    
                <div className="flex flex-col items-center w-[100px] group/team">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl mb-2 flex items-center justify-center p-2.5 shadow-sm group-hover/team:scale-105 group-hover/team:rotate-2 transition-all duration-300">
                    {currentPrediction.awayTeam.logo ? (
                      <img src={currentPrediction.awayTeam.logo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">⚽</span>
                    )}
                  </div>
                  <div className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight text-center tracking-tight h-[2.2em] flex items-center">{currentPrediction.awayTeam.name}</div>
                </div>
              </div>
              
              {/* Prediction Display */}
              <Link 
                 href={`/predictions?matchId=${currentPrediction.id}`}
                 className="relative mt-6 mb-4 block hover:opacity-90 transition-opacity"
              >
                 <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-emerald text-white text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full shadow-lg shadow-emerald-500/20 z-10 border border-emerald-400/50">
                    Expert Pick
                 </div>
                 <div className="bg-[#F1F5F9]/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100/50 text-center group-hover:bg-brand-light-emerald/40 transition-all duration-500">
                    <div className="font-black text-[16px] text-slate-900 leading-tight tracking-tight">{currentPrediction.prediction}</div>
                 </div>
              </Link>
    
              <Link 
                href={`/predictions?date=${date || today.toISOString().split('T')[0]}`}
                className="block w-full bg-brand-midnight text-white py-3.5 rounded-[16px] font-black text-[10px] uppercase tracking-[0.15em] text-center hover:bg-slate-800 transition-all shadow-xl shadow-brand-midnight/10 active:scale-95 group/btn overflow-hidden relative"
              >
                <span className="relative z-10">See All Predictions</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </Link>
            </div>
    
            {/* Pagination Controls */}
            {displayPredictions.length > 1 && (
              <div className="flex items-center justify-between px-2 relative z-10 pb-1">
                <button 
                  onClick={prevSlide} 
                  className="w-9 h-9 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 group/nav"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex gap-1.5">
                    {displayPredictions.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-5 bg-white' : 'w-1 bg-white/20'}`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-white/60 uppercase">Tip {currentSlide + 1} of {displayPredictions.length}</span>
                </div>
                
                <button 
                  onClick={nextSlide} 
                  className="w-9 h-9 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 group/nav"
                >
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
           </div>
        </div>
      )}

      {mode === 'default' ? (
        <div className="card !p-0 overflow-hidden shadow-sm !border-slate-200/60 border-t-4 !border-t-brand-emerald">
          <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
            <h3 className="font-bold text-lg text-slate-800">Football Leagues</h3>
          </div>
          <div className="flex flex-col h-[600px] overflow-y-auto custom-scrollbar">
            {competitions.map((group) => (
                <div key={group.country.name}>
                   {group.leagues.map((league) => (
                      <Link 
                        key={league.id} 
                        href={`/leagues/${group.country.name.toLowerCase()}/${league.slug}`} 
                        className="flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group"
                      >
                        <div className="flex items-center gap-4">
                          {league.logoUrl ? (
                            <img src={league.logoUrl} alt="" className="w-8 h-8 object-contain" />
                          ) : (
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-brand-emerald/10 group-hover:text-brand-emerald transition-all">
                                {league.name.substring(0,2).toUpperCase()}
                            </div>
                          )}
                          <div>
                              <div className="text-sm font-bold text-slate-800 group-hover:text-brand-emerald transition-colors line-clamp-1">{league.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{group.country.name}</div>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-emerald transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7-7" />
                        </svg>
                      </Link>
                   ))}
                </div>
              ))
            }
            <div ref={loaderRef} className="py-8 flex flex-col items-center justify-center gap-2">
              {loading && <div className="w-5 h-5 border-2 border-brand-emerald/20 border-t-brand-emerald rounded-full animate-spin"></div>}
              {!hasMore && <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">End of list</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
           <h3 className="font-bold text-xl text-slate-800 ml-1">Today&apos;s Competitions</h3>
           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100 max-h-[800px] overflow-y-auto custom-scrollbar">
                {competitions.map((group) => (
                  <div key={group.country.name} className="flex flex-col border-b border-slate-50 last:border-0">
                    <button 
                      onClick={() => toggleCountry(group.country.name)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-50">
                          {group.country.flagUrl ? (
                            <img src={group.country.flagUrl} alt="" className="w-5 h-4 object-cover rounded-sm" />
                          ) : (
                            <span>🏳️</span>
                          )}
                        </div>
                        <span className="text-base font-bold text-slate-700 group-hover:text-brand-emerald transition-colors">{group.country.name}</span>
                      </div>
                      <svg 
                        className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${openCountries.includes(group.country.name) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openCountries.includes(group.country.name) && (
                      <div className="bg-slate-50/50 px-5 pb-4 space-y-1 mt-1">
                        {group.leagues.map((league) => (
                          <Link 
                            key={league.id} 
                            href={`/leagues/${group.country.name.toLowerCase()}/${league.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:text-brand-emerald transition-all text-sm font-bold text-slate-500"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {league.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={loaderRef} className="py-8 flex flex-col items-center justify-center gap-2">
                  {loading && <div className="w-5 h-5 border-2 border-brand-emerald/20 border-t-brand-emerald rounded-full animate-spin"></div>}
                  {!hasMore && <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">End of list</span>}
                </div>
              </div>
           </div>
        </div>
      )}
    </aside>
  );
}
