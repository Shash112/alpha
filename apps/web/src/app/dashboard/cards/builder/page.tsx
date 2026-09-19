'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  User,
  Mail,
  Phone,
  Globe,
  Share2,
  Check,
  Save,
  Eye,
  Smartphone,
  Monitor,
  Palette,
  Shield,
  Layers,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';

export default function CardBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardIdParam = searchParams.get('cardId');

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'privacy'>('content');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [savingStatus, setSavingStatus] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [vanitySlug, setVanitySlug] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [themeStyle, setThemeStyle] = useState('Professional');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialGithub, setSocialGithub] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialWhatsapp, setSocialWhatsapp] = useState('');

  const fetchCards = async () => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/workspaces/${wsId}/cards`, {
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
    setPrimaryColor(card.theme_color || '#2563EB');
    setThemeStyle(card.theme_name || 'Professional');

    const sec = card.sections || {};
    setDesignation(sec.designation || '');
    setCompany(sec.company || '');
    setBio(sec.bio || '');
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

  const handleSaveCard = async (publish: boolean = false) => {
    if (!selectedCardId) return;
    setSavingStatus('Saving...');

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    try {
      const res = await fetch(`http://localhost:4000/api/v1/workspaces/${wsId}/cards/${selectedCardId}`, {
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
          status: publish ? 'PUBLISHED' : undefined,
          sections: {
            designation,
            company,
            bio,
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
        setSavingStatus(publish ? 'Published!' : 'Saved to DB!');
        setTimeout(() => setSavingStatus(''), 2500);
        await fetchCards();
      } else {
        const errJson = await res.json().catch(() => ({}));
        setSavingStatus(errJson.message || 'Save failed');
      }
    } catch (err) {
      setSavingStatus('Save failed');
    }
  };

  const colorPresets = ['#2563EB', '#1D4ED8', '#059669', '#D97706', '#E11D48', '#0284C7', '#7C3AED', '#0F172A'];

  const activeCard = cards.find((c) => c.id === selectedCardId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/cards"
            className="p-2 rounded-xl bg-surface-secondary border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
                Card Identity Editor
              </h1>
              {savingStatus && (
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                  {savingStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Customize content, design layout, and live preview your digital profile.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Card selector dropdown if user has multiple */}
          {cards.length > 1 && (
            <select
              value={selectedCardId}
              onChange={(e) => handleCardChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-surface-secondary focus:outline-none"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title || 'Untitled Card'}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => handleSaveCard(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-surface-secondary transition"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSaveCard(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition shadow-xs"
          >
            Publish Card
          </button>
        </div>
      </div>

      {/* 3-Column Editor Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Category Tabs (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle space-y-4 h-fit">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            EDITOR NAVIGATION
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'content'
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-100 shadow-2xs'
                  : 'text-slate-600 hover:bg-surface-secondary'
              }`}
            >
              <User className="w-4 h-4 text-brand-600" />
              <span>Profile Content</span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'design'
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-100 shadow-2xs'
                  : 'text-slate-600 hover:bg-surface-secondary'
              }`}
            >
              <Palette className="w-4 h-4 text-purple-600" />
              <span>Theme & Colors</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-100 shadow-2xs'
                  : 'text-slate-600 hover:bg-surface-secondary'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>URL & Privacy</span>
            </button>
          </div>

          {activeCard && (
            <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase">CARD META</div>
              <div className="text-slate-600 font-semibold">Status: <span className="text-navy-900">{activeCard.status}</span></div>
              <div className="text-slate-600 font-semibold truncate">ID: <span className="font-mono text-slate-800">{activeCard.public_id}</span></div>
            </div>
          )}
        </div>

        {/* Center Column: Interactive Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-navy-900">Live Profile Preview</span>

            <div className="inline-flex p-1 rounded-xl bg-surface-secondary border border-slate-200">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  deviceView === 'mobile' ? 'bg-white text-navy-900 shadow-2xs' : 'text-slate-400'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  deviceView === 'desktop' ? 'bg-white text-navy-900 shadow-2xs' : 'text-slate-400'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Device Mockup Shell */}
          <div className={`w-full transition-all duration-300 ${deviceView === 'mobile' ? 'max-w-xs' : 'max-w-md'}`}>
            <div className="rounded-3xl border-4 border-slate-900 bg-slate-950 p-3 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden min-h-[440px] p-5 text-navy-900 space-y-5">
                
                {/* Header / Avatar */}
                <div className="text-center space-y-2">
                  <div
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center font-extrabold text-white text-2xl shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {title?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">{title || 'Your Name'}</h3>
                    <p className="text-xs font-semibold text-slate-500">{designation || 'Title / Role'}</p>
                    <p className="text-[11px] font-bold text-brand-600">{company || 'Company'}</p>
                  </div>
                </div>

                {/* Bio */}
                {bio && (
                  <p className="text-xs text-slate-600 text-center leading-relaxed italic px-2">
                    "{bio}"
                  </p>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div
                    className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Save Contact (.vcf)
                  </div>
                  <div className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-navy-900 font-bold text-xs">
                    Exchange Contact
                  </div>
                </div>

                {/* Contact Info Pills */}
                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  {email && (
                    <div className="flex items-center space-x-2 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center space-x-2 text-slate-600 truncate">
                      <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center space-x-2 text-slate-600 truncate">
                      <Globe className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{website}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Form Controls (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-900 border-b border-slate-100 pb-2">
                Profile Details & Social Links
              </h3>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Full Name / Card Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Founder"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Alpha Inc"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Bio / Overview</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short professional summary..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              {/* Social Links Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-[11px] font-bold text-navy-900 uppercase tracking-wider">
                  Social Profiles & Media Links
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={socialLinkedin}
                    onChange={(e) => setSocialLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Twitter / X Handle</label>
                  <input
                    type="text"
                    value={socialTwitter}
                    onChange={(e) => setSocialTwitter(e.target.value)}
                    placeholder="https://x.com/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Instagram Profile</label>
                  <input
                    type="text"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">GitHub Profile</label>
                  <input
                    type="text"
                    value={socialGithub}
                    onChange={(e) => setSocialGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">YouTube Channel</label>
                  <input
                    type="text"
                    value={socialYoutube}
                    onChange={(e) => setSocialYoutube(e.target.value)}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">WhatsApp Number / Link</label>
                  <input
                    type="text"
                    value={socialWhatsapp}
                    onChange={(e) => setSocialWhatsapp(e.target.value)}
                    placeholder="+919876543210 or wa.me/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-navy-900 border-b border-slate-100 pb-2">
                Brand Palette & Styling
              </h3>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Primary Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-navy-900"
                  />
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
                      className="w-6 h-6 rounded-full border border-slate-200 shadow-2xs hover:scale-110 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Theme Template</label>
                <select
                  value={themeStyle}
                  onChange={(e) => setThemeStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 font-semibold focus:outline-none"
                >
                  <option value="Professional">Professional (Corporate Navy)</option>
                  <option value="Executive">Executive (High Contrast)</option>
                  <option value="Minimal">Minimal (Clean Light)</option>
                  <option value="Creative">Creative (Vibrant Accent)</option>
                  <option value="Modern">Modern (Tech)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-900 border-b border-slate-100 pb-2">
                URL Alias & Privacy Controls
              </h3>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Custom Vanity URL Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-surface-secondary border border-r-0 border-slate-200 rounded-l-xl text-xs font-mono text-slate-500">
                    alpha.me/
                  </span>
                  <input
                    type="text"
                    value={vanitySlug}
                    onChange={(e) => setVanitySlug(e.target.value)}
                    placeholder="shashank"
                    className="w-full px-3 py-2 rounded-r-xl border border-slate-200 text-xs text-navy-900 font-mono focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-secondary border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-navy-900">Canonical Identity Protection</div>
                <p className="text-[11px] leading-relaxed">
                  Your public card remains accessible via public ID permanently. Vanity aliases can be changed anytime.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
