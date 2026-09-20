'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Plus,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Eye,
  Users,
  Edit,
  Trash2,
  X,
  Sparkles,
  Search,
  LayoutGrid
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';

export default function MyCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalCard, setQrModalCard] = useState<any | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('Professional');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCards = async () => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCards(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleCopyLink = (publicId: string) => {
    const url = `${window.location.origin}/public-card/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [createError, setCreateError] = useState('');

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle) return;
    setIsSubmitting(true);
    setCreateError('');

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    const templateSlugMap: Record<string, string> = {
      Professional: 'corporate-executive',
      Executive: 'corporate-executive',
      Minimal: 'modern-minimalist',
      Creative: 'creative-portfolio',
      Modern: 'modern-minimalist'
    };

    const targetSlug = templateSlugMap[selectedTemplate] || 'corporate-executive';

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newCardTitle,
          templateSlug: targetSlug,
          template: selectedTemplate
        })
      });

      const data = await res.json();
      if (res.ok && (data.card || data.id)) {
        setCreateModalOpen(false);
        setNewCardTitle('');
        const cardId = data.card?.id || data.id;
        router.push(`/dashboard/cards/builder?cardId=${cardId}`);
      } else {
        setCreateError(data.message || 'Failed to create card. Please check your workspace subscription.');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Network error creating card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCards = cards.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.public_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const templates = [
    { id: 'Professional', name: 'Professional', desc: 'Sleek corporate identity layout with navy accents.' },
    { id: 'Executive', name: 'Executive', desc: 'High-contrast executive layout for leadership roles.' },
    { id: 'Minimal', name: 'Minimal', desc: 'Clean typography-first card with generous spacing.' },
    { id: 'Creative', name: 'Creative', desc: 'Vibrant layout designed for consultants and creators.' },
    { id: 'Modern', name: 'Modern', desc: 'Balanced card style suited for tech & SaaS teams.' }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            My Cards
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Your visual identity library and active digital business cards.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 active:scale-95 transition-all shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Card</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-subtle">
        <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-surface-secondary rounded-xl border border-slate-200 w-full max-w-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards by name or ID..."
            className="w-full bg-transparent text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 px-2">
          Total Cards: <span className="font-bold text-navy-900">{cards.length}</span>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy-900">No digital cards found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Create your first professional identity card to share your details, capture leads, and expand your network.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Card</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => {
            const isPublished = card.status === 'PUBLISHED';
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:border-slate-300 card-surface-hover flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Card Preview Header */}
                <div className="p-5 bg-gradient-to-b from-navy-900 to-slate-900 text-white space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {card.status}
                    </span>
                    <button
                      onClick={() => setQrModalCard(card)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title="Show QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 pt-1">
                    <h3 className="text-lg font-extrabold text-white truncate">
                      {card.title || 'Digital Card'}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono truncate">
                      {card.vanity_slug ? `alpha.me/${card.vanity_slug}` : `ID: ${card.public_id}`}
                    </p>
                  </div>
                </div>

                {/* Card Stats & Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-surface-secondary p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Eye className="w-3.5 h-3.5 text-brand-600" />
                      <span className="font-semibold">{card.view_count || 0} Views</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold">{card.click_count || 0} Interactions</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/cards/builder?cardId=${card.id}`)}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-surface-secondary border border-slate-200 text-navy-900 text-xs font-bold hover:bg-slate-100 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit Card</span>
                      </button>

                      <Link
                        href={`/public-card/${card.public_id}`}
                        target="_blank"
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleCopyLink(card.public_id)}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-surface-secondary transition"
                    >
                      {copiedId === card.public_id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedId === card.public_id ? 'Copied Public Link!' : 'Copy Public URL'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Create Card Flow */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-navy-900">Create New Digital Identity Card</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-5">
              {createError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <span className="shrink-0 font-bold">⚠️</span>
                    <span>{createError}</span>
                  </div>
                  {createError.includes('limit') && (
                    <Link
                      href="/dashboard/billing"
                      className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg hover:bg-rose-700 shrink-0"
                    >
                      Upgrade Plan
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Card Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="e.g. Shashank Shekhar — Founder & Product Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Select Starting Layout Template
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        selectedTemplate === tmpl.id
                          ? 'border-brand-600 bg-brand-50 text-navy-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-navy-900">{tmpl.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{tmpl.desc}</div>
                      </div>
                      {selectedTemplate === tmpl.id && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Card...' : 'Create & Open Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: QR Code Preview Modal */}
      {qrModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 text-center space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-900">Card QR Code</h3>
              <button
                onClick={() => setQrModalCard(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-subtle">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}/public-card/${qrModalCard.public_id}`
                )}`}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-navy-900">{qrModalCard.title}</div>
              <div className="text-xs text-slate-500">Scan with any phone camera to view profile</div>
            </div>

            <button
              onClick={() => handleCopyLink(qrModalCard.public_id)}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
            >
              Copy Public Card Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
