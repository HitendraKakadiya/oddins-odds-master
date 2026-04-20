import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'gold-standard', 
    title: 'The Gold Standard of Risk: Balancing Edge and Bankroll', 
    content: (
      <>
        The Kelly Criterion is widely considered the &quot;Holy Grail&quot; of money management. Developed by John Kelly in 1956, it is a mathematical formula designed to determine the optimal size of a series of bets to maximize the logarithm of wealth. In simpler terms, it finds the exact point where you bet enough to grow your bankroll as fast as possible without ever risking a total wipeout.
        <br /><br />
        <strong>The Kelly Mandate:</strong>
        <br />
        • <strong>Growth Maximization:</strong> It compounds your winnings more efficiently than any other system.
        <br />
        • <strong>Mathematical Safety:</strong> Theoretically, you can never go bust because your stake is always a percentage of your *current* balance.
        <br />
        • <strong>Dynamic Calibration:</strong> Your bet sizes automatically shrink during losing streaks and expand during winning runs.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'formula-of-ambition', 
    title: 'The Formula of Ambition: Calculating the Optimal Stake', 
    content: (
      <>
        The formula calculates the fraction of your bankroll (f*) you should wager based on your perceived edge.
        <br /><br />
        <strong>The Formula: f* = (bp - q) / b</strong>
        <br /><br />
        • <strong>b:</strong> The decimal odds minus 1 (e.g., 2.0 odds = 1.0b).
        <br />
        • <strong>p:</strong> Your estimated probability of winning (e.g., 55% = 0.55).
        <br />
        • <strong>q:</strong> Your probability of losing (1 - p).
        <br /><br />
        If the result is zero or negative, the formula is telling you that the bet has no value and should be avoided entirely.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'sensitivity-crisis', 
    title: 'The Sensitivity Crisis: Why Garbage In Equals Garbage Out', 
    content: (
      <>
        The Kelly Criterion’s greatest strength is also its fatal flaw: <strong>Sensitivity</strong>. The formula assumes your probability estimate (p) is 100% accurate. If you believe a team has a 60% chance of winning, but in reality, they only have a 52% chance, the Kelly Criterion will suggest a stake that is far too aggressive, leading to rapid capital depletion.
        <br /><br />
        <strong>The Accuracy Requirement:</strong>
        <br />
        To use Kelly effectively, you don&apos;t just need to be a good bettor—you need to be a master statistician. You must have a proven model that generates winning probabilities more accurately than the bookmaker&apos;s market price.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'fractional-mitigation', 
    title: 'Fractional Mitigation: Half-Kelly and the Safety Net', 
    content: (
      <>
        Because humans are prone to overconfidence (Overestimation Bias), professional bettors almost never use &quot;Full Kelly.&quot; Instead, they use <strong>Fractional Kelly</strong>.
        <br /><br />
        <strong>Risk Tiers:</strong>
        <br />
        • <strong>Half-Kelly (0.5x):</strong> Betting 50% of what the formula suggests. This dramatically reduces volatility while still capturing 75% of the growth.
        <br />
        • <strong>Quarter-Kelly (0.25x):</strong> Betting 25%. This is the &quot;Industry Standard&quot; for professional syndicates, providing a massive safety buffer against model error.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Clinical Precision', 
    content: (
      <>
        The Kelly Criterion is the bridge between gambling and finance. It transforms a series of sports bets into a high-performance investment portfolio. However, it is a sharp blade that cuts both ways; use it only when you have the data to back up your convictions.
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
        question: "Why is my Kelly percentage so high?",
        answer: "If the formula suggests 20% or 30%, you likely have a massive discrepancy between your estimate and the bookie&apos;s odds. Usually, this means your probability estimate is too optimistic. Re-evaluate your model&apos;s accuracy."
      },
      {
        question: "Can I use Kelly for simultaneous bets?",
        answer: "Yes, but it's complex. If you have 5 matches starting at the same time, you cannot bet 20% on each (100% total bankroll). You must use 'Simultaneous Kelly' which scales the stakes down so the total risk remains manageable."
      },
      {
        question: "Is Kelly better than Flat Betting for beginners?",
        answer: "No. Beginners should stick to Flat Betting (1-2%). Kelly requires a level of probabilistic accuracy that most novice bettors haven&apos;t developed yet."
      },
      {
        question: "How does commission affect the Kelly formula?",
        answer: "Commission (on exchanges like Betfair) must be subtracted from the &apos;b&apos; value. If you have 2.0 odds but pay 2% commission, your true &apos;b&apos; is 0.98, not 1.0."
      }
    ]
  }
];

export default function KellyCriterionPage() {
    
  
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Reading Progress Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/strategies" className="hover:text-brand-emerald transition-colors uppercase">STRATEGIES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase">KELLY CRITERION STRATEGY</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Kelly Criterion <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;The Kelly Criterion is the bridge between pure gambling and clinical finance. It determines not just *what* to bet, but exactly *how much* your edge is worth.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Used by hedge fund managers and professional gambling syndicates alike, the Kelly Criterion is the ultimate tool for exponential bankroll growth. In this technical guide, we break down the formula, address the &apos;sensitivity crisis&apos; of probability estimation, and explain why &apos;Fractional Kelly&apos; is the industry secret for long-term sustainability.
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
