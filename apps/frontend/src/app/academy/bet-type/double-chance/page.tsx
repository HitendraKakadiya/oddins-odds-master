import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'probability-floor', 
    title: 'The Probability Floor: Securing 66.6% of Outcomes', 
    content: (
      <>
        Double Chance (DC) is the most fundamental tool for increasing your &quot;Probability Floor.&quot; In a standard 3-way (1X2) market, you are mathematically selecting only 33.3% of the possible match states. Double Chance immediately elevates that coverage to <strong>66.6%</strong> by allowing you to combine two of the three outcomes into a single wager.
        <br /><br />
        <strong>The Three Pillars of DC:</strong>
        <br />
        • <strong>1X (Home or Draw):</strong> Covers the home win and the stalemate. Your bet only fails if the away team wins.
        <br />
        • <strong>X2 (Away or Draw):</strong> Covers the away win and the stalemate. Your bet only fails if the home team wins.
        <br />
        • <strong>12 (Home or Away):</strong> Eliminates the &quot;Draw&quot; entirely. Your bet wins as long as the match does not end in a tie.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'variant-12', 
    title: "The &apos;12&apos; Variant: Elimination of the Stale Match", 
    content: (
      <>
        The <strong>&apos;12&apos; betting market</strong> is often the most underutilized tool in a professional&apos;s arsenal. It is specifically designed for high-stakes environments where a draw serves no party—such as second-leg knockout matches or final-day survival battles.
        <br /><br />
        <strong>Tactical Deployment:</strong>
        <br />
        Deploy &apos;12&apos; when you observe &quot;Glass-Cannon&quot; dynamics: two teams with high attacking efficiency but catastrophic defensive lapses. In these scenarios, the probability of a 0-0 or 1-1 stalemate is statistically lower than a decisive result in either direction.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'accumulator-safety', 
    title: 'Accumulator Safety Margins: The Volatility Buffer', 
    content: (
      <>
        For serious parlay (accumulator) construction, Double Chance provides a <strong>volatility buffer</strong>. While a straight win offers higher individual odds, the cumulative variance of five straight wins is exponentially higher than five Double Chance selections.
        <br /><br />
        <strong>The Yield Curve:</strong>
        <br />
        By using DC in your combos, you trade off peak &quot;Alpha&quot; (maximum possible profit) for a significantly higher &quot;Expected Hit Rate.&quot; This is a primary strategy for professional bankrolls aiming for consistent, incremental growth rather than high-risk &quot;moon-shots.&quot;
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'pricing-efficiency', 
    title: 'Pricing Efficiency: DC vs. Asian Handicap +0.5', 
    content: (
      <>
        A technical secret shared by professional bettors is the parity between <strong>Double Chance (1X/X2)</strong> and <strong>Asian Handicap (+0.5)</strong>. Both bets cover the win and the draw.
        <br /><br />
        <strong>The Value Arbitrage:</strong>
        <br />
        Always compare the price of DC with the +0.5 AH line on the same team. Occasionally, due to different liquidity pools or bookmaker &quot;bias,&quot; one market will offer a 2-5% higher payout for the exact same mathematical probability. Exploiting these discrepancies is the hallmark of a masterclass bettor.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Conservative Alpha', 
    content: (
      <>
        Double Chance is the foundation of defensive betting. It rewards the analyst who correctly identifies that a team is <strong>unlikely to lose</strong>, even if they aren&apos;t clinical enough to guarantee a win. When managed with a clear focus on pricing efficiency, DC becomes one of the most stable revenue streams in sports betting.
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
        question: "When is Double Chance mathematically &apos;bad value&apos;?",
        answer: "When backing heavy favorites at home (e.g., odds under 1.15). The risk of a freak 'loss' event usually outweighs the negligible return. If you need 1X to make a favorite bet viable, the selection is likely flawed to begin with."
      },
      {
        question: "Is DC better than Draw No Bet?",
        answer: "If you believe the draw is a high-probability event, DC is superior because it pays out on the stalemate. DNB merely refunds your stake, which can lead to &apos;stagnant&apos; bankroll performance in high-draw leagues."
      },
      {
        question: "How does &apos;12&apos; betting behave in overtime?",
        answer: "Crucially, Double Chance markets in football almost exclusively apply to &apos;Regular Time&apos; (90 mins + injury time). They do not extend to Extra Time or Penalty Shootouts unless specifically stated as a &apos;To Qualify&apos; or &apos;To Lift Trophy&apos; market."
      },
      {
        question: "What leagues are best for X2 Double Chance?",
        answer: "Lower-tier leagues with high parity. When parity is high, bookmakers often overestimate &apos;Home Advantage.&apos; Backing resilient away teams at X2 allows you to exploit this bias with a massive 66% probability coverage."
      }
    ]
  }
];

export default function DoubleChancePage() {
    
  
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">DOUBLE CHANCE</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Double Chance <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Double Chance is the clinical expansion of probability—it is the defensive foundation of any professional bankroll strategy.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical breakdown, we examine the &apos;Probability Floor&apos; of Double Chance betting. We explore the tactical utility of the &apos;12&apos; variant in must-win scenarios, the mathematical buffer it provides to high-volatility accumulators, and the value arbitrage between Double Chance and Asian Handicap markets.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => (
                <div key={section.id}>
                  <StrategyContentSection {...section}  />
                </div>
              ))}
            </div>
          </StrategyPageClientWrapper>
      </div>
    </div>
  );
}
