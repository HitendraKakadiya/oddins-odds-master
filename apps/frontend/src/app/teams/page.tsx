'use client';

import PopularTeamsList from '@/components/PopularTeamsList';
import TeamsDirectory from '@/components/TeamsDirectory';
import Link from 'next/link';

export default function TeamsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar: Popular Teams */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <PopularTeamsList />
        </aside>

        {/* Main Content: Teams Directory */}
        <main className="flex-1 min-w-0">
          <TeamsDirectory />
        </main>
      </div>
    </div>
  );
}
