'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'capital-preservation', 
    title: 'Capital Preservation: The Logic of Draw No Bet', 
    content: (
      <>
        Draw No Bet (DNB) is the primary entry point for bettors transitioning from recreational gambling to professional risk management. By removing the &quot;Draw&quot; as a losing outcome, DNB acts as a <strong>capital preservation tool</strong>. If the match ends in a stalemate, your entire stake is refunded. This isolation of the win/loss binary allows you to focus exclusively on your ability to select winners without being penalized by typical low-scoring variance.
        <br /><br />
        <strong>The DNB Framework:</strong>
        <br />
        • <strong>Team Win:</strong> Full payout at DNB odds.
        <br />
        • <strong>Draw:</strong> 100% Stake Refund (Bet is Void).
        <br />
        • <strong>Team Loss:</strong> Total loss of stake.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'how-does-it-work', 
    title: 'Yield vs. Safety: The Physics of the Refund', 
    content: (
      <>
        Understanding the physics of DNB requires comparing it to the 1X2 market. Because the bookmaker provides &quot;insurance&quot; against a draw, they compensate by lowering the odds on the win.
        <br /><br />
        <strong>Example Matrix:</strong>
        <br />
        Consider a match where <strong>Team A</strong> is priced at 2.50 in the 1X2 market. In the Draw No Bet market, they might be priced at 1.80. You are paying a &quot;premium&quot; in the form of lower potential yield to obtain stake protection.
        
        <div className="my-8 overflow-hidden rounded-[32px] border border-slate-100 shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 uppercase text-slate-500 font-bold tracking-wider">
                <tr>
                  <th className="px-8 py-5 border-b border-slate-100">Market Outcome</th>
                  <th className="px-8 py-5 border-b border-l border-slate-100">DNB Selection (e.g., Team A)</th>
                  <th className="px-8 py-5 border-b border-l border-slate-100">Resulting Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-slate-900">Your Team Wins</td>
                  <td className="px-8 py-5 border-l border-slate-100 text-emerald-600 font-bold">FULL PAYOUT</td>
                  <td className="px-8 py-5 border-l border-slate-100">Profit = Stake x (Odds - 1)</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors bg-blue-50/20">
                  <td className="px-8 py-5 text-slate-900 italic font-semibold">Match is a Draw</td>
                  <td className="px-8 py-5 border-l border-slate-100 text-blue-600 font-bold uppercase tracking-tight">Stake Refund</td>
                  <td className="px-8 py-5 border-l border-slate-100">Net Return: ±0.00</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-slate-900">Your Team Loses</td>
                  <td className="px-8 py-5 border-l border-slate-100 text-rose-500 font-bold">FULL LOSS</td>
                  <td className="px-8 py-5 border-l border-slate-100">Stake is forfeited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'accumulator-efficiency', 
    title: 'Accumulator Efficiency: Protecting the Combo', 
    content: (
      <>
        DNB is a secret weapon for high-conviction accumulators (parlays). In a standard 1X2 parlay, a single draw in a five-leg bet kills the entire slip. In a <strong>DNB Accumulator</strong>, that single draw simply removes that leg from the slip, recalculating the total odds based on the remaining legs.
        <br /><br />
        <strong>Operational Advantage:</strong>
        <br />
        By utilizing DNB in your combos, you significantly increase the &quot;Mathematical Floor&quot; of your parlay, ensuring that your work isn&apos;t undone by a 90th-minute equalizer in a single match.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'strategic-utility', 
    title: 'Strategic Utility: When to Deploy DNB', 
    content: (
      <>
        Professional deployment of DNB usually occurs in two specific scenarios:
        <br /><br />
        1. <strong>The Stubborn Underdog:</strong> When a lower-ranked team has a strong defensive record and is playing against an out-of-form favorite. DNB allows you to capture the &quot;Value&quot; of the underdog win while protecting against the likely draw.
        <br />
        2. <strong>Low-Volatility Derbies:</strong> In high-stakes matches where neither side wants to lose capital, the &quot;Draw&quot; probability increases significantly. DNB allows you to back your pick without the binary fear of a stalemate.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Professional Safety Net', 
    content: (
      <>
        Draw No Bet is not just a &quot;safer&quot; way to gamble; it is a clinical tool for managing variance. It rewards the bettor who can correctly identify a side that is &quot;too good to lose&quot; but might not have the clinical edge to guarantee a victory. In the long run, the capital saved by the DNB refund is often the difference between a failing bankroll and a profitable one.
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
        question: "Is DNB the same as Asian Handicap 0.0?",
        answer: "Mathematically, yes. Both markets offer a full refund on a draw. However, professional bettors often compare the odds between both, as the Asian market sometimes offers slightly better prices due to higher liquidity."
      },
      {
        question: "When should I choose Double Chance over DNB?",
        answer: "Choose Double Chance (1X) when you believe the draw is a likely outcome and you want to be paid for it. Choose DNB when you are confident in a win but want protection against a freak stalemate."
      },
      {
        question: "How does DNB affect my &apos;Yield&apos; over 1,000 bets?",
        answer: "DNB will lower your average &apos;Odds won&apos; but will significantly increase your &apos;Win/Refund Rate&apos;. This results in a much smoother bankroll curve with fewer aggressive downswings compared to the 1X2 market."
      },
      {
        question: "Can I manually create my own DNB odds?",
        answer: "Yes. By splitting your stake between the Home Win and the Draw (calculated as: Stake / Draw Odds), you can replicate DNB. Often, this &apos;Do It Yourself&apos; method reveals that the bookmaker&apos;s DNB price is slightly underpaid."
      }
    ]
  }
];

export default function DrawNoBetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">DRAW NO BET GUIDE (DNB) | LEARN MORE...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Draw No Bet <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Draw No Bet is the clinical isolation of selection ability from market variance—it is the professional&apos;s primary tool for capital preservation.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we explore the mathematics of the &apos;Draw Refund.&apos; We analyze the Yield-vs-Safety trade-off, the operational efficiency of DNB in multi-leg accumulators, and why identifying &apos;Stubborn Underdogs&apos; is the key to unlocking the true value of this clinical safety net.
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
