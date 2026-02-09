'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'top', title: 'What Can You Find in the Academy?' },
  { id: 'strategies', title: 'Strategies' },
  { id: 'bet-types', title: 'Bet Types' },
];

export default function AcademySideNav() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -35% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
      <h3 className="font-black text-slate-900 mb-6 text-xs uppercase tracking-[0.2em]">Table of Contents</h3>
      <div className="space-y-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => scrollToSection(e, section.id)}
            className={`block text-xs transition-all duration-200 border-l-2 pl-4 py-1 ${
              activeSection === section.id
                ? 'text-brand-pink font-black border-brand-pink'
                : 'text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {section.title}
          </a>
        ))}
      </div>
    </div>
  );
}
