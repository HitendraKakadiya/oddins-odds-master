'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-flat-betting', 
    title: 'What Is Flat Betting?', 
    content: "Flat betting means you wager the same fixed amount on every bet, regardless of whether you're on a winning streak, a losing run, or feel extra confident about a match. For example, if your bankroll is $1,000 and you decide on 2% per bet, your stake is $20.\n\nEvery single wager, win or lose, is $20. That's flat betting. By using this method, you avoid the rollercoaster of aggressive staking systems and create a stable foundation to judge whether your betting strategy is actually profitable.",
    advantages: [],
    risks: []
  },
  { 
    id: 'why-flat-betting-works', 
    title: 'Why Flat Betting Works', 
    content: "**Bankroll Protection:** Flat betting protects you from big losses. Losing streaks will happen, but since you always bet the same amount, your bankroll doesn't disappear as fast as it would with risky systems like Martingale or doubling bets. Imagine losing five bets in a row at $20 each. You've lost $100, which is painful but still manageable with a $1,000 bankroll. In comparison, a doubling system could wipe out half your bankroll in the same stretch.\n\n**Emotional Control:** When you keep your bets the same, you avoid the trap of betting bigger just because you feel lucky or chasing losses to win money back. This discipline makes you focus on long-term profit instead of getting caught up in short-term wins and losses.\n\n**Accurate Tracking:** Since every bet is the same size, it's easy to calculate your success rate and measure whether you're actually profitable. You're evaluating your ability to pick winners, not your ability to manage wild swings in stake size.\n\n**Long-Term Sustainability:** Flat betting allows you to stay in the game longer. Even if you hit a losing streak, you won't be wiped out quickly. That longevity is key because sports betting is all about sample size – the more bets you place, the clearer your edge (or lack of one) becomes.",
    advantages: [],
    risks: []
  },
  { 
    id: 'flat-betting-sports', 
    title: 'Flat Betting in Sports', 
    content: "Flat betting works in sports where anything can happen, like a last-minute penalty in football or rain suspending play in cricket. By keeping the same bet size, you don't let these events wipe out your bankroll. Here is an example:\n\n• **Starting bankroll:** $1,000\n• **Flat stake:** $20 per match\n• **Number of bets:** 30 matches\n\nYou win 16 bets and lose 14, with average odds of 1.90.\n\n• 16 wins - profit of $18 each = $288\n• 14 losses - loss of $20 each = $280\n• **Net result:** $8 profit.\n\nThe profit isn't huge, but the key is that your results depend only on how good your picks are.",
    advantages: [],
    risks: []
  },
  { 
    id: 'flat-betting-systems', 
    title: 'Types of Flat Betting Systems', 
    content: "Flat betting isn't always rigid; there are slight variations depending on how cautious or aggressive you want to be. Let's check out types of flat betting systems:\n\n• **Static Flat Betting:** You always bet the same amount, regardless of bankroll changes. If you start at $20 per bet, you stick with it no matter what.\n\n• **Proportional Flat Betting:** You bet using a fixed percentage of your bankroll. As your bankroll goes up, your bet size increases. If your bankroll goes down, your bet size decreases.\n\n• **Aggressive Flat Betting:** Instead of betting 1-2% of your bankroll, you risk 3-5% each time. This means you can win more when things go well, but you can also lose money much faster if you hit a bad streak.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-to-use', 
    title: 'How to Use Flat Betting?', 
    content: "To make flat betting work for you, all you need is a clear bankroll plan, a fixed stake size, and the discipline to stick with it on every wager.\n\n1. **Set Your Bankroll:** Decide how much money you’re okay with losing. Think of it like paying for entertainment, not using your savings.\n2. **Choose Your Flat Bet Size:** Pick 1-3% of your bankroll as your fixed bet. For example, with $1,000, 2% = $20.\n3. **Bet the Same Amount Every Time:** Always bet $20, no matter what happens. Don’t increase or decrease it based on wins or losses.\n4. **Keep Records:** Note down each bet- odds, stake, result, profit/loss, and new bankroll.\n5. **Review After Many Bets:** After 50-100 bets, check if you’re making money. Flat betting makes it easy to see if your picks are good.",
    advantages: [],
    risks: []
  },
  { 
    id: 'pros-cons', 
    title: 'Pros and Cons of Flat Betting', 
    content: "Like every betting strategy, flat betting has its advantages and drawbacks. Understanding both sides will help you decide whether this system fits your goals and betting style.\n\n### Pros\n• **Simple to understand and apply:** You don't need complex formulas or advanced bankroll calculators. Once you set your flat unit, you place the same bet every time.\n• **Strong bankroll protection:** Since you don't raise your bets after losing, you avoid the quick bankroll wipeouts that happen with chasing systems.\n• **Keeps emotions in check:** Flat betting removes the temptation to bet bigger when you're feeling confident or desperate after a loss.\n\n### Cons\n• **Slow growth:** If you're on a winning run, your profits grow steadily but not explosively.\n• **Doesn't exploit high confidence spots:** Sometimes you might feel strongly about a bet and want to stake more on it. Flat betting stops you from doing that, which can feel restrictive.\n• **May feel boring:** Flat betting isn’t exciting – it’s more about patience and discipline. If you like the thrill of big wins and losses, this method might feel too slow or controlled.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "Flat betting might not sound glamorous, but if you are serious about sports betting, it's the most reliable system you can use. By sticking to the same stake size on every bet, you give yourself the best chance to grow steadily. Whether you're betting on football, cricket, basketball, or tennis, flat betting puts you in control.\n\nIt’s not about quick wins – it’s about building a sustainable betting approach that lasts. If you want one system that keeps you disciplined and protects your bankroll, flat betting is the strategy you should go for.",
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
        question: "What is flat betting?",
        answer: "Wagering the same fixed amount on every bet, regardless of wins or losses."
      },
      {
        question: "What is flat betting in blackjack?",
        answer: "Betting the same amount on every hand, unlike progressive betting strategies."
      },
      {
        question: "Is flat betting a good strategy?",
        answer: "Yes, it is often recommended for beginners and professional bettors alike for its superior bankroll protection."
      }
    ]
  }
];

export default function FlatBettingPage() {
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
          <span className="text-brand-emerald uppercase">FLAT BETTING STRATEGY</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Flat <span className="text-brand-emerald">Betting</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "When you step into the world of sports betting, one of the biggest challenges you face is managing your bankroll. If you chase losses or keep increasing your bets, you’ll likely lose your bankroll fast."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    With this method, you always bet the same amount, no matter if you win or lose. It keeps things simple, protects your money, and lets you see how good your betting choices really are without emotions getting in the way. In this OddinsOdds Academy guide, we will talk about flat betting in detail.
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
