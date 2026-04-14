"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TeamStandingsTable from './TeamStandingsTable';
import TeamStatsSection from './TeamStatsSection';
import TeamSquadList from './TeamSquadList';
import TeamMatchesTab from './TeamMatchesTab';
import TeamCornersTab from './TeamCornersTab';
import TeamStatsTab from './TeamStatsTab';
import TeamTopPerformersTab from './TeamTopPerformersTab';

import type { 
  TeamDetailResponse, 
  StandingsRow, 
  SquadPlayer, 
  MatchData, 
  PlayerStatRow, 
  TeamStats 
} from '@/lib/api/types';

interface TeamTabsContentProps {
  team: TeamDetailResponse['team'];
  standings: StandingsRow[];
  statsSummary: TeamDetailResponse['statsSummary'];
  squad: SquadPlayer[];
  nextMatch?: MatchData;
  recentMatches?: MatchData[];
  topScorers?: PlayerStatRow[];
  topAssists?: PlayerStatRow[];
  detailedStats?: TeamStats;
  nextMatchDetail?: TeamDetailResponse['nextMatchDetail'];
  competitions?: TeamDetailResponse['competitions'];
  activeLeagueId?: number;
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
  nextMatchDetail,
  recentMatches,
  topScorers,
  topAssists,
  detailedStats,
  competitions,
  activeLeagueId
}: TeamTabsContentProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [isLeagueMenuOpen, setIsLeagueMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Highlight active league from competitions or defaults
  const currentLeague = competitions?.find(c => (c.id || ((c as unknown) as { leagueId?: number }).leagueId) === activeLeagueId) || {
    name: nextMatch?.league?.name || recentMatches?.[0]?.league?.name || 'Premier League',
    logoUrl: nextMatch?.league?.logoUrl || recentMatches?.[0]?.league?.logoUrl || 'https://media.api-sports.io/football/leagues/39.png',
    id: activeLeagueId
  };

  const handleLeagueChange = (leagueId: number | string) => {
    if (!leagueId) {
      console.warn('League selector: received null or undefined leagueId');
      return;
    }
    const currentParams = searchParams?.toString() || '';
    const params = new URLSearchParams(currentParams);
    params.set('league', leagueId.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setIsLeagueMenuOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <TeamStandingsTable standings={standings || []} currentTeamId={team.id} />;
      case 'squads':
        return <TeamSquadList squad={squad || []} />;
      case 'matches':
        return <TeamMatchesTab team={{ 
          id: team?.id || 0, 
          name: team?.name || 'Unknown', 
          logoUrl: team?.logoUrl || '' 
        }} upcomingMatches={nextMatch ? [nextMatch] : []} lastMatches={recentMatches || []} stats={statsSummary} standings={standings} />;
      case 'corners':
        return <TeamCornersTab detailedStats={detailedStats} />;
      case 'stats':
        return <TeamStatsTab detailedStats={detailedStats} />;
      case 'top-scorers':
        return <TeamTopPerformersTab topScorers={topScorers} topAssists={topAssists} nextMatch={nextMatch} nextMatchDetail={nextMatchDetail} />;
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
        <div className="md:pr-2 relative">
          <button 
            onClick={() => setIsLeagueMenuOpen(!isLeagueMenuOpen)}
            className="w-full md:w-auto flex items-center justify-between md:justify-start space-x-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl transition-all duration-300 hover:border-brand-emerald/30 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center p-0.5 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <img src={currentLeague.logoUrl || ((currentLeague as unknown) as { logo?: string }).logo || ''} alt="League" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{currentLeague.name}</span>
            </div>
            <svg className={`w-4 h-4 text-slate-300 transition-all duration-300 ${isLeagueMenuOpen ? 'rotate-180 text-brand-emerald' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* League Dropdown Menu */}
          {isLeagueMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsLeagueMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-2 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Competition</span>
                </div>
                {competitions?.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => handleLeagueChange(comp.id)}
                    className={`w-full flex items-center space-x-3 px-5 py-3 transition-colors ${
                      activeLeagueId === comp.id ? 'bg-brand-light-emerald/30' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center p-1 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <img src={comp.logoUrl || ((comp as unknown) as { logo?: string }).logo} alt={comp.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className={`text-xs font-black uppercase tracking-wider truncate w-full text-left ${
                        activeLeagueId === comp.id ? 'text-brand-emerald' : 'text-slate-700'
                      }`}>
                        {comp.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Tab Content (Table/Squads/etc.) */}
      <div className="animate-in fade-in duration-300">
        {renderTabContent()}
      </div>

      {/* Static Sections - Always visible below the tab content */}
      <div className="mt-8 pt-8 border-t border-slate-100/50">
        <TeamStatsSection 
          teamName={team?.name || 'Unknown Team'} 
          stats={statsSummary} 
          venue={team?.venue}
          city={team?.city}
          nextMatch={nextMatch}
          nextMatchDetail={nextMatchDetail}
        />
      </div>
    </>
  );
}
