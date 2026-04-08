'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'clinical-definition', 
    title: 'Clinical Definition: Opta-Standard Measurements', 
    content: (
      <>
        In professional markets, a <strong>Shot on Target (SoT)</strong> is defined by clinical precision. It is any deliberate goal attempt that either enters the net or would have entered the net if not for a save by the goalkeeper or a block by the last defending outfield player.
        <br /><br />
        <strong>The Exclusion Zone:</strong>
        <br />
        Understanding what is <em>not</em> an SoT is critical for bankroll preservation:
        <br />
        • <strong>Woodwork Hits:</strong> If a shot hits the post or crossbar and does not enter the net, it is recorded as a 'Shot Off Target.'
        <br />
        • <strong>Early Blocks:</strong> Shots blocked by defenders who are not the "last man" are classified as 'Blocked Shots,' not SoT.
        <br />
        • <strong>Accidental Crosses:</strong> If a cross accidentally loops toward the goal but is caught by the keeper, it is rarely credited as an SoT.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'shot-density', 
    title: 'Shot Density: Analyzing Player Intent', 
    content: (
      <>
        Professional SoT betting requires an analysis of <strong>Shot Density</strong>—the frequency of attempts relative to minutes played. Some players are "Volume Shooters" (e.g., Erling Haaland or Mo Salah) whose primary tactical role is to test the keeper regardless of the angle.
        <br /><br />
        <strong>High-Yield Indicators:</strong>
        <br />
        • <strong>Set-Piece Specialists:</strong> Players who take direct free-kicks provide a consistent baseline for 1+ SoT bets.
        <br />
        • <strong>Inverted Wingers:</strong> Players who cut inside onto their dominant foot (e.g., Bukayo Saka) often generate higher SoT volume than traditional wingers who prioritize crossing.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'goalkeeper-variance', 
    title: 'Goalkeeper Variance: The Shot-Stopper Effect', 
    content: (
      <>
        A secondary variable often ignored is the <strong>Goalkeeper's Profile</strong>. Refined models account for the "Parry-Rate" of the opposing keeper. A keeper who parries shots back into play (rather than catching) increases the probability of secondary and tertiary SoT opportunities in a single attacking sequence.
        <br /><br />
        <strong>Tactical Edge:</strong>
        <br />
        Pairing a high-volume shooter against a keeper with a low "Claim-Success" rate is a prime strategy for the 2.5+ and 3.5+ SoT markets.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'desperation-velocity', 
    title: 'Desperation Velocity: The Trailing Shot-Spike', 
    content: (
      <>
        In-play SoT markets are dictated by <strong>Desperation Velocity</strong>. When a favorite is trailing after the 65th minute, their "Tactical Filter" disappears. Players will take shots from sub-optimal positions just to force a mistake or generate a corner.
        <br /><br />
        <strong>Market Trigger:</strong>
        <br />
        This surge in volume makes "Player Over 1.5 SoT" a high-probability trade during the final quarter of the match, as teams move from controlled build-up to chaotic verticality.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Precision Edge', 
    content: (
      <>
        Shots on Target betting is the most reliable player-performance indicator in modern football. It filters out the luck of the goal and rewards the analysis of <strong>intentionality and tactical role</strong>. Master the Opta standards, profile the shooters, and monetize the desperation of the trailing favorite.
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
        question: "Does a deflection count as a Shot on Target?",
        answer: "Only if the original shot was already on target before the deflection. If a wild shot is heading wide but hits a defender and goes into the net, it is recorded as an 'Own Goal' or a goal, but technically not an SoT for the original kicker in many data models."
      },
      {
        question: "Is 'Over 0.5' the same as '1+'?",
        answer: "Yes. These are identical markets. You simply need the player to register 1 or more shots that meet the clinical SoT definition."
      },
      {
        question: "Do penalties count toward player SoT totals?",
        answer: "Yes, provided the penalty is either scored or saved by the goalkeeper. A penalty that hits the woodwork or misses the target entirely counts as 0 SoT."
      },
      {
        question: "How do 'Blocked Shots' affect my bet?",
        answer: "Negatively. Most 'Blocked' shots (outside the last-man scenario) are not recorded as SoT. This is why betting on players who shoot from distance into congested boxes is inherently higher risk."
      }
    ]
  }
];

export default function ShotsOnTargetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">SHOTS ON TARGET BETTING | BEGI...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                SoT <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "Shots on target filter out the luck of the goal—monetizing the intentionality of a player's tactical role."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the 'Clinical Definition' of an SoT using Opta standards. We analyze the distinction between shot volume and shot quality, reveal the secondary variable of 'Goalkeeper Parry-Rates,' and provide a professional framework for trading 'Desperation Velocity' in live markets.
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
