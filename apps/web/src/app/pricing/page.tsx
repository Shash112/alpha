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
  Globe,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'A$'
};

const PLAN_PRICES: Record<string, Record<Currency, { monthly: number; annual: number }>> = {
  free: {
    USD: { monthly: 0, annual: 0 },
    EUR: { monthly: 0, annual: 0 },
    GBP: { monthly: 0, annual: 0 },
    INR: { monthly: 0, annual: 0 },
    CAD: { monthly: 0, annual: 0 },
    AUD: { monthly: 0, annual: 0 }
  },
  pro: {
    USD: { monthly: 5.99, annual: 4.90 },
    EUR: { monthly: 5.49, annual: 4.50 },
    GBP: { monthly: 4.99, annual: 3.90 },
    INR: { monthly: 499, annual: 399 },
    CAD: { monthly: 7.99, annual: 6.50 },
    AUD: { monthly: 8.49, annual: 6.90 }
  },
  team: {
    USD: { monthly: 24.99, annual: 19.90 },
    EUR: { monthly: 22.99, annual: 18.50 },
    GBP: { monthly: 19.99, annual: 15.90 },
    INR: { monthly: 2499, annual: 1999 },
    CAD: { monthly: 32.99, annual: 26.90 },
    AUD: { monthly: 34.99, annual: 28.90 }
  }
};

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);
  const [currency, setCurrency] = useState<Currency>('USD');

  const symbol = CURRENCY_SYMBOLS[currency];

  const formatPrice = (planKey: string) => {
    if (planKey === 'enterprise') return 'Custom';
    const plan = PLAN_PRICES[planKey][currency];
    const val = annualBilling ? plan.annual : plan.monthly;
    if (val === 0) return 'Free';
    return `${symbol}${val.toLocaleString()}`;
  };

  const pricingPlans = [
    {
      key: 'free',
      name: 'Free Personal',
      family: 'Free Plan',
      period: 'forever',
      description: 'Essential digital business card for individual professionals worldwide.',
      features: [
        '1 Active Digital Card',
        'Dynamic Vector QR Code export',
        'Standard Card Templates',
        'vCard (.vcf) Contact Download',
        'Basic Profile Analytics'
      ],
      highlight: false,
      ctaText: 'Get Started Free',
      ctaHref: '/register'
    },
    {
      key: 'pro',
      name: 'Personal Pro',
      family: 'Pro Plan',
      period: annualBilling ? 'per month (billed annually)' : 'per month',
      description: 'Advanced identity tools with custom branding, vanity aliases, and lead capture.',
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
      key: 'team',
      name: 'Team & SMB',
      family: 'Team Plan',
      period: annualBilling ? 'per month (billed annually)' : 'per month',
      description: 'Centralized management for growing business teams and employee directories.',
      features: [
        'Up to 25 Team Cards',
        'Centralized Brand Guidelines & Lock templates',
        'Bulk CSV Employee Provisioning',
        'Departmental Grouping & Role RBAC',
        'Team Aggregated Lead Feed',
        'Priority Global Support'
      ],
      highlight: false,
      ctaText: 'Start Team Trial',
      ctaHref: '/register'
    },
    {
      key: 'enterprise',
      name: 'Enterprise / Agency',
      family: 'Enterprise',
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
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL MULTI-CURRENCY PRICING</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Transparent Pricing for Professionals Worldwide
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade as your identity expands. All plans include sub-100ms global CDN rendering and dynamic QR code sharing.
          </p>

          {/* Controls: Currency Selector & Annual Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            {/* Currency Dropdown Selector */}
            <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-full px-4 py-1.5 shadow-sm text-xs font-semibold text-slate-700">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            {/* Monthly / Annual Billing Switch */}
            <div className="flex items-center gap-3 border border-slate-200 bg-white rounded-full px-4 py-1.5 shadow-sm">
              <span className={`text-xs font-semibold ${!annualBilling ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-12 h-6 rounded-full bg-blue-600 p-0.5 transition-colors relative"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    annualBilling ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-semibold ${annualBilling ? 'text-slate-900' : 'text-slate-500'}`}>Annual</span>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                  SAVE 20%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, idx) => {
              const priceDisplay = formatPrice(plan.key);
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
                      <span className="text-4xl font-extrabold tracking-tight">{priceDisplay}</span>
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
          <div>© 2026 Alpha SaaS Platform. All rights reserved. Built for global digital professionals.</div>
        </div>
      </footer>
    </div>
  );
}
