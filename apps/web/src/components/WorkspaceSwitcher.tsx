'use client';

import { useState, useRef, useEffect } from 'react';
import { Building, ChevronDown, Plus, Check, ShieldCheck } from 'lucide-react';

interface WorkspaceSwitcherProps {
  workspaces: any[];
  activeWorkspaceId: string;
  onSelectWorkspace: (wsId: string) => void;
  onCreateWorkspace?: () => void;
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeWs = workspaces.find((w) => w.workspace_id === activeWorkspaceId) || workspaces[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Switcher Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface border border-slate-200 hover:border-slate-300 hover:bg-surface-secondary transition-all text-left shadow-subtle group"
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600 font-bold text-sm">
            {activeWs?.workspace_name?.charAt(0) || 'W'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-navy-900 truncate">
              {activeWs?.workspace_name || 'Personal Workspace'}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate flex items-center gap-1">
              <span>{activeWs?.role_name || 'Owner'}</span>
              <span>·</span>
              <span className="capitalize">{activeWs?.type?.toLowerCase() || 'Personal'}</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-navy-900 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-xl border border-slate-200 shadow-dropdown p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            WORKSPACES ({workspaces.length})
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1">
            {workspaces.map((ws) => {
              const isSelected = ws.workspace_id === activeWorkspaceId;
              return (
                <button
                  key={ws.workspace_id}
                  onClick={() => {
                    onSelectWorkspace(ws.workspace_id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'hover:bg-surface-secondary text-navy-900 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ws.workspace_name?.charAt(0) || 'W'}
                    </div>
                    <div className="truncate">
                      <div>{ws.workspace_name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{ws.role_name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {onCreateWorkspace && (
            <div className="border-t border-slate-100 pt-1 mt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateWorkspace();
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Workspace</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
