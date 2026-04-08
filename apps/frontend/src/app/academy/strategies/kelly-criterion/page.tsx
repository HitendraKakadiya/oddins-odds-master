'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'gold-standard', 
    title: 'The Gold Standard of Risk: Balancing Edge and Bankroll', 
    content: (
      <>
        The Kelly Criterion is widely considered the "Holy Grail" of money management. Developed by John Kelly in 1956, it is a mathematical formula designed to determine the optimal size of a series of bets to maximize the logarithm of wealth. In simpler terms, it finds the exact point where you bet enough to grow your bankroll as fast as possible without ever risking a total wipeout.
        <br /><br />
        <strong>The Kelly Mandate:</strong>
        <br />
        • <strong>Growth Maximization:</strong> It compounds your winnings more efficiently than any other system.
        <br />
        • <strong>Mathematical Safety:</strong> Theoretically, you can never go bust because your stake is always a percentage of your *current* balance.
        <br />
        • <strong>Dynamic Calibration:</strong> Your bet sizes automatically shrink during losing streaks and expand during winning runs.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'formula-of-ambition', 
    title: 'The Formula of Ambition: Calculating the Optimal Stake', 
    content: (
      <>
        The formula calculates the fraction of your bankroll (f*) you should wager based on your perceived edge.
        <br /><br />
        <strong>The Formula: f* = (bp - q) / b</strong>
        <br /><br />
        • <strong>b:</strong> The decimal odds minus 1 (e.g., 2.0 odds = 1.0b).
        <br />
        • <strong>p:</strong> Your estimated probability of winning (e.g., 55% = 0.55).
        <br />
        • <strong>q:</strong> Your probability of losing (1 - p).
        <br /><br />
        If the result is zero or negative, the formula is telling you that the bet has no value and should be avoided entirely.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'sensitivity-crisis', 
    title: 'The Sensitivity Crisis: Why Garbage In Equals Garbage Out', 
    content: (
      <>
        The Kelly Criterion’s greatest strength is also its fatal flaw: <strong>Sensitivity</strong>. The formula assumes your probability estimate (p) is 100% accurate. If you believe a team has a 60% chance of winning, but in reality, they only have a 52% chance, the Kelly Criterion will suggest a stake that is far too aggressive, leading to rapid capital depletion.
        <br /><br />
        <strong>The Accuracy Requirement:</strong>
        <br />
        To use Kelly effectively, you don't just need to be a good bettor—you need to be a master statistician. You must have a proven model that generates winning probabilities more accurately than the bookmaker's market price.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'fractional-mitigation', 
    title: 'Fractional Mitigation: Half-Kelly and the Safety Net', 
    content: (
      <>
        Because humans are prone to overconfidence (Overestimation Bias), professional bettors almost never use "Full Kelly." Instead, they use <strong>Fractional Kelly</strong>.
        <br /><br />
        <strong>Risk Tiers:</strong>
        <br />
        • <strong>Half-Kelly (0.5x):</strong> Betting 50% of what the formula suggests. This dramatically reduces volatility while still capturing 75% of the growth.
        <br />
        • <strong>Quarter-Kelly (0.25x):</strong> Betting 25%. This is the "Industry Standard" for professional syndicates, providing a massive safety buffer against model error.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Clinical Precision', 
    content: (
      <>
        The Kelly Criterion is the bridge between gambling and finance. It transforms a series of sports bets into a high-performance investment portfolio. However, it is a sharp blade that cuts both ways; use it only when you have the data to back up your convictions.
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
        question: "Why is my Kelly percentage so high?",
        answer: "If the formula suggests 20% or 30%, you likely have a massive discrepancy between your estimate and the bookie's odds. Usually, this means your probability estimate is too optimistic. Re-evaluate your model's accuracy."
      },
      {
        question: "Can I use Kelly for simultaneous bets?",
        answer: "Yes, but it's complex. If you have 5 matches starting at the same time, you cannot bet 20% on each (100% total bankroll). You must use 'Simultaneous Kelly' which scales the stakes down so the total risk remains manageable."
      },
      {
        question: "Is Kelly better than Flat Betting for beginners?",
        answer: "No. Beginners should stick to Flat Betting (1-2%). Kelly requires a level of probabilistic accuracy that most novice bettors haven't developed yet."
      },
      {
        question: "How does commission affect the Kelly formula?",
        answer: "Commission (on exchanges like Betfair) must be subtracted from the 'b' value. If you have 2.0 odds but pay 2% commission, your true 'b' is 0.98, not 1.0."
      }
    ]
  }
];

export default function KellyCriterionPage() {
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
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div 
          className="h-full bg-brand-emerald transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/strategies" className="hover:text-brand-emerald transition-colors uppercase">STRATEGIES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase">KELLY CRITERION STRATEGY</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Kelly Criterion <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "The Kelly Criterion is the bridge between pure gambling and clinical finance. It determines not just *what* to bet, but exactly *how much* your edge is worth."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Used by hedge fund managers and professional gambling syndicates alike, the Kelly Criterion is the ultimate tool for exponential bankroll growth. In this technical guide, we break down the formula, address the 'sensitivity crisis' of probability estimation, and explain why 'Fractional Kelly' is the industry secret for long-term sustainability.
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
