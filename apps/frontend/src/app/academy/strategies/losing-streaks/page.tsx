'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-losing-streak', 
    title: 'What Is a Losing Streak in Betting?', 
    content: "A losing streak is a run of consecutive bets that end in losses. For example, if you place five bets in a row and all five lose, you are experiencing a five-bet losing streak. This can be frustrating, but it is a normal part of betting - even the best bettors go through losing streaks because sports outcomes are unpredictable.\n\nLosing streaks happen mainly because of:\n\n• **Variance:** Variance means the natural ups and downs in sports results. Even bets that are likely to win can lose several times in a row.\n• **Sample Size:** In betting, short runs of losses or wins happen regularly; it's only over a large number of bets that you see your true performance.\n• **Mistakes:** Mistakes happen when you make bad betting choices or don't follow your plan, which can make losing streaks worse.\n• **External Factors:** External factors like injuries, referee calls, or weather changes can affect game results in ways you can't predict.",
    advantages: [],
    risks: []
  },
  { 
    id: 'recognising-signs', 
    title: 'Recognising the Signs of a Losing Streak', 
    content: "It's important to recognise early signs that a losing streak is beginning so you can take action before things get worse. Being aware of these warning signals helps you stay in control, avoid bigger losses, and make smarter decisions to protect your bankroll and mindset.\n\nSome common signs to watch for include:\n\n• Losing several bets one after another in a short time.\n• Feeling more upset or emotional because of the losses.\n• Making quick or bigger bets, trying to win back what you lost.\n• Changing your normal betting plan or how you manage your money.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-long-can-streaks-last', 
    title: 'How Long Can Losing Streaks Last?', 
    content: "When it comes to losing streaks in sports betting, there's no fixed duration. The length of a losing streak can vary widely based on several factors, including the type of bets you place, the odds involved, and pure luck.\n\nLet's break down the math behind losing streaks to help you see why they happen and how long they might last:\n\n• If you place bets with a 50% chance of winning, like betting on a coin toss or a 50/50 sports outcome, the probability of losing 1 bet is 50%.\n• The probability of losing 2 bets in a row is 0.5 × 0.5 = 25%.\n• The chance of losing 3 bets consecutively is 0.5 × 0.5 × 0.5 = 12.5%.\n\nThis means that even if you make bets with a fair 50/50 chance, losing streaks of 3 or more bets happen relatively often, roughly 1 out of every 8 times.\n\nMeanwhile, losing streaks of 5, 7, or even 10 bets are less common, but possible. As the length of the streak increases, the probability decreases, but it never drops to zero. For example:\n\n• Losing 5 bets in a row at 50% odds has about a 3% chance of happening (0.5^5 = 0.03125).\n• Losing 10 bets in a row is about a 0.1% chance (0.5^10 = 0.0009765625).\n\nWhile rare, longer losing streaks can and do happen, especially over a larger number of bets.",
    advantages: [],
    risks: []
  },
  { 
    id: 'impact-high-odds', 
    title: 'Impact of High Odds on Losing Streaks', 
    content: "The odds of your bets play a huge role in the length and frequency of losing streaks. High odds bets (say odds of 3.00 or higher) are riskier and less likely to win, meaning the chance of losing multiple bets in a row increases.\n\nFor example, If you place bets with a 30% chance of winning (which corresponds to odds around 3.0), the chance of losing 3 bets consecutively is 0.7 × 0.7 × 0.7 = 34.3%. That’s more than 1 in 3 times.\n\nThis means when you chase big payouts with high odds, you should be prepared for potentially longer and more frequent losing streaks.",
    advantages: [],
    risks: []
  },
  { 
    id: 'role-bankroll-management', 
    title: 'The Role of Bankroll Management During Losing Streaks', 
    content: "One of the most important factors in surviving losing streaks is betting bankroll management. This means allocating only a small portion of your total betting funds on any one bet, so losing streaks don't wipe you out.\n\nHere are some points you should keep in mind:\n\n• **Bet a fixed percentage of your bankroll** (for example, 1-3%) rather than fixed amounts.\n• **Avoid increasing bet sizes to chase losses** - this usually leads to bigger losses.\n• **Set loss limits** (daily or weekly) to avoid spending more than you can afford.\n• **Adjust bet sizes if your bankroll shrinks**, to protect what remains.\n\nManaging your betting wallet well helps you bet longer and lowers the stress when you go through losing streaks.\n\nRead more in our Bankroll Management guide.",
    advantages: [],
    risks: []
  },
  { 
    id: 'financial-impact', 
    title: 'How a Losing Streak Can Affect You Financially', 
    content: "Imagine you start with a $1,000 bankroll and bet 2% ($20) per bet on average odds of 2.0. You expect to win about 50% of your bets over the long term.\n\nIf you hit a 5-bet losing streak (losing $100 total), your bankroll reduces to $900. If you continue betting 2%, your stake drops to $18, which limits further losses while allowing recovery.\n\nBut if instead you chase losses and increase bets to $40 or $50, you risk depleting your bankroll quickly. This example shows why sticking to bankroll management during losing streaks is critical.",
    advantages: [],
    risks: []
  },
  { 
    id: 'avoiding-streaks', 
    title: 'Can Losing Streaks Be Avoided?', 
    content: "When you bet on sports, you might wonder if it's possible to avoid losing streaks altogether. The simple answer is no, not a single system or betting strategy can stop losing streaks completely.\n\nThat's because sports are unpredictable and affected by many things you can't control, like how players perform, the weather, referee calls, and just plain luck. However, while you can't prevent losing streaks entirely, you can reduce how often they happen and, more importantly, limit their impact on your bankroll and overall betting success.\n\nHere's how:\n\n• **Focus on value bets** with positive expected value to increase your chances of long-term profit.\n• **Avoid high-risk bets** with poor odds that often lead to longer losing streaks.\n• **Continuously research** and improve your betting strategy to make smarter decisions.\n• **Practice strict bankroll discipline** by betting only a small percentage of your funds per wager.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "Even though you can't fully avoid losing streaks in betting because sports are unpredictable, you can lower how often and how badly they happen.\n\nBy choosing bets with good value, avoiding risky bets, always working to improve your strategy, and carefully managing your money, you protect your bankroll and boost your chances of winning over the long run despite ups and downs.",
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
        question: "How to handle a losing streak?",
        answer: "The best way is to stay disciplined. Stick to your bankroll plan, take a break if needed, and re-evaluate your betting model without chasing losses."
      },
      {
        question: "How long can a losing streak last?",
        answer: "There is no limit. Mathematical variance can lead to 10+ losses in a row even for professional bettors. This is why bankroll management is essential."
      },
      {
        question: "Do 90% of gamblers quit before they win?",
        answer: "While often cited as a motivation quote, it highlights a truth: many quit due to poor bankroll management during a normal losing streak."
      },
      {
        question: "Is there any skill in gambling?",
        answer: "Yes. Identifying 'value' (when odds are higher than true probability) is a skill that separates successful bettors from those relying on luck."
      }
    ]
  }
];

export default function LosingStreaksPage() {
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
          <span className="text-brand-emerald uppercase">LOSING STREAK STRATEGY</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Understanding <span className="text-brand-emerald">Losing Streaks</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "Going through a losing streak in betting is something you will face at some point. Whether you are just starting or have been betting for a long time, losing several times in a row can feel frustrating."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    But if you learn why these losing streaks happen and use smart ways to handle them, you can get through tough times and become stronger as a bettor. In this OddinsOdds Academy article, we will talk about how to overcome a losing streak in betting.
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
