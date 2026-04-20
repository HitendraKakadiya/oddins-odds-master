'use client';

import { useState } from 'react';
import LeagueStandingsTable from '@/components/leagues/LeagueStandingsTable';
import LeagueStatsAnalysis from '@/components/leagues/LeagueStatsAnalysis';
import LeagueMatchList from '@/components/leagues/LeagueMatchList';
import LeagueFAQ from '@/components/leagues/LeagueFAQ';
import LeagueMatches from '@/components/leagues/LeagueMatches';
import LeagueCornersTable from '@/components/leagues/LeagueCornersTable';
import { LeagueDetailResponse } from '@/lib/api/types';

interface LeagueTabsClientProps {
  data: LeagueDetailResponse;
}

export default function LeagueTabsClient({ data }: LeagueTabsClientProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'matches' | 'stats' | 'corners'>('summary');

  return (
    <>
      {/* Tabs Content Navigation */}
      <div className="flex items-center gap-8 border-b border-slate-100 mb-8 px-4 overflow-x-auto scrollbar-hide">
        <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} label="Summary" />
        <TabButton active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} label="Matches" />
        <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="Stats" />
        <TabButton active={activeTab === 'corners'} onClick={() => setActiveTab('corners')} label="Corners" />
      </div>

      {activeTab === 'summary' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LeagueStandingsTable standings={data.standings} />
          <LeagueStatsAnalysis 
            leagueName={data.league.name} 
            season={data.season?.year ? `${data.season.year}/${data.season.year+1}` : ''} 
            stats={data.statsSummary} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <LeagueMatchList title="Recent Results" matches={data.results.slice(0, 5)} type="results" />
            <LeagueMatchList title="Upcoming Matches" matches={data.fixtures.slice(0, 5)} type="fixtures" />
          </div>

          <LeagueFAQ leagueName={data.league.name} faqs={data.faq || []} />
        </div>
      )}
      
      {activeTab === 'matches' && (
        <LeagueMatches fixtures={data.fixtures} results={data.results} />
      )}

      {activeTab === 'stats' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LeagueStatsAnalysis 
            leagueName={data.league.name} 
            season={data.season?.year ? `${data.season.year}/${data.season.year+1}` : ''} 
            stats={data.statsSummary} 
            detailedMode={activeTab}
            standings={data.standings}
          />
        </div>
      )}

      {activeTab === 'corners' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LeagueCornersTable standings={data.standings} />
        </div>
      )}
    </>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-5 text-sm font-black transition-all relative whitespace-nowrap ${
        active ? 'text-brand-indigo' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-indigo rounded-t-full"></div>
      )}
    </button>
  );
}
