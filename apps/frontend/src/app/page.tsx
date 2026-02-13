import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { MatchFilter, DateSelector } from '@/components/MatchFilters';
import MatchListInfinite from '@/components/MatchListInfinite';
import FAQAccordion from '@/components/FAQAccordion';
import HighlightBanner from '@/components/HighlightBanner';
import FeaturedTeams from '@/components/FeaturedTeams';
import { getLiveTodayMatches, getLiveLeagues, getFeaturedTips, getStreams } from '@/lib/api';

export default async function HomePage({ searchParams }: { searchParams: { date?: string } }) {
  let selectedDate = searchParams.date || new Date().toISOString().split('T')[0];

  // Fetch data from live third-party proxy APIs
  let matches: any[] = [];
  let leaguesData: any = { items: [], total: 0, page: 1, pageSize: 50 };
  let tipsData: any[] = [];
  let streamsData: any[] = [];
  let streamsTotal = 0;
  let pagination = { page: 1, pageSize: 20, total: 0 };

  try {
    const [matchesRes, leaguesRes, tipsRes, streamsRes] = await Promise.all([
      getLiveTodayMatches(selectedDate, 1, 20).catch(err => { console.error('Matches fetch failed:', err); return { matches: [], total: 0, page: 1, pageSize: 20, date: selectedDate }; }),
      getLiveLeagues(1, 20).catch(err => { console.error('Leagues fetch failed:', err); return { items: [], total: 0, page: 1, pageSize: 20 }; }),
      getFeaturedTips(selectedDate).catch(err => { console.error('Tips fetch failed:', err); return { tips: [] }; }),
      getStreams(selectedDate).catch(err => { console.error('Streams fetch failed:', err); return { items: [], total: 10 }; }) // fallback with total=0
    ]);

    // Smart Fallback Handling:
    // If user didn't request a specific date (default view), and API returned a different date (fallback),
    // update the selectedDate to reflect what we are actually showing.
    if (!searchParams.date && matchesRes?.date && matchesRes.date !== selectedDate) {
        selectedDate = matchesRes.date;
    }

    matches = matchesRes?.matches || [];
    pagination = { 
      page: matchesRes?.page || 1, 
      pageSize: matchesRes?.pageSize || 20, 
      total: matchesRes?.total || 0 
    };
    leaguesData = leaguesRes || { items: [], total: 0, page: 1, pageSize: 20 };
    tipsData = tipsRes?.tips || [];
    streamsData = streamsRes?.items || [];
    streamsTotal = streamsRes?.total || 0;
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

  // Map streams for Sidebar
  const streams = streamsData.map(item => ({
    id: item.matchId,
    home: item.homeTeam?.name || 'Home',
    away: item.awayTeam?.name || 'Away',
    time: item.kickoffAt && new Date(item.kickoffAt) > new Date() ? 
      new Date(item.kickoffAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) : 
      'LIVE',
    icon: '⚽'
  }));

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
            leagueData={leaguesData.items || []} 
            initialTotal={leaguesData.total || 0}
            featuredTips={tipsData} 
            streams={streams}
            initialStreamsTotal={streamsTotal}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <h1 className="text-3xl font-black text-brand-dark-blue mb-8 leading-tight">
              Today&apos;s Matches
            </h1>

            <MatchFilter />
            <DateSelector selectedDate={selectedDate} />

            <div className="space-y-6">
              <MatchListInfinite 
                initialMatches={matches}
                initialPage={pagination.page}
                initialTotal={pagination.total}
                selectedDate={selectedDate}
              />
            </div>

            {/* Featured Teams Section */}
            <FeaturedTeams />

            {/* Featured Highlight Banner */}
            <div className="mt-12">
              <HighlightBanner />
            </div>

            {/* SEO Text Content */}
            <article className="mt-12 space-y-12">
               <div className="card !shadow-sm !border-slate-200/60 !p-10">
                  <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                     <p className="leading-relaxed text-lg">If you still don&apos;t know <strong>which matches are being played today in world football</strong>, this page will be your new daily football schedule. OddinsOdds is the largest free hub of statistics, predictions, broadcasts, and information about <strong>all of today&apos;s matches</strong> across <strong>more than 400 national and international</strong> competitions.</p>
                     <p className="leading-relaxed text-lg">If you want to track your team, keep an eye on rivals, analyse games, or bet with more confidence, our schedule of today&apos;s matches has you covered. No need to look elsewhere - all the fixtures are right here.</p>
                     <h3 className="text-slate-900 font-black text-2xl mt-10">List of all today&apos;s matches</h3>
                     <p className="leading-relaxed text-lg">As soon as you open our website, you&apos;ll find a complete list, like a true football match schedule. This way, you can search for your favourite competition, see the kick-off time, stadium, and much more.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:border-slate-300 group">
                     <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-3">
                        <span className="w-12 h-12 bg-brand-indigo/10 rounded-2xl flex items-center justify-center text-brand-indigo border border-brand-indigo/5 shadow-inner">📺</span>
                        Where to watch live
                     </h2>
                     <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">You don&apos;t need to search multiple websites. See where to watch each match live on TV, mobile, or betting sites.</p>
                     <Link href="/streams" className="inline-flex items-center gap-2 text-brand-indigo font-bold text-sm bg-brand-light-indigo/50 px-6 py-3 rounded-xl hover:bg-brand-light-indigo transition-all border border-brand-indigo/10 hover:scale-[1.02]">
                        Check live streams &rarr;
                     </Link>
                  </section>

                  <section className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:border-slate-300 group">
                     <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-3">
                        <span className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink border border-brand-pink/5 shadow-inner">📚</span>
                        Betting Academy
                     </h2>
                     <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Learn how to bet like a pro with articles on bankroll management, value analysis, and advanced strategies.</p>
                     <Link href="/academy" className="inline-flex items-center gap-2 text-brand-pink font-bold text-sm bg-brand-pink/5 px-6 py-3 rounded-xl hover:bg-brand-pink/10 transition-all border border-brand-pink/10 hover:scale-[1.02]">
                        Start learning &rarr;
                     </Link>
                  </section>
               </div>

               <section className="bg-gradient-to-r from-slate-900 to-slate-800 p-12 rounded-[40px] text-white shadow-xl relative overflow-hidden group border border-slate-800">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-4">Trusted Betting Sites 2026</h2>
                    <p className="text-slate-400 text-sm max-w-lg mb-8 leading-relaxed font-medium">Technical criteria, updated bonuses, and proper licensing — we only recommend the best.</p>
                    <Link href="/betting-sites" className="btn-pink !bg-white !text-slate-900 !px-8 hover:!bg-slate-50 transition-colors border border-white/20">
                       View Rankings
                    </Link>
                  </div>
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-pink/10 rounded-full blur-[80px] group-hover:bg-brand-pink/20 transition-all"></div>
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-indigo/10 rounded-full blur-[60px] group-hover:bg-brand-indigo/20 transition-all"></div>
               </section>

               <section>
                  <div className="flex items-center gap-6 mb-10">
                    <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
                    <div className="h-px flex-1 bg-slate-200/60"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-10 font-black uppercase tracking-[0.2em]">Common questions about today&apos;s schedule ({selectedDate})</p>
                  <FAQAccordion />
               </section>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
