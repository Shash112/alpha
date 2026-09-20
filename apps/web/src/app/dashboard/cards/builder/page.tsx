'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Globe,
  Palette,
  Shield,
  ArrowLeft,
  Smartphone,
  Monitor,
  Eye,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';

export default function CardBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardIdParam = searchParams.get('cardId');

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'profile' | 'contact' | 'social' | 'theme' | 'privacy'>('profile');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [savingStatus, setSavingStatus] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [vanitySlug, setVanitySlug] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0F172A');
  const [themeStyle, setThemeStyle] = useState('Professional');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialGithub, setSocialGithub] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialWhatsapp, setSocialWhatsapp] = useState('');
  const [cardStatus, setCardStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  const fetchCards = async () => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const loaded = data.data || [];
      setCards(loaded);

      if (loaded.length > 0) {
        setSelectedCardId((prevId) => {
          const targetId = prevId || cardIdParam;
          const targetCard = (targetId && loaded.find((c: any) => c.id === targetId)) || loaded[0];
          if (targetCard) {
            loadCardDetails(targetCard);
            return targetCard.id;
          }
          return prevId;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCardDetails = (card: any) => {
    if (!card) return;
    setTitle(card.title || '');
    setVanitySlug(card.vanity_slug || '');
    setPrimaryColor(card.theme_color || '#0F172A');
    setThemeStyle(card.theme_name || 'Professional');
    setCardStatus(card.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');

    const sec = card.sections || {};
    setDesignation(sec.designation || '');
    setCompany(sec.company || '');
    setBio(sec.bio || '');
    setAvatarUrl(sec.avatar_url || sec.avatarUrl || '');
    setEmail(sec.email || '');
    setPhone(sec.phone || '');
    setWebsite(sec.website || '');
    setSocialLinkedin(sec.social_linkedin || '');
    setSocialTwitter(sec.social_twitter || '');
    setSocialInstagram(sec.social_instagram || '');
    setSocialGithub(sec.social_github || '');
    setSocialYoutube(sec.social_youtube || '');
    setSocialWhatsapp(sec.social_whatsapp || '');
  };

  useEffect(() => {
    fetchCards();
  }, [cardIdParam]);

  const handleCardChange = (id: string) => {
    setSelectedCardId(id);
    const target = cards.find((c) => c.id === id);
    if (target) loadCardDetails(target);
  };

  const handleSaveCard = async (publish?: boolean) => {
    if (!selectedCardId) return;
    setSavingStatus('Autosaving...');

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    const targetStatus = publish !== undefined ? (publish ? 'PUBLISHED' : 'DRAFT') : cardStatus;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards/${selectedCardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          vanitySlug,
          themeColor: primaryColor,
          themeName: themeStyle,
          status: targetStatus,
          sections: {
            designation,
            company,
            bio,
            avatar_url: avatarUrl,
            email,
            phone,
            website,
            social_linkedin: socialLinkedin,
            social_twitter: socialTwitter,
            social_instagram: socialInstagram,
            social_github: socialGithub,
            social_youtube: socialYoutube,
            social_whatsapp: socialWhatsapp
          }
        })
      });

      if (res.ok) {
        setCardStatus(targetStatus);
        setSavingStatus(targetStatus === 'PUBLISHED' ? 'Published live!' : 'Saved to draft');
        setTimeout(() => setSavingStatus(''), 2000);
        await fetchCards();
      } else {
        const errJson = await res.json().catch(() => ({}));
        setSavingStatus(errJson.message || 'Save failed');
      }
    } catch (err) {
      setSavingStatus('Save failed');
    }
  };

  const colorPresets = ['#0F172A', '#1E293B', '#2563EB', '#0D9488', '#D97706', '#E11D48', '#7C3AED'];
  const activeCard = cards.find((c) => c.id === selectedCardId);

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900">
      {/* Top Studio Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/cards"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Card Studio Editor
              </h1>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  cardStatus === 'PUBLISHED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {cardStatus}
              </span>

              {savingStatus && (
                <span className="text-[11px] font-semibold text-slate-500 animate-pulse">
                  {savingStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time card editor with live smartphone preview.
            </p>
          </div>
        </div>

        {/* Action Bar & Card Selector */}
        <div className="flex items-center space-x-3">
          {cards.length > 1 && (
            <select
              value={selectedCardId}
              onChange={(e) => handleCardChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title || 'Untitled Card'}
                </option>
              ))}
            </select>
          )}

          {activeCard?.public_id && (
            <a
              href={`/c/${activeCard.public_id}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Live</span>
            </a>
          )}

          <button
            onClick={() => handleSaveCard(cardStatus === 'PUBLISHED' ? false : true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              cardStatus === 'PUBLISHED'
                ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {cardStatus === 'PUBLISHED' ? 'Unpublish' : 'Publish Live'}
          </button>
        </div>
      </div>

      {/* 3-Zone Studio Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Zone 1: Builder Section Navigation (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
            SECTIONS
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'profile'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <User className="w-4 h-4 shrink-0" />
                <span>Profile Info</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('contact')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'contact'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 shrink-0" />
                <span>Direct Contact</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('social')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'social'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Globe className="w-4 h-4 shrink-0" />
                <span>Social Links</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('theme')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'theme'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Palette className="w-4 h-4 shrink-0" />
                <span>Theme & Palette</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('privacy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'privacy'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 shrink-0" />
                <span>URL & Identity</span>
              </div>
            </button>
          </div>
        </div>

        {/* Zone 2: Real-Time Phone Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">Phone Live Preview</span>

            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  deviceView === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  deviceView === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* High-Fidelity Phone Preview matching Public Card */}
          <div className={`w-full transition-all duration-300 ${deviceView === 'mobile' ? 'max-w-xs' : 'max-w-md'}`}>
            <div className="rounded-[2.5rem] border-4 border-slate-900 bg-slate-950 p-3 shadow-xl">
              <div className="bg-white rounded-[2rem] overflow-hidden min-h-[440px] p-5 text-slate-900 space-y-4">
                
                {/* Header */}
                <div className="text-center space-y-2">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={title}
                      className="w-16 h-16 rounded-full object-cover mx-auto shadow-xs border-2 border-white ring-1 ring-slate-200"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-extrabold text-white text-xl shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {title?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <h3 className="text-base font-extrabold text-slate-900">{title || 'Your Name'}</h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    {(designation || company) && (
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {designation}
                        {designation && company ? ' • ' : ''}
                        {company && <span className="text-slate-500 font-normal">{company}</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {bio && (
                  <p className="text-[11px] text-slate-500 text-center font-normal leading-relaxed px-2">
                    {bio}
                  </p>
                )}

                {/* Action Suite */}
                <div className="space-y-1.5 pt-1">
                  <div
                    className="w-full text-center py-2.5 rounded-xl font-bold text-[11px] text-white shadow-xs flex items-center justify-center space-x-1.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Contact</span>
                  </div>
                  <div className="w-full text-center py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-[11px] bg-slate-50 flex items-center justify-center space-x-1.5">
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Exchange Details</span>
                  </div>
                </div>

                {/* Clean Contact Rows */}
                {(phone || email || website) && (
                  <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                    {phone && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] text-slate-800">
                        <div className="flex items-center space-x-2 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{phone}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">Call</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] text-slate-800">
                        <div className="flex items-center space-x-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{email}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">Email</span>
                      </div>
                    )}
                    {website && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] text-slate-800">
                        <div className="flex items-center space-x-2 truncate">
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{website}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">Website</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Zone 3: Section Editor Pane (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Profile Information
              </h3>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Card Title / Full Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    handleSaveCard();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => {
                      setDesignation(e.target.value);
                      handleSaveCard();
                    }}
                    placeholder="e.g. Founder"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      handleSaveCard();
                    }}
                    placeholder="e.g. Alpha"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    handleSaveCard();
                  }}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Bio / Summary</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    handleSaveCard();
                  }}
                  placeholder="Short professional summary..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Direct Contact Information
              </h3>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleSaveCard();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    handleSaveCard();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    handleSaveCard();
                  }}
                  placeholder="https://yourdomain.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          )}

          {/* Social Section */}
          {activeSection === 'social' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Social & Online Handles
              </h3>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">LinkedIn Profile</label>
                <input
                  type="text"
                  value={socialLinkedin}
                  onChange={(e) => { setSocialLinkedin(e.target.value); handleSaveCard(); }}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Twitter / X Handle</label>
                <input
                  type="text"
                  value={socialTwitter}
                  onChange={(e) => { setSocialTwitter(e.target.value); handleSaveCard(); }}
                  placeholder="x.com/username"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Instagram Link</label>
                <input
                  type="text"
                  value={socialInstagram}
                  onChange={(e) => { setSocialInstagram(e.target.value); handleSaveCard(); }}
                  placeholder="instagram.com/username"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">WhatsApp Link / Number</label>
                <input
                  type="text"
                  value={socialWhatsapp}
                  onChange={(e) => { setSocialWhatsapp(e.target.value); handleSaveCard(); }}
                  placeholder="+15550000000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          )}

          {/* Theme Section */}
          {activeSection === 'theme' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Brand Palette & Theme
              </h3>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Primary Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => { setPrimaryColor(e.target.value); handleSaveCard(); }}
                    className="w-8 h-8 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => { setPrimaryColor(e.target.value); handleSaveCard(); }}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setPrimaryColor(c); handleSaveCard(); }}
                      className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Vanity URL Alias
              </h3>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Custom Vanity Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-mono text-slate-500">
                    alpha.me/c/
                  </span>
                  <input
                    type="text"
                    value={vanitySlug}
                    onChange={(e) => { setVanitySlug(e.target.value); handleSaveCard(); }}
                    placeholder="my-alias"
                    className="w-full px-3 py-2 rounded-r-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
