import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  MapPin,
  Briefcase,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Job, PriorityLevel, WorkMode } from '../../types';
import { JobCard } from './JobCard';

interface JobsListViewProps {
  jobs: Job[];
  onApply: (job: Job) => void;
  onTailor: (job: Job) => void;
  onTrack: (job: Job) => void;
  onView: (job: Job) => void;
  onVerify: (job: Job) => void;
  onPrep?: (job: Job) => void;
  onTriggerSearch: () => void;
  isSearching: boolean;
  trackedJobIds: Set<string>;
}

export const JobsListView: React.FC<JobsListViewProps> = ({
  jobs,
  onApply,
  onTailor,
  onTrack,
  onView,
  onVerify,
  onPrep,
  onTriggerSearch,
  isSearching,
  trackedJobIds,
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [workModeFilter, setWorkModeFilter] = useState<string>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, priorityFilter, workModeFilter, verifiedOnly, locationFilter]);

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      job.canonicalTitle.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.requirements.some((r) => r.toLowerCase().includes(q)) ||
      job.description.toLowerCase().includes(q);

    const matchesPriority =
      priorityFilter === 'ALL' || job.match?.priority === priorityFilter;

    const matchesWorkMode =
      workModeFilter === 'ALL' || job.workMode.toLowerCase() === workModeFilter.toLowerCase();

    const matchesVerified = !verifiedOnly || job.verified || job.verificationStatus === 'VERIFIED';

    const matchesLocation =
      locationFilter === 'ALL' || job.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesPriority && matchesWorkMode && matchesVerified && matchesLocation;
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredJobs.length);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Verified Tech Job Opportunities</span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300 font-normal">
              {filteredJobs.length} active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deduplicated jobs with direct ATS links, freshness tracking, and AI match scoring for 2025 early-career engineers.
          </p>
        </div>

        <button
          onClick={onTriggerSearch}
          disabled={isSearching}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-cyan-500 transition disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
          <span>{isSearching ? 'Executing Search Grounding...' : 'Discover Fresh Jobs'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, company, skills (e.g. FastAPI, LangGraph, Airflow), or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="P0">P0 • Apply Now (Score &gt;= 85)</option>
            <option value="P1">P1 • Apply Today (Score &gt;= 75)</option>
            <option value="P2">P2 • Apply This Week</option>
          </select>

          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Noida">Noida</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-300 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Verified Active Only
            </span>
          </label>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="font-semibold text-slate-200">{filteredJobs.length > 0 ? startIndex + 1 : 0} - {endIndex}</span> of{' '}
          <span className="font-semibold text-slate-200">{filteredJobs.length}</span> verified postings
        </span>
        <span className="text-[11px] text-slate-500">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Jobs List (Paginated) */}
      <div className="space-y-4">
        {paginatedJobs.map((job) => (
          <JobCard
            key={job.jobId}
            job={job}
            onApply={onApply}
            onTailor={onTailor}
            onTrack={onTrack}
            onView={onView}
            onVerify={onVerify}
            onPrep={onPrep}
            isTracked={trackedJobIds.has(job.jobId)}
          />
        ))}

        {filteredJobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 py-12 text-center text-xs text-slate-400">
            No matching jobs found with the active filters. Try adjusting your query or execute a fresh grounded search.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 hover:bg-slate-800 text-slate-300 transition disabled:opacity-40 disabled:hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 hover:bg-slate-800 text-slate-300 transition disabled:opacity-40 disabled:hover:bg-slate-900"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
