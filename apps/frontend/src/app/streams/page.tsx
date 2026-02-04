import { getStreams } from '@/lib/api';
import StreamsDateFilter from '@/components/StreamsDateFilter';
import Link from 'next/link';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

interface SearchParams {
  date?: string;
  region?: string;
}

export default async function StreamsPage({ searchParams }: { searchParams: SearchParams }) {
  const today = new Date().toISOString().split('T')[0];
  const date = searchParams.date || today;

  const streamsData = await getStreams(date, searchParams.region).catch(() => ({ date, items: [] }));
  const items = streamsData.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Where to Watch</h1>
        <p className="text-lg text-gray-600">
          Find official streaming channels for live football matches
        </p>
      </div>

      {/* Date Filter */}
      <StreamsDateFilter initialDate={date} />

      {/* Streams List */}
      {items.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No streaming info available for this date</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item: any, index: number) => (
            <div key={index} className="card">
              {/* League */}
              <div className="text-sm text-gray-600 mb-3">{item.league.name}</div>

              {/* Match Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {item.homeTeam.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.homeTeam.logoUrl} alt="" className="w-8 h-8 object-contain" />
                      )}
                      <span className="font-semibold text-lg">{item.homeTeam.name}</span>
                    </div>
                    <span className="text-gray-500">vs</span>
                    <div className="flex items-center space-x-2">
                      {item.awayTeam.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.awayTeam.logoUrl} alt="" className="w-8 h-8 object-contain" />
                      )}
                      <span className="font-semibold text-lg">{item.awayTeam.name}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(item.kickoffAt).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                <Link href={`/match/${item.matchId}`} className="btn-secondary ml-4">
                  Match Details
                </Link>
              </div>

              {/* Where to Watch Links */}
              {item.whereToWatch && item.whereToWatch.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Available on:</div>
                  <div className="flex flex-wrap gap-2">
                    {item.whereToWatch.map((channel: any, idx: number) => (
                      <a
                        key={idx}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        {channel.name} →
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
