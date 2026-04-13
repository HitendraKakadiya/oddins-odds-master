'use client';

import { useState, useEffect } from 'react';
import { FiUserCheck, FiFileText, FiAlertTriangle, FiShield, FiLock } from 'react-icons/fi';

function FiGavelIcon({ className }: { className?: string }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14.5 2L3.5 13L10.5 20L21.5 9L14.5 2Z"></path>
      <path d="M7 16.5L1 22.5"></path>
      <path d="M21 7L23 9"></path>
      <path d="M15 1L17 3"></path>
    </svg>
  );
}

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance of Terms', icon: <FiCheckCircleIcon /> },
  { id: 'eligibility', title: 'Eligibility (18+)', icon: <FiUserCheck /> },
  { id: 'intellectual-property', title: 'Intellectual Property', icon: <FiFileText /> },
  { id: 'user-obligations', title: 'User Obligations', icon: <FiLock /> },
  { id: 'disclaimer', title: 'Limitation of Liability', icon: <FiAlertTriangle /> },
  { id: 'affiliate-links', title: 'Third-Party Links', icon: <FiGlobeIcon /> },
  { id: 'governing-law', title: 'Governing Law', icon: <FiShield /> },
];

function FiCheckCircleIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function FiGlobeIcon({ className }: { className?: string }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance');

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
            <div className="w-16 h-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center text-brand-emerald mb-8 animate-in zoom-in duration-500">
              <FiGavelIcon className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Terms & <span className="text-brand-emerald">Conditions</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium">
              Legal framework for using our and its data. Please read these terms carefully before participating in any betting activities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Legal Center</h3>
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

          {/* Legal Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-8 md:p-16 prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed prose-li:text-slate-600 prose-li:font-medium prose-a:text-brand-emerald prose-a:font-black prose-a:no-underline hover:prose-a:underline">
                 
                 <section id="acceptance" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">1. Acceptance of Terms</h2>
                    <p>
                      By accessing and using OddinsOdds, you agree to be bound by these Terms and Conditions. If you do not agree 
                      with any part of these terms, you must not use our website. These terms apply to all visitors, users, 
                      and others who access or use the Service.
                    </p>
                 </section>

                 <section id="eligibility" className="scroll-mt-32 mb-16 bg-brand-emerald/5 p-8 rounded-3xl border border-brand-emerald/10">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 !mt-0 flex items-center gap-3">
                      <FiUserCheck className="text-brand-emerald" />
                      2. Eligibility (18+)
                    </h2>
                    <p>
                      You must be at least 18 years of age or the legal age for gambling in your jurisdiction to use this website. 
                      OddinsOdds does not knowingly offer services to individuals under the legal age. Verification of age may be 
                      required by our third-party partners.
                    </p>
                 </section>

                 <section id="intellectual-property" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">3. Intellectual Property</h2>
                    <p>
                      The Service and its original content, features, and functionality are and will remain the exclusive property of 
                      OddinsOdds and its licensors. Our trademarks and brand identity may not be used in connection with any product 
                      or service without our prior written consent.
                    </p>
                 </section>

                 <section id="user-obligations" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">4. User Obligations</h2>
                    <p>
                      As a user of OddinsOdds, you agree to:
                    </p>
                    <ul>
                      <li>Provide accurate and complete information when prompted.</li>
                      <li>Use the service only for lawful purposes.</li>
                      <li>Not attempt to reverse engineer, scrape, or automate the data provided without explicit permission.</li>
                      <li>Not use our brand or data to promote unauthorized gambling services.</li>
                    </ul>
                 </section>

                 <section id="disclaimer" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                       <FiAlertTriangle className="text-amber-500" />
                       5. Limitation of Liability
                    </h2>
                    <p>
                      OddinsOdds provides data and information for entertainment purposes only. We are not a bookmaker and do not 
                      accept bets ourselves. We make no guarantees regarding the accuracy of odds or information provided.
                    </p>
                    <p>
                      <strong>You acknowledge that betting involves risk.</strong> Under no circumstances shall OddinsOdds be liable 
                      for any betting losses, financial damage, or other secondary losses resulting from your use of information 
                      found on our site.
                    </p>
                 </section>

                 <section id="affiliate-links" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">6. Third-Party Links & Affiliate Relationship</h2>
                    <p>
                      Our Service contains links to third-party web sites or services (e.g., Parimatch, 1xBet) that are not 
                      owned or controlled by OddinsOdds. 
                    </p>
                    <p>
                      We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any 
                      third-party web sites or services. You further acknowledge and agree that OddinsOdds shall not be 
                      responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by 
                      or in connection with use of any such content or services.
                    </p>
                 </section>

                 <section id="governing-law" className="scroll-mt-32 mb-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">7. Governing Law</h2>
                    <p>
                      These Terms shall be governed and construed in accordance with the laws of India, without regard to its 
                      conflict of law provisions. Any disputes arising from these terms will be resolved in the competent 
                      courts of India.
                    </p>
                 </section>

                 <div className="pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm font-bold text-slate-400">
                      Legal inquiries? Contact our counsel at{' '}
                      <a href="mailto:legal@oddinsodds.com" className="!text-brand-emerald">
                        legal@oddinsodds.com
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
