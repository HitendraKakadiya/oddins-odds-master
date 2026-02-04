import { getPredictions, getLeagues } from '@/lib/api';
import CompactPredictionCard from '@/components/CompactPredictionCard';
import FeaturedPredictionCard from '@/components/FeaturedPredictionCard';
import PredictionDateSelector from '@/components/PredictionDateSelector';
import Sidebar from '@/components/Sidebar';
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

  // Fetch predictions with filters
  const predictionsData = await (getPredictions({
    date: searchParams.date,
    region: searchParams.region,
    leagueSlug: searchParams.leagueSlug,
    marketKey: searchParams.marketKey,
    page,
    pageSize,
  }) as Promise<any>).catch(() => ({ page: 1, pageSize, total: 0, items: [] }));

  // Fetch leagues for filter
  const leaguesData = await getLeagues().catch(() => []);

  const predictions = predictionsData.items || [];
  const total = predictionsData.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Build query string helper
  const buildQueryString = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const str = query.toString();
    return str ? `?${str}` : '';
  };

  const streamsMock = [
    { id: 1, home: 'Real Madrid', away: 'Barcelona', time: 'LIVE', icon: '⚽' },
    { id: 2, home: 'Lakers', away: 'Warriors', time: '22:00', icon: '🏀' },
    { id: 3, home: 'Djokovic', away: 'Nadal', time: '23:30', icon: '🎾' },
  ];

  const mockFeatured = [
    {
      matchId: 99901,
      kickoffAt: new Date().toISOString(),
      league: { name: 'Premier League', slug: 'england-premier-league', countryName: 'England' },
      homeTeam: { name: 'Manchester City', logoUrl: 'https://media.api-sports.io/football/teams/50.png' },
      awayTeam: { name: 'Arsenal', logoUrl: 'https://media.api-sports.io/football/teams/42.png' },
      selection: 'Home Win'
    },
    {
      matchId: 99902,
      kickoffAt: new Date().toISOString(),
      league: { name: 'La Liga', slug: 'spain-la-liga', countryName: 'Spain' },
      homeTeam: { name: 'Real Madrid', logoUrl: 'https://media.api-sports.io/football/teams/541.png' },
      awayTeam: { name: 'Barcelona', logoUrl: 'https://media.api-sports.io/football/teams/529.png' },
      selection: 'Over 2.5 Goals'
    },
    {
      matchId: 99903,
      kickoffAt: new Date().toISOString(),
      league: { name: 'Bundesliga', slug: 'germany-bundesliga', countryName: 'Germany' },
      homeTeam: { name: 'Bayern Munich', logoUrl: 'https://media.api-sports.io/football/teams/157.png' },
      awayTeam: { name: 'Dortmund', logoUrl: 'https://media.api-sports.io/football/teams/165.png' },
      selection: 'Home Win'
    },
    {
      matchId: 99904,
      kickoffAt: new Date().toISOString(),
      league: { name: 'Serie A', slug: 'italy-serie-a', countryName: 'Italy' },
      homeTeam: { name: 'Inter Milan', logoUrl: 'https://media.api-sports.io/football/teams/505.png' },
      awayTeam: { name: 'AC Milan', logoUrl: 'https://media.api-sports.io/football/teams/489.png' },
      selection: 'Both Teams To Score'
    },
    {
      matchId: 99905,
      kickoffAt: new Date().toISOString(),
      league: { name: 'Ligue 1', slug: 'france-ligue-1', countryName: 'France' },
      homeTeam: { name: 'PSG', logoUrl: 'https://media.api-sports.io/football/teams/85.png' },
      awayTeam: { name: 'Marseille', logoUrl: 'https://media.api-sports.io/football/teams/81.png' },
      selection: 'Home Win'
    },
    {
      matchId: 99906,
      kickoffAt: new Date().toISOString(),
      league: { name: 'Eredivisie', slug: 'netherlands-eredivisie', countryName: 'Netherlands' },
      homeTeam: { name: 'Ajax', logoUrl: 'https://media.api-sports.io/football/teams/194.png' },
      awayTeam: { name: 'PSV', logoUrl: 'https://media.api-sports.io/football/teams/197.png' },
      selection: 'Over 2.5 Goals'
    }
  ];

  const mockAll = [
    ...mockFeatured,
    {
      matchId: 99907,
      kickoffAt: new Date().toISOString(),
      league: { name: 'Primeira Liga', slug: 'portugal-primeira-liga', countryName: 'Portugal' },
      homeTeam: { name: 'Benfica', logoUrl: 'https://media.api-sports.io/football/teams/211.png' },
      awayTeam: { name: 'Porto', logoUrl: 'https://media.api-sports.io/football/teams/212.png' },
      selection: 'Under 3.5 Goals'
    },
    {
      matchId: 99908,
      kickoffAt: new Date().toISOString(),
      league: { name: 'MLS', slug: 'usa-mls', countryName: 'USA' },
      homeTeam: { name: 'LA Galaxy', logoUrl: 'https://media.api-sports.io/football/teams/1603.png' },
      awayTeam: { name: 'LAFC', logoUrl: 'https://media.api-sports.io/football/teams/1608.png' },
      selection: 'Home Win'
    }
  ];

  // Merge API predictions with mock data for demonstration if needed
  const displayPredictions = predictions.length > 0 ? predictions : mockAll;
  // Box only shows top 2
  const featuredPredictions = displayPredictions.slice(0, 2);
  // List shows everything else
  const listPredictions = displayPredictions.slice(2);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar 
          leagueData={leaguesData} 
          featuredTip={displayPredictions[0]} 
          streams={streamsMock}
          mode="predictions"
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Page Heading & Breadcrumb */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner">
              <Link href="/" className="hover:text-brand-indigo transition-colors">Home</Link>
              <span className="text-slate-200">/</span>
              <span className="text-brand-indigo">Predictions</span>
            </div>
            <h1 className="text-3xl font-black text-brand-dark-blue mb-8 leading-tight">
              Today&apos;s Football Predictions | Betting Tips For {searchParams.date || '04/02/2026'}
            </h1>
          </div>

          <PredictionDateSelector selectedDate={searchParams.date} />

          {/* Featured Predictions Section */}
          <div className="mb-8">
             <div className="bg-brand-indigo rounded-[32px] overflow-hidden shadow-xl shadow-brand-indigo/10 mb-8 border border-brand-indigo/5">
                <div className="flex items-center justify-center gap-3 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
                   <div className="p-1.5 bg-brand-pink rounded-lg shadow-lg shadow-brand-pink/20">
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
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-10">
            <div className="divide-y divide-slate-100">
              {listPredictions.map((prediction: any) => (
                <CompactPredictionCard key={prediction.matchId} prediction={prediction} />
              ))}
            </div>
            
            {listPredictions.length > 0 && (
              <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                <button className="bg-white text-brand-indigo border-2 border-brand-indigo/10 hover:border-brand-indigo px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-brand-indigo/5 shadow-lg shadow-brand-indigo/5">
                  See more predictions
                </button>
              </div>
            )}
          </div>

          {/* SEO Content Section */}
          <article className="mt-12 mb-16">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-12">
               <div className="prose prose-slate max-w-none text-slate-600">
                  <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">OddinsOdds Has the Best Football Predictions for Today</h2>
                  <div className="space-y-6 text-lg leading-relaxed">
                     <p>Looking for accurate football tips? <strong>OddinsOdds</strong> provides reliable, data-driven predictions to help you make smarter bets. Get free insights across popular markets, including <strong>1x2, over/under, handicaps, double chance, cards, and corners</strong>.</p>
                     <p>You&apos;ll find free football tips covering a wide range of markets... and many other betting opportunities.</p>
                  </div>

                  <div className="mt-16 pt-16 border-t border-slate-50 space-y-16">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">How to Give the Best Football Predictions for Today</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>Along with using the betting tips on our platform, it&apos;s also important to learn how to analyse matches yourself - whether you&apos;re betting on your favourite leagues or improving your football analysis skills.</p>
                        <p>For example, you can specialise in a specific league or tournament, where you follow every match of each team, watch the highlights, and know which players are in good or poor form.</p>
                        <p>By doing this consistently, step by step, you&apos;ll gradually become able to create your own football predictions for today with greater confidence and accuracy.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">OddinsOdds Betting Tips: Discover the Most Popular Football Markets</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>Find the best football betting tips for <strong>today&apos;s matches</strong>, covering the most popular markets such as 1x2, over/under, handicap, corners, and many other valuable opportunities.</p>
                        <p>We share today&apos;s football predictions, detailed statistics, team comparisons, and winning probabilities - all designed to help you bet successfully and achieve your long-awaited green.</p>
                        <p>On this main page, you&apos;ll find all upcoming fixtures along with the free football tips carefully prepared by our team of expert analysts.</p>
                        <p>Below, we&apos;ll show you how most of these betting markets work and how you can make the most of them in your daily predictions.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Today&apos;s 1&times;2 Football Predictions</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>The 1&times;2 market, also known as the moneyline, is the most popular type of sports bet. Basically, it&apos;s about predicting who will win the match - or if the game will end in a draw. If your prediction is correct, your bet is a winner.</p>
                        <p>And of course, we have a dedicated section for <strong>1&times;2 football predictions today</strong>. Enjoy it wisely and make informed decisions with every bet!</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Betting Tips on Goals: Over and Under</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>We also include total goals tips - also known as <strong>over/under betting</strong> - in our list of free football betting tips.</p>
                        <p>Our analysts review all the data, study each team&apos;s playing style, and produce accurate goal predictions indicating how many goals are likely to be scored in a match.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Corner Betting Tips</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>In addition to the most common options, we also provide corner predictions for today&apos;s football matches - identifying games that may have either a high or low number of corners.</p>
                        <p>Our experienced team analyses the most relevant data and uses deep insight to estimate the expected number of corners in each game.</p>
                        <p>In fact, <strong>betting on corners</strong> has become one of the fastest-growing trends among football bettors worldwide.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Double Chance Predictions</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>Another great option for sports betting fans is the <strong>Double Chance Betting</strong> (also known as DC or Double Hypothesis). In this type of bet, you cover two out of the three possible outcomes of a football match within a single wager - reducing your risk while maintaining solid winning potential.</p>
                        <p>Here&apos;s how it works:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><strong>1X (Home Win or Draw)</strong> - Your bet wins if the home team wins or if the match ends in a draw.</li>
                          <li><strong>X2 (Draw or Away Win)</strong> - Your bet wins if the away team wins or if the match ends in a draw.</li>
                          <li><strong>12 (Either Team to Win – No Draw)</strong> - Your bet wins if either team wins, as long as the match doesn&apos;t end in a draw.</li>
                        </ul>
                        <p>If you&apos;d like to explore this strategy further, we&apos;ve prepared a dedicated list featuring the best <strong>Double Chance predictions</strong> from matches around the world.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Both Teams to Score (BTTS) Predictions</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>The Both Teams to Score market, also known as BTTS, is one of the most popular football betting options among punters. The goal is simple: predict whether both teams in a match will score at least one goal each, regardless of who wins or what the final score is.</p>
                        <p>In practice, you only need to choose between two options:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><strong>Yes</strong>: Both teams score at least one goal.</li>
                          <li><strong>No</strong>: At least one of the teams fails to score.</li>
                        </ul>
                        <p>Check out our <strong>BTTS football tips</strong> section and take advantage of the best football betting opportunities for today.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Other Markets for Today&apos;s Football Predictions</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>Besides the markets mentioned above, we also cover a wide range of bets, including Asian handicap, half-time/full-time results, player to score, cards, and many more options.</p>
                        <p>All our football betting decisions are shared right here. Our goal is to provide you with football predictions for {searchParams.date || 'today'}, giving you a clear overview of the key data and factors to consider - so you can decide which ones matter most to your betting strategy.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Other Football Predictions for Today</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>At <strong>OddinsOdds</strong>, you&apos;ll find an exclusive section with <strong>accumulator betting tips</strong>, perfect for those looking to increase their winnings by combining several football predictions into a single betting slip.</p>
                        <p>In addition, if you&apos;re looking for a truly safe option, we also highlight the best <strong>prediction of the day</strong> - a simple single bet featuring the match with the highest probability of success on {searchParams.date || 'today'}.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Why We Share Football Tips for Today</h3>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p>We share our football predictions for today to make your betting experience simpler and more efficient, offering complete analyses of the most important matches.</p>
                        <p>Our experts carefully study statistics, team performance, and the odds provided by top bookmakers, ensuring well-founded forecasts across multiple betting markets.</p>
                        <p>Our mission is clear: to help you identify the best betting opportunities, save time, and increase your chances of success.</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
