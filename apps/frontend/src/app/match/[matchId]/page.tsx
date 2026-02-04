import { getMatchDetail } from '@/lib/api';
import PredictionCard from '@/components/PredictionCard';
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
  const matchData = await getMatchDetail(matchId);

  if (!matchData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">Match not found</p>
        </div>
      </div>
    );
  }

  const { match, oddsLatest, predictions, h2h, whereToWatch } = matchData;
  const kickoffTime = new Date(match.kickoffAt);
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FT';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Match Header */}
      <div className="card mb-8">
        {/* League Info */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/league/${match.league.country.name.toLowerCase()}/${match.league.slug}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
            {match.league.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.league.logoUrl} alt="" className="w-6 h-6 object-contain" />
            )}
            <span className="font-medium">{match.league.name}</span>
          </Link>
          <div className="text-sm text-gray-600">
            {kickoffTime.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Teams & Score */}
        <div className="grid grid-cols-7 gap-4 items-center mb-4">
          {/* Home Team */}
          <div className="col-span-3 flex items-center justify-end space-x-3">
            <Link href={`/team/${match.homeTeam.slug}`} className="text-right hover:text-primary-600">
              <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
            </Link>
            {match.homeTeam.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.homeTeam.logoUrl} alt="" className="w-16 h-16 object-contain" />
            )}
          </div>

          {/* Score/Status */}
          <div className="col-span-1 text-center">
            {isFinished || isLive ? (
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {match.score.home} - {match.score.away}
                </div>
                {isLive && (
                  <div className="text-sm text-red-500 font-bold animate-pulse mt-1">
                    LIVE {match.elapsed}&apos;
                  </div>
                )}
                {isFinished && (
                  <div className="text-sm text-gray-500 mt-1">Full Time</div>
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">vs</div>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-3 flex items-center space-x-3">
            {match.awayTeam.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.awayTeam.logoUrl} alt="" className="w-16 h-16 object-contain" />
            )}
            <Link href={`/team/${match.awayTeam.slug}`} className="hover:text-primary-600">
              <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
            </Link>
          </div>
        </div>

        {/* Match Status Badge */}
        <div className="text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
            isLive ? 'bg-red-100 text-red-800' :
            isFinished ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {match.status}
          </span>
        </div>
      </div>

      {/* Where to Watch */}
      {whereToWatch && whereToWatch.length > 0 && (
        <section className="mb-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📺 Where to Watch</h2>
            <div className="flex flex-wrap gap-3">
              {whereToWatch.map((channel: any, index: number) => (
                <a
                  key={index}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {channel.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Odds */}
      {oddsLatest && (
        <section className="mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Latest Odds</h2>
              <span className="text-sm text-gray-500">
                From {oddsLatest.bookmaker.name} • Updated {new Date(oddsLatest.capturedAt).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {oddsLatest.markets.map((market: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">{market.marketKey}</div>
                  {market.selection && (
                    <div className="font-medium text-gray-900 text-sm mb-1">{market.selection}</div>
                  )}
                  <div className="text-lg font-bold text-primary-600">{market.oddValue.toFixed(2)}</div>
                  {market.impliedProb && (
                    <div className="text-xs text-gray-500">{(market.impliedProb * 100).toFixed(0)}%</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Predictions */}
      {predictions && predictions.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Our Predictions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((prediction: any, index: number) => (
              <PredictionCard key={index} prediction={prediction} />
            ))}
          </div>
        </section>
      )}

      {/* Head to Head */}
      {h2h && h2h.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Head to Head</h2>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Competition</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Home</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Away</th>
                </tr>
              </thead>
              <tbody>
                {h2h.map((match: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{new Date(match.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{match.competition}</td>
                    <td className="py-3 px-4 text-sm font-medium">{match.homeTeam}</td>
                    <td className="py-3 px-4 text-sm text-center font-bold">
                      {match.homeScore} - {match.awayScore}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{match.awayTeam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
