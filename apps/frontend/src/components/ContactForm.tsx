'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    alert('Form submitted! (Not actually implemented yet)');
    console.log('Form data:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none placeholder:text-slate-300 shadow-sm"
            placeholder="e.g. John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none placeholder:text-slate-300 shadow-sm"
            placeholder="e.g. john@example.com"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/5 transition-all outline-none placeholder:text-slate-300 shadow-sm resize-none"
          placeholder="Tell us what's on your mind..."
          required
        />
      </div>

      <button 
        type="submit" 
        className="w-full md:w-auto bg-brand-pink hover:bg-opacity-90 text-white font-black py-4 px-12 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-pink-100 transition-all active:scale-95"
      >
        Send Message
      </button>
    </form>
  );
}

