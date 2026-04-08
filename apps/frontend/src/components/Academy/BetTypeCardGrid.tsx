'use client';
import { useRouter } from 'next/navigation';

const betTypes = [
  { 
    id: 'asian-handicap', 
    title: 'Asian Handicap In Football Betting', 
    description: 'Read our detailed Asian Handicap guide and learn the ins and outs of this advanced bet type. Find our exclusive cheat sheet inside!',
    icon: '📉',
    color: 'rose',
    href: '/academy/bet-type/asian-handicap'
  },
  { 
    id: 'double-chance', 
    title: 'Double Chance Betting In Football', 
    description: 'Learn how the Double Chance betting market works in this beginner\'s guide. We explain the bet type with real-life examples and detailed explanations.',
    icon: '⚖️',
    color: 'amber',
    href: '/academy/bet-type/double-chance'
  },
  { 
    id: 'booking-points', 
    title: 'Booking Points Guide', 
    description: 'Learn how to bet on yellow and red cards with the advanced Booking Points betting market. We explain this bet type with real-life examples and give useful tips.',
    icon: '🟨',
    color: 'yellow',
    href: '/academy/bet-type/booking-points'
  },
  { 
    id: 'european-handicap', 
    title: 'European Handicap Guide', 
    description: 'Learn how to bet on European Handicap with this OddinsOdds Academy guide. You will find all the details about this advanced bet type with detailed examples.',
    icon: '🇪🇺',
    color: 'blue',
    href: '/academy/bet-type/european-handicap'
  },
  { 
    id: 'over-under', 
    title: 'Over/Under Betting Guide', 
    description: 'Learn how to be on the over/under bet types for total goals, corners, cards and more. We explain this betting market with detailed real-life examples.',
    icon: '📏',
    color: 'emerald',
    href: '/academy/bet-type/over-under'
  },
  { 
    id: 'goal-kick', 
    title: 'Goal Kick Betting Guide', 
    description: 'Discover goal kick betting in football. Learn types, strategies, live tips, and how to use team stats to predict goal kicks and win more consistently.',
    icon: '⚽',
    color: 'emerald',
    href: '/academy/bet-type/goal-kick'
  },
  { 
    id: 'system-bet', 
    title: 'System Bet', 
    description: 'Learn the system bet meaning, how it works with examples & calculations. Discover pros, cons & tips to use system bets smartly in betting.',
    icon: '⛓️',
    color: 'indigo',
    href: '/academy/bet-type/system-bet'
  },
  { 
    id: 'draw-no-bet', 
    title: 'Draw No Bet Explained (DNB)', 
    description: 'Explore the Draw no Bet (DNB) betting market with our in-depth guide. Learn how you place a DNB bet and find out when you should use this type.',
    icon: '🛡️',
    color: 'sky',
    href: '/academy/bet-type/draw-no-bet'
  },
  { 
    id: 'shots-on-target', 
    title: 'Shots on Target Betting Guide', 
    description: 'Discover the Shots on Target betting market with this OddinsOdds Academy guide. You\'ll find detailed explanations with real life examples on this page.',
    icon: '🎯',
    color: 'violet',
    href: '/academy/bet-type/shots-on-target'
  },
  { 
    id: 'prop-bet', 
    title: 'Prop Bet Guide', 
    description: 'This OddinsOdds Academy guide explains how to use prop bets. We give real life examples of proposition bets and give tips to improve your chances.',
    icon: '💡',
    color: 'amber',
    href: '/academy/bet-type/prop-bet'
  },
  { 
    id: 'ht-ft', 
    title: 'Halftime/Fulltime (HT/FT) Betting Guide', 
    description: 'Learn how to bet on the halftime/fulltime (HT/FT) betting market with this in-depth article. We cover all 9 possible outcomes and give useful tips.',
    icon: '⏰',
    color: 'orange',
    href: '/academy/bet-type/ht-ft'
  },
  { 
    id: 'banker-bet', 
    title: 'Banker Bet', 
    description: 'Learn all about banker bets in this OddinsOdds Guide. Discover how it works in accumulators & system bets, plus examples & tips to pick the best bankers.',
    icon: '🏦',
    color: 'teal',
    href: '/academy/bet-type/banker-bet'
  },
  { 
    id: 'corner-betting', 
    title: 'Ultimate Corner Betting Guide', 
    description: 'Learn how to bet on corner kicks with this OddinsOdds Academy guide. You\'ll learn all the terminology and strategies with real-life examples.',
    icon: '⛳',
    color: 'emerald',
    href: '/academy/bet-type/corner-betting'
  }
];

export default function BetTypeCardGrid() {
  const router = useRouter();
  const scrollToSection = (id: string, href?: string) => {
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
      {betTypes.map((type) => (
        <div 
          key={type.id}
          onClick={() => scrollToSection(type.id, type.href)}
          className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-slate-200/80 transition-all duration-500 cursor-pointer overflow-hidden active:scale-95"
        >
          {/* Decorative Gradient Background */}
          <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${type.color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
          
          <div className="relative z-10">
            {/* Bet Type Header */}
            <div className={`w-14 h-14 bg-${type.color}-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg shadow-${type.color}-500/20 group-hover:rotate-6 transition-transform duration-500`}>
              {type.icon}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-brand-emerald transition-colors">
              {type.title}
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              {type.description}
            </p>

            <div className={`mt-8 flex items-center font-black text-[10px] uppercase tracking-widest text-${type.color}-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500`}>
              Read Full Guide
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
