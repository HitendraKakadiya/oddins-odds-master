'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPopularLeagues } from '@/lib/api';

interface PopularLeague {
  id: number;
  name: string;
  country: string;
  logoUrl: string;
  slug: string;
}

export default function PopularLeaguesList() {
  const [leagues, setLeagues] = useState<PopularLeague[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const items = await getPopularLeagues();
        if (items && Array.isArray(items)) {
          const formatted: PopularLeague[] = items.map(item => ({
            id: item.id,
            name: item.name,
            country: item.country?.name || 'Unknown',
            logoUrl: item.logoUrl || '',
            slug: item.slug
          }));
          setLeagues(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch popular leagues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-slate-800">Popular Leagues</h2>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-brand-emerald/10 border-t-brand-emerald rounded-full animate-spin"></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Loading popular...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {leagues.map((league) => (
              <Link 
                key={league.id} 
                href={`/leagues/${league.country.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-')}/${league.slug.replace(/-+/g, '-')}`}
                className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <img src={league.logoUrl} alt={league.name} className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 group-hover:text-brand-emerald transition-colors">{league.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{league.country}</span>
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
        )}
      </div>
    </div>
  );
}
