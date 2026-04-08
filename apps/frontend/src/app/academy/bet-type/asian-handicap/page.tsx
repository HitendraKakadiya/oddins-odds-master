'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'asian-handicap-explained', 
    title: 'Asian Handicap Explained', 
    content: "As you may have noticed, this betting market originated from Asia and mainly applies to football betting. This betting option balances the playing field between two unevenly matched teams by providing an advantage to the weaker side.\n\nMuch like standard handicap bets, one team is identified as the stronger side. That team is considered the favourite and assigned a handicap disadvantage, shown with a minus sign (-) to reflect this status. Conversely, the weaker side gains a handicap advantage, marked with a plus sign (+).\n\nAsian Handicap, explained simply, follows this definition: a form of betting that levels the playing field and removes the draw, creating only two possible outcomes (win or lose). This betting option differs from European Handicaps, where a draw option exists. With Asian Handicap, either Team A or Team B wins (No Draws).",
    advantages: [],
    risks: []
  },
  { 
    id: 'outcome-legend', 
    title: 'Outcome Legend', 
    content: "",
    advantages: [],
    risks: []
  },
  { 
    id: 'asian-handicap-0-0', 
    title: 'Asian Handicap 0.0', 
    content: "The Asian Handicap 0.0 line is best for bettors who want to avoid the risk of a draw but are still keen on backing a side outright. This bet option is similar to the Draw No Bet market, with three likely outcomes.\n\n**Market example:** Arsenal (1.90 odds) vs Tottenham (1.85 odds). Suppose you place an Asian Handicap soccer bet of $50 on Tottenham for the 0.0 line; these are the three outcomes:\n\n• If Tottenham wins, you win the bet.\n• If the match end in a draw, your stake will be refunded.\n• If Tottenham loses, the bet is lost.\n\nThe Asian Handicap 0.0 line is a relatively safe bet option. However, if you want higher returns, it is not a preferred option.",
    advantages: [],
    risks: []
  },
  {
    id: 'asian-handicap-0-25',
    title: 'Asian Handicap -0.25/+0.25',
    content: "Known for offering reduced risks, the fractional handicap allows you to earn back a portion of your bet in case of a draw. Depending on your selection, whether favourite or underdog, your whole bet is split into two mini bets (0.0, 0.5).\n\nThe Asian Handicap -0.25 is assigned to the favourites, with the bet split into -0.0 and -0.5 mini handicap bets. Theoretically, they start the contest with a 0.25 goal deficit. The possible outcomes for this option are:\n\n• **Your team wins:** You win both mini-bets and get a full win\n• **Draw outcome:** You lose the -0.5 bet, but get a refund for the 0.0 bet\n• **Your team loses:** You lose both mini-bets and suffer a full loss\n\nThe +0.25 handicap is assigned to the underdogs, with the bet divided into +0.0 and +0.5 mini handicap bets. The underdogs begin the match with a 0.25-goal advantage. Likely outcomes for this option include:\n\n• **Your team wins:** You win your mini-bets and claim a complete win\n• **Draw outcome:** You win the +0.0 bet, and get a half-win on the +0.5 bet\n• **Your team loses:** You suffer a full loss on both mini-bets\n\nThis bet option is best if you are a cautious punter looking for partial cover in close matchups. If you are sure your selected team is likely to grab a decisive win, avoid this bet selection.",
    advantages: [],
    risks: []
  },
  {
    id: 'asian-handicap-0-5',
    title: 'Asian Handicap -0.5/+0.5',
    content: "This option is suitable for a bet selection where one side is slightly stronger but can’t secure many goals in the game. This situation may arise due to the team's poor attacking ability or defensive record.\n\nWhatever the case, never select the Asian Handicap -0.5/+0.5 option when both teams are evenly matched. Concerning how it all works, let's use a simple example:\n\nLiverpool (-0.5) vs Brentford (+0.5). A wager on Liverpool with a -0.5 handicap will be successful if the Reds win the match. If Brentford gets a victory or a draw, bets on the +0.5 selection will win.",
    advantages: [],
    risks: []
  },
  {
    id: 'asian-handicap-0-75',
    title: 'Asian Handicap -0.75/+0.75',
    content: "This bet is very similar to the 0.25 line with mini bets. However, don't back a stronger side with this selection if they have a problem scoring goals.\n\nFor -0.75, one half of your bet will be -0.5, while the other half is -1.0. Similarly, for +0.75, there will be two mini bets (+0.5, +1.0). Bets on the stronger team (-0.75) will have the following outcomes:\n\n• **Win by 2+ goals:** You claim a complete win\n• **Win by 1 goal:** You win the -0.5 bet, and claim half of the -1.0 wager\n• **Match Loss or Draw:** Suffer a full loss.\n\nBets on the weaker team (+0.75) will have these outcomes:\n\n• **A win or draw:** Claim a full bet win\n• **Lose by 1 goal:** Lose the +0.5 bet wager, and get a refund for the +1.0 mini bet\n• **Lose by 2 goals:** completely lose out on the bet without refunds.\n\nYou as a bettor can apply the bet option for weaker teams if the dominant side has struggled to secure wins in recent games. It is also suitable when you are sure the underdogs are likely to put up a solid fight.",
    advantages: [],
    risks: []
  },
  {
    id: 'asian-handicap-1-0',
    title: 'Asian Handicap -1.0/+1.0',
    content: "Any bets on the Asian Handicap -1.0 line can only be successful if the favourites win by more than one goal. So, pick strong teams capable of blowing their opponents away when selecting sides for the -1.0 line. Interestingly, you get a refund of your bet amount if the favourites win by exactly one goal.\n\nIf you are keen on the underdog option, only opt for teams capable of snatching a shock win or drawing during the game. Selecting teams underdogs with a blunt attack would likely lead to lost bets and funds. We also encourage you to check the team’s defensive record before settling for the +1.0 handicap line.",
    advantages: [],
    risks: []
  },
  {
    id: 'asian-handicap-1-5',
    title: 'Asian Handicap -1.5/+1.5',
    content: "If there was a need to select a high-scoring side for the -1.0 line, that requirement has become more cogent with the Asian Handicap -1.5 option. So choose a team that can win by two or more goals to secure the full bet win.\n\nUnderdogs (+1.5) must be able to hold out for a victory, a draw, or lose by 1 goal to get a full bet win. With that in mind, you should select underdogs who have earned a reputation for being giant killers. Several teams meet this criterion in each football season. Do not opt for this option if the stronger side is on a winning run, scoring two or more goals in recent matchups.",
    advantages: [],
    risks: []
  },
  {
    id: 'vs-traditional-handicap',
    title: 'Asian Handicap vs Traditional Handicap',
    content: "Although they both share several similarities, these betting options are different. Here we break down their differences into four main categories.\n\nDraws\n\nConcerning significant differences, the traditional handicap option allows the draw outcome. So you can bet on a match ending in a stalemate with regular handicaps. As a result, traditional handicaps have three outcomes (win, draw, lose). On the other hand, Asian Handicaps only have two outcomes (Win or Lose). Draws are unavailable for this bet option.\n\nHandicap Format\n\nAnother difference between these handicap variants is their number system. Regular handicap uses whole numbers (+1, +2, -2). In comparison, Asian handicaps use whole, half, and quarter lines (+1, -0.25, +1.75, -1.25).\n\nBet Refunds\n\nGetting a partial or full refund after placing a regular handicap bet is impossible. With this bet option, you either win or forfeit your bet. For Asian handicaps, the reverse is the case. Some betting lines (quarter lines) offer partial or complete rewards even if your selected team loses the game.\n\nSimplicity\n\nRegular handicaps are very easy to understand. After briefly reading up on the concept, you should be able to place bets quickly. For Asian handicaps, you must understand how split bets work before you try this option. Additionally, you must learn how to read betting lines on the Asian handicap chart. All of these take time, making it a complex betting market.",
    advantages: [],
    risks: []
  },
  {
    id: 'advantages',
    title: 'Advantages of Asian Handicap Betting',
    content: "Numerous benefits come with using the Asian Handicap bet option. Some of them include:",
    advantages: [
      "Competitive Odds: Asian Handicap allows you access to more competitive odds, especially when betting on stronger teams.",
      "Higher Win Potential: With the possibility of draw outcomes removed, your chances of securing wins increase significantly.",
      "Partial Stake Refunds: Betting with split odds (1.75, 1.25, 0.75, 0.25 lines) ensures you get some of your stake back in draws.",
      "More Favourable Outcomes: This format can offer more favourable outcomes than traditional 1X2 betting in certain situations."
    ],
    risks: []
  },
  {
    id: 'disadvantages',
    title: 'Disadvantages',
    content: "Despite offering several benefits, this betting option has a few disadvantages. These drawbacks include:",
    advantages: [],
    risks: [
      "Complex Betting System: With features like quarter goals, half goals, mini bets, and push results, it may be complicated.",
      "No Option To Bet On draws: You can’t bet directly on draw outcomes. Your strategy is limited for games likely to end in draws.",
      "Not Suitable for Tight matchups: Unsuitable for games between evenly matched teams where you might get more value from a 1X2 market.",
      "Requires Lots Of Practice: Reading and correctly applying the information can be challenging for new bettors."
    ]
  },
  {
    id: 'tips-and-strategies',
    title: 'Asian Handicap Betting Tips and Strategies',
    content: "As with any betting option, there are tips you can apply to improve your chances of winning. Below, we outline some betting strategies you can use to make the most of your Asian Handicap bets.\n\nSearch For Value Bets\n\nConduct careful research and check for valuable bets before placing any wagers. From time to time, bookies may overestimate or underestimate the form of a team. Such situations present an opportunity to secure easy wins, especially if you place bets using split odds.\n\nUse Multiple Bookmakers\n\nSticking to one sportsbook is fine, but it limits your ability to scan for the best Asian Handicap odds for your bets. We recommend checking different betting sites and apps in search of competitive odds.\n\nConsider Team Performance\n\nBefore making a final decision on a bet, it's essential to review the current form of both teams. Individual player performance, goal-scoring records, clean sheets, and home/away form all matter.\n\nBe Patient\n\nPatience is key to enjoying the full benefits of Asian handicap soccer bets. Analyse if it's worth the risk before placing your bets. Do not rush when making decisions.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "Given its advantages, Asian Handicap football betting is a format worth considering. You now clearly understand how it functions and what it can offer.\n\nIf you're trying it for the first time, it's wise to start gradually. Take the time to research thoroughly, compare odds across platforms, and assess team performance before placing any wagers. Always remember to bet safely at all times.",
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
        question: "What does a +1.5 Asian Handicap mean?",
        answer: "A +1.5 handicap means your team starts with a 1.5-goal advantage. You win your bet if your team wins, draws, or loses by exactly one goal. You only lose if they lose by 2 or more goals."
      },
      {
        question: "What is the Asian Handicap rule?",
        answer: "The core rule is that it eliminates the draw outcome by giving one team a head start and the other a deficit. If the game ends in a tie after the handicap is applied, your stake is usually refunded."
      },
      {
        question: "What is an Asian Handicap bet?",
        answer: "An Asian Handicap bet is a form of spread betting that levels the playing field. It uses half-goals and quarter-goals to remove the possibility of a draw, creating only two outcomes."
      },
      {
        question: "What does 2.5 mean in Asian Handicap?",
        answer: "A 2.5 handicap means the favorite must win by 3 or more goals for the bet to win. For the underdog (+2.5), they win if they win, draw, or lose by 2 or fewer goals."
      },
      {
        question: "What is +0.25 Asian Handicap?",
        answer: "A +0.25 handicap is a split bet between 0.0 and +0.5. If the team draws, you get a half-win (win on the +0.5 half, refund on the 0.0 half)."
      }
    ]
  }
];

const legendItems = [
  { label: 'Win', sub: 'Full Payout', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Lose', sub: 'Lose Stake', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100' },
  { label: 'Half Win', sub: '50% Payout + Stake', color: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100' },
  { label: 'Half Lose', sub: 'Lose 50% Stake', color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100' },
  { label: 'Stake Refund', sub: 'Get Stake Back', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' }
];

const handicapTablesData: { [key: string]: any } = {
  'asian-handicap-0-0': {
    line: '0',
    left: { title: '-0 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Stake Refund' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Stake Refund' }, { label: 'Lose', result: 'Lose' }] }
  },
  'asian-handicap-0-25': {
    line: '0.25',
    left: { title: '-0.25 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Half Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0.25 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Half Win' }, { label: 'Lose', result: 'Lose' }] }
  },
  'asian-handicap-0-5': {
    line: '0.50',
    left: { title: '-0.50 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0.50 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose', result: 'Lose' }] }
  },
  'asian-handicap-0-75': {
    line: '0.75',
    left: { title: '-0.75 Handicap', rows: [{ label: 'Win By 2+ Goals', result: 'Win' }, { label: 'Win By 1 Goal', result: 'Half Win' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+0.75 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose By 1 Goal', result: 'Half Lose' }, { label: 'Lose By 2+ Goals', result: 'Lose' }] }
  },
  'asian-handicap-1-0': {
    line: '1.00',
    left: { title: '-1.00 Handicap', rows: [{ label: 'Win By 2+ Goals', result: 'Win' }, { label: 'Win By 1 Goal', result: 'Stake Refund' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+1.00 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose By 1 Goal', result: 'Stake Refund' }, { label: 'Lose By 2+ Goals', result: 'Lose' }] }
  },
  'asian-handicap-1-5': {
    line: '1.50',
    left: { title: '-1.50 Handicap', rows: [{ label: 'Win By 2+ Goals', result: 'Win' }, { label: 'Win By 1 Goal', result: 'Lose' }, { label: 'Draw', result: 'Lose' }, { label: 'Lose', result: 'Lose' }] },
    right: { title: '+1.50 Handicap', rows: [{ label: 'Win', result: 'Win' }, { label: 'Draw', result: 'Win' }, { label: 'Lose By 1 Goal', result: 'Win' }, { label: 'Lose By 2+ Goals', result: 'Lose' }] }
  }
};

const getBadgeStyles = (result: string) => {
  switch (result) {
    case 'Win': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Lose': return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'Half Win': return 'bg-teal-50 text-teal-600 border-teal-200';
    case 'Half Lose': return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'Stake Refund': return 'bg-blue-50 text-blue-600 border-blue-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export default function AsianHandicapPage() {
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
      if (intersecting.length > 0) setActiveSection(intersecting[intersecting.length - 1].target.id);
    }, { rootMargin: '-15% 0px -80% 0px' });
    
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
          <span className="text-brand-emerald uppercase font-bold">ASIAN HANDICAP</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Asian Handicap in <span className="text-brand-emerald">Football Betting</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Sports betting's global popularity stems mainly from the wide range of markets the industry provides. From 1x2, Over/Under, Totals, Prop, to Asian Handicap bets, there are several wager options for you to put your money on.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Each of these bet types offers you opportunities to earn money. However, they operate based on different rules. Some bet types are easy to grasp, while others involve more complex mechanics. The Asian Handicap soccer bet falls into the latter category. Without help, this betting option can be confusing, making the market unappealing.
                  </p>
                  <p className="text-slate-500 leading-relaxed mt-4">
                    That's where we step in. This <span className="text-brand-emerald font-bold">OddinsOdds Academy</span> guide carefully examines every aspect of Asian Handicap betting and simplifies it for clarity. Follow along as we reveal how the Asian Handicap works.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => {
                if (section.id === 'outcome-legend') {
                  return (
                    <section key={section.id} id="outcome-legend" className="scroll-mt-24">
                      <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h2 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-4 text-center justify-center">
                          Outcome Legend
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {legendItems.map((item, idx) => (
                            <div key={idx} className={`${item.bg} ${item.border} border rounded-3xl p-6 text-center shadow-sm`}>
                              <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-4`} />
                              <h4 className={`text-lg font-black ${item.text} mb-1`}>{item.label}</h4>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">{item.sub}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (section.id === 'vs-traditional-handicap') {
                  const parts = section.content.split('\n\n');
                  const intro = parts[0];
                  
                  const subSections = [];
                  for (let i = 1; i < parts.length; i += 2) {
                    if (parts[i] && parts[i+1]) {
                      subSections.push({ title: parts[i], text: parts[i+1] });
                    }
                  }

                  return (
                    <section key={section.id} id={section.id} className={`scroll-mt-24 p-8 sm:p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl transition-all duration-700 ${activeSection === section.id ? 'ring-2 ring-brand-emerald shadow-brand-emerald/10 scale-[1.02]' : 'opacity-80 scale-100 grayscale-[0.2]'}`}>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                        <span className="w-2 h-8 bg-brand-emerald rounded-full"></span>
                        {section.title}
                      </h2>
                      <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-slate-700 leading-relaxed text-lg mb-8">{intro}</p>
                        
                        <div className="space-y-8">
                          {subSections.map((sub, idx) => (
                            <div key={idx} className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                              <h3 className="text-xl font-black text-slate-900 mb-4 ml-2 border-l-4 border-brand-emerald pl-4">{sub.title}</h3>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{sub.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (section.id === 'tips-and-strategies') {
                  const parts = section.content.split('\n\n');
                  const intro = parts[0];
                  const subSections = [];
                  for (let i = 1; i < parts.length; i += 2) {
                    if (parts[i] && parts[i+1]) {
                      subSections.push({ title: parts[i], text: parts[i+1] });
                    }
                  }

                  return (
                    <section key={section.id} id={section.id} className={`scroll-mt-24 p-8 sm:p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl transition-all duration-700 ${activeSection === section.id ? 'ring-2 ring-brand-emerald shadow-brand-emerald/10 scale-[1.02]' : 'opacity-80 scale-100 grayscale-[0.2]'}`}>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                        <span className="w-2 h-8 bg-brand-emerald rounded-full"></span>
                        {section.title}
                      </h2>
                      <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-slate-700 leading-relaxed text-lg mb-8">{intro}</p>
                        
                        <div className="space-y-8">
                          {subSections.map((sub, idx) => (
                            <div key={idx} className="bg-emerald-50/20 p-8 rounded-[32px] border border-emerald-100/50">
                              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                                <span className="text-brand-emerald">#</span>
                                {sub.title}
                              </h3>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{sub.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                return (
                  <div key={section.id}>
                    <StrategyContentSection {...section} isActive={activeSection === section.id} />
                    
                    {handicapTablesData[section.id] && (
                      <div className="mt-8 bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="bg-brand-emerald/5 px-8 sm:px-12 py-4 flex justify-between items-center border-b border-brand-emerald/10">
                          <h3 className="text-xl font-black text-brand-emerald-dark">
                             {handicapTablesData[section.id].left.title}
                          </h3>
                          <h3 className="text-xl font-black text-brand-emerald-dark">
                             {handicapTablesData[section.id].right.title}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          <div className="p-8 sm:p-10 space-y-4">
                            {handicapTablesData[section.id].left.rows.map((row: any, rIdx: number) => (
                              <div key={rIdx} className="flex items-center justify-between">
                                <span className="text-slate-700 font-bold">{row.label}</span>
                                <span className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider ${getBadgeStyles(row.result)}`}>
                                  {row.result}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="p-8 sm:p-10 space-y-4">
                            {handicapTablesData[section.id].right.rows.map((row: any, rIdx: number) => (
                              <div key={rIdx} className="flex items-center justify-between">
                                <span className="text-slate-700 font-bold">{row.label}</span>
                                <span className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider ${getBadgeStyles(row.result)}`}>
                                  {row.result}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
