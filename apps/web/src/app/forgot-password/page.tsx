'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-navy-900 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-dropdown space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Image
              src="/alpha-logo.png"
              alt="Alpha"
              width={120}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="h-8 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight pt-2">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500">
            Enter your account email to receive reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900">Reset Email Sent</h3>
            <p className="text-xs text-slate-500">
              If an account exists for {email}, password recovery instructions have been delivered.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 hover:text-brand-700 pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 active:scale-95 transition-all shadow-xs"
            >
              Send Reset Instructions
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
