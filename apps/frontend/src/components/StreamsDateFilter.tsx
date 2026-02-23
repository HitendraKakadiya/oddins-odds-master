'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StreamsDateFilterProps {
  initialDate: string;
}

export default function StreamsDateFilter({ initialDate }: StreamsDateFilterProps) {
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(initialDate);

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

  const handleDateClick = (value: string) => {
    setActiveDate(value);
    router.push(`/streams${value === 'live' ? '' : `?date=${value}`}`);
  };

  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8 bg-white rounded-2xl border border-slate-200/60 p-1.5 sm:p-2 shadow-sm overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-1 sm:gap-2">
        {dates.map((date) => (
          <button
            key={date.value}
            onClick={() => handleDateClick(date.value)}
            className={`flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px] py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition-all ${
              activeDate === date.value
                ? 'bg-[#E8E8FF] text-brand-indigo ring-1 ring-brand-indigo/20'
                : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {date.value === 'live' && (
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mb-1 ${activeDate === 'live' ? 'bg-brand-indigo' : 'bg-slate-300'}`}></div>
            )}
            <span className="text-[9px] sm:text-[10px] font-black tracking-wider leading-none mb-0.5 sm:mb-1">{date.label}</span>
            {date.subLabel && <span className="text-[10px] sm:text-[11px] font-bold">{date.subLabel}</span>}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4 ml-4">
        <button className="p-2 rounded-full border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <div className="relative group">
          <select 
            className="appearance-none bg-slate-50 border border-slate-100 px-4 py-2 pr-10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-brand-indigo/10 cursor-pointer transition-all hover:bg-slate-100"
          >
            <option value="important">Most Important</option>
            <option value="favourite">Most Favourite</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

