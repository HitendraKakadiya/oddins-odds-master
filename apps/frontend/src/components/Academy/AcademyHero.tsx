import Link from 'next/link';

export default function AcademyHero() {
  return (
    <div className="mb-10">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-gray-400 font-bold mb-6">
        <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-300">OddinsOdds Academy</span>
        <span className="text-gray-300">/</span>
        <span className="text-brand-pink font-black">Find all your...</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
        OddinsOdds Academy
      </h1>

      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-sm sm:text-base leading-relaxed">
          Welcome to the <span className="font-bold text-slate-900">OddinsOdds Academy</span> – your trusted source for mastering online sports betting. 
          Whether you&apos;re a newcomer or looking to sharpen your betting skills, our academy is built to support every 
          level of experience with expert-backed content.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          At OddinsOdds, we deliver step-by-step guides to help you understand how online betting works, from 
          the basics of odds to advanced tactics. Our <span className="font-bold text-slate-900">Betting Academy</span> is your one-stop learning hub, offering 
          detailed advice to help you bet smarter, whether it&apos;s football or any other sport.
        </p>
      </div>
    </div>
  );
}
