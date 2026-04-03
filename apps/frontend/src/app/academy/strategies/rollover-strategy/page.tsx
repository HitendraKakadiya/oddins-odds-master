'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-rollover', 
    title: 'What is Rollover in Betting?', 
    content: "Rollover is simply the number of times you need to wager your deposit or bonus before you're allowed to withdraw. Online bookmakers use it to stop you from signing up, grabbing a bonus and cashing out immediately.\n\nLet’s say you deposit $100, and the bookmaker gives you another $100 bonus with a 5x rollover requirement. That means you must wager $1,000 total ($200 × 5) before you can withdraw anything connected to that bonus. It doesn’t matter whether you win or lose along the way - what matters is the total amount staked. That’s why strategy is very important.",
    advantages: [],
    risks: []
  },
  { 
    id: 'why-it-matters', 
    title: 'Why the Rollover Strategy Matters?', 
    content: "If you are trying to beat rollover without a proper plan and strategy, you will exhaust your betting budget. But on the other hand, if you treat this as a proper structured system, you can grow your balance by fulfilling the requirements. Rollover betting is less about chasing \"big wins\" and more about playing consistent, controlled bets that keep your budget alive until the rollover is complete.\n\nOnce you’re done, your winnings are yours to withdraw. Here’s the formula you should always keep in mind:\n\n**Total Wager Required = Rollover Multiple × (Deposit + Bonus)**\n\n**Example:**\n• Deposit = $100\n• Bonus = $100\n• Rollover = 5x\n\n**Total wager required = 5 × ($100 + $100) = $1,000**\n\nThis formula works as a simple tracker so that you know how much you need to bet. If you are not keeping a track, then you might realise that you have still not staked the required amount.",
    advantages: [],
    risks: []
  },
  { 
    id: 'rules-to-watch', 
    title: 'Rules to Watch Before You Start Betting', 
    content: "Not all bets count equally toward rollover. Bookmakers add some rules and regulations that can trick you if you are not careful. Here are some points you need to keep in mind:\n\n• **Minimum Odds:** Most books require your bets to be above 1.20, 1.30, or 1.50 odds. If you bet on a heavy favourite at 1.05, it may not even count.\n• **Eligible Bet Types:** Single bets usually count. Some sportsbooks exclude acca, cash-outs, or certain markets.\n• **Time Limits:** Some rollovers must be completed within 7 days, others within 30. Rushing often leads to bad bets.\n• **Stakes vs. Winnings:** Some betting sites count the full stake; others only count winnings toward the rollover. Always double-check.",
    advantages: [],
    risks: []
  },
  { 
    id: 'explaining-strategy', 
    title: 'Explaining the Rollover Strategy', 
    content: "So, how do you clear the rollover? The trick is to balance safe bets with the odds that qualify. You don’t want to put all your money on risky bets that could wipe out your bankroll, but at the same time, you can’t waste time on bets that don’t even count toward the rollover. The key to this is finding the middle ground.",
    advantages: [],
    risks: []
  },
  { 
    id: 'odds-range', 
    title: 'Choose the Right Odds Range', 
    content: "### 1.20 Odds Rollover Strategy\nThis is the ultra-safe approach. You stack small favourites or use handicaps like “Over 0.5 goals” or “+2 Asian Handicap.” It’s slow, but you minimise the risk of losing your funds early.\n\n### 1.50 Odds Rollover Strategy\nThis gives you a higher return. For example, betting on a team to win but with a double chance betting market (home win or draw) often falls around 1.45-1.55. It keeps the risk manageable while moving you faster through the rollover.",
    advantages: [],
    risks: []
  },
  { 
    id: 'track-every-bet', 
    title: 'Track Every Bet', 
    content: "Imagine you've got a $500 rollover target. You've placed $400 worth of bets, but you lose track and think you're finished. You try to withdraw, only to see the money locked. That frustration can demotivate you and might lead to a bad bet. Keep a simple tracker:\n\n• Total rollover target\n• Amount staked so far\n• Balance left to play",
    advantages: [],
    risks: []
  },
  { 
    id: 'pick-correct-market', 
    title: 'Pick the Correct Market', 
    content: "Picking the right betting market means as much as the odds. The best rollover bets that you can give it a shot at are:\n\n• Over 0.5 goals (almost guaranteed unless you’re betting very late in a match)\n• Asian handicaps like +1.5 or +2\n• Double chance on strong favourites\n• Tennis set betting (top players to win at least a set often fall in safe ranges)\n\nAvoid long parlays or props like first goalscorer. They may hit once in a while, but you can’t build a steady rollover with them.",
    advantages: [],
    risks: []
  },
  { 
    id: 'mistakes-to-avoid', 
    title: 'Mistakes to Avoid', 
    content: "Even the best of strategies can fail. A single bad decision or overlooking rules and regulations could cost you badly. Let’s check the avoidable mistakes:\n\n• **Chasing Losses:** If you are trying to double your bets after a loss, that’s a bad strategy. Don’t do it.\n• **Ignoring the Odds Requirement:** A 1.05 odds bet on Barcelona’s win won’t count if the minimum is 1.20. Always double-check the wagering requirements.\n• **Overloading Your Betting Slip:** Trying to bet five or six games or markets simultaneously can be tempting, but it could end up being shocking as well. Don’t overbet.\n• **Underestimating the Deadline:** Don’t accept a bonus with a 7-day rollover if you can’t realistically meet it. Go for a 15-day or 30-day instead.",
    advantages: [],
    risks: []
  },
  { 
    id: 'advanced-tips', 
    title: 'Advanced Tips for Rollover Strategy', 
    content: "Once you have understood the basics of rollover strategy, you can take one step further. These extra tips can help you finish the rollover faster and keep your money safer while you are betting.\n\n• **Use Multiple Sports:** Don’t just rely on football. Also bet on tennis, basketball, and esports, which also have steady odds of 1.50-1.75.\n• **Live Betting Opportunities:** Sometimes, live odds are perfect to make the most of the wagering requirements. You can easily find markets like over 0.5 goals around 1.50 around the 40-minute mark.\n• **Cash-Out (If Allowed):** If your bookmaker counts the stake toward rollover even with cash-outs, you can use it strategically and make the most of it.\n• **Don’t Get Excited:** Rollover betting might give you adrenaline pump, but it's not about getting excited. It's about being calm and consistent.",
    advantages: [],
    risks: []
  },
  {
    id: 'final-thoughts',
    title: 'Final Thoughts',
    content: "The rollover strategy is one of the smartest ways to turn betting bonuses into real profits, but only if you approach it with discipline and patience. Instead of seeing rollover as a hurdle, think of it as a structured plan that keeps your betting controlled. By using safe odds like 1.20 or 1.30, you can steadily make progress, or by using 1.50 odds, you can make faster progress.\n\nThis can give you the best chance to complete any betting rollover requirement without blowing your bankroll. The key is to place qualifying bets consistently. In addition to that, track your betting slips and don’t make a risky bet to overcome losses. If you keep all the above points in mind, you will stop thinking of rollover as a hurdle and will consistently build profits.",
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
        question: "How do do rollover in betting?",
        answer: "By placing strategic, consistent bets that meet the bookmaker's minimum odds and eligible market requirements until the total wagering target is reached."
      },
      {
        question: "How to calculate a rollover?",
        answer: "Use the formula: Total Wager Required = Rollover Multiple × (Deposit + Bonus)."
      },
      {
        question: "What is the most profitable betting strategy?",
        answer: "While profits vary, a structured rollover strategy using safe odds (1.20-1.50) is one of the most reliable ways to convert bonus funds into withdrawable cash."
      }
    ]
  }
];

export default function RolloverStrategyPage() {
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
          <span className="text-brand-emerald uppercase">ROLLOVER STRATEGY</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Rollover Strategy <span className="text-brand-emerald">Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "When you first hear the word 'rollover' in betting, it can sound confusing. But if you want to make money from betting sites, you need to know what it means."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Rollover is a kind of barrier that stops you from withdrawing your bonus right away. The good news is, with the right plan, that barrier becomes more like a set of steps, you just climb them one by one until you can finally cash out real money. In this OddinsOdds Academy guide, we will talk about rollover strategy in detail.
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
