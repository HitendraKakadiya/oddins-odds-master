'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-does-ht-ft-mean', 
    title: 'What Does HT/FT Betting Mean in Football?', 
    content: "In an HT/FT bet, you are predicting two results within the same game: the result at half-time and the final result at full-time. Both predictions must be correct for your bet to win. In football betting, three possible outcomes exist for each half: Home win (1), Draw (X), or Away win (2).\n\nWhen combined, this gives nine possible HT/FT outcomes:\n\n• **1/1** – Home team leads at half-time and wins at full-time.\n• **1/X** – Home team leads at half-time, match ends in a draw.\n• **1/2** – Home team leads at half-time, away team wins.\n• **X/1** – Draw at half-time, home team wins full-time.\n• **X/X** – Draw at both half-time and full-time.\n• **X/2** – Draw at half-time, away team wins full-time.\n• **2/1** – Away team leads at half-time, home team wins full-time.\n• **2/X** – Away team leads at half-time, match ends in a draw.\n• **2/2** – Away team leads at half-time and wins at full-time.\n\nFor example, when you see \"home/draw halftime/fulltime\" in betting terms, it refers to the 1/X option. This means you expect the home side to be leading after the first half, but for the away side to claw back and level the match by the end.\n\nSimilarly, home/away halftime/fulltime refers to 1/2, where the home team is ahead at the break, but the away team finishes as the winner.\n\nAs you can see, there are different ways of naming the outcomes, either with numbers or with the sides of the teams. It's important to understand that they have the same meaning and that the list above shows you the full range of outcomes.",
    advantages: [],
    risks: []
  },
  { 
    id: 'why-should-i-choose', 
    title: 'Why Should I Choose the HT/FT Market?', 
    content: "The main attraction of HT/FT betting is the odds. Because you are predicting two separate outcomes, bookmakers price these markets higher than standard 1X2 bets. For example, if a strong favourite is playing at home, a straight win might be offered at 1.30 odds. The same result predicted as HT/FT - 1/1 could jump to 1.80 or higher. This makes it a way to get better value while placing bets.\n\nHowever, the decision isn't easy. Even if you correctly call the full-time result, getting the half-time position wrong means you lose. If the strong team starts off slowly, you're still likely to lose your bet.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-it-differs',
    title: 'How HT/FT Differs from Standard 1X2',
    content: "A 1X2 bet asks for one prediction: the result at full-time. In contrast, an HT/FT bet is like putting two 1X2 bets together - one for half-time, one for full-time.\n\nSo, while in a 1X2 you might simply back the home team to win, in HT/FT you could choose 1/1 if you think they will dominate both halves, or X/1 if you expect a slower start followed by a strong finish. The x/1 meaning in betting specifically refers to a match that is level at half-time but ends with a home win. This is a common choice when the home side tends to start cautiously but grows into the game.",
    advantages: [],
    risks: []
  },
  {
    id: 'real-match-example',
    title: 'Real Match Example',
    content: "Imagine a Premier League clash between Chelsea and Aston Villa giving you the perfect HT/FT opportunity.\n\nChelsea are heavy favourites, but you know Aston Villa often defend deep in the first half. So, you go for X/1 - expecting a tight first half and a Chelsea surge after the break. The match stays 0-0 at half-time, just as you predicted. In the second half, Chelsea's midfield took control, scoring twice to seal a 2-0 win.\n\nYour X/1 bet pays out at odds of 2.80, far better than the 1.40 you'd get for a straight home win.",
    advantages: [],
    risks: []
  },
  {
    id: 'factors-to-consider',
    title: 'Factors to Consider Before Placing an HT/FT Bet',
    content: "Successful half-time/full-time betting comes down to understanding patterns.\n\nHere are the main elements to study:\n\n• **Team tendencies** - Some teams start fast and fade, while others take time to build momentum.\n• **Home vs away form** - The home/away halftime/fulltime bets work best when you understand how each team performs in their respective roles.\n• **Manager tactics** - Coaches who prefer attacking from the whistle may create more 1/1 or 2/2 scenarios. Defensive managers often produce X/X results.\n• **In-game context** - Is the match part of a tight schedule? Are players being rested? Cup ties, relegation battles, and title deciders can influence energy levels across halves.\n• **Head-to-head history** - Some fixtures repeatedly follow the same pattern, offering insight into likely HT/FT outcomes.",
    advantages: [],
    risks: []
  },
  {
    id: 'common-mistakes-to-avoid',
    title: 'Common Mistakes to Avoid in Half Time Full Time Bet',
    content: "Halftime/Fulltime betting can reward good analysis, but it also punishes careless decisions. Many losses in this market come from predictable errors that can be avoided with the right approach. If you understand these mistakes, you can improve your chances of consistent wins.\n\n• **Backing favourites blindly** - Strong teams don't always start fast; check first-half scoring stats before going for 1/1.\n• **Ignoring match conditions** - Weather, pitch quality, and even kickoff time can slow down early play, changing likely HT/FT outcomes.\n• **Chasing rare reversals** - Results like 2/1 or 1/2 offer big odds but occur infrequently without clear tactical reasons.\n• **Underestimating derbies and cup ties** - Rivalry intensity or second-leg strategy can disrupt expected match flow.\n• **Forgetting extra-time rules** - HT/FT bets are settled on 90 minutes only; extra time and penalties don't count.",
    advantages: [],
    risks: []
  },
  {
    id: 'ht-ft-in-other-sports',
    title: 'HT/FT in Other Sports',
    content: "While you probably associate half-time/full-time betting with football, you can use the same concept in other sports that have distinct halves or periods.\n\nIn basketball, for example, you can bet on who will be leading at half-time and at full-time. Because scoring is more frequent, the lead can change multiple times, making patterns harder to predict than in football.\n\nRugby and American football also offer this market, but the flow of play and scoring patterns are very different, so your approach needs to adapt. If you bet on HT/FT in these sports, focus on how teams perform in each half rather than just their overall form.\n\nSome basketball teams start aggressively before tiring, while in rugby, momentum shifts often come after substitutions. Understanding these patterns is key to making accurate predictions.",
    advantages: [],
    risks: []
  },
  { 
    id: 'final-thoughts', 
    title: 'Final Thoughts', 
    content: "The half-time/full-time market is for you if you enjoy breaking down how a game will play out and spotting patterns most bettors miss. It's not just about picking the winner - it's about predicting how the match will unfold from the first whistle to the last.\n\nWhen you understand terms like home/draw halftime/fulltime, home/away halftime/fulltime, and x/1 in betting, you give yourself the clarity and confidence to start placing bets on this exciting market.",
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
        question: "What does half time/full time mean in betting?",
        answer: "Half-time/full-time betting is a market where you predict the result at the end of the first half and the final outcome of the match. For your bet to win, both predictions must be correct."
      },
      {
        question: "How does a half time/full time bet work?",
        answer: "You simply pick the outcome for the first half (Home win, Draw, Away win) and combine it with the final result at full-time. For example, selecting 1/X means you predict the Home team will lead at half-time, but the match will end in a Draw."
      },
      {
        question: "Is a half-time/full-time bet worth it?",
        answer: "Yes, if you do your research and understand team patterns. Because you are making two predictions instead of one, HT/FT markets usually offer significantly higher odds and better value than standard 1X2 bets."
      },
      {
        question: "Do half-time/full-time bets include overtime?",
        answer: "No. Just like standard full-time result bets, half-time/full-time bets are settled at the end of regular time (90 minutes plus injury time in football). Extra time and penalty shootouts do not count."
      },
      {
        question: "How to bet on halftime performance?",
        answer: "If you only want to bet on a team's performance strictly during the first half, you should look for the 'Half Time Result' market instead, which is settled entirely based on the score at half-time, regardless of the full-time result."
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
                Halftime/Fulltime (HT/FT) Betting Guide
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Half-Time / Full-Time betting, that is often referred to as HT/FT, lets you predict not just the result at full-time, but also who leads at half-time. It's an all-or-nothing wager: both halves must go your way for a payout, making it harder than a straight 1X2 bet, but the payoff can be much sweeter.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> article breaks down what HT/FT means, its variations, practical examples, strategic angles, common mistakes, and some professional tips.
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
