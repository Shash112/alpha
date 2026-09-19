'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, Check, Sparkles, ArrowRight, Eye } from 'lucide-react';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'Professional',
      name: 'Professional Corporate',
      category: 'Business',
      desc: 'Navy header, structured contact grid, and corporate branding badge.',
      color: '#2563EB',
      popular: true
    },
    {
      id: 'Executive',
      name: 'Executive Leadership',
      category: 'Executive',
      desc: 'High-contrast monochrome theme with emphasis on bio and credentials.',
      color: '#0F172A',
      popular: false
    },
    {
      id: 'Minimal',
      name: 'Clean Minimalist',
      category: 'Design',
      desc: 'Typography-first layout with clean whitespace and soft border surfaces.',
      color: '#059669',
      popular: false
    },
    {
      id: 'Creative',
      name: 'Creative Studio',
      category: 'Agency',
      desc: 'Vibrant accent colors with hero image gallery and portfolio CTA.',
      color: '#7C3AED',
      popular: false
    },
    {
      id: 'Modern',
      name: 'Modern Tech & SaaS',
      category: 'Technology',
      desc: 'Balanced digital layout optimized for founders, engineers, and sales.',
      color: '#0284C7',
      popular: true
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Card Templates Gallery
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Explore curated starting layouts for your professional digital business card.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 flex flex-col justify-between space-y-5 hover:border-brand-500 transition-all card-surface-hover relative overflow-hidden"
          >
            {tmpl.popular && (
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                Popular
              </span>
            )}

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs" style={{ backgroundColor: tmpl.color }}>
                {tmpl.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{tmpl.desc}</p>
              </div>
            </div>

            <Link
              href={`/dashboard/cards/builder`}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-slate-200 text-navy-900 text-xs font-bold hover:bg-brand-600 hover:text-white hover:border-brand-600 transition"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
