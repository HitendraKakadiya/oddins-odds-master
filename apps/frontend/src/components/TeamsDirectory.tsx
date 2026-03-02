'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPopularLeagues } from '@/lib/api/leagues';
import { getTeams } from '@/lib/api/teams';

interface Team {
  id: number;
  name: string;
  logoUrl: string;
  slug: string;
}

interface League {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  country: {
    name: string;
    code: string;
    flagUrl: string;
  };
}

export default function TeamsDirectory() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teamsByLeague, setTeamsByLeague] = useState<Record<number, Team[]>>({});
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState<Record<number, boolean>>({});
  const [openLeagues, setOpenLeagues] = useState<number[]>([]);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const data = await getPopularLeagues();
        setLeagues(data as any);
      } catch (err) {
        console.error('Failed to fetch popular leagues:', err);
      } finally {
        setLoadingLeagues(false);
      }
    }
    fetchLeagues();
  }, []);

  const toggleLeague = async (leagueId: number) => {
    const isOpen = openLeagues.includes(leagueId);
    
    if (isOpen) {
      setOpenLeagues(prev => prev.filter(id => id !== leagueId));
    } else {
      setOpenLeagues(prev => [...prev, leagueId]);
      
      // Fetch teams if not already loaded
      if (!teamsByLeague[leagueId]) {
        setLoadingTeams(prev => ({ ...prev, [leagueId]: true }));
        try {
          const teams = await getTeams(undefined, undefined, leagueId) as Team[];
          setTeamsByLeague(prev => ({ ...prev, [leagueId]: teams }));
        } catch (err) {
          console.error(`Failed to fetch teams for league ${leagueId}:`, err);
        } finally {
          setLoadingTeams(prev => ({ ...prev, [leagueId]: false }));
        }
      }
    }
  };

  if (loadingLeagues) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-brand-indigo/10 border-t-brand-indigo rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Loading popular leagues...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h2 className="text-2xl font-black text-slate-800">Football Teams Statistics</h2>
        <p className="text-sm font-bold text-slate-400">Showing top leagues from around the world</p>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-1">
        <div className="flex flex-col gap-2">
          {leagues.map((league) => (
            <div key={league.id} className="flex flex-col">
              <button 
                onClick={() => toggleLeague(league.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  openLeagues.includes(league.id) ? 'bg-brand-indigo/5' : 'bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg shadow-sm overflow-hidden flex items-center justify-center bg-white border border-slate-100">
                    {league.country.flagUrl ? (
                      <img src={league.country.flagUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs">📍</span>
                    )}
                  </div>
                  <div className="flex flex-col items-start translate-y-[-1px]">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{league.country.name}</span>
                    <span className={`text-sm font-black transition-colors ${openLeagues.includes(league.id) ? 'text-brand-indigo' : 'text-slate-700'}`}>
                      {league.name}
                    </span>
                  </div>
                </div>
                
                {loadingTeams[league.id] ? (
                  <div className="w-5 h-5 border-2 border-brand-indigo/10 border-t-brand-indigo rounded-full animate-spin"></div>
                ) : (
                  <svg 
                    className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${openLeagues.includes(league.id) ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {openLeagues.includes(league.id) && teamsByLeague[league.id] && (
                <div className="divide-y divide-slate-50 px-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {teamsByLeague[league.id].length === 0 ? (
                    <div className="p-8 text-center bg-slate-50/50 rounded-xl mb-2">
                      <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">No teams found for this league</p>
                    </div>
                  ) : (
                    teamsByLeague[league.id].map((team) => (
                      <div key={team.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-all rounded-xl cursor-pointer">
                        <div className="flex items-center gap-4">
                          <button className="text-slate-200 hover:text-brand-pink transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                             </svg>
                          </button>
                          <div className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden shadow-sm">
                            <img src={team.logoUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          <Link href={`/team/${team.slug}`} className="text-sm font-bold text-slate-600 group-hover:text-brand-indigo transition-colors">
                            {team.name}
                          </Link>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Full Stats</span>
                          <svg 
                            className="w-4 h-4 text-slate-200 group-hover:text-brand-indigo transition-all transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
