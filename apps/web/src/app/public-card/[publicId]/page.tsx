'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Download,
  Share2,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input, Modal, Spinner, Avatar, Card } from '@/components/ui';

export default function PublicCardPage() {
  const params = useParams();
  const publicId = params.publicId as string;
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lead Modal State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  useEffect(() => {
    if (!publicId) return;

    fetch(`${API_BASE_URL}/api/v1/public/cards/id/${publicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.publicId) {
          setCard(data);
        } else {
          setError(data.message || 'Profile unavailable or unpublished.');
        }
      })
      .catch(() => setError('Unable to load digital card profile.'))
      .finally(() => setLoading(false));
  }, [publicId]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/public/cards/${publicId}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: leadName, email: leadEmail, phone: leadPhone, company: leadCompany })
      });
      if (res.ok) {
        setLeadSubmitted(true);
        setTimeout(() => {
          setShowLeadModal(false);
          setLeadSubmitted(false);
          setLeadName('');
          setLeadEmail('');
          setLeadPhone('');
          setLeadCompany('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-3">
          <Spinner size="sm" />
          <span className="text-xs font-semibold text-slate-700">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Profile Unavailable</h2>
            <p className="text-xs text-slate-500 mt-1">{error || 'This card profile is unavailable or set to draft.'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const heroSection = card.sections?.find((s: any) => s.type === 'hero');
  const contactSection = card.sections?.find((s: any) => s.type === 'contact');

  const name = heroSection?.fields?.name || card.title || 'Digital Profile';
  const designation = heroSection?.fields?.designation || card.sections?.designation || '';
  const company = heroSection?.fields?.company || card.sections?.company || '';
  const bio = heroSection?.fields?.bio || card.sections?.bio || '';
  const avatarUrl = heroSection?.fields?.avatar_url || card.sections?.avatar_url || card.sections?.avatarUrl || '';

  const email = contactSection?.fields?.email || card.sections?.email || '';
  const phone = contactSection?.fields?.phone || card.sections?.phone || '';
  const website = contactSection?.fields?.website || card.sections?.website || '';

  const socialLinkedin = contactSection?.fields?.social_linkedin || card.sections?.social_linkedin || '';
  const socialTwitter = contactSection?.fields?.social_twitter || card.sections?.social_twitter || '';
  const socialInstagram = contactSection?.fields?.social_instagram || card.sections?.social_instagram || '';
  const socialGithub = contactSection?.fields?.social_github || card.sections?.social_github || '';
  const socialYoutube = contactSection?.fields?.social_youtube || card.sections?.social_youtube || '';
  const socialWhatsapp = contactSection?.fields?.social_whatsapp || card.sections?.social_whatsapp || '';

  const brandAccent = card.workspaceBranding?.brandColor || card.themeColor || '#0F172A';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans">
      <main className="w-full max-w-sm bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5 my-auto">
        
        {/* Profile Avatar & Primary Identity */}
        <div className="text-center space-y-3">
          <Avatar
            src={avatarUrl}
            name={name}
            size="xl"
            accentColor={brandAccent}
            className="mx-auto"
          />

          <div className="space-y-0.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{name}</h1>

            {(designation || company) && (
              <p className="text-xs font-semibold text-slate-600">
                {designation}
                {designation && company ? ' • ' : ''}
                {company && <span className="text-slate-500 font-normal">{company}</span>}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs text-slate-500 text-center font-normal leading-relaxed max-w-xs mx-auto">
            {bio}
          </p>
        )}

        {/* Primary Action Button Suite */}
        <div className="space-y-2 pt-1">
          <a
            href={`${API_BASE_URL}/api/v1/public/cards/${publicId}/vcard`}
            download
            className="w-full py-3 rounded-xl text-xs font-bold text-white text-center shadow-2xs transition hover:opacity-95 active:scale-[0.98] flex items-center justify-center space-x-2"
            style={{ backgroundColor: brandAccent }}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Save Contact</span>
          </a>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowLeadModal(true)}
            leftIcon={<Share2 className="w-3.5 h-3.5 text-slate-500" />}
          >
            Exchange Details
          </Button>
        </div>

        {/* Clean Direct Contact Rows */}
        {(phone || email || website) && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 px-1">
              Contact
            </div>

            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-900 transition"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{phone}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Call</span>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-900 transition"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Email</span>
              </a>
            )}

            {website && (
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-900 transition"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{website}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Website</span>
              </a>
            )}
          </div>
        )}

        {/* Clean Connect Profiles */}
        {(socialLinkedin || socialTwitter || socialInstagram || socialGithub || socialYoutube || socialWhatsapp) && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 px-1">
              Connect
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {socialLinkedin && (
                <a
                  href={socialLinkedin.startsWith('http') ? socialLinkedin : `https://${socialLinkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
                >
                  <Linkedin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </a>
              )}

              {socialTwitter && (
                <a
                  href={socialTwitter.startsWith('http') ? socialTwitter : `https://${socialTwitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
                >
                  <Twitter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">X</span>
                </a>
              )}

              {socialInstagram && (
                <a
                  href={socialInstagram.startsWith('http') ? socialInstagram : `https://${socialInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">Instagram</span>
                </a>
              )}

              {socialGithub && (
                <a
                  href={socialGithub.startsWith('http') ? socialGithub : `https://${socialGithub}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">GitHub</span>
                </a>
              )}

              {socialYoutube && (
                <a
                  href={socialYoutube.startsWith('http') ? socialYoutube : `https://${socialYoutube}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">YouTube</span>
                </a>
              )}

              {socialWhatsapp && (
                <a
                  href={socialWhatsapp.startsWith('http') ? socialWhatsapp : `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Public Identifier */}
        <div className="pt-2 text-center border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-mono tracking-wide">
            {card.canonicalUrl || `alpha.me/c/${card.publicId}`}
          </span>
        </div>
      </main>

      <footer className="text-xs text-slate-400 text-center py-4">
        Digital Identity Profile
      </footer>

      {/* Exchange Contact Details Modal */}
      <Modal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        title={leadSubmitted ? undefined : 'Exchange Contact Details'}
      >
        {leadSubmitted ? (
          <div className="text-center py-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Details Exchanged</h3>
            <p className="text-xs text-slate-500">
              Your contact information has been shared with {name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-3">
            <Input
              label="Full Name"
              type="text"
              required
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Jane Doe"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="jane@company.com"
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setShowLeadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={leadSubmitting}>
                Send Card
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
