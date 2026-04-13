'use client';

import { useState } from 'react';
import { FiChevronDown, FiStar, FiMonitor, FiSmartphone, FiCreditCard, FiFilter } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaWallet, FaUniversity, FaAndroid, FaApple, FaComments, FaPhoneAlt, FaEnvelope, FaPlayCircle } from 'react-icons/fa';

interface FilterSectionProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="border-b border-slate-100 last:border-0 pb-6 mb-6">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider group-hover:text-brand-emerald transition-colors">
          {title}
        </h3>
        <FiChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${open ? 'rotate-180 text-brand-emerald' : ''}`} />
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  icon?: React.ReactNode;
}

function CheckboxItem({ label, icon }: CheckboxItemProps) {
  return (
    <label className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        {icon && <div className="text-slate-400 group-hover:text-brand-emerald transition-colors">{icon}</div>}
        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
      </div>
      <input 
        type="checkbox" 
        className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald focus:ring-offset-0 transition-all cursor-pointer" 
      />
    </label>
  );
}

interface FilterSidebarProps {
  filters: {
    ratings: number[];
    payments: string[];
    apps: string[];
    minDeposit: number;
    verifyNeeded: string[];
    supportTypes: string[];
    stream: string[];
  };
  onFilterChange: (category: string, value: any) => void;
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const toggleFilter = (category: string, value: any) => {
    onFilterChange(category, value);
  };

  return (
    <aside className="w-full lg:w-[320px] bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-brand-emerald/10 rounded-xl flex items-center justify-center text-brand-emerald">
          <FiFilter className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Filter By</h2>
      </div>

      <FilterSection title="Rating">
        <div className="space-y-4">
          {[5, 4.5].map((stars) => (
            <label key={stars} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-4 h-4 ${i < Math.floor(stars) ? 'text-amber-400 fill-amber-400' : (i < stars ? 'text-amber-400 opacity-50' : 'text-slate-200')}`} />
                ))}
              </div>
              <input 
                type="checkbox" 
                checked={filters.ratings.includes(stars)}
                onChange={() => toggleFilter('ratings', stars)}
                className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald transition-all cursor-pointer" 
              />
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Deposit & Withdrawal">
        <div className="space-y-3">
          {[
            { id: 'visa', label: 'Visa', icon: <FaCcVisa /> },
            { id: 'mastercard', label: 'Mastercard', icon: <FaCcMastercard /> },
            { id: 'e-wallet', label: 'E-Wallets', icon: <FaWallet /> },
            { id: 'bank-transfer', label: 'Bank Transfer', icon: <FaUniversity /> },
          ].map((m) => (
            <label key={m.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="text-slate-400 group-hover:text-brand-emerald transition-colors">{m.icon}</div>
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{m.label}</span>
              </div>
              <input 
                type="checkbox" 
                checked={filters.payments.includes(m.id)}
                onChange={() => toggleFilter('payments', m.id)}
                className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald transition-all cursor-pointer" 
              />
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Mobile App">
        {[
          { id: 'android', label: 'Android App', icon: <FaAndroid /> },
          { id: 'ios', label: 'iOS App', icon: <FaApple /> },
        ].map((a) => (
          <label key={a.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-slate-400 group-hover:text-brand-emerald transition-colors">{a.icon}</div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{a.label}</span>
            </div>
            <input 
              type="checkbox" 
              checked={filters.apps.includes(a.id)}
              onChange={() => toggleFilter('apps', a.id)}
              className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald transition-all cursor-pointer" 
            />
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Minimum Deposit">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
          <input 
            type="number" 
            value={filters.minDeposit || ''}
            onChange={(e) => toggleFilter('minDeposit', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand-emerald transition-all outline-none"
          />
        </div>
      </FilterSection>

      <FilterSection title="Needs to Verify Account?">
        {['Yes', 'No'].map((v) => (
          <label key={v} className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{v}</span>
            <input 
              type="checkbox" 
              checked={filters.verifyNeeded.includes(v)}
              onChange={() => toggleFilter('verifyNeeded', v)}
              className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald transition-all cursor-pointer" 
            />
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Support Type">
        {[
          { id: 'chat', label: 'Chat', icon: <FaComments /> },
          { id: 'phone', label: 'Phone', icon: <FaPhoneAlt /> },
          { id: 'email', label: 'Email', icon: <FaEnvelope /> },
        ].map((s) => (
          <label key={s.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-slate-400 group-hover:text-brand-emerald transition-colors">{s.icon}</div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{s.label}</span>
            </div>
            <input 
              type="checkbox" 
              checked={filters.supportTypes.includes(s.id)}
              onChange={() => toggleFilter('supportTypes', s.id)}
              className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald transition-all cursor-pointer" 
            />
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Stream">
        {['Yes', 'No'].map((s) => (
          <label key={s} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              {s === 'Yes' && <FaPlayCircle className="text-slate-400 group-hover:text-brand-emerald" />}
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{s}</span>
            </div>
            <input 
              type="checkbox" 
              checked={filters.stream.includes(s)}
              onChange={() => toggleFilter('stream', s)}
              className="w-5 h-5 rounded-lg border-slate-200 text-brand-emerald focus:ring-brand-emerald transition-all cursor-pointer" 
            />
          </label>
        ))}
      </FilterSection>
    </aside>
  );
}
