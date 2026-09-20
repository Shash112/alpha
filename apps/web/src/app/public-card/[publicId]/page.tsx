'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Download,
  Share2,
  Mail,
  Phone,
  Globe,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Linkedin,
  Twitter,
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';

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
      .catch(() => setError('Failed to connect to digital identity service.'))
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
        }, 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-slate-600">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-800">Loading Digital Identity...</span>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-sm p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Card Unavailable</h2>
            <p className="text-xs text-slate-500 mt-1">{error || 'This public identity profile is not currently published.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const heroSection = card.sections?.find((s: any) => s.type === 'hero');
  const contactSection = card.sections?.find((s: any) => s.type === 'contact');

  const name = heroSection?.fields?.name || card.title || 'Digital Identity';
  const designation = heroSection?.fields?.designation || card.sections?.designation || '';
  const company = heroSection?.fields?.company || card.sections?.company || '';
  const bio = heroSection?.fields?.bio || card.sections?.bio || '';

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans">
      <main className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 my-auto">
        
        {/* Profile Header */}
        <div className="text-center space-y-3">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-extrabold text-white shadow-xs"
            style={{ backgroundColor: brandAccent }}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-center space-x-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{name}</h1>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            {designation && (
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {designation}
              </p>
            )}

            {company && (
              <p className="text-xs font-medium text-slate-500">
                {company}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs text-slate-600 text-center leading-relaxed px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 font-normal">
            {bio}
          </p>
        )}

        {/* Primary Action Suite */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href={`${API_BASE_URL}/api/v1/public/cards/${publicId}/vcard`}
            download
            className="w-full py-3 rounded-xl text-xs font-bold text-white text-center shadow-xs transition hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2"
            style={{ backgroundColor: brandAccent }}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Save Contact</span>
          </a>

          <button
            onClick={() => setShowLeadModal(true)}
            className="w-full py-3 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4 shrink-0 text-slate-600" />
            <span>Exchange</span>
          </button>
        </div>

        {/* Actionable Direct Links */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            DIRECT CONTACT
          </div>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              <div className="flex items-center space-x-3 truncate">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Call</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              <div className="flex items-center space-x-3 truncate">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Email</span>
            </a>
          )}

          {website && (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              <div className="flex items-center space-x-3 truncate">
                <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{website}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Website</span>
            </a>
          )}
        </div>

        {/* Social Profiles Grid */}
        {(socialLinkedin || socialTwitter || socialInstagram || socialGithub || socialYoutube || socialWhatsapp) && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ONLINE PROFILES
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {socialLinkedin && (
                <a
                  href={socialLinkedin.startsWith('http') ? socialLinkedin : `https://${socialLinkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 hover:bg-slate-100 transition truncate"
                >
                  <Linkedin className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </a>
              )}

              {socialTwitter && (
                <a
                  href={socialTwitter.startsWith('http') ? socialTwitter : `https://${socialTwitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 hover:bg-slate-100 transition truncate"
                >
                  <Twitter className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="truncate">X / Twitter</span>
                </a>
              )}

              {socialInstagram && (
                <a
                  href={socialInstagram.startsWith('http') ? socialInstagram : `https://${socialInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 hover:bg-slate-100 transition truncate"
                >
                  <ExternalLink className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="truncate">Instagram</span>
                </a>
              )}

              {socialGithub && (
                <a
                  href={socialGithub.startsWith('http') ? socialGithub : `https://${socialGithub}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 hover:bg-slate-100 transition truncate"
                >
                  <ExternalLink className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="truncate">GitHub</span>
                </a>
              )}

              {socialYoutube && (
                <a
                  href={socialYoutube.startsWith('http') ? socialYoutube : `https://${socialYoutube}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 hover:bg-slate-100 transition truncate"
                >
                  <ExternalLink className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="truncate">YouTube</span>
                </a>
              )}

              {socialWhatsapp && (
                <a
                  href={socialWhatsapp.startsWith('http') ? socialWhatsapp : `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 hover:bg-slate-100 transition truncate"
                >
                  <MessageSquare className="w-4 h-4 text-slate-700 shrink-0" />
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

      {/* Minimal Footer */}
      <footer className="text-[11px] font-medium text-slate-400 text-center py-4">
        Verified Digital Identity
      </footer>

      {/* Exchange Contact Details Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
            {leadSubmitted ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Details Sent</h3>
                <p className="text-xs text-slate-500">
                  Your contact card has been shared with {name}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Exchange Contact Details</h3>
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowLeadModal(false)}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {leadSubmitting ? 'Sending...' : 'Send Card'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
