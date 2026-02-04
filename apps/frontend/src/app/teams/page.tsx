import { getTeams, getLeagues } from '@/lib/api';
import TeamSearchForm from '@/components/TeamSearchForm';
import Link from 'next/link';

// ISR: Revalidate every 6 hours
export const revalidate = 21600;

interface SearchParams {
  query?: string;
  leagueSlug?: string;
}

export default async function TeamsPage({ searchParams }: { searchParams: SearchParams }) {
  const teams = await getTeams(searchParams.query, searchParams.leagueSlug).catch(() => []);
  const leaguesData = await getLeagues().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Football Teams</h1>
        <p className="text-lg text-gray-600">Search and explore teams from around the world</p>
      </div>

      {/* Search & Filters */}
      <TeamSearchForm 
        initialQuery={searchParams.query}
        initialLeagueSlug={searchParams.leagueSlug}
        leagues={leaguesData}
      />

      {/* Active Filters */}
      {(searchParams.query || searchParams.leagueSlug) && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchParams.query && (
            <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              &quot;{searchParams.query}&quot;
            </span>
          )}
          {searchParams.leagueSlug && (
            <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              League: {searchParams.leagueSlug}
            </span>
          )}
          <Link href="/teams" className="text-sm text-primary-600 hover:underline ml-2">
            Clear all
          </Link>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {teams.length > 0 ? `Found ${teams.length} teams` : 'No teams found'}
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No teams found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teams.map((team: any) => (
            <Link
              key={team.id}
              href={`/team/${team.slug}`}
              className="card hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              {team.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="w-20 h-20 object-contain mb-4"
                />
              )}
              <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
