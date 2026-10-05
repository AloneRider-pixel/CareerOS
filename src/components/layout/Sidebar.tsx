import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Send,
  FileText,
  Sliders,
  TrendingUp,
  Building2,
  User,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'jobs'
  | 'applications'
  | 'resumes'
  | 'search'
  | 'skills'
  | 'companies'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  p0Count: number;
  activeAppsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  p0Count,
  activeAppsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'jobs' as NavTab,
      label: 'Discovered Jobs',
      icon: Briefcase,
      badge: p0Count > 0 ? `${p0Count} P0` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'applications' as NavTab,
      label: 'Application Tracker',
      icon: Send,
      badge: activeAppsCount > 0 ? `${activeAppsCount}` : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    },
    {
      id: 'resumes' as NavTab,
      label: 'Resume Studio',
      icon: FileText,
      badge: null,
    },
    {
      id: 'search' as NavTab,
      label: 'Search Engine',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'skills' as NavTab,
      label: 'Skill Gap Engine',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'companies' as NavTab,
      label: 'Company Hub',
      icon: Building2,
      badge: null,
    },
    {
      id: 'profile' as NavTab,
      label: 'Candidate Profile',
      icon: User,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-16 md:w-64 shrink-0 border-r border-slate-800 bg-slate-950/70 flex flex-col justify-between p-3 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:block">
          Core Pipeline
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="hidden md:inline truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`hidden md:inline rounded px-1.5 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 hidden md:block">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Verified Sources</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
          Google Search grounding verifies employer postings before routing applications.
        </p>
      </div>
    </aside>
  );
};
