'use client';

import React, { useState, useEffect } from 'react';
import StatSidebar from '@/components/statistics/StatSidebar';
import StatHero from '@/components/statistics/StatHero';
import HotStatList from '@/components/statistics/HotStatList';
import Link from 'next/link';
import { getHotStats } from '@/lib/api/insights';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { HotStatMatch } from '@/lib/api/types';

export default function HotStatsPage() {
  const [activeMarket, setActiveMarket] = useState('btts');
  const [selectedDate, setSelectedDate] = useState('today');
  const [matches, setMatches] = useState<HotStatMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const heroTitles: Record<string, string> = {
    'btts': 'Best Football Matches to Bet on in Both Teams to Score Today',
    'over25': 'Best Matches for Over 2.5 Goals Predictions',
    'team-over15': 'High Scoring Potential: Team Over 1.5 Goals',
    'ht-over15': 'Half-Time Goals: Top Matches for Over 1.5 Goals',
    'over95-corners': 'Elite Corner Statistics: Over 9.5 Corners Predictions',
    'over45-team-corners': 'Individual Team Excellence: Over 4.5 Team Corners',
    'both-halves-score': 'Consistent Pressure: Team to Score in Both Halves',
    'over45-cards': 'Card Trends: Matches with High Discipline Potential',
  };

  const heroDescriptions: Record<string, string> = {
    'btts': 'List of matches in probability order showing the football matches you should bet on in the Both Teams to Score today. Matches with the best odds on each of the main sports betting markets.',
    'over25': 'Check out the games with the highest goal-scoring potential for over 2.5 goals. Our statistical engine identifies match-ups where both attacks are likely to dominate.',
    'team-over15': 'We have identified matches where one of the teams has a very high probability of scoring 2 or more goals based on their recent offensive efficiency.',
    'ht-over15': 'Fast-paced matches with early goal potential. These selections follow high-probability patterns for early game action.',
    'over95-corners': 'Statistical analysis of corner trends. These matches show high volume in wing play and set-piece frequency.',
    'over45-team-corners': 'Focusing on teams that consistently generate high corner volume through aggressive wing-play and set-piece pressure.',
    'both-halves-score': 'Identifying teams with sustained offensive pressure that likely find the net in both 45-minute periods.',
    'over45-cards': 'Matches expected to be high-intensity with a history of disciplinary action and strict refereeing trends.',
  };

  const [sortBy, setSortBy] = useState('prob_high');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [leagues, setLeagues] = useState<Array<{ id: number; name: string }>>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset page and matches when filters change
  useEffect(() => {
    setPage(1);
    setMatches([]);
    setHasMore(true);
  }, [activeMarket, selectedDate, sortBy, selectedLeague]);

  useEffect(() => {
    async function fetchStats() {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      
      setError(null);
      try {
        const today = new Date();
        const targetDate = new Date();
        
        if (selectedDate === 'tomorrow') {
          targetDate.setDate(today.getDate() + 1);
        } else if (selectedDate === 'after-tomorrow') {
          targetDate.setDate(today.getDate() + 2);
        }
        
        const dateStr = targetDate.toISOString().split('T')[0];
        const response = await getHotStats(activeMarket, dateStr, sortBy, selectedLeague, page, 12);
        
        const newMatches = response.matches || [];
        setMatches(prev => {
          const next = page === 1 ? newMatches : [...prev, ...newMatches];
          const totalSoFar = (page === 1 ? 0 : prev.length) + newMatches.length;
          setHasMore(newMatches.length === 12 && totalSoFar < response.total);
          return next;
        });
        
        // Update available leagues if the selection is 'all'
        if (selectedLeague === 'all' && page === 1) {
          setLeagues(response.leagues || []);
        }
      } catch (err) {
        console.error('Failed to fetch hot stats:', err);
        setError('Failed to load statistical data. Please try again later.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }

    fetchStats();
  }, [activeMarket, selectedDate, sortBy, selectedLeague, page]);

  const getDayLabel = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    if (daysAhead === 0) return 'Today';
    if (daysAhead === 1) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFullDateLabel = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner w-fit">
        <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
        <span className="text-slate-200">/</span>
        <Link href="/statistics" className="hover:text-brand-emerald transition-colors">Statistics</Link>
        <span className="text-slate-200">/</span>
        <span className="text-brand-emerald text-sm normal-case font-black tracking-normal">Hot Stats</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <StatSidebar 
          activeMarket={activeMarket} 
          onMarketChange={(id) => setActiveMarket(id)} 
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <StatHero 
            title={heroTitles[activeMarket] || heroTitles['btts']} 
            description={heroDescriptions[activeMarket] || heroDescriptions['btts']} 
          />

          {/* Date Tabs */}
          <div className="bg-slate-50/50 p-2 rounded-[28px] border border-slate-100 mb-8 flex items-center w-fit overflow-x-auto">
            <button 
              onClick={() => setSelectedDate('today')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col items-center gap-0.5 ${
                selectedDate === 'today' ? 'bg-white text-brand-emerald shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Today
              <span className="text-[9px] opacity-60 normal-case font-medium">{getFullDateLabel(0)}</span>
            </button>
            <button 
              onClick={() => setSelectedDate('tomorrow')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col items-center gap-0.5 ${
                selectedDate === 'tomorrow' ? 'bg-white text-brand-emerald shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Tomorrow
              <span className="text-[9px] opacity-60 normal-case font-medium">{getFullDateLabel(1)}</span>
            </button>
            <button 
              onClick={() => setSelectedDate('after-tomorrow')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col items-center gap-0.5 ${
                selectedDate === 'after-tomorrow' ? 'bg-white text-brand-emerald shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {getDayLabel(2)}
              <span className="text-[9px] opacity-60 normal-case font-medium">{getFullDateLabel(2)}</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <FiRefreshCw className="w-12 h-12 text-brand-emerald animate-spin mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Analyzing Match Data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[40px] border border-red-100">
              <FiAlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-black text-red-900 mb-2">Something went wrong</h3>
              <p className="text-red-500 font-medium text-center max-w-xs">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-8 py-3 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-50 transition-all"
              >
                Retry Fetch
              </button>
            </div>
          ) : (
            <HotStatList 
              initialMatches={matches} 
              sortBy={sortBy}
              onSortChange={(val) => setSortBy(val)}
              leagues={leagues}
              selectedLeague={selectedLeague}
              onLeagueChange={(id) => setSelectedLeague(id)}
              hasMore={hasMore}
              onLoadMore={() => setPage(prev => prev + 1)}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* Bottom Info Section */}
          <section className="mt-20">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-14">
               <div className="prose prose-slate max-w-none">
                  <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">More About Hot Stats</h2>
                  <div className="text-slate-500 font-medium text-lg leading-relaxed space-y-6">
                    <p>Are you looking for the best stats to make your sports betting predictions today? Check our hot stats. We have filtered the best opportunities so that you can go straight to the point in analyzing football matches to make your bets for today. Make sure you start your analysis here, and your sports bets will not only be more accurate, but also you will be much more efficient.</p>
                    <p>Our algorithm analyzes thousands of matches every day to identify statistical anomalies and high-probability outcomes. By focusing on &quot;Hot Stats&quot;, you&apos;re looking at patterns that have consistent backing in recent performance data.</p>
                  </div>
               </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
