import { api, type StreamItem, type StreamsResponse } from '@/lib/api';
import Image from 'next/image';
import StreamsDateFilter from '@/components/StreamsDateFilter';
import StreamsLeagueGroup from '@/components/StreamsLeagueGroup';
import Sidebar from '@/components/Sidebar';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

interface SearchParams {
  date?: string;
  region?: string;
}

export default async function StreamsPage({ searchParams }: { searchParams: SearchParams }) {
  const today = new Date().toISOString().split('T')[0];
  const date = searchParams.date || today;

  const streamsData = await api.streams.getStreams(date, searchParams.region).catch(() => ({ date, items: [] }));
  const leagues = await api.leagues.getLeagues().catch(() => []);

  const mockStreams = [
    {
      matchId: 9001,
      kickoffAt: `${date}T20:00:00Z`,
      league: { id: 10, name: 'Saudi Pro League', logoUrl: 'https://img.api-football.com/leagues/307.png' },
      homeTeam: { name: 'Al Ahli', logoUrl: 'https://img.api-football.com/teams/2939.png' },
      awayTeam: { name: 'Al Hazm', logoUrl: 'https://img.api-football.com/teams/2942.png' },
    },
    {
      matchId: 9002,
      kickoffAt: `${date}T20:00:00Z`,
      league: { id: 10, name: 'Saudi Pro League' },
      homeTeam: { name: 'Al Akhdoud', logoUrl: 'https://img.api-football.com/teams/20341.png' },
      awayTeam: { name: 'Al Hilal', logoUrl: 'https://img.api-football.com/teams/2941.png' },
    },
    {
      matchId: 9101,
      kickoffAt: `${date}T20:30:00Z`,
      league: { id: 11, name: 'Egyptian Premier League', logoUrl: 'https://img.api-football.com/leagues/233.png' },
      homeTeam: { name: 'Ceramica Cleopatra', logoUrl: 'https://img.api-football.com/teams/12431.png' },
      awayTeam: { name: 'Ghazl El Mehalla', logoUrl: 'https://img.api-football.com/teams/12433.png' },
    },
    {
      matchId: 9102,
      kickoffAt: `${date}T20:30:00Z`,
      league: { id: 11, name: 'Egyptian Premier League' },
      homeTeam: { name: 'Wadi Degla', logoUrl: 'https://img.api-football.com/teams/4882.png' },
      awayTeam: { name: 'Al-Mokawloon', logoUrl: 'https://img.api-football.com/teams/4883.png' },
    },
    {
      matchId: 9201,
      kickoffAt: `${date}T21:00:00Z`,
      league: { id: 12, name: 'Liga 1', logoUrl: 'https://img.api-football.com/leagues/271.png' },
      homeTeam: { name: 'FCSB', logoUrl: 'https://img.api-football.com/teams/588.png' },
      awayTeam: { name: 'Botosani', logoUrl: 'https://img.api-football.com/teams/2347.png' },
    }
  ];

  const items = (streamsData as StreamsResponse).items?.length > 0 ? (streamsData as StreamsResponse).items : mockStreams;

  const groupedStreams = items.reduce((acc: Record<number, { league: typeof items[0]['league']; matches: typeof items }>, item: StreamItem) => {
    const leagueId = item.league.id;
    if (!acc[leagueId]) {
      acc[leagueId] = {
        league: item.league,
        matches: []
      };
    }
    acc[leagueId].matches.push(item);
    return acc;
  }, {});

  const groupedList = Object.values(groupedStreams);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar leagueData={leagues} _featuredTip={undefined} mode="predictions" />

        <div className="flex-1">
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden mb-8 min-h-[240px] sm:min-h-[300px] flex items-center p-6 sm:p-8 lg:p-12">
             <div className="absolute inset-0 z-0">
                <Image 
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
                  alt="Football stadium background" 
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-blue/90 via-brand-dark-blue/70 to-transparent"></div>
             </div>
             
             <div className="relative z-10 max-w-2xl">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                  Where to watch football live streams
                </h1>
                <p className="text-sm sm:text-lg text-slate-200 leading-relaxed font-medium">
                  Find out here how to watch football live and today and access the main players to follow the most diverse football championships around the world.
                </p>
             </div>
          </div>

          <StreamsDateFilter initialDate={date} />

          {groupedList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
              </div>
              <p className="text-slate-500 text-lg font-bold">No streaming info available for this date</p>
              <p className="text-slate-400 text-sm mt-1">Check back later for updated schedules</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedList.map((group) => (
                <StreamsLeagueGroup key={group.league.id} league={group.league} matches={group.matches} />
              ))}
            </div>
          )}

          <div className="mt-8 sm:mt-12 bg-white rounded-[24px] sm:rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-12 shadow-sm">
             <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6">Live Streams {new Date(date).toLocaleDateString('en-GB')}</h2>
             
             <div className="space-y-4 sm:space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  <strong className="text-slate-800">OddinsOdds</strong> delivers the <strong className="text-slate-800">top options for watching football live and for free</strong>. With the information on our platform, users who like to enjoy football live can know where they can watch today&apos;s games for free and follow their favourite team closely.
                </p>
                <p>
                  In addition to providing the complete list of channels that will show today&apos;s games, OddinsOdds also allows you to watch football live and online in HD on mobile devices such as cell phones, tablets and even on your computer. Everything is directly connected to our website.
                </p>
                
                <h3 className="text-base sm:text-lg font-bold text-slate-800 !mt-6 sm:!mt-8">Here are some important considerations for watching football matches in HD today:</h3>
                
                <ul className="space-y-3 sm:space-y-4 list-none !pl-0 mt-4">
                   <li className="flex gap-2 sm:gap-3">
                      <span className="text-brand-indigo font-bold shrink-0">•</span>
                      <span><strong className="text-slate-800">Website Terms and Conditions:</strong> Some bookmakers may offer live streams of sporting events, but this is generally subject to their terms and conditions. Make sure you carefully read the platform&apos;s T&Cs to understand the restrictions and requirements for free streaming.</span>
                   </li>
                   <li className="flex gap-2 sm:gap-3">
                      <span className="text-brand-indigo font-bold shrink-0">•</span>
                      <span><strong className="text-slate-800">Account creation:</strong> In many cases, you may need to create an account with a betting site and possibly deposit funds into that account to access live streams.</span>
                   </li>
                   <li className="flex gap-2 sm:gap-3">
                      <span className="text-brand-indigo font-bold shrink-0">•</span>
                      <span><strong className="text-slate-800">Local restrictions:</strong> Many betting sites have geographic restrictions that limit who can access their live streams. Depending on where you live, you may not have access to certain sporting events.</span>
                   </li>
                   <li className="flex gap-2 sm:gap-3">
                      <span className="text-brand-indigo font-bold shrink-0">•</span>
                      <span><strong className="text-slate-800">Stream Quality:</strong> Sportsbook streams quality may vary. Therefore, test different platforms to find the best option for watching football matches live for free.</span>
                   </li>
                </ul>
                
                <p className="pt-6 border-t border-slate-50 italic text-xs sm:text-sm">
                  It&apos;s worth remembering that the availability of live football streams may change, and it is important to <strong className="text-slate-800">respect the copyright</strong> and terms of use of digital streaming platforms. Always opt for legal methods to support your club and the sports industry.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
