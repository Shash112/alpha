'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  Zap,
  ArrowRight,
  Menu,
  X,
  HelpCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);

  const pricingPlans = [
    {
      name: 'Free Personal',
      family: 'Free Plan',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      period: 'forever',
      description: 'Essential digital business card for freelancers and individual professionals.',
      features: [
        '1 Active Digital Card',
        'Dynamic Vector QR Code export',
        'Standard Card Template',
        'vCard (.vcf) Contact Download',
        'Basic Profile Views Analytics'
      ],
      highlight: false,
      ctaText: 'Get Started Free',
      ctaHref: '/register'
    },
    {
      name: 'Personal Pro',
      family: 'Pro Plan',
      priceMonthly: '₹499',
      priceAnnual: '₹399',
      period: 'per month',
      description: 'Advanced identity tools with custom branding, vanity aliases, and CRM lead capture.',
      features: [
        'Up to 5 Active Cards',
        'Custom Vanity URL Alias (alpha.com/alias)',
        'Remove Alpha Brand Watermark',
        'Lead Capture Form & CRM Lite',
        'NFC Tap Card Software Routing',
        'Real-time Detailed Analytics'
      ],
      highlight: true,
      badge: 'MOST POPULAR',
      ctaText: 'Start Pro Trial',
      ctaHref: '/register'
    },
    {
      name: 'Team & SMB',
      family: 'Team Plan',
      priceMonthly: '₹1,499',
      priceAnnual: '₹1,199',
      period: 'per month',
      description: 'Centralized management for growing businesses and team employee directories.',
      features: [
        'Up to 25 Team Cards',
        'Centralized Brand Guidelines & Lock templates',
        'Bulk CSV Employee Provisioning',
        'Departmental Grouping & Role RBAC',
        'Team Aggregated Lead Feed',
        'Priority Email & Chat Support'
      ],
      highlight: false,
      ctaText: 'Start Team Trial',
      ctaHref: '/register'
    },
    {
      name: 'Enterprise / Agency',
      family: 'Enterprise',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      period: 'tailored pricing',
      description: 'Custom CNAME domains, white-label branding, SSO/SAML, and reseller portals.',
      features: [
        'Unlimited Employee Cards',
        'Custom CNAME Domain (card.yourbrand.com)',
        'Full White-label Branding',
        'Single Sign-On (SSO / SAML 2.0)',
        'Dedicated Account Manager',
        'Reseller Agency Revenue Portal'
      ],
      highlight: false,
      ctaText: 'Contact Sales',
      ctaHref: '/contact'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/alpha-logo.png" alt="Alpha" width={120} height={32} className="h-8 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/product" className="hover:text-blue-600 transition-colors">Product</Link>
            <Link href="/solutions" className="hover:text-blue-600 transition-colors">Solutions</Link>
            <Link href="/pricing" className="text-blue-600 font-bold">Pricing</Link>
            <Link href="/resources" className="hover:text-blue-600 transition-colors">Resources</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-700">
              <Link href="/product">Product</Link>
              <Link href="/solutions">Solutions</Link>
              <Link href="/pricing" className="text-blue-600">Pricing</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24 border-b border-slate-100 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
            <Zap className="w-3.5 h-3.5 fill-blue-600" />
            <span>TRANSPARENT CONFIGURATION PRICING</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Simple Plans for Every Stage of Growth
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade as your business expands. All plans include dynamic QR sharing and mobile vCard downloads.
          </p>

          {/* Monthly / Annual Billing Switch */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-semibold ${!annualBilling ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-14 h-8 rounded-full bg-blue-600 p-1 transition-colors relative"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  annualBilling ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-semibold ${annualBilling ? 'text-slate-900' : 'text-slate-500'}`}>Annual Billing</span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, idx) => {
              const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                    plan.highlight
                      ? 'bg-slate-950 text-white border-blue-500 shadow-2xl scale-105 z-10'
                      : 'bg-slate-50/70 text-slate-900 border-slate-200/80 hover:bg-white hover:shadow-xl'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 ${plan.highlight ? 'text-blue-400' : 'text-blue-600'}`}>
                      {plan.family}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                      <span className={`text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                    </div>
                    <p className={`text-xs mb-6 leading-relaxed ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                      {plan.description}
                    </p>

                    <ul className={`space-y-3 text-xs pt-6 border-t ${plan.highlight ? 'border-slate-800' : 'border-slate-200/80'}`}>
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-blue-400' : 'text-blue-600'}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={plan.ctaHref}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-xs font-semibold transition active:scale-95 ${
                        plan.highlight
                          ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/30'
                          : 'bg-slate-900 text-white hover:bg-blue-600'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-xs text-slate-500 space-y-4">
          <div>© 2026 Alpha SaaS Platform. All rights reserved. Made with ❤️ in India.</div>
        </div>
      </footer>
    </div>
  );
}
