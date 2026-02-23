'use client';

import Link from 'next/link';

interface LeagueHeroProps {
  league: {
    name: string;
    logoUrl?: string;
    type?: string;
    country: {
      name: string;
    };
  };
  season: {
    year: number;
  };
  stats?: {
    teamCount?: number;
    matchesPlayed?: number;
    totalMatches?: number;
  };
}

export default function LeagueHero({ league, season, stats }: LeagueHeroProps) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 mb-8">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
        {/* League Logo & Title Section */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] bg-slate-50 border border-slate-100 p-6 mb-8 flex items-center justify-center shadow-sm">
            <img src={league.logoUrl} alt={league.name} className="w-full h-full object-contain" />
          </div>
          
          <div className="flex flex-col items-center gap-3 mb-4">
            <button className="text-slate-300 hover:text-brand-pink transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark-blue leading-tight tracking-tight">
              {league.name} standings, stats and fixtures
            </h1>
          </div>
        </div>

        {/* League Info Grid */}
        <div className="w-full md:w-[280px] shrink-0">
          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 md:p-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">League Info</h3>
            <div className="space-y-4">
              <InfoRow label="Country" value={league.country?.name || 'Unknown'} />
              <InfoRow label="Teams" value={stats?.teamCount || 0} />
              <InfoRow label="Season" value={season?.year ? `${season.year}/${season.year + 1}` : 'N/A'} />
              <InfoRow label="Matches" value={`${stats?.matchesPlayed || 0}/${stats?.totalMatches || 0}`} />
            </div>
          </div>
        </div>

        {/* Other Competitions Section */}
        <div className="w-full md:w-[320px] shrink-0">
          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 md:p-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Other Competitions</h3>
            <div className="flex flex-col gap-4">
                <OtherCompItem 
                  name="UEFA Europa Conference League" 
                  region="Europe" 
                  icon="https://media.api-sports.io/football/leagues/3.png" 
                />
                <OtherCompItem 
                   name="UEFA Youth League" 
                   region="Europe" 
                   icon="https://media.api-sports.io/football/leagues/2.png" 
                />
                <OtherCompItem 
                   name="Europe" 
                   region="Europe" 
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-slate-700">{value}</span>
    </div>
  );
}

function OtherCompItem({ name, region, icon }: { name: string; region: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer group">
      <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
        {icon ? (
          <img src={icon} alt="" className="w-6 h-6 object-contain" />
        ) : (
          <span className="text-xs">📍</span>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-black text-slate-800 truncate leading-tight group-hover:text-brand-indigo transition-colors">{region}</span>
        {name !== region && (
           <span className="text-[10px] font-bold text-slate-400 truncate leading-tight">{name}</span>
        )}
      </div>
    </div>
  );
}
