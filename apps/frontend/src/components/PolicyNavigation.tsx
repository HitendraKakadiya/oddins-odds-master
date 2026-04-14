'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface PolicyNavigationProps {
  sections: Section[];
  lastUpdated?: string;
}

export default function PolicyNavigation({ sections, lastUpdated }: PolicyNavigationProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="lg:sticky lg:top-24 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">On This Page</h3>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeSection === section.id 
                  ? 'bg-brand-emerald/10 text-brand-emerald shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-lg opacity-70 group-hover:opacity-100">{section.icon}</span>
              <span className="text-left">{section.title}</span>
            </button>
          ))}
        </nav>
        {lastUpdated && (
          <div className="mt-8 pt-8 border-t border-slate-100 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
    </aside>
  );
}
