'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'theoretical-vs-real', 
    title: 'The Double-Edged Sword: Theoretical Profit vs. Real-World Ruin', 
    content: (
      <>
        The Martingale system is perhaps the most famous—and most dangerous—strategy in the history of gambling. It operates on a deceptively simple premise: after every loss, you double your stake. The goal is to recover all previous losses and secure a profit equal to your original "base" stake with a single win.
        <br /><br />
        <strong>The Mechanism of Action:</strong>
        <br />
        • <strong>Base Bet:</strong> You start with a small unit (e.g., $10).
        <br />
        • <strong>Geometric Progression:</strong> If you lose, your stake becomes $20, then $40, then $80, and so on.
        <br />
        • <strong>The Reset:</strong> Upon a win, you return to the $10 base bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'geometric-trap', 
    title: 'The Geometric Trap: Understanding Exponential Growth', 
    content: (
      <>
        The primary flaw of the Martingale is that it assumes you have an infinite bankroll and no betting limits. In reality, exponential growth is more aggressive than most bettors realize. By the 10th consecutive loss, a $10 bet requires a <strong>$10,240 stake</strong> just to recover your funds and make a <strong>$10 profit</strong>.
        <br /><br />
        <strong>Sequence Risk:</strong>
        <br />
        • Round 1: $10
        <br />
        • Round 5: $160
        <br />
        • Round 10: $10,240
        <br />
        • Round 12: $40,960
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'hard-limits', 
    title: 'Hard Limits: Table Caps and Bankroll Exhaustion', 
    content: (
      <>
        Even if you have the wealth to support a long losing streak, bookmakers use <strong>Table Limits</strong> as their ultimate defense. Most platforms set a maximum bet for a single market. Once your required Martingale stake exceeds this cap, the system collapses, "locking in" a massive catastrophic loss that can take months of standard value betting to recover.
        <br /><br />
        <strong>Failure Points:</strong>
        <br />
        • <strong>The Table Cap:</strong> The maximum allowable stake on a single event.
        <br />
        • <strong>Bankroll Ruin:</strong> The point where your total liquid capital is exhausted.
        <br />
        • <strong>Emotional Tilt:</strong> The high stress of risking thousands to win tens.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'martingale-variations', 
    title: 'Strategic Variations: Mini-Martingale and Paroli', 
    content: (
      <>
        Because of the inherent danger of the standard system, several variations have emerged to mitigate risks or capitalize on winning instead of losing streaks.
        <br /><br />
        <strong>Common Variations:</strong>
        <br />
        • <strong>Mini-Martingale:</strong> Limiting the number of double-downs (e.g., only doubling three times) to prevent total ruin.
        <br />
        • <strong>Paroli System:</strong> Doubling after a <strong>win</strong> rather than a loss to chase "hot" streaks with house money.
        <br />
        • <strong>Grand Martingale:</strong> Doubling plus adding one unit—an even more aggressive method that accelerates ruin.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'professional-verdict', 
    title: 'Professional Verdict: Why Arithmetic Systems Fail', 
    content: (
      <>
        Professional bettors avoid Martingale because it lacks a <strong>Value Edge</strong>. It is an arithmetic system that tries to overcome probability with stake sizing. However, if each individual bet has a negative expected value (due to the bookmaker's margin), no staking plan can magically turn it into a positive long-term return.
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
        question: "Is Martingale more effective in sports than roulette?",
        answer: "Generally, no. Sports events are not truly independent like a roulette wheel, but the math of exponential growth remains the same. A losing streak in sports can be just as long and devastating."
      },
      {
        question: "Does the Martingale system improve my win rate?",
        answer: "No. It only changes the *distribution* of your results. You win small amounts frequently, but will eventually suffer a rare, catastrophic loss that wipes out all those gains."
      },
      {
        question: "What is the best way to use Martingale safely?",
        answer: "The safest way is to use a 'Mini-Martingale' with a very small base bet and a strict stop-loss limit after 3-4 consecutive losses."
      },
      {
        question: "Why do 'influencers' often promote this system?",
        answer: "It looks foolproof in the short term. Influencers often show sessions where 'it worked,' while ignoring the statistical inevitability of a total bankroll wipeout."
      }
    ]
  }
];

export default function MartingalePage() {
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
          <span className="text-brand-emerald uppercase">MARTINGALE SYSTEM</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Martingale <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "The Martingale is a mathematical siren song—it promises certainty in an uncertain world, but its price is the statistical inevitability of ruin."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this deep dive, we move beyond the superficial appeal of doubling down. We explore the geometric progression of risk, the role of table limits as a defensive tool for bookmakers, and the fundamental reason why no staking plan can overcome a negative expected value.
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

              <div className="pt-12 mt-12 border-t border-slate-100 flex flex-wrap gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-medium text-slate-400">
                  Published on 20 August 2025
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-medium text-slate-400">
                  Last updated on 20 August 2025
                </div>
              </div>
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
