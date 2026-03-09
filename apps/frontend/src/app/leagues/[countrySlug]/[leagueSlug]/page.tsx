'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeagueDetail } from '@/lib/api/leagues';
import { LeagueDetailResponse } from '@/lib/api/types';
import LeagueHero from '@/components/leagues/LeagueHero';
import LeagueStandingsTable from '@/components/leagues/LeagueStandingsTable';
import LeagueStatsAnalysis from '@/components/leagues/LeagueStatsAnalysis';
import LeagueMatchList from '@/components/leagues/LeagueMatchList';
import LeagueFAQ from '@/components/leagues/LeagueFAQ';
import LeagueMatches from '@/components/leagues/LeagueMatches';
import LeagueCornersTable from '@/components/leagues/LeagueCornersTable';

interface PageProps {
  params: {
    countrySlug: string;
    leagueSlug: string;
  };
}

export default function LeagueDetailPage({ params }: PageProps) {
  const [data, setData] = useState<LeagueDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'matches' | 'stats' | 'corners'>('summary');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getLeagueDetail(params.countrySlug, params.leagueSlug);
        setData(res);
      } catch (err) {
        console.error('Failed to fetch league detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.countrySlug, params.leagueSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <div className="w-12 h-12 border-4 border-brand-indigo/10 border-t-brand-indigo rounded-full animate-spin"></div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Analyzing league data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
        <h2 className="text-2xl font-black text-slate-800 mb-2">League Not Found</h2>
        <p className="text-slate-500 mb-8">The league you are looking for does not exist or has been removed.</p>
        <Link href="/leagues" className="bg-brand-indigo text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-indigo/20">
          Back to Directory
        </Link>
      </div>
    );
  }

  // No more mock stats, we use data.statsSummary directly

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 bg-white/50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-sm backdrop-blur-sm">
          <Link href="/" className="hover:text-brand-indigo transition-colors uppercase">Home</Link>
          <span className="text-slate-200">/</span>
          <Link href="/leagues" className="hover:text-brand-indigo transition-colors uppercase">Leagues</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-indigo uppercase">{data.league.name}</span>
        </div>

        <LeagueHero 
          league={data.league as any} 
          season={data.season} 
          stats={{ 
            teamCount: data.standings.length, 
            matchesPlayed: data.statsSummary.matchesPlayed, 
            totalMatches: data.statsSummary.totalMatches 
          }} 
        />

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
               <LeagueMatchList title="Recent Results" matches={data.results.slice(0, 5) as any} type="results" />
               <LeagueMatchList title="Upcoming Matches" matches={data.fixtures.slice(0, 5) as any} type="fixtures" />
            </div>

            <LeagueFAQ leagueName={data.league.name} faqs={data.faq || []} />
          </div>
        )}
        
        {activeTab === 'matches' && (
           <LeagueMatches fixtures={data.fixtures} results={data.results} />
        )}

        {(activeTab === 'stats') && (
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
      </div>
    </div>
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
