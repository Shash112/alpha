'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Menu,
  X,
  Zap
} from 'lucide-react';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Enterprise Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/v1/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, subject, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit message');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/alpha-logo.png" alt="Alpha" width={120} height={32} className="h-8 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/product" className="hover:text-blue-600 transition-colors">Product</Link>
            <Link href="/solutions" className="hover:text-blue-600 transition-colors">Solutions</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/resources" className="hover:text-blue-600 transition-colors">Resources</Link>
            <Link href="/contact" className="text-blue-600 font-bold">Contact</Link>
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
              <Link href="/product">Product</Link>
              <Link href="/solutions">Solutions</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/contact" className="text-blue-600">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24 border-b border-slate-100 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
            <MessageSquare className="w-3.5 h-3.5 fill-blue-600" />
            <span>GET IN TOUCH WITH OUR TEAM</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about enterprise custom plans, white-label reseller licensing, or custom CNAME setup? Reach out to our team.
          </p>
        </div>
      </section>

      {/* Contact Form & Details */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-slate-50/70 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-900">Send Us a Message</h3>

              {error && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-600">
                    Your inquiry has been saved in our system. Our team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">FULL NAME</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">INQUIRY TYPE</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Enterprise Inquiry">Enterprise Plan & CNAME</option>
                      <option value="Reseller Partnership">Reseller / White-label Partner</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing & Pricing">Billing & Pricing Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">YOUR MESSAGE</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your organization and requirements..."
                      className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-extrabold text-slate-900">Direct Contact Details</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Prefer to contact us directly? Reach out via email, phone, or visit our office.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">EMAIL SUPPORT</div>
                    <div className="text-sm font-semibold text-slate-900">support@alpha.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">PHONE SALES</div>
                    <div className="text-sm font-semibold text-slate-900">+91 (080) 4567-8900</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">HEADQUARTERS</div>
                    <div className="text-sm font-semibold text-slate-900">
                      Alpha Technologies Tech Park, Outer Ring Road, Bengaluru, KA 560103
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-xs text-slate-500 space-y-4">
          <div>© 2026 Alpha SaaS Platform. All rights reserved. Made with ❤️ in India.</div>
        </div>
      </footer>
    </div>
  );
}
