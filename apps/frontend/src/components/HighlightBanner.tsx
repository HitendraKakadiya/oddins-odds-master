export default function HighlightBanner() {
  return (
    <div className="bg-brand-indigo rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden mb-12 shadow-2xl shadow-brand-indigo/20 border border-white/10 group transition-all hover:shadow-brand-indigo/30">
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
          The Best Football Tips for Today&apos;s Matches
        </h2>
        <p className="text-white/80 text-base md:text-lg leading-relaxed font-medium">
          We provide you with a comprehensive tool of football statistics from over 300 leagues across the globe so that you can get the best football tips for today.
        </p>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all"></div>
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-brand-pink/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      
      {/* Subtle patterns or accents can be added here if needed */}
      <div className="absolute right-12 bottom-12 opacity-10 scale-150 pointer-events-none">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>
    </div>
  );
}
