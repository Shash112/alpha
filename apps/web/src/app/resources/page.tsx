'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  HelpCircle,
  Code2,
  FileText,
  ArrowRight,
  Search,
  Menu,
  X,
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      category: 'GUIDE',
      title: 'How to Choose the Best NFC Card Material for Your Corporate Brand',
      excerpt: 'Compare PVC, Bamboo, Matte Black Steel, and Gold Plated NFC cards for longevity, tap responsiveness, and brand impression.',
      date: 'Sep 12, 2026',
      readTime: '5 min read'
    },
    {
      category: 'STRATEGY',
      title: '10 Ways Digital Business Cards Increase Lead Conversion by 300%',
      excerpt: 'Learn how instant vCard contact downloads and embedded lead forms eliminate networking friction at conferences and trade shows.',
      date: 'Sep 08, 2026',
      readTime: '7 min read'
    },
    {
      category: 'ENTERPRISE',
      title: 'Setting Up Custom CNAME Domains for Corporate Identity Platforms',
      excerpt: 'A step-by-step technical guide for IT administrators configuring CNAME records, SSL certificates, and SAML SSO integration.',
      date: 'Aug 28, 2026',
      readTime: '8 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <MarketingHeader currentPath="/resources" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24 border-b border-slate-100 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
            <Zap className="w-3.5 h-3.5 fill-blue-600" />
            <span>KNOWLEDGE HUB & DEVELOPER RESOURCES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Guides, Documentation & Knowledge Base
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to set up digital visiting cards, configure custom domains, integrate APIs, and maximize networking ROI.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 mt-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, tutorials, or API docs..."
              className="w-full rounded-2xl bg-white border border-slate-200 shadow-lg pl-12 pr-4 py-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Resource Category Cards */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 hover:bg-white hover:shadow-xl transition-all">
              <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Help Center & Guides</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Step-by-step tutorials on card creation, custom vanity aliases, and lead form setup.
              </p>
              <Link href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <span>Browse Help Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 hover:bg-white hover:shadow-xl transition-all">
              <Code2 className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">API Documentation</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Complete REST API reference, OpenAPI schemas, webhook events, and SCIM endpoints.
              </p>
              <Link href="#" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                <span>View API Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 hover:bg-white hover:shadow-xl transition-all">
              <FileText className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Blog & Growth Insights</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Industry trends, networking strategies, NFC hardware reviews, and SaaS updates.
              </p>
              <Link href="#" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <span>Read Blog Posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Featured Articles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Featured Articles & Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                    {art.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">{art.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{art.excerpt}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{art.date}</span>
                    <span>{art.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
