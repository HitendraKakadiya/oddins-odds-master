'use client';

import { useState, useEffect } from 'react';
import { FiLock, FiSettings, FiActivity, FiInfo, FiLayers, FiShield } from 'react-icons/fi';

const SECTIONS = [
  { id: 'introduction', title: 'Introduction', icon: <FiInfo /> },
  { id: 'what-are-cookies', title: 'What are Cookies?', icon: <FiLayers /> },
  { id: 'how-we-use', title: 'How We Use Them', icon: <FiActivity /> },
  { id: 'categories', title: 'Cookie Categories', icon: <FiSettings /> },
  { id: 'managing-cookies', title: 'Managing Preferences', icon: <FiLock /> },
  { id: 'third-parties', title: 'Third-Party Cookies', icon: <FiShieldIcon /> },
];

function FiShieldIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

export default function CookiesPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface pb-24">
      {/* Hero Header */}
      <div className="bg-brand-midnight pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 to-transparent pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink mb-8 animate-pulse">
              <FiSettings className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Cookie <span className="text-brand-emerald">Center</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium">
              We use cookies to enhance your experience, analyze site traffic, and support our partnerships with trusted bookmakers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Knowledge Base</h3>
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      activeSection === section.id 
                        ? 'bg-brand-emerald/10 text-brand-emerald shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-lg opacity-70 group-hover:opacity-100">{section.icon}</span>
                    <span className="text-left">{section.title}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-8 pt-8 border-t border-slate-100 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Last updated: {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-8 md:p-16 prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed prose-li:text-slate-600 prose-li:font-medium prose-a:text-brand-emerald prose-a:font-black prose-a:no-underline hover:prose-a:underline">
                 
                 <section id="introduction" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Introduction</h2>
                    <p>
                      This Cookies Policy explains how OddinsOdds uses cookies and similar technologies to recognize you when you 
                      visit our website. It explains what these technologies are and why we use them, as well as your rights to 
                      control our use of them.
                    </p>
                    <p>
                      By continuing to browse our site, you agree to our use of cookies as described in this policy.
                    </p>
                 </section>

                 <section id="what-are-cookies" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">What are Cookies?</h2>
                    <p>
                      Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                      Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
                      as well as to provide reporting information.
                    </p>
                    <p>
                      Cookies set by the website owner (OddinsOdds) are called "first-party cookies". Cookies set by parties 
                      other than the website owner are called "third-party cookies".
                    </p>
                 </section>

                 <section id="how-we-use" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">How We Use Cookies</h2>
                    <p>
                      We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
                      reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
                      Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online 
                      Properties.
                    </p>
                 </section>

                 <section id="categories" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Cookie Categories</h2>
                    <ul>
                      <li><strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
                      <li><strong>Performance & Functionality:</strong> These are used to enhance the performance and functionality of our website but are non-essential to their use.</li>
                      <li><strong>Analytics & Customization:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used.</li>
                    </ul>
                 </section>

                 <section id="managing-cookies" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Managing Cookie Preferences</h2>
                    <p>
                      You have the right to decide whether to accept or reject cookies. You can set or amend your web browser 
                      controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website 
                      though your access to some functionality and areas of our website may be restricted.
                    </p>
                    <p>
                      Most browsers allow you to:
                    </p>
                    <ul>
                      <li>See what cookies you've got and delete them on an individual basis.</li>
                      <li>Block third-party cookies.</li>
                      <li>Block cookies from particular sites.</li>
                    </ul>
                 </section>

                 <section id="third-parties" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Third-Party Cookies</h2>
                    <p>
                      In addition to our own cookies, we also use various third-party cookies to report usage statistics 
                      of the website and deliver advertisements. These include:
                    </p>
                    <ul>
                      <li><strong>Google Analytics:</strong> To analyze how users interact with the site.</li>
                      <li><strong>Bookmaker Partners:</strong> Individual tracking cookies from Parimatch, 1xBet, Rajabets, etc., to manage referral attribution.</li>
                    </ul>
                 </section>

                 <div className="pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm font-bold text-slate-400">
                      Still have questions? Reach out at{' '}
                      <a href="mailto:privacy@oddinsodds.com" className="!text-brand-pink">
                        privacy@oddinsodds.com
                      </a>
                    </p>
                 </div>

               </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
