import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'anatomy-of-a-slump', 
    title: 'The Anatomy of a Slump: Beyond Bad Luck', 
    content: (
      <>
        A losing streak isn&apos;t just a series of unfortunate events; it&apos;s a mathematical certainty in the world of high-volume betting. Whether you&apos;re a seasoned pro or a recreational bettor, understanding that streaks are a natural byproduct of variance—not a sign of failure—is the first step toward professional resilience.
        <br /><br />
        Losing streaks are often driven by:
        <br /><br />
        <ul className="space-y-2">
          <li>• <strong>Statistical Variance:</strong> The natural ebb and flow of probability.</li>
          <li>• <strong>Sample Size Bias:</strong> Small clusters of losses are common in the short term.</li>
          <li>• <strong>Market Shifts:</strong> Changes in how bookmakers price certain variables.</li>
          <li>• <strong>Execution Errors:</strong> Slippage in your own betting discipline or analysis.</li>
        </ul>
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'math-of-variance', 
    title: 'The Math of Variance: The Monte Carlo Fallacy', 
    content: (
      <>
        Many bettors fall into the &apos;Gambler&apos;s Fallacy&apos;—believing that because they&apos;ve lost five in a row, a win is &apos;due.&apos; In reality, every event is independent. We use standard deviation to calculate the &apos;Expected Maximum Drawdown,&apos; which helps you prepare for the reality that a 10-loss streak is statistically inevitable over a 1,000-bet sample size.
        <br /><br />
        Consider the probabilities:
        <br />
        • Even with a 55% win rate (a professional edge), the chance of hitting a 7-bet losing streak in a 500-bet sample is nearly 60%.
        <br />
        • Higher odds (underdogs) dramatically increase the frequency and length of these streaks.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'psychological-trap', 
    title: 'The Psychological Trap: Mastering &quot;Tilt&quot;', 
    content: (
      <>
        The greatest danger of a losing streak isn&apos;t the financial loss—it&apos;s the psychological &apos;tilt.&apos; When emotions take over, bettors often deviate from their proven models, increase stake sizes to &apos;break even,&apos; or bet on unfamiliar markets. Mastering your mindset is what separates the winners from the bankrupt.
        <br /><br />
        Watch for these &apos;Tilt&apos; triggers:
        <br />
        • <strong>Revenge betting</strong> immediately after a loss.
        <br />
        • Feeling &apos;cheated&apos; by late goals or referee decisions.
        <br />
        • Obsessively checking scores of games you didn&apos;t even bet on.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'survival-tactics', 
    title: 'Tactical Survival: The &quot;Stake Down&quot; Strategy', 
    content: (
      <>
        When a streak hits, the best defense is a strategic retreat. Instead of chasing, professional bettors often &apos;Stake Down&apos;—reducing their unit size (e.g., from 2% to 0.5% of their bankroll). This preserves capital while you wait for the variance to normalize, ensuring you stay in the game long enough for your edge to manifest again.
        <br /><br />
        <strong>Key Survival Rules:</strong>
        <br />
        • <strong>Never</strong> increase stakes to recover losses.
        <br />
        • <strong>Lower</strong> your unit size during high-variance periods.
        <br />
        • <strong>Set</strong> a hard &apos;Stop-Loss&apos; limit for the day or week.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'road-to-recovery', 
    title: 'The Road to Recovery: Audit and Restart', 
    content: (
      <>
        A losing streak is the best time for a rigorous audit. Was it bad luck, or has the market moved against your model? Review every bet placed during the streak. If the logic holds, stay the course. If not, pivot. Sometimes, the most profitable move you can make is taking a three-day break to reset your perspective.
        <br /><br />
        <strong>Audit Checklist:</strong>
        <br />
        • Did I follow my pre-defined criteria for every bet?
        <br />
        • Is my closing line value (CLV) still positive?
        <br />
        • Am I making decisions based on data or desperation?
      </>
    ),
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Resilience as a Strategy',
    content: "Winning bettors aren&apos;t those who never lose—they&apos;re those who lose better. By accepting variance, managing emotions, and strictly adhering to bankroll discipline, you turn a losing streak from a crisis into a routine part of your professional evolution. Remember: the long run is much longer than most people think.",
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
        question: "Can a losing streak be a sign of a bad model?",
        answer: "Yes. If the streak exceeds your calculated &apos;Max Drawdown&apos; based on historical data, or if your Closing Line Value (CLV) is consistently negative, it&apos;s time to re-evaluate your edge."
      },
      {
        question: "How do I know when to stop?",
        answer: "Stop immediately if you find yourself betting out of anger, or if you&apos;ve hit your pre-defined &apos;Stop-Loss&apos; limit. Professionalism is knowing when the edge has vanished."
      },
      {
        question: "Is it better to follow a streak or go against it?",
        answer: "Neither. Statistics show that &apos;streaks&apos; in independent events don&apos;t influence future outcomes. Always bet based on value and probability, not recent history."
      },
      {
        question: "How can I stay calm during a 10-bet loss?",
        answer: "Focus on the process, not the outcome. If your analysis was correct and you achieved good value, consider the loss a &apos;cost of doing business&apos; rather than a personal failure."
      }
    ]
  }
];

export default function LosingStreaksPage() {
    
  
  
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
          <span className="text-brand-emerald uppercase">LOSING STREAK STRATEGY</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Mastering the <span className="text-brand-emerald">Losing Streak</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Variance is not your enemy; it&apos;s the environment in which an edge thrives. Learning to survive a slump is what defines a professional bettor.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this deep dive, we move beyond the basics of &quot;bad luck.&quot; We explore the mathematics of variance, the psychology of tilt, and the tactical retreats necessary to protect your bankroll. Welcome to the OddinsOdds Academy masterclass on resilience.
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
