'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-confirmation-bias', 
    title: 'What Is Confirmation Bias?', 
    content: "Confirmation bias is your brain's way of taking the easy route. You already have an idea about a team, a player, or a match outcome, and instead of looking at the facts evenly, you selectively pick information that agrees with what you think.\n\nImagine you believe Manchester United will win because their star player, Bruno Fernandes, has been on fire. You notice every stat, article, or highlight showing that player scoring, but completely ignore injuries, poor teamwork, or their opponent's strengths. That's confirmation bias in action.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-it-affects-betting', 
    title: 'How Does Confirmation Bias Affect Sports Betting?', 
    content: "In sports betting, confirmation bias can change your decisions in subtle ways, often without you even noticing. Here's how it usually shows up:\n\n• **Focusing Only on Wins:** You might keep recalling the times your bets won, and conveniently forget the times they didn't. This makes you overconfident and more likely to increase stakes without proper analysis.\n• **Ignoring Contradictory Stats:** Even if the numbers say your team is likely to lose, you might dismiss them as irrelevant or overrated just because they don't fit your narrative.\n• **Overvaluing Recent Performance:** A player scored a double or a hat-trick last week, so you automatically assume he will perform the same way next game. Past performance is a data point, not a guarantee.",
    advantages: [],
    risks: []
  },
  { 
    id: 'real-life-examples', 
    title: 'Real Life Examples', 
    content: "It's easier to understand confirmation bias when you see it in action. Here are a few examples you might recognise:\n\n• **Betting on Underdogs:** You love betting on underdogs because when they win, the payout is massive. You remember when your underdog pick won, but forget all the times they lost. This selective memory makes it seem like underdogs win more often than they do, and you end up making riskier bets than you should.\n• **Star Player Focus:** Imagine a star striker scored twice in the last match. You assume he will dominate the next game too, ignoring other factors like team strategy or the opponent's defence. By focusing only on the star player's performance, you overlook the bigger picture.\n• **Betting After a Big Win:** You had a big win last weekend, and now you feel overconfident. You start believing that your picks are always right and place bigger bets. This overconfidence is fueled by confirmation bias - you're only remembering your successes and ignoring your losses.\n• **Following Public Opinion:** You read a forum where everyone says Arsenal is going to crush Man United. You immediately start thinking the same, even though the statistics show a close match. Social platforms cloud your mind, making you ignore data that doesn't fit the popular narrative.",
    advantages: [],
    risks: []
  },
  { 
    id: 'dangers-of-bias', 
    title: 'The Dangers of Confirmation Bias', 
    content: "If you don't address confirmation bias, it can seriously impact your betting results. When you're guided by bias, you're often making decisions based on emotion, not facts.\n\nWhen your decisions are biased, you're more likely to place bets that don't make sense. Over time, these losses can add up. Even small repeated mistakes can drain your bankroll faster than you realise.\n\nThis bias can make you cling to the same strategy or team picks, even if they're not working. This resistance to change prevents you from learning and improving your betting skills.\n\nIf you constantly reinforce your beliefs, you start thinking you can't be wrong. This overconfidence can lead to higher stakes and riskier bets, which often end badly.",
    advantages: [],
    risks: []
  },
  { 
    id: 'how-to-challenge', 
    title: 'How to Challenge your Bias', 
    content: "The good news is you can take concrete steps to reduce the influence of confirmation bias on your bets. If you keep the below pointers in mind, you are more likely to beat the bias:\n\n• Make it a habit to actively look for reasons why your pick might lose. Ask yourself questions.\n• Write down every bet you make, why you placed it, and the outcome. Over time, this journal will reveal patterns where confirmation bias has influenced your decisions.\n• Don't rely on one expert, one website, or social media hype. Check multiple sources, including stats websites, expert analysis, and historical performance data.\n• Numbers don't lie. Use head-to-head stats, player performance trends, injuries, and other objective data when making decisions.\n• Force yourself to argue against your pick. Imagine every reason your bet could lose.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "Confirmation bias is like an invisible opponent in sports betting. It doesn't talk, but it quietly guides your decisions, often toward mistakes. By learning to recognise it, seeking contradictory evidence, and relying on data rather than emotions, you can make smarter, more profitable bets.\n\nBetting is not just about luck; it's about mental discipline, clear analysis, and honesty with yourself. The better you get at spotting confirmation bias, the sharper your decisions will become. Keep your research solid, question your assumptions, and let facts, not feelings, guide your bets.\n\nWith this approach, you'll increase your chances of long-term success while keeping your losses under control.",
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
        question: "What is confirmation bias in betting?",
        answer: "A cognitive bias where bettors selectively focus on information that supports their pre-existing beliefs about a team or outcome, while ignoring data that contradicts them."
      },
      {
        question: "What is an example of confirmation bias in sports?",
        answer: "Focusing only on a star player's recent goals while ignoring that the team's defense is missing key players due to injury."
      },
      {
        question: "How to identify confirmation bias?",
        answer: "Ask yourself if you are only looking for reasons to support your bet, or if you are genuinely considering reasons why you might lose."
      },
      {
        question: "How to defeat confirmation bias?",
        answer: "Actively look for 'disconfirming' evidence, keep a betting journal, and use objective data from multiple independent sources."
      },
      {
        question: "How to balance confirmation bias?",
        answer: "Balance it by playing 'Devil's Advocate' against your own picks and setting strict, data-driven criteria for every wager."
      }
    ]
  }
];

export default function ConfirmationBiasPage() {
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
          <span className="text-brand-emerald uppercase">CONFIRMATION BIAS</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Confirmation <span className="text-brand-emerald">Bias</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "In sports betting, the thrill of predicting outcomes can sometimes cloud your judgment. Confirmation bias is one intellectual trap that can affect you."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Confirmation bias makes you focus on information that supports your existing beliefs while ignoring evidence that goes against them. Recognising this bias and learning how to manage it is key to making smarter and better decisions. This OddinsOdds Academy guide will help you understand how it works.
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
