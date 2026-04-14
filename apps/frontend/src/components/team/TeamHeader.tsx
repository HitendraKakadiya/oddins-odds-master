import React from 'react';

interface TeamHeaderProps {
  team: {
    name: string;
    logoUrl?: string | null;
    country?: string | null;
    venue?: string | null;
  };
  competitions: Array<{
    name: string;
    logoUrl?: string | null;
    logo?: string | null;
  }>;
}

export default function TeamHeader({ team, competitions }: TeamHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        {/* Team Logo and Name Section */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center p-4 mb-6 relative group transform transition-transform duration-300 hover:scale-105">
            {team.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-4xl">⚽</span>
            )}
            <div className="absolute inset-0 rounded-full border-2 border-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            {team.name} Standings, Matches,<br />Stats and Results
          </h1>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-100 h-48 self-center"></div>

        {/* Team Info Section */}
        <div className="flex-1 w-full max-w-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Team Info</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-500 font-medium">Season</span>
              <span className="text-gray-900 font-bold">2025/26</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-500 font-medium">Country</span>
              <span className="text-gray-900 font-bold">{team.country || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-500 font-medium">Venue</span>
              <span className="text-gray-900 font-bold truncate ml-4">{team.venue || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-100 h-48 self-center"></div>

        {/* Competition Section */}
        <div className="flex-1 w-full max-w-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Competition</h3>
          <div className="space-y-4">
            {competitions.map((comp, idx) => (
              <div key={idx} className="flex items-center space-x-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors duration-200">
                <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center p-1.5 transform transition-transform duration-200 group-hover:scale-110">
                  {comp.logoUrl || comp.logo ? (
                    <img src={comp.logoUrl || comp.logo || ''} alt={comp.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs">⚽</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{team.country || 'England'}</span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{comp.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
