'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'disciplinary-quantization', 
    title: 'Disciplinary Quantization: The Booking Point Scale', 
    content: (
      <>
        Booking Points represent the <strong>mathematical quantization of match discipline</strong>. Instead of merely counting cards, bookmakers assign specific point values to &apos;Yellow&apos; and &apos;Red&apos; incidents to create a high-resolution market for match aggression.
        <br /><br />
        <strong>The Universal Point Hierarchy:</strong>
        <br />
        • <strong>Yellow Card:</strong> 10 Points.
        <br />
        • <strong>Red Card:</strong> 25 Points.
        <br />
        • <strong>The &apos;Double-Yellow&apos; (Yellow + Red):</strong> 35 Points. In this scenario, the second yellow is discarded, and the player is credited with 10 (1st Yellow) + 25 (Red). Mastering these totals is essential for accurate margin analysis.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'referee-profiling', 
    title: 'The Third Team: Referee Profiling', 
    content: (
      <>
        In the Booking Points market, the referee is often more significant than the two teams on the pitch. Professional analysts maintain <strong>&quot;Strictness Coefficients&quot;</strong> for officials.
        <br /><br />
        <strong>Key Variables:</strong>
        <br />
        • <strong>Cards-Per-Game (CPG):</strong> The average volume of cards an official issues.
        <br />
        • <strong>The &apos;Early-Tone&apos; bias:</strong> Referees who issue yellow cards in the first 15 minutes are statistically more likely to trigger a 50+ point match, as early bookings limit players&apos; ability to commit &quot;tactical fouls&quot; later in the game.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'environmental-triggers', 
    title: 'The Derby Multiplier: Environmental Triggers', 
    content: (
      <>
        Psychological load dictates card volume. High-intensity environments—such as <strong>Local Derbies</strong> or <strong>Relegation Deciders</strong>—drastically lower the threshold for tactical and emotional fouls.
        <br /><br />
        <strong>Spotting the 60+ Point Spike:</strong>
        <br />
        Look for matchups featuring high-frequency dribblers (who draw fouls) against aggressive &quot;enforcer&quot; midfielders. If the match has historical disciplinary baggage, the probability of multiple 25-point red cards increases, making the &quot;Over&quot; markets highly attractive.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-risk', 
    title: 'Operational Risk: Calculating the Tipping Point', 
    content: (
      <>
        The primary operational risk in this market is the <strong>35-point cap per player</strong>. Most sportsbooks cap a single player&apos;s contribution at 35 points, even if they receive multiple yellows followed by a straight red.
        <br /><br />
        <strong>Technical Tip:</strong>
        <br />
        Always check the specific bookmaker&apos;s &quot;Settlement Rules.&quot; Cards shown to substitutes (not on the pitch) or coaching staff traditionally contribute <strong>zero points</strong> to the total. Ignoring these nuances can lead to a &quot;Winning Loss&quot; during settlement.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Mastering the Whistle', 
    content: (
      <>
        Booking Points allow you to monetize the psychological state of a match. It is the clinical market for analysts who understand that football is played on a spectrum of discipline. Profile your referee, analyze the environment, and quantize the aggression.
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
        question: "Does a Straight Red card count as 25 or 35 points?",
        answer: "A straight red card is almost universally 25 points. The 35-point total only occurs if the player had already received a yellow card (10 points) before being sent off."
      },
      {
        question: "Do cards shown after the final whistle count?",
        answer: "Usually, no. Most markets only settle on cards shown between the kick-off and the end of regular time. Always verify your bookmaker&apos;s specific &apos;Settlement Window&apos;."
      },
      {
        question: "What is the 'Time of First Booking' market?",
        answer: "This is a prediction of how early the first 10-point increment (Yellow) will occur. It is highly dependent on the referee&apos;s profiling and the match&apos;s importance."
      },
      {
        question: "How do VAR reviews affect Booking Points?",
        answer: "VAR can significantly increase the frequency of 25-point red cards. Referees who are frequently called to the screen for &apos;Violent Conduct&apos; reviews are prime candidates for high-scoring booking matches."
      }
    ]
  }
];

export default function BookingPointsPage() {
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
          <span className="text-brand-emerald uppercase font-bold">BOOKING POINTS</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Booking Points <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Booking points are the mathematical quantization of aggression—monetizing the psychological state of a match.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the clinical point hierarchy of disciplinary markets. We analyze the crucial variable of &apos;Referee Profiling,&apos; identify the specific environmental triggers for &apos;60+ Point Spikes,&apos; and reveal the operational risks of the 35-point &apos;Double-Yellow&apos; settlement cap.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => (
                <div key={section.id}>
                  <StrategyContentSection {...section} isActive={activeSection === section.id} />
                </div>
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
