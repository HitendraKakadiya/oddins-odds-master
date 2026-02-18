'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeagues } from '@/lib/api';

interface League {
  id: number;
  name: string;
  logoUrl: string;
  slug: string;
}

interface Group {
  region: string;
  flagUrl?: string | null;
  icon?: string;
  leagues: League[];
}

export default function WorldwideLeagueDirectory() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await getLeagues(1, 200);
        const mappedGroups: Group[] = response.items.map(item => ({
          region: item.country.name,
          flagUrl: item.country.flagUrl,
          leagues: item.leagues.map(l => ({
            id: l.id,
            name: l.name,
            logoUrl: l.logoUrl || '',
            slug: l.slug
          }))
        }));
        setGroups(mappedGroups);
        if (mappedGroups.length > 0) {
          setOpenGroups([mappedGroups[0].region, mappedGroups[1]?.region].filter(Boolean) as string[]);
        }
      } catch (error) {
        console.error('Failed to fetch leagues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const toggleGroup = (region: string) => {
    setOpenGroups(prev => 
      prev.includes(region) ? prev.filter(g => g !== region) : [...prev, region]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-slate-800">Worldwide Football Leagues and Competitions</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-brand-indigo/10 border-t-brand-indigo rounded-full animate-spin"></div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading competitions...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <div key={group.region} className="flex flex-col">
                <button 
                  onClick={() => toggleGroup(group.region)}
                  className="w-full flex items-center justify-between p-4 bg-[#E2E1FF]/40 hover:bg-[#E2E1FF]/60 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded shadow-sm overflow-hidden flex items-center justify-center bg-white text-sm">
                      {group.flagUrl ? <img src={group.flagUrl} alt="" className="w-full h-full object-cover" /> : group.icon || '📍'}
                    </div>
                    <span className="text-sm font-black text-slate-700">{group.region}</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform ${openGroups.includes(group.region) ? '' : 'rotate-180'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
                  </svg>
                </button>

                {openGroups.includes(group.region) && (
                  <div className="divide-y divide-slate-50 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {group.leagues.map((league) => (
                      <div key={league.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-all rounded-xl cursor-pointer">
                        <div className="flex items-center gap-4">
                          <button className="text-slate-300 hover:text-brand-pink transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                             </svg>
                          </button>
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                            <img src={league.logoUrl} alt="" className="w-5 h-5 object-contain" />
                          </div>
                          <Link href={`/predictions?leagueSlug=${league.slug}`} className="text-sm font-bold text-slate-600 group-hover:text-brand-indigo transition-colors">
                            {league.name}
                          </Link>
                        </div>
                        <svg 
                          className="w-4 h-4 text-slate-200 group-hover:text-brand-indigo transition-all transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
