import { useState } from 'react';

interface StrategyContentSectionProps {
  id: string;
  title: string;
  content: string;
  advantages: string[];
  risks?: string[];
  isActive?: boolean;
  variant?: 'premium' | 'simple';
  faqs?: { question: string; answer: string }[];
}

export default function StrategyContentSection({ 
  id, 
  title, 
  content, 
  advantages, 
  risks = [], 
  isActive,
  variant = 'premium',
  faqs = []
}: StrategyContentSectionProps) {
  const isSimple = variant === 'simple';
  const isFAQs = id === 'faqs' && faqs.length > 0;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (isFAQs) {
    return (
      <section id={id} className="pt-8 mb-16 scroll-mt-24">
        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{title}</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-8 py-6 flex items-center justify-between group"
              >
                <span className="text-lg font-bold text-slate-900 group-hover:text-brand-emerald transition-colors">{faq.question}</span>
                <svg 
                  className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      id={id} 
      className={`relative transition-all duration-700 scroll-mt-24 ${
        isSimple 
          ? 'p-0 py-8 bg-transparent' 
          : `p-8 sm:p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl hover:shadow-slate-200/50 ${
              isActive ? 'ring-2 ring-brand-emerald shadow-brand-emerald/10 scale-[1.02]' : 'opacity-80 scale-100 grayscale-[0.2]'
            }`
      }`}
    >
      <div className="relative z-10">
        <h2 className={`${
          isSimple ? 'text-3xl font-black text-slate-900 mb-8' : 'text-2xl sm:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3'
        } tracking-tight`}>
          {!isSimple && <span className="w-2 h-8 bg-brand-emerald rounded-full"></span>}
          {title}
        </h2>
        
        <div className="text-slate-700 leading-relaxed text-lg mb-8 whitespace-pre-line">
          <p>{content}</p>
        </div>

        {(advantages.length > 0 || risks.length > 0) && (
          <div className={`${isSimple ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start'}`}>
            {advantages.length > 0 && (
              <div className={`${isSimple ? '' : 'bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50'}`}>
                <h3 className={`${
                  isSimple ? 'text-lg font-bold text-slate-900 mb-4' : 'text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2'
                }`}>
                  {!isSimple && <span className="w-4 h-4 bg-emerald-500 rounded-lg flex items-center justify-center text-[10px] text-white">✓</span>}
                  Advantages:
                </h3>
                <ul className="space-y-3">
                  {advantages.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className={`shrink-0 mt-1.5 ${isSimple ? 'w-1 h-1 rounded-full bg-slate-900' : 'w-1.5 h-1.5 rounded-full bg-emerald-300'}`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {risks.length > 0 && (
              <div className={`${isSimple ? '' : 'bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50'}`}>
                <h3 className={`${
                  isSimple ? 'text-lg font-bold text-slate-900 mb-4' : 'text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2'
                }`}>
                  {!isSimple && <span className="w-4 h-4 bg-amber-500 rounded-lg flex items-center justify-center text-[10px] text-white">!</span>}
                  Important Risks
                </h3>
                <ul className="space-y-3">
                  {risks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className={`shrink-0 mt-1.5 ${isSimple ? 'w-1 h-1 rounded-full bg-slate-900' : 'w-1.5 h-1.5 rounded-full bg-amber-300'}`}></span>
                        {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>

      {!isSimple && (
        <>
          {/* Decorative blurry circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </>
      )}
    </section>
  );
}
