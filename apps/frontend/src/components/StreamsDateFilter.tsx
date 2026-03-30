'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

interface StreamsDateFilterProps {
  initialDate: string;
}

export default function StreamsDateFilter({ initialDate }: StreamsDateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeDate, setActiveDate] = useState(initialDate);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'important');

  // Sync state with URL params
  useEffect(() => {
    setActiveDate(searchParams.get('date') || initialDate);
    setSearchTerm(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'important');
  }, [searchParams, initialDate]);

  const today = new Date();
  const dates = [
    { label: 'Live', value: 'live' },
    { label: 'TODAY', subLabel: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), value: today.toISOString().split('T')[0] },
  ];

  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + i);
    const dayName = i === 1 ? 'TOMORROW' : nextDate.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
    dates.push({
      label: dayName,
      subLabel: nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      value: nextDate.toISOString().split('T')[0]
    });
  }

  const updateFilters = useCallback((newDate: string, newSearch: string, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newDate && newDate !== 'live') params.set('date', newDate); else params.delete('date');
    if (newSearch) params.set('search', newSearch); else params.delete('search');
    if (newSort && newSort !== 'important') params.set('sort', newSort); else params.delete('sort');
    
    router.push(`/streams?${params.toString()}`);
    router.refresh();
  }, [router, searchParams]);

  const handleDateClick = (value: string) => {
    setActiveDate(value);
    updateFilters(value, searchTerm, sortBy);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateFilters(activeDate, searchTerm, sortBy);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    updateFilters(activeDate, searchTerm, value);
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white rounded-[28px] border border-slate-100 p-2 shadow-xl shadow-slate-200/40">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide p-1">
        {dates.map((date) => (
          <button
            key={date.value}
            onClick={() => handleDateClick(date.value)}
            className={`flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] py-3 px-4 rounded-[22px] transition-all duration-300 relative ${
              activeDate === date.value
                ? 'bg-brand-emerald text-white shadow-lg shadow-emerald-500/20 -translate-y-0.5'
                : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {date.value === 'live' && (
              <div className="absolute top-2 right-4 flex items-center justify-center">
                 <div className={`w-1.5 h-1.5 rounded-full ${activeDate === 'live' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
              </div>
            )}
            <span className={`text-[10px] font-black tracking-widest leading-none mb-1 uppercase ${activeDate === date.value ? 'text-white/90' : ''}`}>
              {date.label}
            </span>
            {date.subLabel && <span className="text-[11px] font-black">{date.subLabel}</span>}
          </button>
        ))}
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-3 pr-4 pl-2 pb-2 lg:pb-0">
        {/* Search Input */}
        <div className="relative flex-1 max-w-[280px]">
          <input 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search teams or leagues..."
            className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-2.5 rounded-2xl text-[12px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300 shadow-inner"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Sort Dropdown */}
        <div className="relative group min-w-[160px]">
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="w-full appearance-none bg-slate-50 border border-slate-100 pl-4 pr-10 py-2.5 rounded-2xl text-[11px] font-black text-slate-600 uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer transition-all hover:bg-slate-100 shadow-sm"
          >
            <option value="important">Most Important</option>
            <option value="favourite">Most Favourite</option>
            <option value="time">By Time</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}


