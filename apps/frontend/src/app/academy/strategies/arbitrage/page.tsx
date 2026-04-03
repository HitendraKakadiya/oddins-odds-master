'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-arbitrage', 
    title: 'What Is Arbitrage Betting?', 
    content: "Arbitrage betting, often called “arbing” or “sure betting,” is the practice of placing bets on all possible outcomes of a sporting event in a way that guarantees a profit, no matter the result. It’s not impossible, it’s a real strategy.\n\nBut to make it work, you need speed, precision, and a strong understanding of how odds and betting markets operate. A casual approach usually leads to errors, while a disciplined approach can create good profits.\n\nThis APWin Academy guide will explain what arbitrage betting is, how it works, the tools you’ll need, the risks involved, and the methods that can help you use it effectively. By the end, you’ll know whether this is a strategy worth adding to your betting approach.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-it-works', 
    title: 'How Does Arbitrage Betting Work?', 
    content: "To really understand arbitrage, you need to look at the math behind it. Every odd can be converted into a probability. For decimal odds, the formula is simple:\n\n**Implied Probability = 1 / Odds**\n\nIf the sum of implied probabilities across all outcomes is less than 1, you have an arbitrage opportunity. Let's take a practical example. Suppose you find a football match with the following odds:\n\n• **Bookmaker A:** Liverpool to win at 2.40\n• **Bookmaker B:** Chelsea to win at 2.10\n\nThe implied probabilities are:\n\n• **Liverpool:** 1 / 2.40 = 0.416 (41.6%)\n• **Chelsea:** 1 / 2.10 = 0.476 (47.6%)\n\nAdd them together: 41.6% + 47.6% = 89.2%. That's below 100%, which means there's about 10.8% left over as guaranteed profit. The final step is to calculate your stakes. You can do this manually with formulas, or you can use an arbitrage calculator, which saves time and prevents mistakes.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-to-place', 
    title: 'How to Place an Arbing Bet', 
    content: "If you're interested in trying arbitrage betting, here's the step-by-step guide to make your process easier:\n\n1. **Open Multiple Accounts:** You can't do arbing with just one bookmaker. You need accounts with several betting sites. The more accounts you have, the more likely you are to find price differences that create arbs.\n2. **Spot the Opportunities:** You can search manually by comparing odds, but in today's betting world, software is essential. There are dedicated tools that scan thousands of markets in real time and help you with arbitrage opportunities.\n3. **Calculate the Stakes:** Once you've spotted an arb, you need to know how much to stake on each outcome. An arbitrage betting calculator makes this easy. You enter the odds and your total stake, and it instantly shows you how much to put on each side.\n4. **Place Bets Quickly:** Speed is crucial. Odds can shift within minutes, especially if the market is thin. That's why you must be ready to click quickly.",
    advantages: [],
    risks: []
  },
  { 
    id: 'arbing-example', 
    title: 'Arbing Example', 
    content: "Let’s say you want to arb a Premier League football match between Chelsea and Arsenal.\n\n• Bookmaker A offers Chelsea to win at 2.50.\n• Bookmaker B offers Arsenal to win at 2.60.\n\nIf you want to invest $200, an arbitrage calculator might suggest:\n\n• $104 on Chelsea at 2.50 = $260 return\n• $96 on Arsenal at 2.60 = $249.60 return\n\nNo matter who wins, your return is between $249.60 and $260. Since you staked $200 total, you’re guaranteed at least $49.60 profit. That’s a return of almost 25% on a single event.\n\nFor this example, we used odds that are quite far apart to give you a better idea of how it works. You need to keep in mind that not all arbs are this lucrative. Many will offer just 1-3% profit margins. The most important thing to remember is that even a margin of 1-3% can give you steady profits if you place multiple of these bets.",
    advantages: [],
    risks: []
  },
  { 
    id: 'advantages', 
    title: 'Advantages of Arbitrage betting', 
    content: "The main appeal of arbitrage betting is simple: **guaranteed profit**. You don't have to guess the winner, study stats, or depend on luck—if your bets are placed correctly, you know you'll make money.\n\nAnother benefit is that it doesn't rely on deep sports knowledge. You don't need to understand team tactics or player form. What matters is knowing how odds work, doing the math, and understanding how bookmakers operate.\n\nArbitrage is also scalable. With more betting accounts and a larger bankroll, you can grab more opportunities and increase returns.",
    advantages: [],
    risks: []
  },
  { 
    id: 'challenges-risks', 
    title: 'Challenges and Risks', 
    content: "For all its advantages, arbitrage betting comes with some major challenges, which you can find below:\n\n• **Profit margins are often small.** Most arbs only offer 1-5% return. To make meaningful money, you need to risk large sums, sometimes thousands at a time.\n• **Bookmakers don't like arbers** because you’re taking advantage of their mistakes. If they suspect you’re arbing, they may limit your account, reduce your stakes, or even close it.\n• **If you place one bet and the odds change** before you place the second, you can end up stuck with a bad position. This is known as “slippage,” and it can wipe out profits if you aren’t careful.\n• **Arbing requires time and focus.** Opportunities don’t last long, and if you hesitate, they’ll disappear. You need to be ready to act quickly, often within minutes.",
    advantages: [],
    risks: []
  },
  { 
    id: 'legal', 
    title: 'Is Arbitrage Betting Legal?', 
    content: "A common question is whether arbitrage betting is legal. The short answer is yes. Arbitrage betting is perfectly legal in most countries, including Nigeria, the UK, and many parts of Europe.\n\nYou’re simply placing bets with licensed bookmakers, and there’s nothing unlawful about that. The issue is not legality but acceptance. Bookmakers may view arbing as an abuse of their odds and will often take steps to protect themselves. This means that while you aren’t breaking the law, you could face issues with bookmakers policies.",
    advantages: [],
    risks: []
  },
  { 
    id: 'tools-tips', 
    title: 'Tools and Tips for Success', 
    content: "Tools and discipline make all the difference in arbitrage betting. An arbitrage calculator is essential to make sure your stakes are split correctly. Arbitrage software is just as important, since manually checking odds across multiple sites isn't realistic.\n\nA few practical tips help keep things smooth: start small with low stakes until you're confident. Spread your bets across different bookmakers to avoid getting suspended, and stick to short-term markets that settle quickly rather than long-term bets where odds can change.\n\nFinally, don’t let arbing take over your entire day— it's easy to get caught chasing every opportunity, but consistency matters more than volume.",
    advantages: [],
    risks: []
  },
  { 
    id: 'final-thoughts', 
    title: 'Final Thoughts', 
    content: "Arbitrage betting is one of the most fascinating strategies in sports betting because it flips the traditional approach. Instead of predicting outcomes, you exploit price differences. Instead of hoping for luck, you rely on math.\n\nIf you're willing to put in the time, build multiple accounts, and accept the limitations, arbitrage betting can become a steady source of profit.\n\nArbitrage betting isn't glamorous, and it requires patience, spreadsheets, and a sharp eye for detail. But if you're serious about betting strategies and you want guaranteed profits instead of risky predictions, this method might be exactly what you’ve been looking for.",
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
        question: "Is arbitrage betting risk-free?",
        answer: "Mathematically, yes. However, practical risks like 'slippage' (odds changing mid-process) or bookmakers canceling bets mean you must be careful and fast."
      },
      {
        question: "What tools do I need for arbing?",
        answer: "An arbitrage calculator is essential. Professional arbers also use software that scans multiple bookmakers in real-time to find opportunities."
      },
      {
        question: "Why do bookmakers ban arbitrage bettors?",
        answer: "Bookmakers want a 'house edge'. Arbing removes that edge by exploiting price differences between competitors, which reduces the bookie's profitability."
      }
    ]
  }
];

export default function ArbitragePage() {
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
          <span className="text-brand-emerald uppercase">ARBITRAGE GUIDE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Arbitrage <span className="text-brand-emerald">Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "Arbitrage betting, often called “arbing” or “sure betting,” is the practice of placing bets on all possible outcomes of a sporting event in a way that guarantees a profit."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This APWin Academy guide will explain what arbitrage betting is, how it works, the tools you’ll need, the risks involved, and the methods that can help you use it effectively. By the end, you’ll know whether this is a strategy worth adding to your betting approach.
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
