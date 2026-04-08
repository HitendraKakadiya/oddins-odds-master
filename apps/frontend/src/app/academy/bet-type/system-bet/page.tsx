'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'combinatorial-logic', 
    title: "Combinatorial Logic: The Math of the 'M-of-N' System", 
    content: (
      <>
        A System Bet is the transition from serial risk to <strong>parallel risk management</strong>. Unlike a standard accumulator, where every leg must succeed in sequence, a System Bet utilizes <strong>Combinatorial Logic</strong> to split your total stake across every possible mathematical permutation of your selections.
        <br /><br />
        <strong>The M-of-N Framework:</strong>
        <br />
        Systems are defined by two variables: <strong>N</strong> (the number of selections) and <strong>M</strong> (the number of selections required per combination). For example, a "2/3 System" creates every possible "Double" (2-leg combo) from your 3 picks. This means a single failure doesn't kill the bet; it simply voids the combinations containing that losing leg.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'structural-variants', 
    title: 'Structural Variants: Trixies, Yankees, and Goliaths', 
    content: (
      <>
        Professional systems often utilize "Full Cover" structures. These don't just bet on a single permutation but cover <strong>all possible combinations</strong> above a certain leg count.
        <br /><br />
        <strong>Technical Inventory:</strong>
        <br />
        • <strong>Trixie (3 Selections):</strong> 4 bets (3 Doubles + 1 Treble).
        <br />
        • <strong>Yankee (4 Selections):</strong> 11 bets (6 Doubles + 4 Trebles + 1 Fourfold).
        <br />
        • <strong>Goliath (8 Selections):</strong> 247 bets. This is the ultimate tool for high-volume betting, providing a massive safety net that can generate profit even if 50% of your selections fail, provided the odds are high enough.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'profit-thresholds', 
    title: "Profit Thresholds: The 'Break-Even' Variable", 
    content: (
      <>
        The fatal error in recreational system betting is ignoring the <strong>Profit Threshold</strong>. Because your stake is split (e.g., a Yankee splits $110 into 11 x $10 bets), if only the minimum number of legs win (2 out of 4), your payout might be less than your total $110 stake.
        <br /><br />
        <strong>The Golden Rule:</strong>
        <br />
        To maintain positive expectancy (EV+), the average odds of your selections must be high enough to "Self-Insure" the system. For a 2/3 system to be profitable with only 2 winners, each selection must have odds of at least <strong>1.75</strong>. Anything lower results in a "Winning Loss."
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-risk', 
    title: 'Operational Risk: Managing Stake Inflation', 
    content: (
      <>
        System bets create <strong>Stake Inflation</strong>. Because the number of bets increases exponentially with your selections, a simple unit-size error can devastate a bankroll.
        <br /><br />
        <strong>Operational Tip:</strong>
        <br />
        Always calculate based on the <strong>Total Outlay</strong>, not the unit stake. If your standard bet is $100, and you want to place a Yankee (11 bets), your unit stake should be adjusted to approximately $9.09 to keep your total risk at the $100 baseline.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Parallel Advantage', 
    content: (
      <>
        System Betting is the preferred method for scaling complex models. It removes the "Binary Fragility" of the parlay and replaces it with a robust, multi-layered payout structure. Master the combinatorial math, adjust your unit stakes, and you transform a high-variance hobby into a professional financial operation.
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
        question: "Is a System Bet better than an Accumulator?",
        answer: "If your model has high 'Selection Accuracy' (e.g., 80%), an Accumulator is more profitable. If your model targets 'High Odds / High Variance' (e.g., draws at 3.50), a System Bet is superior because it allows you to remain profitable despite the inevitable losses."
      },
      {
        question: "What is a 'Banker' in a System Bet?",
        answer: "A Banker is a specific selection that MUST win for any combination in the system to pay out. Adding a Banker reduces the total number of bets (and thus the cost) but reintroduces the 'all-or-nothing' risk for that specific leg."
      },
      {
        question: "Does the order of selections matter?",
        answer: "Mathematically, no. The system creates every possible combination regardless of the order you enter them into the slip."
      },
      {
        question: "What happens if a match is voided (Postponed)?",
        answer: "The selection is calculated at odds of 1.00. In a System 2/3, a voided match turns the doubles containing that match into single bets, and the treble into a double."
      }
    ]
  }
];

export default function SystemBetPage() {
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
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET-TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">SYSTEM BET EXPLAINED | MEANING...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                System Bet <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "Parallel risk management is the final step in the evolution from recreational gambler to professional trader."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the 'Combinatorial Logic' of System Betting. We analyze the structural variants from Trixies to Goliaths, reveal the mathematical profit thresholds required to self-insure your bankroll, and provide an operational framework for managing stake inflation in multi-layered selections.
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
