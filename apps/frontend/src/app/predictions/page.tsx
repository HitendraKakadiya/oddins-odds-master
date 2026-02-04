import { getPredictions, getLeagues } from '@/lib/api';
import PredictionCard from '@/components/PredictionCard';
import PredictionFilters from '@/components/PredictionFilters';
import Link from 'next/link';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface SearchParams {
  date?: string;
  region?: string;
  leagueSlug?: string;
  marketKey?: string;
  page?: string;
}

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;

  // Fetch predictions with filters
  const predictionsData = await getPredictions({
    date: searchParams.date,
    region: searchParams.region,
    leagueSlug: searchParams.leagueSlug,
    marketKey: searchParams.marketKey,
    page,
    pageSize,
  }).catch(() => ({ page: 1, pageSize, total: 0, items: [] }));

  // Fetch leagues for filter
  const leaguesData = await getLeagues().catch(() => []);

  const predictions = predictionsData.items || [];
  const total = predictionsData.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Build query string helper
  const buildQueryString = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const str = query.toString();
    return str ? `?${str}` : '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Football Predictions</h1>
        <p className="text-lg text-gray-600">
          Expert predictions powered by advanced analytics and machine learning
        </p>
      </div>

      {/* Filters */}
      <PredictionFilters searchParams={searchParams} leagues={leaguesData} />

      {/* Active Filters Display */}
      {(searchParams.marketKey || searchParams.leagueSlug || searchParams.date) && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchParams.marketKey && (
            <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              Market: {searchParams.marketKey}
            </span>
          )}
          {searchParams.leagueSlug && (
            <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              League: {searchParams.leagueSlug}
            </span>
          )}
          {searchParams.date && (
            <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              Date: {searchParams.date}
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {predictions.length} of {total} predictions
      </div>

      {/* Predictions Grid */}
      {predictions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No predictions found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {predictions.map((prediction: any) => (
            <PredictionCard key={`${prediction.matchId}-${prediction.marketKey}`} prediction={prediction} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          {page > 1 && (
            <Link
              href={`/predictions${buildQueryString({ ...searchParams, page: (page - 1).toString() })}`}
              className="btn-secondary"
            >
              Previous
            </Link>
          )}
          
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Link
                  key={pageNum}
                  href={`/predictions${buildQueryString({ ...searchParams, page: pageNum.toString() })}`}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    pageNum === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          {page < totalPages && (
            <Link
              href={`/predictions${buildQueryString({ ...searchParams, page: (page + 1).toString() })}`}
              className="btn-secondary"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
