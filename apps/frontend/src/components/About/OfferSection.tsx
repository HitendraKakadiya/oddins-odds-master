'use client';

import Link from 'next/link';

export default function OfferSection() {
  const offers = [
    {
      title: 'Top Online Betting Sites | Safe & Licensed Bookmakers (2026)',
      description: 'Discover the best online betting sites with OddinsOdds. Compare licensed bookmakers offering competitive odds and exclusive bonuses.',
      link: '/betting-sites',
      linkText: 'View All',
      gradient: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
      icon: (
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      ),
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
    },
    {
      title: 'OddinsOdds Academy',
      description: 'Access the OddinsOdds Academy to learn everything about sports betting, from basics to advanced strategies. You\'ll find guides, tips and more.',
      link: '/academy',
      linkText: 'View All',
      gradient: 'from-[#4C1D95] via-[#7C3AED] to-[#DB2777]',
      icon: (
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <svg className="w-full h-full text-white/90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      ),
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(219,39,119,0.3)]'
    }
  ];

  return (
    <section className="mt-12 mb-0">
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 px-0">What does OddinsOdds offer?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {offers.map((offer, idx) => (
          <Link 
            key={idx} 
            href={offer.link}
            className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col ${offer.glowColor}`}
          >
            <div className={`h-48 sm:h-56 bg-gradient-to-br ${offer.gradient} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className="z-10 transform group-hover:scale-110 transition-transform duration-500">
                {offer.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <h3 className="text-xl sm:text-2xl font-black text-brand-indigo mb-3 group-hover:text-brand-pink transition-colors line-clamp-2 leading-tight">
                {offer.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3 leading-relaxed font-medium">
                {offer.description}
              </p>
              <div className="mt-auto flex items-center font-bold text-brand-pink group-hover:gap-2 transition-all">
                <span>{offer.linkText}</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7M3 12h18" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
