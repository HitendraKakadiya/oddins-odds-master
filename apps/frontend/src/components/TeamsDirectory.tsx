'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Team {
  id: number;
  name: string;
  logoUrl: string;
  slug: string;
}

interface LeagueGroup {
  league: string;
  flagUrl?: string;
  teams: Team[];
}

const teamGroups: LeagueGroup[] = [
  {
    league: 'England - Premier League',
    flagUrl: 'https://flagcdn.com/gb-eng.svg',
    teams: [
      { id: 1001, name: 'Arsenal', logoUrl: 'https://media.api-sports.io/football/teams/42.png', slug: 'arsenal' },
      { id: 1002, name: 'Tottenham', logoUrl: 'https://media.api-sports.io/football/teams/47.png', slug: 'tottenham' },
      { id: 1003, name: 'Manchester City', logoUrl: 'https://media.api-sports.io/football/teams/50.png', slug: 'manchester-city' },
      { id: 1004, name: 'Crystal Palace', logoUrl: 'https://media.api-sports.io/football/teams/52.png', slug: 'crystal-palace' },
      { id: 1005, name: 'Everton', logoUrl: 'https://media.api-sports.io/football/teams/45.png', slug: 'everton' },
      { id: 1006, name: 'Burnley', logoUrl: 'https://media.api-sports.io/football/teams/44.png', slug: 'burnley' },
      { id: 1007, name: 'Bournemouth', logoUrl: 'https://media.api-sports.io/football/teams/35.png', slug: 'bournemouth' },
      { id: 1008, name: 'Manchester United', logoUrl: 'https://media.api-sports.io/football/teams/33.png', slug: 'manchester-united' },
      { id: 1009, name: 'Liverpool', logoUrl: 'https://media.api-sports.io/football/teams/40.png', slug: 'liverpool' },
      { id: 1010, name: 'Chelsea', logoUrl: 'https://media.api-sports.io/football/teams/49.png', slug: 'chelsea' },
      { id: 1011, name: 'West Ham', logoUrl: 'https://media.api-sports.io/football/teams/48.png', slug: 'west-ham' },
      { id: 1012, name: 'Sunderland', logoUrl: 'https://media.api-sports.io/football/teams/746.png', slug: 'sunderland' },
      { id: 1013, name: 'Newcastle United', logoUrl: 'https://media.api-sports.io/football/teams/34.png', slug: 'newcastle-united' },
      { id: 1014, name: 'Aston Villa', logoUrl: 'https://media.api-sports.io/football/teams/66.png', slug: 'aston-villa' },
      { id: 1015, name: 'Fulham', logoUrl: 'https://media.api-sports.io/football/teams/36.png', slug: 'fulham' },
      { id: 1016, name: 'Brighton', logoUrl: 'https://media.api-sports.io/football/teams/51.png', slug: 'brighton' },
      { id: 1017, name: 'Nottingham Forest', logoUrl: 'https://media.api-sports.io/football/teams/65.png', slug: 'nottingham-forest' },
      { id: 1018, name: 'Brentford', logoUrl: 'https://media.api-sports.io/football/teams/55.png', slug: 'brentford' },
      { id: 1019, name: 'Leeds', logoUrl: 'https://media.api-sports.io/football/teams/63.png', slug: 'leeds' },
    ]
  },
  {
    league: 'Spain - La Liga',
    flagUrl: 'https://flagcdn.com/es.svg',
    teams: [
      { id: 2001, name: 'Barcelona', logoUrl: 'https://media.api-sports.io/football/teams/529.png', slug: 'fc-barcelona' },
      { id: 2002, name: 'Real Madrid', logoUrl: 'https://media.api-sports.io/football/teams/541.png', slug: 'real-madrid' },
      { id: 2003, name: 'Atlético Madrid', logoUrl: 'https://media.api-sports.io/football/teams/530.png', slug: 'atletico-madrid' },
      { id: 2004, name: 'Real Sociedad', logoUrl: 'https://media.api-sports.io/football/teams/548.png', slug: 'real-sociedad' },
      { id: 2005, name: 'Villarreal', logoUrl: 'https://media.api-sports.io/football/teams/533.png', slug: 'villarreal' },
    ]
  },
  {
    league: 'Italy - Serie A',
    flagUrl: 'https://flagcdn.com/it.svg',
    teams: [
      { id: 3001, name: 'Juventus', logoUrl: 'https://media.api-sports.io/football/teams/496.png', slug: 'juventus' },
      { id: 3002, name: 'Inter Milan', logoUrl: 'https://media.api-sports.io/football/teams/505.png', slug: 'inter-milan' },
      { id: 3003, name: 'AC Milan', logoUrl: 'https://media.api-sports.io/football/teams/489.png', slug: 'ac-milan' },
      { id: 3004, name: 'Napoli', logoUrl: 'https://media.api-sports.io/football/teams/492.png', slug: 'napoli' },
      { id: 3005, name: 'AS Roma', logoUrl: 'https://media.api-sports.io/football/teams/497.png', slug: 'as-roma' },
    ]
  },
  {
    league: 'Germany - Bundesliga',
    flagUrl: 'https://flagcdn.com/de.svg',
    teams: [
      { id: 4001, name: 'Bayern München', logoUrl: 'https://media.api-sports.io/football/teams/157.png', slug: 'bayern-munich' },
      { id: 4002, name: 'Borussia Dortmund', logoUrl: 'https://media.api-sports.io/football/teams/165.png', slug: 'borussia-dortmund' },
      { id: 4003, name: 'RB Leipzig', logoUrl: 'https://media.api-sports.io/football/teams/173.png', slug: 'rb-leipzig' },
      { id: 4004, name: 'Bayer Leverkusen', logoUrl: 'https://media.api-sports.io/football/teams/168.png', slug: 'bayer-leverkusen' },
    ]
  }
];

export default function TeamsDirectory() {
  const [openLeagues, setOpenLeagues] = useState<string[]>(['England - Premier League']);

  const toggleLeague = (league: string) => {
    setOpenLeagues(prev => 
      prev.includes(league) ? prev.filter(l => l !== league) : [...prev, league]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-slate-800">Football Teams Statistics for All Countries</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-1">
        <div className="flex flex-col gap-2">
          {teamGroups.map((group) => (
            <div key={group.league} className="flex flex-col">
              <button 
                onClick={() => toggleLeague(group.league)}
                className="w-full flex items-center justify-between p-4 bg-[#E2E1FF]/40 hover:bg-[#E2E1FF]/60 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded shadow-sm overflow-hidden flex items-center justify-center bg-white border border-slate-100">
                    {group.flagUrl && <img src={group.flagUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-sm font-black text-slate-700">{group.league}</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform ${openLeagues.includes(group.league) ? '' : 'rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
                </svg>
              </button>

              {openLeagues.includes(group.league) && (
                <div className="divide-y divide-slate-50 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {group.teams.map((team) => (
                    <div key={team.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-all rounded-xl cursor-pointer">
                      <div className="flex items-center gap-4">
                        <button className="text-slate-300 hover:text-brand-pink transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                           </svg>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                          <img src={team.logoUrl} alt="" className="w-5 h-5 object-contain" />
                        </div>
                        <Link href={`/team/${team.slug}`} className="text-sm font-bold text-slate-600 group-hover:text-brand-indigo transition-colors">
                          {team.name}
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
      </div>
    </div>
  );
}
