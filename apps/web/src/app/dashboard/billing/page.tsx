'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Check,
  Globe,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Card, Badge, PageHeader, Select } from '@/components/ui';

import { PLANS, Currency, getPlanPrice, formatPlanPrice } from '@/lib/plans';

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
    <div className="space-y-8 pb-12 font-sans text-slate-900">
      {/* Upgrade Confirmation Banner */}
      {showUpgradeSuccess && (
        <Card padding="sm" className="bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Subscription Updated</p>
              <p className="text-xs text-emerald-700">Your account features and limits have been upgraded.</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowUpgradeSuccess(false)}>
            Dismiss
          </Button>
        </Card>
      )}

      {/* Header Bar */}
      <PageHeader
        title="Plans & Global Billing"
        description="Select the digital identity plan that fits your professional workflow."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              options={[
                { label: 'USD ($)', value: 'USD' },
                { label: 'EUR (€)', value: 'EUR' },
                { label: 'GBP (£)', value: 'GBP' },
                { label: 'INR (₹)', value: 'INR' },
                { label: 'CAD (CA$)', value: 'CAD' },
                { label: 'AUD (A$)', value: 'AUD' }
              ]}
              className="w-auto py-1 text-xs font-semibold"
            />

            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  billingCycle === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  billingCycle === 'annual' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <Badge variant="success" size="sm">Save 20%</Badge>
              </button>
            </div>
          </div>
        }
      />

      {/* Subscription Status Bar */}
      <Card padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">Current Subscription</div>
            <div className="text-sm font-extrabold text-slate-900">{currentPlan} (Active)</div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Workspace Cards Limit: <span className="font-bold text-slate-900">1 / 1 Published</span>
        </div>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const priceVal = getPlanPrice(plan, currency, billingCycle);
          const priceDisplay = formatPlanPrice(plan, currency, billingCycle);
          const isCurrent = (plan.key === 'free' && currentPlan === 'Free Personal') || (plan.key === 'pro' && currentPlan === 'Personal Pro');

          return (
            <Card
              key={plan.id}
              padding="lg"
              className="flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold text-slate-900">{priceDisplay}</span>
                  {priceVal > 0 && <span className="text-xs font-semibold text-slate-400">/ month</span>}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="text-xs font-bold text-slate-400">Included Features</div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                fullWidth
                variant={isCurrent ? 'outline' : 'primary'}
                disabled={isCurrent || isProcessing}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isCurrent ? 'Current Plan' : (plan.key === 'pro' ? 'Upgrade to Pro' : `Choose ${plan.name}`)}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
