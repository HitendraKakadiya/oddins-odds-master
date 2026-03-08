import TeamsDirectory from '@/components/TeamsDirectory';
import PopularTeamsList from '@/components/PopularTeamsList';

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: Teams Directory (Left Side) - Now order-2 on mobile */}
          <main className="flex-1 min-w-0 order-2 lg:order-1">
            <TeamsDirectory />
          </main>

          {/* Sidebar (Right Side) - Now order-1 on mobile */}
          <aside className="lg:w-[380px] flex-shrink-0 order-1 lg:order-2">
            <div className="sticky top-24">
              <PopularTeamsList />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
