import Link from 'next/link';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import OfferSection from '@/components/About/OfferSection';

export default function AuthorDetailsPage({ params }: { params: { slug: string } }) {
  const authors = [
    {
      id: 1,
      name: "John Doe",
      slug: "john-doe",
      role: "Content Manager",
      image: "",
      updatedAt: "8 January 2026",
      publishedAt: "8 January 2026",
      bio: "John is a journalist and content creator with over 7 years of experience in sports betting. At OddinsOdds, he lives football and betting markets, and outside the screen he's also a marathon runner always chasing performance.",
      socials: { linkedin: "#", instagram: "#", twitter: "#" },
      funFacts: [
        "I know the capital of all African countries",
        "I like to see and keep track of the Brazilian B Series",
        "Currently Marathon Training (for the index for any of the Majors)",
        "I'd prefer Ituano vs. Sampaio Corrêa than Manchester City x Arsenal"
      ]
    },
    {
      id: 2,
      name: "Michael Smith",
      slug: "michael-smith",
      role: "Content Producer",
      image: "",
      updatedAt: "12 February 2026",
      publishedAt: "10 February 2026",
      bio: "Michael finds narrative in numbers. With a background in data science and a passion for the Premier League, he brings a unique analytical perspective to every match preview.",
      socials: { linkedin: "#", instagram: "#", twitter: "#" },
      funFacts: [
        "I have watched every World Cup final since 1990",
        "Collector of vintage football kits",
        "Can name the starting XI of the 2005 Champions League final from memory"
      ]
    },
    {
      id: 3,
      name: "David Johnson",
      slug: "david-johnson",
      role: "Senior Analyst",
      image: "",
      updatedAt: "5 March 2026",
      publishedAt: "1 March 2026",
      bio: "David is the tactical brain of the team. A former youth coach turned analyst, he breaks down formations and player movements to give bettors the edge they need.",
      socials: { linkedin: "#", instagram: "#", twitter: "#" },
      funFacts: [
        "Published a book on modern pressing tactics",
        "Cycling enthusiast",
        "Believes Xavi was better than Iniesta"
      ]
    }
  ];

  const author = authors.find(a => a.slug === params.slug);

  if (!author) {
    return (
        <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Author Not Found</h1>
            <Link href="/authors" className="text-brand-pink hover:underline mt-4 inline-block">Back to Authors</Link>
        </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
      <div className="max-w-4xl mx-auto text-center">
         
         <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-[0_0_0_2px_#ec4899] bg-slate-100 mx-auto">
               <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-indigo-100 to-purple-50">
                  👨‍💻
               </div>
            </div>
         </div>
         
         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-4 sm:mb-6">{author.name}</h1>

         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-sm text-slate-500 font-medium mb-8 sm:mb-12 bg-slate-50/50 py-3 sm:py-0 rounded-xl sm:bg-transparent">
            <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm.002 16H5V8h14l.002 12z"/><path d="M11 10h2v5H9v-2h2z"/><path d="M13 15h-2v2h2zM9 10H7v2h2z"/><path d="M7 15h2v2H7z"/><path d="M15 10h2v2h-2z"/><path d="M17 15h-2v2h2z"/></svg>
               <span>Updated: {author.updatedAt}</span>
            </div>
            <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
               <span>Published: {author.publishedAt}</span>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 text-left shadow-sm mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Brief Story</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
               {author.bio}
            </p>
            <div className="flex items-center gap-4 text-brand-indigo">
               <Link href={author.socials.linkedin || '#'} className="hover:text-brand-pink transition-colors">
                  <FaLinkedin size={20} />
               </Link>
               <Link href={author.socials.instagram || '#'} className="hover:text-brand-pink transition-colors">
                  <FaInstagram size={20} />
               </Link>
               <Link href={author.socials.twitter || '#'} className="hover:text-brand-pink transition-colors">
                  <FaTwitter size={20} />
               </Link>
            </div>
         </div>

         {/* Fun Facts Card */}
         <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 text-left shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">{author.name.split(' ')[0]}&rsquo;s Fun Facts</h2>
            <ul className="space-y-3">
               {author.funFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></span>
                     <span>{fact}</span>
                  </li>
               ))}
            </ul>
          </div>

          <div className="max-w-4xl mx-auto">
             <OfferSection />
          </div>

      </div>
    </div>
  );
}
