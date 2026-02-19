'use client';

import { useState } from 'react';
import type { MatchDetailResponse } from '@/lib/api/types';
import MatchTabs from './MatchTabs';
import MatchStatsOverview from './MatchStatsOverview';
import TeamComparison from './TeamComparison';
import MarketProbabilities from './MarketProbabilities';
import MatchAnalysis from './MatchAnalysis';
import TeamForm from './TeamForm';
import HeadToHead from './HeadToHead';
import Standings from './Standings';

export default function MatchContent({ matchData }: { matchData: MatchDetailResponse }) {
  const [activeTab, setActiveTab] = useState('Statistics');
  const { match, h2h, stats, predictions, h2hSummary, standings } = matchData;

  const renderContent = () => {
    switch (activeTab) {
      case 'Statistics':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MatchStatsOverview stats={stats?.league} />
            <TeamComparison 
              match={match} 
              homeStats={stats?.home} 
              awayStats={stats?.away}
              homeStatsSource={stats?.homeStatsSource}
              awayStatsSource={stats?.awayStatsSource}
            />
            <MarketProbabilities 
              match={match} 
              predictions={predictions} 
              homeStats={stats?.home} 
              awayStats={stats?.away} 
              leagueStats={stats?.league}
            />
          </div>
        );
      case 'Form':
        if (!stats?.home || !stats?.away) return null;
        return (
          <TeamForm 
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeStats={stats.home}
            awayStats={stats.away}
          />
        );
      case 'Head to Head':
        if (!h2h || !h2hSummary) return null;
        return (
          <HeadToHead 
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            h2h={h2h}
            h2hSummary={h2hSummary}
          />
        );
      case 'Standings':
        if (!standings) return null;
        return <Standings standings={standings} />;
      default:
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl grayscale opacity-50">📊</span>
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-2">{activeTab} details coming soon</h3>
             <p className="text-slate-400 font-bold max-w-xs mx-auto">We're currently processing more statistical data for this league.</p>
          </div>
        );
    }
  };

  return (
    <div className="mt-12 md:mt-16">
      <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
      <MatchAnalysis match={match} stats={stats} />
    </div>
  );
}
