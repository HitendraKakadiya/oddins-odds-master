import Link from 'next/link';

export default function Header() {
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
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-brand-indigo rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform">
              OO
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">OddinsOdds</span>
          </Link>

          {/* Main Navigation */}
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
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-brand-indigo hover:bg-slate-100 transition-all border border-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

