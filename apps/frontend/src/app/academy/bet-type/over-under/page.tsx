'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-does-over-under-mean', 
    title: 'What Does Over/Under Mean in Betting?', 
    content: "If you've been betting on sports for a while, you’ve probably come across over/under betting. It's one of the most straightforward ways to wager, and once you understand the concept, you’ll see opportunities in almost every match.\n\nOver/under betting is when you wager on whether the total number of goals, points, or runs in a game will be higher or lower than a number set by the bookmaker. You don’t need to worry about who wins the game – just how much action there’ll be.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-does-it-work-football', 
    title: 'How does Over/Under Betting Work in Football?', 
    content: "In football, over/under markets are often based on goals scored. The most popular lines are 0.5, 1.5, 2.5, 3.5, and so on. For example:\n\n• **Over 0.5 goals:** The game must have at least one goal.\n• **Under 1.5 goals:** Game must end with no more than one goal.\n• **Over 2.5 goals:** You win if the game has 3 or more goals.\n\nYou'll also find over/under lines for goals scored in the first half or second half alone. Other popular over/under bets include predicting the total corners, number of yellow and red cards, shots on target, and individual team goals.\n\nFor example, if you're betting on Manchester City vs Brentford with the line set at 3.5 goals. Based on City's recent scoring form and Brentford's leaky defence, you back the over. If the game ends 4-1 with total goals 5, you win easily.",
    advantages: [],
    risks: []
  },
  {
    id: 'over-under-strategy-football',
    title: 'Over/Under Betting Strategy in Football',
    content: "To make smarter picks with total goals markets, you need a clear over/under betting strategy. Here are our tips that you should keep in mind when betting:\n\n### Don't Just Look at Averages\nYou might think looking at team averages is enough, but that's where you can go wrong. What you need to look at is how those averages were built. If a team scores 2.5 goals per game, it doesn't mean they're consistent; it could mean they smashed six in one match and didn't score at all in the next three.\n\n### Study Playing Styles\nTeams that sit deep and play five at the back won't generate as many open chances. If both teams play cautious football, the under often has value. On the other hand, games with attacking fullbacks, high defensive lines, or poor goalkeepers are asking for you to be on the over betting market.\n\n### Watch for Motivation\nLeague table positions can heavily influence how teams approach games. A team fighting relegation may go into all-out defence on the road. A side chasing Champions League spots may take more risks late in the season. Over/under outcomes often shift with what the teams are playing for.",
    advantages: [],
    risks: []
  },
  {
    id: 'over-under-in-other-sports',
    title: 'Over/Under in Other Sports',
    content: "Football might be where over/under betting is most common, but the same principle applies across other sports. Once you're comfortable with the logic, you can apply it elsewhere.\n\n• **Basketball:** In basketball, you're betting on the total number of points scored by both teams. A typical over/under line might be 220.5. High-scoring teams, poor defences, or fast-paced styles tend to favour the over.\n• **Tennis:** In tennis, you can bet on the total number of games in a match. If the line is set at 22.5 and you bet over, you want something like 7-5, 6-4, or a third set.\n• **Cricket:** In limited-overs cricket, you'll see over/under lines for total runs in an innings. For example, a line of 294.5 in a 50-over ODI. If you back the over, you're hoping for a batting-friendly pitch.\n• **Ice Hockey:** Over/under in hockey is based on goals. Typical lines are 5.5 or 6.5. Low totals suit games with strong goaltending or tight playoff battles.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "Over/under betting is pretty simple once you get the hang of it. You're not predicting who wins the game, you're just betting on how busy the scoreboard gets. If you think it'll be a dull game with few chances, you're going under. If you're expecting fireworks, you go over. That’s it.\n\nDon’t just look at stats, watch how the teams play. Some teams love to attack, others sit back. Injuries, weather, and what the game means to each side all play a part. Use common sense, as not every game is worth betting on.",
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
        question: "What does Over/Under mean in betting?",
        answer: "Predicting if the total is above or below a specific number (goals, points, or runs)."
      },
      {
        question: "How to bet Over/Under?",
        answer: "Find the market, pick a line (e.g., 2.5), and choose 'over' for high-action or 'under' for low-action."
      },
      {
        question: "What does Over/Under 1.5 mean in betting?",
        answer: "Total must be 2+ for Over, or 0-1 for Under."
      },
      {
        question: "How to win an Over/Under bet?",
        answer: "Your chosen outcome must match the final tally (e.g., 3 goals for Over 2.5)."
      },
      {
        question: "What does Over/Under 2.5 mean in betting?",
        answer: "Total must be 3+ for Over, or 0-2 for Under."
      }
    ]
  }
];

export default function OverUnderPage() {
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
          <span className="text-brand-emerald uppercase font-bold">OVER/UNDER</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Over/Under <span className="text-brand-emerald">Betting Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    If you’ve been betting on sports for a while, you’ve probably come across over/under betting. It's one of the most straightforward ways to wager.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="text-brand-emerald font-bold">OddinsOdds Academy</span> guide breaks down over/under betting in football, walks you through important strategies, and shows how it applies across other sports.
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
