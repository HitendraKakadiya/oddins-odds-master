'use client';

import PopularLeaguesList from '@/components/PopularLeaguesList';
import WorldwideLeagueDirectory from '@/components/WorldwideLeagueDirectory';
import Link from 'next/link';

export default function LeaguesPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner">
          <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-emerald">Leagues</span>
        </div>
        <h1 className="text-3xl font-black text-brand-midnight leading-tight">
          Football Leagues & Competitions
        </h1>
        <p className="text-slate-500 font-bold text-sm mt-2">
          Browse predictions and statistics by league from all around the world
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Main Content: Worldwide Directory */}
        <main className="flex-1 min-w-0 order-2 lg:order-1">
          <WorldwideLeagueDirectory />
        </main>

        {/* Sidebar: Popular Leagues */}
        <aside className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2">
          <PopularLeaguesList />
        </aside>
      </div>


    </div>
  );
}
