'use client';

import { Puzzle, Check, ArrowUpRight } from 'lucide-react';

export default function IntegrationsPage() {
  const apps = [
    { name: 'Razorpay Billing', category: 'Payments', status: 'Connected', desc: 'SaaS subscription engine & Razorpay webhook processing.' },
    { name: 'PostgreSQL Database', category: 'Storage', status: 'Connected', desc: 'Transactional identity store & lead history.' },
    { name: 'Redis Cache & Queue', category: 'Infrastructure', status: 'Connected', desc: 'Background analytics queue & session caching.' },
    { name: 'S3 Media Storage', category: 'Files', status: 'Connected', desc: 'AWS S3 object storage for profile avatars & media assets.' },
    { name: 'Google Calendar API', category: 'Appointments', status: 'Available', desc: 'Sync meeting bookings directly with Google Calendar.' },
    { name: 'Zapier / Webhooks', category: 'Automation', status: 'Available', desc: 'Push captured contacts automatically to Salesforce, HubSpot, or Slack.' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          App Integrations Directory
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Connect your digital identity ecosystem with CRMs, payment providers, and cloud services.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 card-surface-hover"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                  <Puzzle className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  app.status === 'Connected'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {app.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-navy-900">{app.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{app.desc}</p>
              </div>
            </div>

            <div className="pt-2 text-xs font-bold text-brand-600 flex items-center space-x-1 cursor-pointer hover:text-brand-700">
              <span>Configure Integration</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
