'use client';

import { useRef, useState } from 'react';

export type FilterType = 
  | '1X2' | 'Over 1.5' | 'Over 2.5' | 'Under 2.5' | 'Under 3.5' | 'Under 4.5' 
  | 'Win Either Halves' | 'Double Chance' | 'Both Teams to Score' | 'Sure 2 Odds' 
  | 'Over 9.5 Corners' | 'Under 9.5 Corners' | 'Correct Score' | 'HT/FT' | 'DNB' | 'Handicap' | 'Draw';

export function MatchFilter({ leagues = [] }: { leagues?: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const selectedLeague = searchParams.get('leagueId') || '';
  const selectedMarket = searchParams.get('market') || '';
  const selectedMinOdds = searchParams.get('minOdds') || '';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const filters: FilterType[] = [
    '1X2', 'Double Chance', 'Both Teams to Score', 'Sure 2 Odds', 
    'Over 2.5', 'Under 2.5', 'Over 1.5', 'Correct Score', 
    'HT/FT', 'DNB', 'Handicap', 'Draw', 'Over 9.5 Corners', 'Under 9.5 Corners'
  ];

  const handleFilterClick = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedMarket === filter) {
      params.delete('market');
    } else {
      params.set('market', filter);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val) {
      params.set('leagueId', val);
    } else {
      params.delete('leagueId');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOddsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val) {
      params.set('minOdds', val);
    } else {
      params.delete('minOdds');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Flatten leagues from country groups
  const allLeagues = leagues.flatMap(group => group.leagues || []);

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="relative bg-slate-50/40 rounded-[24px] p-4 border border-slate-100/80">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide select-none"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-5 py-2.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                selectedMarket === filter 
                  ? 'bg-brand-indigo border-brand-indigo text-white shadow-brand-indigo/20' 
                  : 'bg-white border-slate-200/60 text-slate-500 hover:border-brand-indigo hover:text-brand-indigo'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Dynamic grey scrollbar track */}
        <div className="flex items-center gap-4 px-2 mt-1">
          <button 
            onClick={() => scrollBy(-200)}
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex-1 h-1 bg-slate-100 rounded-full relative overflow-hidden">
             <div 
               className="absolute top-0 bottom-0 w-1/4 bg-slate-300 rounded-full transition-transform duration-75"
               style={{ 
                 left: `${scrollProgress * 0.75}%` 
               }}
             ></div>
          </div>

          <button 
            onClick={() => scrollBy(200)}
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-[220px]">
          <select 
            value={selectedLeague}
            onChange={handleLeagueChange}
            className="w-full bg-white border border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 appearance-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/5 outline-none transition-all shadow-sm"
          >
            <option value="">All Leagues</option>
            {allLeagues.map((league: any) => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative flex-1 max-w-[220px]">
          <select 
            value={selectedMinOdds}
            onChange={handleOddsChange}
            className="w-full bg-white border border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 appearance-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/5 outline-none transition-all shadow-sm"
          >
            <option value="">All Odds</option>
            <option value="1.5">Odds &gt; 1.5</option>
            <option value="2.0">Odds &gt; 2.0</option>
            <option value="3.0">Odds &gt; 3.0</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function DateSelector({ selectedDate }: { selectedDate?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const today = new Date();
  const days = [];

  const activeDate = selectedDate || today.toISOString().split('T')[0];

  for (let i = -3; i <= 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    let label = '';
    if (i === -1) label = 'YESTERDAY';
    else if (i === 0) label = 'TODAY';
    else if (i === 1) label = 'TOMORROW';
    else label = date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();

    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    
    // Fix: Use local date instead of UTC to avoid timezone offset issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fullDate = `${year}-${month}-${day}`;
    
    days.push({
      label,
      date: dateStr,
      fullDate,
      active: fullDate === activeDate,
    });
  }

  const handleDateClick = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', date);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-10 overflow-x-auto scrollbar-hide">
      {days.map((day) => (
        <button
          key={day.fullDate}
          onClick={() => handleDateClick(day.fullDate)}
          className={`flex-1 min-w-[100px] flex flex-col items-center py-5 px-3 transition-all border-r border-slate-100 last:border-0 ${
            day.active 
              ? 'bg-brand-indigo text-white shadow-lg pointer-events-none' 
              : 'hover:bg-slate-50 active:scale-95'
          }`}
        >
          <span className={`text-[9px] uppercase font-black mb-1.5 tracking-widest ${day.active ? 'text-white/70' : 'text-slate-400'}`}>
            {day.label}
          </span>
          <span className="text-sm font-black whitespace-nowrap tracking-tight">{day.date}</span>
        </button>
      ))}
    </div>
  );
}
