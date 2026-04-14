import { Metadata } from 'next';
import { Suspense } from 'react';
import Hero from '@/components/BettingSites/Hero';
import BettingSitesMain from '@/components/BettingSites/BettingSitesMain';

export const metadata: Metadata = {
  title: 'Best Betting Sites in India 2024',
  description: 'Compare the best online betting sites in India. Our experts review and rank top bookmakers based on odds, bonuses, payout speed, and security.',
};

interface Site {
  id: string;
  name: string;
  logo: string;
  rating: number;
  payoutSpeed: string;
  payoutScore: number;
  hasLiveStream: boolean;
  apps: string[];
  promoText: string;
  featured: boolean;
  registerUrl: string;
  defaultParams?: Record<string, string>;
  payments: string[];
  minDeposit: number;
  verifyNeeded: string;
  supportTypes: string[];
}

const MOCK_SITES: Site[] = [
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

export default function BettingSitesPage() {
  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <Hero />
        <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin"></div></div>}>
          <BettingSitesMain initialSites={MOCK_SITES} />
        </Suspense>
      </div>
    </div>
  );
}
  