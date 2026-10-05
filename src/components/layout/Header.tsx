import React from 'react';
import {
  Compass,
  Search,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { CandidateProfile } from '../../types';

interface HeaderProps {
  profile: CandidateProfile | null;
  onOpenSearch: () => void;
  onQuickSearch: (query: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenSearch,
  onQuickSearch,
  theme,
  onToggleTheme,
  searchLoading,
}) => {
  const [query, setQuery] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(query);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-md md:px-8">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">CareerOS</span>
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-400 border border-indigo-500/20">
                AI JobHunter
              </span>
            </div>
            <div className="hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounding Live</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-0.5 text-slate-400">
                <MapPin className="h-3 w-3 text-cyan-400" /> India Tech Hubs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Quick Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex max-w-md flex-1 px-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, skills (Python, FastAPI, RAG, Pune)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onQuickSearch(e.target.value);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </form>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          disabled={searchLoading}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-3.5 py-2 text-xs font-medium text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-cyan-500 transition disabled:opacity-50"
        >
          <Sparkles className={`h-3.5 w-3.5 ${searchLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{searchLoading ? 'Grounding...' : 'Run Search'}</span>
          <span className="sm:hidden">Search</span>
        </button>

        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Profile Pill */}
        {profile && (
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/90 py-1 px-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {profile.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-medium text-slate-200 leading-tight flex items-center gap-1">
                {profile.name}
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {profile.education[0]?.degree?.split(' in ')[0] || 'B.Tech CSE'} (2025)
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
