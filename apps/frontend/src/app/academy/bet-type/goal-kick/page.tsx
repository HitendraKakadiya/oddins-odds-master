'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-goal-kick-betting', 
    title: 'What Is Goal Kick Betting?', 
    content: "If you've been betting on football for a while, you probably stick to the familiar markets – match winner, over/under goals, maybe corners or cards. But there’s a quieter, lesser-known bet type option that can open up fresh angles and value: goal kick betting.\n\nUnlike the usual markets that everyone follows, goal kick bets let you predict something that happens dozens of times in a match but rarely gets the spotlight. A goal kick happens when the ball crosses the goal line, last touched by the attacking team, without a goal being scored. The defending side restarts play from within their goal area. bookmakers have turned this regular event into a countable, trackable betting market.",
    advantages: [],
    risks: []
  },
  { 
    id: 'types-of-goal-kick-bets', 
    title: 'The Main Types of Goal Kick Bets', 
    content: "When you open up a betting site that offers this market, you’ll usually find a few variations:\n\n• **Total Goal Kicks (Over/Under):** You bet on whether the total number of goal kicks in the match will be over or under a set line. Example: Over 10.5 or Under 10.5.\n• **Goal Kick Ranges:** Instead of just over/under, you choose a bracket like 0-5, 6-10, 11-15. If the match ends with that total, you win.\n• **First Goal Kick:** You predict which team will take the first goal kick of the match.\n• **Last Goal Kick:** You predict which team will take the last goal kick before the final whistle.\n• **Team-Specific Totals:** Some bookies also offer markets on how many goal kicks one specific team will take.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-bookies-settle',
    title: 'How do Bookmakers Settle Goal Kick Bets?',
    content: "Before you place a goal kick bet, always check how your bookmaker defines and settles it. In general, here is what you can expect:\n\n• A goal kick counts once the referee officially awards it. Even if the kick is retaken due to encroachment or a technical error, it still only counts as one.\n• Bets usually cover the full 90 minutes plus added time, but not extra time or penalties.\n• If a match is abandoned or postponed, most bookmakers void the bet unless the game is completed within a set period.\n\nIt's worth noting that rules can differ slightly between betting sites. Always read the terms and conditions before betting.",
    advantages: [],
    risks: []
  },
  {
    id: 'why-bet-on-goal-kicks',
    title: 'Why Bet on Goal Kicks?',
    content: "At first glance, betting on goal kicks may seem odd. But there are solid reasons why this market can be worth your time:\n\n• **Less Attention:** Other bettors tend to ignore this market, which means the odds aren’t always as sharp as in popular markets.\n• **Predictable Patterns:** Teams that dominate possession and shoot often will force their opponents into conceding more goal kicks. Defensive teams under pressure naturally take more.\n• **In-play Opportunities:** If you’re watching a match and notice a clear trend – for example, constant shots going wide – you can jump in with a live bet on goal kicks.",
    advantages: [],
    risks: []
  },
  {
    id: 'factors-influence-goal-kicks',
    title: 'Factors That Influence Goal Kicks',
    content: "If you want to win on goal kick betting, you need to look deeper than just guessing. Here are the main factors that affect how many goal kicks happen in a match:\n\n• **Team styles:** High-pressing teams and those that take lots of shots usually create more goal kicks for their opponents.\n• **Shot volume and accuracy:** A team that takes 20 shots with half going off-target will almost guarantee plenty of goal kicks.\n• **Match state:** A team leading by a goal might defend deep, inviting more shots and more goal kicks.\n• **Pitch conditions:** Poor weather or a heavy pitch can make shots less accurate, leading to more goal kicks.\n• **Referee approach:** Some referees are stricter with restarts, while others allow more play to continue. This can slightly affect totals.",
    advantages: [],
    risks: []
  },
  {
    id: 'live-goal-kick-betting',
    title: 'Live Goal Kick Betting',
    content: "In-play betting is where goal kick markets can get really interesting. Odds often lag behind match events, which means you can catch value if you’re paying attention.\n\nFor example, if there have already been 7 goal kicks by halftime and the line is still at Over 10.5, you might get strong odds to back the over, knowing the match is trending that way. The key is to combine live viewing with your pre-match research.",
    advantages: [],
    risks: []
  },
  {
    id: 'strategies-to-use',
    title: 'Strategies to Use',
    content: "Here are a few tested strategies you can apply when betting on goal kicks:\n\n• **Research shot data:** Look at average shots per team, shot accuracy, and shots conceded. This is the strongest predictor of goal kicks.\n• **Target mismatches:** Games where one team dominates possession often lead to high totals for the underdog.\n• **Avoid low-stakes friendlies:** Matches with little intensity produce fewer shots, which means fewer goal kicks.\n• **Use ranges:** If your bookmaker offers 6-10, 11-15 brackets, these can give you better value than a straight over/under.\n• **Keep stakes small:** Goal kick markets don’t have the same liquidity as match winner markets, so don’t overcommit.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "Adding goal kicks to your betting portfolio gives you a new angle that most people ignore. You’re no longer tied only to goals or match outcomes, but to an event that happens dozens of times a game. If you do your homework, read the patterns, and manage your stakes, this market can give you a steady, lower-profile way of finding value.\n\nThe key is treating it seriously: study the stats, check the bookmaker rules, and use live betting smartly. Once you start building confidence, you’ll see how goal kicks can be more than just a restart – they can be a winning bet.",
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
        question: "What is a goal kick in betting?",
        answer: "A restart of play by the defending team after the ball goes out of play over the goal line, having been last touched by an attacking player."
      },
      {
        question: "Are goal kicks difficult to predict?",
        answer: "Not necessarily. If you analyze team shot volume and accuracy (specifically shots that miss the target), patterns become very predictable."
      },
      {
        question: "Do own goals count in goal kick bets?",
        answer: "No. A goal kick only occurs when the ball goes out of play without a goal being scored. An own goal is settled as a regular goal."
      }
    ]
  }
];

export default function GoalKickPage() {
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
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">GOAL KICK BETTING</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Goal Kick <span className="text-brand-emerald">Betting Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Looking for a fresh angle in football betting? Moving beyond the usual 1X2 and Over/Under markets can reveal quieter, high-value opportunities.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="text-brand-emerald font-bold">OddinsOdds Academy</span> guide shows you exactly what goal kick betting is, how bookies settle it, and smarter strategies you can use to find value in this trackable market.
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
