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
  X,
  Search
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
  const [createError, setCreateError] = useState('');

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
    const url = `${window.location.origin}/c/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle) return;
    setIsSubmitting(true);
    setCreateError('');

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newCardTitle,
          templateSlug: 'corporate-executive',
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
        setCreateError(data.message || 'Failed to create card. Please check your workspace limits.');
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

  if (loading) {
    return (
      <div className="space-y-6 font-sans">
        <div className="h-8 w-40 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans text-slate-900">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Identity Cards
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal, executive, and campaign digital card profiles.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Card</span>
        </button>
      </div>

      {/* Filter / Search Control Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 w-full max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 px-2">
          Total Cards: <span className="font-bold text-slate-900">{cards.length}</span>
        </div>
      </div>

      {/* Cards List Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">No cards created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Create your first professional identity card to share your contact details and build your network.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition inline-flex items-center space-x-2"
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
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden hover:border-slate-300 transition"
              >
                {/* Header info */}
                <div className="p-5 border-b border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {card.status}
                    </span>

                    <button
                      onClick={() => setQrModalCard(card)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                      title="QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {card.title || 'Digital Card'}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {card.vanity_slug ? `alpha.me/c/${card.vanity_slug}` : `ID: ${card.public_id}`}
                    </p>
                  </div>
                </div>

                {/* Card metrics & Action bar */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{card.view_count || 0} Views</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{card.click_count || 0} Leads</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/cards/builder?cardId=${card.id}`)}
                        className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit Card</span>
                      </button>

                      <Link
                        href={`/c/${card.public_id}`}
                        target="_blank"
                        className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleCopyLink(card.public_id)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                      {copiedId === card.public_id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{copiedId === card.public_id ? 'Link Copied!' : 'Copy Public Link'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Card Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create Digital Card</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {createError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  CARD TITLE / FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="e.g. Shashank Shekhar — Product Architect"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create & Open Studio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Digital Card QR</h3>
              <button
                onClick={() => setQrModalCard(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `${window.location.origin}/c/${qrModalCard.public_id}`
                )}`}
                alt="QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="text-xs font-semibold text-slate-800">{qrModalCard.title}</div>

            <button
              onClick={() => handleCopyLink(qrModalCard.public_id)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Copy Public Card URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
