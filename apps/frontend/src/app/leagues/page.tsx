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
          <Link href="/" className="hover:text-brand-indigo transition-colors">Home</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-indigo">Leagues</span>
        </div>
        <h1 className="text-3xl font-black text-brand-dark-blue leading-tight">
          Football Leagues & Competitions
        </h1>
        <p className="text-slate-500 font-bold text-sm mt-2">
          Browse predictions and statistics by league from all around the world
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Sidebar: Popular Leagues */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <PopularLeaguesList />
        </aside>

        {/* Main Content: Worldwide Directory */}
        <main className="flex-1 min-w-0">
          <WorldwideLeagueDirectory />
        </main>
      </div>

      {/* More About Leagues Section - Full Width */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 lg:p-10">
        <h2 className="text-xl font-black text-slate-800 mb-6">More About Leagues</h2>
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
          <p>
            Don&apos;t miss out on the world&apos;s greatest football leagues! <strong>OddinsOdds</strong> covers the stats of the most popular leagues, including the <Link href="/predictions?leagueSlug=premier-league" className="text-brand-indigo font-bold hover:underline">English Premier League</Link>, <Link href="/predictions?leagueSlug=la-liga" className="text-brand-indigo font-bold hover:underline">Spanish La Liga</Link>, the <Link href="/predictions?leagueSlug=australian-a-league" className="text-brand-indigo font-bold hover:underline">Australian League</Link>, <Link href="/predictions?leagueSlug=american-mls" className="text-brand-indigo font-bold hover:underline">American MLS</Link> and the <Link href="/predictions?leagueSlug=brazilian-serie-a" className="text-brand-indigo font-bold hover:underline">Brazilian Serie A</Link>.
          </p>
          <p>
            If you&apos;re looking for the football competition with the most matches with Over 2.5 Goals, most corners, or the most draws, then you can find it all on <strong>OddinsOdds&apos;s</strong> league pages.
          </p>
          <p>
            We cover well over 100 leagues, with over 1,000 matches per month for you to take the most advantage from the statistics. Use it all to make the best betting tips and win the big bucks in your next <strong>football betting</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
