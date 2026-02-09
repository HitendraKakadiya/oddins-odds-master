import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { MatchFilter, DateSelector } from '@/components/MatchFilters';
import { LeagueGroup } from '@/components/MatchCard';
import FAQAccordion from '@/components/FAQAccordion';
import HighlightBanner from '@/components/HighlightBanner';
import FeaturedTeams from '@/components/FeaturedTeams';

export default async function HomePage() {
  const today = new Date().toISOString().split('T')[0];

  const leaguesData = [
    {
      country: { name: 'Europe' },
      leagues: [{ id: 1, name: 'UEFA Champions League', slug: 'champions-league' }]
    },
    {
      country: { name: 'England' },
      leagues: [{ id: 2, name: 'Premier League', slug: 'premier-league' }]
    },
    {
      country: { name: 'Spain' },
      leagues: [{ id: 3, name: 'La Liga', slug: 'la-liga' }]
    },
    {
      country: { name: 'Italy' },
      leagues: [{ id: 4, name: 'Serie A', slug: 'serie-a' }]
    },
    {
      country: { name: 'Germany' },
      leagues: [{ id: 5, name: 'Bundesliga', slug: 'bundesliga' }]
    },
    {
      country: { name: 'South America' },
      leagues: [{ id: 6, name: 'Copa Libertadores', slug: 'copa-libertadores' }]
    },
    {
      country: { name: 'International' },
      leagues: [{ id: 7, name: 'FIFA Club World Cup', slug: 'club-world-cup' }]
    },
    {
      country: { name: 'France' },
      leagues: [{ id: 8, name: 'Ligue 1', slug: 'ligue-1' }]
    }
  ];

  const tipsData = {
    tips: [
      {
        id: 1,
        matchId: 101,
        title: 'Manchester City to Win',
        leagueName: 'Premier League',
        publishedAt: new Date().toISOString()
      }
    ]
  };

  const mockMatches = [
    {
      matchId: 101,
      kickoffAt: new Date().toISOString(),
      status: 'NS',
      league: { id: 1, name: 'Premier League', slug: 'premier-league', country: { name: 'England' } },
      homeTeam: { id: 10, name: 'Manchester City', slug: 'man-city' },
      awayTeam: { id: 11, name: 'Arsenal', slug: 'arsenal' },
      score: { home: null, away: null },
      featuredTip: { id: 1001, title: 'Home Win & Over 2.5', isPremium: false }
    },
    {
      matchId: 102,
      kickoffAt: new Date().toISOString(),
      status: 'LIVE',
      league: { id: 1, name: 'Premier League', slug: 'premier-league', country: { name: 'England' } },
      homeTeam: { id: 12, name: 'Liverpool', slug: 'liverpool' },
      awayTeam: { id: 13, name: 'Chelsea', slug: 'chelsea' },
      score: { home: 1, away: 0 },
      featuredTip: { id: 1002, title: 'Next Goal: Liverpool', isPremium: true }
    },
    {
      matchId: 201,
      kickoffAt: new Date().toISOString(),
      status: 'FT',
      league: { id: 3, name: 'La Liga', slug: 'la-liga', country: { name: 'Spain' } },
      homeTeam: { id: 14, name: 'Real Madrid', slug: 'real-madrid' },
      awayTeam: { id: 15, name: 'Barcelona', slug: 'barcelona' },
      score: { home: 3, away: 2 },
      featuredTip: { id: 1003, title: 'Both Teams to Score', isPremium: false }
    },
    {
      matchId: 301,
      kickoffAt: new Date().toISOString(),
      status: 'NS',
      league: { id: 4, name: 'Serie A', slug: 'serie-a', country: { name: 'Italy' } },
      homeTeam: { id: 16, name: 'Inter', slug: 'inter' },
      awayTeam: { id: 17, name: 'Juventus', slug: 'juventus' },
      score: { home: null, away: null },
      featuredTip: { id: 1004, title: 'Under 2.5 Goals', isPremium: false }
    },
    {
      matchId: 401,
      kickoffAt: new Date().toISOString(),
      status: 'NS',
      league: { id: 5, name: 'Bundesliga', slug: 'bundesliga', country: { name: 'Germany' } },
      homeTeam: { id: 18, name: 'Bayern Munich', slug: 'bayern-munich' },
      awayTeam: { id: 19, name: 'Dortmund', slug: 'dortmund' },
      score: { home: null, away: null },
      featuredTip: { id: 1005, title: 'Bayern to Lead at HT', isPremium: true }
    }
  ];

  // Group mock matches by league
  const groupedMatches = mockMatches.reduce((acc, match) => {
    const leagueName = match.league.name;
    const existingGroup = acc.find(g => g.leagueName === leagueName);

    if (existingGroup) {
      existingGroup.matches.push(match);
    } else {
      acc.push({
        leagueName,
        country: match.league.country.name,
        matches: [match]
      });
    }
    return acc;
  }, [] as Array<{ leagueName: string; country: string; matches: typeof mockMatches }>);

  const streamsMock = [
    { id: 1, home: 'Real Madrid', away: 'Barcelona', time: 'LIVE', icon: '⚽' },
    { id: 2, home: 'Lakers', away: 'Warriors', time: '22:00', icon: '🏀' },
    { id: 3, home: 'Djokovic', away: 'Nadal', time: '23:30', icon: '🎾' },
  ];

  return (
    <div className="bg-transparent min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar 
            leagueData={leaguesData} 
            _featuredTip={tipsData.tips[0]} 
            streams={streamsMock}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark-blue mb-6 sm:mb-8 leading-tight">
              Today&apos;s Matches
            </h1>

            <MatchFilter />
            <DateSelector />

            <div className="space-y-6">
              {groupedMatches.length > 0 ? (
                groupedMatches.map((group) => (
                  <LeagueGroup 
                    key={group.leagueName}
                    leagueName={group.leagueName}
                    country={group.country}
                    matches={group.matches}
                  />
                ))
              ) : (
                <div className="card text-center py-12">
                   <p className="text-gray-500">No matches found for today. Try seeding the database!</p>
                </div>
              )}
            </div>

            {/* Featured Teams Section */}
            <FeaturedTeams />

            {/* Featured Highlight Banner */}
            <div className="mt-12">
              <HighlightBanner />
            </div>

            {/* SEO Text Content */}
            <article className="mt-12 space-y-8 sm:space-y-12">
               <div className="card !shadow-sm !border-slate-200/60 p-6 sm:!p-10">
                  <div className="prose prose-slate max-w-none text-slate-600 space-y-4 sm:space-y-6">
                     <p className="leading-relaxed text-base sm:text-lg">If you still don&apos;t know <strong>which matches are being played today in world football</strong>, this page will be your new daily football schedule. OddinsOdds is the largest free hub of statistics, predictions, broadcasts, and information about <strong>all of today&apos;s matches</strong> across <strong>more than 400 national and international</strong> competitions.</p>
                     <p className="leading-relaxed text-base sm:text-lg">If you want to track your team, keep an eye on rivals, analyse games, or bet with more confidence, our schedule of today&apos;s matches has you covered. No need to look elsewhere - all the fixtures are right here.</p>
                     <h3 className="text-slate-900 font-black text-xl sm:text-2xl mt-8 sm:mt-10">List of all today&apos;s matches</h3>
                     <p className="leading-relaxed text-base sm:text-lg">As soon as you open our website, you&apos;ll find a complete list, like a true football match schedule. This way, you can search for your favourite competition, see the kick-off time, stadium, and much more.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <section className="bg-white p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:border-slate-300 group">
                     <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4 sm:mb-5 flex items-center gap-3">
                        <span className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-indigo/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-indigo border border-brand-indigo/5 shadow-inner">📺</span>
                        Where to watch live
                     </h2>
                     <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 leading-relaxed font-medium">You don&apos;t need to search multiple websites. See where to watch each match live on TV, mobile, or betting sites.</p>
                     <Link href="/streams" className="inline-flex items-center gap-2 text-brand-indigo font-bold text-xs sm:text-sm bg-brand-light-indigo/50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-brand-light-indigo transition-all border border-brand-indigo/10 hover:scale-[1.02]">
                        Check live streams &rarr;
                     </Link>
                  </section>

                  <section className="bg-white p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:border-slate-300 group">
                     <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4 sm:mb-5 flex items-center gap-3">
                        <span className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-pink/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-pink border border-brand-pink/5 shadow-inner">📚</span>
                        Betting Academy
                     </h2>
                     <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 leading-relaxed font-medium">Learn how to bet like a pro with articles on bankroll management, value analysis, and advanced strategies.</p>
                     <Link href="/academy" className="inline-flex items-center gap-2 text-brand-pink font-bold text-xs sm:text-sm bg-brand-pink/5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-brand-pink/10 transition-all border border-brand-pink/10 hover:scale-[1.02]">
                        Start learning &rarr;
                     </Link>
                  </section>
               </div>

               <section className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:p-12 rounded-[32px] sm:rounded-[40px] text-white shadow-xl relative overflow-hidden group border border-slate-800">
                  <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">Trusted Betting Sites 2026</h2>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-lg mb-6 sm:mb-8 leading-relaxed font-medium">Technical criteria, updated bonuses, and proper licensing — we only recommend the best.</p>
                    <Link href="/betting-sites" className="btn-pink !bg-white !text-slate-900 !px-6 sm:!px-8 hover:!bg-slate-50 transition-colors border border-white/20">
                       View Rankings
                    </Link>
                  </div>
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-pink/10 rounded-full blur-[80px] group-hover:bg-brand-pink/20 transition-all"></div>
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-indigo/10 rounded-full blur-[60px] group-hover:bg-brand-indigo/20 transition-all"></div>
               </section>

               <section>
                  <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">Frequently Asked Questions</h2>
                    <div className="h-px flex-1 bg-slate-200/60"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-8 sm:mb-10 font-black uppercase tracking-[0.2em]">Common questions about today&apos;s schedule ({today})</p>
                  <FAQAccordion />
               </section>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
