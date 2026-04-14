import { Metadata } from 'next';
import Link from 'next/link';
import { getHotStats } from '@/lib/api/insights';
import HotStatsMain from '@/components/statistics/HotStatsMain';

interface SearchParams {
  market?: string;
  date?: string;
  sort?: string;
  league?: string;
}

const heroTitles: Record<string, string> = {
  'btts': 'Best Football Matches to Bet on in Both Teams to Score Today',
  'over25': 'Best Matches for Over 2.5 Goals Predictions',
  'team-over15': 'High Scoring Potential: Team Over 1.5 Goals',
  'ht-over15': 'Half-Time Goals: Top Matches for Over 1.5 Goals',
  'over95-corners': 'Elite Corner Statistics: Over 9.5 Corners Predictions',
  'over45-team-corners': 'Individual Team Excellence: Over 4.5 Team Corners',
  'both-halves-score': 'Consistent Pressure: Team to Score in Both Halves',
  'over45-cards': 'Card Trends: Matches with High Discipline Potential',
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const market = searchParams.market || 'btts';
  const title = heroTitles[market] || heroTitles['btts'];
  return {
    title: `${title} | Oddins Odds`,
    description: `Expert statistical analysis for ${market.replace('-', ' ')} markets. View high-probability match patterns and betting opportunities backed by historical data.`,
  };
}

export default async function HotStatsPage({ searchParams }: { searchParams: SearchParams }) {
  const market = searchParams.market || 'btts';
  const selectedDate = searchParams.date || 'today';
  const sortBy = searchParams.sort || 'prob_high';
  const selectedLeague = searchParams.league || 'all';

  const today = new Date();
  const targetDate = new Date();
  
  if (selectedDate === 'tomorrow') {
    targetDate.setDate(today.getDate() + 1);
  } else if (selectedDate === 'after-tomorrow') {
    targetDate.setDate(today.getDate() + 2);
  }
  
  const dateStr = targetDate.toISOString().split('T')[0];

  // Fetch initial data from Server
  const response = await getHotStats(market, dateStr, sortBy, selectedLeague, 1, 12).catch(() => ({ matches: [], total: 0, leagues: [] }));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner w-fit">
        <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
        <span className="text-slate-200">/</span>
        <Link href="/statistics" className="hover:text-brand-emerald transition-colors">Statistics</Link>
        <span className="text-slate-200">/</span>
        <span className="text-brand-emerald text-sm normal-case font-black tracking-normal">Hot Stats</span>
      </div>

      <HotStatsMain 
        initialMatches={response.matches || []}
        initialLeagues={response.leagues || []}
        initialMarket={market}
        initialDate={selectedDate}
        initialTotal={response.total || 0}
      />
    </div>
  );
}
