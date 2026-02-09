import Link from 'next/link';

export default function AcademyContent() {
  return (
    <div className="space-y-16 mb-16">
      {/* Strategies Section */}
      <section id="strategies" className="scroll-mt-24">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Strategies</h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm sm:text-base leading-relaxed">
            At the OddinsOdds Academy, you&apos;ll learn proven strategies that help you become a smarter and more 
            consistent bettor. It all starts with <span className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-200">bankroll management</span>, 
            where you&apos;re taught how to set betting limits, track your spending, and avoid emotional decisions.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            You&apos;ll also learn about <span className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-200">flat betting</span>, 
            a low-risk system where you stake the same amount on every bet, which is ideal for <span className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-200">maintaining discipline during losing streaks</span>.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            You&apos;ll also be guided through methods like hedging, which lets you cover multiple outcomes to 
            secure profit or reduce losses. Another vital approach is research and analysis, where you dive 
            deep into team stats, player form, injuries, and weather before placing a bet. You&apos;re not just betting 
            with your gut, as you&apos;re using information to gain an edge.
          </p>
          <p className="text-sm sm:text-base leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100 border-l-4 border-l-brand-indigo">
            If you&apos;re interested in a more mathematical edge, you&apos;ll be introduced to value betting and the <span className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-200">Kelly Criterion</span>, which are tools that help you spot overpriced odds and calculate optimal stake sizes.
          </p>
        </div>
      </section>

      {/* Bet Types Section */}
      <section id="bet-types" className="scroll-mt-24">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Bet Types</h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm sm:text-base leading-relaxed">
            Understanding bet types is key to building a solid betting foundation, and the OddinsOdds Academy 
            breaks them down in a way that&apos;s easy to apply. You&apos;ll start with the basics, like moneyline bets 
            where you simply back a team or player to win.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Next, you&apos;ll learn about point spread betting, where you back a team to win by a specific margin or 
            avoid losing by too much. This is useful in high-scoring sports like basketball or American football. 
            Then come the <Link href="/over-under" className="text-brand-indigo font-bold hover:underline">over-under bets</Link>, where your focus is on the combined score, not the match result.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            If you are an experienced bettor, the Academy explains parlay bets, where multiple selections are 
            combined into one wager for a higher payout but with more risk. You&apos;ll also explore futures bets, 
            which are perfect if you want to bet on outcomes like tournament winners or season performance early on.
          </p>
        </div>
      </section>
    </div>
  );
}
