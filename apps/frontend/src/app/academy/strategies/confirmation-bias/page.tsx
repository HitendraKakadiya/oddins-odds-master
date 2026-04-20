import Link from 'next/link';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: 'echo-chamber', 
    title: "The Echo Chamber of Choice: Your Brain&apos;s Shortcut", 
    content: (
      <>
        Confirmation bias is a cognitive shortcut where the brain prioritizes information that confirms its pre-existing beliefs while subconsciously filtering out contradictory evidence. In sports betting, this often manifests as a &quot;locked-in&quot; opinion on a team or outcome that survives even in the face of overwhelming negative data.
        <br /><br />
        <strong>The Psychological Mechanism:</strong>
        <br />
        • <strong>Selective Perception:</strong> Noticing every stat that favors your pick.
        <br />
        • <strong>Biased Interpretation:</strong> Explaining away negative news (e.g., &quot;the injury won&apos;t matter&quot;).
        <br />
        • <strong>Memory Recall:</strong> Remembering your successful &quot;gut feeling&quot; bets while forgetting the failures.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'narrative-vs-data', 
    title: "Narrative vs. Data: Why Facts Lose to Stories", 
    content: (
      <>
        Human beings are hardwired for stories, not statistics. We are more likely to bet on a &quot;narrative&quot;—such as a team seeking revenge or a star player returning from injury—than we are to follow a dry probability model. Confirmation bias feeds these narratives, allowing us to build a case for almost any outcome by selectively picking data points.
        <br /><br />
        <strong>Narrative Traps:</strong>
        <br />
        • <strong>Recentism:</strong> Overweighting the most recent game highlights.
        <br />
        • <strong>Media Hype:</strong> Adopting the consensus opinion of pundits without verifying the stats.
        <br />
        • <strong>Emotional Attachment:</strong> Difficulty betting against a team you personally like.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'overconfidence-traps', 
    title: "Overconfidence Traps: The Blind Spots of Experience", 
    content: (
      <>
        Counterintuitively, the more experienced a bettor becomes, the more susceptible they may be to confirmation bias. Experts often believe their &quot;intuition&quot; is a valid data source, leading them to ignore new variables that contradict their established model. This is known as &quot;Expert Blindness.&quot;
        <br /><br />
        <strong>The Dangers:</strong>
        <br />
        • <strong>Ignoring Regression:</strong> Expecting an outlier performance to continue indefinitely.
        <br />
        • <strong>Stake Escalation:</strong> Increasing bets because you are &quot;sure&quot; of a biased conclusion.
        <br />
        • <strong>Strategy Stagnation:</strong> Refusing to adapt your model because it worked in the past.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'operational-neutrality', 
    title: "Operational Neutrality: Building an Unbiased Workflow", 
    content: (
      <>
        To achieve long-term profitability, you must move from emotional betting to <strong>Operational Neutrality</strong>. This requires a workflow designed to actively challenge your own assumptions before a single dollar is staked.
        <br /><br />
        <strong>The Neutrality Toolkit:</strong>
        <br />
        • <strong>The Devil&apos;s Advocate:</strong> Force yourself to write three reasons why your bet will lose.
        <br />
        • <strong>Blind Audits:</strong> Review stats without team names to see if the value still exists.
        <br />
        • <strong>Betting Journals:</strong> Specifically track bets where you &quot;ignored&quot; red flags.
      </>
    ),
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: "Objectivity as an Edge", 
    content: (
      <>
        In a market full of emotional, biased recreational bettors, <strong>objectivity is an edge</strong>. By recognizing your brain&apos;s natural tendency to seek confirmation, you can build systems that force you to look at the cold, hard reality of the numbers.
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
        question: "Is confirmation bias always a bad thing?",
        answer: "In betting, yes. While it&apos;s a helpful brain shortcut for daily life, it is lethal for capital management because it hides the real risks of a wager."
      },
      {
        question: "How can I tell if I'm being biased?",
        answer: "Ask yourself: &apos;What piece of information would make me change my mind about this bet?&apos; If the answer is &apos;nothing,&apos; you are suffering from severe confirmation bias."
      },
      {
        question: "Do professional syndicates suffer from this?",
        answer: "Less so. Pros use algorithmic models and team-based &apos;vetting&apos; processes specifically designed to remove the individual human&apos;s biased perspective from the decision."
      },
      {
        question: "Does 'Value Betting' fix confirmation bias?",
        answer: "Only if you trust the numbers. Many bettors find value in the stats but then use confirmation bias to talk themselves *out* of the bet because they &apos;don&apos;t like&apos; the team."
      }
    ]
  }
];

export default function ConfirmationBiasPage() {
    
  
  
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
          <span className="text-brand-emerald uppercase">CONFIRMATION BIAS</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Defeating <span className="text-brand-emerald">Confirmation Bias</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-semibold mb-6 italic">
                    &quot;The brain is a master story-teller, but a terrible odds-maker. Learning to see the data as it is, not as you want it to be, is the ultimate betting discipline.&quot;
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Confirmation bias is the invisible hand that moves you toward loss. It makes you prioritize the stories that agree with you while silencing the statistics that warn you. In this guide, we dive into the cognitive psychology of the betting mind and build a workflow designed for total objectivity.
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
