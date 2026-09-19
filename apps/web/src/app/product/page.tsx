'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CreditCard,
  Share2,
  UserCheck,
  BarChart3,
  Users,
  Calendar,
  Puzzle,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Menu,
  X,
  Sparkles,
  Globe,
  Layers,
  Smartphone
} from 'lucide-react';

export default function ProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const productFeatures = [
    {
      icon: CreditCard,
      badge: 'DIGITAL CARDS',
      title: 'Dynamic Business Cards',
      description: 'Create and customize multiple professional identities for consulting, business, events, or role-specific networking.',
      bullets: [
        'Schema-driven responsive template engine',
        'Custom brand color palettes, fonts & logos',
        'Embedded video, portfolio links & social media',
        'Granular field-level privacy visibility rules'
      ]
    },
    {
      icon: Share2,
      badge: 'SHARING & NFC',
      title: 'QR Code & NFC Tap Routing',
      description: 'Share your card instantly using dynamic vector QR codes or hardware-decoupled physical NFC cards.',
      bullets: [
        'High-resolution vector SVG/PNG QR exports',
        'Software-mapped physical NFC card tap routing',
        'Apple Wallet & Google Pay pass integration',
        'One-tap .vcf contact file saving to phone'
      ]
    },
    {
      icon: UserCheck,
      badge: 'LEADS & CRM',
      title: 'Lead Capture & CRM Lite',
      description: 'Convert profile visitors into warm business leads with embedded contact exchange forms.',
      bullets: [
        'Customizable lead capture forms on public cards',
        'Instant email & SMS lead alerts',
        'Export leads via CSV or vCard formats',
        'Lead status tracking (New, Contacted, Converted)'
      ]
    },
    {
      icon: BarChart3,
      badge: 'ANALYTICS',
      title: 'Real-Time Engagement Analytics',
      description: 'Measure the impact of your networking with asynchronous metric tracking decoupled from public card rendering.',
      bullets: [
        'Real-time view & save counts',
        'Link click tracking & engagement heatmaps',
        'Geographic & device tap breakdown',
        'Exportable performance metrics'
      ]
    },
    {
      icon: Users,
      badge: 'ORGANIZATIONS',
      title: 'Teams & Organization Governance',
      description: 'Empower your enterprise with centralized employee identity provisioning and brand guidelines.',
      bullets: [
        'Bulk CSV employee card provisioning',
        'Lockable corporate templates & brand assets',
        'Departmental grouping & role-based access',
        'Automated employee offboarding & revokes'
      ]
    },
    {
      icon: Calendar,
      badge: 'BOOKINGS',
      title: 'Native Appointment Booking',
      description: 'Allow clients and prospects to schedule meetings directly from your public digital card profile.',
      bullets: [
        'Real-time availability slot generator',
        'Direct Google Calendar & Outlook sync',
        'Custom meeting duration & buffer rules',
        'Automated calendar invite emails'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/alpha-logo.png"
              alt="Alpha"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/product" className="text-blue-600 font-bold">Product</Link>
            <Link href="/solutions" className="hover:text-blue-600 transition-colors">Solutions</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/resources" className="hover:text-blue-600 transition-colors">Resources</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-700">
              <Link href="/product" className="text-blue-600">Product</Link>
              <Link href="/solutions" className="hover:text-blue-600">Solutions</Link>
              <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
              <Link href="/resources" className="hover:text-blue-600">Resources</Link>
              <Link href="/contact" className="hover:text-blue-600">Contact</Link>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
              <Link href="/login" className="w-full text-center py-3 font-semibold text-slate-700 bg-slate-100 rounded-xl">
                Sign in
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
            <Zap className="w-3.5 h-3.5 fill-blue-600" />
            <span>COMPREHENSIVE PRODUCT PLATFORM</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            The Complete Platform for{' '}
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Digital Identity & Growth
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to build your professional brand, share across digital and physical touchpoints, capture leads, and manage organizational identity.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Deep Feature Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-wider">
                      {feat.badge}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feat.description}</p>
                    <ul className="space-y-2 pt-2 border-t border-slate-200/60">
                      {feat.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <Link href="/">
              <Image src="/alpha-logo-white.png" alt="Alpha" width={130} height={36} className="h-9 w-auto object-contain" />
            </Link>
            <div className="flex space-x-6 text-sm text-slate-400">
              <Link href="/product" className="hover:text-white">Product</Link>
              <Link href="/solutions" className="hover:text-white">Solutions</Link>
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
              <Link href="/resources" className="hover:text-white">Resources</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="pt-8 text-center text-xs text-slate-500">
            © 2026 Alpha SaaS Platform. All rights reserved. Made with ❤️ in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
