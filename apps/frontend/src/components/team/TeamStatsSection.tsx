import React from 'react';

interface TeamStatsSectionProps {
  teamName: string;
  venue?: string;
  city?: string;
  stats: any;
  nextMatch?: any;
  nextMatchDetail?: any;
}

export default function TeamStatsSection({ teamName, venue, city, stats, nextMatch, nextMatchDetail }: TeamStatsSectionProps) {
  const nextMatchInfo = nextMatchDetail?.match || nextMatch;
  const homeStats = nextMatchDetail?.stats?.home?.overall;
  const awayStats = nextMatchDetail?.stats?.away?.overall;
  const comparison = nextMatchDetail?.stats?.comparison;
  
  const homeRank = nextMatchDetail?.standings?.find((s: any) => s.team.id === nextMatchInfo?.homeTeam?.id)?.rank || '-';
  const awayRank = nextMatchDetail?.standings?.find((s: any) => s.team.id === nextMatchInfo?.awayTeam?.id)?.rank || '-';

  const getCountdown = () => {
    if (!nextMatchInfo?.kickoffAt) return "Match scheduled";
    const now = new Date();
    const kickoff = new Date(nextMatchInfo.kickoffAt);
    const diff = kickoff.getTime() - now.getTime();
    
    if (diff <= 0) return "Match Live";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `In ${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatRow = ({ label, home, away, isPercent = false }: { label: string; home: any; away: any; isPercent?: boolean }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="text-center font-black text-gray-900 text-sm">
        {home}{isPercent && home !== '-' ? '%' : ''}
      </div>
      <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest self-center">
        {label}
      </div>
      <div className="text-center font-black text-gray-900 text-sm">
        {away}{isPercent && away !== '-' ? '%' : ''}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Match Statistics Card (High Fidelity) */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group">
          <div className="bg-brand-emerald p-6 relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            <h3 className="text-center font-black text-white uppercase tracking-[0.2em] text-xs relative z-10">Next Match Statistics</h3>
          </div>
          
          <div className="p-8 space-y-8 flex-1 bg-gradient-to-b from-white to-slate-50/30">
            {/* Teams Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center space-y-3 flex-1">
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-md border border-gray-100 p-2 group-hover:scale-110 transition-transform">
                  <img src={nextMatchInfo?.homeTeam?.logoUrl} alt={nextMatchInfo?.homeTeam?.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest text-center">{nextMatchInfo?.homeTeam?.name}</span>
              </div>

              <div className="flex flex-col items-center text-center px-4">
                <span className="text-3xl font-black text-brand-emerald mb-1 whitespace-nowrap">{getCountdown()}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {formatDate(nextMatchInfo?.kickoffAt)} - {formatTime(nextMatchInfo?.kickoffAt)}
                </span>
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full">
                  <img src={nextMatchInfo?.league?.logoUrl} className="w-4 h-4 object-contain" alt="" />
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{nextMatchInfo?.league?.name}</span>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 flex-1">
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-md border border-gray-100 p-2 group-hover:scale-110 transition-transform">
                  <img src={nextMatchInfo?.awayTeam?.logoUrl} alt={nextMatchInfo?.awayTeam?.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest text-center">{nextMatchInfo?.awayTeam?.name}</span>
              </div>
            </div>

            {/* Stats Comparison List */}
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-inner space-y-1">
              <StatRow label="Standings" home={homeRank} away={awayRank} />
              <StatRow label="Goal Scored" home={homeStats?.scoredAvg || '-'} away={awayStats?.scoredAvg || '-'} />
              <StatRow label="Goals Conceded" home={homeStats?.concededAvg || '-'} away={awayStats?.concededAvg || '-'} />
              <StatRow label="% Over 2.5" home={homeStats?.over25Rate || '-'} away={awayStats?.over25Rate || '-'} isPercent />
              <StatRow label="% BTTS" home={homeStats?.bttsRate || '-'} away={awayStats?.bttsRate || '-'} isPercent />
              <StatRow label="xG" home={comparison?.total?.home || '1.41'} away={comparison?.total?.away || '1.77'} />
              <StatRow label="xGA" home={comparison?.goals?.home || '1.74'} away={comparison?.goals?.away || '0.91'} />
            </div>

            <button className="w-full py-4 bg-brand-emerald text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-lg shadow-brand-emerald/20 hover:scale-[1.02] hover:shadow-brand-emerald/30 transition-all">
              View Prediction Detail →
            </button>
          </div>
        </div>

        {/* Next Live Streaming Card */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group">
          <div className="bg-brand-emerald p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            <h3 className="text-center font-black text-white uppercase tracking-[0.2em] text-xs relative z-10">Next Live Streaming</h3>
          </div>
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-white to-slate-50/30">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-inner group-hover:rotate-12 transition-transform">
              📺
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Stay Tuned!</p>
              <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-[240px]">
                Live streaming for {nextMatchInfo?.homeTeam?.name} vs {nextMatchInfo?.awayTeam?.name} will be available shortly before kickoff.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Textual Summary Section */}
      <div className="bg-slate-900 rounded-[48px] p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-emerald/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-light-emerald/10 border border-brand-emerald/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></div>
              <span className="text-[10px] font-black text-brand-emerald uppercase tracking-widest">Season 2025/26 Analysis</span>
            </div>
            
            <h2 className="text-4xl font-black text-white leading-tight">
              {teamName} Standings & <br />
              <span className="text-brand-emerald">Team Stats Summary</span>
            </h2>
            
            <p className="text-slate-400 font-medium leading-relaxed">
              Check {teamName} standings for the 2025/26 season, upcoming matches, recent results, full squad, and performance metrics. 
              Our live data integration ensures you get real-time insights that only APWin users get, helping you make smarter, data-driven decisions.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all">
                <span className="text-3xl font-black text-white block mb-1">{stats?.goalsScoredAvg || '1.8'}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Goals / Match</span>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all">
                <span className="text-3xl font-black text-white block mb-1">{stats?.winRate || '65'}%</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Win Rate</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-8 backdrop-blur-md">
            <h3 className="text-xl font-black text-white uppercase tracking-wider">{teamName}: Basic Info</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/20 flex items-center justify-center text-xl">🏟️</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Venue</p>
                  <p className="text-sm font-bold text-white">{venue || 'Unknown Stadium'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/20 flex items-center justify-center text-xl">📍</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">City</p>
                  <p className="text-sm font-bold text-white">{city || 'Unknown City'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/20 flex items-center justify-center text-xl">🏆</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Main Competition</p>
                  <p className="text-sm font-bold text-white">{nextMatchInfo?.league?.name || 'Premier League'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

