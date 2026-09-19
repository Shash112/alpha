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
  Calendar,
  Layers,
  Globe,
  Puzzle,
  CreditCard as BillingIcon,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Plus,
  Menu,
  X,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { UserMenu } from '@/components/UserMenu';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:4000/api/v1/auth/me', {
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
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] text-slate-500 font-sans">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <span className="text-sm font-semibold text-navy-900">Loading Alpha Workspace...</span>
        </div>
      </div>
    );
  }

  // Navigation Structure grouped by category
  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Overview', href: '/dashboard', icon: BarChart3 }
      ]
    },
    {
      group: 'IDENTITY',
      items: [
        { name: 'My Cards', href: '/dashboard/cards', icon: CreditCard },
        { name: 'Card Builder', href: '/dashboard/cards/builder', icon: Palette },
        { name: 'Templates', href: '/dashboard/templates', icon: LayoutGrid }
      ]
    },
    {
      group: 'NETWORK',
      items: [
        { name: 'Leads & Contacts', href: '/dashboard/leads', icon: Users },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Events', href: '/dashboard/events', icon: Calendar },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Layers }
      ]
    },
    {
      group: 'WORKSPACE',
      items: [
        { name: 'Team Members', href: '/dashboard/team', icon: Users },
        { name: 'Brand & Domain', href: '/dashboard/domain', icon: Globe },
        { name: 'Integrations', href: '/dashboard/integrations', icon: Puzzle }
      ]
    },
    {
      group: 'ACCOUNT',
      items: [
        { name: 'Billing & Plans', href: '/dashboard/billing', icon: BillingIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC] text-navy-900 font-sans">
      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Desktop Left Sidebar (Independent Scroll Viewport) */}
      <aside className="w-64 h-full border-r border-slate-200/80 bg-white p-5 hidden md:flex flex-col shrink-0 shadow-subtle overflow-hidden">
        <div className="flex flex-col h-full space-y-5">
          {/* Alpha Brand Logo */}
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
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-100">
              PRO
            </span>
          </div>

          {/* Workspace Selector Dropdown */}
          <div className="shrink-0">
            <WorkspaceSwitcher
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onSelectWorkspace={handleWorkspaceChange}
              onCreateWorkspace={() => router.push('/dashboard/settings?tab=workspace')}
            />
          </div>

          {/* Grouped Navigation (Independent Scroll Region) */}
          <nav className="space-y-5 flex-1 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-bold border border-brand-100 shadow-xs'
                          : 'text-slate-600 hover:bg-surface-secondary hover:text-navy-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Account Menu Footer */}
          <div className="pt-4 border-t border-slate-100 shrink-0">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </aside>

      {/* Main Content & Top Bar Area (Independent Scroll Viewport) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-subtle z-10">
          {/* Search Trigger */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-secondary border border-slate-200/90 text-xs font-medium text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all text-left group"
            >
              <div className="flex items-center space-x-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                <span>Search cards, leads, tools...</span>
              </div>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-400 font-bold shadow-2xs">
                ⌘K
              </span>
            </button>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/cards/builder"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Card</span>
            </Link>

            <button
              onClick={() => router.push('/dashboard/analytics')}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-surface-secondary hover:text-navy-900 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600" />
            </button>

            <button
              onClick={() => router.push('/contact')}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-surface-secondary hover:text-navy-900 transition-colors"
              title="Help & Support"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Mobile Navigation Menu Button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-surface-secondary"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-lg z-20 animate-in slide-in-from-top-2 duration-150">
            <WorkspaceSwitcher
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onSelectWorkspace={handleWorkspaceChange}
            />

            <div className="space-y-3 pt-2">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                          isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <UserMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        )}

        {/* Main Workspace Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
