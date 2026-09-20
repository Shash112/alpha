'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';

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
    <AuthShell
      title="Create Your Alpha Account"
      subtitle="Build & manage professional digital identity cards."
      error={error}
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
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
    </AuthShell>
  );
}
