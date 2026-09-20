'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input, Card } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          email,
          password,
          workspaceName: workspaceName || `${displayName.split(' ')[0]}'s Workspace`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed. Please check your information.');

      const token = data.accessToken || data.tokens?.accessToken;
      const refresh = data.refreshToken || data.tokens?.refreshToken;
      const workspaceId = data.defaultWorkspaceId || data.workspace?.id || (data.workspaces && data.workspaces[0]?.workspace_id);

      if (token) localStorage.setItem('accessToken', token);
      if (refresh) localStorage.setItem('refreshToken', refresh);
      if (workspaceId) localStorage.setItem('activeWorkspaceId', workspaceId);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
            Create Your Alpha Account
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Build & manage professional digital identity cards.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Jane Doe"
            leftElement={<User className="w-4 h-4" />}
          />

          <Input
            label="Work email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            leftElement={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            leftElement={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Get Started
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-slate-900 hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
