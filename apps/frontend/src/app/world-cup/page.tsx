import { Metadata } from 'next';
import WorldCupHero from '@/components/world-cup/WorldCupHero';
import TournamentFavourites from '@/components/world-cup/TournamentFavourites';
import MatchCarousel from '@/components/world-cup/MatchCarousel';
import GroupStageFixtures from '@/components/world-cup/GroupStageFixtures';
import WorldCupMatchesList from '@/components/world-cup/WorldCupMatchesList';
import { getWorldCupData, getWorldCupFavourites } from '@/lib/api/worldCup';

export const metadata: Metadata = {
  title: 'FIFA World Cup Standings & Schedule',
  description: 'Complete guide to FIFA World Cup. Get latest standings, schedule, group stage fixtures, and featured matches.',
};

export default async function WorldCupPage() {
  // Fetch real-time data from our new backend endpoint
  const data = await getWorldCupData();
  const favourites = await getWorldCupFavourites();

  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      <WorldCupHero season={data.season} />
      
      <div className="space-y-8 mt-4">
        <TournamentFavourites favourites={favourites} />
        
        <div className="bg-white py-8 border-y border-slate-200">
           <MatchCarousel matches={data.allFixtures} />
        </div>
        
        {/* Main Tournament Standings */}
        <GroupStageFixtures groups={data.groups} />

        {/* Tabular Tournament Schedule grouped by Date */}
        <WorldCupMatchesList matches={data.allFixtures} />
      </div>
    </div>
  );
}
