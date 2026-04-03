'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'What Is the Martingale Strategy?', 
    title: 'What Is the Martingale Strategy?', 
    content: "The Martingale betting strategy is a simple system where you double your bet after every loss. Your goal is simple: land a win and you’ll recover all your previous losses plus make a small profit.\n\n**Example:** You start with a $10 bet and lose. Your next bet is for $20, but you lose again. You then instantly double the wager to $40 and fail. Your next bet then becomes $80. Should you win $80, you will immediately recover the amounts lost at $10 + $20 + $40 and allow yourself a $10 profit.\n\nThe idea behind this betting strategy is simple: the idea that you’re always just one win away from getting all your losses and securing a profit. In theory, the Martingale system seems foolproof and promises almost certain profit. In practice, though, long losing streaks and limited bankrolls make it far riskier.",
    advantages: [],
    risks: []
  },
  { 
    id: 'Where Did the Martingale System Come From?', 
    title: 'Where Did the Martingale System Come From?', 
    content: "The Martingale betting system originated in France during the 18th century. This system was first used for simple coin-flip wagers with even odds. However, its structure also made it suitable for games like roulette.\n\nIn the 20th century, French mathematician Paul Pierre Lévy connected the system to probability theory. As a result, the Martingale system got a proper mathematical framework.\n\nOver time, the method spread to other areas, including blackjack, sports betting, and even financial trading. What draws people to it is its straightforward nature. Anyone can grasp the idea and apply it without complex maths.",
    advantages: [],
    risks: []
  },
  { 
    id: 'How Does the Martingale Betting System Work in Practice?', 
    title: 'How Does the Martingale Betting System Work in Practice?', 
    content: "In this section, we break down how you can apply the strategy step by step:\n\n1. **Start With a Base Bet:** Choose a unit size that fits your bankroll. Most people use 1-2% of their bankroll.\n2. **Double After a Loss:** Every time you lose, double your stake.\n3. **Reset After a Win:** When you win, reset back to your base bet and repeat.\n\nHere’s a quick example starting with $5:\n\n• **Bet 1:** $5 - Lose (Bankroll -$5)\n• **Bet 2:** $10 - Lose (Bankroll -$15 total)\n• **Bet 3:** $20 - Lose (Bankroll -$35 total)\n• **Bet 4:** $40 - Win (Bankroll +$5 net profit)\n\nAt first, it feels safe. One win turns the session green. But as the losing streak grows, the bet size doubles. This seems manageable, but there might be a moment at which it completely drains your bankroll.",
    advantages: [],
    risks: []
  },
  { 
    id: 'Why the Martingale System Isn’t Foolproof', 
    title: 'Why the Martingale System Isn’t Foolproof', 
    content: "At first glance, the Martingale system betting feels like a cheat code. The logic is simple: if you keep doubling your bets, eventually you’ll win. However, some factors make this system risky. They include:\n\n### Table Limits or Betting Caps\nBoth land-based and online casinos can set limits on their table games and live dealer options. Others may attach maximum betting sizes to their games, which prevent you from using this strategy to double your bets. In such cases, suffering a long losing streak means a permanent loss of valuable betting funds.\n\n**Example:** Suppose you begin with a $10 bet. After seven straight losses, you would need to stake $1,280 to continue the system. But with a table limit of $1,000, you can’t place the required wager. At that point, the strategy breaks down, leaving you unable to recover your losses.\n\n### Bankroll Size\nChances are you’re gambling with a set budget, which means your bankroll is limited. On a long losing streak, doubling your bets over and over simply isn't realistic. Continually increasing your wager by 2x after each loss quickly becomes impractical if you desire to gamble responsibly.\n\nRead more about this in our [Bankroll management guide](/academy/bankroll-management).",
    advantages: [],
    risks: []
  },
  { 
    id: 'Martingale Bet Calculator', 
    title: 'Martingale Bet Calculator', 
    content: "A Martingale bet calculator can show you how quickly bets grow and whether your bankroll can handle it. For example, if your base bet is $5, here’s what happens after eight straight losses:\n\n• **Bet 1:** $5\n• **Bet 2:** $10\n• **Bet 3:** $20\n• **Bet 4:** $40\n• **Bet 5:** $80\n• **Bet 6:** $160\n• **Bet 7:** $320\n• **Bet 8:** $640\n\nBy the eighth round, you’re betting $640 to win just $5. One more loss and you’re down $1,275 total. Martingale bet calculators help you foresee these potential risks. They show you how quickly losses can grow out of control before you even begin using the strategy.",
    advantages: [],
    risks: []
  },
  { 
    id: 'Variations of the Martingale System', 
    title: 'Variations of the Martingale System', 
    content: "There are several versions of this system you can use if you don’t want to stick with the original. They include:\n\n### Reverse Martingale (Paroli System)\nInstead of doubling after every loss, you double your bet after a win. This approach lets you capitalise on winning streaks, which keeps losing streaks less damaging. However, there is a downside to this strategy. With one bad loss, you could lose all your gains, ensuring you are left with nothing after several winning runs.\n\n### Grand Martingale\nThis version raises the risk even higher. After each loss, you don’t just double your bet - you also add an extra unit. This means a win will bring in more profit, but your money can disappear much faster. It might look tempting if you expect to win soon, but if you keep losing, the losses get much bigger.\n\n### Mini-Martingale\nIn this martingale system betting variation, you set a strict stop-loss limit for each betting session. For instance, you may decide to double your bet only five times before quitting. In terms of bankroll management, this approach reduces some of the risks associated with the original Martingale betting system. However, since you are still doubling your bets, it also means you could walk away with a significant loss if a win doesn’t arrive in time.\n\n### Anti-Martingale Hybrids\nIn this variation, you double your bets during winning streaks and scale down when losses come. The goal is to balance aggression with caution. However, by constantly doubling your bets, you open yourself to the possibility of losing all your previous gains.\n\nIn the end, every version tries to cover the same weakness. No matter how you adjust it, the Martingale system relies on the idea that a win will eventually come. However, such an assumption makes the strategy dangerous.",
    advantages: [],
    risks: []
  },
  { 
    id: 'Using Martingale in Sports Betting', 
    title: 'Using Martingale in Sports Betting', 
    content: "The martingale betting system will be very effective when betting on heavy favourites with odds around 1.40-1.60. Although the profits are usually small, you should get a lot of wins by applying it to teams that have proven their potential to win.\n\nApplying this strategy for such teams against weaker opponents will see you get lots of wins. There could be the occasional losses to the heavyweight teams. However, throughout a season, they are likely to secure more wins than losses. So with a single win, you should get your betting funds and some profit back.\n\nHowever, do not apply it to evenly matched teams or teams that are suffering a poor run of form or a losing streak. Overall, it's better to treat Martingale as a fun experiment than a serious long-term strategy.",
    advantages: [],
    risks: []
  },
  { 
    id: 'Tips If You Want to Try the Martingale Strategy', 
    title: 'Tips If You Want to Try the Martingale Strategy', 
    content: "If you're determined to test this betting strategy, here's how to reduce risks:\n\n• **Start with tiny stakes:** Your base bet should be minimal compared to your bankroll.\n• **Pick even-money markets:** Roulette red/black or sports bets selections with odds around 2.00.\n• **Set strict stop-loss rules:** Decide how many rounds you’ll double before walking away.\n• **Don’t chase forever:** Accept that losses will come and know when to exit before your bankroll takes a big hit.\n• **Use it short-term only:** It’s not built for sustainable long-term betting.",
    advantages: [],
    risks: []
  },
  { 
    id: 'is-it-worth-it', 
    title: 'Is the Martingale Betting System Worth It?', 
    content: "The Martingale system isn’t a guaranteed way to win. It’s a relatively risky strategy that can work for short sessions but is highly vulnerable to long losing streaks.\n\nIf you’re a casual player, it can be fun to try this strategy with small bets just for the experience. But if you’re aiming for long-term profit, you’ll be better off sticking to smart bankroll management and better value bets.",
    advantages: [],
    risks: []
  },
  { 
    id: 'final-thoughts', 
    title: 'Final Thoughts', 
    content: "The Martingale strategy has passed the test because of its simplicity. But simple does not mean safe. Doubling your bets after each loss may look smart. However, with each increase, you risk losing more money.\n\nIf you still wish to try the Martingale system, see it as entertainment. This system does not guarantee consistent profits. So bet small, set limits, and never risk more than you can afford to lose. In the end, no system replaces discipline.",
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
        question: "What is martingale betting?",
        answer: "It is a betting system where you double your stake after every loss, with the goal of recovering all previous losses and making a small profit with a single win."
      },
      {
        question: "What is the 100% profitable Martingale strategy?",
        answer: "There is no 100% profitable strategy. In theory, Martingale works with an infinite bankroll and no table limits, but in reality, both factors limit its success."
      },
      {
        question: "Do casinos ban Martingale?",
        answer: "No, casinos generally do not ban the Martingale system because they have table limits (maximum bets) that prevent players from doubling their stakes indefinitely."
      }
    ]
  }
];

export default function MartingalePage() {
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
          <span className="text-brand-emerald uppercase">MARTINGALE SYSTEM</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Martingale <span className="text-brand-emerald">System</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "The Martingale betting system works on a simple logic: after each loss, you double your bet. The idea is that with one win, you will recover previous losses and earn a profit."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    It might sound simple, but does it work in practice? Or is it just a fast way to lose all your money? This OddinsOdds Academy guide takes a closer look at this well-known strategy. We consider its origins and break down how it works.
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

              <div className="pt-12 mt-12 border-t border-slate-100 flex flex-wrap gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-medium text-slate-400">
                  Published on 20 August 2025
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-medium text-slate-400">
                  Last updated on 20 August 2025
                </div>
              </div>
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
