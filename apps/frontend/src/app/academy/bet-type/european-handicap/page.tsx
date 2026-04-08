'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'euro-handicap-explained', 
    title: 'The 3-Way Symmetry: Mastering the European Line', 
    content: (
      <>
        The European Handicap (EH), often referred to as the "3-Way Handicap," is the traditional pillar of goal-based spread betting. Unlike its Asian counterpart, the European Handicap uses only <strong>integers</strong> (-1, -2, +3) and explicitly incorporates the <strong>Draw</strong> as a betting outcome. This creates a high-variance market where precision is rewarded with significantly higher odds.
        <br /><br />
        <strong>The European Protocol:</strong>
        <br />
        • <strong>3-Way Outcome:</strong> You can bet on Home Win, Away Win, or the Handicap Draw.
        <br />
        • <strong>Binary Results:</strong> There are no "Pushes" or refunds. You either win the bet or lose the stake.
        <br />
        • <strong>Integer Only:</strong> Sizing is always in whole goals, making the "Handicap Draw" a vital strategic component.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'integer-variance', 
    title: 'Integer Variance: The Binary Risk Model', 
    content: (
      <>
        The primary differentiator of the European Handicap is the lack of a safety net. In Asian Handicap, a -1.0 bet on a team that wins by exactly one goal results in a refund. In European Handicap, a -1 bet in the same scenario is a <strong>Loss</strong> (as the "Handicap Draw" was the winning outcome).
        <br /><br />
        <strong>Risk vs. Reward:</strong>
        <br />
        Because the "Push" is removed, the odds for a -1 European Handicap are always substantially higher than a -1 Asian Handicap. Professionals use EH when their model suggests a high probability of a multi-goal margin, sacrificing the "refund" safety for a larger payout.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'draw-handicap-pivot', 
    title: 'The Draw-Handicap Pivot: Betting on the Margin', 
    content: (
      <>
        The "Handicap Draw" is the crown jewel of the European market. It allows you to bet on the <strong>exact winning margin</strong> of a favorite. For example, a "Handicap Draw (-1)" bet wins if the favorite wins by exactly one goal (1-0, 2-1, 3-2).
        <br /><br />
        <strong>Strategic Utility:</strong>
        <br />
        This market is ideal for matches where a dominant team faces a stubborn defense. If your data suggests a "low-block" match where the favorite will struggle to blow the opponent away but will eventually find a breakthrough, the Handicap Draw offers far superior value than the standard Match Result.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'market-calibration', 
    title: 'Market Calibration: Identifying Underpriced Favorites', 
    content: (
      <>
        The European Handicap is the most efficient way to extract value from "Heavy Favorites." When a team is priced at 1.15 in the 1X2 market, it is often unbettable. However, moving to the European Handicap -1 or -2 can push the odds into the 1.60 - 2.10 range.
        <br /><br />
        <strong>Performance Auditing:</strong>
        <br />
        To use EH effectively, you must audit your favorite-backing strategy. If your "bankers" consistently win by 2+ goals, you are leaving significant profit on the table by not utilizing the European Handicap -1 line.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Integer Edge', 
    content: (
      <>
        The European Handicap is for the bettor who values simplicity and high-alpha returns. It strips away the complexity of quarter-lines and refunds, leaving a pure, clinical assessment of goal margins. While the variance is higher, the rewards for precise margin prediction are unmatched in traditional spread markets.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'faqs', 
    title: 'Expert Q&A', 
    content: '',
    advantages: [],
    risks: [],
    faqs: [
      {
        question: "What is the biggest mistake when betting EH?",
        answer: "Failing to account for the 'Handicap Draw'. Beginners often bet -1 thinking a 1-goal win is a refund (as in Asian Handicap). In EH, a 1-goal win for a -1 bet is a complete loss of stake."
      },
      {
        question: "Under what conditions is EH better than AH?",
        answer: "When your confidence in a multi-goal win is high. Because EH doesn't offer the 'Push' (refund) protection, the bookmaker offers a higher price to compensate for the added risk."
      },
      {
        question: "How do I calculate a 'Handicap Draw' result?",
        answer: "Simply add the handicap to the final score. If the result is a tie, the 'Handicap Draw' bet wins. For a (-2) Draw bet, the team must win by exactly 2 goals (e.g., 2-0, 3-1)."
      },
      {
        question: "Does EH only apply to football?",
        answer: "While most popular in football, it is widely used in Rugby and Ice Hockey, where goal/point margins are clearly defined and the 'Draw' outcome on the spread is a viable statistical event."
      }
    ]
  }
];

export default function EuropeanHandicapPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
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
      if (intersecting.length > 0) {
        // Find the one that is most prominent or the last one that started intersecting
        setActiveSection(intersecting[intersecting.length - 1].target.id);
      }
    }, { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.1, 0.2] });
    
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div className="h-full bg-brand-emerald transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">EUROPEAN HANDICAP</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                European Handicap <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "The European Handicap is the market of integers. It demands binary precision and rewards multi-goal confidence with superior yield."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical breakdown, we explore the '3-Way Symmetry' of the European Handicap. We examine why the removal of 'Pushes' creates the 'Integer Edge,' the specialized value of the Draw-Handicap pivot, and how to calibrate your model to exploit underpriced favorites.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => (
                <StrategyContentSection 
                  key={section.id}
                  {...section} 
                  isActive={activeSection === section.id} 
                />
              ))}
            </div>
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
      </div>
    </div>
  );
}
