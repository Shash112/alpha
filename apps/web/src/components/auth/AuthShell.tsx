'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui';

export interface AuthShellProps {
  title: string;
  subtitle: string;
  error?: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  error,
  footerText,
  footerLinkText,
  footerLinkHref,
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <Card className="w-full max-w-sm sm:max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Image
              src="/alpha-logo.png"
              alt="Alpha"
              width={120}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="h-7 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight pt-1">
            {title}
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            {subtitle}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {children}

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          {footerText}{' '}
          <Link href={footerLinkHref} className="font-bold text-slate-900 hover:underline">
            {footerLinkText}
          </Link>
        </div>
      </Card>
    </div>
  );
};
