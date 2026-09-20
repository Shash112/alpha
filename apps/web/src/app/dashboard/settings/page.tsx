'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Globe,
  Users,
  Shield,
  Plus,
  Building,
  Key,
  CheckCircle2
} from 'lucide-react';

import { API_BASE_URL } from '@/lib/apiConfig';
import { Button, Input, Card, Badge, Modal, PageHeader, Spinner } from '@/components/ui';

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'general';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [workspaceName, setWorkspaceName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [savingStatus, setSavingStatus] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchWorkspaceSettings = async () => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const current = (data.data || []).find((w: any) => w.id === wsId);

      if (current) {
        setWorkspaceName(current.name || '');
        setCustomDomain(current.custom_domain || '');
      }

      // Fetch Members
      const mRes = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/members`, {
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
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/settings`, {
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
    setInviteSubmitting(true);

    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/members/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail, role: 'Member' })
      });

      if (res.ok) {
        setInviteEmail('');
        setInviteModalOpen(false);
        fetchWorkspaceSettings();
      } else {
        alert('Failed to send invite.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInviteSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-3">
          <Spinner size="sm" />
          <span className="text-xs font-semibold text-slate-700">Loading settings...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General & Profile', icon: Building },
    { id: 'domain', label: 'Brand & Custom Domain', icon: Globe },
    { id: 'team', label: 'Team Members & Roles', icon: Users },
    { id: 'security', label: 'Security & API Keys', icon: Shield }
  ];

  return (
    <div className="space-y-8 pb-12 font-sans text-slate-900">
      <PageHeader
        title="Workspace Administration"
        description="Manage workspace profile, brand, custom domain setup, and team permissions."
      />

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
                isActive
                  ? 'border-slate-900 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
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
        <Card padding="lg" className="max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">General Workspace Settings</h3>
            <p className="text-xs text-slate-500">Update workspace metadata and tenant details.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <Input
              label="Workspace Name"
              type="text"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />

            <div className="flex items-center justify-between pt-2">
              {savingStatus && (
                <span className="text-xs font-bold text-emerald-600">{savingStatus}</span>
              )}
              <Button type="submit" className="ml-auto">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Brand & Custom Domain */}
      {activeTab === 'domain' && (
        <Card padding="lg" className="max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Verified Custom CNAME Domain Mapping</h3>
            <p className="text-xs text-slate-500">Host your public digital cards on a custom domain (e.g. cards.yourcompany.com).</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <Input
              label="Custom Domain (e.g. card.yourcompany.com)"
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="cards.acme.com"
            />

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-slate-600" />
                <span>DNS CNAME Setup Instructions</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add a CNAME DNS record pointing your domain to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-900 font-bold">cname.alpha.me</code>.
              </p>
            </div>

            <Button type="submit">
              Save & Verify CNAME Record
            </Button>
          </form>
        </Card>
      )}

      {/* Tab 3: Team Members */}
      {activeTab === 'team' && (
        <Card padding="lg" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Workspace Members</h3>
              <p className="text-xs text-slate-500">Manage user access, roles, and invitations within this workspace.</p>
            </div>

            <Button
              onClick={() => setInviteModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Invite Teammate
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {members.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{m.user_email || m.email || 'Member'}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{m.role_name || 'Owner'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">ACTIVE</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 4: Security & API Keys */}
      {activeTab === 'security' && (
        <Card padding="lg" className="max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Security & API Credentials</h3>
            <p className="text-xs text-slate-500">Manage OAuth keys, session security, and multi-tenant isolation rules.</p>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-2">
                  <Key className="w-4 h-4 text-slate-500" />
                  <span>Workspace API Key</span>
                </div>
                <div className="font-mono text-[11px] text-slate-500">pk_live_alpha_018f92a1000070008000000000000020</div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Multi-Tenant Tenant Isolation</span>
                </div>
                <p className="text-slate-500 text-[11px]">Strict schema & authorization context isolation enforced.</p>
              </div>
              <Badge variant="success">Enforced</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Modal: Invite Member */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <Input
            label="Teammate Email Address"
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
          />

          <div className="pt-2 flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={inviteSubmitting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Spinner size="sm" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
