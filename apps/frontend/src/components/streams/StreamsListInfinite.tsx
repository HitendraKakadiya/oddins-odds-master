'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import StreamsLeagueGroup from '../StreamsLeagueGroup';
import { api, type StreamItem } from '@/lib/api';

interface StreamsListInfiniteProps {
  initialMatches: StreamItem[];
  initialPage: number;
  initialTotal: number;
  selectedDate: string;
  region?: string;
  search?: string;
  sort?: string;
}

export default function StreamsListInfinite({
  initialMatches,
  initialPage,
  initialTotal,
  selectedDate,
  region,
  search,
  sort
}: StreamsListInfiniteProps) {
  const [matches, setMatches] = useState<StreamItem[]>(initialMatches);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMatches.length < initialTotal);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  // Sync state with initial props when they change (e.g. date filter change)
  useEffect(() => {
    setMatches(initialMatches);
    setPage(initialPage);
    setHasMore(initialMatches.length < initialTotal);
  }, [initialMatches, initialPage, initialTotal, selectedDate, region, search, sort]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await api.streams.getStreams(region, selectedDate, nextPage, 20, search, sort);
      
      if (response && response.items) {
        setMatches(prev => [...prev, ...response.items]);
        setPage(nextPage);
        setHasMore((matches.length + response.items.length) < response.total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more streams:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, region, selectedDate, matches.length, search, sort]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  // Grouping logic moved here for client-side state
  const groupedStreams = matches.reduce((acc: Record<number, { league: StreamItem['league']; matches: StreamItem[] }>, item: StreamItem) => {
    const leagueId = item.league.id;
    if (!acc[leagueId]) {
      acc[leagueId] = {
        league: item.league,
        matches: []
      };
    }
    acc[leagueId].matches.push(item);
    return acc;
  }, {});

  const groupedList = Object.values(groupedStreams);

  return (
    <div className="space-y-6">
      {groupedList.map((group) => (
        <StreamsLeagueGroup 
          key={group.league.id} 
          league={group.league} 
          matches={group.matches} 
          date={selectedDate}
        />
      ))}

      {/* Infinite Scroll Trigger */}
      <div ref={loaderRef} className="py-8 flex justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-brand-emerald/20 border-t-brand-emerald rounded-full animate-spin"></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading more matches...</p>
          </div>
        )}
        {!hasMore && matches.length > 0 && (
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">You&apos;ve reached the end of today&apos;s streams</p>
          </div>
        )}
      </div>
    </div>
  );
}
