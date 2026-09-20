'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Shield, Mail, Check, X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiConfig';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    fetch(`${API_BASE_URL}/api/v1/workspaces/${wsId}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Team Members & Provisioning
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Manage organization members, assign card templates, and configure RBAC roles.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
        <h3 className="text-base font-bold text-navy-900">Workspace Members ({members.length})</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {members.map((m, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                  {(m.user_email || m.email || 'M').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-navy-900">{m.user_email || m.email || 'Workspace Teammate'}</div>
                  <div className="text-[11px] text-slate-400">Assigned Role: {m.role_name || 'Owner'}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
