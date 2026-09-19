'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Filter,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  X,
  FileText
} from 'lucide-react';

export default function LeadsContactsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'QUALIFIED'>('ALL');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const fetchLeads = async () => {
    const token = localStorage.getItem('accessToken');
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!token || !wsId) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/workspaces/${wsId}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLeads(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Full Name', 'Email', 'Phone', 'Company', 'Status', 'Captured At'];
    const rows = leads.map((l) => [
      `"${l.full_name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.company || ''}"`,
      `"${l.status || 'NEW'}"`,
      `"${new Date(l.created_at).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alpha_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Leads & Contacts
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Manage captured contacts, exchange requests, and business leads.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-navy-900 text-xs font-bold hover:bg-surface-secondary disabled:opacity-50 transition shadow-subtle w-fit"
        >
          <Download className="w-4 h-4 text-brand-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-subtle">
        <div className="flex items-center space-x-2.5 px-3.5 py-2 bg-surface-secondary rounded-xl border border-slate-200 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, or company..."
            className="w-full bg-transparent text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {(['ALL', 'NEW', 'CONTACTED', 'QUALIFIED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === filter
                  ? 'bg-brand-600 text-white shadow-2xs'
                  : 'bg-surface-secondary text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* CRM Leads Table */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy-900">Your network starts here</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Share your Alpha card to begin receiving contact exchanges and qualified lead submissions.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5">Email & Phone</th>
                  <th className="py-3.5 px-5">Company</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Captured Date</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-secondary/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                          {lead.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-navy-900">{lead.full_name}</div>
                          <div className="text-[11px] text-slate-400">{lead.job_title || 'Contact'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 space-y-1">
                      <div className="flex items-center space-x-2 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-5 font-semibold text-navy-900">
                      {lead.company || '—'}
                    </td>

                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {lead.status || 'NEW'}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-slate-500 font-mono text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-navy-900 font-semibold text-xs hover:bg-slate-100 transition"
                      >
                        View Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer Modal for Lead Details & Notes */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy-900">Contact Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-surface-secondary">
                <div className="h-10 w-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedLead.full_name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-navy-900 text-sm">{selectedLead.full_name}</div>
                  <div className="text-slate-500">{selectedLead.email}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Company & Note</div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedLead.notes || selectedLead.message || 'No additional notes provided during contact exchange.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLead(null)}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
