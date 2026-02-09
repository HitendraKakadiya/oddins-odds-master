'use client';

import Link from 'next/link';

interface PopularTeam {
  id: number;
  name: string;
  country: string;
  logoUrl: string;
  slug: string;
}

const popularTeams: PopularTeam[] = [
  { id: 1, name: 'Barcelona', country: 'Spain', logoUrl: 'https://media.api-sports.io/football/teams/529.png', slug: 'fc-barcelona' },
  { id: 2, name: 'Liverpool', country: 'England', logoUrl: 'https://media.api-sports.io/football/teams/40.png', slug: 'liverpool' },
  { id: 3, name: 'Real Madrid', country: 'Spain', logoUrl: 'https://media.api-sports.io/football/teams/541.png', slug: 'real-madrid' },
  { id: 4, name: 'Manchester United', country: 'England', logoUrl: 'https://media.api-sports.io/football/teams/33.png', slug: 'manchester-united' },
  { id: 5, name: 'Bayern München', country: 'Germany', logoUrl: 'https://media.api-sports.io/football/teams/157.png', slug: 'bayern-munich' },
  { id: 6, name: 'Juventus', country: 'Italy', logoUrl: 'https://media.api-sports.io/football/teams/496.png', slug: 'juventus' },
  { id: 7, name: 'PSG', country: 'France', logoUrl: 'https://media.api-sports.io/football/teams/85.png', slug: 'psg' },
  { id: 8, name: 'Porto', country: 'Portugal', logoUrl: 'https://media.api-sports.io/football/teams/212.png', slug: 'porto' },
  { id: 9, name: 'São Paulo', country: 'Brazil', logoUrl: 'https://media.api-sports.io/football/teams/126.png', slug: 'sao-paulo' },
];

export default function PopularTeamsList() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="text-xl sm:text-2xl font-black text-slate-800">Popular Teams</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {popularTeams.map((team) => (
            <Link 
              key={team.id} 
              href={`/team/${team.slug}`}
              className="group flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                  <img src={team.logoUrl} alt={team.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-brand-indigo transition-colors">{team.name}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 capitalize">{team.country}</span>
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
