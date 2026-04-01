'use client';

interface StrategyTOCProps {
  sections: { id: string; title: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function StrategyTOC({ sections, activeSection, onSectionChange }: StrategyTOCProps) {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      onSectionChange(id);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
      {/* Decorative blurry circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3 relative z-10">
        <span className="w-1.5 h-6 bg-brand-emerald rounded-full"></span>
        Table of Contents
      </h3>

      <nav className="space-y-1.5 relative z-10">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`w-full text-left px-5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 flex items-center justify-between group/btn ${
              activeSection === section.id
                ? 'bg-brand-emerald text-white shadow-lg shadow-emerald-500/20 translate-x-3'
                : 'text-slate-500 hover:text-brand-emerald hover:bg-slate-50 hover:translate-x-2'
            }`}
          >
            <span className="truncate pr-4">{section.title}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${
                activeSection === section.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7-7" />
            </svg>
          </button>
        ))}
      </nav>

      {/* Progress Bar Placeholder */}
      <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col gap-2 relative z-10">
         <div className="flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>Reading Progress</span>
            <span>{Math.round(((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100)}%</span>
         </div>
         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-emerald transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%` }}
            />
         </div>
      </div>
    </div>
  );
}
