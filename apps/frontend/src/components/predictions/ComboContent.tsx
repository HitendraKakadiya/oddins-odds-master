'use client';

import React from 'react';

export default function ComboContent() {
    return (
        <div className="space-y-20 py-20 border-t border-slate-100 mt-20">
            <section>
                <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Understanding Expert Combo Betting</h2>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-[1.8] space-y-6">
                    <p>
                        An expert combo bet, often referred to as an &quot;acca,&quot; combines multiple individual selections into a single wager. Each selection, or &quot;leg,&quot; must win for the combo to be successful. At OddinsOdds, we hand-curate these picks to find the perfect balance between risk and reward.
                    </p>
                    <p>
                        The appeal of combo bets comes from the power of compounding. Since each added leg multiplies the total odds, the potential payouts can be significantly higher than individual bets. However, remember the golden rule: if just one leg fails, the entire combo is lost.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 rounded-[40px] p-10 md:p-16 border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-10">The Power of Choice: Multiple Bets</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-slate-600 font-medium leading-relaxed">
                            A combo consists of two or more individual bets, each known as a &quot;leg.&quot; The odds are calculated by multiplying the odds of each leg together. This results in higher potential payouts compared to placing individual bets.
                        </p>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Odds Calculation</div>
                            <div className="text-xl font-mono font-bold text-slate-800">2.00 × 3.00 × 1.50 = <span className="text-brand-pink">9.00</span></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-brand-midnight text-white p-8 rounded-3xl">
                            <h4 className="font-black mb-4 flex items-center gap-2">
                                <span className="text-brand-emerald">●</span> High Reward Nature
                            </h4>
                            <p className="text-white/60 text-sm leading-relaxed">
                                To win a combo, all selected legs must be successful. If one leg loses, the entire bet is lost. This high-reward nature is what makes combos appealing to strategy-driven bettors.
                            </p>
                        </div>
                        <p className="text-xs text-slate-400 italic px-4">
                            Note: If a leg is voided, those odds are removed from the total and the payout is recalculated based on remaining events.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-black text-slate-900 mb-12">Expert Combo Examples</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-slate-100 p-8 rounded-3xl hover:border-brand-emerald/30 transition-all group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-emerald/10 transition-colors">
                            <span className="text-xl">🏆</span>
                        </div>
                        <h4 className="font-black text-slate-900 mb-2">The Two-Fold</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">The simplest form. Combine two highly confident selections for a professional boost.</p>
                    </div>
                    <div className="border border-slate-100 p-8 rounded-3xl hover:border-brand-emerald/30 transition-all group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-emerald/10 transition-colors">
                            <span className="text-xl">🔥</span>
                        </div>
                        <h4 className="font-black text-slate-900 mb-2">The Multi-Tier</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Three to four selections. This provides the &quot;sweet spot&quot; for value and risk management.</p>
                    </div>
                    <div className="border border-slate-100 p-8 rounded-3xl hover:border-brand-emerald/30 transition-all group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-emerald/10 transition-colors">
                            <span className="text-xl">⚡</span>
                        </div>
                        <h4 className="font-black text-slate-900 mb-2">The Value Mix</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Combining different markets like Goals, Corners, and Winners for maximum flexibility.</p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-brand-midnight rounded-[48px] px-10 md:px-20 text-white relative overflow-hidden shadow-2xl shadow-brand-midnight/40">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-emerald/10 rounded-full -mr-64 -mt-64 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/5 rounded-full -ml-32 -mb-32 blur-[80px]"></div>
                
                <div className="max-w-2xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight tracking-tighter">
                        Step-by-Step Guide <br/> 
                        <span className="text-brand-emerald">to Placing Your Combo</span>
                    </h2>
                    <div className="space-y-8">
                        {[
                            "Choose one of our top-rated sportsbooks for the best odds.",
                            "Identify the high-confidence matches you're interested in.",
                            "Add your chosen expert picks directly to your bet slip.",
                            "Define your wager amount based on your bankroll strategy.",
                            "Confirm your selections and lock in your expert combo."
                        ].map((step, i) => (
                            <div key={i} className="flex gap-8 items-start group">
                                <span className="bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all group-hover:bg-brand-emerald group-hover:text-white shrink-0">
                                    {i+1}
                                </span>
                                <p className="text-white/80 font-medium text-lg leading-snug group-hover:text-white transition-colors">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
