'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'asian-handicap-explained', 
    title: 'The Arbitrage of Probabilities: Understanding the Asian Line', 
    content: (
      <>
        The Asian Handicap is the most mathematically evolved betting market in the world. Originally designed to eliminate the possibility of a &quot;Draw&quot; outcome, it balances two unevenly matched teams by applying a specific goal handicap. Unlike European Handicap, AH allows for &quot;Half-Wins,&quot; &quot;Half-Losses,&quot; and &quot;Push&quot; results, creating a more granular and efficient market for professional bettors.
        <br /><br />
        <strong>The Core Mandate:</strong>
        <br />
        • <strong>Elimination of the Draw:</strong> By using half and quarter goals, the draw is essentially removed from the betting equation.
        <br />
        • <strong>Reduced House Margin:</strong> Asian Handicap markets typically offer some of the lowest &quot;vig&quot; or commission in the industry.
        <br />
        • <strong>Capital Preservation:</strong> The dynamic nature of the lines allows for stake refunds in scenarios where your selection falls just short.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'outcome-legend', 
    title: 'Outcome Legend', 
    content: "",
    advantages: [],
    risks: []
  },
  { 
    id: 'fractional-precision', 
    title: 'Fractional Precision: Half Lines vs. Quarter Lines', 
    content: (
      <>
        The true power of the Asian Handicap lies in its fractional lines. While <strong>Half Lines</strong> (-0.5, +1.5) behave like binary win/lose bets, <strong>Quarter Lines</strong> (-0.25, -0.75) split your stake into two separate mini-bets.
        <br /><br />
        <strong>The Staking Split:</strong>
        <br />
        • <strong>-0.75 Line:</strong> Your stake is split between -0.5 and -1.0. If your team wins by exactly one goal, you win half the bet (the -0.5 half) and the other half is refunded (the -1.0 half).
        <br />
        • <strong>-0.25 Line:</strong> Split between 0.0 and -0.5. A draw results in a &quot;Half-Loss,&quot; where half your stake is lost and the other half is refunded.
      </>
    ),
    advantages: [],
    risks: []
  },
  {
    id: 'liquidity-advantage',
    title: 'The Liquidity Advantage: Why Pros Bet Asian Markets',
    content: (
      <>
        Because the Asian Handicap simplifies the match into a binary outcome (Team A vs Team B), it attracts the highest volume of professional liquidity. This high volume leads to <strong>market efficiency</strong>—meaning the odds are often the most accurate representation of true probability.
        <br /><br />
        <strong>Why Volume Matters:</strong>
        <br />
        Professional syndicates prefer these markets because bookmakers are willing to take larger bets due to the stability of the lines. For a bettor, this means higher limits and fairer prices compared to the often-volatile 1X2 or Prop markets.
      </>
    ),
    advantages: [],
    risks: []
  },
  {
    id: 'strategic-deployment',
    title: 'Strategic Deployment: Finding Value in the Spread',
    content: (
      <>
        Successful Asian Handicap betting requires a deep understanding of <strong>Game State</strong>. You aren&apos;t just predicting who will win, but by *how much* they will win or how stubbornly they will defend.
        <br /><br />
        <strong>Market Signals:</strong>
        <br />
        • <strong>The Underdog +1.0:</strong> Defensive specialists who play for draws or 1-goal losses offer massive value when favored teams have low scoring efficiency.
        <br />
        • <strong>The Favorite -1.5:</strong> High-octane attacking teams facing defensive crises should be exploited when the market hasn&apos;t adjusted for squad rotations.
      </>
    ),
    advantages: [],
    risks: []
  },
  {
    id: 'vs-traditional-handicap',
    title: 'Asian Handicap vs traditional Handicap',
    content: (
      <>
        While both systems use &quot;head starts,&quot; the European Handicap (3-Way) is rigid and incorporates the Draw. The Asian Handicap is <strong>Dynamic</strong>—offering refunds (Pushes) and fractional outcomes that do not exist in traditional formats.
        <br /><br />
        <strong>Key Differentiators:</strong>
        <br />
        • <strong>Outcome Count:</strong> European (3 Outcomes) vs Asian (2 Outcomes).
        <br />
        • <strong>Stake Safety:</strong> Asian markets offer stake protection; European markets are binary (Win or Lose).
      </>
    ),
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: "The Master&apos;s Market",
    content: (
      <>
        Asian Handicap is often seen as intimidating by novices, but it is the ultimate tool for serious bankroll growth. It rewards precision, protects capital, and offers the fairest prices in sports betting. Master the AH lines, and you master the math of football betting.
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
        question: "Why should I use AH instead of Draw No Bet?",
        answer: "Asian Handicap 0.0 is identical to Draw No Bet. However, the AH market usually offers higher liquidity and slightly better odds (lower juice) because it is the primary market for professional volume."
      },
      {
        question: "What is a 'Push' in Asian Handicap?",
        answer: "A &apos;Push&apos; occurs when the match result, after applying the handicap, is exactly a draw. In this scenario, your entire stake is refunded. This level of protection is unavailable in European Handicaps."
      },
      {
        question: "Does AH apply to in-play betting?",
        answer: "Yes, but with a vital caveat: many bookmakers &apos;reset the score&apos; to 0-0 from the moment you place an in-play AH bet. Always check if your bet is on the &apos;Full Time&apos; result or just the &apos;Current Score&apos; handicap."
      },
      {
        question: "What is the best AH line for value?",
        answer: "The +0.75 and +1.25 lines for underdogs are often undervalued. They provide a &apos;Half-Win&apos; scenario even if your team loses by exactly one goal, offering a superior risk-to-reward ratio."
      }
    ]
  }
];

const legendItems = [
  { label: 'Win', sub: 'Full Payout', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Lose', sub: 'Lose Stake', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100' },
  { label: 'Half Win', sub: '50% Payout + Stake', color: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100' },
  { label: 'Half Lose', sub: 'Lose 50% Stake', color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100' },
  { label: 'Stake Refund', sub: 'Get Stake Back', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' }
];

const handicapTablesData: { [key: string]: any } = {
  'asian-handicap-0-0': {
    line: '0',
    left: { title: '-0 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Stake Refund' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Stake Refund' }, { label: 'Lose', result: 'Lose' }] }
  },
  'asian-handicap-0-25': {
    line: '0.25',
    left: { title: '-0.25 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Half Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0.25 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Half Win' }, { label: 'Lose', result: 'Lose' }] }
  },
  'asian-handicap-0-5': {
    line: '0.50',
    left: { title: '-0.50 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0.50 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose', result: 'Lose' }] }
  },
  'asian-handicap-0-75': {
    line: '0.75',
    left: { title: '-0.75 Handicap', rows: [{ label: 'Win By 2+ Goals', result: 'Win' }, { label: 'Win By 1 Goal', result: 'Half Win' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0.75 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose By 1 Goal', result: 'Half Lose' }, { label: 'Lose By 2+ Goals', result: 'Lose' }] }
  },
  'asian-handicap-1-0': {
    line: '1.00',
    left: { title: '-1.00 Handicap', rows: [{ label: 'Win By 2+ Goals', result: 'Win' }, { label: 'Win By 1 Goal', result: 'Stake Refund' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+1.00 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose By 1 Goal', result: 'Stake Refund' }, { label: 'Lose By 2+ Goals', result: 'Lose' }] }
  },
  'asian-handicap-1-5': {
    line: '1.50',
    left: { title: '-1.50 Handicap', rows: [{ label: 'Win By 2+ Goals', result: 'Win' }, { label: 'Win By 1 Goal', result: 'Lose' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+1.50 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose By 1 Goal', result: 'Win' }, { label: 'Lose By 2+ Goals', result: 'Lose' }] }
  }
};

const getBadgeStyles = (result: string) => {
  switch (result) {
    case 'Win': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Lose': return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'Half Win': return 'bg-teal-50 text-teal-600 border-teal-200';
    case 'Half Lose': return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'Stake Refund': return 'bg-blue-50 text-blue-600 border-blue-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export default function AsianHandicapPage() {
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
      if (intersecting.length > 0) setActiveSection(intersecting[intersecting.length - 1].target.id);
    }, { rootMargin: '-15% 0px -80% 0px' });
    
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
          <span className="text-brand-emerald uppercase font-bold">ASIAN HANDICAP</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Asian Handicap <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;The Asian Handicap is not just a betting market—it is a mathematical instrument for capital preservation and high-volume value extraction.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this definitive technical guide, we explore the world&apos;s most dominant betting line. We break down the &apos;Arbitrage of Probabilities,&apos; explain the tactical edge of quarter-line splitting, and reveal why professional liquidity is concentrated almost exclusively in the Asian markets.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => {
                if (section.id === 'outcome-legend') {
                  return (
                    <section key={section.id} id="outcome-legend" className="scroll-mt-24">
                      <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h2 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-4 text-center justify-center">
                          Outcome Legend
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {legendItems.map((item, idx) => (
                            <div key={idx} className={`${item.bg} ${item.border} border rounded-3xl p-6 text-center shadow-sm`}>
                              <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-4`} />
                              <h4 className={`text-lg font-black ${item.text} mb-1`}>{item.label}</h4>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">{item.sub}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                return (
                  <div key={section.id}>
                    <StrategyContentSection {...section} isActive={activeSection === section.id} />
                    
                    {handicapTablesData[section.id] && (
                      <div className="mt-8 bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="bg-brand-emerald/5 px-8 sm:px-12 py-4 flex justify-between items-center border-b border-brand-emerald/10">
                          <h3 className="text-xl font-black text-brand-emerald-dark">
                             {handicapTablesData[section.id].left.title}
                          </h3>
                          <h3 className="text-xl font-black text-brand-emerald-dark">
                             {handicapTablesData[section.id].right.title}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          <div className="p-8 sm:p-10 space-y-4">
                            {handicapTablesData[section.id].left.rows.map((row: any, rIdx: number) => (
                              <div key={rIdx} className="flex items-center justify-between">
                                <span className="text-slate-700 font-bold">{row.label}</span>
                                <span className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider ${getBadgeStyles(row.result)}`}>
                                  {row.result}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="p-8 sm:p-10 space-y-4">
                            {handicapTablesData[section.id].right.rows.map((row: any, rIdx: number) => (
                              <div key={rIdx} className="flex items-center justify-between">
                                <span className="text-slate-700 font-bold">{row.label}</span>
                                <span className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider ${getBadgeStyles(row.result)}`}>
                                  {row.result}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
