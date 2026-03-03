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
      <h2 className="text-2xl font-black text-slate-800">Popular Teams</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {teams.map((team) => (
            <Link 
              key={team.id} 
              href={`/team/${team.slug}`}
              className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-800 group-hover:text-brand-emerald transition-colors">{team.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 capitalize">{team.country}</span>
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-slate-200 group-hover:text-brand-emerald transition-all transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
