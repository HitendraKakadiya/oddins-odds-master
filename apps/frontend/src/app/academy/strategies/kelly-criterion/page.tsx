'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import StrategyContentSection from '@/components/Academy/StrategyContentSection';
import StrategyTOC from '@/components/Academy/StrategyTOC';

const sections = [
  { 
    id: 'what-is-kelly-criterion', 
    title: 'What Is the Kelly Criterion?', 
    content: "John L. Kelly Jr. introduced the Kelly Criterion in 1956 as a mathematical formula for determining how much to invest in a specific asset to grow wealth over time. However, the concept soon found applications in sports betting and casino games.\n\nWhen applied to betting, the Kelly Criterion tells you how much of your bankroll you should stake if you have an edge. The main aim is to grow your money steadily over time while keeping the risk of losing it as low as possible.\n\nIn simple terms:\n\n• Kelly tells you the exact amount for each bet to maximise long-term growth.\n• It prevents you from betting too much and going broke.\n• It also stops you from betting too little and missing out on potential growth.\n\nLike many betting strategies, the Kelly Criterion is not foolproof. The calculation is extremely sensitive to your input probability. As a result, overestimating your edge can lead to losses.",
    advantages: [],
    risks: []
  },
  { 
    id: 'the-formula', 
    title: 'The Kelly Criterion Formula', 
    content: "The Kelly Criterion formula finds the sweet spot between risk and reward. When you overbet, you are at risk of losing your entire bankroll. At the same time, a stake that is too low will limit your bankroll growth.\n\nWith this formula, you can achieve an exponential increase in your bankroll over time, provided you get your estimates right. The formula for Kelly Criterion is:\n\n**f* = p - (q / b)**\n\nWhere:\n\n• **f*** = fraction of your bankroll to bet (Kelly percentage)\n• **p** = probability of winning (your estimate)\n• **q** = probability of losing = 1 - p\n• **b** = \"to-1\" odds (how much profit per unit stake, e.g., 2.0 odds = 1.0b)",
    advantages: [],
    risks: []
  },
  { 
    id: 'step-by-step', 
    title: 'How to Calculate the Kelly Criterion Step-by-Step?', 
    content: "Understanding the formula is one thing, but applying it correctly is an entirely different matter. We have broken down the process using easy-to-understand examples.\n\n**Example: Palmeiras (3.10) vs. Flamengo (1.85)**\nFor this bet option, we are backing Flamengo (1.85) to win due to their recent form. Here is how we use the formula:\n\n**Step 1: Convert Odds to profit per unit stake (b)**\nCalculate the unit per stake: b = 1.85 - 1 = **0.85**\n\n**Step 2: Estimate Probability of Winning (p)**\nDetermine the winning chances based on your research. For this example, we estimate Flamengo has a 65% chance: p = 65% / 100 = **0.65**\n\n**Step 3: Calculate Probability of Losing (q)**\nq = 1 - p = 1 - 0.65 = **0.35**\n\n**Step 4: Apply the formula**\nf* = 0.65 - (0.35 / 0.85)\nf* = 0.65 - 0.412\nf* ≈ 0.239 -> **23.9%**\n\nWith a bankroll of $1,000, a **Full Kelly** bet would be **$239**.",
    advantages: [],
    risks: []
  },
  { 
    id: 'calculator', 
    title: 'Kelly Criterion Calculator', 
    content: "There are two significant ways to calculate the Kelly Criterion. The most traditional way is to use the step-by-step example above and do it manually. On the flip side, you can also use online calculators to save time and reduce mistakes.\n\nMost calculators ask for:\n• Your estimated win probability (p)\n• The decimal odds (converted to b)\n• Whether you want full, half, or quarter Kelly\n\n**Tip:** The calculator is only as good as your 'p' estimate. If you overestimate your edge, you may still lose money despite using the formula.",
    advantages: [],
    risks: []
  },
  { 
    id: 'applying-kelly', 
    title: 'Applying the Kelly Criterion in Betting', 
    content: "Applying the Kelly Criterion means matching your analysis with the right level of risk. Let's look at more examples:\n\n**Example 1: Boca Juniors (2.80) vs River Plate (2.00)**\nYou estimate Boca (2.80 odds) has a 50% chance of winning.\n• b = 1.80\n• p = 0.50, q = 0.50\n• f* = 0.50 - (0.50 / 1.80) ≈ 0.223 -> **22.3%**\nFor a $2,000 bankroll: Full Kelly = $446, Half Kelly = $223.\n\n**Example 2: Club Brugge (2.50) vs Anderlecht (1.65)**\nYou estimate Brugge (2.50 odds) has a 55% chance.\n• b = 1.50\n• p = 0.55, q = 0.45\n• f* = 0.55 - (0.45 / 1.50) = 0.25 -> **25% stake**\nFor a $1,000 bankroll: Full Kelly = $250, Half Kelly = $125.",
    advantages: [],
    risks: []
  },
  { 
    id: 'fractional-kelly', 
    title: 'Why to Use Fractional Kelly?', 
    content: "Full Kelly provides the potential for huge payouts but comes with high volatility. That's why fractional Kelly (e.g., half-Kelly or quarter-Kelly) is usually better for sustainable growth.\n\n**Benefits of Fractional Kelly:**\n\n• **Reduces drawdowns**: Helps control your bankroll better during bad streaks.\n• **Margin for error**: Compensates for overly optimistic probability estimates.\n• **Emotional Stability**: Smaller bet sizes are easier to handle mentally during losing streaks.",
    advantages: [],
    risks: []
  },
  { 
    id: 'tips', 
    title: 'Tips For Using the Kelly Criterion for Sports Betting', 
    content: "To get the most out of the Kelly Criterion, follow these expert tips:\n\n1. **Build a reliable model**: Don't guess. Use stats, injuries, and form to derive your 'p' value.\n2. **Avoid Full Kelly**: Unless you have perfect information, half or quarter Kelly is safer.\n3. **Diversify**: Avoid putting too much on a single match even if the formula suggests so.\n4. **Update Bankroll**: Recalculate your stake after every bet based on your current total.\n5. **Be Honest**: The formula works only if your winning probability estimate is accurate.",
    advantages: [],
    risks: []
  },
  { 
    id: 'pros-cons', 
    title: 'Pros and Cons of Using the Kelly Criterion', 
    content: "Like any system, Kelly has its trade-offs. It is widely considered the gold standard for bankroll management, but it requires a high level of discipline and accuracy to be effective.",
    advantages: [],
    risks: []
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    content: "The Kelly Criterion is more than just a betting formula; it is a philosophy of risk management. By balancing your edge with the size of your bankroll, you can navigate the volatile waters of sports betting with more confidence and logic. While it's not a shortcut to riches, it is one of the most powerful tools in a professional bettor's arsenal.\n\nStart small, perhaps with a Quarter Kelly, and refine your probability estimation skills. Over time, the math will work in your favor as long as you maintain accuracy and discipline.",
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
        question: "Is Kelly Criterion better than Flat Betting?",
        answer: "Kelly is more aggressive and can grow a bankroll faster, but Flat Betting is much safer for beginners as it doesn't require precise probability estimates."
      },
      {
        question: "What happens if the calculation is negative?",
        answer: "If f* is negative, it means you have no edge over the bookmaker and should avoid the bet entirely."
      },
      {
        question: "Can I use Kelly for Parlays?",
        answer: "Yes, but be careful. Probability estimates for multi-leg bets are even more sensitive and prone to error."
      },
      {
        question: "How often should I update my bankroll size?",
        answer: "Ideally, after every bet. The Kelly Criterion is dynamic, so your next stake should be based on your current total bankroll, win or lose."
      }
    ]
  }
];

export default function KellyCriterionPage() {
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
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-100">
        <div 
          className="h-full bg-brand-emerald transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-emerald transition-colors">HOME</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy" className="hover:text-brand-emerald transition-colors uppercase">ACADEMY</Link>
          <span className="text-slate-300">/</span>
          <Link href="/academy/strategies" className="hover:text-brand-emerald transition-colors uppercase">STRATEGIES</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-emerald uppercase">KELLY CRITERION STRATEGY</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <header className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Kelly Criterion <span className="text-brand-emerald">Strategy</span>
              </h1>
              
              <div className="bg-white rounded-[40px] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6 italic">
                    "Making the most of your betting money is important if you want to win more often and build your winnings steadily. The Kelly Criterion is a method that can help you do this."
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    This OddinsOdds Academy guide explains the betting concept using simple examples. We also reveal how the Kelly calculator works, how to use Kelly Criterion in betting, and common mistakes to avoid.
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
