'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Building2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Zap,
  Globe,
  Briefcase
} from 'lucide-react';

import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function SolutionsPage() {
  const solutionsList = [
    {
      icon: User,
      title: 'For Individuals & Executives',
      tagline: 'Stand out. Be remembered.',
      description: 'Build your personal digital card profile, showcase work portfolios, attach direct contact details, and expand your professional network.',
      features: [
        'Personal vanity URLs (alpha.com/your-name)',
        'One-tap vCard downloads & QR sharing',
        'Direct link to LinkedIn, Twitter & Portfolios',
        'Built-in visitor lead capture form'
      ],
      ctaText: 'Create Your Card Free',
      ctaHref: '/register'
    },
    {
      icon: Building2,
      title: 'For Growing Teams & SMBs',
      tagline: 'Unified brand identity for your workforce.',
      description: 'Provision digital business cards for all employees, enforce brand guidelines, manage roles, and collect lead analytics centrally.',
      features: [
        'Centralized brand asset & color locking',
        'Departmental grouping & role permissions',
        'Aggregated team lead collection feed',
        'Discounted seat volume pricing'
      ],
      ctaText: 'Start Team Trial',
      ctaHref: '/register'
    },
    {
      icon: Briefcase,
      title: 'For Enterprises & Corporations',
      tagline: 'Enterprise-grade security and automated governance.',
      description: 'Scale identity management across thousands of employees with custom CNAME domains, SSO/SAML login, and automated SCIM offboarding.',
      features: [
        'Custom domain CNAME mapping (card.yourbrand.com)',
        'Single Sign-On (SSO / SAML 2.0 integration)',
        'Bulk CSV employee auto-provisioning',
        'SOC2 compliant multi-tenant security'
      ],
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/contact'
    },
    {
      icon: Award,
      title: 'For Resellers & Agency Partners',
      tagline: 'Expand your agency revenue with white-label cards.',
      description: 'Deliver digital visiting card solutions to your client portfolio with custom white-label portals, client sub-workspaces, and commission tracking.',
      features: [
        'Complete white-label dashboard & public rendering',
        'Dedicated reseller management portal',
        'Flexible client seat allocations',
        'Partner revenue share & commission payout'
      ],
      ctaText: 'Become a Partner',
      ctaHref: '/contact'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <MarketingHeader currentPath="/solutions" />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
            <Zap className="w-3.5 h-3.5 fill-blue-600" />
            <span>TAILORED INDUSTRY SOLUTIONS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Built for Professionals, Teams, Enterprises & Partners
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover how Alpha scales seamlessly from single digital cards to enterprise-wide employee card deployments and reseller white-label networks.
          </p>
        </div>
      </section>

      {/* Solutions Cards List */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          {solutionsList.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 p-8 sm:p-12 rounded-3xl border border-slate-200/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:bg-white hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{sol.title}</h2>
                    <p className="text-sm font-semibold text-blue-600 mt-1">{sol.tagline}</p>
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed">{sol.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {sol.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="shrink-0 w-full lg:w-auto">
                  <Link
                    href={sol.ctaHref}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
                  >
                    <span>{sol.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
