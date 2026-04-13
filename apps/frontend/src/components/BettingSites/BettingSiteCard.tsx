'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiZap, FiPlay, FiSmartphone, FiChevronDown, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaAndroid, FaApple } from 'react-icons/fa';

interface BettingSiteProps {
  id: string;
  name: string;
  logo: string;
  rating: number;
  payoutSpeed: string;
  payoutScore: number; // 0-100 for the gauge
  hasLiveStream: boolean;
  apps: ('android' | 'ios' | 'web')[];
  promoText: string;
  registerUrl: string;
  featured?: boolean;
}

export default function BettingSiteCard({
  name,
  logo,
  rating,
  payoutSpeed,
  payoutScore,
  hasLiveStream,
  apps,
  promoText,
  registerUrl,
  featured = false
}: BettingSiteProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`group transition-all duration-300 rounded-[36px] overflow-hidden mb-6 border ${
      featured 
        ? 'bg-[#E8E9FF] border-slate-200 shadow-lg shadow-indigo-100/50' 
        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
    }`}>
      <div className="p-6 lg:p-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
        {/* Brand Logo */}
        <div className="lg:w-1/6 flex justify-center">
          <div className="w-40 h-24 bg-brand-midnight rounded-3xl flex items-center justify-center p-6 shadow-sm overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
             {/* Mock logo since we don't have actual SVG/Images for brands */}
             <div className="text-white font-black text-xl italic tracking-tighter uppercase">
               {logo.startsWith('/') ? (
                  <Image src={logo} alt={name} width={120} height={40} className="object-contain" />
               ) : (
                  <span>{name}</span>
               )}
             </div>
             {featured && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink to-brand-emerald"></div>
             )}
          </div>
        </div>

        {/* Rating */}
        <div className="lg:w-1/6 flex flex-col items-center border-r border-slate-200/50 px-4">
           <div className="flex items-baseline gap-1">
             <span className="text-3xl font-black text-slate-800">{rating.toFixed(1)}</span>
             <span className="text-sm font-bold text-slate-400">/5</span>
           </div>
           <div className="flex gap-0.5 mt-2">
             {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
             ))}
           </div>
        </div>

        {/* Features Gauge & Icons */}
        <div className="lg:w-3/6 flex items-center justify-around px-8">
           {/* Payout Speed */}
           <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Payout Speed</span>
             <div className="relative w-16 h-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-slate-100"></div>
                <div 
                  className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-brand-emerald border-r-brand-emerald border-b-transparent border-l-transparent -rotate-45"
                  style={{ transform: `rotate(${((payoutScore / 100) * 180) - 135}deg)` }}
                ></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-200 origin-bottom"></div>
             </div>
             <span className="text-[11px] font-bold text-slate-600 mt-2">{payoutSpeed}</span>
           </div>

           {/* Live Stream */}
           <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Live Stream</span>
             {hasLiveStream ? (
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-brand-emerald">
                  <FiCheckCircle className="w-6 h-6" />
                </div>
             ) : (
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <FiXCircle className="w-6 h-6" />
                </div>
             )}
             <span className="text-[11px] font-bold text-slate-600 mt-2">{hasLiveStream ? 'Yes' : 'No'}</span>
           </div>

           {/* Supported Apps */}
           <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Supported Apps</span>
             <div className="flex gap-3">
               {apps.includes('android') && <FaAndroid className="w-6 h-6 text-emerald-500" />}
               {apps.includes('ios') && <FaApple className="w-6 h-6 text-slate-800" />}
               {apps.length === 0 && <FiSmartphone className="w-6 h-6 text-slate-300" />}
             </div>
             <span className="text-[11px] font-bold text-slate-600 mt-2">App Available</span>
           </div>
        </div>

        {/* Promo & CTA */}
        <div className="lg:w-2/6 flex flex-col items-center lg:items-end lg:pr-6 gap-4">
           <div className="text-center lg:text-right">
              <p className="text-sm font-bold text-slate-700 italic max-w-[200px]">
                {promoText}
              </p>
           </div>
           
           <div className="flex flex-col gap-2 w-full lg:w-48">
              <Link 
                href={registerUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-pink hover:opacity-90 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-widest text-center shadow-lg shadow-pink-200 transition-all active:scale-95"
              >
                Register Now
              </Link>
           </div>
        </div>
      </div>

      {/* Expandable Info */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white/50 backdrop-blur-sm py-3 flex items-center justify-center gap-2 group/info border-t border-slate-200/50 hover:bg-white transition-all"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-pink group-hover/info:text-brand-emerald">More Information</span>
        <FiChevronDown className={`w-4 h-4 text-brand-pink transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="p-8 bg-white border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                 <h4 className="font-black text-slate-900 mb-4">Pros</h4>
                 <ul className="space-y-2">
                    {['Fast Withdrawals', 'Competitive Odds', 'Excellent App'].map(p => (
                       <li key={p} className="flex items-center gap-2 text-sm text-slate-600">
                          <FiCheckCircle className="text-brand-emerald shrink-0" /> {p}
                       </li>
                    ))}
                 </ul>
              </div>
              <div>
                 <h4 className="font-black text-slate-900 mb-4">Cons</h4>
                 <ul className="space-y-2">
                    {['Limited eSports', 'Average Support Chat'].map(c => (
                       <li key={c} className="flex items-center gap-2 text-sm text-slate-600">
                          <FiXCircle className="text-brand-pink shrink-0" /> {c}
                       </li>
                    ))}
                 </ul>
              </div>
              <div>
                 <h4 className="font-black text-slate-900 mb-4">Payment Methods</h4>
                 <div className="flex flex-wrap gap-2">
                    {['Visa', 'Mastercard', 'Neteller', 'Skrill', 'UPI'].map(pm => (
                       <span key={pm} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500">{pm}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
