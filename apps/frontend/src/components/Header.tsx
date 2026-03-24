'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiBarChart2, FiCalendar, FiGrid, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  const toggleMobileDropdown = (itemName: string) => {
    setExpandedMobileItem(expandedMobileItem === itemName ? null : itemName);
  };

  const navItems = [
    { 
      name: 'Predictions', 
      href: '/predictions', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Predictions', href: '/predictions', icon: <FiBarChart2 className="w-5 h-5 text-indigo-500" />, description: 'Daily football predictions' },
        { name: 'Prime Betting Pick', href: '/predictions/prime-pick', icon: <FiCalendar className="w-5 h-5 text-brand-pink" />, description: 'Our top expert daily choice' },
        { name: 'Expert Combo Picks', href: '/predictions/combo-picks', icon: <FiGrid className="w-5 h-5 text-brand-emerald" />, description: 'Highly rated multi-bet combos' },
      ]
    },
    { name: 'Betting Sites', href: '/betting-sites' },
    { 
      name: 'Statistics', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Match Insights', href: '/insights', icon: <FiBarChart2 className="w-5 h-5 text-brand-emerald" />, description: 'Top statistical streaks & trends' },
        { name: 'Hot Stats', href: '/statistics/hot-stats', icon: <FiGrid className="w-5 h-5 text-indigo-500" />, description: 'High probability statistical outcomes' },
      ]
    },
    { name: 'Leagues', href: '/leagues' },
    { name: 'Teams', href: '/teams' },
    { name: 'Streams', href: '/streams' },
    { name: 'Academy', href: '/academy' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-emerald rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-brand-emerald/20 group-hover:scale-105 transition-transform">
              OO
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">OddinsOdds</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group py-2 px-3"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="text-slate-600 hover:text-brand-emerald font-bold flex items-center transition-all text-sm px-2 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <FiChevronDown className={`ml-1 w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                ) : (
                  <div className="text-slate-600 hover:text-brand-emerald font-bold flex items-center transition-all text-sm px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-default">
                    {item.name}
                    {item.hasDropdown && (
                      <FiChevronDown className={`ml-1 w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                )}

                {/* Dropdown Menu */}
                {item.hasDropdown && item.dropdownItems && (
                  <div className={`absolute top-full left-0 w-80 pt-2 transition-all duration-200 origin-top ${openDropdown === item.name ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}>
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-3">
                      <div className="grid gap-2">
                         {item.dropdownItems.map((dropItem) => (
                           <Link 
                             key={dropItem.name}
                             href={dropItem.href}
                             className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group/item"
                           >
                              <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm group-hover/item:bg-white transition-colors">
                                  {dropItem.icon}
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-slate-900 group-hover/item:text-brand-emerald transition-colors">{dropItem.name}</div>
                                 <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{dropItem.description}</div>
                              </div>
                           </Link>
                         ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-600 hover:text-brand-emerald hover:bg-slate-100 transition-all border border-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/60 py-4 animate-in slide-in-from-top duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <div key={item.name} className="px-2">
                  {item.hasDropdown ? (
                    <button
                      onClick={() => toggleMobileDropdown(item.name)}
                      className={`w-full px-4 py-4 font-bold flex items-center justify-between transition-all rounded-xl text-lg ${
                        expandedMobileItem === item.name ? 'bg-slate-50 text-brand-emerald' : 'text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <FiChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${expandedMobileItem === item.name ? 'rotate-180 text-brand-emerald' : ''}`} />
                    </button>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-4 text-slate-900 hover:text-brand-emerald hover:bg-slate-50 font-bold flex items-center justify-between transition-colors rounded-xl text-lg"
                    >
                      {item.name}
                    </Link>
                  ) : null}
                  
                  {item.hasDropdown && item.dropdownItems && expandedMobileItem === item.name && (
                     <div className="px-4 pb-2 grid gap-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                        {item.dropdownItems.map((dropItem) => (
                            <Link 
                                key={dropItem.name}
                                href={dropItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 group transition-all"
                            >
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                                    {dropItem.icon}
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="text-sm font-bold text-slate-700 group-hover:text-brand-emerald">{dropItem.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{dropItem.description}</span>
                                </div>
                            </Link>
                        ))}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
