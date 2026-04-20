import Link from 'next/link';
import BetTypeCardGrid from '@/components/Academy/BetTypeCardGrid';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';

const sections = [
  { 
    id: '1x2-bets', 
    title: '1×2 Bets', 
    content: "It is arguably the most basic bet type that any online bookmaker has. When you place 1x2 bets, your objective is to predict an outright winner; it's as simple as that. You will find odds that represent the favourites and underdogs, helping you make informed football betting decisions.\n\nWhen to use them:\n\n• They are ideal for times when a game has a strong favourite or when you feel the underdog might pull off a surprise. 1x2 bets are universal and applicable to sports like cricket, football, boxing, tennis, and others.\n• They are not ideal for low-scoring sports such as hockey or baseball, where margins are often tight.\n• The simplicity of this bet type makes it perfect for those in their initial betting stage.",
    advantages: [],
    risks: []
  },
  { 
    id: 'over-under', 
    title: 'Over/Under Bets', 
    content: "Also called Totals, Over/Under bets are one of the most popular wagering types in online football betting. An important rule to note about them is that the result of a game does not affect your bet. Here, you wager on whether the total combined score of both teams will be over or under the number specified by the bookmaker you have signed up with. It is hugely popular among sports markets of football, basketball, hockey, and baseball.\n\nWhen to use them:\n\n• Over/Under can be your go-to choice when you have a great understanding of a game's scoring potential.\n• They are also the best when betting on weather-dependent sports like baseball or football. Factors such as rain and wind make \"under\" bets an attractive option.\n• You can opt for total bets when certain games show high or low-scoring trends. In games with explosive offenses, betting on \"over\" bets is advisable.\n\nFor example, in a football match between Liverpool and Manchester United, if you expect a headstrong battle, opt for the \"under\" bet; conversely, if both teams' history shows them as scoring consistently, go with the \"over\" bet option.",
    advantages: [],
    risks: []
  },
  { 
    id: 'parlay-bets', 
    title: 'Parlay Bets', 
    content: "This is a risky form of soccer betting. Parlay bets combine two or more bets in a single wager, requiring you to win all the legs to receive a payout. On a positive note, you receive a higher payout because of the multiplied odds.\n\nAnother advantage of these bets is that they can include any desired combination, including moneyline, over/under bets, etc., across different sports like cricket, football, tennis, basketball, and many more.\n\nWhen to use them:\n\n• Use parlay bets only when you are confident about winning all the legs you add to your single wager. If even one leg fails, you will lose the entire bet.\n• If you discover a \"low risk, high payout\" opportunity, parlays are a great option.\n• When multiple favourite events are at play, utilise parlay bets to boost your winnings with fewer risks.",
    advantages: [],
    risks: []
  },
  { 
    id: 'live-bets', 
    title: 'Live Bets', 
    content: "Live betting is a rage today, with a major population of gamblers like you preferring it. Live bets allow you to enjoy the thrill of odds shifting in real-time based on in-game scenarios. If you are a fan of fast-paced sports like T20 cricket, tennis, basketball, or football, wagering through live bets is advised.\n\nWhen to use them:\n\n• The best time to place a live bet is when you are watching a game concurrently. It lets you notice any momentum shift in the game and use it to your advantage.\n• Say you have placed a pre-game bet, which is at risk of a loss. During this time, place a live bet on the opposite outcome to mitigate the loss.\n• Live betting is known to offer good value when a team starts strong but has long odds.\n\nFor example, in a football match between Manchester City and Crystal Palace, City are the favourites, whereas Palace are the underdogs before kickoff. Now, imagine Palace scoring the first goal; it will shift the live betting odds towards Palace, helping you earn enhanced profits if Crystal Palace wins outright.",
    advantages: [],
    risks: []
  },
  { 
    id: 'handicap', 
    title: 'Handicap', 
    content: "Handicap bets are often used for sports such as football and rugby, wherein one team has a heavy advantage or disadvantage in comparison to the other.\n\nWhen to use them:\n\n• Use handicap bets anytime you notice one team heavily favoured.\n• Low-scoring sports like football can help you get the most out of your handicap bets.\n• Betting on the favourite during instances of a blowout can help you maximise profits, too.\n\nThere is a significant difference between European Handicap and Asian Handicap. Make sure to read both guides to understand which one suits you best.",
    advantages: [],
    risks: []
  },
  { 
    id: 'each-way', 
    title: 'Each-Way', 
    content: "Each-way bets apply to sports, usually with a leaderboard position. Sports like golf, horse racing, Formula 1, etc., contain each-way betting opportunities. For such bets, you must wager twice, once on your selection to win and second on a position. You will receive a payout for both bets if your selection wins; however, if only the position bet wins, you will receive a single payout for it.\n\nWhen to use them:\n\n• Backing an underdog with the potential of finishing in one of the top positions can help you benefit from each-way bets.\n• If you are unsure about picking an outright winner due to multiple quality options, use each-way bets for flexibility.\n• Markets with higher odds indicate a lower chance of victory. Ensure you use each-way wagers on smaller odds for benefits.\n\nFor example, if you believe Rory McIlroy will face stiff competition during a golf tour, place a bet for him to win and another for position, say Top 5. If he wins the outright bet, you will win both bets, but if he wins only the position bet, you will get paid only for that.",
    advantages: [],
    risks: []
  },
  { 
    id: 'draw-no-bet', 
    title: 'Draw No Bet (DNB)', 
    content: "Draw No Bet involves wagering on a team to win, but if the match ends in a draw, the bookmaker refunds your stake. DNB is designed to reduce your risk.\n\nFor example, in a match between Arsenal and Chelsea, if you bet with DNB on Arsenal and they win, you get paid. If the match ends in a draw, you earn your stake money, but if Chelsea wins, you lose the bet.\n\nWhen to use them:\n\n• DNB is best used when you back a team to win, but want a safety cushion against a draw.\n• Use this bet in matches with the potential of being closely contested, especially featuring bigger teams.\n\nRead our full Draw No Bet Guide.",
    advantages: [],
    risks: []
  },
  { 
    id: 'double-chance', 
    title: 'Double Chance', 
    content: "Double Chance bets allow you to bet on multiple outcomes: Team A to win or draw, Team B to win or draw, and either team to win (no draw).\n\nSo, if you bet on Manchester City to win or draw against the Spurs, and they win or draw, you get paid, but if Tottenham wins, you lose the bet and get paid nothing.\n\nWhen to use them:\n\n• You can use a double chance when betting on an underdog team.\n• You can also opt to wager on matches with the potential of being closely contested, as it is low-risk.",
    advantages: [],
    risks: []
  },
  { 
    id: 'shots-on-target', 
    title: 'Shots on Target', 
    content: "A Shots on Target bet involves wagering on the number of shots towards the goal, regardless of whether or not the goalkeeper saves them. This bet falls in the under/over category and can be placed on a player or a team as a whole.\n\nWhen to use them:\n\n• Utilise when a match involves aggressive forwards like Erling Haaland, Mohamed Salah, Lionel Messi, or Cristiano Ronaldo.\n• Alternatively, use this bet when a team has a weak defence.",
    advantages: [],
    risks: []
  },
  { 
    id: 'ht-ft', 
    title: 'Half-Time/Full-Time (HT/FT)', 
    content: "This football betting type practices the prediction of both half-time and full-time scores in team competitions. They are often high-risk bets as predicting both half-time and full-time scores is risky.\n\nNevertheless, say in a match you predict Manchester United to draw against Everton. If the Red Devils are level at half-time, but win at full-time, you still win the bet.\n\nWhen to use them:\n\n• Use HT/FT bets when you have researched how different teams perform in different halves of a game.",
    advantages: [],
    risks: []
  },
  { 
    id: 'btts', 
    title: 'Both Teams to Score (BTTS)', 
    content: "BTTS bets come with simple rules; they require both participating football teams to score at least one goal, irrespective of the final result. You get paid if, during a match between Liverpool and Manchester United, both teams score at least one goal, with the score reading 1-1, 2-1, 2-2, and so on. However, if only one team scores, you lose the bet.\n\nWhen to use them:\n\n• You can use BTTS bets when both teams have strong forwards or weak defences.",
    advantages: [],
    risks: []
  },
  { 
    id: 'corner-bets', 
    title: 'Corner Bets', 
    content: "Another football bet, Corner bets revolve around the corner kicks earned by a single team or both teams during a game. You will find them as over/under bets or which team will earn more corners.\n\nWhen to use them:\n\n• Bet on the corner bets market when the teams play an attack-heavy line-up.\n• Check teams for the total number of wingers or when one team is stronger than the other in its attack.",
    advantages: [],
    risks: []
  },
  { 
    id: 'booking-points', 
    title: 'Booking Points', 
    content: "A Booking Points bet focuses on the disciplinary element of a game, where you're betting on yellow and red cards received in a match. Usually, a yellow card is worth 10 points, whereas a red card carries 25 points.\n\nSo, if you bet 'Over 45.5 booking points' in a Liverpool vs Everton match, and there are 4 yellows (40 points) and 1 red (25 points), the tally is 65 points, resulting in the bet won.\n\nWhen to use them:\n\n• Use booking points bets during derby matches.\n• Use it in games that have witnessed heated rivalries in recent matches.",
    advantages: [],
    risks: []
  },
  {
    id: 'considerations',
    title: 'Considerations for Selecting Bet Types',
    content: "Choosing a random bet type often ends in losing your bet. That's why we recommend to always carefully select the market you place your bet on.\n\nInstead, focus on tactics like bankroll management and the timing of your bets. See that you spend your money wisely; while at it, set a budget aside for parlay bets, as they are high-risk and best used with better experience. You should also know what the best time is to place each bet. For example, stake using futures bets early on in the season as opposed to midway or later on.\n\nFinally, we recommend to focus on research. Keep a close watch on the player and team developments when leading up to a fixture. This will provide you with insights about possible injuries or if a player will be benched. Likewise, keep up with the rule updates of any given sport to gain an advantage over other bettors.",
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
        question: "What is the safest bet type for beginners?",
        answer: "1x2 (Match Result) and Double Chance are generally considered the safest and easiest to understand for those new to sports betting."
      },
      {
        question: "Is Asian Handicap better than European Handicap?",
        answer: "Asian Handicap is often preferred by professional bettors because it offers more precise margins and includes the 'push' (refund) option for whole numbers, reducing the house edge."
      },
      {
        question: "Can I combine different bet types in a parlay?",
        answer: "Yes, most bookmakers allow you to combine various markets like Match Result, Over/Under, and BTTS across different matches into a single parlay ticket."
      },
      {
        question: "Do live odds change frequently?",
        answer: "Yes, live odds shift in real-time based on in-game actions like goals, cards, momentum shifts, and time remaining."
      }
    ]
  }
];

export default function BetTypesPage() {
    
  
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Reading Progress Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase">BET TYPES GUIDES</span>
        </nav>

        <StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Guides for All <span className="text-brand-emerald">Bet Types</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    When betting on online sports, understanding which bet type suits your approach can benefit in the long run. If you are new to online betting and wish to learn about the different bet types, this OddinsOdds Academy page can act as your guide.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Soccer Betting requires knowledge about the game to master it. Still, it can be unpredictable, which means there&apos;s no sure way to win. This is where understanding how various bets work can give you an advantage.
                  </p>
                  <p className="text-slate-500 leading-relaxed mt-4">
                    You can read about the bet types here that you will usually find at a legal sportsbook.
                  </p>
                </div>
              </div>

              {/* Grid of Bet Type Cards */}
              <div className="mb-20">
                <BetTypeCardGrid />
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
