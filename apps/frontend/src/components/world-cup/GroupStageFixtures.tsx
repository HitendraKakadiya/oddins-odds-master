import Link from 'next/link';

interface Group {
  name: string;
  teams: string[];
  standings: any[];
  fixtures: any[];
}

export default function GroupStageFixtures({ groups }: { groups: Group[] }) {
  if (!groups || groups.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-midnight whitespace-nowrap">
          Group Stage Coverage
        </h2>
        <div className="h-px flex-1 bg-slate-200/60"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col gap-6">
            {/* Standings Card */}
            <div className="card group h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-brand-midnight">{group.name} - Standings</h3>
                <span className="text-[10px] font-black text-brand-emerald uppercase tracking-widest bg-brand-light-emerald px-2 py-1 rounded border border-brand-emerald/10">
                  Live Table
                </span>
              </div>
              
              <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4 pr-4">Pos</th>
                      <th className="pb-4 pr-4">Team</th>
                      <th className="pb-4 px-2 text-center">P</th>
                      <th className="pb-4 px-2 text-center text-slate-300">W</th>
                      <th className="pb-4 px-2 text-center text-slate-300">D</th>
                      <th className="pb-4 px-2 text-center text-slate-300">L</th>
                      <th className="pb-4 px-2 text-center font-bold text-slate-900">Pts</th>
                      <th className="pb-4 px-2 text-right font-black text-brand-emerald">Odds</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {group.standings.map((row: any) => (
                      <tr key={row.team.id} className="group/row hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-4">
                          <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-md ${
                            row.rank <= 2 ? 'bg-brand-emerald text-white' : 'text-slate-400'
                          }`}>
                            {row.rank}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <Link 
                            href={`/team/${row.team.slug}`}
                            className="flex items-center gap-3 group/team transition-all hover:translate-x-1"
                          >
                            <img src={row.team.logoUrl} alt={row.team.name} className="w-6 h-6 object-contain rounded-sm" />
                            <span className="text-sm font-bold text-brand-midnight whitespace-nowrap group-hover/team:text-brand-emerald">{row.team.name}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-2 text-center text-xs font-bold text-slate-600">{row.overall.played}</td>
                        <td className="py-4 px-2 text-center text-xs font-bold text-slate-300">{row.overall.wins}</td>
                        <td className="py-4 px-2 text-center text-xs font-bold text-slate-300">{row.overall.draws}</td>
                        <td className="py-4 px-2 text-center text-xs font-bold text-slate-300">{row.overall.losses}</td>
                        <td className="py-4 px-2 text-center text-sm font-black text-brand-midnight">{row.overall.points}</td>
                        <td className="py-4 px-2 text-right">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-brand-light-emerald text-[10px] font-black text-brand-emerald border border-brand-emerald/10 min-w-[40px] shadow-sm">
                            {(1.2 + (row.rank * 0.5) + (Math.random() * 0.2)).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fixtures for this group */}
            {group.fixtures && group.fixtures.length > 0 && (
              <div className="card !bg-slate-50/50 border-none">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full"></span>
                  Upcoming {group.name} Matches
                </h4>
                <div className="space-y-3">
                  {group.fixtures.slice(0, 3).map((match: any) => (
                    <Link 
                      key={match.id} 
                      href={`/match/${match.id}`}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-brand-emerald/30 transition-all group/match"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 w-[40%] justify-end">
                           <span className="text-xs font-bold text-brand-midnight truncate">{match.homeTeam.name}</span>
                           <img src={match.homeTeam.logo} alt="" className="w-4 h-4 object-contain" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300">VS</span>
                        <div className="flex items-center gap-2 w-[40%] justify-start">
                           <img src={match.awayTeam.logo} alt="" className="w-4 h-4 object-contain" />
                           <span className="text-xs font-bold text-brand-midnight truncate">{match.awayTeam.name}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {new Date(match.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
