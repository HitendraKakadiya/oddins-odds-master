'use client';

import type { MatchData } from '@/lib/api/types';

interface MarketCardProps {
  label: string;
  homeProb: string | number;
  awayProb: string | number;
  average: string | number;
  homeLogo?: string | null;
  awayLogo?: string | null;
}

function MarketCard({ label, homeProb, awayProb, average, homeLogo, awayLogo }: MarketCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-brand-indigo py-3 text-center">
        <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col items-center gap-1.5">
           <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
              {homeLogo ? <img src={homeLogo} alt="" className="w-full h-full object-contain" /> : <span className="text-xs">⚽</span>}
           </div>
           <span className="text-[10px] font-bold text-slate-400">{homeProb}</span>
        </div>

        <div className="flex flex-col items-center">
           <span className="text-xl font-black text-emerald-500">{average}</span>
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Average</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
           <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
              {awayLogo ? <img src={awayLogo} alt="" className="w-full h-full object-contain" /> : <span className="text-xs">⚽</span>}
           </div>
           <span className="text-[10px] font-bold text-slate-400">{awayProb}</span>
        </div>
      </div>
    </div>
  );
}

export default function MarketProbabilities({ match }: { match: MatchData }) {
  const markets = [
    { label: 'Over 0.5+', homeProb: '03%', awayProb: '100%', average: '97%' },
    { label: 'Over 1.5+', homeProb: '85%', awayProb: '100%', average: '93%' },
    { label: 'Over 2.5+', homeProb: '63%', awayProb: '84%', average: '74%' },
    { label: 'Over 3.5+', homeProb: '33%', awayProb: '60%', average: '47%' },
    { label: 'Over 4.5+', homeProb: '19%', awayProb: '52%', average: '36%' },
    { label: 'Over 5.5+', homeProb: '7%', awayProb: '28%', average: '18%' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {markets.map((market, idx) => (
        <MarketCard 
          key={idx} 
          {...market} 
          homeLogo={match.homeTeam.logoUrl} 
          awayLogo={match.awayTeam.logoUrl} 
        />
      ))}
    </div>
  );
}
