import type { LeagueStats } from '@/lib/api/types';

interface MatchStatsOverviewProps {
  stats?: LeagueStats | null;
}

interface StatCardProps {
  label: string;
  value: string | number;
  leagueAverage?: string | number;
  color?: string;
}

function StatCard({ label, value, color = 'brand-indigo' }: StatCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center">
      <div className={`w-full bg-${color} py-3 text-center`}>
        <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="p-6 text-center">
        <div className="text-2xl font-black text-slate-800 mb-1">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          League Average
        </div>
      </div>
    </div>
  );
}

export default function MatchStatsOverview({ stats }: MatchStatsOverviewProps) {
  if (!stats) return null;

  const data = [
    { label: 'Goal Average', value: stats.goalsAvg },
    { label: 'BTTS Rate', value: `${stats.bttsRate}%` },
    { label: 'Over 1.5+', value: `${stats.over15Rate}%` },
    { label: 'Over 2.5+', value: `${stats.over25Rate}%` },
    { label: 'Corners', value: '8.4', color: 'slate-400' }, // Placeholder for corners as not in seed yet
    { label: 'Cards', value: '3.2', color: 'slate-400' }  // Placeholder for cards
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
      {data.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
