'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Predictions', href: '/predictions', hasDropdown: true },
    { name: 'Betting Sites', href: '/betting-sites' },
    { name: 'Statistics', href: '/statistics', hasDropdown: true },
    { name: 'Leagues', href: '/leagues' },
    { name: 'Teams', href: '/teams' },
    { name: 'Streams', href: '/streams' },
    { name: 'Academy', href: '/academy' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-indigo rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform">
              OO
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">OddinsOdds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-slate-600 hover:text-brand-indigo font-semibold flex items-center transition-colors text-sm"
              >
                {item.name}
                {item.hasDropdown && (
                  <svg className="w-4 h-4 ml-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>

          {/* Right side - UI Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-brand-indigo hover:bg-slate-100 transition-all border border-slate-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-600 hover:text-brand-indigo hover:bg-slate-100 transition-all border border-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/60 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-slate-600 hover:text-brand-indigo hover:bg-slate-50 font-semibold flex items-center justify-between transition-colors rounded-lg"
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
