"use client";

import React, { useState } from 'react';

interface StatsRow {
  rank: number;
  team: { name: string; logo: string };
  mp: number;
  val: number;
  avgOverall: string;
  avgHome: string;
  avgAway: string;
}

const subTabs = [
  { key: 'goals', label: 'Goals' },
  { key: 'cards', label: 'Cards' },
  { key: '1st-half', label: '1st Half' },
  { key: '2nd-half', label: '2nd Half' },
  { key: 'over-under', label: 'Over Under Goals' },
  { key: 'clean-sheet', label: 'Clean Sheet' },
  { key: 'btts', label: 'BTTS' },
  { key: 'scoring-first', label: 'Match Scoring / Conceding First' },
];

interface TeamStatsTabProps {
  detailedStats?: any;
}

export default function TeamStatsTab({ detailedStats }: TeamStatsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('goals');
  const [filter, setFilter] = useState<'Overall' | 'Home' | 'Away'>('Overall');
  const [metric, setMetric] = useState('Goal Scored');

  const getTeamVal = (category: string, subKey: string) => {
    const section = filter.toLowerCase();
    return detailedStats?.[category]?.[subKey]?.[section] || 0;
  };

  const getDetailedStat = () => {
    if (!detailedStats) return [];
    
    const section = filter.toLowerCase();
    
    switch(activeSubTab) {
      case 'goals':
        return [
          { label: 'Total Scored', val: detailedStats.goals?.for?.total?.[section] || 0, avg: detailedStats.goals?.for?.average?.[section] || '0' },
          { label: 'Total Conceded', val: detailedStats.goals?.against?.total?.[section] || 0, avg: detailedStats.goals?.against?.average?.[section] || '0' },
          { label: 'Clean Sheets', val: detailedStats.clean_sheet?.[section] || 0, avg: '-' },
          { label: 'Failed to Score', val: detailedStats.failed_to_score?.[section] || 0, avg: '-' },
        ];
      case 'cards':
        return [
          { label: 'Yellow Cards', val: Object.values(detailedStats.cards?.yellow || {}).reduce((acc: number, curr: any) => acc + (curr.total || 0), 0), avg: '-' },
          { label: 'Red Cards', val: Object.values(detailedStats.cards?.red || {}).reduce((acc: number, curr: any) => acc + (curr.total || 0), 0), avg: '-' },
        ];
      case 'over-under':
        return [
          { label: 'Over 1.5', val: detailedStats.goals?.for?.total?.['over-1_5']?.[section] || 'N/A', avg: '-' },
          { label: 'Over 2.5', val: detailedStats.goals?.for?.total?.['over-2_5']?.[section] || 'N/A', avg: '-' },
          { label: 'Under 2.5', val: detailedStats.goals?.for?.total?.['under-2_5']?.[section] || 'N/A', avg: '-' },
          { label: 'Over 3.5', val: detailedStats.goals?.for?.total?.['over-3_5']?.[section] || 'N/A', avg: '-' },
        ];
      case 'clean-sheet':
        return [
          { label: 'Clean Sheets', val: detailedStats.clean_sheet?.[section] || 0, avg: '-' },
          { label: 'BTTS Yes', val: detailedStats.btts?.[section] || 'N/A', avg: '-' },
        ];
      case 'scoring-first':
        return [
          { label: 'Scored First', val: detailedStats.fixtures?.scoring_first?.[section] || 0, avg: '-' },
          { label: 'Conceded First', val: detailedStats.fixtures?.conceded_first?.[section] || 0, avg: '-' },
        ];
      default:
        // Try generic fallback if sub-key exists in detailedStats
        if (detailedStats[activeSubTab]) {
            return [
                { label: 'Value', val: detailedStats[activeSubTab]?.[section] || 0, avg: '-' }
            ];
        }
        return [];
    }
  };

  const currentStats = getDetailedStat();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Sub-navigation */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide">
        <div className="flex px-2">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`px-6 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeSubTab === tab.key 
                  ? 'text-brand-emerald' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeSubTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-emerald animate-in slide-in-from-left duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
        {/* Section Header */}
        <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          
          <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">
            {subTabs.find(t => t.key === activeSubTab)?.label}
          </h3>
          <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
            <span className="text-xs">📈</span>
          </div>
        </div>

        <div className="p-8">
          {/* Controls: Dropdown & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="relative group/select w-full sm:w-64">
              <select 
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none appearance-none cursor-pointer focus:border-brand-emerald/30 focus:bg-white transition-all"
              >
                <option>Goal Scored</option>
                <option>Goal Conceded</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-[20px] border border-slate-100 shadow-inner">
              {(['Overall', 'Home', 'Away'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-8 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    filter === item
                      ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20 scale-105'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentStats.map((item: any) => (
              <div key={item.label} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center group hover:border-brand-emerald/30 transition-all duration-300">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{item.label}</span>
                <span className="text-3xl font-black text-slate-900 group-hover:text-brand-emerald transition-colors">{item.val}</span>
                {item.avg !== '-' && (
                  <div className="mt-4 px-4 py-1.5 bg-brand-light-emerald/50 rounded-xl border border-brand-emerald/10">
                    <span className="text-[10px] font-black text-brand-emerald uppercase tracking-widest">Avg: {item.avg}</span>
                  </div>
                )}
              </div>
            ))}
            {currentStats.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No detailed stats found for this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
