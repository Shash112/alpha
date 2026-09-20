'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Check,
  Star,
  Play,
  ArrowRight,
  Menu,
  X,
  CreditCard,
  UserCheck,
  BarChart3,
  Users,
  Calendar,
  Puzzle,
  Sparkles,
  Plus,
  Minus,
  ShieldCheck,
  Layers,
  Globe,
  Building2,
  Share2,
  UserPlus,
  Lock,
  Zap
} from 'lucide-react';

import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs = [
    {
      id: 0,
      title: 'Beautiful Cards',
      icon: CreditCard,
      description: 'Choose from modern templates or create your own. Make your card truly yours with rich media, custom branding, and more.',
      features: [
        'Multiple responsive templates',
        'Custom colors, typography & branding',
        'Add videos, links & portfolios',
        'Mobile optimized & lightning fast',
        'QR code & NFC ready'
      ]
    },
    {
      id: 1,
      title: 'Smart Sharing',
      icon: Share2,
      description: 'Share your identity effortlessly using dynamic QR codes, tap-to-share NFC hardware, custom vanity URLs, or email signatures.',
      features: [
        'Dynamic high-res QR code exports',
        'Hardware-decoupled NFC card mapping',
        'Custom vanity URL aliases',
        'One-tap vCard / contact saving',
        'Apple & Google Wallet passes'
      ]
    },
    {
      id: 2,
      title: 'Lead Management',
      icon: UserCheck,
      description: 'Turn profile views into active leads. Built-in lead capture forms automatically capture visitor details and sync directly to your CRM.',
      features: [
        'Customizable lead capture forms',
        'Instant email & push notifications',
        'CSV & vCard contact exports',
        'Lead scoring & tagging',
        'Automated follow-up workflows'
      ]
    },
    {
      id: 3,
      title: 'Powerful Analytics',
      icon: BarChart3,
      description: 'Gain valuable insights on profile engagement, card saves, tap locations, link clicks, and conversion rates in real-time.',
      features: [
        'Real-time view & save metrics',
        'Link click tracking & heatmaps',
        'Geographic tap distribution',
        'Device & browser analytics',
        'Exportable executive reports'
      ]
    },
    {
      id: 4,
      title: 'Team Collaboration',
      icon: Users,
      description: 'Centralized organization control. Provision employee cards in bulk, enforce brand guidelines, and manage roles seamlessly.',
      features: [
        'Bulk CSV employee provisioning',
        'Centralized brand & lockable templates',
        'Departmental card grouping',
        'Role-based access permissions',
        'Automated offboarding & revokes'
      ]
    },
    {
      id: 5,
      title: 'Seamless Integrations',
      icon: Puzzle,
      description: 'Connect Alpha with your existing tech stack. Sync leads to HubSpot, Salesforce, Google Workspace, Zapier, and custom webhooks.',
      features: [
        'Native CRM integrations',
        'Google & Outlook Calendar sync',
        'Zapier & Make connector app',
        'Custom Webhooks & REST API',
        'Single Sign-On (SSO / SAML)'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Is Alpha free to use?',
      answer: 'Yes! Alpha offers a generous free-forever plan that includes dynamic card creation, vector QR code sharing, lead forms, and vCard downloads with zero hidden fees.'
    },
    {
      question: 'How does lead capture work?',
      answer: 'Visitors viewing your public card can fill out a sleek lead form embedded directly on your profile. The lead details are immediately saved to your dashboard and emailed to you.'
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes! Pro and Enterprise plan subscribers can map custom CNAME domains (e.g. card.yourbrand.com) with automatic SSL certificates and full white-label branding.'
    },
    {
      question: 'Can I integrate with other tools?',
      answer: 'Alpha seamlessly integrates with Google Workspace, Microsoft 365, Salesforce, HubSpot, Zapier, Webhooks, and custom REST APIs for enterprise workflows.'
    },
    {
      question: 'Do you offer team plans?',
      answer: 'Yes. Our Team and Business plans allow organization admins to manage employee cards, control brand templates, assign roles, and view aggregated company analytics.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Security is paramount. Alpha utilizes SOC2-compliant cloud infrastructure, AES-256 database encryption at rest, TLS 1.3 in transit, and strict multi-tenant isolation.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <MarketingHeader currentPath="/" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white pt-10 sm:pt-16 pb-12 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-600 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span className="hidden sm:inline">The modern way to connect</span>
              <span className="sm:hidden">The #1 digital identity platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Your Professional Identity for a{' '}
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Connected World
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Create stunning digital business cards, capture leads, grow your network, and unlock new opportunities — all in one powerful platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Get started for free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto rounded-full bg-slate-100 px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200/60"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs pl-0.5">
                  ▶
                </div>
                <span>Watch video</span>
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Set up in minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Graphics Mockups */}
          <div className="mt-10 sm:mt-14 relative mx-auto max-w-6xl">
            {/* Desktop Hero Graphic */}
            <div className="hidden md:block relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <Image
                src="/home-hero.png"
                alt="Alpha Digital Business Card Platform"
                width={1200}
                height={680}
                className="w-full h-auto object-cover rounded-3xl"
                priority
              />
            </div>

            {/* Mobile Hero Graphic */}
            <div className="block md:hidden relative rounded-2xl overflow-hidden shadow-xl border border-slate-100">
              <Image
                src="/home-hero-mobile.png"
                alt="Alpha Digital Business Card Mobile"
                width={600}
                height={800}
                className="w-full h-auto object-cover rounded-2xl"
                priority
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-14 sm:mt-20 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center pt-8 border-t border-slate-100">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">50K+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Professionals</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">10K+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Businesses</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">2M+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Connections</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1">
                <span>4.9</span>
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">User rating</div>
            </div>
          </div>

          {/* Social Proof Logos Bar */}
          <div className="mt-12 sm:mt-16 text-center space-y-6">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
              Trusted by modern professionals and teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">Microsoft</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">Google</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">Adobe</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">Spotify</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">amazon</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">tcs</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">Infosys</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">zomato</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-700">Deloitte.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section ("More than just a digital card") */}
      <section id="features" className="py-16 sm:py-24 bg-slate-50/60 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                EVERYTHING YOU NEED
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                More than just a digital card
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Powerful tools to help you create, share, manage and grow your professional identity.
              </p>
            </div>
            <Link
              href="/register"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1.5 shrink-0"
            >
              <span>Explore all features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Business Cards</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Beautiful, customizable cards that work everywhere. Stand out with rich media, links, and sleek responsive templates.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lead Capture & CRM</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Turn every interaction into an opportunity. Collect visitor details directly on your profile with instant notifications.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics & Insights</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Understand your impact with powerful analytics. Track profile views, contact saves, and link clicks in real-time.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Teams & Organizations</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Manage your team's identity at scale. Enforce brand consistency, bulk provision employees, and group by departments.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Appointments & Events</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Let people book time with you, easily. Native appointment scheduling module built directly into your digital profile.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Puzzle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Integrations</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Connect with the tools you already use. Sync leads seamlessly with HubSpot, Salesforce, Google Workspace, and Zapier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* "Create. Share. Grow." Interactive Feature Showcase (Dark Navy Container) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="bg-[#0B1528] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 text-white shadow-2xl border border-slate-800">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Create. Share. Grow.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Everything you need to make a lasting impression.
              </p>
            </div>

            {/* 3-Column Interactive Showcase Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Interactive Tab Pills */}
              <div className="lg:col-span-4 space-y-2">
                {tabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(idx)}
                      className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 translate-x-1'
                          : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/80'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Center Column: Graphic Image */}
              <div className="lg:col-span-4 flex justify-center py-4">
                <div className="relative w-full max-w-md">
                  <Image
                    src="/create-share-grow.png"
                    alt="Create Share Grow Cards Showcase"
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Right Column: Tab Description Details */}
              <div className="lg:col-span-4 space-y-6 lg:pl-4">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {tabs[activeTab].title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {tabs[activeTab].description}
                  </p>
                </div>

                {/* Checklist */}
                <ul className="space-y-3 pt-2">
                  {tabs[activeTab].features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95"
                  >
                    <span>Explore card templates</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section ("Get started in 3 simple steps") */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get started in 3 simple steps
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Go from sign up to sharing your card in minutes.
            </p>
          </div>

          {/* 3 Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80 text-center relative group hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/30 text-base">
                1
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create your account</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Sign up in seconds and set up your personal or corporate identity profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80 text-center relative group hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/30 text-base">
                2
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-6">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customize your card</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Add your details, select a template, choose custom colors, and make it yours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80 text-center relative group hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/30 text-base">
                3
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Share & grow</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Share via QR, link or NFC tap and start building meaningful professional connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Target Banners ("For Individuals" vs "For Teams & Businesses") */}
      <section id="solutions" className="py-16 sm:py-24 bg-slate-50/60 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Banner 1: For Individuals */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group bg-white">
              <Image
                src="/individual-card-bg.png"
                alt="For Individuals Banner"
                width={700}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-500/30 px-3 py-1 rounded-full w-fit mb-3 backdrop-blur-md">
                  For Individuals
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Stand out. Be remembered.</h3>
                <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                  Create your professional identity, showcase your work and grow your network with confidence.
                </p>
                <div>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all"
                  >
                    <span>Get started free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Banner 2: For Teams & Businesses */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group bg-white">
              <Image
                src="/bussiness-card-bg.png"
                alt="For Teams & Businesses Banner"
                width={700}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-500/30 px-3 py-1 rounded-full w-fit mb-3 backdrop-blur-md">
                  For Teams & Businesses
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">One platform for your entire team.</h3>
                <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                  Manage employee cards, maintain brand consistency and track organizational engagement in real-time.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all"
                  >
                    <span>Contact sales</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border border-white text-[10px] font-bold flex items-center justify-center">RM</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 border border-white text-[10px] font-bold flex items-center justify-center">SI</div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 border border-white text-[10px] font-bold flex items-center justify-center">AN</div>
                    </div>
                    <span>Trusted by +1100 teams</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section ("What our users say") */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              LOVED BY PROFESSIONALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What our users say
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Join thousands of professionals who are growing with Alpha.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-base leading-relaxed italic">
                  "Alpha has completely changed the way I network. It's simple, powerful and looks amazing!"
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  RM
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Rohit Mehta</div>
                  <div className="text-xs text-slate-500">Founder, GrowthLabs</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-base leading-relaxed italic">
                  "Our entire team uses Alpha. It's easy to manage, and the analytics help us measure real impact."
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  SI
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Sneha Iyer</div>
                  <div className="text-xs text-slate-500">Marketing Head, TechCorp</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-base leading-relaxed italic">
                  "The best digital business card platform I've used. Clean, modern and incredibly useful."
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  AN
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Arjun Nair</div>
                  <div className="text-xs text-slate-500">Product Manager, InnovateX</div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-10">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
        </div>
      </section>

      {/* Dark Blue Call-To-Action Banner Box */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-blue-800/80">
            
            {/* Background Decorative Accent */}
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none select-none hidden lg:block pr-8 pb-4">
              <span className="text-6xl font-serif italic text-white leading-tight">
                Turn Connections into Opportunities
              </span>
            </div>

            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-800/60 border border-blue-400/30 px-3.5 py-1 rounded-full">
                READY TO GET STARTED?
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Build your professional identity today
              </h2>
              <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
                Join thousands of professionals and businesses already using Alpha.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 text-center text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Get started for free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-4 text-center text-sm transition-all active:scale-95"
                >
                  Contact sales
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything you need to know
              </h2>
            </div>
            <Link
              href="#contact"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1.5 shrink-0"
            >
              <span>View all FAQs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Accordion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 transition-all duration-200 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-base sm:text-lg focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
