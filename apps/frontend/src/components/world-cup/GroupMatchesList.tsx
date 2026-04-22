import Link from 'next/link';

interface Match {
  id: number;
  homeTeam: { name: string; logo: string; slug: string };
  awayTeam: { name: string; logo: string; slug: string };
  date: string;
  venue: string;
  round: string;
}

interface Group {
  name: string;
  fixtures: Match[];
}

export default function GroupMatchesList({ groups }: { groups: Group[] }) {
  if (!groups || groups.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-midnight whitespace-nowrap">
          Group Stage Schedule
        </h2>
        <div className="h-px flex-1 bg-slate-200/60"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {groups.map((group) => (
          <div key={group.name} className="card !p-0 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-brand-midnight">{group.name} Schedule</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.fixtures.length} Matches</span>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-2 text-center">Match</th>
                    <th className="py-4 px-6 text-right">Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {group.fixtures.map((match) => (
                    <tr key={match.id} className="group/row hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-brand-midnight">
                            {new Date(match.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(match.date).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Link href={`/match/${match.id}`} className="flex items-center justify-center gap-4 group/match">
                          <div className="flex items-center gap-2 w-32 justify-end">
                            <span className="text-xs font-bold text-brand-midnight truncate group-hover/match:text-brand-emerald transition-colors">{match.homeTeam.name}</span>
                            <img src={match.homeTeam.logo} alt="" className="w-5 h-5 object-contain" />
                          </div>
                          <span className="text-[10px] font-black text-slate-200">VS</span>
                          <div className="flex items-center gap-2 w-32 justify-start">
                            <img src={match.awayTeam.logo} alt="" className="w-5 h-5 object-contain" />
                            <span className="text-xs font-bold text-brand-midnight truncate group-hover/match:text-brand-emerald transition-colors">{match.awayTeam.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-brand-emerald uppercase tracking-tighter">{match.round}</span>
                          <span className="text-[9px] font-medium text-slate-400 truncate max-w-[120px]">{match.venue}</span>
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
