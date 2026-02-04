import { getLeagues } from '@/lib/api';
import Link from 'next/link';

// ISR: Revalidate every 6 hours
export const revalidate = 21600;

export default async function LeaguesPage() {
  const leaguesData = await getLeagues().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Football Leagues</h1>
        <p className="text-lg text-gray-600">
          Browse leagues from around the world
        </p>
      </div>

      {/* Leagues by Country */}
      <div className="space-y-8">
        {leaguesData.map((group: any) => (
          <div key={group.country.name} className="card">
            {/* Country Header */}
            <div className="flex items-center space-x-3 mb-6">
              {group.country.flagUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={group.country.flagUrl}
                  alt={group.country.name}
                  className="w-8 h-6 object-cover rounded"
                />
              )}
              <h2 className="text-2xl font-bold text-gray-900">{group.country.name}</h2>
            </div>

            {/* Leagues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.leagues.map((league: any) => (
                <Link
                  key={league.id}
                  href={`/league/${group.country.name.toLowerCase()}/${league.slug}`}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {league.logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={league.logoUrl}
                      alt={league.name}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{league.name}</h3>
                    {league.type && (
                      <span className="text-sm text-gray-500">{league.type}</span>
                    )}
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {leaguesData.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No leagues available</p>
        </div>
      )}
    </div>
  );
}
