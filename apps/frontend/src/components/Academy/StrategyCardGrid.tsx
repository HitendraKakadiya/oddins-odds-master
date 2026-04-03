'use client';

import { useRouter } from 'next/navigation';

const strategies = [
  { 
    id: 'losing-streaks', 
    title: 'Understanding Losing Streaks', 
    description: 'Learn how to recognize a losing streak in betting and discover how you prevent it from getting worse. Our expert tips help you get out of your slump.',
    icon: '📉',
    color: 'rose',
    href: '/academy/strategies/losing-streaks'
  },
  { 
    id: 'arbitrage', 
    title: 'Arbitrage Guide', 
    description: 'This OddinsOdds Academy guide teaches you how to place sure bets with the advanced Arbitrage strategy. From spotting Arbing opportunities, to real life examples.',
    icon: '💹',
    color: 'amber',
    href: '/academy/strategies/arbitrage'
  },
  { 
    id: 'martingale', 
    title: 'Martingale System', 
    description: 'Learn how the Martingale system works, its risks, variations, and tips for safe betting. This OddinsOdds Academy article breaks it down with real life examples.',
    icon: '📈',
    color: 'indigo',
    href: '/academy/strategies/martingale'
  },
  { 
    id: 'confirmation-bias', 
    title: 'Confirmation Bias', 
    description: 'Learn how to deal with confirmation bias in this OddinsOdds Academy guide. We explain the concept, how to recognise it and how to minimise its impact on your bets.',
    icon: '🧠',
    color: 'violet',
    href: '/academy/strategies/confirmation-bias'
  },
  { 
    id: 'matched-betting', 
    title: 'Matched Betting Guide', 
    description: 'Learn how to make profits in either outcome by using the matched betting strategy. This OddinsOdds Academy guide explains the ins and outs of this strategy.',
    icon: '🤝',
    color: 'emerald',
    href: '/academy/strategies/matched-betting'
  },
  { 
    id: 'rollover-strategy', 
    title: 'Rollover Strategy Guide', 
    description: 'Learn how rollover works in betting and master strategies to clear wagering requirements with safe bets and smart bankroll control.',
    icon: '🔄',
    color: 'cyan',
    href: '/academy/strategies/rollover-strategy'
  },
  { 
    id: 'halo-effect', 
    title: 'Halo Effect In Betting', 
    description: 'Learn how to recognize the Halo Effect in betting with this OddinsOdds Academy guide. We explain how to limit its effect by offering a step-by-step checklist.',
    icon: '😇',
    color: 'sky',
    href: '/academy/strategies/halo-effect'
  },
  { 
    id: 'bankroll-management', 
    title: 'Bankroll Management Guide', 
    description: 'Learn how to manage your bankroll in this detailed OddinsOdds Academy guide. We explain how to create your bankroll, set your standard stake and give useful tips.',
    icon: '💰',
    color: 'teal',
    href: '/academy/strategies/bankroll-management'
  },
  { 
    id: 'kelly-criterion', 
    title: 'Kelly Criterion Strategy', 
    description: 'Get to know the Kelly Criterion Strategy for sports betting. We explain the formula and help you with sample calculations.',
    icon: '📊',
    color: 'emerald',
    href: '/academy/strategies/kelly-criterion'
  },
  { 
    id: 'flat-betting', 
    title: 'Flat Betting', 
    description: 'Learn flat betting in sports betting. Fixed stakes protect your bankroll, reduce risks, and build long-term betting discipline.',
    icon: '📏',
    color: 'blue',
    href: '/academy/strategies/flat-betting'
  }
];

export default function StrategyCardGrid() {
  const router = useRouter();

  const handleCardClick = (id: string, href?: string) => {
    if (href) {
      router.push(href);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <div 
          key={strategy.id}
          onClick={() => handleCardClick(strategy.id, strategy.href)}
          className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-slate-200/80 transition-all duration-500 cursor-pointer overflow-hidden active:scale-95"
        >
          {/* Decorative Gradient Background */}
          <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${strategy.color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
          
          <div className="relative z-10">
            {/* Strategy Header */}
            <div className={`w-14 h-14 bg-${strategy.color}-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg shadow-${strategy.color}-500/20 group-hover:rotate-6 transition-transform duration-500`}>
              {strategy.icon}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-brand-emerald transition-colors">
              {strategy.title}
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              {strategy.description}
            </p>

            <div className={`mt-8 flex items-center font-black text-[10px] uppercase tracking-widest text-${strategy.color}-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500`}>
              {strategy.href ? 'Read Full Guide' : 'Learn More'}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
