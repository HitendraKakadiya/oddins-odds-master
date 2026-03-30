'use client';

export default function StreamsHero() {
  return (
    <div className="relative w-full h-[320px] rounded-[32px] overflow-hidden mb-12 group shadow-2xl shadow-indigo-500/10">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 sm:px-12 max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
          Where to watch <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-pink-400">football live streams</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
          Find out here how to watch football live and online today and access the main players to follow the most diverse football championships around the world.
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 right-6 opacity-20">
         <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border border-white/50 rounded-full" />
         </div>
      </div>
    </div>
  );
}
