import AcademyHero from '@/components/Academy/AcademyHero';
import AcademyFeatureCards from '@/components/Academy/AcademyFeatureCards';
import AcademyContent from '@/components/Academy/AcademyContent';
import AcademyAuthor from '@/components/Academy/AcademyAuthor';
import AcademySideNav from '@/components/Academy/AcademySideNav';
import TodaysMatchesWidget from '@/components/About/TodaysMatchesWidget';

export default function AcademyPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AcademyHero />
          <div id="top" className="scroll-mt-24">
            <AcademyFeatureCards />
          </div>
          <AcademyContent />
          <AcademyAuthor />
        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <div className="sticky top-24 space-y-8">
            <AcademySideNav />
            <div className="hidden lg:block">
              <TodaysMatchesWidget />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
