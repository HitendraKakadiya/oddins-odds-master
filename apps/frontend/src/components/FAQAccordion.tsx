'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Where to find today's football matches?",
      answer: "You can find all of today's matches right here on our home page. We list fixtures from over 400 national and international competitions, updated in real-time."
    },
    {
      question: "How often are the scores updated?",
      answer: "Scores are updated in real-time as the matches are being played. You can see live scores, elapsed time, and final results as soon as they are confirmed."
    },
    {
      question: "What are the football matches today on TV?",
      answer: "Check our 'Today's Streams' section in the sidebar for information on where to watch matches live, including TV channels and streaming platforms."
    },
    {
      question: "Are there international football matches today?",
      answer: "Yes, we cover international matches including friendly games, qualifiers, and major tournaments like the World Cup, Euros, and Copa America."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:border-brand-indigo/30 transition-all shadow-sm group">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-7 text-left"
          >
            <span className="font-bold text-sm text-slate-800 group-hover:text-brand-indigo transition-colors">{faq.question}</span>
            <div className={`p-2 rounded-xl transition-all ${openIndex === index ? 'bg-brand-indigo text-white rotate-180 shadow-lg shadow-brand-indigo/20' : 'bg-slate-50 text-slate-300'}`}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {openIndex === index && (
            <div className="p-6 bg-slate-50/50 text-sm text-slate-500 border-t border-slate-100 leading-relaxed font-medium">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
