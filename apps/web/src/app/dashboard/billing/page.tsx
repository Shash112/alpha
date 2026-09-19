'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  IndianRupee
} from 'lucide-react';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [currentPlan, setCurrentPlan] = useState<string>('Free Personal');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'plan_free_personal',
      name: 'Free Personal',
      desc: 'Essential digital visiting card for individual professionals.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        '1 Digital Identity Card',
        'Standard QR Code Generator',
        'Basic Contact Information',
        'vCard (.vcf) File Export',
        'Alpha Platform Branding'
      ],
      cta: 'Current Plan',
      isCurrent: true,
      highlight: false
    },
    {
      id: 'plan_pro_personal',
      name: 'Personal Pro',
      desc: 'Full professional identity power with lead capture & custom domains.',
      priceMonthly: 299,
      priceAnnual: 249,
      features: [
        '5 Digital Business Cards',
        'Custom Vanity URL Alias (alpha.me/name)',
        'Verified Custom CNAME Domain',
        'Unlimited Lead Capture Forms',
        'CSV Contacts Export',
        'Real-time Click & View Analytics',
        'Remove Alpha Platform Branding',
        'Priority Support'
      ],
      cta: 'Upgrade to Pro',
      isCurrent: false,
      highlight: true
    },
    {
      id: 'plan_team',
      name: 'Team',
      desc: 'Collaborative identity & card management for small teams.',
      priceMonthly: 799,
      priceAnnual: 699,
      features: [
        'Up to 15 Team Cards',
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
      id: 'plan_enterprise',
      name: 'Enterprise',
      desc: 'Custom corporate digital identity, SSO, & white-label platform.',
      priceMonthly: 2499,
      priceAnnual: 1999,
      features: [
        'Unlimited Corporate Cards',
        'Full White-label Branding',
        'Single Sign-On (SAML / OIDC Ready)',
        'Dedicated Account Manager',
        'Custom SLA & Enterprise Security'
      ],
      cta: 'Contact Enterprise Sales',
      isCurrent: false,
      highlight: false
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'plan_free_personal') return;
    setIsProcessing(true);

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    try {
      const res = await fetch(`http://localhost:4000/api/v1/billing/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          workspaceId: wsId,
          planId,
          billingCycle
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Subscription upgrade initiated successfully via Razorpay abstraction!');
      } else {
        alert(data.message || 'Billing error');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Plans & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Choose the right professional identity plan for your career or business.
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-subtle w-fit">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-navy-900 text-white shadow-2xs' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              billingCycle === 'annual' ? 'bg-navy-900 text-white shadow-2xs' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-extrabold uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Current Subscription Status Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-brand-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">CURRENT ACTIVE PLAN</div>
            <div className="text-base font-extrabold text-navy-900">{currentPlan} (Active)</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="text-slate-500 font-medium">
            Card Usage: <span className="font-bold text-navy-900">1 / 1 Available</span>
          </div>
        </div>
      </div>

      {/* Commercial Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-6 relative transition-all ${
                plan.highlight
                  ? 'border-brand-500 shadow-card-hover ring-2 ring-brand-500/10'
                  : 'border-slate-200/90 shadow-subtle hover:border-slate-300'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-navy-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-navy-900">₹{price}</span>
                  <span className="text-xs font-semibold text-slate-400">/ month</span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">INCLUDED FEATURES</div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
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
                    ? 'bg-surface-secondary text-slate-400 border border-slate-200 cursor-default'
                    : plan.highlight
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-navy-900 text-white hover:bg-navy-800'
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
