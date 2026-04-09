'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'mechanics-of-a-sure-bet', 
    title: 'The Mechanics of a Sure Bet: Mathematical Arbitrage', 
    content: (
      <>
        Arbitrage betting, or &quot;arbing,&quot; is the practice of exploiting price discrepancies between different bookmakers to guarantee a profit regardless of the outcome. In an efficient market, odds represent probability plus a margin (the &quot;overround&quot;). Arbitrage occurs when the composite overround of two or more bookmakers drops below 0%, creating a mathematical gap where the bettor cannot lose.
        <br /><br />
        <strong>Key Mechanics:</strong>
        <br />
        • <strong>Cross-Market Hedging:</strong> Placing complementary bets on opposing platforms.
        <br />
        • <strong>Price Inefficiency:</strong> Capitalizing on &quot;soft&quot; bookmakers who are slow to react to market moves.
        <br />
        • <strong>Mathematical Certainty:</strong> Removing the element of sports knowledge and replacing it with pure calculation.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'formula-of-arbitrage', 
    title: 'The Formula of Profit: Calculating the Edge', 
    content: (
      <>
        To identify an arb, you must calculate the implied probability of every possible outcome. If the sum of these probabilities is less than 100%, an arbitrage opportunity exists.
        <br /><br />
        <strong>The Formula:</strong>
        <br />
        (1 / Odds A) + (1 / Odds B) + (1 / Odds C) {"<"} 1.00
        <br /><br />
        For example, if Bookmaker A offers 2.10 on Team X, and Bookmaker B offers 2.10 on Team Y, the total implied probability is (1/2.1) + (1/2.1) = 95.2%. The remaining 4.8% is your guaranteed margin, assuming you balance your stakes correctly using an arbitrage calculator.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-risk', 
    title: 'Operational Risk Management: Beyond the Math', 
    content: (
      <>
        While arbing is mathematically certain, operational risks are significant. <strong>Slippage</strong> occurs when odds change at one bookmaker while you are still placing the bet at another, potentially leaving you with an unhedged position. <strong>Voided bets</strong> are even more dangerous—if a bookmaker cancels a leg of your arb due to a &quot;palpable error,&quot; you are left with massive exposure.
        <br /><br />
        <strong>Risk Mitigation:</strong>
        <br />
        • <strong>Speed is Essential:</strong> Use professional API-driven tools to execute within seconds.
        <br />
        • <strong>Check Max Stakes:</strong> Always verify that both bookmakers will accept your full stake before placing either bet.
        <br />
        • <strong>Avoid &apos;Obvious&apos; Errors:</strong> If odds are 50% higher than the market average, it is likely a stay-away error.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'gubbing-problem', 
    title: 'The &quot;Gubbing&quot; Problem: Evading Detection', 
    content: (
      <>
        Bookmakers use advanced algorithms to detect arbitrage patterns. Once identified, your account will be &quot;gubbed&quot;—meaning your stakes will be limited to pennies or your account closed entirely. Protecting your account longevity is as important as finding the arbs themselves.
        <br /><br />
        <strong>How to Stay Under the Radar:</strong>
        <br />
        • <strong>Round Your Stakes:</strong> Instead of betting $104.57 (as a calculator might suggest), bet $105.
        <br />
        • <strong>Avoid Minor Markets:</strong> Focus on liquid markets where price moves are natural and harder to track.
        <br />
        • <strong>Mugging Bets:</strong> Occasionally place high-margin recreational bets to mimic a &quot;loser&quot; profile.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'pro-toolkit', 
    title: 'The Professional Toolkit: Scaling for Profit', 
    content: (
      <>
        Manual arbing is largely obsolete in today&apos;s high-speed market. Success requires professional software that scans hundreds of bookmakers in real-time. To scale, professional arbers often use dedicated browsers and e-wallets to manage capital movement without triggering security flags.
        <br /><br />
        <strong>The Pro Stack:</strong>
        <br />
        • <strong>Arbitrage Software:</strong> Tools like RebelBetting or OddsMonkey to source opportunities.
        <br />
        • <strong>Capital Velocity:</strong> Fast movement of funds via Skrill or Neteller to capture window-limited arbs.
        <br />
        • <strong>Digital Hygiene:</strong> Preventing tracking via dedicated hardware or clean-state browsers.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Efficiency Above All', 
    content: (
      <>
        Arbitrage is a grind, not a gamble. It requires meticulous record-keeping, emotional detachment, and constant vigilance. For those with the discipline to treat betting as a high-frequency trading operation, it remains one of the few ways to extract consistent wealth from the sports betting ecosystem by simply correcting market errors.
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
        question: "Is arbitrage betting ethical?",
        answer: "Strictly speaking, arbing is simply corrective price action. You are providing liquidity and correcting market errors—the same way hedge funds operate in financial markets."
      },
      {
        question: "How much capital is needed to start?",
        answer: "To see meaningful returns at a 2-3% margin, a rolling bankroll of at least $2,000 spread across 5-10 different bookmakers is considered the professional standard."
      },
      {
        question: "How long can an arbitrage career last?",
        answer: "Arbing is often a finite game. The &apos;burn rate&apos; of bookmaker accounts is high. The goal for many is to maximize profits over 12-24 months before account limits become too restrictive."
      },
      {
        question: "Can I arb using only one bookmaker?",
        answer: "No. Arbitrage requires a discrepancy between two platforms. It is impossible to arb within a single bookmaker because their internal margins are always positive."
      }
    ]
  }
];

export default function ArbitragePage() {
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
          <span className="text-brand-emerald uppercase">ARBITRAGE GUIDE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Mastering <span className="text-brand-emerald">Arbitrage</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;In sports betting, as in finance, arbitrage is the art of capturing risk-free profit by exploiting price discrepancies across different markets.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Welcome to the OddinsOdds Academy masterclass on Arbitrage. We move beyond theoretical &quot;sure bets&quot; to explore the mathematical formulas, operational risks, and tactical execution required to extract consistent profit from the betting ecosystem.
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
