'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface PredictionsFiltersProps {
  allLeagues: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default function PredictionsFilters({ allLeagues }: PredictionsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [leagueSlug, setLeagueSlug] = useState(searchParams.get('leagueSlug') || '');
  const [marketKey, setMarketKey] = useState(searchParams.get('marketKey') || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (leagueSlug) params.set('leagueSlug', leagueSlug);
    if (marketKey) params.set('marketKey', marketKey);
    router.push(`/predictions?${params.toString()}`);
  };

  return (
    <div className="card mb-8">
      <h2 className="text-lg font-semibold mb-4">Filter Predictions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* League Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            League
          </label>
          <select
            value={leagueSlug}
            onChange={(e) => setLeagueSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Leagues</option>
            {allLeagues.map((league) => (
              <option key={league.id} value={league.slug}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        {/* Market Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Market
          </label>
          <select
            value={marketKey}
            onChange={(e) => setMarketKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Markets</option>
            <option value="FT_1X2">Match Winner</option>
            <option value="OU_GOALS">Over/Under Goals</option>
            <option value="BTTS">Both Teams to Score</option>
            <option value="OU_CORNERS">Over/Under Corners</option>
            <option value="OU_CARDS">Over/Under Cards</option>
          </select>
        </div>

        {/* Apply Filters */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleFilter}
            className="flex-1 btn-primary"
          >
            Apply
          </button>
          <button
            onClick={() => router.push('/predictions')}
            className="flex-1 btn-secondary"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

