'use client';

import { useState } from 'react';
import type { Prediction, PredictionsResponse } from '@/lib/api/types';
import CompactPredictionCard from './CompactPredictionCard';
import { api } from '@/lib/api';

interface PredictionsListContainerProps {
  initialPredictions: Prediction[];
  initialPage: number;
  initialTotal: number;
  pageSize: number;
  date?: string;
  region?: string;
  leagueSlug?: string;
  marketKey?: string;
}

export default function PredictionsListContainer({
  initialPredictions,
  initialPage,
  initialTotal,
  pageSize,
  date,
  region,
  leagueSlug,
  marketKey,
}: PredictionsListContainerProps) {
  const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || predictions.length >= total) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await api.predictions.getLivePredictions(
        date,
        nextPage,
        pageSize
      );

      if (response && response.items) {
        setPredictions((prev) => [...prev, ...response.items]);
        setPage(nextPage);
        setTotal(response.total);
      }
    } catch (error) {
      console.error('Failed to load more predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = predictions.length < total;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-10">
      <div className="divide-y divide-slate-100">
        {predictions.map((prediction) => (
          <CompactPredictionCard 
            key={prediction.id || prediction.matchId || Math.random()} 
            prediction={prediction as any} 
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center">
          <button 
            onClick={loadMore}
            disabled={loading}
            className="bg-white text-brand-indigo border-2 border-brand-indigo/10 hover:border-brand-indigo px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-brand-indigo/5 shadow-lg shadow-brand-indigo/5 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              'See more predictions'
            )}
          </button>
        </div>
      )}

      {!hasMore && predictions.length > 0 && (
        <div className="p-6 border-t border-slate-50 bg-slate-50/10 flex justify-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            You&apos;ve reached the end of the predictions
          </p>
        </div>
      )}
    </div>
  );
}
