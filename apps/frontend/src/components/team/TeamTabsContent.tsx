"use client";

import React, { useState } from 'react';
import TeamStandingsTable from './TeamStandingsTable';
import TeamStatsSection from './TeamStatsSection';
import TeamSquadList from './TeamSquadList';
import TeamMatchesTab from './TeamMatchesTab';

interface TeamTabsContentProps {
  team: any;
  standings: any[];
  statsSummary: any;
  squad: any[];
}

const mainTabs = [
  { key: 'summary', label: 'Summary' },
  { key: 'matches', label: 'Matches' },
  { key: 'corners', label: 'Corners' },
  { key: 'stats', label: 'Stats' },
  { key: 'top-scorers', label: 'Top Scorers & Assists' },
  { key: 'squads', label: 'Squads' },
];

export default function TeamTabsContent({ team, standings, statsSummary, squad }: TeamTabsContentProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <TeamStandingsTable standings={standings || []} currentTeamId={team.id} />;
      case 'squads':
        return <TeamSquadList squad={squad || []} />;
      case 'matches':
        return <TeamMatchesTab team={team} />;
      case 'corners':
      case 'stats':
      case 'top-scorers':
        return (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm mb-8">
            <p className="text-gray-500 font-bold text-lg">No data available for {activeTab}</p>
            <p className="text-sm text-gray-400 mt-2">Check back later for updated information.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Categories Tabs */}
      <div className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm mb-8 inline-flex items-center flex-wrap">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.key 
                ? 'bg-brand-light-indigo text-brand-indigo shadow-sm' 
                : 'text-gray-500 hover:text-brand-indigo hover:bg-brand-light-indigo/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Content (Table/Squads/etc.) */}
      <div className="animate-in fade-in duration-300">
        {renderTabContent()}
      </div>

      {/* Static Sections - Always visible below the tab content */}
      <TeamStatsSection 
        teamName={team.name} 
        stats={statsSummary} 
        venue={team.venue}
        city={team.city}
      />
    </>
  );
}
