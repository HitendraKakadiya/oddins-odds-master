'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-does-sot-mean', 
    title: 'What Does “Shot on Target” Mean in Football Betting?', 
    content: "A shot on target is a goal attempt that would have gone into the net if not stopped by the goalkeeper or the last defender.\n\nIn short, it's:\n• A goal.\n• A shot was saved by the goalkeeper.\n• A shot was blocked by the last outfield player on the line.\n\nWhat doesn't count:\n• Shots that hit the post or crossbar and bounce out.\n• Shots blocked by a defender who's not the last man.\n• Crosses that accidentally head toward the goal.\n• Missed penalties.\n• Shots that go wide or high.\n\nSo, if a player smashes the ball into the top corner, that's one SoT. If he takes a wild shot that flies over the bar, it doesn't count as a shot on target.",
    advantages: [],
    risks: []
  },
  { 
    id: 'understanding-markets', 
    title: 'Understanding Shots on Target Betting Markets', 
    content: "Before placing bets on shots on target, it's important to understand how bookmakers present these markets. The labels can look confusing at first, but once you know what each line means, reading and picking values becomes easy.\n\n• **Over 0.5 Shots on Target:** This means the player or team must register at least one shot on target during regular time. So, even if it's just one weak attempt saved by the goalkeeper, your bet wins.\n• **1+ Shot on Target:** This is the same as Over 0.5. It just sounds different. Bookmakers use both labels interchangeably. When you see \"1+ shot on target,\" you're betting that the player will hit the target at least once.\n• **Over 1.5 Shots on Target:** Now you're betting on two or more shots on target. If the player gets only one, the bet loses.\n• **2+ Shots on Target:** Same thing as above. The player must register at least two shots on target. Some sites use \"2+,\" others use \"Over 1.5,\" but both mean the same thing.\n\nThese markets usually apply only to the first 90 minutes, including added time, but not extra time or penalties. There are also other variations like 2.5+, 3+, or even 4+ shots on target, depending on the player and opponent. The higher the line, the longer the odds.",
    advantages: [],
    risks: []
  },
  {
    id: 'why-are-sot-worth-betting',
    title: 'Why are Shots on Target Markets Worth Betting on?',
    content: "Shots on target betting gives you a different angle - you're no longer predicting goals or winners.\n\nYou're looking at:\n• Player performance.\n• Playing position and tactics.\n• Defensive strength of the opposition.\n• Match tempo and expected ball possession.\n\nThis is especially useful when:\n• A top striker is up against a weak defence.\n• A winger is playing higher than usual.\n• A midfielder is on set-piece duty and shoots often.\n• You spot a value price for a player in good form.\n\nIt's also a good market for live betting when you notice a player getting into good positions or taking repeated shots early in the match.",
    advantages: [],
    risks: []
  },
  {
    id: 'examples-sot-betting-market',
    title: 'Examples for Shots on Target Betting Market',
    content: "To understand how shots on target betting works in real matches, let's look at some Premier League players who frequently feature in SoT markets.\n\nThese examples show you how player roles, opposition, and playing styles affect shot output.\n\n• **Erling Haaland (Manchester City):** Haaland is the perfect SoT betting option when City dominate a match. Against mid-to-lower table teams like Southampton or Bournemouth, he easily averages 2 or 3 shots on target per game. A line like Over 1.5 SoT is usually short-priced but reliable. In tougher fixtures, value shifts to Over 0.5 Shots on Target, especially when City plays more conservatively.\n• **Bukayo Saka (Arsenal):** As a right-winger who regularly cuts inside and takes on defenders, Saka sees a lot of goal-scoring opportunities. He often hits 1 or 2 shots on target, especially in home games or when Arsenal are chasing a result. He's a strong pick for 1+ or Over 1.5 SoT bets, particularly against teams that leave space on the flanks.\n• **Bruno Fernandes (Manchester United):** Playing in an advanced midfield role, Bruno is heavily involved in United's attack. He takes free-kicks, long shots, and penalties, which boosts his SoT chances. Against open teams like Nottingham Forest or Wolves, he can register 2+ SoT easily, especially when United are at home.\n• **Team Example (Liverpool):** Liverpool is aggressive and shoots often, especially at Anfield. Players like Mohamed Salah, Darwin Nunez, and even full-backs push high up the pitch. Against weaker sides, the team can register 7 to 10 shots on target. Betting on Liverpool Over 6.5 SoT often pays off in dominant performances.",
    advantages: [],
    risks: []
  },
  {
    id: 'how-to-pick-the-right-player',
    title: 'How to Pick the Right Player?',
    content: "Choosing the right player for shots on target bets is key to consistent success. Instead of picking stars at random, focus on factors that reveal whether a player is likely to get into shooting positions and test the goalkeeper.\n\n• **Look at Positioning, not just names:** It's easy to bet on famous strikers, but some wingers, attacking midfielders, or wing-backs may offer more value. If a full-back plays as a wing-back in a 3-5-2 system, they often get into shooting positions.\n• **Check Form and Averages:** Use recent matches to find how often the player is hitting the target. If a player has hit the target in 4 out of the last 5 matches, betting on Over 0.5 makes sense.\n• **Use Tactical News:** Is the player starting as a striker or playing deeper? Is the opposing team missing key defenders? Is the weather bad? All these factors affect shot volume and accuracy.\n• **Watch the Game Plan:** If you expect the player's team to dominate possession or play a high press, chances are the player will have more chances to shoot, especially if the game script leads to more attacks.",
    advantages: [],
    risks: []
  },
  {
    id: 'common-misunderstandings',
    title: 'Common Misunderstandings',
    content: "If you're losing money on shots on target bets, chances are you're messing up the basics. Shots on target markets are simple, but only if you understand how they work. Keep the following pointers in mind before placing bets on this market:\n\n• **\"Over 0.5\" and \"1+\" Are the Same Thing:** Don't overthink it. If you're betting \"Over 0.5 shots on target\" or \"1+ shots on target,\" you're placing the same bet. You just need the player to hit the target once. Bookies change the wording, but the line doesn't change.\n• **\"Over 1.5\" and \"2+\" Mean Two or More:** You see \"Over 1.5\" and think it's different from \"2+\"? It's not. Both mean the player must hit the target at least twice.\n• **Blocked Shots Don't Always Count:** Here's the trap you must not fall into: A player takes a shot, a defender gets in the way, and you think it's a shot on target. It's not, unless that block came from the last outfield defender near the goal and the ball was heading in. If it's blocked early or outside the box, it means nothing for your bet.\n• **Shots That Hit the Post Aren't On Target:** If the ball hits the post or bar and bounces out, that's not a shot on target. If the keeper didn't save it and it didn't go in, it doesn't count. Unless the ball hits the post and then gets saved or deflects off the keeper and goes in, it's worthless for your bet.",
    advantages: [],
    risks: []
  },
  { 
    id: 'conclusion', 
    title: 'Conclusion', 
    content: "Shots on target betting can be one of the smartest markets when you know how to approach it. It rewards understanding of team tactics, player roles, and current form, not just big names.\n\nIf you're betting on the EPL, watch the patterns. Teams like Arsenal, Liverpool, and Manchester City create a lot of chances. Players like Mohamed Salah, Gabriel Martinelli are worth following closely. Don't just chase star players, use logic and numbers.\n\nMake sure to the matchups carefully and be precise with your bets, just like the players you're backing.",
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
        question: "What counts as a shot on target in soccer?",
        answer: "A shot on target is any clear attempt on goal that either goes into the net, or would have gone into the net but was saved by the goalkeeper or blocked by the last-line defending outfield player."
      },
      {
        question: "What does 1.5 shots on target mean?",
        answer: "It means the bet requires the player or team to hit at least 2 shots on target. A single shot on target means the bet loses."
      },
      {
        question: "Does a penalty count as a shot on target?",
        answer: "Yes, generally if the penalty results in a goal or gets saved by the keeper, it counts as a shot on target. If the penalty hits the woodwork or misses the goal entirely, it doesn't count."
      },
      {
        question: "What does 1+ shot mean in betting?",
        answer: "\"1+\" means getting one or more. It is exactly the same as \"Over 0.5\". The player only needs to register a single shot on target for the bet to win."
      }
    ]
  }
];

export default function ShotsOnTargetPage() {
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
          <span className="text-brand-emerald uppercase font-bold">SHOTS ON TARGET BETTING | BEGI...</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Shots on Target Betting Guide
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Understanding shots on target (SoT) betting can give you a serious edge, especially when markets offer good value on individual players. Instead of focusing only on who wins the match, this market lets you dig deeper into player performance, shooting trends, and matchups.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    If you know how to read stats, analyse positions, and assess game context, this bet type becomes a reliable tool in your betting arsenal. Let's break down everything you need to know in this <span className="font-bold text-brand-emerald">OddinsOdds Academy</span> article.
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
