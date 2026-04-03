'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/academy', title: 'Academy Home' },
  { href: '/academy/strategies', title: 'Betting Strategies' },
  { href: '/academy/bet-type', title: 'Bet Types' },
  { href: '/academy/strategies/kelly-criterion', title: 'Kelly Criterion' },
];

export default function AcademySideNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
      <h3 className="font-black text-slate-900 mb-6 text-xs uppercase tracking-[0.2em]">Academy Menu</h3>
      <div className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block text-xs transition-all duration-200 border-l-2 pl-4 py-1 ${
              pathname === item.href
                ? 'text-brand-emerald font-black border-brand-emerald'
                : 'text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
