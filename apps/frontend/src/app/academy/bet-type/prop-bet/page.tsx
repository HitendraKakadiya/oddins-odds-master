import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'exogenous-variables', 
    title: 'Exogenous Variables: The Architecture of the Prop', 
    content: (
      <>
        A <strong>Prop Bet</strong> (Proposition Bet) is a wager on <strong>event-specific occurrences</strong> that do not necessarily dictate the final match outcome. In professional markets, props are the primary tool for monetizing granular player data and tactical outliers.
        <br /><br />
        <strong>The Proposition Framework:</strong>
        <br />
        • <strong>Player Props:</strong> Metrics-based bets on individual performance (e.g., NBA Points, NFL Rushing Yards, Soccer Tackles).
        <br />
        • <strong>Game Props:</strong> Structural events within the match (e.g., Will there be a Red Card? Will the game go to Overtime?).
        <br />
        • <strong>Statistical Isolation:</strong> Props allow you to isolate a single variable—like a striker&apos;s shot volume—without needing to predict the winner of the match.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'market-inefficiency', 
    title: 'Market Inefficiency: Exploiting the Soft Lines', 
    content: (
      <>
        Prop lines are notoriously &quot;soft&quot; compared to primary markets like the Point Spread or Moneyline. Because bookmakers must manage thousands of individual prop lines across a single weekend, they often rely on <strong>historical averages</strong> rather than deep situational analysis.
        <br /><br />
        <strong>The Analyst&apos;s Edge:</strong>
        <br />
        By identifying <strong>situational shifts</strong>—such as a key teammate being injured or a change in defensive scheme—you can exploit lines that have not yet adjusted to the new tactical reality. This is where the highest &quot;Alpha&quot; in modern sports betting is found.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'correlated-risk', 
    title: 'Correlated Risk: The Same-Game Multiplier', 
    content: (
      <>
        Modern sportsbooks now allow for <strong>Correlated Prop Parlays</strong> (Same-Game Parlays). This involves pairing props that are logically linked.
        <br /><br />
        <strong>Logic of Positive Correlation:</strong>
        <br />
        If you bet on an NFL Quarterback to have <strong>Over 300 Passing Yards</strong>, it is mathematically consistent to pair it with his primary Wide Receiver having <strong>Over 100 Receiving Yards</strong>. Understanding how these props &apos;feed&apos; into one another allows you to build high-coefficient tickets with logically consistent foundations.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-variance', 
    title: 'Operational Variance: Injury and Rotation Risk', 
    content: (
      <>
        The primary risk in prop betting is <strong>Rotational Volatility</strong>. Unlike a standard team bet, a player prop is hypersensitive to minutes played.
        <br /><br />
        <strong>Potential Disruptors:</strong>
        <br />
        • <strong>Late Scratches:</strong> A player being ruled out minutes before tip-off can void your bet or trigger a &quot;push&quot; depending on house rules.
        <br />
        • <strong>Blowout Minutes:</strong> In high-parity leagues like the NBA, &quot;Garbage Time&quot; can see star players benched early, causing them to fall short of their prop lines despite high efficiency.
        <br />
        • <strong>Tactical Substitution:</strong> A change in formation can move a player into a less offensive role, immediately devaluing their &quot;Over&quot; props.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Granular Edge', 
    content: (
      <>
        Prop betting is the ultimate market for specialists. It rewards those who study the individual rather than the collective. By understanding the architectural nuances of the prop, exploiting soft bookmaker lines, and managing the inherent risks of player rotation, you can find consistent value in the most granular corners of the sporting world.
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
        question: "What happens if my player doesn&apos;t start?",
        answer: "Most sportsbooks require a player to actually take the field (or court) for the bet to stand. If they are an &apos;Active Inactive&apos; or never leave the bench, the bet is typically voided and your stake is returned."
      },
      {
        question: "Are Props harder to win than Moneyline bets?",
        answer: "Professionally, no. Prop markets are often easier to beat because they have lower liquidity and less sophisticated modeling from the bookmakers. The challenge is the lower betting limits often placed on prop markets."
      },
      {
        question: "What is a &apos;Hook&apos; in prop betting?",
        answer: "A hook is the &apos;.5&apos; at the end of a line (e.g., 22.5 points). It ensures there can be no &apos;Push&apos; (draw)—the bet must either win or lose."
      },
      {
        question: "Can I parlay props from different games?",
        answer: "Yes. Combining player props from different matches is a common strategy for building high-yield tickets, though it increases your exposure to individual variance across multiple environments."
      }
    ]
  }
];

export default function PropBetPage() {
    
  
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET-TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">PROP BETS EXPLAINED | LEARN HOW...</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Prop Bet <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Prop bets represent the most granular way to monetize individual player matchups—monetizing the detail that main markets ignore.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the clinical &apos;Architecture of the Prop.&apos; We reveal the specific &apos;Market Inefficiencies&apos; found in soft player lines, analyze the logic of &apos;Correlated Parlays&apos; (Same-Game Parlays), and provide a professional framework for managing &apos;Operational Variance&apos; like injury-scrubs and rotation risks.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
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
