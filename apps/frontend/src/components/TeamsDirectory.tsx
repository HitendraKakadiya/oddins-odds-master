'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
 // import { getPopularLeagues } from '@/lib/api/leagues';
import { getTeams } from '@/lib/api/teams';
import { fetchAPI } from '@/lib/api/client';

interface Team {
  id: number;
  name: string;
  logoUrl: string;
  slug: string;
  country?: string;
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

  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState<Record<number, boolean>>({});
  const [openLeagues, setOpenLeagues] = useState<number[]>([]);
  
  async function fetchLeagues(pageNum: number, isInitial = false) {
    if (!isInitial) setLoadingMore(true);

    try {
      const data = await fetchAPI<League[]>(`/v1/leagues/popular?page=${pageNum}&limit=10`);
      if (data.length < 10) setHasMore(false);
      
      setLeagues(prev => isInitial ? data : [...prev, ...data]);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch popular leagues:', err);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchLeagues(1, true);
  }, []);

  const toggleLeague = async (leagueId: number) => {
    const isOpen = openLeagues.includes(leagueId);
    
    if (isOpen) {
      setOpenLeagues(prev => prev.filter(id => id !== leagueId));
    } else {
      setOpenLeagues(prev => [...prev, leagueId]);
      
      if (!teamsByLeague[leagueId]) {
        setLoadingTeams(prev => ({ ...prev, [leagueId]: true }));
        try {
          const teamsRes = await getTeams(undefined, undefined, leagueId) as unknown as Array<Team | { team: Team }>;
          const teams = teamsRes.map(t => ('team' in t ? (t as { team: Team }).team : t) as Team);
          setTeamsByLeague(prev => ({ ...prev, [leagueId]: teams }));
        } catch (err) {
          console.error(`Failed to fetch teams for league ${leagueId}:`, err);
        } finally {
          setLoadingTeams(prev => ({ ...prev, [leagueId]: false }));
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Directory Section */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          Football Teams
        </h2>

        <div className="flex flex-col gap-4">
          {leagues.map((league) => (
            <div key={league.id} className="flex flex-col border border-slate-100 rounded-[20px] overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleLeague(league.id)}
                className={`w-full flex items-center justify-between p-5 transition-all ${
                  openLeagues.includes(league.id) ? 'bg-[#E8E8FF]' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white flex items-center justify-center bg-white shadow-sm">
                    {league.country.flagUrl ? (
                        <img src={league.country.flagUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs">🏴</span>
                    )}
                  </div>
                  <span className="text-[15px] font-bold text-slate-900">
                    {league.country.name} - {league.name}
                  </span>
                </div>
                
                <div className="text-slate-500">
                  {openLeagues.includes(league.id) ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
              </button>

              {openLeagues.includes(league.id) && (
                <div className="bg-white divide-y divide-slate-100 animate-in slide-in-from-top-2 duration-300">
                  {loadingTeams[league.id] ? (
                      <div className="p-8 flex justify-center">
                        <div className="w-6 h-6 border-2 border-brand-emerald/10 border-t-brand-emerald rounded-full animate-spin"></div>
                      </div>
                  ) : teamsByLeague[league.id]?.length > 0 ? (
                    teamsByLeague[league.id].map((team) => (
                      <Link 
                        key={team.id} 
                        href={`/team/${team.slug}`}
                        className="group flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <button className="text-slate-300 hover:text-brand-emerald transition-colors" onClick={(e) => { e.preventDefault(); }}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                          </button>
                          <img src={team.logoUrl} alt="" className="w-8 h-8 object-contain" />
                          <span className="text-[15px] font-bold text-slate-700 group-hover:text-brand-emerald transition-colors">{team.name}</span>
                        </div>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-emerald transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-sm font-medium italic">No teams in this league.</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <div className="py-10 flex justify-center">
              <button 
                onClick={() => fetchLeagues(page + 1)}
                disabled={loadingMore}
                className="px-8 py-3 bg-brand-midnight text-white font-bold rounded-2xl hover:bg-brand-emerald transition-all shadow-lg shadow-brand-midnight/20 disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More Leagues'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
