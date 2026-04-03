'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-bankroll', 
    title: 'What Is Bankroll in Betting?', 
    content: "Before we get into the strategies, let's clarify the term. Your bankroll in sports betting is the total amount of money you have set aside specifically for placing bets. It's separate from your everyday finances and should be money you can afford to lose without impacting your lifestyle.\n\nThink of your bankroll as your \"betting budget.\" Whether you're a casual bettor or someone who bets professionally, managing this budget is the cornerstone of sustainable betting.",
    advantages: [],
    risks: []
  },
  { 
    id: 'why-important', 
    title: 'Why Is Bankroll Management Important?', 
    content: "When you jump into sports betting without managing your bankroll, it's easy to burn through all your funds fast. Here's why you need to manage your bankroll well:\n\n• **You avoid ruin:** Without a plan, a few unlucky bets can wipe out everything you've put in.\n• **You reduce emotional decisions:** Having a betting strategy stops you from chasing losses or betting on impulse.\n• **You enable long-term growth:** Managing your funds let you build your bankroll steadily instead of risking it all at once.\n• **You improve discipline:** It keeps you sticking to your strategy and staying patient through ups and downs.\n\nIn short, good bankroll management helps you stay in the game longer and boosts your chances of becoming a winning bettor.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-to-manage', 
    title: 'How to Manage Your Bankroll?', 
    content: "Here are the core principles that form the foundation of effective betting bankroll management:\n\n• **Set a Fixed Bankroll Amount:** Decide on a specific amount of money solely for betting. This should be an amount you are comfortable risking entirely. Avoid using emergency funds or money meant for bills.\n• **Use a Unit System for Bets:** Rather than betting arbitrary amounts, use units. A unit is a small percentage of your total bankroll, commonly between 1% to 5%. For example, if your bankroll is $1,000 and you decide a unit is 2%, each unit bet will be $20.\n  - Control losses by limiting bet size.\n  - Standardise your bets, making tracking easier.\n  - Prevent emotional betting by sticking to a plan.\n• **Bet a Consistent Percentage Per Wager:** Your bet size should reflect your confidence, but always remain within your unit size limits. Many pros recommend betting between 1% and 3% of your bankroll per bet. You can also change the units you bet based on the risk of the bet you place.\n• **Avoid Chasing Losses:** If you lose a bet, don't increase your stake to recover quickly. This behaviour, called \"chasing losses,\" can rapidly drain your bankroll. Stick to your units and strategy.\n• **Adjust Your Unit Size with Bankroll Changes:** As your bankroll grows or shrinks, recalculate your unit size. If your bankroll increases to $1,200, and your unit is 2%, your new unit size is $24. Likewise, if it drops to $800, your unit drops to $16.",
    advantages: [],
    risks: []
  },
  { 
    id: 'strategies', 
    title: 'Different Bankroll Management Strategies', 
    content: "You can adopt different bankroll management systems depending on your risk tolerance and betting style:\n\n• **Flat Betting:** The simplest and safest method is flat betting - wagering the same unit size every time, regardless of confidence. This keeps your risk steady but may limit growth if you have strong edges.\n• **Percentage Betting:** This is betting a fixed percentage of your current bankroll on each bet. It automatically scales your bet size up or down based on your bankroll performance. This method reduces risk but can result in very small bets after a losing streak.\n• **Kelly Criterion:** The Kelly Criterion is a mathematical formula to calculate the optimal bet size based on your estimated edge and odds. It maximises growth but requires accurate predictions of your edge, which can be difficult. For example, if you estimate a 5% edge and the odds imply a 4% edge, Kelly suggests betting about 1% of your bankroll. Kelly bets can be aggressive, so you must use a \"fractional Kelly\" approach, betting half or a quarter of the Kelly amount.\n\nFor example, if you start with a $1,000 bankroll and decide to bet 2% per wager, you'd place $20 bets. If you maintain a 55% win rate over 10 bets with average odds around 2.0, your bankroll could grow to about $1,100. At that point, you would adjust your unit size to $22, which is 2% of your new bankroll.\n\nBy consistently betting the same percentage and resisting the urge to increase your stakes after losses, you protect your bankroll from big swings and set yourself up for steady growth, even during losing streaks.",
    advantages: [],
    risks: []
  },
  { 
    id: 'tips-for-success', 
    title: 'Bankroll Management Tips for Sports Betting Success', 
    content: "Here are practical bankroll management tips to keep you disciplined and profitable:\n\n• **Never Bet More Than You Can Afford to Lose:** Only use disposable income for betting. Treat your bankroll as entertainment money.\n• **Keep Records of Your Bets and Bankroll:** Track every bet, amount wagered, odds, and result. This helps you evaluate your performance and adjust your strategy.\n• **Set Win and Loss Limits:** Decide on a profit goal or loss limit for each session or month. For example, stop betting for the day after winning 10% of your bankroll or losing 5%.\n• **Don’t Increase Your Stake After Wins or Losses:** Stick to your unit size regardless of streaks to avoid risking too much during hot streaks or trying to recover losses quickly.\n• **Use Multiple Bookmakers to Get the Best Odds:** Maximise value by shopping around for the best odds, which improves your long-term profitability without increasing risk.\n• **Review and Adjust Your Bankroll Management Regularly:** As your bankroll changes or if your betting style evolves, revisit your unit size and strategy. We advise doing this at least once a month.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "To sum it up, effective bankroll management in sports betting is about protecting your funds, betting consistently within your means, and making data-driven decisions.\n\nRemember to define your bankroll separately from your finances and determine your unit size before you start betting. Don't chase losses and make sure to adjust your unit size based on your bankroll regularly.\n\nBy following these bankroll management tips, you give yourself the best chance to enjoy sports betting as a sustainable and profitable activity rather than a losing gamble.",
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
        question: "What is bankroll management?",
        answer: "It is the structured process of managing your betting funds to protect your capital, minimize risk, and maximize long-term profit potential."
      },
      {
        question: "What is 1% of bankroll?",
        answer: "If your total betting budget (bankroll) is $1,000, 1% would be $10. This is often recommended as a safe base unit size."
      },
      {
        question: "What is the 1 3 2 6 method?",
        answer: "The 1-3-2-6 system is a positive progression betting strategy where you increase your stakes after wins in a specific sequence (1 unit, then 3, then 2, then 6) before resetting."
      }
    ]
  }
];

export default function BankrollManagementPage() {
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
          <span className="text-brand-emerald uppercase">BANKROLL MANAGEMENT GUIDE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Bankroll <span className="text-brand-emerald">Management</span> Guide
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "If you want to succeed in sports betting, understanding bankroll management is essential. Without a solid strategy, even the best knowledge can't save you from losing all your money."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This OddinsOdds Academy article dives deep into what bankroll is in betting, why bankroll management matters, and practical tip to help you protect your funds and maximise your profit potential.
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
