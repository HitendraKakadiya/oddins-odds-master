import { api, type Prediction, getStreams } from '@/lib/api';
import CompactPredictionCard from '@/components/CompactPredictionCard';
import FeaturedPredictionCard from '@/components/FeaturedPredictionCard';
import PredictionDateSelector from '@/components/PredictionDateSelector';
import Sidebar from '@/components/Sidebar';
import PredictionsListContainer from '@/components/PredictionsListContainer';
import Link from 'next/link';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface SearchParams {
  date?: string;
  region?: string;
  leagueSlug?: string;
  marketKey?: string;
  page?: string;
}

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;
  const selectedDate = searchParams.date || new Date().toISOString().split('T')[0];

  // Fetch data in parallel from Live API
  const [predictionsData, leaguesData, featuredTipsData, streamsRes] = await Promise.all([
    api.predictions.getLivePredictions(selectedDate).catch(() => ({ page: 1, pageSize, total: 0, items: [] })),
    api.leagues.getLiveLeagues(1, 100, selectedDate).catch(() => ({ items: [], total: 0 })),
    api.predictions.getLiveFeaturedTips(selectedDate).catch(() => ({ tips: [] })),
    api.streams.getLiveStreams(selectedDate).catch(() => ({ items: [], total: 0 }))
  ]);

  const predictions = predictionsData.items || [];

  // Use featured tips first, then top 2 from current day
  const featuredPredictions = (featuredTipsData.tips && featuredTipsData.tips.length > 0)
    ? featuredTipsData.tips.slice(0, 2)
    : predictions.slice(0, 2);

  // Format streams for Sidebar
  const sidebarStreams = (streamsRes.items || []).map((item: any) => ({
    id: item.matchId,
    home: item.homeTeam?.name || 'Home',
    away: item.awayTeam?.name || 'Away',
    time: item.kickoffAt && new Date(item.kickoffAt) > new Date() ? 
      new Date(item.kickoffAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) : 
      'LIVE',
    icon: '⚽'
  }));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Page Heading & Breadcrumb */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner">
              <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
              <span className="text-slate-200">/</span>
              <span className="text-brand-emerald">Predictions</span>
            </div>
            <h1 className="text-3xl font-black text-brand-midnight mb-8 leading-tight">
              Today&apos;s Football Predictions | Betting Tips For {selectedDate}
            </h1>
          </div>

          <PredictionDateSelector selectedDate={searchParams.date} />

          {/* Featured Predictions Section */}
          <div className="mb-8">
             <div className="bg-brand-emerald rounded-[32px] overflow-hidden shadow-xl shadow-brand-emerald/10 mb-8 border border-brand-emerald/5">
                <div className="flex items-center justify-center gap-3 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
                   <div className="p-1.5 bg-brand-emerald rounded-lg shadow-lg shadow-brand-emerald/20">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                   </div>
                   <h2 className="text-sm font-black text-white uppercase tracking-widest">Featured Predictions</h2>
                </div>
                
                <div className="p-6 lg:p-10 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredPredictions.map((prediction: any) => (
                      <FeaturedPredictionCard key={prediction.matchId} prediction={prediction} />
                    ))}
                  </div>
                </div>
             </div>
          </div>

          {/* All Predictions List */}
          <PredictionsListContainer 
            initialPredictions={predictions}
            initialPage={page}
            initialTotal={predictionsData.total}
            pageSize={pageSize}
            date={searchParams.date}
            region={searchParams.region}
            leagueSlug={searchParams.leagueSlug}
            marketKey={searchParams.marketKey}
          />

          {/* SEO Content Section */}
          <article className="mt-12 mb-16">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-12">
               <div className="prose prose-slate max-w-none text-slate-600">
                  <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">OddinsOdds Has the Best Football Predictions for Today</h2>
                  <div className="space-y-6 text-lg leading-relaxed">
                     <p>Looking for accurate football tips? <strong>OddinsOdds</strong> provides reliable, data-driven predictions to help you make smarter bets. Get free insights across popular markets, including <strong>1x2, over/under, handicaps, double chance, cards, and corners</strong>.</p>
                     <p>Our experts analyze statistics, team performance, and market data to provide you with the most informed football tips for today&apos;s matches. Whether you&apos;re looking for major leagues or international competitions, <strong>OddinsOdds</strong> covers over 400 tournaments worldwide.</p>
                  </div>

                  <div className="mt-16 pt-16 border-t border-slate-50">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Discover the Most Popular Football Markets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-lg leading-relaxed">
                      <div>
                        <h4 className="font-black text-slate-800 mb-2">1&times;2 Predictions</h4>
                        <p>Predicting the match winner or a draw remains the most popular way to bet. We provide detailed Win/Draw/Loss probabilities for every match.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-2">Over/Under Goals</h4>
                        <p>Our analysts review scoring trends and defensive stats to provide accurate goal predictions for total match goals.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-2">Both Teams to Score (BTTS)</h4>
                        <p>A simple but effective market where we analyze offensive and defensive consistency to predict if both sides will find the net.</p>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-2">Corner & Card Tips</h4>
                        <p>Beyond standard results, we offer insights into playstyles that lead to higher frequencies of corners and disciplinary actions.</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </article>
        </main>

        {/* Sidebar */}
        <Sidebar 
          leagueData={Array.isArray(leaguesData) ? leaguesData : (leaguesData.items || [])} 
          initialTotal={Array.isArray(leaguesData) ? 0 : (leaguesData.total || 0)}
          featuredTips={featuredPredictions.slice(0, 3)} 
          mode="predictions"
          date={selectedDate}
        />
      </div>
    </div>
  );
}
