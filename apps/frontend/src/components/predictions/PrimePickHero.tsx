'use client';

import React, { useState } from 'react';
import { Prediction } from '@/lib/api/types';
import PrimePickCard from './PrimePickCard';

interface PrimePickHeroProps {
    tips: Prediction[];
}

export default function PrimePickHero({ tips }: PrimePickHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % tips.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);

    if (tips.length === 0) return null;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <section className="relative overflow-hidden pt-8 pb-16">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-brand-emerald/5 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-pink/5 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 text-center">
                {/* Pre-title Badge */}
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Daily Handpicked Feature</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter leading-[1.1]">
                    Prime Betting Pick
                </h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-12">
                    <p className="text-base md:text-xl font-bold text-slate-400">The Best Expert Prediction for</p>
                    <div className="bg-brand-emerald text-white px-4 py-1 rounded-xl text-base md:text-lg font-black shadow-lg shadow-brand-emerald/20 rotate-1 md:-rotate-1">
                        {today}
                    </div>
                </div>

                <p className="text-sm md:text-base text-slate-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed border-t border-slate-50 pt-8 mt-[-1rem]">
                    Every day, our top analysts dive deep into the stats to bring you one single, high-probability betting pick.
                </p>

                {/* Carousel Container */}
                <div className="relative max-w-xl mx-auto">
                    {/* Carousel Navigation - Desktop Side Buttons */}
                    <div className="absolute top-1/2 -left-16 -translate-y-1/2 hidden lg:block">
                        <button 
                            onClick={prev}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50 hover:bg-slate-50 transition-all text-slate-300 hover:text-brand-emerald active:scale-90"
                        >
                            <svg className="w-5 h-5 ml-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="absolute top-1/2 -right-16 -translate-y-1/2 hidden lg:block">
                        <button 
                            onClick={next}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50 hover:bg-slate-50 transition-all text-slate-300 hover:text-brand-emerald active:scale-90"
                        >
                            <svg className="w-5 h-5 mr-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Active Card Container */}
                    <div className="bg-brand-emerald rounded-[40px] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                        {/* Subtle Glow Effect */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-pink/10 rounded-full blur-[80px] pointer-events-none"></div>

                        {/* Title Header inside purple box */}
                        <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
                             <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                 <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                 </svg>
                             </div>
                             <span className="text-white/90 font-bold text-[10px] tracking-widest uppercase">PRIME PREDICTION</span>
                        </div>

                        <div className="transition-all duration-500 ease-in-out transform relative z-10 px-2">
                            <PrimePickCard tip={tips[currentIndex]} />
                        </div>

                        {/* Navigation Dots & Info */}
                        <div className="mt-8 flex flex-col items-center gap-3 relative z-10">
                            <span className="text-white/40 text-[9px] font-black tracking-[0.2em] uppercase">
                                {currentIndex + 1} / {tips.length} TOP PICKS
                            </span>
                            <div className="flex items-center gap-2">
                                {tips.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-1.5 transition-all rounded-full ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Mobile Navigation Arrows */}
                        <div className="flex items-center justify-between w-full absolute top-1/2 left-0 -translate-y-1/2 px-3 lg:hidden pointer-events-none z-20">
                             <button 
                                onClick={prev}
                                className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto active:scale-75 transition-transform"
                            >
                                <svg className="w-5 h-5 ml-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={next}
                                className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto active:scale-75 transition-transform"
                            >
                                <svg className="w-5 h-5 mr-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
