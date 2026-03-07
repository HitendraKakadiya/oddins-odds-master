"use client";

import React, { useState } from 'react';
import TeamStandingsTable from './TeamStandingsTable';
import TeamStatsSection from './TeamStatsSection';
import TeamSquadList from './TeamSquadList';
import TeamMatchesTab from './TeamMatchesTab';
import TeamCornersTab from './TeamCornersTab';
import TeamStatsTab from './TeamStatsTab';
import TeamTopPerformersTab from './TeamTopPerformersTab';

interface TeamTabsContentProps {
  team: any;
  standings: any[];
  statsSummary: any;
  squad: any[];
  nextMatch?: any;
  recentMatches?: any[];
  topScorers?: any[];
  topAssists?: any[];
  detailedStats?: any;
}

const mainTabs = [
  { key: 'summary', label: 'Summary' },
  { key: 'matches', label: 'Matches' },
  { key: 'corners', label: 'Corners' },
  { key: 'stats', label: 'Stats' },
  { key: 'top-scorers', label: 'Top Scorers & Assists' },
  { key: 'squads', label: 'Squads' },
];

export default function TeamTabsContent({ 
  team, 
  standings, 
  statsSummary, 
  squad, 
  nextMatch, 
  recentMatches,
  topScorers,
  topAssists,
  detailedStats
}: TeamTabsContentProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Dynamic League Info from live data
  const leagueName = nextMatch?.league?.name || recentMatches?.[0]?.league?.name || 'Premier League';
  const leagueLogo = nextMatch?.league?.logoUrl || recentMatches?.[0]?.league?.logoUrl || 'https://media.api-sports.io/football/leagues/39.png';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <TeamStandingsTable standings={standings || []} currentTeamId={team.id} />;
      case 'squads':
        return <TeamSquadList squad={squad || []} />;
      case 'matches':
        return <TeamMatchesTab team={team} upcomingMatches={nextMatch ? [nextMatch] : []} lastMatches={recentMatches || []} stats={statsSummary} standings={standings} />;
      case 'corners':
        return <TeamCornersTab detailedStats={detailedStats} />;
      case 'stats':
        return <TeamStatsTab detailedStats={detailedStats} />;
      case 'top-scorers':
        return <TeamTopPerformersTab topScorers={topScorers} topAssists={topAssists} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Premium Navigation Bar (Tabs & League Selector) */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-10 p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories Tabs */}
        <div className="flex items-center flex-wrap gap-1">
          {mainTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 uppercase tracking-wider ${
                activeTab === tab.key 
                  ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20' 
                  : 'text-slate-400 hover:text-brand-emerald hover:bg-brand-light-emerald/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* League Selector (Integrated) */}
        <div className="md:pr-2">
          <div className="relative group">
            <button className="w-full md:w-auto flex items-center justify-between md:justify-start space-x-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl transition-all duration-300 hover:border-brand-emerald/30 group-hover:bg-white group-hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center p-0.5 bg-white rounded-lg shadow-sm border border-slate-100">
                  <img src={leagueLogo} alt="League" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{leagueName}</span>
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-emerald group-hover:rotate-180 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Content (Table/Squads/etc.) */}
      <div className="animate-in fade-in duration-300">
        {renderTabContent()}
      </div>

      {/* Static Sections - Always visible below the tab content */}
      <div className="mt-8 pt-8 border-t border-slate-100/50">
        <TeamStatsSection 
          teamName={team.name} 
          stats={statsSummary} 
          venue={team.venue}
          city={team.city}
          nextMatch={nextMatch}
        />
      </div>
    </>
  );
}
