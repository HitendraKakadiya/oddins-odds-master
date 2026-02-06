'use client';

import { useRef, useState } from 'react';

export type FilterType = 
  | '1X2' | 'Over 1.5' | 'Over 2.5' | 'Under 2.5' | 'Under 3.5' | 'Under 4.5' 
  | 'Win Either Halves' | 'Double Chance' | 'Both Teams to Score' | 'Sure 2 Odds' 
  | 'Over 9.5 Corners' | 'Under 9.5 Corners' | 'Correct Score' | 'HT/FT' | 'DNB' | 'Handicap' | 'Draw';

export function MatchFilter() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const filters: FilterType[] = [
    '1X2', 'Double Chance', 'Both Teams to Score', 'Sure 2 Odds', 
    'Over 2.5', 'Under 2.5', 'Over 1.5', 'Correct Score', 
    'HT/FT', 'DNB', 'Handicap', 'Draw', 'Over 9.5 Corners', 'Under 9.5 Corners'
  ];

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
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200/60 text-[11px] font-bold text-slate-500 whitespace-nowrap hover:border-brand-indigo hover:text-brand-indigo transition-all shadow-sm active:scale-95"
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
          <select className="w-full bg-white border border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 appearance-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/5 outline-none transition-all shadow-sm">
            <option>All Leagues</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative flex-1 max-w-[220px]">
          <select className="w-full bg-white border border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 appearance-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/5 outline-none transition-all shadow-sm">
            <option>All Odds</option>
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

export function DateSelector() {
  const days = [
    { label: 'SUN', date: '01 Feb' },
    { label: 'MON', date: '02 Feb' },
    { label: 'YESTERDAY', date: '03 Feb' },
    { label: 'TODAY', date: '04 Feb', active: true },
    { label: 'TOMORROW', date: '05 Feb' },
    { label: 'FRI', date: '06 Feb' },
    { label: 'SAT', date: '07 Feb' },
  ];

  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-10">
      {days.map((day) => (
        <button
          key={day.date}
          className={`flex-1 flex flex-col items-center py-5 px-3 transition-all border-r border-slate-100 last:border-0 ${
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
