'use client';

import { useRouter } from 'next/navigation';

interface DateOption {
  dayName: string;
  dayMonth: string;
  dateStr: string;
  isActive: boolean;
}

export default function PredictionDateSelector({ selectedDate }: { selectedDate?: string }) {
  const router = useRouter();
  
  // Generate 7 days around today
  const dates: DateOption[] = [];
  const today = new Date();
  
  // Start from 2 days ago to 4 days ahead
  for (let i = -2; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    
    dates.push({
      dayName: isToday ? 'TODAY' : d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
      dayMonth: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      dateStr,
      isActive: selectedDate === dateStr || (isToday && !selectedDate)
    });
  }

  const handleDateClick = (dateStr: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('date', dateStr);
    router.push(url.pathname + url.search);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-hide">
      {dates.map((date) => (
        <button
          key={date.dateStr}
          onClick={() => handleDateClick(date.dateStr)}
          className={`flex flex-col items-center justify-center min-w-[90px] sm:min-w-[120px] py-3 sm:py-4 rounded-xl border-2 transition-all ${
            date.isActive
              ? 'bg-brand-indigo border-brand-indigo text-white shadow-lg shadow-brand-indigo/20'
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
          }`}
        >
          <span className={`text-[9px] sm:text-[11px] font-black tracking-widest ${date.isActive ? 'text-white/80' : 'text-slate-400'}`}>
            {date.dayName}
          </span>
          <span className="text-xs sm:text-sm font-bold mt-0.5 sm:mt-1">
            {date.dayMonth}
          </span>
        </button>
      ))}
    </div>
  );
}
