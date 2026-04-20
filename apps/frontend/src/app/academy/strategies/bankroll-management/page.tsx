import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'capital-preservation', 
    title: 'The Capital Preservation Mindset: Betting as an Asset Class', 
    content: (
      <>
        Professional betting is not about &quot;winning a match&quot;; it is about <strong>risk management</strong>. Your bankroll is your inventory. Without it, you cannot trade in the betting markets. Bankroll management is the systematic process of protecting that inventory against the statistical inevitability of variance.
        <br /><br />
        <strong>The Golden Rules:</strong>
        <br />
        • <strong>Isolation:</strong> Your bankroll must be separate from your life savings.
        <br />
        • <strong>Emotional Neutrality:</strong> Money on the table is already &quot;lost&quot;—you are simply managing its turnover.
        <br />
        • <strong>Capital Preservation:</strong> The priority is to avoid &quot;The Zero&quot;—the point where you can no longer place a value bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'unit-system', 
    title: 'The Unit System: Standardizing Risk Across Markets', 
    content: (
      <>
        Betting arbitrary amounts is the fastest route to ruin. Professionals use a <strong>Unit System</strong>, where 1 Unit represents a small, fixed percentage of their total bankroll (typically 1-2%).
        <br /><br />
        <strong>Standardized Sizing:</strong>
        <br />
        • <strong>1 Unit (1%):</strong> Standard confidence/value bet.
        <br />
        • <strong>3 Units (3%):</strong> High-conviction edge (Rare).
        <br />
        • <strong>0.5 Units (0.5%):</strong> Speculative &quot;Long Shot&quot; or experimental market.
        <br /><br />
        By using units, you ensure that no single &quot;bad beat&quot; can significantly damage your long-term growth.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'variance-downswing', 
    title: 'Variance and the &quot;Downswing&quot;: Protecting Your Mental Edge', 
    content: (
      <>
        Even a 60% strike-rate bettor has a 5% chance of suffering <strong>10 consecutive losses</strong> at some point in their career. This is variance. Bankroll management provides the buffer needed to survive these mathematical slumps without going broke.
        <br /><br />
        <strong>The Psychology of the Slump:</strong>
        <br />
        • <strong>Resist the Chase:</strong> Never increase stakes to &quot;win back&quot; losses.
        <br />
        • <strong>Trust the Volume:</strong> If your edge is mathematically proven, profit will arrive over thousands of bets, not tens.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-hygiene', 
    title: 'Operational Hygiene: Tracking, Auditing, and Recalibrating', 
    content: (
      <>
        You cannot manage what you do not measure. A professional bankroll workflow requires meticulous tracking and a monthly &quot;audit&quot; of your performance data.
        <br /><br />
        <strong>Audit Checklist:</strong>
        <br />
        • <strong>ROI Tracking:</strong> What is your Return on Investment per unit?
        <br />
        • <strong>Market Analysis:</strong> Are you more profitable in Over/Under than Match Results?
        <br />
        • <strong>Unit Realignment:</strong> If your bankroll grows by 20%, increase your unit value proportionately. If it drops, scale down to protect the core capital.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Foundation of Success', 
    content: (
      <>
        In the betting world, math trumps sports knowledge every time. Bankroll management is the mathematical shield that allows you to stay in the game long enough for your edge to manifest. Without it, you are not a bettor—you are a guest donor to the bookmakers.
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
        question: "Is 'Flat Betting' better than 'Proportional Sizing'?",
        answer: "Flat betting is more conservative and safer for beginners. Proportional sizing (betting a % of the *current* balance) allows for faster bankroll growth during winning streaks but requires more discipline during losses."
      },
      {
        question: "How large should my bankroll be?",
        answer: "Large enough that a 1% unit bet is meaningful to you, but small enough that losing the entire amount wouldn&apos;t impact your ability to pay rent or bills. For beginners, $500 - $1,000 is a standard starting point."
      },
      {
        question: "What is the biggest mistake in bankroll management?",
        answer: "Speculative &apos;Accas&apos; or &apos;Parlays&apos;. Adding multiple legs to a bet exponentially increases the house edge and is the leading cause of bankroll drainage for recreational bettors."
      },
      {
        question: "When should I withdraw my profits?",
        answer: "Ideally, only after you have reached a significant milestone (e.g., doubling your bankroll). Constant withdrawals prevent the power of compound interest from growing your unit size effectively."
      }
    ]
  }
];

export default function BankrollManagementPage() {
    
  
  
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
          <span className="text-brand-emerald uppercase">BANKROLL MANAGEMENT GUIDE</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Bankroll <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Strategy without capital management is just an expensive hobby. Protecting your bankroll is the first and most important law of professional betting.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this definitive guide, we move beyond basic &apos;budgeting&apos; to explore the mathematics of capital preservation. We cover unit standardisation, the psychology of variance, and the operational hygiene required to treat your betting as a high-performance asset class.
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
