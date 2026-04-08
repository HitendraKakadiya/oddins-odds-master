'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'echo-chamber', 
    title: "The Echo Chamber of Choice: Your Brain's Shortcut", 
    content: (
      <>
        Confirmation bias is a cognitive shortcut where the brain prioritizes information that confirms its pre-existing beliefs while subconsciously filtering out contradictory evidence. In sports betting, this often manifests as a "locked-in" opinion on a team or outcome that survives even in the face of overwhelming negative data.
        <br /><br />
        <strong>The Psychological Mechanism:</strong>
        <br />
        • <strong>Selective Perception:</strong> Noticing every stat that favors your pick.
        <br />
        • <strong>Biased Interpretation:</strong> Explaining away negative news (e.g., "the injury won't matter").
        <br />
        • <strong>Memory Recall:</strong> Remembering your successful "gut feeling" bets while forgetting the failures.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'narrative-vs-data', 
    title: "Narrative vs. Data: Why Facts Lose to Stories", 
    content: (
      <>
        Human beings are hardwired for stories, not statistics. We are more likely to bet on a "narrative"—such as a team seeking revenge or a star player returning from injury—than we are to follow a dry probability model. Confirmation bias feeds these narratives, allowing us to build a case for almost any outcome by selectively picking data points.
        <br /><br />
        <strong>Narrative Traps:</strong>
        <br />
        • <strong>Recentism:</strong> Overweighting the most recent game highlights.
        <br />
        • <strong>Media Hype:</strong> Adopting the consensus opinion of pundits without verifying the stats.
        <br />
        • <strong>Emotional Attachment:</strong> Difficulty betting against a team you personally like.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'overconfidence-traps', 
    title: "Overconfidence Traps: The Blind Spots of Experience", 
    content: (
      <>
        Counterintuitively, the more experienced a bettor becomes, the more susceptible they may be to confirmation bias. Experts often believe their "intuition" is a valid data source, leading them to ignore new variables that contradict their established model. This is known as "Expert Blindness."
        <br /><br />
        <strong>The Dangers:</strong>
        <br />
        • <strong>Ignoring Regression:</strong> Expecting an outlier performance to continue indefinitely.
        <br />
        • <strong>Stake Escalation:</strong> Increasing bets because you are "sure" of a biased conclusion.
        <br />
        • <strong>Strategy Stagnation:</strong> Refusing to adapt your model because it worked in the past.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-neutrality', 
    title: "Operational Neutrality: Building an Unbiased Workflow", 
    content: (
      <>
        To achieve long-term profitability, you must move from emotional betting to <strong>Operational Neutrality</strong>. This requires a workflow designed to actively challenge your own assumptions before a single dollar is staked.
        <br /><br />
        <strong>The Neutrality Toolkit:</strong>
        <br />
        • <strong>The Devil’s Advocate:</strong> Force yourself to write three reasons why your bet will lose.
        <br />
        • <strong>Blind Audits:</strong> Review stats without team names to see if the value still exists.
        <br />
        • <strong>Betting Journals:</strong> Specifically track bets where you "ignored" red flags.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: "Objectivity as an Edge", 
    content: (
      <>
        In a market full of emotional, biased recreational bettors, <strong>objectivity is an edge</strong>. By recognizing your brain's natural tendency to seek confirmation, you can build systems that force you to look at the cold, hard reality of the numbers.
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
        question: "Is confirmation bias always a bad thing?",
        answer: "In betting, yes. While it's a helpful brain shortcut for daily life, it is lethal for capital management because it hides the real risks of a wager."
      },
      {
        question: "How can I tell if I'm being biased?",
        answer: "Ask yourself: 'What piece of information would make me change my mind about this bet?' If the answer is 'nothing,' you are suffering from severe confirmation bias."
      },
      {
        question: "Do professional syndicates suffer from this?",
        answer: "Less so. Pros use algorithmic models and team-based 'vetting' processes specifically designed to remove the individual human's biased perspective from the decision."
      },
      {
        question: "Does 'Value Betting' fix confirmation bias?",
        answer: "Only if you trust the numbers. Many bettors find value in the stats but then use confirmation bias to talk themselves *out* of the bet because they 'don't like' the team."
      }
    ]
  }
];

export default function ConfirmationBiasPage() {
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
          <span className="text-brand-emerald uppercase">CONFIRMATION BIAS</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Defeating <span className="text-brand-emerald">Confirmation Bias</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    "The brain is a master story-teller, but a terrible odds-maker. Learning to see the data as it is, not as you want it to be, is the ultimate betting discipline."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Confirmation bias is the invisible hand that moves you toward loss. It makes you prioritize the stories that agree with you while silencing the statistics that warn you. In this guide, we dive into the cognitive psychology of the betting mind and build a workflow designed for total objectivity.
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
