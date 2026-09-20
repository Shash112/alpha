'use client';

import { useState, useEffect, useRef } from 'react';
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
  Download,
  Share2,
  Save
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input, Textarea, Select, Card, Badge, Avatar } from '@/components/ui';

export default function CardBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardIdParam = searchParams.get('cardId');

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'profile' | 'contact' | 'social' | 'theme' | 'privacy'>('profile');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [savingStatus, setSavingStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

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

  const isSavingRef = useRef(false);

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
        const targetId = selectedCardId || cardIdParam || loaded[0].id;
        const targetCard = loaded.find((c: any) => c.id === targetId) || loaded[0];
        if (targetCard) {
          setSelectedCardId(targetCard.id);
          loadCardDetails(targetCard);
          setIsInitialized(true);
        }
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
    if (target) {
      loadCardDetails(target);
      setIsInitialized(true);
    }
  };

  const handleSaveCard = async (publish?: boolean) => {
    if (!selectedCardId || isSavingRef.current) return;
    isSavingRef.current = true;
    setSavingStatus('Autosaving...');

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    const targetStatus = publish !== undefined ? (publish ? 'PUBLISHED' : 'DRAFT') : cardStatus;

    try {
      const payload = {
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
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/cards/${selectedCardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCardStatus(targetStatus);
        setSavingStatus(targetStatus === 'PUBLISHED' ? 'Published live!' : 'Saved');
        setTimeout(() => setSavingStatus(''), 2500);

        setCards((prev) =>
          prev.map((c) =>
            c.id === selectedCardId
              ? {
                  ...c,
                  title,
                  vanity_slug: vanitySlug,
                  theme_color: primaryColor,
                  theme_name: themeStyle,
                  status: targetStatus,
                  sections: payload.sections
                }
              : c
          )
        );
      } else {
        const errJson = await res.json().catch(() => ({}));
        setSavingStatus(errJson.message || 'Save failed');
      }
    } catch (err) {
      setSavingStatus('Save failed');
    } finally {
      isSavingRef.current = false;
    }
  };

  // Debounced Auto-Save
  useEffect(() => {
    if (!isInitialized || !selectedCardId) return;

    const timer = setTimeout(() => {
      handleSaveCard();
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    title,
    designation,
    company,
    bio,
    avatarUrl,
    email,
    phone,
    website,
    vanitySlug,
    primaryColor,
    themeStyle,
    socialLinkedin,
    socialTwitter,
    socialInstagram,
    socialGithub,
    socialYoutube,
    socialWhatsapp
  ]);

  const colorPresets = ['#0F172A', '#1E293B', '#2563EB', '#0D9488', '#D97706', '#E11D48', '#7C3AED'];
  const activeCard = cards.find((c) => c.id === selectedCardId);

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900">
      {/* Top Studio Header */}
      <Card padding="sm" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

              <Badge variant={cardStatus === 'PUBLISHED' ? 'success' : 'warning'}>
                {cardStatus}
              </Badge>

              {savingStatus && (
                <span className="text-xs font-medium text-slate-500 animate-pulse">
                  {savingStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit card profile with live smartphone preview.
            </p>
          </div>
        </div>

        {/* Action Bar & Card Selector */}
        <div className="flex items-center space-x-2.5">
          {cards.length > 1 && (
            <Select
              value={selectedCardId}
              onChange={(e) => handleCardChange(e.target.value)}
              className="w-auto text-xs py-1.5"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title || 'Untitled Card'}
                </option>
              ))}
            </Select>
          )}

          {activeCard?.public_id && (
            <a href={`/c/${activeCard.public_id}`} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5 text-slate-500" />}>
                Preview Live
              </Button>
            </a>
          )}

          <Button variant="outline" size="sm" onClick={() => handleSaveCard()} leftIcon={<Save className="w-3.5 h-3.5 text-slate-500" />}>
            Save
          </Button>

          <Button
            variant={cardStatus === 'PUBLISHED' ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => handleSaveCard(cardStatus === 'PUBLISHED' ? false : true)}
          >
            {cardStatus === 'PUBLISHED' ? 'Unpublish' : 'Publish Live'}
          </Button>
        </div>
      </Card>

      {/* 3-Zone Studio Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Zone 1: Section Navigation (3 cols) */}
        <Card padding="sm" className="lg:col-span-3 space-y-2">
          <div className="text-xs font-bold text-slate-500 px-2 py-1">
            Sections
          </div>

          <div className="space-y-1">
            {[
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'contact', label: 'Direct Contact', icon: Mail },
              { id: 'social', label: 'Social Links', icon: Globe },
              { id: 'theme', label: 'Theme & Palette', icon: Palette },
              { id: 'privacy', label: 'URL & Identity', icon: Shield }
            ].map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Zone 2: Phone Preview (5 cols) */}
        <Card padding="md" className="lg:col-span-5 space-y-4 flex flex-col items-center">
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
                  <Avatar
                    src={avatarUrl}
                    name={title || 'Your Name'}
                    size="xl"
                    accentColor={primaryColor}
                    className="mx-auto"
                  />

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{title || 'Your Name'}</h3>
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
                    className="w-full text-center py-2.5 rounded-xl font-bold text-[11px] text-white shadow-2xs flex items-center justify-center space-x-1.5"
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
        </Card>

        {/* Zone 3: Editor Form (4 cols) */}
        <Card padding="md" className="lg:col-span-4 space-y-4">
          
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Profile Information
              </h3>

              <Input
                label="Card Title / Full Name"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Designation"
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Founder"
                />

                <Input
                  label="Company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Alpha"
                />
              </div>

              <Input
                label="Profile Photo URL (Optional)"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />

              <Textarea
                label="Bio / Summary"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short professional summary..."
              />
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Direct Contact Information
              </h3>

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Input
                label="Website URL"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourdomain.com"
              />
            </div>
          )}

          {/* Social Section */}
          {activeSection === 'social' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Social & Online Handles
              </h3>

              <Input
                label="LinkedIn Profile"
                type="text"
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                placeholder="linkedin.com/in/username"
              />

              <Input
                label="Twitter / X Handle"
                type="text"
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                placeholder="x.com/username"
              />

              <Input
                label="Instagram Link"
                type="text"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="instagram.com/username"
              />

              <Input
                label="WhatsApp Link / Number"
                type="text"
                value={socialWhatsapp}
                onChange={(e) => setSocialWhatsapp(e.target.value)}
                placeholder="+15550000000"
              />
            </div>
          )}

          {/* Theme Section */}
          {activeSection === 'theme' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Brand Palette & Theme
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Primary Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-28 font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
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
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Vanity URL Alias
              </h3>

              <Input
                label="Custom Vanity Slug"
                type="text"
                value={vanitySlug}
                onChange={(e) => setVanitySlug(e.target.value)}
                placeholder="my-alias"
                helperText="Permanent public URL will resolve to alpha.me/c/my-alias"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

