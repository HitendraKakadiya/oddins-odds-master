'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-matched-betting', 
    title: 'What Is Matched Betting?', 
    content: "Matched betting is a technique that leverages the free bet promotions offered by bookmakers. By placing two opposing bets - one with the bookmaker (a \"back\" bet) and one with a betting exchange (a \"lay\" bet) - you can cover all possible outcomes of an event.\n\nThis approach ensures a profit regardless of the result. The key to matched betting is using the free bet credits or bonuses offered by bookmakers and covering your position by laying off the bet on an exchange. This eliminates the element of chance and turns bookmaker offers into guaranteed returns.\n\nSounds complicated? Let us break it down for you in the sections below.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-does-it-work', 
    title: 'How Does Matched Betting Work?', 
    content: "Matched betting is a method that helps you take advantage of bookmaker offers by placing carefully planned bets to reduce or eliminate risk. Here's how it works:\n\n1. **Place a Qualifying Bet:** To unlock free bet offers, you must first place a qualifying bet using your own money. This is a normal bet placed at the bookmaker on a specific outcome.\n2. **Place the Lay Bet:** Simultaneously, you place a lay bet on a betting exchange against the same outcome you backed at the bookmaker. The lay bet covers all other possible results.\n3. **Qualifying Bet Settles:** When the event finishes, one of your bets wins and the other loses, but your overall loss is minimal or zero. This qualifies you to receive the free bet from the bookmaker.\n4. **Use the Free Bet:** You then use your free bet to place another back bet at the bookmaker and a corresponding lay bet on the betting exchange. This time, because the stake is free, you are guaranteed a profit regardless of the outcome.",
    advantages: [],
    risks: []
  },
  { 
    id: 'calculator', 
    title: 'What Is a Matched Betting Calculator and Why Do You Need It?', 
    content: "A matched betting calculator is a vital tool that helps you figure out exactly how much to stake on your lay bet to balance your risk and lock in profit. It calculates the precise amount needed based on:\n\n• The stake of your back bet\n• The odds of the back bet\n• The odds of the lay bet\n• The commission charged by the betting exchange\n\nUsing a calculator ensures your lay bet matches your back bet perfectly so that your profit is guaranteed or your loss is minimised.",
    advantages: [],
    risks: []
  },
  { 
    id: 'where-to-find-offers', 
    title: 'Where to Find Matched Betting Offers?', 
    content: "Bookmakers constantly run promotional offers to attract and retain you on their platform. These offers are your opportunity to profit through matched betting. Common types of matched betting offers include:\n\n• **Sign-up Bonuses:** Free bets or bonus funds given to you as a new customer after placing a qualifying bet.\n• **Reload Offers:** Bonuses available if you are an existing customer and are often triggered by a certain amount of deposits or specific bets.\n• **Profit Boosts:** Enhanced odds on certain events that increase potential returns.\n• **Cashback Offers:** Partial refund on losing bets, providing a safety net.\n\nTo maximise your matched betting profits, regularly check bookmaker websites and matched betting forums or sites that list the latest offers.",
    advantages: [],
    risks: []
  },
  { 
    id: 'is-it-legal', 
    title: 'Is Matched Betting Legal?', 
    content: "Matched betting is legal in most countries where online sports betting is regulated, including Nigeria, the UK, and the US. You're simply making bets on both sides of an event and using promotional offers honestly provided by bookmakers.\n\nThat said, bookmakers don't like matched betting because it cuts into their profits. If they detect that you are using matched betting techniques, they may limit your account, restrict bonuses, or close your account altogether. So, be very careful while using this method and try to make an account with different bookmakers to stay under the radar.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-much-can-you-make', 
    title: 'How Much Can You Make on Matched Betting?', 
    content: "The amount you can make on matched betting depends largely on the time and effort you put in, as well as how many bookmaker offers you can take advantage of. When you're just starting, focusing on sign-up bonuses from various matched betting sites can earn you anywhere from $500 to $1,000 per month with consistent work.\n\nThese welcome offers often provide the biggest profits because they are designed to attract you to their platform.\n\nAs you gain experience and move beyond sign-up promotions, you'll want to focus on matched betting reload offers - bonuses given to you as an existing customer to keep you betting on the platform. By regularly using reload offers, cashback deals, and profit boosts, you can maintain a steady monthly income.\n\nYour earnings will also depend on how well you manage your bankroll and how efficiently you use tools like a matched betting calculator to minimise mistakes. But do remember, matched betting won't make you rich overnight. It requires discipline, patience, and consistent betting.",
    advantages: [],
    risks: []
  },
  { 
    id: 'tips-for-success', 
    title: 'Matched Betting Tips for Success', 
    content: "To make the most of matched betting and avoid common pitfalls, follow these practical tips that will keep you organised, efficient, and profitable.\n\n• Always use a matched betting calculator to ensure your stakes are correct.\n• Read the terms and conditions of every offer carefully before placing bets.\n• Spread your bets across multiple bookmakers to avoid detection and account restrictions.\n• Keep detailed records of all your bets, stakes, odds, and profits for tracking purposes.\n• Join matched betting forums and communities to stay updated on the latest offers and strategies.\n• Be patient and consistent, matched betting is about steady, long-term profits, not quick wins.\n• Avoid placing bets impulsively; stick to your plan and bankroll management rules.\n• Take advantage of reload offers to maintain a steady income beyond initial sign-up bonuses.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "Matched betting is a reliable, legal, and effective strategy to make money from sports betting promotions with minimal risk.\n\nBy understanding how matched betting works, using a matched betting calculator, and following a disciplined approach, you can build a steady stream of profits.",
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
        question: "How does matched betting work?",
        answer: "It involves placing two opposing bets: a 'back' bet with a bookmaker to unlock a promotion, and a 'lay' bet on a betting exchange to cover the other outcome, ensuring a profit regardless of the result."
      },
      {
        question: "Can you actually make money from matched betting?",
        answer: "Yes, it is a proven method to extract value from bookmaker promotions. Beginners can often make hundreds or even thousands of dollars from sign-up offers alone."
      },
      {
        question: "What are matched and unmatched bets?",
        answer: "A matched bet is one where another user on the exchange has taken the opposite side of your wager. An unmatched bet waits for someone to accept those odds before it becomes active."
      }
    ]
  }
];

export default function MatchedBettingPage() {
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
          <span className="text-brand-emerald uppercase">MATCHED BETTING GUIDE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Matched Betting <span className="text-brand-emerald">Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "If you're looking for a way to earn consistent profits from sports betting without risking your own money, matched betting is the strategy you need to understand."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Matched betting is not gambling - it's a smart technique that uses bookmaker offers to generate nearly risk-free returns. In this OddinsOdds Academy guide, you'll learn exactly what matched betting is, how it works, and much more. By the end, you'll have a clear, step-by-step plan to start profiting with this proven method.
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
