import Link from 'next/link';

export default function AcademyFeatureCards() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
        What Can You Find in the OddinsOdds Academy?
      </h2>
      
      <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-3xl">
        Our Academy is written in such a way as to make your learning journey smooth and effective. 
        Everything is organised, so you can find exactly what you need without any confusion.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
        {/* Strategies Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
          <div className="w-24 h-24 mb-6 bg-slate-50 rounded-2xl flex items-center justify-center p-4">
             {/* Strategy Icon/Emoji */}
             <div className="text-5xl group-hover:scale-110 transition-transform">📋</div>
          </div>
          <Link 
            href="#strategies" 
            className="w-full bg-brand-indigo text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-brand-indigo/20 hover:bg-brand-indigo/90 transition-colors"
          >
            Strategies
          </Link>
        </div>

        {/* Bet Types Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
          <div className="w-24 h-24 mb-6 bg-slate-50 rounded-2xl flex items-center justify-center p-4">
             {/* Bet Types Icon/Emoji */}
             <div className="text-5xl group-hover:scale-110 transition-transform">📈</div>
          </div>
          <Link 
            href="#bet-types" 
            className="w-full bg-brand-indigo text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-brand-indigo/20 hover:bg-brand-indigo/90 transition-colors"
          >
            Bet Types
          </Link>
        </div>
      </div>

      <p className="text-sm text-slate-600 italic">
        Each section includes in-depth guides that walk you through every detail, making sure you&apos;re fully 
        equipped before placing bets on <Link href="/betting-sites" className="text-brand-indigo font-bold hover:underline">sports betting sites</Link>.
      </p>
    </div>
  );
}
