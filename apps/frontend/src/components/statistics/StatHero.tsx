import React from 'react';

interface StatHeroProps {
  title: string;
  description: string;
}

export default function StatHero({ title, description }: StatHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl mb-8">
      {/* Background with patterns/overlays */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-slate-900/80"></div>
      
      {/* Animated accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-emerald/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>

      <div className="relative z-10 p-8 lg:p-14">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-lg lg:text-xl text-slate-300 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Visual bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-emerald via-brand-emerald/50 to-transparent"></div>
    </div>
  );
}
