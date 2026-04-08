'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'arbitrage-of-incentives', 
    title: 'The Arbitrage of Incentives: Profiting from Promotions', 
    content: (
      <>
        Matched betting is an analytical technique used to extract guaranteed profit from bookmaker marketing budgets (free bets and bonuses). It is not gambling because it eliminates risk by covering every possible outcome of an event. By mathematically neutralizing the variance, you turn promotional offers into predictable cash flow.
        <br /><br />
        <strong>The Core Principles:</strong>
        <br />
        • <strong>Zero Risk:</strong> Every "Back" bet at a bookmaker is matched by a "Lay" bet at an exchange.
        <br />
        • <strong>Mathematical Extraction:</strong> Converting a non-withdrawable free bet into withdrawable cash at a 70-80% efficiency rate.
        <br />
        • <strong>Market Neutrality:</strong> You do not care who wins the match; you only care about the discrepancy between bookmaker and exchange prices.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'back-lay-neutralize', 
    title: 'Back, Lay, and Neutralize: The Anatomy of a Dual Bet', 
    content: (
      <>
        To perform matched betting, you must operate across two different types of platforms: a standard bookmaker and a betting exchange (such as Betfair or Smarkets).
        <br /><br />
        <strong>The Two Sides:</strong>
        <br />
        • <strong>The Back Bet:</strong> Betting *for* an event to happen (placed at the bookmaker).
        <br />
        • <strong>The Lay Bet:</strong> Betting *against* an event happening (placed at the exchange).
        <br /><br />
        When you place both simultaneously at near-identical odds, you create a "matched" position where your total bankroll (spread across both accounts) remains stable regardless of the final score.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'extraction-efficiency', 
    title: 'Extraction Efficiency: From Qualifying Bets to Cash', 
    content: (
      <>
        A standard matched betting operation consists of two distinct phases. Understanding the difference between a "Qualifying Bet" and a "Free Bet" is essential for professional extraction.
        <br /><br />
        <strong>Phase 1: The Qualifier</strong>
        <br />
        You place a bet with your own money to unlock a bonus. You aim for a "Qualifying Loss" of just a few cents by matching the odds as closely as possible.
        <br /><br />
        <strong>Phase 2: The Free Bet</strong>
        <br />
        Once the bonus is received, you repeat the process. However, since the stake isn't yours, the "winnings" from the back bet (minus the lay liability) result in pure, guaranteed profit.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-longevity', 
    title: "Operational Longevity: Avoiding the 'Promo Ban'", 
    content: (
      <>
        Bookmakers are aware of matched betting and will "gub" (ban from promotions) players who appear too efficient. To maintain your accounts long-term, you must mimic the behavior of a recreational loser.
        <br /><br />
        <strong>Longevity Tactics:</strong>
        <br />
        • <strong>Mugging Bets:</strong> Placing occasional bets on high-margin markets without a promotional hook.
        <br />
        • <strong>Avoid 100% Extraction:</strong> Don't always take the absolute best mathematical match; prioritize looking "natural."
        <br />
        • <strong>Mobile App Usage:</strong> Betting via the app rather than a browser can make you look like a casual fan.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Discipline Over Gambling', 
    content: (
      <>
        Matched betting is often described as a "data-entry job with a high hourly wage." It requires meticulous record-keeping, emotional detachment, and technical precision. For those who treat it as a business rather than a hobby, it remains the most reliable way to extract wealth from the sports betting ecosystem.
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
        question: "Is matched betting sustainable in 2024?",
        answer: "Yes, but it requires more 'account hygiene' than in the past. While sign-up offers are finite, 'reload' offers for existing customers provide a consistent monthly income for those with healthy accounts."
      },
      {
        question: "Can I do this with a small starting bankroll?",
        answer: "You can start with as little as $100 to complete a single sign-up offer. As your bankroll grows, you can complete multiple offers simultaneously, which speeds up your profit generation."
      },
      {
        question: "Is my credit score affected by matched betting?",
        answer: "No. Bookmakers perform a 'soft' identity check that does not impact your credit score. However, many pros use a separate bank account to keep betting transactions away from their primary mortgage or loan applications."
      },
      {
        question: "Is matched betting tax-free?",
        answer: "In many jurisdictions, including the UK, gambling winnings (which matched betting is classified as) are entirely tax-free. Always check your local regulations."
      }
    ]
  }
];

export default function MatchedBettingPage() {
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
          <span className="text-brand-emerald uppercase">MATCHED BETTING GUIDE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Matched Betting <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "Matched betting is not gambling—it is a systematic process of capturing the arbitrage between bookmaker promotions and market realities."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we move beyond the basics of sign-up offers and explore the heavy-lifting of matched betting: extraction efficiency, exchange liquidity, and the vital importance of account hygiene for long-term operational longevity.
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
