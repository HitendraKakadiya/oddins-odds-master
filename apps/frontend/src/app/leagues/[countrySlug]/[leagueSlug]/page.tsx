import { Metadata } from 'next';
import Link from 'next/link';
import { getLeagueDetail } from '@/lib/api/leagues';
import LeagueHero from '@/components/leagues/LeagueHero';
import LeagueTabsClient from '@/components/leagues/LeagueTabsClient';

interface PageProps {
  params: {
    countrySlug: string;
    leagueSlug: string;
  };
}

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const data = await getLeagueDetail(params.countrySlug, params.leagueSlug);
    if (!data) return { title: 'League Not Found' };
    
    return {
      title: `${data.league.name} ${data.season?.year || ''} Standings, Matches & Stats`,
      description: `Get the latest ${data.league.name} standings, comprehensive match stats, upcoming fixtures, and precise predictions for the ${data.season?.year ? `${data.season.year}/${data.season.year+1}` : ''} season.`,
    };
  } catch (err) {
    return { title: 'League Details' };
  }
}

export default async function LeagueDetailPage({ params }: PageProps) {
  let data;
  try {
    data = await getLeagueDetail(params.countrySlug, params.leagueSlug);
  } catch(e) {
    data = null;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
        <h2 className="text-2xl font-black text-slate-800 mb-2">League Not Found</h2>
        <p className="text-slate-500 mb-8">The league you are looking for does not exist or has been removed.</p>
        <Link href="/leagues" className="bg-brand-indigo text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-indigo/20">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 bg-white/50 self-start px-4 py-2 rounded-full border border-slate-100/60 shadow-sm backdrop-blur-sm">
          <Link href="/" className="hover:text-brand-indigo transition-colors uppercase">Home</Link>
          <span className="text-slate-200">/</span>
          <Link href="/leagues" className="hover:text-brand-indigo transition-colors uppercase">Leagues</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand-indigo uppercase">{data.league.name}</span>
        </div>

        <LeagueHero 
          league={data.league} 
          season={data.season} 
          stats={{ 
            teamCount: data.standings?.length || 0, 
            matchesPlayed: data.statsSummary?.matchesPlayed || 0, 
            totalMatches: data.statsSummary?.totalMatches || 0
          }} 
        />

        <LeagueTabsClient data={data} />
      </div>
    </div>
  );
}
