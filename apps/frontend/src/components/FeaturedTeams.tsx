import Link from 'next/link';

interface Team {
  id: number;
  name: string;
  country: string;
  logo: string;
  slug: string;
}

export default function FeaturedTeams() {
  const teams: Team[] = [
    { id: 1, name: 'Bologna', country: 'Italy', logo: '⚽', slug: 'bologna' },
    { id: 2, name: 'The Strongest', country: 'Bolivia', logo: '⚽', slug: 'the-strongest' },
    { id: 3, name: 'Banfield', country: 'Argentina', logo: '⚽', slug: 'banfield' },
    { id: 4, name: 'Instituto', country: 'Argentina', logo: '⚽', slug: 'instituto' },
    { id: 5, name: 'Albacete Balompié', country: 'Spain', logo: '⚽', slug: 'albacete' },
    { id: 6, name: 'Bayer Leverkusen', country: 'Germany', logo: '⚽', slug: 'leverkusen' },
  ];

  return (
    <section className="mt-12">
      <div className="card !p-0 overflow-hidden shadow-sm !border-slate-200/60 border-t-4 !border-t-brand-indigo bg-white">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-indigo/10 rounded-lg flex items-center justify-center text-brand-indigo">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-slate-800">Featured Teams</h3>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {teams.map((team) => (
              <Link 
                key={team.id}
                href={`/teams/${team.slug}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand-indigo hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:bg-brand-indigo/5 transition-colors">
                  {team.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-black text-slate-800 line-clamp-1 group-hover:text-brand-indigo transition-colors">
                    {team.name}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {team.country}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-indigo group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7-7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
