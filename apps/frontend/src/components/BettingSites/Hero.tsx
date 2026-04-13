'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] bg-white border border-slate-100 shadow-sm mb-12">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="flex-1 p-8 lg:p-14 z-10">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-[1.1]">
            Top Online Betting Sites | Safe & Licensed Bookmakers (2026)
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">
            Discover the best online betting sites with OddinsOdds. Compare licensed bookmakers offering competitive odds, secure payments, and exceptional customer support.
          </p>
        </div>
        
        <div className="relative flex-1 w-full h-[300px] lg:h-[400px]">
          <div className="absolute inset-0 z-0">
             <Image 
                src="/images/betting-hero-bg.png" 
                alt="Betting Hero" 
                fill 
                className="object-cover"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent lg:block hidden"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent lg:hidden block"></div>
          </div>
          
          {/* Floating decorative elements to enhance the premium look */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-brand-emerald/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
      </div>
    </section>
  );
}
