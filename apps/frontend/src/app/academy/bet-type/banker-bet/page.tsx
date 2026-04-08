'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'banker-bet-meaning', 
    title: 'Banker Bet Meaning', 
    content: "A banker bet is essentially your most reliable selection. It's the wager you believe has the highest chance of winning and the one you build the rest of your slip around.\n\nThink of it as the foundation of your bet slip. In accumulator or system bets, the banker is the leg that must win for your bet to have any chance of success.\n\nIn practical betting, the banker does not mean \"guaranteed.\" It means \"most confident pick.\" The term is widely used in football betting, horse racing, tennis, and even casino games like baccarat, where the \"banker bet\" refers to betting on the banker's hand.\n\nIn sports betting, however, it strictly refers to your strongest selection.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-banker-bets-work', 
    title: 'How Banker Bets Work?', 
    content: "When you place a multi-leg accumulator, you can mark one selection as the banker. This tells the bookmaker that your chosen leg must win in every valid combination. The remaining legs may rotate depending on the type of system bet you choose.\n\nFor example, if you make a 3/4 system bet (three selections out of four), and one is marked as a banker, every winning combination must include that banker. This means if your banker loses, the whole slip is lost, regardless of the outcome of the other matches. But if the banker wins and one of the other legs fails, you can still make a return.\n\nThis setup gives you better structure and increases the chance of some payout, even though the potential maximum payout is usually smaller compared to a full accumulator without a banker.",
    advantages: [],
    risks: []
  },
  {
    id: 'banker-bet-of-the-day',
    title: 'Banker Bet of the Day',
    content: "When bookmakers promote a banker bet of the day, they are highlighting one selection they believe is the safest for that day. Common banker bets of the day often come from popular football leagues where a top team faces a much weaker opponent.\n\nHere are some of the examples:\n• Manchester United to win at home vs a bottom-table club at odds of 1.40\n• Barcelona to win away at odds of 1.55\n• Over 1.5 goals in a Serie A game at odds of 1.45\n• PSG to win at home at odds of 1.25\n\nAmong these, you feel most confident that PSG will win at home because they have not lost in 15 consecutive home matches and face a mid-table side missing key players. You mark PSG to win as your banker bet. This way, every combination you play in your system includes PSG's win. If PSG loses, all tickets collapse. If PSG wins and one of the other legs fails, you may still get some payout depending on the system bet type.\n\nYou can also check our prediction of the day and use it as your banker bet, giving you a reliable starting point for your bet slips.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-to-pick-a-good-banker-bet',
    title: 'How to Pick a Good Banker Bet?',
    content: "The difference between a successful and a risky banker is discipline.\n\nA good banker bet explained in practical terms below:\n\n• **Strong form and consistency:** The team or player you choose as banker should have a proven record of recent, consistent results. Avoid sides in poor form, even if they are favourites.\n• **Favourable matchup:** Look for a mismatch in ability. A banker bet example is backing a top team against a relegation-threatened side, especially at home.\n• **Minimal risk markets:** Bankers do not always have to be match-winners. Safer markets include Over 0.5 goals, Double Chance for the favourite, or Both Teams to Score in fixtures where history supports it.\n• **Confirmed team news:** Avoid making banker bets before lineups are confirmed, especially in football. A missing striker or goalkeeper can change the risk profile drastically.",
    advantages: [],
    risks: []
  },
  {
    id: 'when-not-to-use',
    title: 'When Not to Use a Banker Bet?',
    content: "Banker bets are not always the right approach. Avoid them when:\n\n• The odds are too low and offer no value. For instance, a banker at odds of 1.05 hardly increases returns but still carries risk.\n• You cannot explain clearly why it is your banker. If you rely only on \"gut feeling,\" avoid it.\n• The game involves unpredictability, such as local derbies, cup ties, or matches where motivation is uncertain.",
    advantages: [],
    risks: []
  },
  {
    id: 'tips-for-using-banker-bets',
    title: 'Tips for Using Banker Bets',
    content: "Here are some practical betting habits that help you make better use of banker bets:\n\n• **Keep records:** Track how often your banker bets win, the type of markets you use, and which leagues or sports give you better success.\n• **Limit exposure:** Never stake more than 5% of your bankroll on tickets that revolve around a single banker. Even the most obvious picks fail sometimes.\n• **Mix banker with value picks:** A banker works best when paired with higher odds selections in system bets. This balances risk and potential reward.\n• **Use multiple bookmakers:** Different bookmakers offer slightly different odds. Getting the best price on your banker improves your long-term returns.",
    advantages: [],
    risks: []
  },
  {
    id: 'banker-bet-in-different-sports',
    title: 'Banker Bet in Different Sports',
    content: "While football is the most popular sport for banker bets, the idea works across sports:\n\n• **Tennis:** A banker bet could be a top seed in an early-round match against a qualifier.\n• **Basketball:** A banker might be a home win for a team with a dominant home record.\n• **Horse Racing:** A banker could be a horse consistently placing in its category against weaker competition.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "The banker bet is one of the most useful concepts in sports betting. It gives you a foundation for structuring accumulators and system bets, helps you manage risk, and improves your long-term betting discipline. The key is to treat it as your strongest pick, not a sure win.\n\nAlways do your research, confirm lineups, check form, and never overexpose your bankroll. Whether you are searching for the banker bet of the day, building your own banker bet example, or just trying to understand banker bet meaning more clearly, remember that a banker is a tool to anchor your strategy, and it's not some kind of magic. Use it wisely, and it can add stability and consistency to your betting.",
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
        question: "What is a banker bet in horse racing?",
        answer: "In horse racing, a banker is a horse you confidently select to win (or place) and use as the anchor in multiple permutations like exactas or trifectas."
      },
      {
        question: "Is Banker better than Player?",
        answer: "This usually refers to the casino game Baccarat. In sports betting context, 'banker' is just the terminology for your most solid selection, not a specific side or team."
      }
    ]
  }
];

export default function BankerBetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">BANKER BET | MEANING, EXAMPLES...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Banker Bet
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    You're always chasing that one bet you feel can't lose, the one that gives you confidence no matter what. That's your banker bet. It's the pick you lean on, the selection you believe is as close to certain as it gets.
                  </p>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    You use it to anchor your accumulator, boost your system bets, or just play it straight when you want the safest shot at a win. Your banker is the backbone of your betting strategy, the piece that keeps your returns steady.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    In this <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> guide, you'll get banker bets explained in plain words, see clear examples and find out the mistakes you need to avoid if you don't want to blow your edge.
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
