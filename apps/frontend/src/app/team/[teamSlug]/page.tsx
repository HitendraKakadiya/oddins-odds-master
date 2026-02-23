import { getTeamDetail, type MatchData } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Link from 'next/link';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

interface PageProps {
  params: {
    teamSlug: string;
  };
}

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'fixtures', label: 'Fixtures' },
  { key: 'results', label: 'Results' },
  { key: 'stats', label: 'Stats' },
  { key: 'corners', label: 'Corners' },
  { key: 'cards', label: 'Cards' },
];

export default async function TeamDetailPage({ params }: PageProps) {
  const teamData = await getTeamDetail(params.teamSlug);

  if (!teamData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">Team not found</p>
        </div>
      </div>
    );
  }

  const { team, nextMatch, recentMatches, statsSummary } = teamData;

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
            <span className="border-b-2 border-primary-600 py-4 px-1 text-sm font-medium text-primary-600">
              Overview
            </span>
            {tabs.slice(1).map((tab) => (
              <Link
                key={tab.key}
                href={`/team/${params.teamSlug}/${tab.key}`}
                className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Stats Summary */}
      {statsSummary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{statsSummary.wins}</div>
              <div className="text-sm text-gray-600 mt-1">Wins</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-gray-600">{statsSummary.draws}</div>
              <div className="text-sm text-gray-600 mt-1">Draws</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-600">{statsSummary.losses}</div>
              <div className="text-sm text-gray-600 mt-1">Losses</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600">{statsSummary.goalsScored}</div>
              <div className="text-sm text-gray-600 mt-1">Goals For</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-orange-600">{statsSummary.goalsConceded}</div>
              <div className="text-sm text-gray-600 mt-1">Goals Against</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{statsSummary.cleanSheets}</div>
              <div className="text-sm text-gray-600 mt-1">Clean Sheets</div>
            </div>
          </div>
        </section>
      )}

      {/* Next Match */}
      {nextMatch && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Match</h2>
          <div className="max-w-md">
            <MatchCard match={nextMatch} />
          </div>
        </section>
      )}

      {/* Recent Matches */}
      {recentMatches && recentMatches.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Matches</h2>
            <Link href={`/team/${params.teamSlug}/results`} className="text-primary-600 hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMatches.slice(0, 6).map((match: MatchData) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
