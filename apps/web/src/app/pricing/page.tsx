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

import { PLANS, Currency, CURRENCY_SYMBOLS, formatPlanPrice } from '@/lib/plans';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <MarketingHeader currentPath="/pricing" />

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
            {PLANS.map((plan) => {
              const priceDisplay = formatPlanPrice(plan, currency, annualBilling ? 'annual' : 'monthly');
              const periodLabel = plan.key === 'enterprise' ? 'tailored pricing' : (plan.key === 'free' ? 'forever' : (annualBilling ? 'per month (billed annually)' : 'per month'));
              return (
                <div
                  key={plan.id}
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
                      <span className={`text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{periodLabel}</span>
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
                      href={plan.ctaHref || '/register'}
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

      <MarketingFooter />
    </div>
  );
}
