import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">Oddins Odds</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/predictions" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Predictions
            </Link>
            <Link href="/leagues" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Leagues
            </Link>
            <Link href="/teams" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Teams
            </Link>
            <Link href="/streams" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Streams
            </Link>
            <Link href="/academy" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Academy
            </Link>
            <Link href="/trends" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Trends
            </Link>
          </div>

          {/* Right side - Search & Auth */}
          <div className="flex items-center space-x-4">
            <Link href="/search" className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/auth/login" className="btn-primary text-sm">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

