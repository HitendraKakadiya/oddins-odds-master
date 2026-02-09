import TableOfContents from '@/components/About/TableOfContents';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';
import AuthorBio from '@/components/About/AuthorBio';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 transition-all duration-300">
         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 sm:mb-4 leading-tight">About OddinsOdds</h1>
         <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-sm text-gray-500 font-bold bg-slate-50 self-start px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-100/60 shadow-inner">
            <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
            <span className="text-slate-200">/</span>
            <span className="text-brand-pink truncate max-w-[200px] sm:max-w-none">About OddinsOdds: independence and...</span>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
           {/* Intro */}
           <div className="prose prose-slate max-w-none text-gray-600 mb-12">
              <p className="lead font-bold text-gray-900 text-lg mb-6">
                 OddinsOdds is a platform specialized in football statistics, sportsbook analysis, and sports betting tips,
                 developed to help bettors make more concise decisions.
              </p>
              <p className="mb-6">
                 We are driven by data, but also by passion. We understand that for those who bet, <span className="font-bold text-gray-900">information is power</span>
                 —and we believe it should be accessible to everyone, clearly, organized, and reliable. This is our daily commitment
                 to every user who accesses OddinsOdds.
              </p>
           </div>

           {/* Our History */}
           <section id="our-history" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Our History</h2>
              <div className="prose prose-slate max-w-none text-gray-600">
                 <p className="mb-4">
                    It all started in <span className="font-bold text-gray-900">2018</span>, when a small group of analysts and football enthusiasts noticed a gap in the
                    international market: there was a lack of a reliable platform that combined <span className="font-bold text-gray-900">accurate statistics with useful
                    content for bettors</span>. At the time, it was common to find scattered, outdated, or irrelevant data for those who
                    wanted to bet with more strategy.
                 </p>
                 <p className="mb-4">
                    That&apos;s how the idea of centralizing everything came about: a place where you could find <span className="font-bold text-gray-900">updated statistics,
                    match schedules, performance analysis, odds, betting tips, and sportsbook comparisons</span>—all free and easy to access.
                 </p>
                 <p>
                    From the beginning, our mission was to democratize access to quality information. And as the community grew,
                    OddinsOdds also evolved: we began to cover regional championships, offer in-depth match analysis, and create daily
                    content designed for bettors looking for more than just &quot;tips.&quot;
                 </p>
              </div>
           </section>

           {/* What We Do */}
           <section id="what-we-do" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-6">What We Do</h2>
              <div className="prose prose-slate max-w-none text-gray-600">
                 <p className="mb-6">
                    At OddinsOdds, we bring together the main tools that a bettor needs to have more confidence in their decisions.
                    We operate on four main pillars:
                 </p>
                 <ol className="list-decimal pl-5 space-y-2 mb-8 font-medium">
                    <li>Educational content and unbiased analysis;</li>
                    <li>Statistical coverage of championships and clubs;</li>
                    <li>Comparison tools for sportsbooks and odds;</li>
                    <li>Daily betting tips based on real data.</li>
                 </ol>

                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis of Regulated Bookmakers</h3>
                 <p className="mb-4">
                    We evaluate the main bookmakers in the international markets in a technical and impartial way. We focus on the
                    <span className="font-bold text-gray-900"> bonuses offered, security, withdrawal methods, customer service, and platform quality</span>.
                 </p>
                 <a href="#" className="flex items-center gap-2 text-brand-indigo font-bold hover:underline mb-10">
                    <span>💻</span> Check out our bookmakers reviews
                 </a>

                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Match Predictions</h3>
                 <p className="mb-4">
                    We publish daily football betting tips based on statistical analysis, market trends, and tactical reading of the
                    matches. No guessing—here, every tip has a foundation.
                 </p>
                 <a href="/predictions" className="flex items-center gap-2 text-brand-indigo font-bold hover:underline mb-10">
                    <span>⚽</span> Check the updated predictions
                 </a>

                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Where to Watch the Matches</h3>
                 <p className="mb-4">
                    In addition, we show you where to watch the games. We organize the broadcast data by championship and date,
                    with verified and updated links. Simple and practical.
                 </p>
                 <a href="/streams" className="inline-block border border-brand-pink text-brand-pink font-bold px-3 py-1 rounded hover:bg-brand-pink hover:text-white transition-colors mb-10">
                    📺 See where to watch live
                 </a>

                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Leagues Statistics</h3>
                 <p className="mb-4">
                    We offer complete data on the main national and international championships, such as the Champions League,
                    Premier League, La Liga, Libertadores, and more. You can find everything from average goals and corners to
                    dynamic tables and performance graphs.
                 </p>
                 <a href="/leagues" className="flex items-center gap-2 text-brand-indigo font-bold hover:underline mb-10">
                    <span>📊</span> Explore leagues statistics
                 </a>

                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Statistics</h3>
                 <p className="mb-4">
                    Each club has its own page with everything you need: performance, home and away records, number of goals
                    scored and conceded, corner patterns, cards, and much more.
                 </p>
                 <a href="/teams" className="flex items-center gap-2 text-brand-indigo font-bold hover:underline">
                    <span>🛡️</span> Check out team statistics
                 </a>
              </div>
           </section>

            {/* Our Team */}
            <section id="our-team" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Our Team</h2>
              <div className="prose prose-slate max-w-none text-gray-600">
                 <p className="mb-8">
                    Behind every written line, assembled graph, and published data is a team made up of <span className="font-bold text-gray-900">specialists in
                    sports journalism, statistics, and betting</span>. We work with seriousness, solid grounding, and a focus on delivering
                    real content.
                 </p>

                 <div className="space-y-8">
                    {/* Authors */}
                    <AuthorBio />
              </div>
              </div>
           </section>



        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0">
           <div className="sticky top-24">
              <TableOfContents />
              <TodaysMatchesWidget />
           </div>
        </aside>
      </div>
    </div>
  );
}
