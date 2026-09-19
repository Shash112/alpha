'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/alpha-logo.png" alt="Alpha" width={120} height={32} className="h-8 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/product" className="hover:text-blue-600">Product</Link>
            <Link href="/solutions" className="hover:text-blue-600">Solutions</Link>
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/resources" className="hover:text-blue-600">Resources</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 space-y-8">
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>LEGAL & COMPLIANCE</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500">Effective Date: January 1, 2026 | Last Updated: September 15, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <h3 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the Alpha Digital Identity and Visiting Card SaaS Platform ("Platform"), you agree to be bound by these Terms of Service.
          </p>

          <h3 className="text-xl font-bold text-slate-900">2. Acceptable Use & Content Policy</h3>
          <p>
            You agree not to use Alpha for phishing, impersonation, spamming, malware distribution, or publishing illegal content. Platform administrators reserve the right to suspend any card profile involved in terms violations.
          </p>

          <h3 className="text-xl font-bold text-slate-900">3. Commercial Plans & Subscriptions</h3>
          <p>
            Paid subscriptions (Pro, Team, Business, Enterprise) are billed on a recurring monthly or annual basis via Razorpay or invoice. You may upgrade or cancel subscriptions at any time through your workspace billing dashboard.
          </p>

          <h3 className="text-xl font-bold text-slate-900">4. Domain & Vanity Alias Ownership</h3>
          <p>
            Vanity URL aliases (alpha.com/alias) are assigned on a first-come, first-served basis. Trademark infringement or squatting may result in alias revocation.
          </p>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 text-center text-xs">
        © 2026 Alpha SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
}
