import Link from 'next/link';
import { getTeamDetail, getFeaturedTeams } from '@/lib/api';
import TeamHeader from '@/components/team/TeamHeader';
import TeamNavigation from '@/components/team/TeamNavigation';

import TeamTabsContent from '@/components/team/TeamTabsContent';

// ISR: Revalidate - disabled for dev troubleshooting
export const revalidate = 0;

interface PageProps {
  params: {
    teamSlug: string;
    tab?: string;
  };
  searchParams: {
    league?: string;
  };
}

export default async function TeamDetailPage({ params, searchParams }: PageProps) {
  let teamData: any = null;
  let featuredTeams: any[] = [];
  
  try {
    [teamData, featuredTeams] = await Promise.all([
      getTeamDetail(params.teamSlug, searchParams.league),
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

  const { 
    team, 
    statsSummary, 
    standings, 
    squad, 
    competitions, 
    nextMatch, 
    nextMatchDetail,
    recentMatches,
    topScorers,
    topAssists,
    detailedStats,
    activeLeagueId
  } = teamData;

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

        <TeamTabsContent 
          team={team}
          standings={standings}
          statsSummary={statsSummary}
          squad={squad}
          nextMatch={nextMatch}
          nextMatchDetail={nextMatchDetail}
          recentMatches={recentMatches}
          topScorers={topScorers}
          topAssists={topAssists}
          detailedStats={detailedStats}
          competitions={competitions}
          activeLeagueId={activeLeagueId}
        />
      </div>
    </div>
  );
}
