'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface League {
  id: number;
  name: string;
  logoUrl: string;
  slug: string;
}

interface Group {
  region: string;
  flagUrl?: string;
  icon?: string;
  leagues: League[];
}

const leagueGroups: Group[] = [
  {
    region: 'Europe (Clubs)',
    icon: '🌍',
    leagues: [
      { id: 201, name: 'UEFA Champions League', logoUrl: 'https://media.api-sports.io/football/leagues/2.png', slug: 'uefa-champions-league' },
      { id: 202, name: 'Europa League', logoUrl: 'https://media.api-sports.io/football/leagues/3.png', slug: 'europa-league' },
      { id: 203, name: 'Europa Conference League', logoUrl: 'https://media.api-sports.io/football/leagues/848.png', slug: 'europa-conference-league' },
      { id: 204, name: "UEFA Women's Champions League", logoUrl: 'https://media.api-sports.io/football/leagues/5.png', slug: 'womens-champions-league' },
      { id: 205, name: 'UEFA Super Cup', logoUrl: 'https://media.api-sports.io/football/leagues/524.png', slug: 'uefa-super-cup' },
    ]
  },
  {
    region: 'England',
    flagUrl: 'https://flagcdn.com/gb-eng.svg',
    leagues: [
      { id: 301, name: 'Premier League', logoUrl: 'https://media.api-sports.io/football/leagues/39.png', slug: 'premier-league' },
      { id: 302, name: 'FA Cup', logoUrl: 'https://media.api-sports.io/football/leagues/45.png', slug: 'fa-cup' },
      { id: 303, name: 'Championship', logoUrl: 'https://media.api-sports.io/football/leagues/40.png', slug: 'championship' },
      { id: 304, name: "Women's Super League", logoUrl: 'https://media.api-sports.io/football/leagues/44.png', slug: 'womens-super-league' },
    ]
  },
  {
    region: 'Spain',
    flagUrl: 'https://flagcdn.com/es.svg',
    leagues: [
      { id: 401, name: 'La Liga', logoUrl: 'https://media.api-sports.io/football/leagues/140.png', slug: 'la-liga' },
      { id: 402, name: 'Copa del Rey', logoUrl: 'https://media.api-sports.io/football/leagues/143.png', slug: 'copa-del-rey' },
    ]
  },
  {
    region: 'Italy',
    flagUrl: 'https://flagcdn.com/it.svg',
    leagues: [
      { id: 501, name: 'Serie A', logoUrl: 'https://media.api-sports.io/football/leagues/135.png', slug: 'serie-a' },
      { id: 502, name: 'Coppa Italia', logoUrl: 'https://media.api-sports.io/football/leagues/137.png', slug: 'coppa-italia' },
      { id: 503, name: 'Serie B', logoUrl: 'https://media.api-sports.io/football/leagues/136.png', slug: 'serie-b' },
    ]
  },
  {
    region: 'Germany',
    flagUrl: 'https://flagcdn.com/de.svg',
    leagues: [
      { id: 601, name: 'Bundesliga', logoUrl: 'https://media.api-sports.io/football/leagues/78.png', slug: 'bundesliga' },
      { id: 602, name: 'DFB Pokal', logoUrl: 'https://media.api-sports.io/football/leagues/81.png', slug: 'dfb-pokal' },
      { id: 603, name: '2. Bundesliga', logoUrl: 'https://media.api-sports.io/football/leagues/79.png', slug: '2-bundesliga' },
    ]
  },
  {
    region: 'France',
    flagUrl: 'https://flagcdn.com/fr.svg',
    leagues: [
      { id: 701, name: 'Ligue 1', logoUrl: 'https://media.api-sports.io/football/leagues/61.png', slug: 'ligue-1' },
      { id: 702, name: 'Coupe de France', logoUrl: 'https://media.api-sports.io/football/leagues/66.png', slug: 'coupe-de-france' },
    ]
  },
  {
    region: 'International',
    icon: '🌎',
    leagues: [
      { id: 801, name: 'FIFA World Cup', logoUrl: 'https://media.api-sports.io/football/leagues/1.png', slug: 'world-cup' },
      { id: 802, name: 'Copa América', logoUrl: 'https://media.api-sports.io/football/leagues/9.png', slug: 'copa-america' },
      { id: 803, name: 'European Championship', logoUrl: 'https://media.api-sports.io/football/leagues/4.png', slug: 'euro-cup' },
    ]
  },
];

export default function WorldwideLeagueDirectory() {
  const [openGroups, setOpenGroups] = useState<string[]>(['Europe (Clubs)', 'England', 'Spain']);

  const toggleGroup = (region: string) => {
    setOpenGroups(prev => 
      prev.includes(region) ? prev.filter(g => g !== region) : [...prev, region]
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="text-xl sm:text-2xl font-black text-slate-800">Worldwide Football Leagues and Competitions</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-1">
        <div className="flex flex-col gap-2">
          {leagueGroups.map((group) => (
            <div key={group.region} className="flex flex-col">
              <button 
                onClick={() => toggleGroup(group.region)}
                className="w-full flex items-center justify-between p-4 bg-[#E2E1FF]/40 hover:bg-[#E2E1FF]/60 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded shadow-sm overflow-hidden relative flex items-center justify-center bg-white text-[10px] sm:text-xs">
                    {group.flagUrl ? <Image src={group.flagUrl} alt="" fill className="object-cover" /> : group.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-700">{group.region}</span>
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
                    <div key={league.id} className="group flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 transition-all rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button className="text-slate-300 hover:text-brand-pink transition-colors shrink-0">
                           <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                           </svg>
                        </button>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                          <Image src={league.logoUrl} alt="" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                        </div>
                        <Link href={`/predictions?leagueSlug=${league.slug}`} className="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-brand-indigo transition-colors line-clamp-1">
                          {league.name}
                        </Link>
                      </div>
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200 group-hover:text-brand-indigo transition-all transform group-hover:translate-x-1 shrink-0" 
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
      </div>
    </div>
  );
}
