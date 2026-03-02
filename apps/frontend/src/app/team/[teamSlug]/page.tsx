import Link from 'next/link';
import { getTeamDetail, getFeaturedTeams } from '@/lib/api';
import TeamHeader from '@/components/team/TeamHeader';
import TeamNavigation from '@/components/team/TeamNavigation';
import TeamStandingsTable from '@/components/team/TeamStandingsTable';
import TeamStatsSection from '@/components/team/TeamStatsSection';
import TeamSquadList from '@/components/team/TeamSquadList';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

interface PageProps {
  params: {
    teamSlug: string;
  };
}

const mainTabs = [
  { key: 'summary', label: 'Summary' },
  { key: 'matches', label: 'Matches', href: '/fixtures' },
  { key: 'corners', label: 'Corners', href: '/corners' },
  { key: 'stats', label: 'Stats', href: '/stats' },
  { key: 'top-scorers', label: 'Top Scorers & Assists' },
  { key: 'squads', label: 'Squads' },
];

export default async function TeamDetailPage({ params }: PageProps) {
  let teamData: any = null;
  let featuredTeams: any[] = [];
  
  try {
    [teamData, featuredTeams] = await Promise.all([
      getTeamDetail(params.teamSlug),
      getFeaturedTeams().catch(() => [])
    ]);
  } catch (err) {
    console.error(`Error fetching team ${params.teamSlug}:`, err);
  }

  if (!teamData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg font-bold">Team information is currently unavailable</p>
          <p className="text-sm text-gray-400 mt-2">Try searching for the team again or check back later.</p>
        </div>
      </div>
    );
  }

  const { team, nextMatch, statsSummary, standings, squad, competitions } = teamData;

  // Calculate dynamic next/prev teams
  const currentIndex = featuredTeams.findIndex(t => t.slug === params.teamSlug);
  const prevTeam = currentIndex > 0 ? featuredTeams[currentIndex - 1] : featuredTeams[featuredTeams.length - 1];
  const nextTeam = currentIndex < featuredTeams.length - 1 ? featuredTeams[currentIndex + 1] : featuredTeams[0];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <TeamNavigation 
        nextTeam={nextTeam ? { 
          name: nextTeam.name, 
          slug: nextTeam.slug, 
          logoUrl: nextTeam.logo || nextTeam.logoUrl 
        } : undefined} 
        prevTeam={prevTeam ? { 
          name: prevTeam.name, 
          slug: prevTeam.slug, 
          logoUrl: prevTeam.logo || prevTeam.logoUrl 
        } : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/teams" className="hover:text-primary-600 transition-colors">Teams</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-black">{team.name}</span>
        </div>

        <TeamHeader team={team} competitions={competitions || []} />

        {/* Categories Tabs */}
        <div className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm mb-8 inline-flex items-center flex-wrap">
            {mainTabs.map((tab) => (
                <Link
                    key={tab.key}
                    href={tab.href ? `/team/${params.teamSlug}${tab.href}` : `/team/${params.teamSlug}`}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                        tab.key === 'summary' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50/50'
                    }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>

        <TeamStandingsTable standings={standings || []} currentTeamId={team.id} />
        
        <TeamStatsSection 
          teamName={team.name} 
          stats={statsSummary} 
          venue={team.venue}
          city={team.city}
        />

        <TeamSquadList squad={squad || []} />
      </div>
    </div>
  );
}
