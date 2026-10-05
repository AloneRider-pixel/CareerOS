import React, { useState } from 'react';
import {
  Send,
  Building2,
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  Search,
  Brain,
  DollarSign,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Application, ApplicationStatus, Job } from '../../types';
import { NegotiationHelperModal } from './NegotiationHelperModal';

interface ApplicationTrackerViewProps {
  applications: Application[];
  jobs?: Job[];
  onUpdateApplication: (appId: string, updates: Partial<Application>) => Promise<void>;
  onPrep?: (jobId: string) => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'SAVED',
  'READY_TO_APPLY',
  'APPLIED',
  'ASSESSMENT',
  'PHONE_SCREEN',
  'INTERVIEW',
  'FINAL_ROUND',
  'OFFER',
  'REJECTED',
  'CLOSED',
];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  jobs = [],
  onUpdateApplication,
  onPrep,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Negotiation Modal State
  const [selectedAppForNegotiate, setSelectedAppForNegotiate] = useState<Application | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.canonicalTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.notes.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === 'ALL' || app.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'OFFER':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'INTERVIEW':
      case 'FINAL_ROUND':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'PHONE_SCREEN':
      case 'ASSESSMENT':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'APPLIED':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'READY_TO_APPLY':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'REJECTED':
      case 'CLOSED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await onUpdateApplication(appId, {
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    });
  };

  const activeJobForModal = selectedAppForNegotiate
    ? jobs.find((j) => j.jobId === selectedAppForNegotiate.jobId) || null
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>AI-Assisted Career Progression Pipeline</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Application Tracking & Offer Management</span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300 font-normal">
              {applications.length} Tracked
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your applications from discovery to final offer, practice mock interview packs, and craft market-backed salary negotiations.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tracked companies, roles, or personal notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Statuses ({applications.length})</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s} ({applications.filter((a) => a.status === s).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {[
            { id: 'READY_TO_APPLY', title: 'Ready to Apply', count: applications.filter((a) => a.status === 'READY_TO_APPLY').length },
            { id: 'APPLIED', title: 'Applied / Sent', count: applications.filter((a) => a.status === 'APPLIED').length },
            { id: 'ASSESSMENT', title: 'Assessment / Coding', count: applications.filter((a) => a.status === 'ASSESSMENT').length },
            { id: 'INTERVIEW', title: 'Interview / Offer', count: applications.filter((a) => ['PHONE_SCREEN', 'INTERVIEW', 'FINAL_ROUND', 'OFFER'].includes(a.status)).length },
          ].map((col) => {
            const colApps = filteredApps.filter((a) => {
              if (col.id === 'INTERVIEW') {
                return ['PHONE_SCREEN', 'INTERVIEW', 'FINAL_ROUND', 'OFFER'].includes(a.status);
              }
              return a.status === col.id;
            });

            return (
              <div key={col.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-3 min-w-[260px]">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-semibold text-slate-200">{col.title}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-3.5 space-y-2.5 shadow-sm hover:border-slate-700 transition text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-100">{app.company}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {app.canonicalTitle}
                          </div>
                        </div>
                        {app.matchScore && (
                          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold">
                            {app.matchScore}%
                          </span>
                        )}
                      </div>

                      {app.resumeVersionName && (
                        <div className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-950/40 p-1.5 rounded border border-indigo-500/20">
                          <FileText className="h-3 w-3 shrink-0" />
                          <span className="truncate">{app.resumeVersionName}</span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                          &quot;{app.notes}&quot;
                        </p>
                      )}

                      {/* Action Bar for Card */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                        <span>Updated {new Date(app.lastUpdated).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          {/* Negotiation Helper Button */}
                          <button
                            onClick={() => setSelectedAppForNegotiate(app)}
                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-medium transition"
                            title="Draft Salary Negotiation Email"
                          >
                            <DollarSign className="h-2.5 w-2.5" /> Negotiate
                          </button>

                          {onPrep && (
                            <button
                              onClick={() => onPrep(app.jobId)}
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-0.5 font-medium"
                              title="Role Technical Interview Prep"
                            >
                              <Brain className="h-2.5 w-2.5" /> Prep
                            </button>
                          )}
                          <a
                            href={app.applicationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-0.5"
                          >
                            Portal <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>

                      {/* Quick Status Dropdown */}
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            Move to: {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="text-center py-6 text-slate-600 text-xs">
                      No applications in this stage.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Company & Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Resume Version</th>
                <th className="px-4 py-3">Date Applied</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">{app.company}</div>
                    <div className="text-[11px] text-slate-400">{app.canonicalTitle}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-slate-900 focus:outline-none ${getStatusBadge(app.status)}`}
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-emerald-400">{app.matchScore || 85}%</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {app.resumeVersionName || 'Default Resume'}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedAppForNegotiate(app)}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                        title="Negotiation Helper"
                      >
                        <DollarSign className="h-3 w-3" />
                        <span>Negotiate</span>
                      </button>

                      {onPrep && (
                        <button
                          onClick={() => onPrep(app.jobId)}
                          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium"
                        >
                          <Brain className="h-3 w-3" />
                          <span>Prep</span>
                        </button>
                      )}
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                      >
                        Application <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Negotiation Helper Modal */}
      {selectedAppForNegotiate && (
        <NegotiationHelperModal
          application={selectedAppForNegotiate}
          job={activeJobForModal}
          onClose={() => setSelectedAppForNegotiate(null)}
        />
      )}
    </div>
  );
};
