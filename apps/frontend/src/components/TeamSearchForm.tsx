'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TeamSearchFormProps {
  initialQuery?: string;
  initialLeagueSlug?: string;
  leagues: Array<{
    country: { name: string };
    leagues: Array<{ id: number; slug: string; name: string }>;
  }>;
}

export default function TeamSearchForm({ initialQuery, initialLeagueSlug, leagues }: TeamSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || '');
  const [leagueSlug, setLeagueSlug] = useState(initialLeagueSlug || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (leagueSlug) params.set('leagueSlug', leagueSlug);
    const queryString = params.toString();
    router.push(`/teams${queryString ? `?${queryString}` : ''}`);
  };

  const handleLeagueChange = (newLeagueSlug: string) => {
    setLeagueSlug(newLeagueSlug);
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (newLeagueSlug) params.set('leagueSlug', newLeagueSlug);
    const queryString = params.toString();
    router.push(`/teams${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="card mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Teams</label>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter team name..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* League Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by League</label>
          <select
            value={leagueSlug}
            onChange={(e) => handleLeagueChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      </div>
    </div>
  );
}

