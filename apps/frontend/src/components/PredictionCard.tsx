import Link from 'next/link';

interface PredictionCardProps {
  prediction: {
    matchId: number;
    kickoffAt: string;
    league: {
      name: string;
      slug: string;
      countryName: string;
    };
    homeTeam: {
      id: number;
      name: string;
      slug: string;
      logoUrl?: string | null;
    };
    awayTeam: {
      id: number;
      name: string;
      slug: string;
      logoUrl?: string | null;
    };
    marketKey: string;
    line?: number | null;
    selection?: string | null;
    probability?: number | null;
    confidence?: number | null;
    shortExplanation?: string | null;
    isPremium?: boolean;
  };
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const kickoffTime = new Date(prediction.kickoffAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getMarketLabel = (key: string) => {
    const labels: Record<string, string> = {
      FT_1X2: 'Match Winner',
      OU_GOALS: 'Over/Under Goals',
      BTTS: 'Both Teams to Score',
      OU_CORNERS: 'Over/Under Corners',
      OU_CARDS: 'Over/Under Cards',
    };
    return labels[key] || key;
  };

  const getConfidenceColor = (confidence?: number | null) => {
    if (!confidence) return 'bg-gray-500';
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Link href={`/match/${prediction.matchId}`} className="card hover:shadow-lg transition-shadow">
      {/* Header: League & Time */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {prediction.league.name} • {prediction.league.countryName}
        </span>
        {prediction.isPremium && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
            Premium
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {prediction.homeTeam.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={prediction.homeTeam.logoUrl} alt="" className="w-6 h-6 object-contain" />
            )}
            <span className="font-semibold">{prediction.homeTeam.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {prediction.awayTeam.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={prediction.awayTeam.logoUrl} alt="" className="w-6 h-6 object-contain" />
            )}
            <span className="font-semibold">{prediction.awayTeam.name}</span>
          </div>
        </div>
      </div>

      {/* Prediction */}
      <div className="bg-primary-50 rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{getMarketLabel(prediction.marketKey)}</span>
          {prediction.line && (
            <span className="text-xs text-gray-500">Line: {prediction.line}</span>
          )}
        </div>
        <div className="font-bold text-lg text-primary-700">
          {prediction.selection || 'N/A'}
        </div>
        {prediction.probability && (
          <div className="text-sm text-gray-600 mt-1">
            Probability: {(prediction.probability * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Confidence Bar */}
      {prediction.confidence && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Confidence</span>
            <span className="font-semibold">{prediction.confidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${getConfidenceColor(prediction.confidence)} h-2 rounded-full transition-all`}
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>
      )}

      {/* Explanation */}
      {prediction.shortExplanation && (
        <p className="text-sm text-gray-600">{prediction.shortExplanation}</p>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Kickoff: {kickoffTime}
      </div>
    </Link>
  );
}
