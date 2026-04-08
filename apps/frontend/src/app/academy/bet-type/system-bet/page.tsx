'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-system-bet', 
    title: 'What is a System Bet?', 
    content: "A system bet takes a group of selections and turns them into several smaller bets, so you do not need every single pick to win to receive a payout.\n\nInstead of one **accumulator** where every leg must be correct, the sportsbook creates a set of combinations - for example, doubles, trebles or more complex covers - based on the system you chose.\n\nThis means some of your bets can lose, and you can still come away with a return. System bets are widely used because they balance higher potential returns with lower all-or-nothing risk.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-does-system-bet-work', 
    title: 'How Does a System Bet Work?', 
    content: "You choose how many selections to include and the minimum number of those that must win for a return. A system is expressed as \"M of N\" where N is the number of selections and M is the number required to count as a winning combination.\n\nA system bet 2 of 3 (written as 2/3) means you pick three selections, and the bet automatically creates all possible doubles from them. Each double is its own bet. If two of your picks win, at least one double pays out. If all three win, then all the doubles win, and you collect the full payout. Let's explain it with an example:\n\nYou pick three football markets:\n\n• Arsenal vs Man City - Arsenal to Win (1.80)\n• Chelsea vs Liverpool - Over 2.5 Goals (2.10)\n• Real Madrid vs Getafe - Real Madrid to Win (1.60)\n\nA 2/3 system creates three doubles: Arsenal × Over 2.5, Arsenal × Real Madrid, and Over 2.5 × Real Madrid. Since your total stake is $30, each double gets $10.\n\nLet's do calculations:\n\nFirst combination (Arsenal × Over 2.5):\n\n• 1.80 × 2.10 = 3.78\n• Return = $10 × 3.78 = $37.80\n\nSecond combination (Arsenal × Real Madrid):\n\n• 1.80 × 1.60 = 2.88\n• Return = $10 × 2.88 = $28.80\n\nThird combination (Over 2.5 × Real Madrid):\n\n• 2.10 × 1.60 = 3.36\n• Return = $10 × 3.36 = $33.60\n\nHere are the outcomes:\n\n• If exactly two selections win (example: Arsenal wins and Over 2.5 goals land, but Real Madrid fails to win), then only Arsenal × Over 2.5 pays $37.80. Your stake was $30, so profit = $37.80 - $30 = $7.80.\n• If all three selections win, all three doubles pay: $37.80 + $28.80 + $33.60 = $100.20. Profit = $100.20 - $30 = $70.20.",
    advantages: [],
    risks: []
  },
  {
    id: 'common-types',
    title: 'Common Types of System Bets You Will See',
    content: "In system betting, each type works differently, with its own structure, number of combinations, and balance between risk and reward.\n\n• System 2 of 3\n• System 2 of 4, 3 of 4\n• System 3 of 5, 4 of 5\n• Full cover systems such as Trixie (3 selections with 4 bets), Yankee (4 selections with 11 bets), Canadian/Goliath (6 selections with 63 bets)\n\nEach system has its own number of component bets and therefore its own required total stake. A Trixie, for example, includes three doubles and one treble. A Yankee includes all doubles, trebles and the fourfold for four selections.\n\nIn practice, you pick the system based on how many failures you will tolerate and how much bank you are willing to split across the combinations.",
    advantages: [],
    risks: []
  },
  {
    id: 'pros-cons',
    title: 'Pros and Cons of System Bets',
    content: "You will choose a system bet when you want a higher chance of a return than a straight accumulator gives, while still targeting higher rewards than single bets on each market.\n\nIn the section below, you will find the pros and cons of using this bet type.\n\n**Advantages**\n\nHere are some of the advantages of using this type of market:\n\n• You reduce the binary risk of a full accumulator. You can still win if a small number of selections fail.\n• Systems smooth variance and can make longer slips more realistic.\n• You get a compounding benefit if many selections win, because multiple component accumulators will pay.\n• You can structure slips to favour certain outcomes, for example, choosing 3 of 5 so you need only three correct picks for a return.\n\n**Disadvantages**\n\nWith every advantage, there comes a disadvantage as well. Let's check out the cons of this market:\n\n• System bets split your stake over many combinations, so the upfront total stake is higher than a single accumulator. That makes small wins possible but requires careful stake sizing.\n• Lower-than-expected returns when only the minimum qualifying selections win. Even though you may get a return, it might be small after the total stake is considered.\n• With many combinations, you must ensure stake math and bookmaker maximums do not kill your plan.",
    advantages: [],
    risks: []
  },
  {
    id: 'system-bet-calculator',
    title: 'Using a System Bet Calculator',
    content: "Working out system bets by hand can get messy, especially when you are dealing with multiple selections and dozens of possible combinations. This is where the system bet calculator comes in handy. These tools let you enter your chosen system, and the odds for each selection, and then mark them as a loss, a win or a void. The calculator instantly breaks down how many individual bets are created, how your total stake is split across them, and what your potential returns look like under different scenarios.\n\nFor something simple like a 2/3, you might still be able to do the maths yourself, but once you move into Yankees, Canadians, or Goliaths, the number of lines grows fast, and manual calculations are easy to get wrong. With the help of a calculator, you can try different setups in a few seconds and see whether the system bet is making financial sense or not.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-to-pick-selections',
    title: 'How to Pick Selections While Using System Bet?',
    content: "Building a system bet is not just about picking random matches. The real edge comes from choosing the right selection and structuring the system in a way that balances risks and rewards.\n\n• Focus on sports and markets you understand well to avoid blind picks.\n• Limit the number of selections to keep the system manageable and cost-effective.\n• Check the odds to ensure potential returns.\n• Always use a calculator beforehand to see possible outcomes in different scenarios.\n• Choose a system type based on how many losing picks you are willing to tolerate.",
    advantages: [],
    risks: []
  },
  {
    id: 'when-to-use',
    title: 'When to Use System Bets?',
    content: "System bets are not ideal for every situation, but there are certain times when they can give you the right balance between safety and potential profit.\n\n• Use them when you have medium confidence across several picks, but don't want one miss to ruin your entire betting slip.\n• They work well on football matchdays with multiple favourites where upsets are possible.\n• Ideal for tournament rounds or busy weekends when you see value in several games.\n• A good option if you want to soften the risk of accumulators",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "System Bets are not some kind of secret hack. They just give you more flexibility compared to an all-or-nothing accumulator. Instead of losing everything on one wrong pick, you spread your risk and keep a chance at returns even if one leg fails.\n\nThe important point is to use them smartly by picking the right selection and even making use of a calculator. If you are doing it the right way, then the system lets you go after bigger wins without putting your whole bet at risk.",
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
        question: "What is a system bet?",
        answer: "A system bet takes a group of selections and turns them into several smaller bets, so you do not need every single pick to win to receive a payout."
      },
      {
        question: "What is a system 3/4 bet?",
        answer: "A 3/4 system bet means you make four selections and a minimum of three must win for you to get a return. It creates four separate treble bets."
      },
      {
        question: "How to calculate a system bet?",
        answer: "To calculate the potential return of your system bet, you multiply the odds of the winning legs within each combination and then multiply that by your stake per combination."
      },
      {
        question: "Is a system bet profitable?",
        answer: "Yes, it can be if you pick value bets. System bets smooth variance and reduce the 'all-or-nothing' risk compared to regular accumulators, improving your long-term success chances."
      }
    ]
  }
];

export default function SystemBetPage() {
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
          <Link href="/academy/bet-type" className="hover:text-brand-emerald transition-colors uppercase">BET-TYPES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase font-bold">SYSTEM BET EXPLAINED | MEANING...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                System Bet
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    You want better ways to protect your stake and still chase decent returns. System bets give you that middle ground between single bets and risky accumulators.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> guide explains exactly what a system bet is, how the maths works, when to pick one, and much more. You will get examples, clear step-by-step calculations and expert advice so you can use system bets confidently.
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
