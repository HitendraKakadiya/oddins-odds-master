'use client';

import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ_ITEMS = [
    {
        q: "What is the best expert combo for today?",
        a: "Our best combo is featured at the top of this page. It is hand-selected by our senior analysts based on market value, team news, and technical data integration."
    },
    {
        q: "How do I calculate total odds for a combo?",
        a: "Simply multiply the decimal odds of each individual selection. For example, three legs at 2.00 each would result in total odds of 8.00 (2 x 2 x 2)."
    },
    {
        q: "Is a two-fold better than a four-fold?",
        a: "It depends on your risk tolerance. A two-fold has a much higher win probability but lower return, while a four-fold offers massive returns but requires more precision."
    },
    {
        q: "What happens if one match is cancelled?",
        a: "If a match in your combo is cancelled or voided, that specific leg is removed. Your bet remains active, and the total odds are recalculated based on the remaining legs."
    }
];

export default function ComboFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Expert Combo FAQs</h2>
                    <p className="text-slate-500 font-medium">Master the art of multiple betting with our expert insights.</p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                    {FAQ_ITEMS.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden transition-all hover:border-brand-emerald/20">
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-bold text-slate-800 text-base">{item.q}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? 'bg-brand-emerald text-white rotate-180' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                    <FiChevronDown className="w-5 h-5" />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-slate-500 font-medium text-sm leading-relaxed border-t border-white">
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
