import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'totalization-framework', 
    title: 'The Totalization Framework: Predicting Market Lines', 
    content: (
      <>
        Over/Under betting, often referred to as &quot;Totals,&quot; represents a pure clinical analysis of match intensity. Instead of predicting a winner, you are wagering on the <strong>Board Efficiency</strong>—whether the total goals, points, or corners will exceed a specific line set by the bookmaker. The 2.5 goal line serves as the global anchor for football, derived from the mathematical average of goals scored in major professional leagues.
        <br /><br />
        <strong>The Mechanics of the Line:</strong>
        <br />
        • <strong>Half-Goal Increments:</strong> Use of .5 (e.g., 2.5, 3.5) ensures a binary outcome—it is physically impossible to score exactly 2.5 goals, thus eliminating the &quot;Draw&quot; or &quot;Push&quot; result.
        <br />
        • <strong>Neutral Result:</strong> Over/Under is the ultimate defensive tool because it is immune to who scores, as long as the <strong>cumulative volume</strong> is met.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'style-variance', 
    title: 'Style Variance: Low-Blocks vs. High-Lines', 
    content: (
      <>
        Professional totals analysts move beyond simple goal averages. They analyze <strong>Style Variance</strong>. A team averaging 2.0 goals might do so via a high-risk &quot;High Line&quot; defense that concedes goals as fast as they score them, while another team might achieve it through clinical efficiency and a &quot;Low-Block&quot; system.
        <br /><br />
        <strong>Under-Valued Indicators:</strong>
        <br />
        • <strong>Defensive Compactness:</strong> In matches where both teams prioritize defensive structure (underdog vs underdog in a relegation battle), the &quot;Under 2.5&quot; often carries significant mathematical value despite the &quot;low odds&quot; bias.
        <br />
        • <strong>PPDA (Passes Per Defensive Action):</strong> High-pressing teams create more turnovers in the final third, leading to high-variance games that favor &quot;Over&quot; outcomes.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'over-1-5-anchor', 
    title: 'The Over 1.5 Anchor: High-Precision Selection', 
    content: (
      <>
        The 1.5 goal line is the &quot;Gold Standard&quot; for high-precision volume betting. While the odds are lower than the 2.5 line, the probability of <strong>at least two goals</strong> in a professional match is statistically robust.
        <br /><br />
        <strong>The &quot;Banker&quot; Logic:</strong>
        <br />
        In modern football, a 1-0 result is increasingly rare due to tactical shifts and injury-time extensions. Utilizing the Over 1.5 line as a &quot;confidence anchor&quot; in accumulators allows for a high hit-rate while protecting against the frustration of a 1-1 or 2-0 stalemate that would kill an &quot;Over 2.5&quot; bet.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'time-interval-dynamics', 
    title: 'Time-Interval Dynamics: The Math of Late Goals', 
    content: (
      <>
        A masterclass bettor understands that total goals are <strong>time-sensitive</strong>. Over 60% of goals in major leagues are scored in the final 30 minutes of play.
        <br /><br />
        <strong>Tactical Factors:</strong>
        <br />
        • <strong>Fatigue Coefficient:</strong> Defensive coordination fails as glycogen levels drop. High-paced teams exploit this in the &quot;75th-90th&quot; interval.
        <br />
        • <strong>Game State:</strong> If a favorite is trailing by 1 goal at the 70th minute, they will inevitably sacrifice defensive structure for attacking volume, creating a high-value opportunity for an additional goal (Over).
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Mastering the Board', 
    content: (
      <>
        Over/Under betting is the thinking man&apos;s market. It removes the emotional unpredictability of &quot;Selection Bias&quot; and replaces it with a clinical assessment of match flow. Master the styles, understand the intervals, and the scoreboard becomes your most reliable revenue indicator.
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
        question: "When is the best time to bet &apos;Under&apos; in-play?",
        answer: "The &apos;Under&apos; market is most profitable when a match reaches its &apos;Stale State&apos;—usually between the 15th and 35th minute if no early goal has disrupted the tactical setup. The market often over-adjusts its prices during this window."
      },
      {
        question: "Does weather impact Over/Under lines?",
        answer: "Significantly. Heavy rain or extreme heat can lower the &apos;Physical Ceiling&apos; of a match, reducing high-intensity sprints and increasing defensive fatigue. In such conditions, &apos;Under&apos; 2.5 often gains value as the game slows down."
      },
      {
        question: "What is the &apos;Asian Total&apos; market?",
        answer: "Asian Totals (e.g., Over 2.0, Over 3.0) introduce a &apos;Push&apos; (refund) element. If exactly 2 goals are scored on an Over 2.0 line, your stake is returned. This offers a middle-ground security between the binary Over 1.5 and Over 2.5 lines."
      },
      {
        question: "Which leagues are historically &apos;High-Scoring&apos;?",
        answer: "Leagues like the Bundesliga, Dutch Eredivisie, and MLS tend to have higher goal averages due to attacking philosophies and defensive variance. Conversely, the Italian Serie B and French Ligue 2 are historically tighter, favoring &apos;Under&apos; selections."
      }
    ]
  }
];

export default function OverUnderPage() {
    
  
  
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
          <span className="text-brand-emerald uppercase font-bold">OVER/UNDER</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Over/Under <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Total markets move beyond the emotional variance of match results to focus on the clinical board efficiency of goal production.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the clinical &apos;Totalization Framework&apos; of Over/Under betting. We explore Style Variance, analyze why compactness is the key to &apos;Under&apos; value, and reveal the interval dynamics that govern high-yield goals in the final 30 minutes of play.
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
