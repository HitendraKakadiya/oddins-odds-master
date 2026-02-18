'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  leagueAverage?: string | number;
  color?: string;
}

function StatCard({ label, value, leagueAverage, color = 'brand-indigo' }: StatCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center">
      <div className={`w-full bg-${color} py-3 text-center`}>
        <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="p-6 text-center">
        <div className="text-2xl font-black text-slate-800 mb-1">{value}</div>
        {leagueAverage && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            League: {leagueAverage}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchStatsOverview() {
  const stats = [
    { label: 'Goal Average', value: '3.89', leagueAverage: '3.53' },
    { label: 'Both Teams to Score', value: '61%', leagueAverage: '67%' },
    { label: 'Over 1.5+', value: '93%', leagueAverage: '88%', color: 'brand-indigo' },
    { label: 'Over 2.5+', value: '75%', leagueAverage: '69%' },
    { label: 'Cards', value: '-1.78', leagueAverage: '0' },
    { label: 'Corners', value: '3', leagueAverage: '8.37' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
