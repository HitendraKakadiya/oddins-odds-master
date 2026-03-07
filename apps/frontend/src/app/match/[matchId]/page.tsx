import { getLiveMatchDetail, type MatchDetailResponse } from '@/lib/api';
import MatchHeader from '@/components/match/MatchHeader';
import MatchContent from '@/components/match/MatchContent';
import Link from 'next/link';

// ISR: Revalidate every 2 minutes for live updates
export const revalidate = 120;

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const matchId = parseInt(params.matchId, 10);

  let matchData: MatchDetailResponse | null = null;
  
  try {
    if (!isNaN(matchId)) {
      matchData = await getLiveMatchDetail(matchId);
    }
  } catch (error: any) {
    console.error(`Failed to fetch match ${params.matchId}:`, error);
    // If it's a real API failure (e.g. Rate Limit 429 or 500 Server Error), we MUST throw it
    // so Next.js's Data Cache doesn't mistakenly cache a 200 OK "Match not found" layout.
    if (error?.status !== 404) {
      throw error;
    }
  }

  if (!matchData || !matchData.match || !matchData.match.homeTeam) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <span className="text-4xl text-slate-300">🔎</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-4">Match not found</h1>
        <p className="text-slate-400 font-bold mb-8">We couldn't find the details for this match. It might have been postponed or removed.</p>
        <Link href="/predictions" className="bg-brand-emerald text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-brand-emerald/20 hover:scale-105 transition-transform inline-block">
          Return to Predictions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Premium Match Header */}
        <MatchHeader 
          match={matchData.match} 
          prevMatch={matchData.prevMatch}
          nextMatch={matchData.nextMatch}
          stats={matchData.stats}
        />

        {/* Tabbed Content (Statistics, Form, H2H, Standings) */}
        <MatchContent matchData={matchData} />
      </div>
    </div>
  );
}
