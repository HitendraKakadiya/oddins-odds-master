'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { InsightItem } from '@/lib/api/types';
import { FiTrendingUp } from 'react-icons/fi';
import InsightCard from './InsightCard';
import InsightTabs from './InsightTabs';

interface InsightListProps {
  initialInsights: InsightItem[];
  initialTotal: number;
  date: string;
}

export default function InsightList({ initialInsights, initialTotal, date }: InsightListProps) {
  const router = useRouter();
  const [insights, setInsights] = useState<InsightItem[]>(initialInsights);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialInsights.length < initialTotal);

  useEffect(() => {
    setInsights(initialInsights);
    setPage(1);
    setHasMore(initialInsights.length < initialTotal);
  }, [initialInsights, initialTotal]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await api.insights.getInsights(date, nextPage, 12);
      
      if (data.items.length > 0) {
        setInsights(prev => [...prev, ...data.items]);
        setPage(nextPage);
        setHasMore(insights.length + data.items.length < data.total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    router.push(`/insights?date=${newDate}`);
  };

  return (
    <div className="flex flex-col">
      <InsightTabs selectedDate={date} onDateChange={handleDateChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {insights.map((insight, idx) => (
          <InsightCard key={`${insight.matchId}-${idx}`} insight={insight} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-16">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-10 py-4 bg-brand-emerald text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-emerald/20 hover:bg-brand-emerald-dark hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : 'Load More'}
          </button>
        </div>
      )}

      {insights.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
             <FiTrendingUp className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2">No Insights Found</h3>
           <p className="text-slate-500 font-medium">We couldn&apos;t find any statistical trends for this date.</p>
        </div>
      )}
    </div>
  );
}
