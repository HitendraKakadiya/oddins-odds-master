import React from 'react';

export default function InsightHero() {
  return (
    <div className="flex flex-col mb-10">
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 bg-white/50 self-start px-5 py-2.5 rounded-full border border-slate-100 shadow-sm backdrop-blur-sm">
        <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full animate-pulse"></span>
        <span>Match Insights</span>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
        Match Insights for <br className="hidden md:block" /> 
        <span className="text-brand-emerald">Football Betting</span> Predictions
      </h1>
      
      <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
        Check the hot trends for the most exciting football matches today. Our statistical analysis helps you make smarter betting decisions with data-driven insights.
      </p>
    </div>
  );
}
