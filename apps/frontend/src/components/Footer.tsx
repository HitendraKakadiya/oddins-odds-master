import Link from 'next/link';

export default function Footer() {
  const footerSections = [
    {
      title: "Today's Main Matches",
      links: [
        { name: "Bologna vs Milan", href: "/match/bologna-milan" },
        { name: "Bragantino vs Atlético-MG", href: "/match/bragantino-atletico" },
        { name: "Flamengo vs Internacional", href: "/match/flamengo-internacional" },
        { name: "Santos vs São Paulo", href: "/match/santos-sao-paulo" },
        { name: "Remo vs Mirassol", href: "/match/remo-mirassol" },
      ]
    },
    {
      title: "Today's Top Predictions",
      links: [
        { name: "Hermannstadt vs Rapid București", href: "/predictions/hermannstadt-rapid" },
        { name: "Dordrecht vs Helmond Sport", href: "/predictions/dordrecht-helmond" },
        { name: "Port Vale vs AFC Wimbledon", href: "/predictions/port-vale-wimbledon" },
        { name: "Bravo vs Mura", href: "/predictions/bravo-mura" },
        { name: "AZ vs Twente", href: "/predictions/az-twente" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Authors", href: "/authors" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookies", href: "/cookies" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Sitemap", href: "/sitemap" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Predictions", href: "/predictions" },
        { name: "Betting Sites", href: "/betting-sites" },
        { name: "Leagues", href: "/leagues" },
        { name: "Teams", href: "/teams" },
        { name: "Streams", href: "/streams" },
        { name: "Academy", href: "/academy" },
      ]
    },
    {
      title: "Betting Sites",
      links: [
        { name: "Megapari Nigeria Review", href: "/betting-sites/megapari-nigeria" },
        { name: "Mozzartbet Nigeria Review", href: "/betting-sites/mozzartbet-nigeria" },
        { name: "Betano Nigeria Review", href: "/betting-sites/betano-nigeria" },
        { name: "Sky247 Review Nigeria", href: "/betting-sites/sky247-nigeria" },
        { name: "Rajabets India Review", href: "/betting-sites/rajabets-india" },
      ]
    }
  ];

  return (
    <footer className="bg-brand-dark-blue border-t border-white/5 mt-16 py-16 text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-xs text-gray-300 hover:text-brand-pink transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-indigo rounded-full flex items-center justify-center text-white font-bold text-xs border border-white/20 shadow-lg shadow-brand-indigo/20">OO</div>
              <span className="font-bold text-white">OddinsOdds</span>
           </div>
           <p className="text-xs text-gray-400">
             &copy; {new Date().getFullYear()} OddinsOdds. All rights reserved.
           </p>
        </div>
      </div>
    </footer>
  );
}

