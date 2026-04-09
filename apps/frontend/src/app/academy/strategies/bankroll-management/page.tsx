'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'capital-preservation', 
    title: 'The Capital Preservation Mindset: Betting as an Asset Class', 
    content: (
      <>
        Professional betting is not about &quot;winning a match&quot;; it is about <strong>risk management</strong>. Your bankroll is your inventory. Without it, you cannot trade in the betting markets. Bankroll management is the systematic process of protecting that inventory against the statistical inevitability of variance.
        <br /><br />
        <strong>The Golden Rules:</strong>
        <br />
        • <strong>Isolation:</strong> Your bankroll must be separate from your life savings.
        <br />
        • <strong>Emotional Neutrality:</strong> Money on the table is already &quot;lost&quot;—you are simply managing its turnover.
        <br />
        • <strong>Capital Preservation:</strong> The priority is to avoid &quot;The Zero&quot;—the point where you can no longer place a value bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'unit-system', 
    title: 'The Unit System: Standardizing Risk Across Markets', 
    content: (
      <>
        Betting arbitrary amounts is the fastest route to ruin. Professionals use a <strong>Unit System</strong>, where 1 Unit represents a small, fixed percentage of their total bankroll (typically 1-2%).
        <br /><br />
        <strong>Standardized Sizing:</strong>
        <br />
        • <strong>1 Unit (1%):</strong> Standard confidence/value bet.
        <br />
        • <strong>3 Units (3%):</strong> High-conviction edge (Rare).
        <br />
        • <strong>0.5 Units (0.5%):</strong> Speculative &quot;Long Shot&quot; or experimental market.
        <br /><br />
        By using units, you ensure that no single &quot;bad beat&quot; can significantly damage your long-term growth.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'variance-downswing', 
    title: 'Variance and the &quot;Downswing&quot;: Protecting Your Mental Edge', 
    content: (
      <>
        Even a 60% strike-rate bettor has a 5% chance of suffering <strong>10 consecutive losses</strong> at some point in their career. This is variance. Bankroll management provides the buffer needed to survive these mathematical slumps without going broke.
        <br /><br />
        <strong>The Psychology of the Slump:</strong>
        <br />
        • <strong>Resist the Chase:</strong> Never increase stakes to &quot;win back&quot; losses.
        <br />
        • <strong>Trust the Volume:</strong> If your edge is mathematically proven, profit will arrive over thousands of bets, not tens.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-hygiene', 
    title: 'Operational Hygiene: Tracking, Auditing, and Recalibrating', 
    content: (
      <>
        You cannot manage what you do not measure. A professional bankroll workflow requires meticulous tracking and a monthly &quot;audit&quot; of your performance data.
        <br /><br />
        <strong>Audit Checklist:</strong>
        <br />
        • <strong>ROI Tracking:</strong> What is your Return on Investment per unit?
        <br />
        • <strong>Market Analysis:</strong> Are you more profitable in Over/Under than Match Results?
        <br />
        • <strong>Unit Realignment:</strong> If your bankroll grows by 20%, increase your unit value proportionately. If it drops, scale down to protect the core capital.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Foundation of Success', 
    content: (
      <>
        In the betting world, math trumps sports knowledge every time. Bankroll management is the mathematical shield that allows you to stay in the game long enough for your edge to manifest. Without it, you are not a bettor—you are a guest donor to the bookmakers.
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
        question: "Is 'Flat Betting' better than 'Proportional Sizing'?",
        answer: "Flat betting is more conservative and safer for beginners. Proportional sizing (betting a % of the *current* balance) allows for faster bankroll growth during winning streaks but requires more discipline during losses."
      },
      {
        question: "How large should my bankroll be?",
        answer: "Large enough that a 1% unit bet is meaningful to you, but small enough that losing the entire amount wouldn&apos;t impact your ability to pay rent or bills. For beginners, $500 - $1,000 is a standard starting point."
      },
      {
        question: "What is the biggest mistake in bankroll management?",
        answer: "Speculative &apos;Accas&apos; or &apos;Parlays&apos;. Adding multiple legs to a bet exponentially increases the house edge and is the leading cause of bankroll drainage for recreational bettors."
      },
      {
        question: "When should I withdraw my profits?",
        answer: "Ideally, only after you have reached a significant milestone (e.g., doubling your bankroll). Constant withdrawals prevent the power of compound interest from growing your unit size effectively."
      }
    ]
  }
];

export default function BankrollManagementPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div 
          className="h-full bg-brand-emerald transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/strategies" className="hover:text-brand-emerald transition-colors uppercase">STRATEGIES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase">BANKROLL MANAGEMENT GUIDE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Bankroll <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Strategy without capital management is just an expensive hobby. Protecting your bankroll is the first and most important law of professional betting.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this definitive guide, we move beyond basic &apos;budgeting&apos; to explore the mathematics of capital preservation. We cover unit standardisation, the psychology of variance, and the operational hygiene required to treat your betting as a high-performance asset class.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-12">
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
                  const element = document.getElementById(id);
                  if (element) {
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }} 
              />
              <TodaysMatchesWidget />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
