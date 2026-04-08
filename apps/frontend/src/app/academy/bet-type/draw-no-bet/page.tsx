'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-dnb', 
    title: 'What is Draw No Bet?', 
    content: "Also referred to as DNB, the concept behind the Draw No Bet option is self-explanatory. With this choice, your bets become void if the match ends in a tie. When that happens, you get your original stake back. Simply put, when your selected team wins, you receive payouts. When they draw, you get your full bet amount back. Only a loss leads to lost bets.\n\nUnlike the 1×2 bet option, a draw outcome is unavailable within the Draw No Bet market. Therefore, when using this type of wager, you have to back one of the two competing teams to win the match.\n\nCompared to the 1X2 bet option, DNB comes with fewer risks. However, there is a catch; this betting option has lower odds, which leads to smaller payouts for your winning bets.\n\nThis betting option is available in sports where draw outcomes are very likely. It is popular in football, Test Cricket, Hockey, and Rugby. Given its popularity, most bookies offer pre-match and live betting DNB odds for numerous football events.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-does-it-work', 
    title: 'How Does the Draw No Bet Market Work?', 
    content: (
      <>
        <p className="mb-4">Understanding an unfamiliar term can be challenging without concrete examples. Let's reveal how this market works, now we have the Draw No Bet meaning out of the way. We will illustrate using a practical scenario and a table for reference, so you will understand how Draw no bet in football works.</p>
        <p className="mb-6"><strong>Example:</strong> For a Brasileiro Serie A match between SC Recife vs EC Bahia, both teams have been assigned Draw No Bet Football odds of 2.11 and 1.70, respectively. Here are the likely outcomes depending on the team you select within the DNB market or if a draw occurs:</p>
        
        <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200">Match Result</th>
                  <th className="px-6 py-4 border-b border-l border-slate-200">DNB Recife</th>
                  <th className="px-6 py-4 border-b border-l border-slate-200">DNB Bahia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">Recife Wins</td>
                  <td className="px-6 py-4 border-l border-slate-100 text-emerald-600 font-semibold">Win 2.11x your stake</td>
                  <td className="px-6 py-4 border-l border-slate-100 text-rose-500">Lose your stake</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors bg-slate-50/30">
                  <td className="px-6 py-4 font-medium text-slate-900">Draw</td>
                  <td className="px-6 py-4 border-l border-slate-100 text-slate-500">Stake refunded</td>
                  <td className="px-6 py-4 border-l border-slate-100 text-slate-500">Stake refunded</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">Bahia wins</td>
                  <td className="px-6 py-4 border-l border-slate-100 text-rose-500">Lose your stake</td>
                  <td className="px-6 py-4 border-l border-slate-100 text-emerald-600 font-semibold">Win 1.70x your stake</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mb-4">Here are the main things you should keep in mind when placing the bet:</p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2"><span className="text-brand-emerald mt-1">•</span> Choose the team you believe has the stronger chance of winning. If they win, you receive the payout.</li>
          <li className="flex items-start gap-2"><span className="text-brand-emerald mt-1">•</span> If the match ends in a draw, your original stake is returned.</li>
          <li className="flex items-start gap-2"><span className="text-brand-emerald mt-1">•</span> Losses for your selected team lead to lost bets.</li>
        </ul>
        <p>Now you understand how the bet type works, make sure to check our full list of Draw No Bet predictions.</p>
      </>
    ),
    advantages: [],
    risks: []
  },
  {
    id: 'pros-and-cons',
    title: 'Pros and Cons',
    content: "As with any betting option, this betting market has benefits and drawbacks.\nHowever, DNB offers more positives than negatives. Let's check them out.\n\n**Pros**\n\nHere are the advantages of using Draw No Bet as your betting market:\n\n• **Lower Risk:** Draw No Bet offers you more protection than many other betting options. This option makes you more likely to get your funds back or secure wins.\n• **Easy to Understand:** This betting option is simple to grasp. There are no charts or special calculations like those in the more complicated handicap markets.\n• **Great for Backing Strong Underdogs:** It is a fine bet selection for backing underdogs in a strong position to secure a win or draw. If you're okay with just getting your stake back in case of a draw.\n• **Suitable For Evenly-Matched Teams:** DNB is a good market for backing one of two strong teams in a contest. Under this context, it provides a safer option than the 1×2 bet option.\n\n**Cons**\n\nYou should also be aware of the following negatives before using DNB:\n\n• **Lower odds:** Compared to the 1×2 betting odds, DNB odds are usually lower. As a result, you will get fewer payouts from winning bets.\n• **Unsuitable for Draw Outcomes:** While this market offers more protection, it is unfit for leagues or competitions with too many draw outcomes. Such outcomes will leave you without wins for long periods. If you're looking for a safer bet that also includes the draw option, the Double Chance bet is worth checking out.\n• **Unsuitable for Dominant Teams:** Due to its lower odds, DNB is unsuitable for teams that are more likely to win their games.",
    advantages: [],
    risks: []
  },
  {
    id: 'when-to-use-dnb',
    title: 'When To Use Draw No Bet',
    content: "Understanding how this bet option works is one thing; identifying appropriate situations to apply it is another. We have got you covered on that front as well. Here we explain ideal situations for picking this betting market.\n\nYou can apply the Draw No Bet strategy in the following scenarios:\n\n**Derby Matches Or Close-Fought Fixtures**\nGames between city rivals are usually full of tension. On many occasions, one team usually seems like the outright favourites. However, given the emotional nature of such games, you can not completely rule out the opposing team.\n\nMatches between two strong sides also fall into this category. Selecting one side for an outright win can be risky if both teams have winning streaks heading into the clash.\n\n**Backing Away Teams With A Good Chance Of Victory**\nThanks to their playing style and the strength of their squad, some teams are more likely to perform well in away matches. When these teams are in good form, they can often be solid picks for an away win.\n\nHowever, when they face stronger opponents and the outcome is less certain, choosing the Draw No Bet option instead of the standard 1×2 market offers a safer alternative.\n\n**Low-Scoring Teams Likely To Win**\nThis option is also suitable for teams known for their strong defense, but limited offense. Such teams often manage to build winning streaks through disciplined defending. In some matches, they can be a reasonable choice to win.\n\nHowever, given their tendency to score few goals, there's always the chance their opponents manage to equalise, leading to a draw. Rather than opting for a straight win or a draw, the Draw No Bet market offers more value in these cases.",
    advantages: [],
    risks: []
  },
  {
    id: 'tips-for-placing-dnb',
    title: 'Tips for Placing DNB Bets',
    content: "In this section, we list some tips that are crucial to helping you make the best Draw No Bet selections.\n\n**Check Team Form**\nA key part of your research process should involve checking the team's current form. Look at past results to get an idea of their performance. Only select teams that have a good win record. If their wins are not convincing or scrappy, that may be a sign that they are not a good choice for DNB.\n\nAlso, check how many goals they have conceded in their recent matches. Teams that concede a high number of goals are likely going to lose or draw lots of games. These outcomes are not ideal if you are looking to get payouts with this betting option. So, avoid such teams or use other appropriate betting markets for them.\n\nIt also helps to understand how well your selected team has performed against their next opponents in recent meetings. So check their head-to-head records. Also, check their injury record to make sure that the team is at full strength for the game.\n\n**Consider Home Advantage**\nHome teams with solid records are often safer bets in DNB markets. Their advantage usually increases when facing opponents who struggle on the road. For such teams, this option might be your best bet.\n\n**Use DNB For Hedging in Volatile Games**\nIf you love hedging your bets, the DNB option is perfect for you. For potentially volatile games where you have a favourite, betting on the teams with Draw No Bet will help you secure a win or get some of your funds back.\n\n**Include Draw No Bet In Your Combo or Accumulator Bets**\nDue to their lower odds, this betting option is great for accumulator bets. Since draw outcomes are not considered losses, a Draw No Bet parley doesn't ruin your acca bets.\n\nInstead of ruining the whole accumulator, a draw outcome simply voids that individual bet selection, so you can still win part of your winnings.\n\nTip: Have a look at our Accumulator predictions to find picks for the perfect combination bet.\n\n**Avoid DNB on Heavy Favourites**\nGenerally, 1×2 odds for big favourites are usually too low. For the DNB option, they are even lower. So, do not use this betting market for very dominant teams. For such teams, bet on the outright win or handicap option for the highest returns.\n\n**Do Not Ignore Draw Statistics**\nThe whole point of betting is to win, so selecting a team more likely to draw with the DNB option defeats that purpose.\n\nMake sure you check each team's draw statistics as much as you're looking at their win and loss statistics. If they are drawing too many games, then use another bet selection.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "The Draw No Bet option presents solid value if you are aiming to reduce risk while betting. It's straightforward to grasp and works well when backing strong underdogs or teams with little separating them.\n\nWhile the odds are typically lower than in other markets, the opportunity to recover your stake in the event of a draw helps balance out that trade-off.",
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
        question: "What is Draw No Bet?",
        answer: "Draw No Bet is a betting market where you wager on a team to win, but if the match ends in a draw, your stake is fully refunded."
      },
      {
        question: "Is Draw No Bet safe?",
        answer: "It is considered a safer betting option compared to traditional 1X2 markets, as it eliminates the draw outcome as a loss, returning your money instead."
      },
      {
        question: "How does Draw No Bet work?",
        answer: "You select either the home team or the away team to win. If they win, you receive the full payout. If the match is a draw, you get your original stake back. You only lose your bet if your selected team loses."
      },
      {
        question: "Can I use Draw No Bet in accumulators?",
        answer: "Yes, you can use DNB in accumulators. If a DNB selection within your accumulator ends in a draw, that particular selection is simply voided, and the accumulator continues with the remaining bets at recalculated odds."
      },
      {
        question: "Is Draw No Bet the same as Double Chance?",
        answer: "No, they are different. In Double Chance, a draw is considered a winning outcome, so you get paid the associated odds. In Draw No Bet, a draw just refunds your stake. Double Chance has lower odds than DNB because it covers two winning scenarios."
      }
    ]
  }
];

export default function DrawNoBetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">DRAW NO BET GUIDE (DNB) | DETA...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Draw No Bet Explained (DNB)
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Sports betting can be rewarding if you focus on some smart strategies. Choosing lower-risk markets like the Draw No Bet is a great way to increase your chances of success.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This bet type suits those with moderate confidence in a team's win. But what does Draw No Bet mean? Our <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> guide answers this question while also explaining all details of this <strong>bet type</strong>.
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
