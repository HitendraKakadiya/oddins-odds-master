export default function AcademyAuthor() {
  return (
    <div className="bg-white border boundary-slate-100 rounded-[32px] p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-sm mb-16">
      <div className="shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] overflow-hidden bg-slate-100 border-4 border-slate-50 flex items-center justify-center text-5xl">
          🧔🏻‍♂️
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 mb-4">
          <h3 className="text-xl font-black text-slate-900">Joe Doe</h3>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Senior Analyst</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          Joe is a seasoned sports analyst with over 10 years of experience in data modeling and match predictions. 
          At OddinsOdds, he leads the statistical analysis team, ensuring every tip is backed by solid data. Outside of work, 
          he enjoys playing 5-a-side football and analyzing historical match data.
        </p>
        
        <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <span className="px-3 py-1 bg-slate-50 rounded-lg">Published on 29 July 2025</span>
           <span className="px-3 py-1 bg-slate-50 rounded-lg">Last updated on 29 July 2025</span>
        </div>
      </div>
    </div>
  );
}
