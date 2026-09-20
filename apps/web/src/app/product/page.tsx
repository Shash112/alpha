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

import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function ProductPage() {
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
      <MarketingHeader currentPath="/product" />

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

      <MarketingFooter />
    </div>
  );
}
