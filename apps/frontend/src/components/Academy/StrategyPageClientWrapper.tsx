'use client';

import { useState, useEffect, ReactNode } from 'react';
import StrategyTOC from '@/components/Academy/StrategyTOC';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';

interface Section {
  id: string;
  title: string;
}

interface StrategyPageClientWrapperProps {
  sections: Section[];
  children: ReactNode;
}

export default function StrategyPageClientWrapper({ sections, children }: StrategyPageClientWrapperProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const intersecting = entries.filter(e => e.isIntersecting);
      if (intersecting.length > 0) setActiveSection(intersecting[intersecting.length - 1].target.id);
    }, { rootMargin: '-15% 0px -80% 0px' });
    
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        el.setAttribute('data-active', s.id === activeSection ? 'true' : 'false');
      }
    });
  }, [activeSection, sections]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div className="h-full bg-brand-emerald transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-12">
        <main className="flex-1 min-w-0 order-2 lg:order-1">
          {children}
        </main>

        <aside className="w-full lg:w-[380px] space-y-8 order-1 lg:order-2">
          <div className="sticky top-24 space-y-8">
            <StrategyTOC 
              sections={sections} 
              activeSection={activeSection} 
              onSectionChange={(id) => {
                setActiveSection(id);
                const el = document.getElementById(id);
                if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
              }} 
            />
            <div className="hidden lg:block">
              <TodaysMatchesWidget />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
