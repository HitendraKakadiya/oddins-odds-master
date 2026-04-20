import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'stoic-baseline', 
    title: 'The Stoic Baseline: Eliminating Staking Volatility', 
    content: (
      <>
        Flat betting is the most disciplined form of money management in sports betting. It involves wagering the exact same amount on every single event, regardless of your confidence level, recent win/loss streaks, or the odds of the match. By removing the &quot;Bet Sizing&quot; variable, you isolate the only thing that matters: your ability to find <strong>Positive Expected Value (+EV)</strong>.
        <br /><br />
        <strong>The Mechanics:</strong>
        <br />
        • <strong>Bankroll:</strong> $2,000
        <br />
        • <strong>Flat Stake (1%):</strong> $20
        <br />
        • <strong>Constraint:</strong> Every bet is $20. Always.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'law-of-large-numbers', 
    title: 'The Law of Large Numbers: Surviving the Mathematical Grind', 
    content: (
      <>
        Sports betting is a high-volume business. To overcome the bookmaker&apos;s &quot;vig&quot; (margin), you need a massive sample size of bets. Flat betting is the only strategy that guarantees you will stay in the game long enough for the <strong>Law of Large Numbers</strong> to work in your favor.
        <br /><br />
        <strong>Survival over Sensation:</strong>
        <br />
        Unlike progressive systems (Martingale), flat betting ensures that a 10game losing streak only costs you 10% of your bankroll. This resilience allows you to weather the inevitable &quot;downswings&quot; of sports variance without the risk of insolvency.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'selection-purity', 
    title: 'Selection Purity: Evaluating Your Edge', 
    content: (
      <>
        Professional syndicates use flat betting to &quot;Audit&quot; their analysts. If a bettor is not profitable using flat stakes, it proves they do not have a genuine <strong>Predictive Edge</strong>.
        <br /><br />
        <strong>The Audit Protocol:</strong>
        <br />
        • <strong>Step 1:</strong> Place 500 flat-stake bets.
        <br />
        • <strong>Step 2:</strong> Calculate your yield.
        <br />
        • <strong>Step 3:</strong> If ROI is positive, you have found value. If negative, you are likely just guessing.
        <br /><br />
        Flat betting removes the &quot;noise&quot; created by varying bet sizes, giving you a clinical view of your actual sports knowledge.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-resilience', 
    title: 'Operational Resilience: The Psychological Anchor', 
    content: (
      <>
        The biggest enemy of a bettor is their own brain. The &quot;Gambler&apos;s Fallacy&quot; and &quot;Loss Aversion&quot; drive people to bet more when they are losing. Flat betting acts as a <strong>Psychological Anchor</strong>, forcing you to remain rational when emotions are high.
        <br /><br />
        <strong>Mental Advantages:</strong>
        <br />
        • <strong>Eliminates the &quot;Chase&quot;:</strong> No more doubling down to win back losses.
        <br />
        • <strong>Reduces Stress:</strong> Since the risk is always known and controlled, you can focus on analysis rather than anxiety.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: "The Professional&apos;s Foundation", 
    content: (
      <>
        Flat betting might seem boring, but in the world of professional betting, &quot;boring&quot; is synonymous with &quot;sustainable.&quot; It is the benchmark against which all other strategies (Kelly, Fibonacci, Proportional) are measured. If you cannot survive a flat-betting grind, you will not survive professional betting.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'faqs', 
    title: 'Expert Q&A', 
    content: '',
    advantages: [],
    risks: [],
    faqs: [
      {
        question: "Is flat betting better for favorites or underdogs?",
        answer: "Flat betting is mathematically neutral. However, it is especially effective for underdogs because the higher payouts on a fixed stake allow you to remain profitable even with a lower strike rate."
      },
      {
        question: "How do I know when to increase my flat stake?",
        answer: "Professional protocol usually dictates a re-evaluation of the 'Unit' after a significant bankroll milestone (e.g., every 25% or 50% increase). If your $1,000 bankroll hits $1,500, you might move your stake from $10 to $15."
      },
      {
        question: "Does flat betting work for parlays?",
        answer: "While you *can* flat-bet parlays, it is generally discouraged. Flat betting is designed for single bets where the house edge is manageable. Parlays carry a much higher house margin, which flat betting cannot fully mitigate."
      },
      {
        question: "Is 5% too high for a flat stake?",
        answer: "Yes. In professional circles, 5% is considered 'reckless.' Even at 5%, a moderate losing streak (20 bets) can wipe you out completely. High-volume pros stick to 1% to 2%."
      }
    ]
  }
];

export default function FlatBettingPage() {
    
  
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Flat Betting <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Excitement is the tax you pay for lack of discipline. Flat betting is the clinical benchmark for serious capital management.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    While progressive systems promise quick recoveries and &apos;hot streaks&apos; promise riches, flat betting provides the one thing every professional needs: <strong>Statistical Survival</strong>. In this masterclass, we explore how flat staking allows you to isolate your predictive edge, survive the inevitable laws of variance, and build a sustainable long-term betting career.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-12">
              {sections.map((section) => (
                <StrategyContentSection
                  key={section.id}
                  {...section}
                  
                />
              ))}
            </div>
          </StrategyPageClientWrapper>
      </div>
    </div>
  );
}
