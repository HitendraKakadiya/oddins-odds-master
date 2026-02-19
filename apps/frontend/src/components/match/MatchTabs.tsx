'use client';

interface MatchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'Statistics', label: 'Statistics' },
  { id: 'Form', label: 'Form' },
  { id: 'Head to Head', label: 'Head to Head' },
  { id: 'Standings', label: 'Standings' }
];

export default function MatchTabs({ activeTab, onTabChange }: MatchTabsProps) {
  return (
    <div className="bg-white rounded-[20px] md:rounded-[24px] border border-slate-100 shadow-sm p-1.5 md:p-2 mb-6 md:mb-8 flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 md:px-8 py-3 md:py-4 rounded-[14px] md:rounded-2xl text-[11px] md:text-sm font-black transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20 scale-[1.02]'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
