'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'selection-confidence', 
    title: "Selection Confidence: The Psychology of the &apos;Banker&apos;", 
    content: (
      <>
        In the masterclass of sports betting, a <strong>Banker</strong> is not a &quot;guaranteed win&quot;—a concept that does not exist in professional markets. Instead, a Banker is the <strong>High-Probability Anchor</strong> of a betting strategy. It is the selection with the highest statistical &quot;Expected Value&quot; (EV) and the most robust historical data, serving as the foundation upon which complex multi-leg structures are built.
        <br /><br />
        <strong>The Banker Philosophy:</strong>
        <br />
        • <strong>Conviction over Price:</strong> A Banker isn&apos;t defined by low odds (e.g., 1.10), but by the <strong>Margin of Safety</strong> between the team&apos;s true probability and the market&apos;s pricing.
        <br />
        • <strong>Structural Priority:</strong> If your Banker fails, the narrative of your entire strategy collapses.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'structural-integrity', 
    title: 'Structural Integrity: Anchoring the System', 
    content: (
      <>
        The primary technical role of a Banker is to <strong>reduce stake inflation</strong> in System Bets. In an &quot;M-of-N&quot; system, adding a Banker ensures that every valid permutation must include that specific selection.
        <br /><br />
        <strong>The Efficiency Trade-Off:</strong>
        <br />
        By designating a Banker, you significantly lower the cost of your system bet because combinations that don&apos;t include the Banker are discarded. The trade-off is <strong>Binary Fragility</strong>: if your Banker fails, every single combination on your slip is voided, regardless of how many other legs win.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'value-trap', 
    title: "The Value Trap: Avoiding &apos;Low-Odd&apos; Fallacies", 
    content: (
      <>
        The most common mistake among amateur bettors is mistaking a <strong>&quot;Heavy Favorite&quot;</strong> for a Banker. A team priced at 1.15 might have high public visibility, but if they are missing their primary striker or facing a legendary &quot;low-block&quot; manager, they are a <strong>Value Trap</strong>, not a Banker.
        <br /><br />
        <strong>Masterclass Tip:</strong>
        <br />
        A true Banker often sits in the 1.40—1.65 range. This is where the market often underestimates the dominance of a top-tier side playing at home against a demoralized opponent. The risk-to-reward ratio here is clinically superior to a 1.05 &quot;sure thing.&quot;
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-diversification', 
    title: 'Operational Diversification: Multi-Banker Firm Cores', 
    content: (
      <>
        Elite professionals often use a <strong>&quot;Firm Core&quot; strategy</strong>, selecting 2 or 3 Bankers to act as a singular unit. This unit must succeed to unlock the payout of the higher-odds &quot;Value&quot; selections added to the slip.
        <br /><br />
        <strong>The Logic:</strong>
        <br />
        Identify the <strong>Unshakeable Markets</strong>—for example, Over 0.5 goals in a high-tempo league match combined with a Title-Contender Win at Home. This composite Banker provides the necessary &quot;coefficient boost&quot; to make even small-stake system bets financially viable.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Disciplined Anchor', 
    content: (
      <>
        The Banker Bet is the ultimate expression of a bettor&apos;s conviction. It is a tool for the disciplined, the data-driven, and the patient. Anchor your strategy with precision, avoid the allure of the &quot;low-odds trap,&quot; and the Banker becomes your most powerful mechanism for consistent bankroll growth.
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
        question: "Can I have more than one Banker in a single system bet?",
        answer: "Yes. Most high-level sportsbooks allow multiple Bankers. However, remember that every Banker added introduces a mandatory &apos;must-win&apos; requirement for the entire slip."
      },
      {
        question: "What is the best market for a football Banker?",
        answer: "Professionals often prefer &apos;Draw No Bet&apos; or &apos;Asian Handicap -0.75&apos; on favorites. These markets provide a better blend of security and payout compared to a straight Win (1X2) bet."
      },
      {
        question: "Is 'Banker' vs 'Player' relevant in sports betting?",
        answer: "No. That terminology is specific to Baccarat. In sports, &apos;Banker&apos; is strictly a designation for your most confident selection."
      },
      {
        question: "What happens if my Banker is voided (Postponed)?",
        answer: "In most cases, the Banker is simply calculated at odds of 1.00. The rest of your system remains active, but you lose the &apos;multiplier effect&apos; the Banker was providing to the other legs."
      }
    ]
  }
];

export default function BankerBetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">BANKER BET | MEANING, EXAMPLES...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Banker Bet <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;A Banker is not a &apos;guaranteed win&apos;—it is the clinical selection of the highest statistical Expected Value on the board.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we redefine the &apos;Banker&apos; for professional deployment. We explore the structural integrity of multi-leg systems, analyze the specific math of the &apos;Efficiency Trade-Off,&apos; and reveal how to avoid the &apos;Low-Odds Value Trap&apos; that drains most amateur bankrolls.
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
