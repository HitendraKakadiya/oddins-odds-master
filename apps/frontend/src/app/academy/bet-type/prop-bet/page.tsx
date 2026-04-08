'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-a-prop-bet', 
    title: 'What Is a Prop Bet?', 
    content: "A prop bet is a wager on something that happens during a game, but not necessarily the final result. It answers a \"yes or no\" question or a specific measurable event.\n\nFor example:\n• Will LeBron James score over 25 points tonight?\n• Which team will score the first touchdown?\n• Will there be a penalty in the match?\n\nUnlike traditional bets that focus on the outcome of a match, prop bets focus on individual players, team milestones, or in-game events. Prop bets have become very popular in North America and are now common across the rest of the world, too.\n\nYou'll see them a lot during big games and major leagues, where online bookmakers offer hundreds of markets on both players and the game itself.",
    advantages: [],
    risks: []
  },
  { 
    id: 'types-of-prop-bets', 
    title: 'Types of Prop Bets', 
    content: "Prop bets come in many forms, and understanding the different types helps you choose the right markets and strategies that match your style of betting.\n\nBelow, you will find the most common types:\n• **Player Props:** These are bets on a specific player's performance. In basketball, it could be points, assists, or rebounds. In football, it might be passing yards or touchdowns.\n• **Team Props:** These involve outcomes tied to the entire team. For example, betting on the Lakers to score more than 110 points in a game, regardless of whether they win or lose.\n• **Game Props:** These focus on certain events during a match. For example, wagering on whether there will be overtime in an NBA game or if a football match will have more than 10 corners.\n• **Novelty Props:** These are more unusual and often appear during major events. For instance, betting on the coin toss in the Super Bowl or on who will win an MVP award.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-do-prop-bet-odds-work',
    title: 'How Do Prop Bet Odds Work?',
    content: "Prop bet odds are presented in the same way as other sports bets.\n\nLet's say you see:\n\n**Over 22.5 Points for Kevin Durant: 1.90.** This means if you place $100, you'll get a return of $190 if Durant scores 23 or more points.\n\nHere is the calculation:\n• **Stake** = $100\n• **Odds** = 1.90\n• **Payout** = 1.90 × 100 = $190\n• **Profit** = $90\n\nUnderstanding how to translate odds into implied probability is key - if a line is 1.90, it implies about a 52.6% chance of happening.",
    advantages: [],
    risks: []
  },
  {
    id: 'why-bettors-love-prop-bets',
    title: 'Why Bettors Love Prop Bets',
    content: "When you dive into prop betting, you're stepping into a whole new level of action that traditional bets can't match.\n\nHere's why you'll love prop bets and keep coming back for more:\n• **Entertainment Value:** With prop bets, you don't need to wait until the final whistle to know if you've won. You can lock in on a single player, a specific stat. This makes every moment of the game more exciting because you're invested in more than just the outcome.\n• **More Opportunities:** Every game is filled with dozens, sometimes hundreds, of prop markets. This gives you far more opportunities to find value.\n• **Stat-Driven Edge:** Player props in particular can be broken down using stats like averages, minutes played, or matchup history.\n• **Variety and Flexibility:** From points scored to number of fouls, or even whether a game will go into overtime, props let you bet on almost anything.",
    advantages: [],
    risks: []
  },
  {
    id: 'where-to-place-prop-bets',
    title: 'Where to Place Prop Bets?',
    content: "While almost every online bookmaker offers this market, not all are equal.\n\nWhen choosing a site for prop betting, look for:\n\n• **Depth of Markets:** The best betting sites offer hundreds of props per NBA or NFL game.\n• **Competitive Odds:** Even a small difference in odds can have a large impact in the long run. Some bookmakers are known to offer better odds than others.\n• **Live Betting:** Many props are released while the game is taking place. This created in-play opportunities.\n• **Secure Payments:** Ensure the betting site is legal in your country. SSL encryption and reliable payment gateways are in place.",
    advantages: [],
    risks: []
  },
  {
    id: 'tips-for-winning-prop-bets',
    title: 'Tips for Winning at Prop Bets',
    content: "Prop bets may look simple, but winning consistently takes more than just a gut feeling. By following a few proven tips, you can give yourself a real edge and avoid the common mistakes.\n\n• **Do Your Research:** Player form, injuries, minutes, and matchups matter more than overall team strength.\n• **Track Stats:** Keep a record of how players perform against specific opponents or in certain conditions.\n• **Focus on One Market:** Rather than betting randomly, specialise in one stat (like NBA assists or NFL rushing yards).\n• **Bankroll Management:** Bet a fixed percentage (1-2%) of your bankroll to avoid swings.\n• **Avoid Chasing:** If you lose, don't double down emotionally. Stick to your strategy.\n• **Use In-Play Wisely:** Sometimes betting during the game gives you better information, especially if you notice a player's role has changed.",
    advantages: [],
    risks: []
  },
  { 
    id: 'final-thoughts', 
    title: 'Final Thoughts', 
    content: "Prop bets are one of the most exciting and potentially profitable ways for you to bet on sports. Whether you place an NBA prop bet, try a football proposition bet, or explore a special market, you get countless opportunities to find value.\n\nIf you are new to this, start by focusing on one market, such as a player prop bet and build your strategy gradually.",
    advantages: [],
    risks: []
  },
  { 
    id: 'faqs', 
    title: 'FAQs', 
    content: '',
    advantages: [],
    risks: [],
    faqs: [
      {
        question: "What is a prop bet?",
        answer: "A prop (proposition) bet is a wager on a specific occurrence or non-occurrence of an event during a game that doesn't inherently affect the final outcome."
      },
      {
        question: "Are prop bets worth it?",
        answer: "Yes, they can be highly valuable if you do your research. Since there are so many prop markets, bookmakers often struggle to set perfect lines for every single one, allowing smart bettors to find edges."
      },
      {
        question: "What is a prop bet 2+ touchdown?",
        answer: "A '2+ touchdown' prop bet means you are wagering that a specific player will score at least two touchdowns during a single game."
      },
      {
        question: "What are some common prop bets?",
        answer: "Common prop bets include player totals (e.g., Over/Under passing yards or points), team totals, who will score first, and game-specific events like will there be a safety or a penalty."
      },
      {
        question: "What is an example of a prop?",
        answer: "An example of a prop bet is a wager on whether Erling Haaland will have Over 1.5 Shots on Target in an upcoming match, or if LeBron James will score more than 28.5 points."
      }
    ]
  }
];

export default function PropBetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">PROP BETS EXPLAINED | LEARN HOW...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Prop Bet Guide
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    'Prop bet', 'proposition bet', or 'player prop', if these terms confuse you when looking at an online bookmaker, don't worry. This guide will explain them in plain language and show you how they work. You'll learn what prop bets are, how the odds make sense, how fans use them, where to find the best betting markets, and see real examples with practical tips.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    By the end of this <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> guide, you'll know how to spot value and place smarter, safer bets.
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
