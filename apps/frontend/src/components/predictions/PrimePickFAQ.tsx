'use client';

import React, { useState } from 'react';

const FAQ_ITEMS = [
    {
        q: "How do I know if a tip is really a safe bet today?",
        a: "While no bet is 100% guaranteed, our Prime Picks are chosen based on high-probability outcomes derived from historical data, team form, and injury reports. We look for 'value bets' where the probability of winning is higher than what the bookmakers' odds suggest."
    },
    {
        q: "Do you guarantee profit with today's recommended bet?",
        a: "We do not guarantee profit. Betting always involves risk. Our goal is to provide you with the most informed and statistically sound tip possible to help you make smarter betting decisions over the long term."
    },
    {
        q: "What exactly is a value bet?",
        a: "A value bet occurs when you believe the chance of a certain outcome is higher than the chance reflected in the bookmaker's odds. If our analysis says a team has a 60% chance to win, but the odds only imply a 50% chance, that's where the value lies."
    },
    {
        q: "Can I use the best tip of the day in a parlay?",
        a: "Yes, many of our users include the Daily Prime Pick as the 'anchor' of their parlays (combos). Because it's our most confident pick, it's often used to boost the overall potential return of a multi-bet ticket."
    },
    {
        q: "Is there a strategy to follow today's accurate tip?",
        a: "Consistency is key. We recommend using a unit-based staking plan (e.g., betting 1-2% of your bankroll on each Prime Pick). This helps protect your capital during inevitable losing streaks and maximizes gains during winning ones."
    }
];

export default function PrimePickFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="pt-10 pb-10 bg-slate-50 border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Common Questions About Our Prime Picks</h2>
                    <p className="text-slate-500 font-medium">Clear answers to help you bet smarter and with more confidence.</p>
                </div>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-bold text-slate-800 text-[15px]">{item.q}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? 'bg-brand-emerald text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
