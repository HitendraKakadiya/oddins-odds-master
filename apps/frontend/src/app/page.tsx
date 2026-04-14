import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { MatchFilter, DateSelector } from '@/components/MatchFilters';
import MatchListInfinite from '@/components/MatchListInfinite';
import FAQAccordion from '@/components/FAQAccordion';
import HighlightBanner from '@/components/HighlightBanner';
import FeaturedTeams from '@/components/FeaturedTeams';
import { 
  getLiveTodayMatches, 
  getLiveLeagues, 
  getLiveFeaturedTips, 
  getFeaturedTeams, 
  getLivePredictions 
} from '@/lib/api';
import type { 
  MatchData, 
  LeaguesResponse, 
  FeaturedTipsResponse, 
  Prediction,
  Team,
  PredictionsResponse
} from '@/lib/api/types';
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: { date?: string } }): Promise<Metadata> {
  const date = searchParams.date || new Date().toISOString().split('T')[0];
  return {
    title: `Football Matches Today & Betting Tips - ${date}`,
    description: `View all football matches scheduled for ${date}. Get live scores, expert predictions, and betting tips for major leagues worldwide on Oddins Odds.`,
  };
}

export default async function HomePage({ searchParams }: { searchParams: { date?: string; leagueId?: string; market?: string; minOdds?: string } }) {
  let selectedDate = searchParams.date || new Date().toISOString().split('T')[0];
  const selectedLeague = searchParams.leagueId;
  const selectedMarket = searchParams.market || '';
  const selectedMinOdds = searchParams.minOdds || '';

  // Fetch data from local database via API
  let matches: MatchData[] = [];
  let leaguesData: { items: LeaguesResponse[]; total: number; page: number; pageSize: number } = { items: [], total: 0, page: 1, pageSize: 50 };
  let tipsData: FeaturedTipsResponse['tips'] | Prediction[] = [];
  let featuredTeams: Team[] = []; 
  let pagination = { page: 1, pageSize: 20, total: 0 };
  let allPredictions: Prediction[] = [];

  try {
    const [matchesRes, leaguesRes, tipsRes, featuredRes, predictionsRes] = await Promise.all([
      getLiveTodayMatches(selectedDate, 1, 20, selectedLeague, selectedMarket, selectedMinOdds).catch(err => { console.error('Live matches fetch failed:', err); return { matches: [], total: 0, page: 1, pageSize: 20, date: selectedDate }; }),
      getLiveLeagues(1, 400, selectedDate).catch(err => { console.error('Live leagues fetch failed:', err); return { items: [], total: 0, page: 1, pageSize: 50 }; }),
      getLiveFeaturedTips(selectedDate).catch(err => { console.error('Tips fetch failed:', err); return { tips: [] }; }),
      getFeaturedTeams().catch(err => { console.error('Featured teams fetch failed:', err); return []; }),
      getLivePredictions(selectedDate, 1, 100).catch(err => { console.error('Predictions fetch failed:', err); return { items: [] }; })
    ]);

    // Smart Fallback Handling
    if (!searchParams.date && matchesRes?.date && matchesRes.date !== selectedDate) {
        selectedDate = matchesRes.date;
    }

    matches = matchesRes?.matches || [];
    pagination = { 
      page: matchesRes?.page || 1, 
      pageSize: matchesRes?.pageSize || 20, 
      total: matchesRes?.total || 0 
    };
    
    // Explicitly type leaguesData to avoid any
    leaguesData = leaguesRes as { items: LeaguesResponse[]; total: number; page: number; pageSize: number } || { items: [], total: 0, page: 1, pageSize: 20 };
    
    // Pass all predictions to MatchListInfinite for enrichment
    allPredictions = (predictionsRes as PredictionsResponse)?.items || [];
    
    // Improved autoTips mapping with strict types
    const tipsItems = allPredictions;
    const autoTips: FeaturedTipsResponse['tips'] = (tipsItems.length > 0 
      ? (tipsItems as Prediction[])
      : (matches as unknown as Prediction[])).slice(0, 3).map((item) => ({
        id: item.id || item.matchId,
        matchId: item.matchId,
        title: item.title || `${item.homeTeam?.name} vs ${item.awayTeam?.name}`,
        isPremium: item.isPremium || false,
        confidence: item.confidence || null,
        kickoffAt: item.kickoffAt || null,
        homeTeam: item.homeTeam,
        awayTeam: item.awayTeam,
        league: item.league ? {
          name: item.league.name,
          slug: item.league.slug || '',
          countryName: item.league.countryName || item.league.country?.name || 'Unknown',
          countryCode: item.league.countryCode || item.league.country?.code || null
        } : null
      }));
      
    tipsData = (tipsRes?.tips && tipsRes.tips.length > 0) ? tipsRes.tips : autoTips;
    
    featuredTeams = (featuredRes as Team[]).map(t => ({
      id: Number(t.id),
      name: String(t.name),
      slug: String(t.slug),
      logoUrl: t.logoUrl || t.logo || undefined,
      logo: t.logo || t.logoUrl || undefined,
      country: String(t.country || 'Unknown')
    }));
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="mb-10">
              <FeaturedTeams initialTeams={featuredTeams} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-brand-midnight mb-6 sm:mb-8 leading-tight">
              Today&apos;s Matches
            </h1>

            <MatchFilter leagues={leaguesData.items} />
            <DateSelector selectedDate={selectedDate} />

            <div className="space-y-6">
              <MatchListInfinite 
                initialMatches={matches}
                initialPage={pagination.page}
                initialTotal={pagination.total}
                selectedDate={selectedDate}
                leagueId={selectedLeague}
                market={selectedMarket}
                minOdds={selectedMinOdds}
                predictions={allPredictions}
              />
            </div>

            <div className="mt-12">
              <HighlightBanner />
            </div>
            <article className="mt-12 space-y-8 sm:space-y-12">
               <div className="card !shadow-sm !border-slate-200/60 p-6 sm:!p-10">
                  <div className="prose prose-slate max-w-none text-slate-600 space-y-4 sm:space-y-6">
                     <p className="leading-relaxed text-lg sm:text-xl">If you still don&apos;t know <strong>which matches are being played today in world football</strong>, this page will be your new daily football schedule. OddinsOdds is the largest free hub of statistics, predictions, broadcasts, and information about <strong>all of today&apos;s matches</strong> across <strong>more than 400 national and international</strong> competitions.</p>
                     <p className="leading-relaxed text-lg sm:text-xl">If you want to track your team, keep an eye on rivals, analyse games, or bet with more confidence, our schedule of today&apos;s matches has you covered. No need to look elsewhere - all the fixtures are right here.</p>
                     <h3 className="text-slate-900 font-black text-2xl sm:text-3xl mt-8 sm:mt-10">List of all today&apos;s matches</h3>
                     <p className="leading-relaxed text-lg sm:text-xl">As soon as you open our website, you&apos;ll find a complete list, like a true football match schedule. This way, you can search for your favourite competition, see the kick-off time, stadium, and much more.</p>
                  </div>
               </div>

               <section className="bg-gradient-to-r from-slate-900 to-slate-800 p-12 rounded-[40px] text-white shadow-xl relative overflow-hidden group border border-slate-800">
                  <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Trusted Betting Sites 2026</h2>
                    <p className="text-slate-400 text-base sm:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed font-medium">Technical criteria, updated bonuses, and proper licensing — we only recommend the best.</p>
                    <Link href="/betting-sites" className="btn-pink !bg-white !text-slate-900 !px-6 sm:!px-8 hover:!bg-slate-50 transition-colors border border-white/20">
                       View Rankings
                    </Link>
                  </div>
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-emerald/10 rounded-full blur-[80px] group-hover:bg-brand-emerald/20 transition-all"></div>
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-emerald/10 rounded-full blur-[60px] group-hover:bg-brand-emerald/20 transition-all"></div>
               </section>

               <section>
                  <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                     <h2 className="text-2xl sm:text-3xl font-black text-slate-900 whitespace-nowrap">Frequently Asked Questions</h2>
                     <div className="h-px flex-1 bg-slate-200/60"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-10 font-black uppercase tracking-[0.2em]">Common questions about today&apos;s schedule ({selectedDate})</p>
                  <FAQAccordion />
               </section>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[380px] flex-shrink-0 order-1 lg:order-2">
            <div className="sticky top-24">
              <Sidebar 
                leagueData={leaguesData.items || []} 
                initialTotal={leaguesData.total || 0}
                featuredTips={tipsData} 
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
