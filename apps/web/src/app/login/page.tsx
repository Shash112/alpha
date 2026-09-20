'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input, Card } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid email or password. Please check your credentials.');

      const token = data.accessToken || data.tokens?.accessToken;
      const refresh = data.refreshToken || data.tokens?.refreshToken;
      const workspaceId = data.defaultWorkspaceId || data.workspace?.id || (data.workspaces && data.workspaces[0]?.workspace_id);

      if (token) localStorage.setItem('accessToken', token);
      if (refresh) localStorage.setItem('refreshToken', refresh);
      if (workspaceId) localStorage.setItem('activeWorkspaceId', workspaceId);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

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
            Welcome back to Alpha
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Sign in to manage your digital identity cards.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Work email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            leftElement={<Mail className="w-4 h-4" />}
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Password</span>
              <Link href="/forgot-password" className="text-xs font-medium text-slate-600 hover:text-slate-900">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftElement={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-slate-900 hover:underline">
            Create free account
          </Link>
        </div>
      </Card>
    </div>
  );
}
