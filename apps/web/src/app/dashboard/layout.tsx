'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart3,
  CreditCard,
  Palette,
  Users,
  Layers,
  Globe,
  Puzzle,
  CreditCard as BillingIcon,
  Settings,
  Search,
  Plus
} from 'lucide-react';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { UserMenu } from '@/components/UserMenu';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { API_BASE_URL } from '@/lib/apiConfig';
import { Spinner } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setWorkspaces(data.workspaces || []);
          const storedWs = localStorage.getItem('activeWorkspaceId');
          const currentWs = storedWs || data.workspaces?.[0]?.workspace_id || '';
          setActiveWorkspaceId(currentWs);
          localStorage.setItem('activeWorkspaceId', currentWs);
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleWorkspaceChange = (wsId: string) => {
    setActiveWorkspaceId(wsId);
    localStorage.setItem('activeWorkspaceId', wsId);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 font-sans p-4">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <Spinner size="sm" />
          <span className="text-xs font-semibold text-slate-800">Loading workspace...</span>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { name: 'Overview', href: '/dashboard', icon: BarChart3 }
      ]
    },
    {
      group: 'Digital Identity',
      items: [
        { name: 'My Cards', href: '/dashboard/cards', icon: CreditCard },
        { name: 'Card Studio', href: '/dashboard/cards/builder', icon: Palette }
      ]
    },
    {
      group: 'Network & Growth',
      items: [
        { name: 'Leads & Contacts', href: '/dashboard/leads', icon: Users },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Layers }
      ]
    },
    {
      group: 'Workspace',
      items: [
        { name: 'Team Members', href: '/dashboard/team', icon: Users },
        { name: 'Custom Domain', href: '/dashboard/domain', icon: Globe },
        { name: 'Integrations', href: '/dashboard/integrations', icon: Puzzle }
      ]
    },
    {
      group: 'Account',
      items: [
        { name: 'Billing & Plans', href: '/dashboard/billing', icon: BillingIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Sidebar Navigation */}
      <aside className="w-64 h-full border-r border-slate-200 bg-white p-5 hidden md:flex flex-col shrink-0 overflow-hidden">
        <div className="flex flex-col h-full space-y-5">
          
          {/* Logo */}
          <div className="flex items-center justify-between px-2 pt-1 shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/alpha-logo.png"
                alt="Alpha"
                width={110}
                height={30}
                style={{ width: 'auto', height: 'auto' }}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Workspace Switcher */}
          <div className="shrink-0">
            <WorkspaceSwitcher
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onSelectWorkspace={handleWorkspaceChange}
              onCreateWorkspace={() => router.push('/dashboard/settings?tab=workspace')}
            />
          </div>

          {/* Grouped Navigation */}
          <nav className="space-y-4 flex-1 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 text-xs font-bold text-slate-400">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'bg-slate-900 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Account Menu Footer */}
          <div className="pt-3 border-t border-slate-100 shrink-0">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </aside>

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Control Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search workspace...</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/cards/builder"
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Card</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
