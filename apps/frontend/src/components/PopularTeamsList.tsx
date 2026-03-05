'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeaturedTeams } from '@/lib/api/teams';

interface PopularTeam {
  id: number;
  name: string;
  country: string;
  logoUrl: string;
  slug: string;
}

export default function PopularTeamsList() {
  const [teams, setTeams] = useState<PopularTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const data = await getFeaturedTeams();
        // The API returns { id, name, slug, logoUrl, country }
        setTeams(data);
      } catch (err) {
        console.error('Failed to fetch popular teams:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-black text-slate-800">Popular Teams</h2>
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-emerald/10 border-t-brand-emerald rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Loading world-class teams...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-900 px-1">Popular Teams</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {teams.map((team) => (
            <Link 
              key={team.id} 
              href={`/team/${team.slug}`}
              className="group flex items-center justify-between p-5 hover:bg-slate-50/80 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-slate-800 leading-tight group-hover:text-brand-emerald transition-colors">{team.name}</span>
                  <span className="text-[13px] font-medium text-slate-400">{team.country}</span>
                </div>
              </div>
              <div className="bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:bg-brand-emerald/10 group-hover:translate-x-1">
                <svg 
                  className="w-4 h-4 text-slate-400 group-hover:text-brand-emerald" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
