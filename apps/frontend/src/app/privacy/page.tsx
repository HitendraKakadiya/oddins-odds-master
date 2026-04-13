'use client';

import { useState, useEffect } from 'react';
import { FiShield, FiLock, FiInfo, FiEye, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const SECTIONS = [
  { id: 'introduction', title: 'Introduction', icon: <FiInfo /> },
  { id: 'age-restriction', title: 'Age Restriction (18+)', icon: <FiAlertCircle /> },
  { id: 'affiliate-disclosure', title: 'Affiliate Disclosure', icon: <FiCheckCircle /> },
  { id: 'information-collect', title: 'Information We Collect', icon: <FiEye /> },
  { id: 'how-we-use', title: 'How We Use Information', icon: <FiShield /> },
  { id: 'cookies', title: 'Cookie Policy', icon: <FiLock /> },
  { id: 'third-parties', title: 'Third-Party Links', icon: <FiGlobeIcon /> },
];

function FiGlobeIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

export default function PrivacyPage() {
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
            <div className="w-16 h-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center text-brand-emerald mb-8 animate-bounce">
              <FiShield className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Privacy <span className="text-brand-emerald">Center</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium">
              We take your privacy seriously. This policy outlines how we handle your data and our commitments to transparency and security.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">On This Page</h3>
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
                      Welcome to OddinsOdds. We are committed to maintaining the trust and confidence of all visitors to our website. 
                      In this Privacy Policy, we provide detailed information on when and why we collect personal information, 
                      how we use it, the limited conditions under which we may disclose it to others, and how we keep it secure.
                    </p>
                    <p>
                      By using our site, you consent to the collection and use of information in accordance with this policy.
                    </p>
                 </section>

                 <section id="age-restriction" className="scroll-mt-32 mb-16 bg-brand-emerald/5 p-8 rounded-3xl border border-brand-emerald/10">
                    <h2 className="flex items-center gap-3 !mt-0">
                      <FiAlertCircle className="text-brand-emerald" />
                      Age Restriction (18+)
                    </h2>
                    <p>
                      <strong>OddinsOdds is intended strictly for adults aged 18 and over.</strong> We do not knowingly collect personal 
                      identifiable information from children under 18. If you are a parent or guardian and you are aware that your child 
                      has provided us with personal data, please contact us.
                    </p>
                 </section>

                 <section id="affiliate-disclosure" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Affiliate Disclosure</h2>
                    <p>
                      OddinsOdds is a sports betting affiliate website. This means we may receive commissions or other compensation 
                      from the bookmakers and betting services listed on our site when you click on links and register an account.
                    </p>
                    <p>
                      This compensation helps support our efforts to provide free content and data analysis to our users. 
                      Our reviews and rankings are independent and based on our team's analysis of the market.
                    </p>
                 </section>

                 <section id="information-collect" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Information We Collect</h2>
                    <p>We may collect and process the following data about you:</p>
                    <ul>
                      <li><strong>Personal Data:</strong> Email address and name, only if you voluntarily provide them (e.g., via contact forms).</li>
                      <li><strong>Technical Data:</strong> Your internet protocol (IP) address, browser type and version, time zone setting, operating system and platform.</li>
                      <li><strong>Usage Data:</strong> Information about how you use our website, including the full Uniform Resource Locators (URL) clickstream to, through, and from our site.</li>
                    </ul>
                 </section>

                 <section id="how-we-use" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">How We Use Your Information</h2>
                    <p>We use the data we collect in the following ways:</p>
                    <ul>
                      <li>To facilitate and track affiliate registrations with our partners.</li>
                      <li>To improve our website structure, content, and user experience.</li>
                      <li>To provide you with technical support and respond to your inquiries.</li>
                      <li>To monitor and analyze trends and usage in connection with our services.</li>
                    </ul>
                 </section>

                 <section id="cookies" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Cookie Policy</h2>
                    <p>
                      Cookies are small text files placed on your device to collect standard internet log information and visitor 
                      behavior information. We use cookies for the following purposes:
                    </p>
                    <ul>
                      <li><strong>Affiliate Attribution:</strong> To identify which partner website you came from and to credit our site for any subsequent registrations.</li>
                      <li><strong>Analytics:</strong> To understand how visitors interact with our content (e.g., Google Analytics).</li>
                      <li><strong>Personalization:</strong> To remember your preferences and settings for future visits.</li>
                    </ul>
                    <p>
                      You can set your browser not to accept cookies, but some of our website features may not function as 
                      a result.
                    </p>
                 </section>

                 <section id="third-parties" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Third-Party Links</h2>
                    <p>
                      Our website contains links to other websites (notably bookmakers like Parimatch, 1xBet, etc.). 
                      This Privacy Policy only applies to OddinsOdds. When you click on a link to another website, 
                      you should read their own privacy policy carefully.
                    </p>
                    <p>
                      We have no control over and assume no responsibility for the content, privacy policies, or 
                      practices of any third-party sites or services.
                    </p>
                 </section>

                 <div className="pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm font-bold text-slate-400">
                      Questions? Contact our data team at{' '}
                      <a href="mailto:privacy@oddinsodds.com" className="!text-brand-emerald">
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

