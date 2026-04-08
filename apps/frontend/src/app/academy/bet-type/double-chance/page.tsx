'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'meaning-with-examples', 
    title: 'Double Chance Soccer Bet Meaning with Examples', 
    content: "Double chance betting in football allows you to cover two of the three possible match outcomes - win, draw, or loss - with a single bet. Instead of choosing just one team to win or backing a draw, you bet on two outcomes at once, reducing your risk of losing.\n\nLet's say Manchester United are playing Chelsea. A standard 1X2 bet would force you to pick only one result - a home win, a draw, or an away win. But with double chance, you can bet on 1X, covering a Man Utd win or a draw. If Chelsea wins, you lose, but if the match ends in a draw or Man Utd win, your bet lands.\n\nThis is especially helpful when you're backing underdogs or in matches where a draw seems highly likely. If Brentford are playing Newcastle and you're unsure if Brentford will win but believe they won't lose, an X2 bet can be the safer route. Even if Brentford only manage a draw, you'll still win the bet.",
    advantages: [],
    risks: []
  },
  {
    id: 'what-is-x2-1x-12',
    title: 'What Does Double Chance X2, 1X, and 12 Mean?',
    content: "1X, X2 and 12 are the three possible outcomes of a Double Chance wager. Here's the breakdown of what each of them means:\n\n• **The double chance 1X market** covers a win for the home team or a draw.\n• **The double chance X2** covers a win for the away team or a draw.\n• **And the double chance 12** means either team wins - the only result that makes you lose is a draw.\n\nEach of these options lowers your risk by covering two of the three possible outcomes. The odds, in return, are also lower compared to a traditional 1X2 bet, but the probability of winning is much higher.",
    advantages: [],
    risks: []
  },
  { 
    id: 'why-popular', 
    title: 'Why is Double Chance Betting Popular?', 
    content: "One of the main reasons double chance betting is so popular in soccer is that it offers a safety net. Football matches, especially in lower leagues or international fixtures, can be unpredictable. A late red card, a dodgy penalty, or just a well-organised underdog can completely change the outcome.\n\nWith double chance bets, you give yourself a cushion. You don't have to rely solely on your team winning; you're also covered if they avoid defeat (or, in the case of 12, if anyone wins). This makes it especially attractive if you are a casual bettor and are building up a small bankroll.",
    advantages: [],
    risks: []
  },
  { 
    id: 'strategy', 
    title: 'Double Chance Betting Strategy: When and How to Use It?', 
    content: "The most effective way to use a double chance football betting system is to match it with team form and context. If a team has a solid home record, but they're playing a strong opponent, betting on 1X might be the right move. If an away team is on a hot streak or the home side is struggling with injuries, you might go for X2.\n\nThe double chance 12 market is often overlooked but works well in situations where both teams need to win, such as knockout games or final-day league matches. If a draw doesn't help either side, chances are the match will produce a winner.\n\nYou can use this betting strategy to build accumulators, combining multiple double chance selections into one bet to increase potential payouts. For example, selecting four 1X double chance bets on strong home sides can return a decent profit with a higher success rate than traditional win/draw/win bets.",
    advantages: [],
    risks: []
  },
  { 
    id: 'when-to-avoid', 
    title: 'When to Avoid Double Chance Betting', 
    content: "Despite its safety, there are times when double chance bets aren't the right call. For instance, backing a heavy favourite at home with a 1X bet often gives odds so low they're barely worth the risk. If you're getting odds like 1.10 or less, the return doesn't justify the bet - you'd need to win 10 out of 11 bets just to stay ahead.\n\nAlso, if you're betting on a match with little motivation - say, a mid-table end-of-season fixture - the draw becomes very likely, and the result harder to call. Unless you have a clear angle, it's better to skip such games than force a double chance play.",
    advantages: [],
    risks: []
  },
  { 
    id: 'live-betting', 
    title: 'Live Betting in Double Chance Wagers', 
    content: "Another smart use of the double chance market is during in-play betting. After 20-30 minutes of a goalless match, the odds on double chance selections often improve slightly, giving you more value. This is especially useful when a favourite is underperforming, or if you're seeing something live that wasn't priced into the pre-match odds.\n\nSuppose Bayern Munich is playing a lower-table Bundesliga team and fails to score in the first half-hour. You might jump on 12 (either team wins) at better odds, especially if the underdog looks threatening.",
    advantages: [],
    risks: []
  },
  { 
    id: 'compare-dnb', 
    title: 'How Does Double Chance Compare to Draw No Bet?', 
    content: "It's important to understand the distinction between double chance and draw no bet (DNB). With a DNB wager, if the match ends in a draw, you get your stake refunded. You only win if your selected team wins outright. Double chance, on the other hand, pays out on a draw if it's one of the two covered outcomes.\n\nDNB generally offers slightly higher odds than double chance because it doesn't cover two outcomes in the same way. But a double chance provides actual win potential on a draw, making it more appealing if you think a stalemate is likely.",
    advantages: [],
    risks: []
  },
  { 
    id: 'final-thoughts', 
    title: 'Final Thoughts', 
    content: "A double chance should be in your arsenal if you're serious about football betting and want to maintain a more stable win rate.\n\nIt's a practical, low-risk strategy ideal for underdog bets, tight fixtures, or when you're looking to combine picks in an accumulator without swinging for the fences. Like any strategy, it works best with knowledge, team form, match context, motivation, and smart bankroll management.",
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
        question: "What does Double Chance mean in betting?",
        answer: "Double Chance is a betting market that allows you to cover two of the three possible outcomes (Win, Loss, Draw) in a single bet, significantly increasing your chances of winning."
      },
      {
        question: "What does Double Chance 2X mean?",
        answer: "2X (or X2) is a bet on the Away team to either win the match or for the match to end in a draw. You only lose if the Home team wins."
      },
      {
        question: "Is Double Chance betting profitable?",
        answer: "Yes, it can be very profitable, especially as part of an accumulator or when backing underdogs. However, because the risk is lower, the odds are typically shorter than 1X2 markets."
      },
      {
        question: "Is Double Chance only 90 minutes?",
        answer: "Yes, standard football bets, including Double Chance, usually apply to the regular 90 minutes plus injury time. Extra time and penalties are typically not included unless specified."
      },
      {
        question: "When should I use Double Chance betting?",
        answer: "It's best used in matches where you expect a tight contest, when backing an underdog to avoid defeat, or when building low-risk accumulators."
      }
    ]
  }
];

export default function DoubleChancePage() {
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
          <span className="text-brand-emerald uppercase font-bold">DOUBLE CHANCE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Double Chance Betting in <span className="text-brand-emerald">Football</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Double chance betting in football allows you to cover two of the three possible match outcomes - win, draw, or loss - with a single bet. Instead of choosing just one team to win or backing a draw, you bet on two outcomes at once, reducing your risk of losing.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This <span className="text-brand-emerald font-bold">OddinsOdds Academy</span> guide explains how the double chance market works, when to use it strategically, and how it compares to other popular bet types like Draw No Bet.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-20">
              {sections.map((section) => (
                <div key={section.id}>
                  <StrategyContentSection {...section} isActive={activeSection === section.id} />
                </div>
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
