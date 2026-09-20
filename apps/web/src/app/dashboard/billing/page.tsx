'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard,
  Check,
  Zap,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';

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
  plan_free_personal: {
    USD: { monthly: 0, annual: 0 },
    EUR: { monthly: 0, annual: 0 },
    GBP: { monthly: 0, annual: 0 },
    INR: { monthly: 0, annual: 0 },
    CAD: { monthly: 0, annual: 0 },
    AUD: { monthly: 0, annual: 0 }
  },
  plan_personal_pro: {
    USD: { monthly: 5.99, annual: 4.90 },
    EUR: { monthly: 5.49, annual: 4.50 },
    GBP: { monthly: 4.99, annual: 3.90 },
    INR: { monthly: 499, annual: 399 },
    CAD: { monthly: 7.99, annual: 6.50 },
    AUD: { monthly: 8.49, annual: 6.90 }
  },
  plan_team_annual: {
    USD: { monthly: 24.99, annual: 19.90 },
    EUR: { monthly: 22.99, annual: 18.50 },
    GBP: { monthly: 19.99, annual: 15.90 },
    INR: { monthly: 2499, annual: 1999 },
    CAD: { monthly: 32.99, annual: 26.90 },
    AUD: { monthly: 34.99, annual: 28.90 }
  },
  plan_business_annual: {
    USD: { monthly: 59.99, annual: 49.90 },
    EUR: { monthly: 54.99, annual: 46.90 },
    GBP: { monthly: 49.99, annual: 39.90 },
    INR: { monthly: 9999, annual: 7999 },
    CAD: { monthly: 79.99, annual: 67.90 },
    AUD: { monthly: 84.99, annual: 72.90 }
  }
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentPlan, setCurrentPlan] = useState<string>('Free Personal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowUpgradeSuccess(true);
      setCurrentPlan('Personal Pro');
    }
  }, [searchParams]);

  const symbol = CURRENCY_SYMBOLS[currency];

  const plans = [
    {
      id: 'plan_free_personal',
      name: 'Free Personal',
      desc: 'Essential digital visiting card for individual professionals.',
      features: [
        '1 Digital Identity Card',
        'Standard QR Code Generator',
        'Basic Contact Information',
        'vCard (.vcf) File Export',
        'Alpha Platform Branding'
      ],
      cta: 'Current Plan',
      isCurrent: currentPlan === 'Free Personal',
      highlight: false
    },
    {
      id: 'plan_personal_pro',
      name: 'Personal Pro',
      desc: 'Full professional identity power with lead capture & custom domains.',
      features: [
        '5 Digital Business Cards',
        'Custom Vanity URL Alias (alpha.com/alias)',
        'Verified Custom CNAME Domain',
        'Unlimited Lead Capture Forms',
        'CSV Contacts Export',
        'Real-time Click & View Analytics',
        'Remove Alpha Platform Branding',
        'Priority Support'
      ],
      cta: 'Upgrade to Pro',
      isCurrent: currentPlan === 'Personal Pro',
      highlight: true
    },
    {
      id: 'plan_team_annual',
      name: 'Team',
      desc: 'Collaborative identity & card management for small teams.',
      features: [
        'Up to 25 Team Cards',
        'Centralized Team Dashboard',
        'Unified Custom Domain Mapping',
        'Team Member Invitations & Roles',
        'Shared Leads & CRM Access',
        'Brand Assets & Logo Controls'
      ],
      cta: 'Choose Team Plan',
      isCurrent: false,
      highlight: false
    },
    {
      id: 'plan_business_annual',
      name: 'Business / Enterprise',
      desc: 'Custom corporate digital identity, SSO, & white-label platform.',
      features: [
        'Up to 100 Corporate Cards',
        'Full White-label Branding',
        'Single Sign-On (SAML / OIDC Ready)',
        'Dedicated Account Manager',
        'Custom SLA & Enterprise Security'
      ],
      cta: 'Upgrade to Business',
      isCurrent: false,
      highlight: false
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'plan_free_personal') return;
    setIsProcessing(true);

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId') || '018f92a1-0000-7000-8000-000000000020';

    try {
      const provider = currency === 'INR' ? 'RAZORPAY' : 'STRIPE';
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          provider,
          currency
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          setShowUpgradeSuccess(true);
          setCurrentPlan('Personal Pro');
        }
      } else {
        alert(data.message || 'Billing error');
      }
    } catch (err) {
      console.error(err);
      alert('Billing connection notice');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Upgrade Success Notification Banner */}
      {showUpgradeSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">You're Upgraded!</p>
              <p className="text-xs text-emerald-700">Your account now has Personal Pro features enabled (up to 5 active cards, advanced analytics, and custom branding).</p>
            </div>
          </div>
          <button
            onClick={() => setShowUpgradeSuccess(false)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Plans & Global Billing
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Choose the right professional identity plan for your career or global business.
          </p>
        </div>

        {/* Currency & Monthly/Annual Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
            <Globe className="w-4 h-4 text-blue-600" />
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

          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                billingCycle === 'annual' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-extrabold uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Subscription Status Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">CURRENT ACTIVE PLAN</div>
            <div className="text-base font-extrabold text-slate-900">{currentPlan} (Active)</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="text-slate-500 font-medium">
            Card Usage: <span className="font-bold text-slate-900">1 / 1 Available</span>
          </div>
        </div>
      </div>

      {/* Commercial Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const planPricing = PLAN_PRICES[plan.id]?.[currency] || { monthly: 0, annual: 0 };
          const priceVal = billingCycle === 'annual' ? planPricing.annual : planPricing.monthly;
          const priceDisplay = priceVal === 0 ? 'Free' : `${symbol}${priceVal.toLocaleString()}`;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-6 relative transition-all ${
                plan.highlight
                  ? 'border-blue-500 shadow-xl ring-2 ring-blue-500/10'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-slate-900">{priceDisplay}</span>
                  <span className="text-xs font-semibold text-slate-400">/ month</span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">INCLUDED FEATURES</div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.isCurrent || isProcessing}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  plan.isCurrent
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                    : plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.isCurrent ? 'Current Plan' : plan.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
