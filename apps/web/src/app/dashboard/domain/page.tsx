'use client';

import { useState } from 'react';
import { Globe, Check, AlertCircle } from 'lucide-react';

export default function DomainPage() {
  const [domain, setDomain] = useState('');

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Brand & Custom Domain Setup
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Host your digital identity cards on your company's custom domain name.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-6 max-w-2xl">
        <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
          Custom CNAME Mapping
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            Target Custom Domain
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="cards.yourcompany.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 font-mono focus:border-brand-600 focus:outline-none"
          />
        </div>

        <div className="p-4 rounded-xl bg-surface-secondary border border-slate-200 space-y-2 text-xs text-slate-700">
          <div className="font-bold text-navy-900 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-brand-600" />
            <span>DNS Configuration</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Create a CNAME record in your domain DNS settings pointing <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-navy-900">cards.yourcompany.com</code> to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-brand-600">cname.alpha.me</code>.
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition">
          Save & Verify CNAME Record
        </button>
      </div>
    </div>
  );
}
