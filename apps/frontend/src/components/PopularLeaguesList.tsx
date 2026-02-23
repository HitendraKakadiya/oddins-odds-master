'use client';

import Link from 'next/link';
import Image from 'next/image';

interface PopularLeague {
  id: number;
  name: string;
  country: string;
  logoUrl: string;
  slug: string;
}

const popularLeagues: PopularLeague[] = [
  { id: 1, name: 'UEFA Champions League', country: 'Europe', logoUrl: 'https://media.api-sports.io/football/leagues/2.png', slug: 'uefa-champions-league' },
  { id: 2, name: 'Premier League', country: 'England', logoUrl: 'https://media.api-sports.io/football/leagues/39.png', slug: 'premier-league' },
  { id: 3, name: 'La Liga', country: 'Spain', logoUrl: 'https://media.api-sports.io/football/leagues/140.png', slug: 'la-liga' },
  { id: 4, name: 'Serie A', country: 'Italy', logoUrl: 'https://media.api-sports.io/football/leagues/135.png', slug: 'serie-a' },
  { id: 5, name: 'Bundesliga', country: 'Germany', logoUrl: 'https://media.api-sports.io/football/leagues/78.png', slug: 'bundesliga' },
  { id: 6, name: 'Copa Libertadores', country: 'South America', logoUrl: 'https://media.api-sports.io/football/leagues/13.png', slug: 'copa-libertadores' },
  { id: 7, name: 'FIFA Club World Cup', country: 'International', logoUrl: 'https://media.api-sports.io/football/leagues/15.png', slug: 'club-world-cup' },
  { id: 8, name: 'Ligue 1', country: 'France', logoUrl: 'https://media.api-sports.io/football/leagues/61.png', slug: 'ligue-1' },
  { id: 9, name: 'Europa League', country: 'Europe', logoUrl: 'https://media.api-sports.io/football/leagues/3.png', slug: 'europa-league' },
  { id: 10, name: 'Brazil Serie A', country: 'Brazil', logoUrl: 'https://media.api-sports.io/football/leagues/71.png', slug: 'brazil-serie-a' },
  { id: 11, name: 'Copa Sudamericana', country: 'South America', logoUrl: 'https://media.api-sports.io/football/leagues/11.png', slug: 'copa-sudamericana' },
  { id: 12, name: 'Primera División', country: 'Argentina', logoUrl: 'https://media.api-sports.io/football/leagues/128.png', slug: 'primera-division' },
];

export default function PopularLeaguesList() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="text-xl sm:text-2xl font-black text-slate-800">Popular Leagues</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {popularLeagues.map((league) => (
            <Link 
              key={league.id} 
              href={`/predictions?leagueSlug=${league.slug}`}
              className="group flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                  <Image 
                    src={league.logoUrl} 
                    alt={league.name} 
                    width={32} 
                    height={32} 
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-brand-indigo transition-colors">{league.name}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{league.country}</span>
                </div>
              </div>
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 group-hover:text-brand-indigo transition-all transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
