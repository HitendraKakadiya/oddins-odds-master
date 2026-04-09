'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'compound-variance', 
    title: 'The Compound Variance: Mastering HT/FT Dynamics', 
    content: (
      <>
        Half-Time/Full-Time (HT/FT) is the definitive market for bettors who specialize in <strong>Interval Analysis</strong>. By requiring you to correctly predict the match state at both the 45-minute and 90-minute marks, it introduces significant compound variance. However, this added complexity is mathematically compensated for with substantially higher odds than the standard Match Result market.
        <br /><br />
        <strong>The Matrix of Outcomes:</strong>
        <br />
        There are 9 possible combinations, ranging from the stable 1/1 (Favorite leads throughout) to the highly volatile 1/2 or 2/1 (Full-match reversals). Mastery of this market requires moving beyond &quot;who wins&quot; to &quot;how the winning narrative unfolds.&quot;
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'x1-alpha', 
    title: "The &apos;X/1&apos; Alpha: Exploiting the Slow Start", 
    content: (
      <>
        One of the most profitable sectors of the HT/FT market is the <strong>X/1 selection</strong> (Draw at Half-Time, Home Win at Full-Time). This pattern is frequent when elite teams face disciplined &quot;Low-Block&quot; defenses.
        <br /><br />
        <strong>The Tactical Hook:</strong>
        <br />
        A favorite may take 60 minutes to break down a stubborn opponent. If your model suggests a &quot;Stale Phase&quot; in the first half followed by a high-intensity second half (due to fatigue or tactical substitutions), the X/1 line offers a massive price boost compared to a straight 1X2 bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'urgency-dynamics', 
    title: 'Urgency vs. Fatigue: Predicting the Two halves', 
    content: (
      <>
        Successful HT/FT betting requires an audit of manager philosophies. Coaches who prioritize <strong>&quot;Blitz&quot; tactics</strong> (high pressing from the first whistle) are prime candidates for 1/1 or 1/X results. Conversely, managers who favor <strong>&quot;Control&quot; tactics</strong> often produce X/1 or X/X patterns.
        <br /><br />
        <strong>Key Indicators:</strong>
        <br />
        • <strong>Substitute Depth:</strong> A favorite with high-quality bench options is more likely to turn a Half-Time draw (X) into a Full-Time win (1) in the final 20 minutes.
        <br />
        • <strong>Historical Intervals:</strong> Some clubs are historically &quot;Slow Starters&quot;—this data is gold for HT/FT market refinement.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'reversal-probabilities', 
    title: 'Reversal Probabilities: The Comeback Longshots', 
    content: (
      <>
        The 2/1 and 1/2 selections (leading at half-time but losing at full-time) offer the highest odds in the market, often exceeding 25.0+. While rare, they represent the ultimate value in <strong>volatility betting</strong>.
        <br /><br />
        <strong>Spotting the Reversal:</strong>
        <br />
        These outcomes are statistically more likely in derbies or high-stakes knockout games where emotional momentum can shift rapidly after a red card or a key tactical substitution. Professionally, these are &quot;Lotto&quot; style bets that should only be deployed with a tiny fraction of the stake.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Predicting the Narrative', 
    content: (
      <>
        HT/FT betting is about predicting the *story* of the game. It rewards the analyst who understands match flow, manager temperament, and the inevitable shift from tactical discipline to second-half fatigue. When used correctly, it is the most efficient way to maximize ROI on heavy favorites.
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
        question: "Why is 1/1 odds so much lower than X/1?",
        answer: "Because 1/1 implies total dominance from the start. A team leading at half-time has over an 80% statistical probability of winning the match. Winning from a draw (X/1) is harder and therefore pays much more."
      },
      {
        question: "Does HT/FT include injury time?",
        answer: "Yes. The &apos;Half-Time&apos; result is settled after the first-half injury time, and &apos;Full-Time&apos; is settled after the second-half injury time. It does NOT include extra time or penalties."
      },
      {
        question: "What is the best HT/FT strategy for underdogs?",
        answer: "The &apos;2/X&apos; or &apos;1/X&apos; (Lead at HT, Draw at FT). Many underdogs start with high intensity and take a shock lead, but eventually succumb to the favorite&apos;s pressure and settle for a draw. These &apos;Lead-Fade&apos; scenarios offer excellent value."
      },
      {
        question: "Can I use HT/FT in-play?",
        answer: "Yes, but only before the first half ends. Once the second half begins, you can only bet on the &apos;Second Half Result&apos; or &apos;Full Time Result,&apos; not the combined HT/FT narrative."
      }
    ]
  }
];

export default function HTFTPage() {
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
          <span className="text-brand-emerald uppercase font-bold">HALFTIME/FULLTIME BETTING GUID...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                HT/FT <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;HT/FT betting is the clinical breakdown of match narrative—it is about predicting the *how* as much as the *who*.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we explore the &apos;Compound Variance&apos; of HT/FT markets. We examine the specific alpha of the &apos;X/1&apos; slow-start pattern, analyze how manager philosophy dictates interval scoring, and reveal the statistical triggers for high-yield reversal betting.
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
