'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Eye,
  MousePointer,
  Users,
  TrendingUp,
  Plus,
  Share2,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  BarChart2,
  Clock,
  ChevronRight
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';

export default function OverviewDashboardPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ views: 0, clicks: 0, leads: 0 });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    if (!token || !wsId) return;

    // Fetch User Profile
    fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error(err));

    // Fetch Workspace Cards
    fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        const loadedCards = data.data || [];
        setCards(loadedCards);

        // Calculate stats
        const totalViews = loadedCards.reduce((sum: number, c: any) => sum + (c.view_count || 0), 0);
        const totalClicks = loadedCards.reduce((sum: number, c: any) => sum + (c.click_count || 0), 0);

        // Fetch Leads
        fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((lRes) => lRes.json())
          .then((lData) => {
            const loadedLeads = lData.data || [];
            setLeads(loadedLeads);
            setStats({
              views: totalViews,
              clicks: totalClicks,
              leads: loadedLeads.length
            });
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, []);

  const primaryCard = cards.find((c) => c.status === 'PUBLISHED') || cards[0];

  const handleCopyLink = (publicId: string) => {
    const url = `${window.location.origin}/public-card/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const conversionRate = stats.views > 0 ? ((stats.leads / stats.views) * 100).toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Good morning, {user?.first_name || user?.display_name?.split(' ')[0] || 'Professional'} 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Your professional identity is live and ready to make an impact.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/cards/builder"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 active:scale-95 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Card</span>
          </Link>
        </div>
      </div>

      {/* 2. Contextual Identity Status Banner */}
      {primaryCard ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-2xl -z-0 opacity-60" />
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Live & Active Identity
              </span>
              <span className="text-xs font-semibold text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                {primaryCard.vanity_slug ? `alpha.me/${primaryCard.vanity_slug}` : `ID: ${primaryCard.public_id}`}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-navy-900">
              {primaryCard.title || 'Digital Business Identity'}
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Share your digital card, capture new leads, and turn introductions into lasting business connections.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 relative z-10">
            <button
              onClick={() => handleCopyLink(primaryCard.public_id)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-surface-secondary border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              {copiedId === primaryCard.public_id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedId === primaryCard.public_id ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <Link
              href={`/public-card/${primaryCard.public_id}`}
              target="_blank"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors shadow-xs"
            >
              <span>View Public Card</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50/50 to-white p-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy-900">Create your first professional identity card</h3>
            <p className="text-xs text-slate-500">Design your card in minutes to start sharing your profile everywhere.</p>
          </div>
          <Link
            href="/dashboard/cards/builder"
            className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
          >
            Start Card Builder
          </Link>
        </div>
      )}

      {/* 3. Overview Real Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Profile Views</span>
            <div className="p-2 rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900 tracking-tight">
            {stats.views.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Real profile view logs
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Action Clicks</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900 tracking-tight">
            {stats.clicks.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Social & CTA link interactions
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Leads Captured</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900 tracking-tight">
            {stats.leads.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Captured lead exchanges
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Conversion Rate</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900 tracking-tight">
            {conversionRate}%
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Views to leads ratio
          </div>
        </div>
      </div>

      {/* 4. Main Dashboard Grid: Visual Preview & Performance */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Card Preview & Performance Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Timeline Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900">Identity Performance</h3>
                <p className="text-xs text-slate-500">Track how people engage with your digital profiles.</p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-surface-secondary border border-slate-200 text-xs font-semibold text-slate-600">
                {(['7d', '30d', '90d'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-bold transition-colors ${
                      timeRange === t ? 'bg-white text-navy-900 shadow-xs' : 'hover:text-navy-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Chart / Zero State */}
            {stats.views > 0 ? (
              <div className="space-y-4 pt-2">
                <div className="h-44 w-full bg-surface-secondary rounded-xl border border-slate-100 p-4 flex items-end justify-between gap-2">
                  {[40, 65, 30, 85, 45, 95, stats.views].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div
                        className="w-full max-w-[28px] bg-brand-600 rounded-t-md transition-all duration-500"
                        style={{ height: `${Math.min(100, Math.max(15, (val / (stats.views || 100)) * 100))}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-400">Day {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 px-6 rounded-xl bg-surface-secondary border border-dashed border-slate-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-navy-900">Your analytics are getting started</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Share your Alpha card link or QR code to begin collecting real-time performance insights.
                  </p>
                </div>
                {primaryCard && (
                  <button
                    onClick={() => handleCopyLink(primaryCard.public_id)}
                    className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-brand-600 hover:bg-brand-50 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Card Link</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-900">Recent Activity</h3>
              <Link
                href="/dashboard/analytics"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leads.length > 0 ? (
              <div className="space-y-3">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary border border-slate-100 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                        {lead.full_name?.charAt(0) || 'L'}
                      </div>
                      <div>
                        <div className="font-bold text-navy-900">{lead.full_name}</div>
                        <div className="text-[11px] text-slate-400">{lead.email}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      New Lead
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs font-medium text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Your activity timeline will appear here as people interact with your card.
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Visual Digital Card Preview & Pro Surface */}
        <div className="space-y-8">
          
          {/* Tangible Digital Card Visual Preview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-900">Primary Card</h3>
              {primaryCard && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {primaryCard.status}
                </span>
              )}
            </div>

            {primaryCard ? (
              <div className="space-y-4">
                {/* Visual Card Representation */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 to-navy-900 p-5 text-white shadow-md space-y-4 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-brand-400 uppercase tracking-wider">ALPHA DIGITAL IDENTITY</div>
                      <div className="text-lg font-extrabold text-white leading-tight">
                        {primaryCard.title || 'Professional Card'}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-mono">
                    <span>{primaryCard.vanity_slug ? `/${primaryCard.vanity_slug}` : `/${primaryCard.public_id}`}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-sans font-bold">
                      {primaryCard.view_count || 0} Views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/dashboard/cards/builder"
                    className="w-full text-center px-3 py-2.5 rounded-xl bg-surface-secondary border border-slate-200 text-navy-900 text-xs font-bold hover:bg-slate-100 transition"
                  >
                    Edit Layout
                  </Link>
                  <Link
                    href={`/public-card/${primaryCard.public_id}`}
                    target="_blank"
                    className="w-full text-center px-3 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
                  >
                    Preview Card
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No cards created yet.
              </div>
            )}
          </div>

          {/* Restrained Pro Upgrade Panel */}
          <div className="bg-gradient-to-br from-navy-900 to-slate-900 p-6 rounded-2xl text-white shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>ALPHA PRO PLAN</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-white">Unlock Full Platform Power</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Custom domains, unlimited lead exports, priority NFC cards, and advanced custom branding.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition shadow-xs"
            >
              <span>View Plans & Upgrades</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
