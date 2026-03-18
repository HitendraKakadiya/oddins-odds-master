import ComboHero from '@/components/predictions/ComboHero';
import ComboSidebar from '@/components/predictions/ComboSidebar';
import ComboContent from '@/components/predictions/ComboContent';
import ComboFAQ from '@/components/predictions/ComboFAQ';

export const revalidate = 3600;

export default async function ComboPicksPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header Hero Title Section */}
            <div className="bg-slate-50 pt-20 pb-16 border-b border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                            <span className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.2em]">High Value Multi-Bets</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                            Expert Combo Picks
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Our analysts group today&apos;s most reliable predictions into high-value combos to maximize your potential returns with a smart, calculated approach.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area: 2 Columns */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Main Column */}
                    <div className="lg:col-span-8">
                        <ComboHero />
                        <ComboContent />
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 sticky top-24">
                        <ComboSidebar />
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <ComboFAQ />
        </main>
    );
}
