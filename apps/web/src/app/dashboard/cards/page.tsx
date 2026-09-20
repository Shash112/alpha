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
  Search
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input, Card, Badge, PageHeader, EmptyState, Modal, Skeleton } from '@/components/ui';

export default function MyCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalCard, setQrModalCard] = useState<any | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
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
          templateSlug: 'corporate-executive'
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
        <Skeleton variant="text" className="h-8 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans text-slate-900">
      {/* Header & Primary Action */}
      <PageHeader
        title="Digital Identity Cards"
        description="Manage your personal, executive, and campaign digital card profiles."
        actions={
          <Button
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Card
          </Button>
        }
      />

      {/* Filter / Search Control Bar */}
      <Card padding="sm" className="flex items-center justify-between gap-4">
        <div className="w-full max-w-xs">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            leftElement={<Search className="w-3.5 h-3.5" />}
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 px-2 shrink-0">
          Total Cards: <span className="font-bold text-slate-900">{cards.length}</span>
        </div>
      </Card>

      {/* Cards List Grid */}
      {filteredCards.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-6 h-6" />}
          title="No cards created yet"
          description="Create your first digital identity card to share contact details and build your network."
          action={
            <Button onClick={() => setCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Create First Card
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => {
            const isPublished = card.status === 'PUBLISHED';
            return (
              <Card key={card.id} padding="none" className="flex flex-col justify-between overflow-hidden hover:border-slate-300 transition">
                {/* Header info */}
                <div className="p-5 border-b border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={isPublished ? 'success' : 'warning'}>
                      {card.status}
                    </Badge>

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/cards/builder?cardId=${card.id}`)}
                        leftIcon={<Edit className="w-3.5 h-3.5 text-slate-500" />}
                      >
                        Edit Card
                      </Button>

                      <Link href={`/c/${card.public_id}`} target="_blank" className="block">
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        >
                          Preview
                        </Button>
                      </Link>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => handleCopyLink(card.public_id)}
                      leftIcon={
                        copiedId === card.public_id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )
                      }
                    >
                      {copiedId === card.public_id ? 'Link Copied!' : 'Copy Public Link'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Card Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Digital Card"
      >
        <form onSubmit={handleCreateCard} className="space-y-4">
          {createError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {createError}
            </div>
          )}

          <Input
            label="Card Title / Full Name"
            type="text"
            required
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="e.g. Shashank Shekhar — Product Architect"
          />

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create & Open Studio
            </Button>
          </div>
        </form>
      </Modal>

      {/* QR Modal */}
      <Modal
        isOpen={!!qrModalCard}
        onClose={() => setQrModalCard(null)}
        title="Digital Card QR Code"
      >
        {qrModalCard && (
          <div className="text-center space-y-4">
            <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block shadow-2xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `${window.location.origin}/c/${qrModalCard.public_id}`
                )}`}
                alt="QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="text-xs font-semibold text-slate-800">{qrModalCard.title}</div>

            <Button fullWidth onClick={() => handleCopyLink(qrModalCard.public_id)}>
              Copy Public Card URL
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
