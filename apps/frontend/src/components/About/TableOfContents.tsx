'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'our-history', title: 'Our History' },
  { id: 'what-we-do', title: 'What We Do' },
  { id: 'our-team', title: 'Our Team' },
];

export default function TableOfContents() {
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
    <div className="hidden lg:block">
      <h3 className="font-bold text-gray-900 mb-4 text-base">Table of Contents</h3>
      <div className="border-l-2 border-gray-100 pl-4 space-y-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => scrollToSection(e, section.id)}
            className={`block text-sm transition-colors duration-200 ${
              activeSection === section.id
                ? 'text-brand-pink font-bold border-l-2 border-brand-pink -ml-[18px] pl-[14px]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {section.title}
          </a>
        ))}
      </div>
    </div>
  );
}
