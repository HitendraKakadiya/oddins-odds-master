'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface LeagueFAQProps {
  leagueName: string;
  faqs: FAQItem[];
}

export default function LeagueFAQ({ leagueName, faqs }: LeagueFAQProps) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 mb-12">
      <h2 className="text-3xl font-black text-brand-dark-blue mb-10 tracking-tight">
        FAQs about {leagueName}
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`border rounded-[32px] transition-all duration-300 ${
        isOpen ? 'bg-brand-indigo/5 border-brand-indigo/20 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-sm md:text-base font-black transition-colors ${
          isOpen ? 'text-brand-indigo' : 'text-slate-800 group-hover:text-brand-indigo'
        }`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
           isOpen ? 'bg-brand-indigo text-white rotate-180' : 'bg-slate-50 text-slate-400'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
         isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-8 pb-8 pt-2">
          <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
