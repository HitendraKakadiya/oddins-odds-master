'use client';

import ContactForm from '@/components/ContactForm';
import { FiMail, FiGlobe } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      {/* Hero Header */}
      <div className="bg-brand-midnight pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 to-transparent pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Get in <span className="text-brand-emerald">Touch</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Have questions or feedback? We'd love to hear from you! Our team typically responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <ContactInfoCard 
              icon={<FiMail className="w-6 h-6" />}
              title="Customer Support"
              description="For general questions and user assistance."
              link="support@oddinsodds.com"
              href="mailto:support@oddinsodds.com"
            />
            <ContactInfoCard 
              icon={<FiGlobe className="w-6 h-6" />}
              title="Business Inquiries"
              description="Partnerships and advertising opportunities."
              link="business@oddinsodds.com"
              href="mailto:business@oddinsodds.com"
            />
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Send us a Message</h2>
                <p className="text-slate-500 font-medium">Fill out the form below and we'll get back to you shortly.</p>
              </div>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactInfoCard({ icon, title, description, link, href }: any) {
  return (
    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-brand-emerald/10 group">
      <div className="w-14 h-14 bg-brand-surface rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-brand-emerald/10 group-hover:text-brand-emerald transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
        {description}
      </p>
      <a 
        href={href}
        className="text-brand-emerald font-black text-sm uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2"
      >
        {link}
      </a>
    </div>
  );
}
