import React, { useState } from 'react';
import HotStatCard from './HotStatCard';
import { FiSearch, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import { HotStatMatch } from '@/lib/api/types';

interface HotStatListProps {
  initialMatches: HotStatMatch[];
  sortBy: string;
  onSortChange: (val: string) => void;
  leagues: Array<{ id: number; name: string }>;
  selectedLeague: string;
  onLeagueChange: (id: string) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

export default function HotStatList({ 
  initialMatches, 
  sortBy, 
  onSortChange,
  leagues,
  selectedLeague,
  onLeagueChange,
  hasMore,
  onLoadMore,
  isLoadingMore
}: HotStatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLeagueOpen, setIsLeagueOpen] = useState(false);

  const filteredMatches = initialMatches
    .filter(m => 
      m.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.league.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const displayedMatches = filteredMatches;

  const sortOptions = [
    { value: 'time', label: 'Match Time' },
    { value: 'prob_high', label: 'Highest probability' },
    { value: 'prob_low', label: 'Lowest probability' },
  ];

  const currentSort = sortOptions.find(o => o.value === sortBy) || sortOptions[1];
  const currentLeague = leagues.find(l => l.id.toString() === selectedLeague) || { id: 'all', name: 'All Leagues' };

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-emerald transition-colors" />
          <input 
            type="text" 
            placeholder="Search team or competition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-brand-emerald/5 focus:border-brand-emerald transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Custom Sort Dropdown */}
          <div className="relative w-full md:w-[220px]">
            <button 
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsLeagueOpen(false);
              }}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-5 flex items-center justify-between hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-wider text-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium normal-case tracking-normal">Sort By:</span>
                <span>{currentSort.label}</span>
              </div>
              <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsSortOpen(false)}
                ></div>
                <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onSortChange(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        sortBy === opt.value 
                        ? 'bg-brand-emerald/10 text-brand-emerald' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Custom League Dropdown */}
          <div className="relative w-full md:w-[200px]">
            <button 
              onClick={() => {
                setIsLeagueOpen(!isLeagueOpen);
                setIsSortOpen(false);
              }}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-5 flex items-center justify-between hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-wider text-slate-700 shadow-sm"
            >
              <span className="truncate">{currentLeague.name}</span>
              <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isLeagueOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLeagueOpen && (
              <>
                <div 
                   className="fixed inset-0 z-10" 
                   onClick={() => setIsLeagueOpen(false)}
                ></div>
                <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        onLeagueChange('all');
                        setIsLeagueOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedLeague === 'all' 
                        ? 'bg-brand-emerald/10 text-brand-emerald' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All Leagues
                    </button>
                  {leagues.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => {
                        onLeagueChange(league.id.toString());
                        setIsLeagueOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedLeague === league.id.toString()
                        ? 'bg-brand-emerald/10 text-brand-emerald' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {league.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {displayedMatches.map((match, idx) => (
          <HotStatCard key={`${match.matchId}-${idx}`} match={match} />
        ))}
      </div>

      {/* Load More */}
      {hasMore ? (
        <div className="flex justify-center mt-12 pb-10">
          <button 
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-10 py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all transform active:scale-95 shadow-xl shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isLoadingMore ? (
              <FiRefreshCw className="w-5 h-5 animate-spin" />
            ) : null}
            {isLoadingMore ? 'LOADING MATCHES...' : 'LOAD MORE MATCHES'}
          </button>
        </div>
      ) : displayedMatches.length > 0 ? (
        <div className="flex justify-center mt-12 pb-10">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No more matches to show</p>
        </div>
      ) : null}

      {filteredMatches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
            <FiSearch className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No Matches Found</h3>
          <p className="text-slate-500 font-medium text-center max-w-xs">We couldn&apos;t find any statistical trends matching your search.</p>
        </div>
      )}
    </div>
  );
}
