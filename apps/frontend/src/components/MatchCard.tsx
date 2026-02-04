import Link from 'next/link';

interface MatchCardProps {
  match: {
    matchId: number;
    kickoffAt: string;
    status: string;
    league: {
      name: string;
      slug: string;
      logoUrl?: string | null;
    };
    homeTeam: {
      name: string;
      slug: string;
      logoUrl?: string | null;
    };
    awayTeam: {
      name: string;
      slug: string;
      logoUrl?: string | null;
    };
    score: {
      home: number | null;
      away: number | null;
    };
    featuredTip?: {
      title: string;
      isPremium: boolean;
      confidence?: number | null;
    } | null;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const kickoffTime = new Date(match.kickoffAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isFinished = match.status === 'FT';
  const isLive = match.status === 'LIVE';

  return (
    <Link href={`/match/${match.matchId}`} className="card hover:shadow-lg transition-shadow">
      {/* League */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">{match.league.name}</span>
        {isLive && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        )}
        {isFinished && (
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            FT
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-3">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {match.homeTeam.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-8 h-8 object-contain" />
            )}
            <span className="font-semibold">{match.homeTeam.name}</span>
          </div>
          <span className="text-2xl font-bold ml-4">
            {match.score.home !== null ? match.score.home : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {match.awayTeam.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-8 h-8 object-contain" />
            )}
            <span className="font-semibold">{match.awayTeam.name}</span>
          </div>
          <span className="text-2xl font-bold ml-4">
            {match.score.away !== null ? match.score.away : '-'}
          </span>
        </div>
      </div>

      {/* Kickoff Time */}
      {!isFinished && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Kickoff: {kickoffTime}</span>
        </div>
      )}

      {/* Featured Tip */}
      {match.featuredTip && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-600">
              💡 {match.featuredTip.title}
            </span>
            {match.featuredTip.isPremium && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Premium
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

