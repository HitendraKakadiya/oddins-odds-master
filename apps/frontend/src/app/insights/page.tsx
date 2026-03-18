import React from 'react';
import InsightHero from '@/components/insights/InsightHero';
import InsightList from '@/components/insights/InsightList';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Match Insights - Football Betting Trends | OddinsOdds',
  description: 'Check the latest football trends, combining the most exciting matches today with leading statistics to help you make more money with sports betting!',
};

export default async function InsightsPage({ 
  searchParams 
}: { 
  searchParams: { date?: string; page?: string } 
}) {
  const date = searchParams.date || new Date().toISOString().split('T')[0];
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;

  // Fetch initial data
  const [insightsData] = await Promise.all([
    api.insights.getInsights(date, page, pageSize).catch(() => ({ items: [], total: 0 })),
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Main Content Area */}
      <main className="w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 bg-slate-50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-inner w-fit">
          <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-emerald">Match Insights</span>
        </div>

        <InsightHero />
        
        <InsightList 
          initialInsights={insightsData.items} 
          initialTotal={insightsData.total} 
          date={date} 
        />

        {/* More about Trends Content */}
        <section className="mt-20">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-12">
             <div className="prose prose-slate max-w-none text-slate-600">
                <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">More about Match Insights</h2>
                <div className="space-y-6 text-md leading-relaxed">
                   <p>Check out the latest football trends, combining the most exciting matches today with leading statistics to help you make more money with sports betting! Come on to OddinsOdds!</p>
                   <p>You can find the hottest trends of matches today and in the coming days. Each match includes all the valuable statistics that help make the best football predictions and award you the most profit from our betting tips.</p>
                   <p>We have selected all the main points from the most important matches to add to your quality selections. Our betting tips include Over 2.5 Goals, Both Teams to Score, Home or Away wins and even Corner betting tips.</p>
                   <p>Make sure you make the most out of OddinsOdds&apos;s trends page. Come back often to check our most recent betting tips for the football matches happening soon!</p>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
