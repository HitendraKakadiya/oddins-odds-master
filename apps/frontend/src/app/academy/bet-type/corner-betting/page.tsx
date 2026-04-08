'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-corner-betting', 
    title: 'What Is Corner Betting?', 
    content: "Corner betting simply refers to placing bets on the number of corners that occur during a football match. These can be total match corners, corners per team, first-half or second-half corners, or even time-specific corners (e.g., first 10 minutes). It adds a new dimension to football betting, especially when goal markets are hard to call.\n\nThe main types of corner bets include:\n\n• Total Corners (Over/Under)\n• Team Corners (Over/Under)\n• Corner Race (First to 3, 5, 7 corners, etc.)\n• Time-Based Corner Bets\n• Corner Range Bets",
    advantages: [],
    risks: []
  },
  { 
    id: 'understanding-over-under', 
    title: 'Understanding Over/Under Corner Markets', 
    content: "The over/under market is the most popular when it comes to corners. You are betting on whether the number of corners in a game will be above or below a specific number.\n\nHere are common terms and what they mean:\n\n• **Over 3.5 Corners:** You need 4 or more corners in the match.\n• **Under 5.5 Corners:** You win if the match has 5 corners or fewer.\n• **Over 6.5 Corners:** You win if there are at least 7 corners in the game.\n• **Under 9.5 Corners:** You win if the total corners are 9 or fewer.\n• **Over 10.5 Corners:** You need at least 11 corners in the game to win.\n• **Under 10.5 Corners:** You win if there are 10 or fewer corners.\n\nOver/under bets on the number of corner kicks are settled regardless of which team earns the corners. It's all about the total number.",
    advantages: [],
    risks: []
  },
  {
    id: 'corner-range-meaning',
    title: 'What Does Corner Range Mean in Betting?',
    content: "Corner range bets refer to choosing a specific range within which the total number of corners will fall. For example:\n\n• **7+ Corner Range Meaning:** This usually means betting on 7 to 9 corners in a game.\n• **6-10 Corners:** Your bet wins if the total corners are between 6 and 10.\n• **11-15 Corners:** You win if the match produces anywhere from 11 to 15 corners.\n\nCorner range markets offer higher odds than simple over/under bets because the window is narrower. But they also carry more risk.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-to-predict-corner-totals',
    title: 'How to Predict Corner Totals?',
    content: "Predicting corners isn't about luck. It involves digging into match data, team styles, and game context.\n\nHere's what to consider:\n\n• **Attacking Style:** Teams that play with width and deliver a lot of crosses often win more corners. The likes of Liverpool or Manchester City are more likely to get more corners than Everton or Sunderland.\n• **Defensive Blocks:** Sides that park the bus force opponents to shoot or cross more, often leading to deflected balls and corners.\n• **Stats:** Look at average corners per game for both teams over the last 5 matches. If both teams average 5+ corners, an over 10.5 corners bet is realistic.\n• **Match Context:** In a must-win game or when one team is chasing a result, the corner count often goes up, especially in the second half.\n• **Weather and Pitch Conditions:** Wet pitches can lead to more corners due to deflections and mishits. Bad weather can also lead to more long balls and crosses.",
    advantages: [],
    risks: []
  },
  {
    id: 'corner-betting-strategy',
    title: 'Corner Betting Strategy',
    content: "Let's look at a few generic scenarios that show how corner bets might play out:\n\n• **One-Sided Attack:** Imagine a dominant home team playing against a relegation-threatened side. The stronger team controls possession and keeps pressing in front of the goal. They're likely to earn several corners through blocked crosses and deflected shots. A bet on over 10.5 corners makes sense here.\n• **Balanced Mid-Table Clash:** Two mid-table teams face off with similar playing styles, such as Everton and West Ham. Neither dominates the game, but both have spells of attack. In this case, betting on the 7+ corner range or 6-10 corners might be a smart call.\n• **Early Goal Shifts the Pattern:** A team scores early and then focuses on defence. The opposing side pushes hard to equalise, creating more attacking chances, crosses, and corners. This is a scenario where betting in-play on over corners late in the first half or early in the second half could work.",
    advantages: [],
    risks: []
  },
  {
    id: 'risk-factors',
    title: 'Risk Factors',
    content: "Corner betting is often less risky than goal betting, but not risk-free.\n\nHere's what can go wrong:\n\n• **Early Goals:** If one team scores early and then defends deep, the attacking pressure may reduce, leading to fewer corners for both sides. In such cases, even strong attacking teams might not reach their usual corner averages.\n• **Red Cards:** A red card can drastically change a team's approach. A team reduced to 10 players might completely give up on attacking, reducing the overall tempo and corner count of the game.\n• **Substitutions & Injuries:** Tactical substitutions, especially the removal of wide players or wing-backs, can reduce crossing opportunities and therefore corner potential.\n• **Game State Influence:** Teams that are already leading by two or more goals often take fewer risks, opting to control possession rather than attack relentlessly. This game management approach can limit corner opportunities in the final stages.\n\nThis is why it's smart to use corner bets in-play. Watching the momentum and patterns during the match can help you make the best decision for yourself. If the game opens up, corners can come up in plenty. On the other hand, if it stays tight, it's often best to avoid or look for under bets.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "Corner betting can be a pretty good way to make money if you take your time and watch the games. Whether you're going for over 8.5 corners or picking a range like 7 plus or 11 to 15, it helps to check the stats and understand how the teams play.\n\nDon't follow the hype or rush your bets. Take it slow and you'll start seeing better results. And if you're not sure, just watch the match first and place your bets during the game. Corner betting makes more sense when you know what's happening on the pitch",
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
        question: "What is a corner kick bet?",
        answer: "A corner kick bet is a wager placed on the number of corners that will be taken during a match, either overall, by a specific team, or within a specific timeframe."
      },
      {
        question: "Do corner bets count in extra time?",
        answer: "No, corner bets are typically settled based on the corners taken during the regular 90 minutes of play, including stoppage time, but excluding extra time or penalty shootouts unless specified."
      },
      {
        question: "What does 7+ corners mean?",
        answer: "Betting on '7+ corners' generally means you are predicting the match will have 7 or more total corners. In some range markets, '7+' specifically refers to a range like 7 to 9 corners."
      },
      {
        question: "What is the best strategy for corner bets?",
        answer: "The best strategy involves researching teams that play with width and generate a lot of crosses (high corners), checking team motivations (chasing a game leads to more corners), and monitoring in-play momentum changes."
      },
      {
        question: "What is a +1.5 corner handicap?",
        answer: "A +1.5 corner handicap is a bet where an underdog team is given a 1.5-corner head start. For your bet on that team to win, they must either get more corners than the opposition, or finish with only 1 fewer corner. It adds 1.5 to their final corner count."
      }
    ]
  }
];

export default function CornerBettingPage() {
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
          <span className="text-brand-emerald uppercase font-bold">CORNER BETTING GUIDE | LEARN...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Ultimate Corner Betting Guide
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Corner betting is one of the most underrated yet profitable markets in football betting. While most bettors chase win-draw-win or goal markets, corners often go unnoticed despite offering good value.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Understanding how corner betting works, what the various ranges mean, and how to bet smartly can give you an edge. This <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> guide covers everything you need to know about corner bets, including the meaning of terms like over 10.5 corners, under 5.5 corners, and 7+ corner ranges.
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
