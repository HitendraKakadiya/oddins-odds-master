import { getTeamDetail, getTeamTab, type MatchData, type TabItem } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Link from 'next/link';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

interface PageProps {
  params: {
    teamSlug: string;
    tab: 'fixtures' | 'results' | 'stats' | 'corners' | 'cards';
  };
}

const tabs = [
  { key: 'overview', label: 'Overview', href: '' },
  { key: 'fixtures', label: 'Fixtures', href: '/fixtures' },
  { key: 'results', label: 'Results', href: '/results' },
  { key: 'stats', label: 'Stats', href: '/stats' },
  { key: 'corners', label: 'Corners', href: '/corners' },
  { key: 'cards', label: 'Cards', href: '/cards' },
];

export default async function TeamTabPage({ params }: PageProps) {
  const [teamData, tabData] = await Promise.all([
    getTeamDetail(params.teamSlug),
    getTeamTab(params.teamSlug, params.tab),
  ]);

  if (!teamData || !tabData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">Data not found</p>
        </div>
      </div>
    );
  }

  const { team } = teamData;
  const { items } = tabData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Team Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-6 mb-6">
          {team.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={team.logoUrl} alt={team.name} className="w-24 h-24 object-contain" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{team.name}</h1>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const href = tab.href ? `/team/${params.teamSlug}${tab.href}` : `/team/${params.teamSlug}`;
              const isActive = tab.key === params.tab || (tab.key === 'overview' && !params.tab);

              return (
                <Link
                  key={tab.key}
                  href={href}
                  className={`border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{params.tab}</h2>

        {/* For fixtures and results, show match cards */}
        {(params.tab === 'fixtures' || params.tab === 'results') && (
          <>
            {items.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">No {params.tab} available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((match: MatchData) => (
                  <MatchCard key={match.matchId} match={match} />
                ))}
              </div>
            )}
          </>
        )}

        {/* For stats, corners, cards - show table */}
        {(params.tab === 'stats' || params.tab === 'corners' || params.tab === 'cards') && (
          <>
            {items.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">No {params.tab} data available</p>
              </div>
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Match</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">League</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: TabItem, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(item.kickoffAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {item.homeTeamName} vs {item.awayTeamName}
                        </td>
                        <td className="py-3 px-4 text-sm">{item.leagueName}</td>
                        <td className="py-3 px-4 text-sm">
                          <pre className="text-xs text-gray-600">{JSON.stringify(item.stats, null, 2)}</pre>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
