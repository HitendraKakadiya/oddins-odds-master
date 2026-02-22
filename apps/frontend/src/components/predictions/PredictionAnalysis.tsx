'use client';

import Link from 'next/link';
import type { MatchData, Prediction } from '@/lib/api/types';

interface PredictionAnalysisProps {
  match: MatchData;
  predictions: Prediction[];
}

export default function PredictionAnalysis({ match, predictions }: PredictionAnalysisProps) {
  const date = new Date(match.kickoffAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit'
  });

  return (
    <div className="flex flex-col gap-8">
       {/* Page Heading & Breadcrumb */}
       <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner">
             <Link href="/" className="hover:text-brand-indigo transition-colors font-black">Home</Link>
             <span className="text-slate-200">/</span>
             <Link href="/predictions" className="hover:text-brand-indigo transition-colors font-black">Predictions</Link>
             <span className="text-slate-200">/</span>
             <span className="text-brand-indigo font-black">{match.league.name}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-brand-dark-blue mb-8 leading-tight tracking-tight">
             {match.homeTeam.name} vs {match.awayTeam.name} | Prediction | {match.league.name} | {date}
          </h1>

          <div className="prose prose-slate max-w-none text-slate-600 mb-12">
             <p className="text-lg leading-relaxed">
                The kick off for the match between <strong>{match.homeTeam.name} and {match.awayTeam.name}</strong> will take place at <strong>{new Date(match.kickoffAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })} (UK time)</strong> - 
                <strong> {new Date(match.kickoffAt).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit' })}</strong> - at the <strong>{ (match as any).venue || 'Stadium'}</strong>. This clash of the 2025/26 {match.league.name} looks very promising!
             </p>
             <p className="text-lg leading-relaxed">
                Before placing your bets on this match, check out the full analysis, including predictions for {match.homeTeam.name} vs {match.awayTeam.name}. We also highlight the most interesting odds and markets with a high chance of winning. Providing today&apos;s best free tip to help you make informed and profitable betting decisions.
             </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-brand-dark-blue mb-8">
             APWin predictions for {match.homeTeam.name} vs {match.awayTeam.name}
          </h2>

          <div className="space-y-6">
             {predictions.map((pred, index) => (
                <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-brand-indigo/20 transition-all duration-300">
                   <div className="absolute top-0 left-0 w-2 h-full bg-brand-pink opacity-80"></div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                         <span className="text-2xl">👉</span>
                         <h3 className="text-xl md:text-2xl font-black text-slate-800">Our prediction is: {pred.selection || pred.title}</h3>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed pl-10">
                         {pred.shortReason || "Expert analysis for this selection based on recent form, head-to-head statistics, and tactical considerations. Both teams have shown specific patterns that make this market particularly attractive for today's match."}
                      </p>
                      {pred.confidence && (
                        <div className="mt-4 pl-10 flex items-center gap-2">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Confidence:</span>
                           <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                 <div key={i} className={`w-3 h-3 rounded-full ${i < (pred.confidence || 0) / 20 ? 'bg-brand-pink' : 'bg-slate-100'}`}></div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
