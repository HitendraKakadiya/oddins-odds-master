'use client';

import { useState } from 'react';
import MatchTabs from './MatchTabs';
import MatchStatsOverview from './MatchStatsOverview';
import TeamComparison from './TeamComparison';
import MarketProbabilities from './MarketProbabilities';
import MatchAnalysis from './MatchAnalysis';
import type { MatchDetailResponse, H2HMatch } from '@/lib/api/types';

interface MatchContentProps {
  matchData: MatchDetailResponse;
}

export default function MatchContent({ matchData }: MatchContentProps) {
  const [activeTab, setActiveTab] = useState('statistics');
  const { match, h2h } = matchData;

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return (
          <>
            <MatchStatsOverview />
            <TeamComparison match={match} />
            <MarketProbabilities match={match} />
            <MatchAnalysis match={match} />
          </>
        );
      case 'h2h':
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-10">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
               <h3 className="text-xl font-black text-slate-800">Head to Head History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="text-left py-4 px-8">Date</th>
                    <th className="text-left py-4 px-8">Competition</th>
                    <th className="text-right py-4 px-4">Home</th>
                    <th className="text-center py-4 px-4">Score</th>
                    <th className="text-left py-4 px-4">Away</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {h2h && h2h.length > 0 ? (
                    h2h.map((m: H2HMatch, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-8 text-xs font-bold text-slate-400">
                          {new Date(m.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-4 px-8 text-xs font-black text-slate-600">
                          {m.competition}
                        </td>
                        <td className="py-4 px-4 text-xs font-black text-slate-800 text-right">
                          {m.homeTeam}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-900">
                            {m.homeScore} - {m.awayScore}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs font-black text-slate-800 text-left">
                          {m.awayTeam}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                        No head to head data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-12 text-center mb-10">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <span className="text-2xl">📈</span>
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-2">Detailed Form analysis</h3>
             <p className="text-slate-400 font-bold max-w-md mx-auto">This section will contain detailed match-by-match form breakdown for both teams.</p>
          </div>
        );
      case 'standings':
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-12 text-center mb-10">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <span className="text-2xl">🏆</span>
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-2">League Standings</h3>
             <p className="text-slate-400 font-bold max-w-md mx-auto">The current league table for {match.league.name} will be displayed here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </>
  );
}
