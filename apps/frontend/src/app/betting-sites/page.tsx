'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/BettingSites/Hero';
import FilterSidebar from '@/components/BettingSites/FilterSidebar';
import BettingSiteCard from '@/components/BettingSites/BettingSiteCard';
import SEOContent from '@/components/BettingSites/SEOContent';
import { FiChevronDown, FiFilter } from 'react-icons/fi';

const MOCK_SITES = [
  {
    id: '1',
    name: 'PARIMATCH',
    logo: 'PARIMATCH',
    rating: 5.0,
    payoutSpeed: '1-3 Days',
    payoutScore: 95,
    hasLiveStream: true,
    apps: ['android'],
    promoText: 'Claim up to INR 20,000 Welcome Bonus',
    featured: true,
    registerUrl: 'https://pm-betting.com/en/choose-reg/regtel/1',
    defaultParams: {
      qtag: 'a5123_r61311120_c4339_s',
      redirect_creative_id: '4339',
      x_pm_click: 'c9961ca5adac30b3dec908a641f5f0f4'
    },
    payments: ['visa', 'mastercard', 'e-wallet', 'bank-transfer'],
    minDeposit: 300,
    verifyNeeded: 'No',
    supportTypes: ['chat', 'phone', 'email']
  },
  {
    id: '2',
    name: '1XBET',
    logo: '1XBET',
    rating: 4.5,
    payoutSpeed: '1-2 Days',
    payoutScore: 88,
    hasLiveStream: true,
    apps: ['android', 'ios'],
    promoText: 'Get the best odds in the industry',
    featured: false,
    registerUrl: 'https://indi-1xbet.com/en/registration',
    defaultParams: {
      tag: 'd_3953268m_2895c_IN_review',
      type: 'phone',
      bonus: 'SPORT_SINGLE',
      currency: 'INR'
    },
    payments: ['visa', 'mastercard', 'e-wallet'],
    minDeposit: 500,
    verifyNeeded: 'Yes',
    supportTypes: ['chat', 'email']
  },
  {
    id: '3',
    name: 'RAJABETS',
    logo: 'RAJABETS',
    rating: 4.5,
    payoutSpeed: '1-3 Days',
    payoutScore: 82,
    hasLiveStream: true,
    apps: ['android'],
    promoText: 'Discover thousands of betting markets',
    featured: false,
    registerUrl: 'https://rajabets3.com/en/promotions/Welcome-sports-bonus/',
    defaultParams: {
      token: 'sdC5VxatXW27Ng5mKaTqJ2NdYZqqdRLk'
    },
    payments: ['visa', 'e-wallet', 'bank-transfer'],
    minDeposit: 200,
    verifyNeeded: 'No',
    supportTypes: ['chat', 'phone']
  },
  {
    id: '4',
    name: 'DAFABET',
    logo: 'DAFABET',
    rating: 4.5,
    payoutSpeed: '2-4 Days',
    payoutScore: 75,
    hasLiveStream: true,
    apps: ['android', 'ios'],
    promoText: 'Largest Indian Bookmaker',
    featured: false,
    registerUrl: 'https://df.dafapromo.com/adlta/in/index.html',
    defaultParams: {
      btag: '672279_39baa15d33734090ab1e8e51b229c0bc',
      utm_source: '672279',
      utm_medium: 'affiliate',
      source_id: '74639',
      utm_campaign: '18341'
    },
    payments: ['visa', 'mastercard', 'bank-transfer'],
    minDeposit: 1000,
    verifyNeeded: 'Yes',
    supportTypes: ['chat', 'phone', 'email']
  },
  {
    id: '5',
    name: 'NEXTBET',
    logo: 'NEXTBET',
    rating: 4.5,
    payoutSpeed: '1-3 Days',
    payoutScore: 80,
    hasLiveStream: true,
    apps: ['android', 'ios'],
    promoText: 'Join now and claim your bonus',
    featured: false,
    registerUrl: 'https://amkt.promonb.com/asl/reg/in/',
    defaultParams: {
      btag: '689684_a0af50227e1a46178d8e9ea3a2473752',
      utm_source: '689684',
      utm_medium: 'affiliate',
      source_id: '75059&utm_campaign=19507'
    },
    payments: ['e-wallet', 'bank-transfer'],
    minDeposit: 400,
    verifyNeeded: 'No',
    supportTypes: ['chat', 'email']
  },
  {
    id: '6',
    name: '22BET',
    logo: '22BET',
    rating: 4.5,
    payoutSpeed: '1-2 Days',
    payoutScore: 85,
    hasLiveStream: true,
    apps: ['android', 'ios'],
    promoText: 'Get a bonus up to 10300 INR',
    featured: false,
    registerUrl: 'https://22luckzone.com/registration',
    defaultParams: {
      btag: '451831_260a76759df542f785da31a7efb27ba5'
    },
    payments: ['visa', 'mastercard', 'e-wallet', 'bank-transfer'],
    minDeposit: 100,
    verifyNeeded: 'Yes',
    supportTypes: ['chat', 'phone']
  }
];

function BettingSitesContent() {
  const [sortBy, setSortBy] = useState('Rating (High to Low)');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState({
    ratings: [] as number[],
    payments: [] as string[],
    apps: [] as string[],
    minDeposit: 0,
    verifyNeeded: [] as string[],
    supportTypes: [] as string[],
    stream: [] as string[]
  });

  const searchParams = useSearchParams();

  const handleFilterChange = (category: string, value: any) => {
    setFilters(prev => {
      if (category === 'minDeposit') {
        return { ...prev, minDeposit: value };
      }
      
      const cat = category as keyof typeof prev;
      const current = prev[cat];
      
      if (Array.isArray(current)) {
        const newValue = (current as any[]).includes(value)
          ? (current as any[]).filter(item => item !== value)
          : [...current, value];
        return { ...prev, [cat]: newValue };
      }
      return prev;
    });
  };

  const filteredAndSortedSites = MOCK_SITES
    .filter(site => {
      if (filters.ratings.length > 0 && !filters.ratings.includes(site.rating)) return false;
      if (filters.payments.length > 0 && !filters.payments.some(p => site.payments.includes(p))) return false;
      if (filters.apps.length > 0 && !filters.apps.some(a => site.apps.includes(a))) return false;
      if (filters.minDeposit > 0 && site.minDeposit > filters.minDeposit) return false;
      if (filters.verifyNeeded.length > 0 && !filters.verifyNeeded.includes(site.verifyNeeded)) return false;
      if (filters.supportTypes.length > 0 && !filters.supportTypes.some(s => site.supportTypes.includes(s))) return false;
      if (filters.stream.length > 0) {
        const wantsStream = filters.stream.includes('Yes');
        const wantsNoStream = filters.stream.includes('No');
        if (wantsStream && !wantsNoStream && !site.hasLiveStream) return false;
        if (!wantsStream && wantsNoStream && site.hasLiveStream) return false;
      }
      return true;
    })
    .map(site => {
      try {
        const url = new URL(site.registerUrl);
        if (site.defaultParams) {
          Object.entries(site.defaultParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
          });
        }
        searchParams.forEach((value, key) => {
          url.searchParams.set(key, value);
        });
        return { ...site, registerUrl: url.toString() };
      } catch (e) {
        return site;
      }
    })
    .sort((a, b) => {
      if (sortBy === 'Rating (High to Low)') return b.rating - a.rating;
      if (sortBy === 'Rating (Low to High)') return a.rating - b.rating;
      if (sortBy === 'Payout Score') return b.payoutScore - a.payoutScore;
      return 0;
    });

  const sortOptions = [
    'Rating (High to Low)',
    'Rating (Low to High)',
    'Payout Score'
  ];

  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <Hero />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Sort & Info Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                 <div className="relative bg-white border border-slate-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                   <span className="text-sm font-bold text-slate-400">Sort By</span>
                   <button 
                     onClick={() => setIsSortOpen(!isSortOpen)}
                     className="flex items-center gap-2 text-sm font-black text-slate-800 hover:text-brand-emerald transition-colors"
                   >
                      {sortBy}
                      <FiChevronDown className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                   </button>

                   {isSortOpen && (
                     <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                       {sortOptions.map((option) => (
                         <button
                           key={option}
                           onClick={() => {
                             setSortBy(option);
                             setIsSortOpen(false);
                           }}
                           className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${sortBy === option ? 'text-brand-emerald bg-brand-emerald/5' : 'text-slate-600 hover:bg-slate-50'}`}
                         >
                           {option}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-black text-slate-900">Bet responsibly, 18+</span>
              </div>
            </div>

            {/* Site List */}
            <div className="space-y-6">
              {filteredAndSortedSites.length > 0 ? (
                filteredAndSortedSites.map((site) => (
                  <BettingSiteCard 
                    key={site.id}
                    {...site}
                    apps={site.apps as ('android' | 'ios' | 'web')[]}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FiFilter className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
              )}
            </div>

            {/* SEO Content */}
            <div className="mt-16">
              <SEOContent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BettingSitesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-surface flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin"></div></div>}>
      <BettingSitesContent />
    </Suspense>
  );
}
  