'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-european-handicap', 
    title: 'What Is European Handicap?', 
    content: "The euro handicap is not complex. Often referred to as the 3-Way Handicap, this betting option makes one-sided matches more balanced from a betting perspective. For this market, the underdog receives a numerical goal advantage before the game begins. On the other hand, the favourites get a goal disadvantage.\n\nIn simple terms, this means that the match starts at least 1:0 in favour of the underdogs. In the 1X2 betting format, a win for your chosen team results in a winning bet. However, for handicap betting, the team must win by the margin specified before the match for the wager to be successful.\n\nThe European Handicap market consistently offers three possible outcomes for each match: a home win, a draw, and an away victory. Because of this structure, it applies to sports where these results are possible. Common examples include football, hockey, rugby, basketball, handball, and water polo.",
    advantages: [],
    risks: []
  },
  { 
    id: 'types-of-european-handicap', 
    title: 'Types of European Handicap Bets', 
    content: "There are different varieties of handicap bets available at most bookmakers. We'll break down the two main categories below.\n\n### Positive European Handicap\nThese handicaps apply to teams that are less likely to win the game. For underdog teams in football, a positive handicap of +3 offers them a three-goal lead heading into their game. Should they lose by 1 or 2 goals, they will still emerge with a win. Conceding three goals will be seen as a draw. For the underdog to lose the match, they must concede four goals without scoring a goal.\n\n### Negative European Handicap\nThis option is the reverse of a positive handicap. It applies to the favoured team or the one expected to win the matchup. Such a team is assigned a -1, -2, or -3 handicap before the game. For instance, with a -1 handicap, the team must win by at least a two-goal margin (2-0) to get a victory.",
    advantages: [],
    risks: []
  },
  {
    id: 'basics-of-european-handicap',
    title: 'Understanding the Basics of European Handicap',
    content: "The EH market is a straightforward betting option that has three likely outcomes. Here we provide an example for each outcome.\n\n### First Outcome: Home Win\n**Example: Flamengo (-1) vs Vasco De Gama (+1)**\n**Final Score: 3 - 0**\nAfter applying the handicap: Flamengo (3-1=2) vs Vasco De Gama (0+1=1). Result: Flamengo wins. For the Home Win bet (-1) to be successful, they must win by at least 2 goals.\n\n### Second Outcome: Draw\n**Example: Marseille (-2) vs Reims (+2)**\n**Final Score: 3 - 1**\nAfter applying the handicap: Marseille (3-2=1) vs Reims (1). Wait, no, in European Handicap the 'Draw (-2)' bet wins if the home team wins by EXACTLY 2 goals. Since 3-1 is a 2-goal margin, the handicap draw is successful.\n\n### Third Outcome: Away Team Wins\n**Example: Velez Sarsfield (-1) vs Rosario Central (+1)**\n**Final Score: 1 - 1**\nAfter applying the handicap: Velez Sarsfield (1-1=0) vs Rosario Central (1+1=2). Result: Rosario Central wins. The Away Team Win outcome (+1) is successful if the underdog avoids a 2-goal defeat.",
    advantages: [],
    risks: []
  },
  { 
    id: 'pros-and-cons', 
    title: 'Pros and Cons of European Handicap', 
    content: "With the basics explained, let's identify some of its benefits and disadvantages.",
    advantages: [
      "Competitive Odds: Handicaps usually offer 30-50% better odds on firm favourites compared to 1X2.",
      "Simple Bet Market: Familiar 3-Way structure, easy to calculate without push/refund rules.",
      "Whole Number Simplicity: Uses only integers (+1, -2, etc.), making results easy to grasp.",
      "Balanced Underdog Bets: Positive handicaps give underdogs a solid head start."
    ],
    risks: [
      "Definite Outcomes: Unlike Asian Handicaps, there are no partial wins or stake refunds.",
      "Limited Flexibility: Does not offer precise lines like -0.5 or -1.25.",
      "Harder to Win: Big negative handicaps (like -2) require a wide margin victory."
    ]
  },
  { 
    id: 'strategic-use', 
    title: 'Strategic Use of European Handicaps', 
    content: "There are specific scenarios where selecting the European Handicap option is your best bet:\n\n• **Underdogs With Huge Potential:** Back lower-ranked sides that bookmakers have underestimated.\n• **Favourites on Strong Form:** Support dominant teams with better odds than regular 1X2.\n• **Low Scoring Dominant Teams:** Use the draw handicap in matches where the favourite typically wins by exactly the expected margin.\n\n### Specific Match Situations\nSeveral match situations make this betting option appealing. It can be beneficial in form-based scenarios. For example, newly promoted teams come up against well-established opponents. It’s also effective when in-form attacking teams face sides struggling defensively.\n\nAnother case is when a team is dealing with numerous defensive injuries and plays against a high-scoring opponent. Conversely, it may also apply when a defensively organised lower-ranked team meets a stronger side missing key attacking players.",
    advantages: [],
    risks: []
  },
  {
    id: 'tips-for-placing',
    title: 'Tips for Placing Handicap Bets',
    content: "Here are some tips you can leverage if you plan to use the European Handicap market.\n\n### Use Data from Historical Matchups (H2H) Smartly\nMake sure you carefully study the most recent matchups between competing teams. Focus on their last five head-to-head results and consider if there have been significant changes in the team rosters. Some teams consistently dominate others; based on the data, place a -1 or -2 handicap on the stronger team.\n\n### Search For Undervalued Underdogs\nThis betting option offers more protection to underdogs, so search for lower-ranked teams with strong recent form. It is essential that you only settle for underdogs that have strong defensive setups. If they are facing out-of-form favourites, selecting the +2, +3, or +4 handicap option could offer much better winning chances.\n\n### Only Select Motivated Teams\nDo not select a team that has nothing it's fighting for. Instead, focus on teams fighting for titles, promotion, or survival. Such teams are likely to remain resolute defensively while also attacking with intent.\n\n### Wait For Team News and Lineups\nDon’t rush to place handicap bets before you see the team news or line-up. Unexpected line-up changes or injuries can dramatically shift the balance in favour of the underdogs. So, before placing heavy handicap bets on dominant sides, be sure all their key attackers are starting the game.",
    advantages: [],
    risks: []
  },
  { 
    id: 'faqs', 
    title: 'FAQs', 
    content: '',
    advantages: [],
    risks: [],
    faqs: [
      {
        question: "What is European Handicap in betting?",
        answer: "European Handicap is a 3-way betting market that gives one team a head start (integer goals) and the other a deficit. It has three outcomes: Home Win, Draw, or Away Win."
      },
      {
        question: "What does European Handicap 0:2 mean?",
        answer: "It means the Away team starts with a 2-goal advantage. For the Home team to win, they must win the match by at least 3 goals. If they win by exactly 2, it's a handicap draw."
      },
      {
        question: "What does handicap +1.5 mean?",
        answer: "Handicap +1.5 is an Asian Handicap line, not European. It means the team starts with a 1.5 goal head start. You win if your team wins, draws, or loses by only 1 goal."
      },
      {
        question: "What is a 3-way European handicap?",
        answer: "It is another name for European Handicap, referring to the three possible outcomes: Team A Win, Draw (on handicap), or Team B Win."
      },
      {
        question: "Is a 2.0 handicap good?",
        answer: "Yes, it can be very effective when backing strong underdogs against favorites who struggle to score multiple goals, or when backing high-scoring favorites to win comfortably."
      }
    ]
  }
];

export default function EuropeanHandicapPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const intersecting = entries.filter(e => e.isIntersecting);
      if (intersecting.length > 0) {
        // Find the one that is most prominent or the last one that started intersecting
        setActiveSection(intersecting[intersecting.length - 1].target.id);
      }
    }, { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.1, 0.2] });
    
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div className="h-full bg-brand-emerald transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">EUROPEAN HANDICAP</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                European Handicap <span className="text-brand-emerald">Guide</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Not all matchups are evenly balanced. When there is a clear gap between the favourite and the underdog, that’s when the European Handicap betting market comes in handy.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="text-brand-emerald font-bold">OddinsOdds Academy</span> guide explains how the European Handicap works, its 3-way structure, and how it differs from the more complex Asian Handicap system.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => (
                <StrategyContentSection 
                  key={section.id}
                  {...section} 
                  isActive={activeSection === section.id} 
                />
              ))}
            </div>
          </main>

          <aside className="w-full lg:w-[380px] space-y-8 order-1 lg:order-2">
            <div className="sticky top-24 space-y-8">
              <StrategyTOC 
                sections={sections} 
                activeSection={activeSection} 
                onSectionChange={(id) => {
                  setActiveSection(id);
                  const el = document.getElementById(id);
                  if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
                }} 
              />
              <div className="hidden lg:block">
                <TodaysMatchesWidget />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
