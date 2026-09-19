'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CreditCard, Users, BarChart3, Settings, Shield, X, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Overview Dashboard', href: '/dashboard', icon: BarChart3, cat: 'Navigation' },
    { label: 'My Cards Library', href: '/dashboard/cards', icon: CreditCard, cat: 'Identity' },
    { label: 'Open Card Builder', href: '/dashboard/cards/builder', icon: CreditCard, cat: 'Identity' },
    { label: 'Leads & Contacts', href: '/dashboard/leads', icon: Users, cat: 'Network' },
    { label: 'Analytics & Insights', href: '/dashboard/analytics', icon: BarChart3, cat: 'Network' },
    { label: 'Workspace Settings', href: '/dashboard/settings', icon: Settings, cat: 'Account' },
    { label: 'Super-Admin Console', href: '/dashboard/admin', icon: Shield, cat: 'Admin' },
  ];

  const filteredLinks = quickLinks.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.cat.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-navy-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-navy-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-surface">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards, leads, tools, or settings... (Press Esc to close)"
            className="w-full bg-transparent text-sm font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredLinks.length === 0 ? (
            <div className="py-8 text-center text-xs font-medium text-slate-500">
              No matching pages found for "{query}"
            </div>
          ) : (
            filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-secondary text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-surface border border-slate-200 text-slate-600 group-hover:border-brand-500 group-hover:text-brand-500 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-navy-900 group-hover:text-brand-600">
                        {item.label}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400">
                        {item.cat}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-surface-secondary border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">↑↓</span>
            <span>Navigate</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] ml-2">↵</span>
            <span>Select</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">ESC</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
