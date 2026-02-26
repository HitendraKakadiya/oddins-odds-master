import { getMatchDetail, api } from '@/lib/api';
import PredictionHero from '@/components/predictions/PredictionHero';
import PredictionAnalysis from '@/components/predictions/PredictionAnalysis';
import TeamPreviewDetail from '@/components/predictions/TeamPreviewDetail';
import H2HComparison from '@/components/predictions/H2HComparison';
import { WatchBanner } from '@/components/predictions/AdditionalInfo';
import PredictionStickySidebar from '@/components/predictions/PredictionStickySidebar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PredictionDetailPage({ params }: PageProps) {
  const matchId = parseInt(params.id, 10);

  if (isNaN(matchId)) {
    return notFound();
  }

  // Fetch data in parallel from Live API
  const [matchData, predictionDetail, todayPredictionsRes] = await Promise.all([
    api.matches.getLiveMatchDetail(matchId).catch(() => null),
    api.predictions.getLivePredictions(new Date().toISOString().split('T')[0]).catch(() => ({ items: [] })), // Use list as fallback prediction detail for now if needed, though getLiveMatchDetail returns full details
    api.predictions.getLivePredictions(new Date().toISOString().split('T')[0], 1, 5).catch(() => ({ items: [] }))
  ]);

  if (!matchData || !matchData.match) {
    return notFound();
  }

  const { match, stats, predictions: livePredictions, h2h } = matchData;
  const predictions = (livePredictions && livePredictions.length > 0) ? livePredictions : (predictionDetail as any).predictions || [];
  const todayPredictions = todayPredictionsRes.items || [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
       {/* Hero Section */}
       <PredictionHero match={match as any} />

       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="flex flex-col lg:flex-row gap-8">
             {/* Main Content */}
             <main className="flex-1 min-w-0 bg-white rounded-[40px] shadow-sm border border-slate-100 p-6 md:p-12">
                <div className="flex flex-col gap-16">
                   {/* Breadcrumb, Title, Intro & Predictions */}
                   <PredictionAnalysis 
                     match={match} 
                     predictions={predictions || []} 
                   />

                   {/* Home Team Preview */}
                   {stats?.home && (
                      <TeamPreviewDetail 
                         teamName={match.homeTeam.name}
                         leagueName={match.league.name}
                         stats={stats.home.overall}
                         recentMatches={stats.home.recentMatchesDetailed as any || []}
                         isHome={true}
                      />
                   )}

                   {/* Away Team Preview */}
                   {stats?.away && (
                      <TeamPreviewDetail 
                         teamName={match.awayTeam.name}
                         leagueName={match.league.name}
                         stats={stats.away.overall}
                         recentMatches={stats.away.recentMatchesDetailed as any || []}
                         isHome={false}
                      />
                   )}

                   {/* H2H Comparison */}
                   {stats?.home && stats?.away && (
                      <H2HComparison 
                         homeTeam={match.homeTeam as any}
                         awayTeam={match.awayTeam as any}
                         homeStats={stats.home}
                         awayStats={stats.away}
                         h2hMatches={matchData.h2h || []}
                      />
                   )}

                   {/* Watch Banner */}
                   <WatchBanner match={match} />
                </div>
             </main>

             {/* Sidebar */}
             <PredictionStickySidebar 
                mainPrediction={predictions?.[0]} 
                todayPredictions={todayPredictions} 
             />
          </div>
       </div>

    </div>
  );
}
