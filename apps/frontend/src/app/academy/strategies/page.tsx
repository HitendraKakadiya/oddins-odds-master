'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyCardGrid from '@/components/Academy/StrategyCardGrid';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'bankroll-management', 
    title: 'Bankroll Management', 
    content: 'Learning how to handle your bankroll is one of the foundations of a successful online betting campaign. As a strategy, you must set aside a portion of your total amount to facilitate betting and manage it to extend playtime and minimise losses.\n\nSet a bet limit and stick to it. Do not chase losses under any circumstances. Also, it can be tempting to take on more challenges when you are on a hot streak, but resist it. Track your performance and spending; make necessary adjustments, if needed. Feel free to use the cashout option if you believe a certain bet will not go your way.',
    advantages: ['Helps with discipline.', 'Minimises losses.', 'Extends playtime, giving you the chance to learn and improve.'],
    risks: ['Requires strict emotional control', 'Can lead to burnout if not managed', 'Requires constant re-evaluation']
  },
  { 
    id: 'common-trends', 
    title: 'Betting against Common Trends', 
    content: 'Every soccer betting market is packed with popular opinions that most bettors like you will follow instead of going against. Understand that public betting has the potential to distort odds. As a result, it creates value for contradictory bets.\n\nSay, there is a football match between Chelsea and West Ham. Chelsea, being the superior team historically, will get the majority backing to squash West Ham. But if recent history leans towards West Ham coming out on top, then betting on it makes sense.',
    advantages: ['Yields superior returns on underdog bets.', 'Allows you to exploit fluctuations in odds.'],
    risks: ['Requires deep market knowledge', 'Psychologically difficult to go against crowd', 'High volatility in niche markets']
  },
  { 
    id: 'flat-betting', 
    title: 'Flat Betting Strategy', 
    content: 'Flat betting is a strategy that requires you to wager the same amount in every round, regardless of the bet history. It does not matter whether you win consecutive rounds or lose a string of bets; you do not alter your bet amount in this strategy. It is a low-risk scheme that supports bankroll management. The technique may feel restrictive when you are on a winning streak, but the benefits outweigh the limitations.',
    advantages: ['Keeps decision-making simple by eliminating the role of emotions.', 'Helps maintain your bankroll when you are on a losing streak.', 'Easy to track and assess results.'],
    risks: ['Slow bankroll growth', 'Does not exploit high-confidence situations', 'Can feel repetitive']
  },
  { 
    id: 'hedging', 
    title: 'Hedging', 
    content: 'When you hedge bets, you place extra bets to lock in your profits or reduce risk. It is a strategy most commonly used in live betting or in circumstances where bets change.\n\nYou start by placing a standard bet on the desired outcome. If the odds change or the game dynamic alters in any way, you place a subsequent bet on the opposing outcome. This way, you can keep your losses to a minimum. It requires you to think on your feet while having market knowledge beforehand.',
    advantages: ['Minimises risks and guarantees situational profits.', 'Best results are achieved when used in volatile markets.'],
    risks: ['Lower overall profit ceiling', 'Requires quick execution skills', 'Subject to bookmaker limits']
  },
  { 
    id: 'value-bets', 
    title: 'Value Bets', 
    content: 'Value betting requires you to discover betting markets where odds offered by the bookmakers are higher than the outcome\'s actual probability. The strategy gives you an advantage over the house.\n\nYou must also know the mathematical formula to get the most out of this betting strategy. For decimal odds, implied probability = (1 / odds) * 100. For odds of 2.00, 50% is the implied probability.\n\nFor example, if a bookmaker offers the odds of 2.50 for a team\'s victory (40% implied probability), but your research shows a 50% chance, you must consider it as a value bet because 50% > 40%.',
    advantages: ['You can apply the formula to determine odds for sports markets, casinos, or other markets.', 'In the long run, it gives players a mathematical edge over bookmakers.'],
    risks: ['Still carries individual match risk', 'Requires complex probability calculations', 'Odds move extremely fast']
  },
  { 
    id: 'arbitrage', 
    title: 'Arbitrage', 
    content: 'Arbitrage betting can be a risk-free strategy, which allows you to bet on all possible outcomes of a game across different bookmakers. It guarantees profit irrespective of the result. So, the combined implied probabilities of all outcomes will be less than 100%.\n\nFor instance, if you bet on a football match where the first bookmaker has an implied probability of 47.62% for Manchester City and the second bookmaker has 48.78% for Crystal Palace. The total implied probability is 96.4%, creating an arbitrage opportunity.',
    advantages: ['Carries low risk when compared to other betting strategies.', 'Guaranteed profit, if executed properly.'],
    risks: ['Risk of account limitations (Gubbing)', 'Odds moving before both legs placed', 'Human error in calculations']
  },
  { 
    id: 'avoid-chasing-losses', 
    title: 'Avoid Chasing Losses', 
    content: 'Chasing losses requires you to increase your bets in order to cover previous losses. This defies the merit set by bankroll management and often leads to reckless decision-making.\n\nEnsure that you take losses within your stride and stick to your bankroll management practices. When on a losing streak, take a break and reassess your betting strategy. Read your losses to determine faulty betting patterns instead of betting more.',
    advantages: ['Protects remaining capital', 'Builds mental resilience', 'Prevents revenge betting traps'],
    risks: ['Requires extreme self-discipline', 'Psychologically taxing', 'Slow recovery period']
  },
  { 
    id: 'matched-betting', 
    title: 'Matched Betting', 
    content: 'When done well, matched betting is virtually risk-free. The strategy allows you to capitalise on bookmaker promotions such as free bets and other similar bonuses.\n\nBy using a combination of bookmaker and exchange accounts, you can virtually guarantee yourself a profit after betting on all possible outcomes of an event.',
    advantages: ['Matched betting is accepted across all sports betting markets.', 'Guarantees bonuses via free bets and bonuses.'],
    risks: ['Limited by available offers', 'Potential for "Gnoming" bans', 'Time-consuming to track']
  },
  { 
    id: 'kelly-criterion', 
    title: 'Kelly Criterion', 
    content: 'If you are someone with strong analytical skills and are comfortable taking calculated risks, the Kelly Criterion strategy can help. It uses a mathematical equation aimed at optimising the bet size on the odds offered by the bookmaker and your perceived odds. The strategy also facilitates maximising bankroll while minimising losses.\n\nThe formula is: f = (bp - q) / b, where:\n- f is a fraction of the bankroll to bet\n- b is decimal odds - 1\n- p is the estimated probability of winning\n- q is 1-p (probability of losing)\n\nFor example, if you bet on a football match where Manchester City has odds of 2.10 to win, and your estimated probability is 50% (0.50). Here\'s how the variables look:\n- b = 2.10 - 1 = 1.10\n- p = 0.50\n- q = 1 - 0.50 = 0.50\n\nAfter applying the formula: f = (1.10 × 0.50 - 0.50) / 1.10 = 0.05 / 1.10 = 0.0455. As a result, you should bet 4.55% of your bankroll.',
    advantages: ['It facilitates long-term bankroll growth.', 'The strategy is adaptable to a variety of odds and probabilities.', 'It allows you to balance risk and reward based on your edge.'],
    risks: ['Highly sensitive to probability estimates', 'Large bankroll swings (Volatility)', 'Complex day-to-day application']
  },
  { 
    id: 'halo-effect', 
    title: 'Halo Effect', 
    content: 'The Halo Effect strategy is an interesting concept, as it allows you to exploit other bettors\' overestimation of a team or a player based on their past success or reputation.\n\nTo achieve success, you must identify matches where a player or a team is hyped up due to their fame and recent success. Once done, bet against that team or player if your analysis suggests value for the opposition. If your bet wins, you might receive handsome returns for taking a chance on the underdog.',
    advantages: ['The halo effect strategy facilitates the exploitation of bias created by the public.', 'It gives you generous returns for backing an underdog.'],
    risks: ['Hard to quantify bias impact', 'Requires deep news monitoring', 'Can be highly subjective']
  },
  { 
    id: 'confirmation-bias', 
    title: 'Confirmation Bias', 
    content: 'The Confirmation Bias strategy helps you fight the habit of backing teams or players just because you already believe they\'re good, not because the stats say so. It ties in with the Halo Effect, where one good trait makes you ignore everything else.\n\nYou must identify such betting markets and bet on the less-favoured teams and players. If the latter\'s current form has been superior, you will receive inflated odds, and if the bet wins, you will earn higher returns.',
    advantages: ['It squashes market overreactions, thus promoting pragmatic outcomes.', 'Improves decision-making with objective analysis.'],
    risks: ['Hard to identify in oneself', 'Requires constant self-reflection', 'Easy to fall back into habits']
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: 'When you adopt football betting strategies, they build a learning curve that teaches discipline. While basic strategies take less time to master, advanced strategies require patience. So, start with the basics before taking on complex equations.\n\nFinally, understand that no strategy guarantees straightforward profits. The outcome depends on how well you execute them with a focus on long-term consistency.',
    advantages: [],
    risks: []
  },
];

export default function AcademyStrategiesPage() {
  const [activeSection, setActiveSection] = useState('bankroll-management');

  // Handle scroll-based section activation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find entries that are intersecting
      const intersecting = entries.filter(entry => entry.isIntersecting);
      
      // If we have several, the last and most recently triggered one usually represents the current position
      if (intersecting.length > 0) {
        // Sort by their vertical position to be sure, or just take the last one
        const latest = intersecting[intersecting.length - 1];
        setActiveSection(latest.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Start observing each section
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 order-2 lg:order-1">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <Link href="/academy" className="hover:text-brand-emerald transition-colors">Academy</Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-slate-900">Betting Strategies</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Football Betting Strategies
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              Professional football betting involves critical thinking and disciplined strategy. 
              Our guide explains the most effective systems to help you manage your bankroll and make smarter decisions.
            </p>
          </header>

          {/* Strategy Card Grid */}
          <div className="mb-16">
            <StrategyCardGrid />
          </div>

          {/* Detailed Content Sections */}
          <div className="space-y-12 mb-16">
            {sections.map((section) => (
              <StrategyContentSection 
                key={section.id}
                id={section.id}
                title={section.title}
                content={section.content}
                advantages={section.advantages}
                risks={section.risks}
                isActive={activeSection === section.id}
                variant="premium"
              />
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2">
          <div className="sticky top-24 space-y-8">
            {/* Table of Contents */}
            <StrategyTOC sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} />
            
            <div className="hidden lg:block">
              <TodaysMatchesWidget />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
