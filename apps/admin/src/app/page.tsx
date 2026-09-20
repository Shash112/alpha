'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '../lib/apiConfig';
import {
  Users,
  Building,
  CreditCard,
  IndianRupee,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  AlertCircle,
  Award
} from 'lucide-react';

export default function AdminConsolePage() {
  const [suspendPublicId, setSuspendPublicId] = useState('');
  const [suspendStatus, setSuspendStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalUsers: 0,
    totalWorkspaces: 0,
    publishedCards: 0,
    monthlyRevenue: 0
  });

  const fetchKpis = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/kpis`);
      const data = await res.json();
      if (res.ok && data.data) {
        setKpis(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  const handleSuspendCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendPublicId) return;
    setSuspendStatus('');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/cards/${suspendPublicId}/suspend`, {
        method: 'POST'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to suspend card');

      setSuspendStatus(data.message || `Card ${suspendPublicId} has been SUSPENDED globally in database.`);
      setSuspendPublicId('');
      fetchKpis();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error suspending target card.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6 sm:p-10 space-y-8 font-sans text-navy-900">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-4">
          <Image
            src="/alpha-logo.png"
            alt="Alpha Admin"
            width={120}
            height={32}
            style={{ width: 'auto', height: 'auto' }}
            className="h-8 w-auto object-contain"
            priority
          />
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
              Super-Admin Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Global tenant management, trust & abuse control, and platform operations.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 w-fit">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>SUPER-ADMIN AUTHENTICATED</span>
        </div>
      </div>

      {/* Global Platform Real KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>TOTAL USERS</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">
            {loading ? '...' : kpis.totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-brand-600 font-medium">Real database registered users</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>TOTAL WORKSPACES</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">
            {loading ? '...' : kpis.totalWorkspaces.toLocaleString()}
          </div>
          <div className="text-xs text-purple-600 font-medium">Active tenant boundaries</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>PUBLISHED CARDS</span>
            <CreditCard className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">
            {loading ? '...' : kpis.publishedCards.toLocaleString()}
          </div>
          <div className="text-xs text-teal-600 font-medium">Active public profiles</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>MONTHLY REVENUE</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {loading ? '...' : `₹${kpis.monthlyRevenue.toLocaleString()}`}
          </div>
          <div className="text-xs text-emerald-600 font-medium">Razorpay active subscriptions</div>
        </div>
      </div>

      {/* Abuse Moderation & Reseller Quotas */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Card Moderation Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-navy-900">Card Moderation & Abuse Control</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instantly suspend public cards involved in phishing, impersonation, or terms violations.
          </p>

          {suspendStatus && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{suspendStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSuspendCard} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                TARGET PUBLIC CARD ID
              </label>
              <input
                type="text"
                required
                value={suspendPublicId}
                onChange={(e) => setSuspendPublicId(e.target.value)}
                placeholder="e.g. 7Kx9mP4QaZ8Vt2N6"
                className="w-full rounded-xl bg-surface-secondary border border-slate-200 px-4 py-3 text-xs text-navy-900 font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs flex items-center space-x-2"
            >
              <Ban className="w-4 h-4" />
              <span>Suspend Card Globally</span>
            </button>
          </form>
        </div>

        {/* Reseller Agency Quotas */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-navy-900">Reseller Agency Quotas</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage white-label partner agency licenses and seat allocation quotas.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary border border-slate-200 text-xs">
              <div>
                <div className="font-bold text-navy-900">Apex Media Agency</div>
                <div className="text-[11px] text-slate-500">Tier 1 White-label Reseller</div>
              </div>
              <span className="font-mono text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                100 / 150 Seats
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary border border-slate-200 text-xs">
              <div>
                <div className="font-bold text-navy-900">NFC Tech India</div>
                <div className="text-[11px] text-slate-500">Hardware Distribution Partner</div>
              </div>
              <span className="font-mono text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                45 / 50 Seats
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
