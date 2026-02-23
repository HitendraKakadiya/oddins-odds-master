import { getLeagueDetail, type StandingsRow, type MatchData, type FAQItem } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Link from 'next/link';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

interface PageProps {
  params: {
    country: string;
    leagueSlug: string;
  };
}

export default async function LeagueDetailPage({ params }: PageProps) {
  const leagueData = await getLeagueDetail(params.country, params.leagueSlug);

  if (!leagueData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">League not found</p>
        </div>
      </div>
    );
  }

  const { league, season, standings, fixtures, results, statsSummary, faq } = leagueData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* League Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {league.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={league.logoUrl} alt={league.name} className="w-20 h-20 object-contain" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{league.name}</h1>
            <p className="text-lg text-gray-600">
              {league.country.name} • {season.year} Season
            </p>
          </div>
        </div>
      </div>

      {/* Standings Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Standings</h2>
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Team</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">P</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">W</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">D</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">L</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">GF</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">GA</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">GD</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row: StandingsRow) => (
                <tr key={row.team.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm">{row.rank}</td>
                  <td className="py-3 px-2">
                    <Link href={`/team/${row.team.slug}`} className="flex items-center space-x-2 hover:text-primary-600">
                      {row.team.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.team.logoUrl} alt="" className="w-6 h-6 object-contain" />
                      )}
                      <span className="font-medium">{row.team.name}</span>
                    </Link>
                  </td>
                  <td className="text-center py-3 px-2 text-sm">{row.played}</td>
                  <td className="text-center py-3 px-2 text-sm">{row.wins}</td>
                  <td className="text-center py-3 px-2 text-sm">{row.draws}</td>
                  <td className="text-center py-3 px-2 text-sm">{row.losses}</td>
                  <td className="text-center py-3 px-2 text-sm">{row.gf}</td>
                  <td className="text-center py-3 px-2 text-sm">{row.ga}</td>
                  <td className="text-center py-3 px-2 text-sm">{row.gf - row.ga}</td>
                  <td className="text-center py-3 px-2 text-sm font-bold">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Summary */}
      {statsSummary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">League Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsSummary.goalsAvg && (
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600">{statsSummary.goalsAvg}</div>
                <div className="text-sm text-gray-600 mt-1">Goals per Game</div>
              </div>
            )}
            {statsSummary.cornersAvg && (
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600">{statsSummary.cornersAvg}</div>
                <div className="text-sm text-gray-600 mt-1">Corners per Game</div>
              </div>
            )}
            {statsSummary.cardsAvg && (
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600">{statsSummary.cardsAvg}</div>
                <div className="text-sm text-gray-600 mt-1">Cards per Game</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Fixtures */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Fixtures</h2>
        </div>
        {fixtures.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No upcoming fixtures</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fixtures.slice(0, 6).map((match: MatchData) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Results */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Results</h2>
        {results.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No recent results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.slice(0, 6).map((match: MatchData) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item: FAQItem, index: number) => (
              <div key={index} className="card">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
