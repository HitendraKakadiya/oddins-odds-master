'use client';

import PopularTeamsList from '@/components/PopularTeamsList';
import TeamsDirectory from '@/components/TeamsDirectory';
import Link from 'next/link';

export default function TeamsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner">
          <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-emerald">Teams</span>
        </div>
        <h1 className="text-3xl font-black text-brand-midnight leading-tight">
          Football Teams & Statistics
        </h1>
        <p className="text-slate-500 font-bold text-sm mt-2">
          Explore comprehensive stats and predictions for clubs worldwide
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Main Content: Teams Directory */}
        <main className="flex-1 min-w-0">
          <TeamsDirectory />
        </main>

        {/* Sidebar: Popular Teams */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <PopularTeamsList />
        </aside>
      </div>


    </div>
  );
}
