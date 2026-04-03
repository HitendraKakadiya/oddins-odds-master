'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-halo-effect', 
    title: 'What Is the Halo Effect?', 
    content: "The Halo Effect meaning is not complicated. It's a shortcut your brain takes to make fast decisions without putting in the effort to examine every detail. Instead of going through all the facts, you simply grab onto one noticeable feature.\n\nIn sports, this could play out as thinking a specific player is unstoppable because of one spectacular performance. At other times, you could assume a team is unbeatable because of its historic success. That single glowing impression creates a \"halo\" around them, making everything else look better than it is. With that limited information, you then form an opinion.\n\n**Example:** A striker scores three goals in one game. Without realizing it, you start rating him as elite in every future match. You do this even when deeper stats show his expected goals (xG) are low. You even ignore other statistics, like their average passing accuracy, and they often go missing in tough away games.\n\nThis bias can be very bad when it comes to betting on sports. When the halo effect kicks in, you might:\n\n• Ignore key stats and context like defensive weaknesses or poor away records.\n• Overlook dips in form, injuries, or tactical mismatches. You may begin assuming that past brilliance will carry them through.\n• Overlook underdogs for favourites because of name recognition. Such action could lead to selecting the wrong teams to back when placing your bets.\n\nThe problem is that when the halo effect takes over, you stop betting on what is. Instead, you are putting your money on reputation.",
    advantages: [],
    risks: []
  },
  { 
    id: 'why-it-controls-mind', 
    title: 'Why the Halo Effect Controls Your Mind', 
    content: "Analysing every stat, lineup, and tactic takes effort and time. Instead of doing that, you may focus more on standout moments or recent wins. You recall the last-minute goal your team scored, but not the goals they nearly gave away.\n\nYou remember a tennis player’s Grand Slam run, but not their early exits in smaller events. Sports media keeps this bias going by constantly giving you:\n\n• Highlight reels that play the best moments on repeat.\n• Headlines that glorify records and streaks.\n• Commentators who label a player “world-class” after one week of brilliance.\n\nOnline bookmakers know this. Public hype often shifts betting lines away from actual probabilities. If you’re caught in the halo effect, you can end up chasing bad value while thinking you’re making a smart play.",
    advantages: [],
    risks: []
  },
  { 
    id: 'examples', 
    title: 'Halo Effect Examples in Sports Betting', 
    content: "In this section, we provide several scenarios across different sports where the Halo Effect is influencing decision-making.\n\n### Football\n\n**Brazil’s Legacy Trap**\nBrazil’s yellow shirt and famous football history are scary. You support them without a second thought in the World Cup or the Copa América. But you fail to see the signs: a shaky midfield, odd lineups, or problems during away matches. The name means more to you than the most recent stats.\n\n**Media Hype Around a Striker**\nFor Boca Juniors, an Argentine forward scores in six straight games. Sports pages say he is \"unstoppable.\" You then stake a lot of money on Boca's next match. But River Plate's defence has kept three straight clean sheets at home, which is a stat that has disappeared in all the excitement.\n\n**Reputation Over Reality**\nFor example, Club Brugge is always in the news in the Belgian Pro League. Those short odds make it feel safe to be on them. They had won 3 games in their last six matches. You still support them and learn the hard way that form is more important than history.\n\n### Basketball\n\n**The MVP Glow**\nAn NBA MVP is picked. Fans and analysts deem the player the greatest and a crucial part of every game. You start to back his team on the road against a strong defensive team. Because of the halo effect, you do not seem bothered by his poor shooting percentage when the player is under pressure in away games.\n\n**March Madness Underdog Illusion**\nA college basketball team (Atlantic Owls) goes on a strong winning run in the NCAA tournament. Then, in the following season, you start betting on the team believing it is better than it is because of that magical run. But you forget that the roster has changed and the defence is not what it used to be.\n\n### Tennis\n\n**Grand Slam Bias**\nA fairly popular player wins Wimbledon in style. As a result, you find yourself placing bets on him in every other ATP event. However, you forget too quickly that he is not good on clay courts because the highlight of grass still lingers in your mind.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-to-beat', 
    title: 'Beating the Halo Effect in Sports Betting', 
    content: "To beat the Halo Effect, you must break the pattern of following the crowd and start focusing on current facts. Here is a checklist for breaking the Halo Effect:\n\n1. **Stop at the Name:** When you see a big team name (like Real Madrid or the Lakers), wait. Ask yourself: \"Why am I betting on them? Is it the name or their current form?\"\n2. **Look for the Cons:** For every reason you find to back a team, find one reason not to. Maybe they have an injury, a busy schedule, or a bad record against this specific opponent.\n3. **Use Data, Not Memories:** Forget the overhead kick from three weeks ago. Look at passing accuracy, shots on target, and defensive errors. Stats are boring, but they are honest.\n4. **Ask the Key Question:** “Am I betting on reputation or reality?” If your answer is based on name value alone, stop. This simple check can save you from costly, emotion-driven mistakes. Never bet on reputation alone.\n5. **Track Your Own Bias:** Track bets influenced by big names or hype. Review it to catch patterns you repeat. Over time, you’ll spot and break the habits that drain your bankroll.",
    advantages: [],
    risks: []
  },
  { 
    id: 'tips-to-avoid-losses', 
    title: 'Practical Betting Tips to Avoid Halo Effect Losses', 
    content: "With our checklist for breaking the Halo Effect now clear, let's take a look at how you can get back to winning ways. Here are some tips you can apply:\n\n• **Bet smaller when hype is high:** If the numbers say the big-name team isn't worth the buzz, keep your wager small.\n• **Hunt for “quiet” teams with good stats:** Don't ignore underdogs with real promise. Some solid teams may get little attention due to their history or past performances. However, based on their current form, they are likely to offer more winning prospects than favourites.\n• **Try “fade the public” strategies:** From time to time, track what happens when you go against overhyped favourites. If you see winning results, then adopt that betting strategy for the favourites until their form changes.\n• **Explore Other Markets:** Due to their low odds, 1×2 betting on favourites could offer little value. So identify new betting opportunities you can leverage to get more winnings. The European and Asian Handicap bets often provide good value. You should also look at opportunities in the Over/Under betting market.",
    advantages: [],
    risks: []
  },
  { 
    id: 'self-test', 
    title: 'Self-Test: Are You Falling for the Halo Effect?', 
    content: "As a way to test if you have ever made sports betting decisions due to the Halo Effect, answer **Yes** or **No** to each sentence below:\n\n• I have placed a wager mostly because a team or individual is considered a \"big name\".\n• I ignored poor form because of a player's \"class\".\n• I placed a bet just because a team had an impressive record in the past.\n• When I see a highlight, I place my bets immediately.\n• Sometimes I do not check the stats because I feel I \"already know\" the player is strong.\n\nIf you answer \"Yes\" to three or more questions above, you might be allowing the halo effect to influence your bets.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "You can respect the legends, revel in the highlight reels, and still bet wisely. The halo effect isn't evil; it's just human nature. In sports betting, the Halo Effect can cost you dearly.\n\nSo carefully weigh your decisions before placing those bets. Reputation does not pay winning tickets; proper analysis does. The more you bet on reality, the less the halo effect damages your bankroll.",
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
        question: "What is the halo effect with an example?",
        answer: "The halo effect is a cognitive bias where a single positive trait (like a star player's reputation) influences your overall judgment of a team, leading you to ignore their weaknesses."
      },
      {
        question: "What is the halo effect strategy?",
        answer: "While not a strategy to follow, overcoming the halo effect involves deliberately looking for 'disconfirming' evidence and focusing on current data rather than past glory."
      },
      {
        question: "Is the halo effect good or bad?",
        answer: "In betting, it is generally bad because it leads to overvaluing favorites and ignoring value in underdogs, which can drain your bankroll over time."
      },
      {
        question: "How to avoid the halo effect?",
        answer: "Use data-driven analysis, set strict betting criteria, and always ask yourself if you are betting on reputation or recent, objective performance stats."
      }
    ]
  }
];

export default function HaloEffectPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries.filter(entry => entry.isIntersecting);
      if (intersecting.length > 0) {
        const latest = intersecting[intersecting.length - 1];
        setActiveSection(latest.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div 
          className="h-full bg-brand-emerald transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/strategies" className="hover:text-brand-emerald transition-colors uppercase">STRATEGIES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase">HALO EFFECT IN BETTING</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Halo Effect <span className="text-brand-emerald">in Betting</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "The Halo Effect in betting happens when you let one good thing make you think a team or player is better than they are. You focus on a star moment or reputation instead of looking at the full picture."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    But here's the question: Are you betting on real facts, or just because it feels right? What is the Halo Effect, and how does it work? This OddinsOdds Academy guide discusses the Halo effect in great detail.
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-12">
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
                  const element = document.getElementById(id);
                  if (element) {
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }} 
              />
              <TodaysMatchesWidget />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
