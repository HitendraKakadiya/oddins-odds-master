'use client';

interface LeagueStatsAnalysisProps {
  leagueName: string;
  season: string;
  stats: {
    matchesPlayed: number;
    totalMatches: number;
    totalGoals: number;
    avgGoals: number;
    homeWins: number;
    awayWins: number;
    draws: number;
    over25Percent: number;
    under25Percent: number;
    mostCommonScore: string;
    offensive: { best: string; worst: string; bestGoals: number; worstGoals: number };
    defensive: { best: string; worst: string; bestGoals: number; worstGoals: number };
    consistency: { mostWins: string; fewestWins: string; mostDraws: string; fewestDraws: string; mostLosses: string; fewestLosses: string };
    playerStats: { topScorer: string; topScorerGoals: number; topAssist: string; topAssistCount: number };
  };
}

export default function LeagueStatsAnalysis({ leagueName, season, stats }: LeagueStatsAnalysisProps) {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 mb-12">
      <div className="max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-black text-brand-dark-blue mb-6">
          {leagueName}: Standings and Season Statistics {season}
        </h2>
        
        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed mb-12">
          <p className="mb-4">
            Here you will find a complete overview of the current standings of {leagueName} {season}, with data designed to help you stay well-informed about the matches in this competition.
          </p>
          <p className="mb-4">
            In addition to checking each team&apos;s position in the {leagueName} standings, OddinsOdds provides a broader view of the league, such as identifying the strongest home team, the team with the most draws, and many other key statistics from this competition.
          </p>
          <p className="mb-10">
            Below, we list the most important information extracted from the {leagueName} {season} table up to the present moment.
          </p>

          <h3 className="text-xl md:text-2xl font-black text-brand-indigo mb-6">
             {leagueName} Table: Statistics You Only Find Here
          </h3>
          <p className="mb-4">
            We use a unique method that highlights multiple classifications within {leagueName}, providing detailed and in-depth data about this football competition.
          </p>
          <p className="mb-10">
            All information is 100% free and updated daily, so you always have access to reliable data whenever and wherever you need it.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="space-y-16">
          {/* Season Standings and Numbers */}
          <StatsSection title="Season Standings and Numbers">
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatItem label="Number of matches played" value={`${stats.matchesPlayed}/${stats.totalMatches}`} />
                <StatItem label="Total goals scored" value={stats.totalGoals} />
                <StatItem label="Average goals per match" value={stats.avgGoals.toFixed(2)} />
                <StatItem label="Home wins" value={stats.homeWins} />
                <StatItem label="Away wins" value={stats.awayWins} />
                <StatItem label="Draws" value={stats.draws} />
                <StatItem label="Matches with over 2.5 goals" value={`${stats.over25Percent}%`} />
                <StatItem label="Matches with under 2.5 goals" value={`${stats.under25Percent}%`} />
                <StatItem label="Most common scoreline" value={stats.mostCommonScore} />
             </ul>
          </StatsSection>

          {/* Team Statistics */}
          <StatsSection title={`Team Statistics in ${leagueName} ${season}`}>
             <div className="space-y-8">
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Offensive and Defensive Performance</h4>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <StatItem label="Best attack" team={stats.offensive.best} value={`${stats.offensive.bestGoals} goals scored`} />
                      <StatItem label="Worst attack" team={stats.offensive.worst} value={`${stats.offensive.worstGoals} goals scored`} />
                      <StatItem label="Best defense" team={stats.defensive.best} value={`${stats.defensive.bestGoals} goals conceded`} />
                      <StatItem label="Worst defense" team={stats.defensive.worst} value={`${stats.defensive.worstGoals} goals conceded`} />
                   </ul>
                </div>

                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Results and Consistency</h4>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <StatItem label="Team with the most wins" team={stats.consistency.mostWins} />
                      <StatItem label="Team with the fewest wins" team={stats.consistency.fewestWins} />
                      <StatItem label="Team with the most draws" team={stats.consistency.mostDraws} />
                      <StatItem label="Team with the fewest draws" team={stats.consistency.fewestDraws} />
                      <StatItem label="Team with the most losses" team={stats.consistency.mostLosses} />
                      <StatItem label="Team with the fewest losses" team={stats.consistency.fewestLosses} />
                   </ul>
                </div>
             </div>
          </StatsSection>

          {/* Individual Player Statistics */}
          <StatsSection title="Individual Player Statistics">
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatItem label={`Top scorer in ${leagueName}`} player={stats.playerStats.topScorer} value={`${stats.playerStats.topScorerGoals} goals`} />
                <StatItem label="Top assist provider" player={stats.playerStats.topAssist} value={`${stats.playerStats.topAssistCount} assists`} />
             </ul>
          </StatsSection>
        </div>
      </div>
    </div>
  );
}

function StatsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-black text-brand-dark-blue mb-8">{title}</h3>
      {children}
    </div>
  );
}

function StatItem({ label, value, team, player }: { label: string; value?: string | number; team?: string; player?: string }) {
  return (
    <li className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0"></div>
      <span className="text-slate-500 font-bold">{label}:</span>
      {team && <span className="text-brand-indigo font-black underline decoration-2 underline-offset-4 cursor-pointer">{team}</span>}
      {player && <span className="text-brand-indigo font-black underline decoration-2 underline-offset-4 cursor-pointer">{player}</span>}
      {team || player ? <span className="text-slate-400 font-bold">-</span> : null}
      {value !== undefined && <span className="text-slate-800 font-black">{value}</span>}
    </li>
  );
}
