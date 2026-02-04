'use client';

import { useRouter } from 'next/navigation';

interface PredictionFiltersProps {
  searchParams: {
    marketKey?: string;
    leagueSlug?: string;
    date?: string;
  };
  leagues: Array<{
    country: { name: string };
    leagues: Array<{ id: number; slug: string; name: string }>;
  }>;
}

export default function PredictionFilters({ searchParams, leagues }: PredictionFiltersProps) {
  const router = useRouter();

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const str = query.toString();
    return str ? `?${str}` : '';
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = { ...searchParams, [key]: value, page: '1' };
    if (!value) delete params[key];
    router.push(`/predictions${buildQueryString(params)}`);
  };

  return (
    <div className="card mb-8">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Market Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchParams.marketKey || ''}
            onChange={(e) => handleFilterChange('marketKey', e.target.value)}
          >
            <option value="">All Markets</option>
            <option value="FT_1X2">Match Winner</option>
            <option value="OU_GOALS">Over/Under Goals</option>
            <option value="BTTS">Both Teams to Score</option>
            <option value="OU_CORNERS">Over/Under Corners</option>
            <option value="OU_CARDS">Over/Under Cards</option>
          </select>
        </div>

        {/* League Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">League</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchParams.leagueSlug || ''}
            onChange={(e) => handleFilterChange('leagueSlug', e.target.value)}
          >
            <option value="">All Leagues</option>
            {leagues.flatMap((group) =>
              group.leagues.map((league) => (
                <option key={league.id} value={league.slug}>
                  {league.name} ({group.country.name})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchParams.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => router.push('/predictions')}
            className="w-full btn-secondary text-center"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

