import Link from 'next/link';

interface Favourite {
  team: string;
  flag: string;
  odds: string;
  slug: string;
}

export default function TournamentFavourites({ favourites }: { favourites: Favourite[] }) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-midnight whitespace-nowrap">
          Tournament Favourites
        </h2>
        <div className="h-px flex-1 bg-slate-200/60"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {favourites.map((fav) => (
          <Link 
            key={fav.team} 
            href={`/team/${fav.slug}`}
            className="card group hover:shadow-lg transition-all duration-300 block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 relative overflow-hidden rounded-md border border-slate-100 flex-shrink-0 shadow-sm">
                 <img 
                  src={`https://flagcdn.com/w80/${fav.flag.toLowerCase()}.png`} 
                  alt={fav.team}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-black text-brand-midnight truncate group-hover:text-brand-emerald transition-colors">{fav.team}</span>
                <span className="text-sm font-bold text-brand-emerald">{fav.odds}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
