'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-are-booking-points', 
    title: 'What Are Booking Points in Football?', 
    content: "Booking points in football refer to a numerical system online bookmakers use to measure the number of yellow and red cards shown during a match. Instead of simply counting the number of cards, betting sites assign points to each card.\n\nThese points are used to create markets for you if you want to bet on the intensity or discipline level of a match, rather than just the scoreline.\n\n### How Are Booking Points Calculated?\nTo place a bet on booking points, you need to understand how booking points are calculated in detail. This calculation is not random. It’s a fixed system that bookmakers apply to assign values to cards shown during the game. These values are then used to determine if your bet has won or lost, depending on the market you’ve chosen.\n\nHere’s how booking points are allocated:\n\n• **A single yellow card** shown to a player earns 10 booking points.\n• **A direct red card** (without a prior yellow) earns 25 booking points.\n• If a player receives **two yellow cards resulting in a red**, the total is 35 booking points – this combines 10 points for the first yellow and 25 for the red card. The second yellow itself is not counted separately.\n\nLet’s clarify this with examples:\n\n• **Scenario 1:** A player receives one yellow card = 10 booking points.\n• **Scenario 2:** A player receives a straight red card = 25 booking points.\n• **Scenario 3:** A player gets two yellows, which lead to a red = 35 booking points (10 + 25).\n\nThese points are cumulative. If a match has 6 yellow cards and 1 red card, the total booking points would be 85 points (6 × 10 = 60 for yellows, 1 × 25 = 25 for red).\n\n**Do note** that cards issued to managers or coaching staff do not count toward booking points. Additionally, the booking time market usually only includes cards that are shown during the regular 90 minutes plus overtime, excluding extra time and penalties.\n\n### Why Do Bookmakers Use Booking Points?\nInstead of offering bets like 'over 3.5 cards,' bookmakers use booking points to provide more flexibility and options. With booking points, you can:\n\n• Bet on a broader range of outcomes (e.g., 0-30, 31-60, 61+ points)\n• Combine yellow and red cards into one market\n• Predict team-specific or half-specific outcomes",
    advantages: [],
    risks: []
  },
  { 
    id: 'popular-markets', 
    title: 'Popular Booking Points Markets', 
    content: "Booking points betting has caught on lately; it makes even a one-sided match more fun to watch. Instead of just picking a winner, you’re keeping an eye on the referee and how many cards get handed out.\n\n### Total Booking Points (Over/Under)\nThis is the most straightforward market. You’re betting on whether the total booking points in a match will be over or under a specified number. For example, if the line is set at 40.5 points, and the game ends with three yellow cards (30 points) and one red card (25 points), the total would be 55, meaning 'Over' wins.\n\n### First Half Total Booking Points\nUnlike the total booking points market, this betting market is limited to the first 45 minutes. This is especially valuable if you know that one or both teams start aggressively or if the referee is known to stamp his authority early.\n\n### Team Booking Points\nHere, you bet on a single team’s card tally. You might predict that a team playing away under pressure will commit more fouls and receive more cards.\n\n### Booking Points Handicap\nIn this market, the bookmaker gives one team a head start in booking points. For instance, Arsenal +10 booking points vs Chelsea means that if Arsenal receives 10 points and Chelsea receives 20, the handicap adjusted score is a draw (20-20).",
    advantages: [],
    risks: []
  },
  { 
    id: 'strategic-tips', 
    title: 'Strategic Tips for Betting on Booking Points', 
    content: "Before you jump into booking points betting, it’s worth doing more than just guessing. Knowing how certain teams play, how strict the referee is, and what’s at stake in the match can make a big difference.\n\nHere are some tips to keep in mind:\n\n• **Understand Team Discipline Profiles:** Teams like Getafe or Everton have historically been card-heavy, while others like Manchester City or Bayern tend to receive fewer cards.\n• **Study Referee Tendencies:** Some referees issue more cards than others. If a strict referee is in charge, expect higher booking points.\n• **Consider Match Type:** Derbies, relegation battles, or playoff games are more likely to be heated and aggressive, leading to more bookings.\n• **Watch Player Matchups:** Clashes between aggressive midfielders or tricky wingers and rash defenders often lead to more cards.\n• **Use In-Play Betting Wisely:** If the game gets heated early or there’s a red card threat, betting on live booking points markets can offer good value.",
    advantages: [],
    risks: []
  },
  { 
    id: 'mistakes-to-avoid', 
    title: 'Mistake to Avoid', 
    content: "Even if you’ve been betting for a while, it’s easy to make mistakes with booking points. Knowing the common errors helps you make smarter choices and keep your money safe.\n\n• **Ignoring Referee Statistics:** Some referees are far stricter than others when it comes to issuing cards. Always check how many yellow and red cards a ref typically gives per game.\n• **Misunderstanding the Rules:** A common mistake is thinking a red card is just 1 card. In a booking points system, it's worth 25 points. Read the rules carefully.\n• **Chasing Late Bets:** Don’t chase the total just because the first half was aggressive. Games often cool off in the second half, especially if one team is leading comfortably.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "Booking points might not grab as much attention as goals or winners, but it’s one of the smartest markets out there if you know what to look for. It’s less about who scores and more about how the game is played.\n\nFocus on heated matchups, keep an eye on strict referees, and don’t overlook first-half cards. The better your preparation, the better your chances of outsmarting the bookmakers.",
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
        question: "How to calculate booking points in football?",
        answer: "Yellow = 10, Red = 25. Two yellows resulting in a red = 35. This cumulative system helps bookmakers create a wider range of betting markets based on match discipline."
      },
      {
        question: "What are 10 booking points in football?",
        answer: "10 booking points is the standard value for a single yellow card shown to a player during regular time."
      },
      {
        question: "What does 40+ booking points mean?",
        answer: "It means the match had high disciplinary action, exceeding 40 points. This could be 5 yellow cards, or 1 red and 2 yellows, or any combination reaching at least 41 points."
      },
      {
        question: "What does Under 55.5 booking points mean?",
        answer: "Under 55.5 booking points means that the total disciplinary points in the match must be 55 or fewer. For example, if there are 5 yellow cards (50 points), the bet wins. If there are 6 yellow cards (60 points) or a red card and 4 yellows (65 points), the bet loses."
      },
      {
        question: "What is a booking in football?",
        answer: "A booking in football occurs when a referee officially records a player's name in their notebook for a foul or misconduct, accompanied by showing a yellow or red card. In booking points markets, these 'bookings' are translated into numerical values (10 for yellow, 25 for red) to create more diverse betting options."
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
                Booking Points <span className="text-brand-emerald">Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Football betting isn’t just about picking winners anymore. Niche markets like booking points can give you a serious edge, especially once you start reading how teams react in high-stakes situations.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="text-brand-emerald font-bold">OddinsOdds Academy</span> guide teaches you exactly what booking points are, how they’re calculated, and how to use them to make smarter bets.
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
