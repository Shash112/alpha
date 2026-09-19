'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Settings,
  Globe,
  Users,
  Shield,
  Key,
  Check,
  Plus,
  Copy,
  AlertCircle,
  Save,
  Building,
  UserCheck,
  X
} from 'lucide-react';

export default function WorkspaceSettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'general';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [workspaceName, setWorkspaceName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [savingStatus, setSavingStatus] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaceSettings = async () => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/workspaces`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const current = (data.data || []).find((w: any) => w.id === wsId);

      if (current) {
        setWorkspaceName(current.name || '');
        setCustomDomain(current.custom_domain || '');
      }

      // Fetch Members
      const mRes = await fetch(`http://localhost:4000/api/v1/workspaces/${wsId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mData = await mRes.json();
      setMembers(mData.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus('Saving...');

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    try {
      const res = await fetch(`http://localhost:4000/api/v1/workspaces/${wsId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: workspaceName,
          customDomain
        })
      });

      if (res.ok) {
        setSavingStatus('Saved!');
        setTimeout(() => setSavingStatus(''), 2000);
      } else {
        setSavingStatus('Error saving');
      }
    } catch (err) {
      setSavingStatus('Save failed');
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    try {
      const res = await fetch(`http://localhost:4000/api/v1/workspaces/${wsId}/members/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail, role: 'Member' })
      });

      if (res.ok) {
        alert(`Invite sent to ${inviteEmail}!`);
        setInviteEmail('');
        setInviteModalOpen(false);
        fetchWorkspaceSettings();
      } else {
        alert('Failed to send invite.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Workspace Administration
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Manage workspace profile, brand, custom domain setup, and team permissions.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Profile', icon: Building },
          { id: 'domain', label: 'Brand & Custom Domain', icon: Globe },
          { id: 'team', label: 'Team Members & Roles', icon: Users },
          { id: 'security', label: 'Security & API Keys', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
                isActive
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
            General Workspace Settings
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savingStatus && (
              <span className="text-xs font-bold text-emerald-600">{savingStatus}</span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition shadow-xs ml-auto"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Brand & Custom Domain */}
      {activeTab === 'domain' && (
        <div className="space-y-6 max-w-3xl">
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
            <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
              Verified Custom CNAME Domain Mapping
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Custom Domain (e.g. card.yourcompany.com)
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="cards.acme.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 font-mono focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-secondary border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-navy-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-brand-600" />
                <span>DNS CNAME Setup Instructions</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                To link your domain, add a CNAME DNS record pointing your domain to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-navy-900 font-bold">cname.alpha.me</code>.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition shadow-xs"
            >
              Save & Verify CNAME Record
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Team Members */}
      {activeTab === 'team' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Active Workspace Members</h3>
              <p className="text-xs text-slate-500">Manage user access and assigned roles within this tenant.</p>
            </div>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Teammate</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {members.map((m, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/50">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">{m.user_email || m.email || 'Member'}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{m.role_name || 'Owner'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Invite Member */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy-900">Invite Team Member</h3>
              <button onClick={() => setInviteModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy-900 uppercase">Teammate Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition"
              >
                Send Workspace Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
