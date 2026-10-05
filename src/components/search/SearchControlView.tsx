import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  MapPin,
  Briefcase,
  History,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  Radio,
} from 'lucide-react';
import { CandidateProfile, SearchFilters, SearchRun } from '../../types';

interface SearchControlViewProps {
  candidate: CandidateProfile | null;
  searchRuns: SearchRun[];
  onTriggerSearch: (filters: Partial<SearchFilters>) => Promise<void>;
  isLoading: boolean;
}

export const SearchControlView: React.FC<SearchControlViewProps> = ({
  candidate,
  searchRuns,
  onTriggerSearch,
  isLoading,
}) => {
  const [targetRoles, setTargetRoles] = useState<string>(
    candidate?.targetRoles?.slice(0, 6).join(', ') || 'Software Engineer, Backend Engineer, FastAPI Developer'
  );
  const [targetLocations, setTargetLocations] = useState<string>(
    'Bengaluru, Hyderabad, Pune, Gurugram, Noida, Mumbai, Remote India'
  );
  const [maxExperience, setMaxExperience] = useState<number>(2);
  const [minMatch, setMinMatch] = useState<number>(70);
  const [freshnessDays, setFreshnessDays] = useState<number>(14);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    const roles = targetRoles.split(',').map((r) => r.trim()).filter(Boolean);
    const locs = targetLocations.split(',').map((l) => l.trim()).filter(Boolean);
    await onTriggerSearch({
      targetRoles: roles,
      targetLocations: locs,
      maxExperience,
      minMatchScore: minMatch,
      maxPostingAgeDays: freshnessDays,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Real Job Discovery Engine & Search Runs</span>
          <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400 font-semibold flex items-center gap-1">
            <Radio className="h-3 w-3 text-indigo-400 animate-pulse" /> Google Search Grounding
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Executes multi-query Google Search grounding across official company ATS pages (Greenhouse, Lever, Ashby, Workday), LinkedIn India, and tech career portals.
        </p>
      </div>

      {/* Control Panel */}
      <form onSubmit={handleRun} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Discovery Query Parameters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Target Roles */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Target Roles (Comma-separated)</label>
            <input
              type="text"
              value={targetRoles}
              onChange={(e) => setTargetRoles(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Adapters target canonical mappings (e.g. SDE 1, Software Engineer I, Backend Associate).
            </p>
          </div>

          {/* Target Locations */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Target Locations</label>
            <input
              type="text"
              value={targetLocations}
              onChange={(e) => setTargetLocations(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              India tech hubs prioritized (Bengaluru, Pune, Hyderabad, Gurugram, Noida, Mumbai).
            </p>
          </div>

          {/* Experience Cap */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Max Experience Cap:</span>
              <span className="text-indigo-400 font-bold">{maxExperience} Years (Freshers/Junior)</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={maxExperience}
              onChange={(e) => setMaxExperience(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Freshness Window */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Freshness Window:</span>
              <span className="text-cyan-400 font-bold">Within {freshnessDays} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={freshnessDays}
              onChange={(e) => setFreshnessDays(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Anti-hallucination guardrails active: No fabricated listings or mock URLs.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-cyan-500 transition disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Executing Search Grounding...' : 'Execute Grounded Search'}</span>
          </button>
        </div>
      </form>

      {/* Search Runs History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Search Execution Runs & Provenance</h2>
          </div>
          <span className="text-xs text-slate-400">{searchRuns.length} Persistent Runs Logged</span>
        </div>

        <div className="space-y-4">
          {searchRuns.map((run) => (
            <div
              key={run.searchRunId}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 text-xs shadow-md"
            >
              {/* Run Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-slate-300 font-semibold text-xs">{run.searchRunId}</span>
                  <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                    {run.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {new Date(run.startedAt).toLocaleString()}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="text-slate-500">Raw Found</div>
                  <div className="font-bold text-slate-200 mt-0.5">{run.rawJobsFound}</div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="text-slate-500">Duplicates Merged</div>
                  <div className="font-bold text-slate-200 mt-0.5">{run.duplicatesRemoved}</div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="text-slate-500">Verified Active</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{run.verifiedJobs}</div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="text-slate-500">Eligible</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{run.eligibleJobs}</div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="text-slate-500">P0 Immediate</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{run.p0Count}</div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="text-slate-500">P1 Today</div>
                  <div className="font-bold text-indigo-400 mt-0.5">{run.p1Count}</div>
                </div>
              </div>

              {run.summary && (
                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  {run.summary}
                </p>
              )}

              {/* Actual Google Search Queries Used */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Search className="h-3 w-3 text-cyan-400" />
                  Actual Grounding Queries Executed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {run.queriesUsed.map((q, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[11px] text-slate-300 font-mono"
                    >
                      &quot;{q}&quot;
                    </span>
                  ))}
                </div>
              </div>

              {/* Grounding Citations / Verified Sources Found */}
              {run.groundingCitations && run.groundingCitations.length > 0 && (
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Globe className="h-3 w-3 text-emerald-400" />
                    Verified Grounding Sources &amp; Citations Found:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {run.groundingCitations.slice(0, 8).map((cite, idx) => (
                      <a
                        key={idx}
                        href={cite.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800/80 text-[11px] text-cyan-400 hover:underline group"
                      >
                        <span className="truncate max-w-[85%]">{cite.title}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-70 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {searchRuns.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
              No search runs executed yet. Click &apos;Execute Grounded Search&apos; above to trigger the real discovery engine.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
