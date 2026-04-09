'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'prism-of-reputation', 
    title: 'The Prism of Reputation: How Names Skew Perception', 
    content: (
      <>
        The Halo Effect is a cognitive bias where our overall impression of a person or brand—often based on a single positive trait—influences how we feel and think about their character or performance in other areas. In sports betting, this creates a &quot;halo&quot; around elite teams and players, causing bettors to ignore glaring weaknesses because of a legacy of success.
        <br /><br />
        <strong>The Mental Shortcut:</strong>
        <br />
        • <strong>Legacy Valorization:</strong> Assuming a team is elite today because they were dominant five years ago.
        <br />
        • <strong>Star Power Blindness:</strong> Forgetting a team&apos;s defensive gaps because they have a world-class striker.
        <br />
        • <strong>Aesthetic Bias:</strong> Rating &quot;beautiful&quot; playing styles as more effective than &quot;ugly&quot; winning systems.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'legacy-bias', 
    title: 'Legacy Bias: The Cost of Historical Dominance', 
    content: (
      <>
        Bookmakers are masters of the Halo Effect. They know that &quot;Public Teams&quot;—global brands like Real Madrid, Manchester United, or the LA Lakers—will always attract heavy betting volume regardless of their actual probability of winning. Consequently, the odds for these teams are often &quot;shortened,&quot; offering poor value for the astute bettor.
        <br /><br />
        <strong>Market Realities:</strong>
        <br />
        • <strong>The &quot;Big Team&quot; Tax:</strong> Lower returns on famous teams because the public over-bets them.
        <br />
        • <strong>Underdog Value:</strong> Efficient markets often hide value in teams with zero &quot;halo&quot; but superior underlying metrics.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'media-multipliers', 
    title: 'Media Multipliers: Highlights vs. Hard Truths', 
    content: (
      <>
        The digital age has amplified the Halo Effect. Social media highlight reels focus on spectacular goals and individual brilliance while ignoring defensive errors or tactical failures. Commentators contribute by labeling players as &quot;world-class&quot; after a small sample size of good form, reinforcing the public&apos;s biased perception.
        <br /><br />
        <strong>Information Hygiene:</strong>
        <br />
        • <strong>Avoid the Hype:</strong> Treat pundits&apos; opinions as entertainment, not data.
        <br />
        • <strong>Analyze the 90 Minutes:</strong> A 10-second highlight reel is the enemy of nuanced analysis.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-objectivity', 
    title: 'Operational Objectivity: Stripping the Name from the Data', 
    content: (
      <>
        To profit, you must separate <strong>Reputation</strong> from <strong>Reality</strong>. Professional syndicates achieve this by using data models that don&apos;t &quot;know&quot; the team&apos;s history—they only see the numbers.
        <br /><br />
        <strong>The Neutrality Protocol:</strong>
        <br />
        • <strong>Blind Betting:</strong> Analyze a match using only xG (Expected Goals), ball progression, and defensive metrics without looking at the team names.
        <br />
        • <strong>Fade the Public:</strong> Look for opportunities where the public hype (The Halo) has pushed the odds of a favorite too low, creating value on the underdog.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Betting on Reality', 
    content: (
      <>
        The most dangerous bet is the one based on &quot;what used to be.&quot; By consciously stripping the halo away from legendary names and assessing each match on its modern merits, you move from a recreational fan to a clinical market participant.
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
        question: "Is the Halo Effect different from recency bias?",
        answer: "Yes. Recency bias is about *timing* (overweighting the last game). The Halo Effect is about *identity* (overweighting a team&apos;s status or name), though the two often work together to cloud judgment."
      },
      {
        question: "How can I practically find the &apos;Big Team Tax&apos;?",
        answer: "Compare the odds offered on a public team like Barcelona against a similarly ranked &apos;boring&apos; team like Atletico Madrid. You will often find the famous team is priced significantly lower for the same probability of success."
      },
      {
        question: "Does the Halo Effect affect professional players too?",
        answer: "Absolutely. Opposing teams often play more defensively (and thus more effectively) against big names because of the &apos;aura&apos; of the club, which can ironically lead to more upsets."
      },
      {
        question: "Can I use the Halo Effect to my advantage?",
        answer: "Yes—by &apos;fading the public.&apos; When you identify a team that is overhyped by the media and the odds reflect this &apos;halo&apos; rather than reality, betting against them becomes a high-value strategy."
      }
    ]
  }
];

export default function HaloEffectPage() {
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
          <span className="text-brand-emerald uppercase">HALO EFFECT IN BETTING</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Halo Effect <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Names win championships, but stats win tickets. The Halo Effect is the invisible force that makes you bet on history while the present is falling apart.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this deep dive, we explore how reputation creates a &apos;tax&apos; on betting markets, why global brands offer the worst value for money, and horizontal strategies for stripping the &apos;aura&apos; away from a team to find the cold, hard mathematical reality underneath.
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
