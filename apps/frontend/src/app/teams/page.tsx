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
          <Link href="/" className="hover:text-brand-indigo transition-colors">Home</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-indigo">Teams</span>
        </div>
        <h1 className="text-3xl font-black text-brand-dark-blue leading-tight">
          Football Teams & Statistics
        </h1>
        <p className="text-slate-500 font-bold text-sm mt-2">
          Explore comprehensive stats and predictions for clubs worldwide
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Sidebar: Popular Teams */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <PopularTeamsList />
        </aside>

        {/* Main Content: Teams Directory */}
        <main className="flex-1 min-w-0">
          <TeamsDirectory />
        </main>
      </div>

      {/* More About Teams Section - Full Width */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 lg:p-12">
        <h2 className="text-xl font-black text-slate-800 mb-6">More About Teams</h2>
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
          <p>
            Looking for statistics of the biggest Teams in the world? <strong>OddinsOdds</strong> offers all the football team statistics from over 2,500 different teams from all around the globe.
          </p>
          <p>
            You can check out the statistics of the major football teams such as <Link href="/team/manchester-united" className="text-brand-indigo font-bold hover:underline">Manchester United</Link>, <Link href="/team/chelsea" className="text-brand-indigo font-bold hover:underline">Chelsea</Link>, <Link href="/team/manchester-city" className="text-brand-indigo font-bold hover:underline">Manchester City</Link>, <Link href="/team/liverpool" className="text-brand-indigo font-bold hover:underline">Liverpool</Link>, <Link href="/team/real-madrid" className="text-brand-indigo font-bold hover:underline">Real Madrid</Link>, <Link href="/team/fc-barcelona" className="text-brand-indigo font-bold hover:underline">Barcelona</Link>, <Link href="/team/psg" className="text-brand-indigo font-bold hover:underline">PSG</Link> and many more!
          </p>
          <p>
            On <strong>OddinsOdds</strong>, you can find detailed information about a team&apos;s past matches, next fixtures and even their statistics. Which team has won the most games at home? Which football teams have scored and conceded the most goals? You have all that information, and some more on our website, completely for free.
          </p>
          <p>
            Make sure you check our football teams list, and you will be able to use our exclusive statistics for your bets!
          </p>
        </div>
      </div>
    </div>
  );
}
