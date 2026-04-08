'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'totalization-framework', 
    title: 'The Totalization Framework: Predicting Market Lines', 
    content: (
      <>
        Over/Under betting, often referred to as "Totals," represents a pure clinical analysis of match intensity. Instead of predicting a winner, you are wagering on the <strong>Board Efficiency</strong>—whether the total goals, points, or corners will exceed a specific line set by the bookmaker. The 2.5 goal line serves as the global anchor for football, derived from the mathematical average of goals scored in major professional leagues.
        <br /><br />
        <strong>The Mechanics of the Line:</strong>
        <br />
        • <strong>Half-Goal Increments:</strong> Use of .5 (e.g., 2.5, 3.5) ensures a binary outcome—it is physically impossible to score exactly 2.5 goals, thus eliminating the "Draw" or "Push" result.
        <br />
        • <strong>Neutral Result:</strong> Over/Under is the ultimate defensive tool because it is immune to who scores, as long as the <strong>cumulative volume</strong> is met.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'style-variance', 
    title: 'Style Variance: Low-Blocks vs. High-Lines', 
    content: (
      <>
        Professional totals analysts move beyond simple goal averages. They analyze <strong>Style Variance</strong>. A team averaging 2.0 goals might do so via a high-risk "High Line" defense that concedes goals as fast as they score them, while another team might achieve it through clinical efficiency and a "Low-Block" system.
        <br /><br />
        <strong>Under-Valued Indicators:</strong>
        <br />
        • <strong>Defensive Compactness:</strong> In matches where both teams prioritize defensive structure (underdog vs underdog in a relegation battle), the "Under 2.5" often carries significant mathematical value despite the "low odds" bias.
        <br />
        • <strong>PPDA (Passes Per Defensive Action):</strong> High-pressing teams create more turnovers in the final third, leading to high-variance games that favor "Over" outcomes.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'over-1-5-anchor', 
    title: 'The Over 1.5 Anchor: High-Precision Selection', 
    content: (
      <>
        The 1.5 goal line is the "Gold Standard" for high-precision volume betting. While the odds are lower than the 2.5 line, the probability of <strong>at least two goals</strong> in a professional match is statistically robust.
        <br /><br />
        <strong>The "Banker" Logic:</strong>
        <br />
        In modern football, a 1-0 result is increasingly rare due to tactical shifts and injury-time extensions. Utilizing the Over 1.5 line as a "confidence anchor" in accumulators allows for a high hit-rate while protecting against the frustration of a 1-1 or 2-0 stalemate that would kill an "Over 2.5" bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'time-interval-dynamics', 
    title: 'Time-Interval Dynamics: The Math of Late Goals', 
    content: (
      <>
        A masterclass bettor understands that total goals are <strong>time-sensitive</strong>. Over 60% of goals in major leagues are scored in the final 30 minutes of play.
        <br /><br />
        <strong>Tactical Factors:</strong>
        <br />
        • <strong>Fatigue Coefficient:</strong> Defensive coordination fails as glycogen levels drop. High-paced teams exploit this in the "75th-90th" interval.
        <br />
        • <strong>Game State:</strong> If a favorite is trailing by 1 goal at the 70th minute, they will inevitably sacrifice defensive structure for attacking volume, creating a high-value opportunity for an additional goal (Over).
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Mastering the Board', 
    content: (
      <>
        Over/Under betting is the thinking man’s market. It removes the emotional unpredictability of "Selection Bias" and replaces it with a clinical assessment of match flow. Master the styles, understand the intervals, and the scoreboard becomes your most reliable revenue indicator.
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
        question: "When is the best time to bet 'Under' in-play?",
        answer: "The 'Under' market is most profitable when a match reaches its 'Stale State'—usually between the 15th and 35th minute if no early goal has disrupted the tactical setup. The market often over-adjusts its prices during this window."
      },
      {
        question: "Does weather impact Over/Under lines?",
        answer: "Significantly. Heavy rain or extreme heat can lower the 'Physical Ceiling' of a match, reducing high-intensity sprints and increasing defensive fatigue. In such conditions, 'Under' 2.5 often gains value as the game slows down."
      },
      {
        question: "What is the 'Asian Total' market?",
        answer: "Asian Totals (e.g., Over 2.0, Over 3.0) introduce a 'Push' (refund) element. If exactly 2 goals are scored on an Over 2.0 line, your stake is returned. This offers a middle-ground security between the binary Over 1.5 and Over 2.5 lines."
      },
      {
        question: "Which leagues are historically 'High-Scoring'?",
        answer: "Leagues like the Bundesliga, Dutch Eredivisie, and MLS tend to have higher goal averages due to attacking philosophies and defensive variance. Conversely, the Italian Serie B and French Ligue 2 are historically tighter, favoring 'Under' selections."
      }
    ]
  }
];

export default function OverUnderPage() {
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
          <span className="text-brand-emerald uppercase font-bold">OVER/UNDER</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Over/Under <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "Total markets move beyond the emotional variance of match results to focus on the clinical board efficiency of goal production."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the 'Totalization Framework' of Over/Under betting. We explore Style Variance, analyze why compactness is the key to 'Under' value, and reveal the interval dynamics that govern high-yield goals in the final 30 minutes of play.
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
