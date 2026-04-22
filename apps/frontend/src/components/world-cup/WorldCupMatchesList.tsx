import Link from 'next/link';

interface Match {
  id: number;
  homeTeam: { name: string; logo: string; slug: string };
  awayTeam: { name: string; logo: string; slug: string };
  date: string;
  venue: string;
  round: string;
}

export default function WorldCupMatchesList({ matches }: { matches: Match[] }) {
  if (!matches || matches.length === 0) return null;

  // Group matches by date
  const groupedMatches: Record<string, Match[]> = {};
  matches.forEach(match => {
    const dateKey = new Date(match.date).toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    if (!groupedMatches[dateKey]) groupedMatches[dateKey] = [];
    groupedMatches[dateKey].push(match);
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-midnight whitespace-nowrap">
          Tournament Schedule
        </h2>
        <div className="h-px flex-1 bg-slate-200/60"></div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <div key={date} className="card !p-0 overflow-hidden shadow-sm border border-slate-100">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-brand-emerald uppercase tracking-[0.2em]">
                {date}
              </h3>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="py-4 px-6">Time</th>
                    <th className="py-4 px-2 text-center">Match</th>
                    <th className="py-4 px-6 text-right">Venue & Round</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dateMatches.map((match) => (
                    <tr key={match.id} className="group/row hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-xs font-black text-brand-midnight">
                          {new Date(match.date).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <Link href={`/match/${match.id}`} className="flex items-center justify-center gap-6 group/match">
                          <div className="flex items-center gap-3 w-40 justify-end">
                            <span className="text-sm font-bold text-brand-midnight truncate group-hover/match:text-brand-emerald transition-colors">{match.homeTeam.name}</span>
                            <img src={match.homeTeam.logo} alt="" className="w-6 h-6 object-contain" />
                          </div>
                          <span className="text-[10px] font-black text-slate-200">VS</span>
                          <div className="flex items-center gap-3 w-40 justify-start">
                            <img src={match.awayTeam.logo} alt="" className="w-5 h-5 object-contain" />
                            <span className="text-sm font-bold text-brand-midnight truncate group-hover/match:text-brand-emerald transition-colors">{match.awayTeam.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-brand-emerald uppercase tracking-tighter">{match.round}</span>
                          <span className="text-[9px] font-medium text-slate-400 truncate max-w-[150px]">{match.venue || 'TBD'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
