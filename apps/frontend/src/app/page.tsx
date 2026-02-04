import Link from 'next/link';
import { getTodayMatches, getFeaturedTips, getLeagues } from '@/lib/api';
import MatchCard from '@/components/MatchCard';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch data in parallel
  const [matchesData, tipsData, leaguesData] = await Promise.all([
    getTodayMatches(today).catch(() => ({ date: today, matches: [] })),
    getFeaturedTips(today).catch(() => ({ date: today, tips: [] })),
    getLeagues().catch(() => []),
  ]);

  const matches = matchesData.matches || [];
  const tips = tipsData.tips || [];
  const leagues = leaguesData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Oddins Odds
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Expert football predictions, betting tips, and odds analysis
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/predictions" className="btn-primary">
            View Predictions
          </Link>
          <Link href="/academy" className="btn-secondary">
            Learn Betting
          </Link>
        </div>
      </section>

      {/* Today&apos;s Matches */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Matches</h2>
          <Link href="/predictions" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {matches.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No matches scheduled for today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 6).map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Tips */}
      {tips.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.slice(0, 4).map((tip) => (
              <Link
                key={tip.id}
                href={`/match/${tip.matchId}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{tip.title}</h3>
                  {tip.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>
                {tip.shortReason && (
                  <p className="text-gray-600 text-sm mb-3">{tip.shortReason}</p>
                )}
                {tip.confidence && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${tip.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{tip.confidence}%</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Leagues */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Top Football Leagues</h2>
          <Link href="/leagues" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {leagues.slice(0, 6).flatMap((group) =>
            group.leagues.slice(0, 1).map((league) => (
              <Link
                key={league.id}
                href={`/league/${group.country.name.toLowerCase()}/${league.slug}`}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                {league.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={league.logoUrl}
                    alt={league.name}
                    className="w-16 h-16 object-contain mx-auto mb-3"
                  />
                )}
                <h3 className="font-semibold text-sm">{league.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{group.country.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Win More Bets?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of users who trust our expert predictions
        </p>
        <Link href="/pricing" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
          View Pricing Plans
        </Link>
      </section>
    </div>
  );
}
