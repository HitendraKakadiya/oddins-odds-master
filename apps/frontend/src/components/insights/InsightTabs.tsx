import React from 'react';

interface InsightTabsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function InsightTabs({ selectedDate, onDateChange }: InsightTabsProps) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const tabs = [
    { label: 'Yesterday', value: yesterday },
    { label: 'Today', value: today },
    { label: 'Tomorrow', value: tomorrow },
  ];

  return (
    <div className="flex items-center gap-2 mb-10 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-100 shadow-inner">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onDateChange(tab.value)}
          className={`
            px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-200
            ${selectedDate === tab.value 
              ? 'bg-white text-brand-emerald shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
