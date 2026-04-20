import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'restart-dynamics', 
    title: 'Restart Dynamics: The Mechanics of the Goal Kick', 
    content: (
      <>
        In professional modeling, a <strong>Goal Kick</strong> is analyzed not as a simple stoppage, but as a &quot;Possession Reset.&quot; It is the primary statistical marker for <strong>Inefficient Attacking</strong>. Every goal kick represents an offensive sequence that failed to result in a goal, a corner, or a parried save.
        <br /><br />
        <strong>The Strategic Context:</strong>
        <br />
        • <strong>Attacking Waste:</strong> High goal kick counts often correlate with teams that take low-quality &quot;hopeful&quot; shots from distance.
        <br />
        • <strong>Tactical Reset:</strong> For the defending team, a goal kick is a controlled moment to re-establish their shape and launch a structured build-up from the back.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'inefficiency-coefficient', 
    title: 'The Inefficiency Coefficient: Accuracy Analysis', 
    content: (
      <>
        To find value in the Over/Under goal kick markets, you must calculate the <strong>Inefficiency Coefficient</strong>. This is the volume of shots that completely miss the frame (Off-Target) relative to total attempts.
        <br /><br />
        <strong>High-Yield Predictors:</strong>
        <br />
        • <strong>Low-Accuracy Strikers:</strong> Teams with forwards who have a high &quot;Shot-Volume&quot; but low &quot;SoT-Percentage&quot; are the primary drivers of high goal-kick counts.
        <br />
        • <strong>Distance Bias:</strong> Teams that are forced to shoot from outside the box due to a compact defense will naturally produce more off-target balls, leading to a surplus of goal kicks.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'defensive-depth', 
    title: 'Defensive Depth: The Low-Block Effect', 
    content: (
      <>
        A common misconception is that under-pressure teams always concede more goal kicks. In reality, a team playing a <strong>&quot;Deep Low-Block&quot;</strong> may actually concede <em>fewer</em> goal kicks because they focus on blocking shot lanes and forcing corners.
        <br /><br />
        <strong>The Variable:</strong>
        <br />
        Active pressure in the mid-block often forces rushed, inaccurate shots. If your model predicts a frantic, end-to-end match with low tactical discipline, the &quot;Over&quot; lines on Goal Kicks provide an excellent &quot;Non-Goal&quot; safety net.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-settlement', 
    title: 'Operational Settlement: Technical Boundaries', 
    content: (
      <>
        Precision in settlement is vital. A goal kick is officially counted when the ball is kicked and clearly moves.
        <br /><br />
        <strong>Settlement Nuances:</strong>
        <br />
        • <strong>Retaken Kicks:</strong> If a keeper takes a goal kick but the referee orders a retake (due to encroachment or a moving ball), it almost always counts as <strong>one incident</strong> toward the total.
        <br />
        • <strong>90-Minute Rule:</strong> Unless specified as a &apos;Full Match&apos; market, these bets are settled on regular time. Goal kicks in Extra Time are excluded from standard market calculations.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'The Value in the Reset', 
    content: (
      <>
        Goal Kick markets are the ultimate contrarian edge. By focusing on match inefficiency rather than clinical success, you can monetize the &quot;waste&quot; in an opponent&apos;s game plan. Analyze the off-target volume, understand the defensive shape, and exploit the markets that the public ignores.
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
        question: "Does a deflection off a defender that goes wide count as a goal kick?",
        answer: "No. If the ball is last touched by a defender and goes over the goal line, it is a corner. A goal kick only occurs if the attacking team touched it last."
      },
      {
        question: "What is a &apos;Goal Kick Range&apos; bet?",
        answer: "This is a prediction that the total kicks will fall within a specific bracket (e.g., 10-12). It offers higher odds but requires a precise read on the match&apos;s &apos;Tactical Tempo&apos;."
      },
      {
        question: "Do &apos;Woodwork&apos; hits count as goal kicks?",
        answer: "Only if the ball goes out of play after hitting the post. If the keeper saves the rebound or the ball stays in play, no goal kick is awarded."
      },
      {
        question: "How does wind affect goal kick totals?",
        answer: "Strong head-winds can reduce shot accuracy from distance, leading to more off-target attempts and potentially increasing the goal kick count for the defending team."
      }
    ]
  }
];

export default function GoalKickPage() {
    
  
  
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
          <span className="text-brand-emerald uppercase font-bold">GOAL KICK BETTING</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Goal Kick <span className="text-brand-emerald">Masterclass</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;Goal kicks are the tactical marker for attacking inefficiency—monetizing the waste in an opponent&apos;s game plan.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this technical guide, we break down the clinical mechanics of &apos;Restart Dynamics.&apos; We analyze the &apos;Inefficiency Coefficient&apos; of shot-accuracy data, identify the specific &apos;Low-Block&apos; effects that dictate kick volume, and reveal the operational settlement rules that protect your bankroll from technical errors.
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
