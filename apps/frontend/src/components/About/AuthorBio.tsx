export default function AuthorBio() {
  return (
    <div className="bg-white border boundary-slate-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mt-8 shadow-sm">
       <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
             {/* Placeholder for author image */}
             <div className="w-full h-full bg-slate-200 flex items-center justify-center text-3xl">👨🏻‍💻</div>
          </div>
          {/* Decorative elements could be added here */}
       </div>
       <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
             <h3 className="text-lg font-bold text-gray-900">John Doe</h3>
             <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Senior Analyst</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
             John is a seasoned sports analyst with over 10 years of experience in data modeling and match predictions. 
             At OddinsOdds, he leads the statistical analysis team, ensuring every tip is backed by solid data. Outside of work, 
             he enjoys playing 5-a-side football and analyzing historical match data.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
             <a href="#" className="text-brand-indigo hover:text-brand-pink transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
             </a>
             <a href="#" className="text-brand-indigo hover:text-brand-pink transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
             </a>
          </div>
       </div>
    </div>
  );
}
