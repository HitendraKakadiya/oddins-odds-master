import type { Metadata, Viewport } from 'next';
import { Proza_Libre } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const prozaLibre = Proza_Libre({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proza-libre',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://oddins-odds.com'),
  title: {
    default: 'Oddins Odds - Football Predictions & Betting Tips',
    template: '%s | Oddins Odds'
  },
  description: 'Expert football predictions, betting tips, and odds analysis for leagues worldwide. Get data-driven insights for Premier League, La Liga, and more.',
  keywords: ['football predictions', 'betting tips', 'soccer odds', 'match analysis', 'betting strategies'],
  authors: [{ name: 'Oddins Odds Team' }],
  creator: 'Oddins Odds',
  publisher: 'Oddins Odds',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oddins-odds.com',
    siteName: 'Oddins Odds',
    title: 'Oddins Odds - Football Predictions & Betting Tips',
    description: 'Expert football predictions and betting tips for leagues worldwide.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Oddins Odds - Football Predictions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oddins Odds - Football Predictions & Betting Tips',
    description: 'Expert football predictions and betting tips for leagues worldwide.',
    images: ['/images/og-image.png'],
    creator: '@oddinsodds',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={prozaLibre.className}>
    <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-537GMM34');`,
          }}
        />
      </head>
      <body className="bg-[#F8FAFC]">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-537GMM34"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
