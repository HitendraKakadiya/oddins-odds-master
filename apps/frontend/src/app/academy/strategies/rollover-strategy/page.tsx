import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'hidden-tax', 
    title: 'The Hidden Tax of Bonuses: Deciphering Wagering Requirements', 
    content: (
      <>
        In the betting industry, a &quot;bonus&quot; is rarely immediate cash. Instead, it is a liability that must be converted into an asset through a process called <strong>Rollover</strong> (or Wagering Requirements). This is a multiplier—often 5x to 15x—applied to your deposit and bonus amount that determines how much total volume you must bet before a withdrawal is permitted.
        <br /><br />
        <strong>The Commitment:</strong>
        <br />
        • <strong>Deposit:</strong> $100
        <br />
        • <strong>Bonus:</strong> $100
        <br />
        • <strong>Rollover (10x):</strong> You must place $2,000 worth of total bets before cashing out.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'persistence-formula', 
    title: 'The Persistence Formula: Growth vs. Burn Rate', 
    content: (
      <>
        The key to a successful rollover is managing your <strong>Burn Rate</strong>—the speed at which you lose your initial capital versus the speed at which you complete the wagering target. Your goal is to maximize turnover while minimizing the &quot;house edge&quot; impact on your balance.
        <br /><br />
        <strong>Calculation:</strong>
        <br />
        Turnover Required = (Deposit + Bonus) × Multiplier
        <br /><br />
        If you bet on markets with a 5% house edge, you can expect to &quot;lose&quot; 5% of your turnover. If your bonus is larger than this 5%, the rollover is mathematically profitable.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'low-variance-grinding', 
    title: 'Low-Variance Grinding: Selecting High-Probability Markets', 
    content: (
      <>
        Professional rollover completion is not about &quot;winning big&quot;; it is about <strong>surviving the turnover</strong>. This requires a shift toward low-variance markets that provide high strike rates, even if the individual returns are small.
        <br /><br />
        <strong>Optimal Markets:</strong>
        <br />
        • <strong>Asian Handicaps (+1.5, +2.0):</strong> Providing significant safety margins for the underdog.
        <br />
        • <strong>Over 0.5/1.5 Goals:</strong> Capitalizing on the high statistical probability of goals in modern league football.
        <br />
        • <strong>Double Chance (1X or X2):</strong> Covering 66% of the possible match outcomes in a single bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'minimum-odds-trap', 
    title: 'The Trap of Minimum Odds: Navigating T&Cs', 
    content: (
      <>
        Bookmakers use <strong>Minimum Odds</strong> requirements to prevent you from betting on &quot;sure things&quot; to clear a bonus. They often require odds between 1.50 and 2.00. Navigating this threshold without taking on unnecessary risk is the core skill of a rollover specialist.
        <br /><br />
        <strong>Strategic Tips:</strong>
        <br />
        • <strong>Odd-Hunting:</strong> Look for bets exactly at the minimum threshold (e.g., 1.51) to minimize the risk while fulfilling the requirement.
        <br />
        • <strong>Time Management:</strong> Don&apos;t rush. Use the full 30-day window to find high-value, lower-risk opportunities rather than forcing bad bets to meet a deadline.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Strategic Liquidity', 
    content: (
      <>
        A bonus should be viewed as an illiquid asset. Through a disciplined rollover strategy, you are performing an <strong>Asset Conversion</strong>. By treating the process with the same rigor as a financial audit, you turn &quot;stuck&quot; bonus credits into spendable profit.
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
        question: "Can I use &apos;Cash Out&apos; to clear my rollover?",
        answer: "Usually, no. Most bookmakers exclude &apos;cashed-out&apos; bets from counting toward the rollover target. Always Read the terms and conditions specifically for &apos;settled&apos; bet requirements."
      },
      {
        question: "What happens if my balance hits zero during a rollover?",
        answer: "If your balance reaches zero, the rollover requirement is typically considered &apos;null&apos; or cleared. However, some books may apply it to your *next* deposit, so verify if the rollover is &apos;reset&apos; after a loss."
      },
      {
        question: "Is it better to place one big bet or many small ones?",
        answer: "Smaller, consistent bets are always better. They distribute the risk and prevent a single &apos;bad beat&apos; from wiping out your entire capital before you&apos;ve reached even 10% of the target."
      },
      {
        question: "Does betting on both sides of a game count?",
        answer: "No. Bookmakers explicitly ban &apos;opposite betting&apos; (e.g., betting on both Over and Under 2.5) to clear rollover. This will likely lead to your account being closed and funds confiscated."
      }
    ]
  }
];

export default function RolloverStrategyPage() {
    
  
  
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
          <span className="text-brand-emerald uppercase">ROLLOVER STRATEGY</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Rollover <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Rollover is the price of admission for bookmaker bonuses. Clearing it requires the patience of an auditor and the strategy of a risk manager.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Most bettors see rollover as an impossible hurdle. We see it as a liquidity conversion task. In this technical guide, we break down the formula, address the math of &apos;Burn Rates,&apos; and how to navigate the complex T&Cs that bookmakers use to protect their capital.
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
