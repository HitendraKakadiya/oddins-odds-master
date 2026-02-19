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
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-2 mb-8 flex items-center gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-8 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
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
