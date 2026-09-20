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
  Sparkles,
  UserCheck,
  Linkedin,
  Twitter,
  ExternalLink,
  ShieldCheck
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

  useEffect(() => {
    if (!publicId) return;

    fetch(`${API_BASE_URL}/api/v1/public/cards/id/${publicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.publicId) {
          setCard(data);
        } else {
          setError(data.message || 'Card profile not found.');
        }
      })
      .catch(() => setError('Failed to load card profile.'))
      .finally(() => setLoading(false));
  }, [publicId]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-slate-500 font-sans p-4">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-700">Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 text-center font-sans">
        <div className="bg-white max-w-md p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Profile Unavailable</h2>
          <p className="text-xs text-slate-500">{error || 'This digital card profile is offline or no longer available.'}</p>
        </div>
      </div>
    );
  }

  const heroSection = card.sections?.find((s: any) => s.type === 'hero');
  const contactSection = card.sections?.find((s: any) => s.type === 'contact');

  const name = heroSection?.fields?.name || card.title || 'Digital Profile';
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

  const brandColor = card.workspaceBranding?.brandColor || card.themeColor || '#1E293B';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-between p-4 sm:p-6 font-sans relative">
      {/* Container Card */}
      <main className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 my-auto relative">
        
        {/* Profile Avatar & Header */}
        <div className="text-center space-y-3">
          <div
            className="h-20 w-20 rounded-full mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-xs border-2 border-white"
            style={{ backgroundColor: brandColor }}
          >
            {name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center justify-center space-x-1.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{name}</h1>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            {designation && (
              <p className="text-xs font-semibold mt-0.5" style={{ color: brandColor }}>
                {designation}
              </p>
            )}

            {company && (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {company}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs text-slate-600 text-center leading-relaxed px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            "{bio}"
          </p>
        )}

        {/* Primary CTAs */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href={`${API_BASE_URL}/api/v1/public/cards/${publicId}/vcard`}
            download
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white text-center shadow-xs transition hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2"
            style={{ backgroundColor: brandColor }}
          >
            <Download className="w-4 h-4" />
            <span>Save Contact</span>
          </a>

          <button
            onClick={() => setShowLeadModal(true)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>Exchange</span>
          </button>
        </div>

        {/* Direct Contact Links */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            DIRECT CONTACT & LINKS
          </div>

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-3 p-3 rounded-xl bg-surface-secondary border border-slate-200/80 text-xs font-semibold text-navy-900 hover:bg-slate-100 transition truncate"
            >
              <Mail className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">{email}</span>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center space-x-3 p-3 rounded-xl bg-surface-secondary border border-slate-200/80 text-xs font-semibold text-navy-900 hover:bg-slate-100 transition truncate"
            >
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{phone}</span>
            </a>
          )}

          {website && (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 p-3 rounded-xl bg-surface-secondary border border-slate-200/80 text-xs font-semibold text-navy-900 hover:bg-slate-100 transition truncate"
            >
              <Globe className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">{website}</span>
            </a>
          )}

          {/* Social Profiles Grid */}
          {(socialLinkedin || socialTwitter || socialInstagram || socialGithub || socialYoutube || socialWhatsapp) && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                SOCIAL & MEDIA PROFILES
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {socialLinkedin && (
                  <a
                    href={socialLinkedin.startsWith('http') ? socialLinkedin : `https://${socialLinkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-700 hover:bg-blue-100 transition truncate"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">LinkedIn</span>
                  </a>
                )}

                {socialTwitter && (
                  <a
                    href={socialTwitter.startsWith('http') ? socialTwitter : `https://${socialTwitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 transition truncate"
                  >
                    <Twitter className="w-4 h-4 text-slate-800 shrink-0" />
                    <span className="truncate">Twitter / X</span>
                  </a>
                )}

                {socialInstagram && (
                  <a
                    href={socialInstagram.startsWith('http') ? socialInstagram : `https://${socialInstagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-pink-50/60 border border-pink-100 text-pink-700 hover:bg-pink-100 transition truncate"
                  >
                    <ExternalLink className="w-4 h-4 text-pink-600 shrink-0" />
                    <span className="truncate">Instagram</span>
                  </a>
                )}

                {socialGithub && (
                  <a
                    href={socialGithub.startsWith('http') ? socialGithub : `https://${socialGithub}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 transition truncate"
                  >
                    <ExternalLink className="w-4 h-4 text-white shrink-0" />
                    <span className="truncate">GitHub</span>
                  </a>
                )}

                {socialYoutube && (
                  <a
                    href={socialYoutube.startsWith('http') ? socialYoutube : `https://${socialYoutube}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-rose-700 hover:bg-rose-100 transition truncate"
                  >
                    <ExternalLink className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">YouTube</span>
                  </a>
                )}

                {socialWhatsapp && (
                  <a
                    href={socialWhatsapp.startsWith('http') ? socialWhatsapp : `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition truncate"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Canonical Link */}
        <div className="pt-3 text-center border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-mono">
            {card.canonicalUrl || `alpha.me/${card.publicId}`}
          </span>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="text-[11px] font-medium text-slate-500 text-center py-4">
        Powered by Alpha Digital Professional Identity Platform
      </footer>

      {/* Exchange Contact Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
            {leadSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">Contact Exchanged!</h3>
                <p className="text-xs text-slate-500">
                  Thank you for sharing your contact details with {name}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-brand-600" />
                    <h3 className="text-lg font-bold text-navy-900">Exchange Contact Details</h3>
                  </div>
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-navy-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-navy-900 uppercase">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl bg-surface-secondary border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-navy-900 uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full rounded-xl bg-surface-secondary border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-navy-900 uppercase">PHONE NUMBER</label>
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+919876543210"
                      className="w-full rounded-xl bg-surface-secondary border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowLeadModal(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition"
                    >
                      Send Contact Card
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
