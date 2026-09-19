'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, Shield, ExternalLink, ChevronUp } from 'lucide-react';

interface UserMenuProps {
  user: {
    display_name?: string;
    email?: string;
    avatar_url?: string;
  };
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.display_name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl bg-surface border border-slate-200 hover:border-slate-300 hover:bg-surface-secondary transition-all shadow-subtle group text-left"
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="h-9 w-9 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="truncate text-xs font-bold text-navy-900">{user.display_name || 'User'}</div>
            <div className="truncate text-[11px] font-medium text-slate-500">{user.email || ''}</div>
          </div>
        </div>
        <ChevronUp className={`w-4 h-4 text-slate-400 group-hover:text-navy-900 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-40 bg-white rounded-xl border border-slate-200 shadow-dropdown p-1.5 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="text-xs font-bold text-navy-900">{user.display_name}</div>
            <div className="text-[11px] font-medium text-slate-400 truncate">{user.email}</div>
          </div>

          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-surface-secondary hover:text-navy-900 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Account Settings</span>
          </Link>

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Super-Admin Console</span>
          </Link>

          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
