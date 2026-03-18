import PrimePickHero from '@/components/predictions/PrimePickHero';
import PrimePickFAQ from '@/components/predictions/PrimePickFAQ';
import { getFeaturedTips } from '@/lib/api/predictions';
import { Prediction } from '@/lib/api/types';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export default async function PrimePickPage() {
    // Fetch featured tips for the carousel
    const featuredData = await getFeaturedTips().catch(() => ({ tips: [] }));
    const apiTips = featuredData.tips;

    // Fallback data for development/empty state
    const fallbackTips: Prediction[] = [
        {
            id: 1,
            matchId: 33,
            title: "Top Value Pick",
            selection: "Manchester United Win",
            isPremium: true,
            league: { name: "Premier League", countryName: "England", slug: "premier-league" },
            homeTeam: { name: "Man Utd", logoUrl: "https://media.api-sports.io/football/teams/33.png" },
            awayTeam: { name: "Chelsea", logoUrl: "https://media.api-sports.io/football/teams/49.png" }
        },
        {
            id: 2,
            matchId: 40,
            title: "Expert Choice",
            selection: "Over 2.5 Goals",
            isPremium: true,
            league: { name: "La Liga", countryName: "Spain", slug: "la-liga" },
            homeTeam: { name: "Real Madrid", logoUrl: "https://media.api-sports.io/football/teams/541.png" },
            awayTeam: { name: "Barcelona", logoUrl: "https://media.api-sports.io/football/teams/529.png" }
        }
    ];

    const tips = apiTips && apiTips.length > 0 ? apiTips : fallbackTips;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <main className="min-h-screen bg-white">
            {/* 1. Hero Section with Carousel */}
            <PrimePickHero tips={tips} />

            {/* 2. Text Content Sections */}
            <div className="max-w-4xl mx-auto px-4 pt-20 pb-10 divide-y divide-slate-100">
                <section className="pb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">Why Trust Our Prime Prediction of the Day?</h2>
                    <div className="space-y-6 text-slate-600 font-medium leading-[1.8]">
                        <p>
                            At OddinsOdds, we keep things simple. Our goal is to give you the best bet of the day. We provide you with a tip that is smart and safe, and it is backed by some solid research. We go through hundreds of matches daily and pick the one that has the best chance of winning without taking big risks.
                        </p>
                        <p>
                            Our recommended football prediction comes from a clear look at the numbers and the match setup. Our recommended bet today is based on a clear and careful analysis, driven by data, match context, and a long-term approach. The potential return might be modest, but the chances of winning are higher. And in the end, that&apos;s what truly helps grow your bankroll.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">The Logic Behind Today&apos;s Top Tip</h2>
                    <div className="space-y-6 text-slate-600 font-medium leading-[1.8]">
                        <p>
                            You, as a bettor, know that high odds usually mean high risk. The real goal is to find bets where your chance of winning is better than what the odds suggest. That&apos;s what we call a bet with value.
                        </p>
                        <p>
                            Smart betting means staying focused and making calculated decisions. That&apos;s exactly what we aim for with our tip of the day. It&apos;s a safe bet backed by solid stats, low risk, and a strong chance of success. It&apos;s not about chasing big wins. It&apos;s about growing your bankroll steadily.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">How do we find the Ideal Value Bet?</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                <span className="text-2xl">📊</span>
                                <div className="text-sm">We start by looking at how teams and players have been performing</div>
                            </div>
                            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                <span className="text-2xl">🤖</span>
                                <div className="text-sm">We use prediction models built on past data</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                <span className="text-2xl">📉</span>
                                <div className="text-sm">We track odds and line changes from the bookmakers</div>
                            </div>
                            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                <span className="text-2xl">⚽</span>
                                <div className="text-sm">We factor in team news, injuries, weather, and motivation</div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* 3. FAQ Section */}
            <PrimePickFAQ />

        </main>
    );
}
