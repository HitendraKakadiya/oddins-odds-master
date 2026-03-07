'use client';

interface MatchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'Summary', label: 'Summary' },
  { id: 'Statistics', label: 'Statistics' },
  { id: 'Form', label: 'Form' },
  { id: 'Head to Head', label: 'Head to Head' },
  { id: 'Standings', label: 'Standings' }
];

export default function MatchTabs({ activeTab, onTabChange }: MatchTabsProps) {
  return (
    <div className="flex items-center gap-8 md:gap-12 mb-8 md:mb-10 px-4 overflow-x-auto no-scrollbar border-b border-slate-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-4 text-xs md:text-[13px] font-black transition-all relative whitespace-nowrap uppercase tracking-widest ${
            activeTab === tab.id
              ? 'text-brand-emerald'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-emerald rounded-t-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
          )}
        </button>
      ))}
    </div>
  );
}
