'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LeagueGroup } from './MatchCard';
import { getTodayMatches } from '@/lib/api';
import type { MatchData } from '@/lib/api';

interface MatchListInfiniteProps {
  initialMatches: MatchData[];
  initialPage: number;
  initialTotal: number;
  selectedDate: string;
  leagueId?: string;
  market?: string;
  minOdds?: string;
}

export default function MatchListInfinite({
  initialMatches,
  initialPage,
  initialTotal,
  selectedDate,
  leagueId,
  market,
  minOdds
}: MatchListInfiniteProps) {
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMatches.length < initialTotal);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  // Group matches by league
  const getGroupedMatches = (matchesToGroup: MatchData[]) => {
    return matchesToGroup.reduce((acc: Array<{ leagueName: string; country: string; matches: MatchData[] }>, match) => {
      if (!match?.league?.name) return acc;
      
      const leagueName = match.league.name;
      const existingGroup = acc.find(g => g.leagueName === leagueName);

      if (existingGroup) {
        existingGroup.matches.push(match);
      } else {
        acc.push({
          leagueName,
          country: match.league.country?.name || 'Unknown',
          matches: [match]
        });
      }
      return acc;
    }, []);
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await getTodayMatches(selectedDate, nextPage, 20, leagueId, market, minOdds);
      
      if (response && response.matches) {
        setMatches(prev => [...prev, ...response.matches]);
        setPage(nextPage);
        setTotal(response.total);
        setHasMore((matches.length + response.matches.length) < response.total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more matches:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, selectedDate, leagueId, market, minOdds, matches.length]);

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

  // Reset state when date or filters change (handled by parent)
  useEffect(() => {
    setMatches(initialMatches);
    setPage(initialPage);
    setTotal(initialTotal);
    setHasMore(initialMatches.length < initialTotal);
  }, [initialMatches, initialPage, initialTotal, selectedDate, leagueId, market, minOdds]);

  const groupedMatches = getGroupedMatches(matches);

  return (
    <div className="space-y-6">
      {groupedMatches.length > 0 ? (
        groupedMatches.map((group, index) => (
          <LeagueGroup 
            key={`${group.leagueName}-${index}`}
            leagueName={group.leagueName}
            country={group.country}
            matches={group.matches}
            initialOpen={index < 5}
          />
        ))
      ) : (
        <div className="card text-center py-12">
           <p className="text-gray-500">No matches found for today.</p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loaderRef} className="py-8 flex justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin"></div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading more matches...</p>
          </div>
        )}
        {!hasMore && matches.length > 0 && (
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest">You&apos;ve reached the end</p>
        )}
      </div>
    </div>
  );
}
