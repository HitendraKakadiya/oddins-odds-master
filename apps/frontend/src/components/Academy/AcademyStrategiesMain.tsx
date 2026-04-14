'use client';

import { useState, useEffect } from 'react';
import StrategyCardGrid from '@/components/Academy/StrategyCardGrid';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';

interface Section {
  id: string;
  title: string;
  content: string;
  advantages: string[];
  risks: string[];
}

interface AcademyStrategiesMainProps {
  sections: Section[];
}

export default function AcademyStrategiesMain({ sections }: AcademyStrategiesMainProps) {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries.filter(entry => entry.isIntersecting);
      if (intersecting.length > 0) {
        const latest = intersecting[intersecting.length - 1];
        setActiveSection(latest.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 order-2 lg:order-1">
        {/* Strategy Card Grid */}
        <div className="mb-16">
          <StrategyCardGrid />
        </div>

        {/* Detailed Content Sections */}
        <div className="space-y-12 mb-16">
          {sections.map((section) => (
            <StrategyContentSection 
              key={section.id}
              id={section.id}
              title={section.title}
              content={section.content}
              advantages={section.advantages}
              risks={section.risks}
              isActive={activeSection === section.id}
              variant="premium"
            />
          ))}
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2">
        <div className="sticky top-24 space-y-8">
          {/* Table of Contents */}
          <StrategyTOC sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} />
          
          <div className="hidden lg:block">
            <TodaysMatchesWidget />
          </div>
        </div>
      </aside>
    </div>
  );
}
