import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Send,
  RefreshCw,
  Brain,
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  Info,
} from 'lucide-react';
import { Job, SalaryBenchmark } from '../../types';
import { fetchSalaryBenchmark, formatSalaryLPA, parseSalaryString } from '../../utils/salaryBenchmark';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  onTailor: (job: Job) => void;
  onVerify: (job: Job) => void;
  onPrep?: (job: Job) => void;
  isVerifying?: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  onTailor,
  onVerify,
  onPrep,
  isVerifying = false,
}) => {
  if (!job) return null;

  const match = job.match;

  // Salary Benchmark State
  const [benchmark, setBenchmark] = useState<SalaryBenchmark | null>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadBenchmark = async () => {
      try {
        setBenchmarkLoading(true);
        const data = await fetchSalaryBenchmark(
          job.canonicalTitle,
          job.location,
          job.salary
        );
        if (mounted) setBenchmark(data);
      } catch (err) {
        console.error('Failed to load salary benchmark:', err);
      } finally {
        if (mounted) setBenchmarkLoading(false);
      }
    };

    loadBenchmark();
    return () => {
      mounted = false;
    };
  }, [job.canonicalTitle, job.location, job.salary]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ABOVE_MARKET':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'COMPETITIVE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'BELOW_MARKET':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusLabel = (status: string, diff?: number) => {
    switch (status) {
      case 'ABOVE_MARKET':
        return `Above Market Benchmark ${diff ? `(+${diff}%)` : ''}`;
      case 'COMPETITIVE':
        return 'Market Competitive (Standard Band)';
      case 'BELOW_MARKET':
        return `Below Market Median ${diff ? `(${diff}%)` : ''}`;
      default:
        return 'Market Standard';
    }
  };

  // Helper for progress bar position
  const getPositionPercentage = () => {
    if (!benchmark) return 50;
    const min = benchmark.p25Salary * 0.8;
    const max = benchmark.p90Salary * 1.1;
    const parsed = parseSalaryString(job.salary);
    const jobMid = parsed.min || parsed.max
      ? ((parsed.min || parsed.max || benchmark.medianSalary) +
          (parsed.max || parsed.min || benchmark.medianSalary)) /
        2
      : benchmark.medianSalary;

    const clamped = Math.max(min, Math.min(max, jobMid));
    return Math.round(((clamped - min) / (max - min)) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 md:p-6 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-7 shadow-2xl text-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                {job.employmentType} • {job.workMode}
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {match?.priority || 'P1'} Priority
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-white">{job.canonicalTitle}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{job.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                {job.experienceMin}-{job.experienceMax} Years Experience
              </span>
              <span>•</span>
              <span>Posted {job.postingDate}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verification & Risk Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs">
          <div className="flex items-center gap-2.5">
            {job.verificationStatus === 'VERIFIED' ? (
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            )}
            <div>
              <div className="font-semibold text-slate-200">
                Status: {job.verificationStatus} ({job.verificationConfidence}% confidence)
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                {job.verificationNotes || 'Verified active on official career portal.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onVerify(job)}
            disabled={isVerifying}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Re-verifying...' : 'Re-verify Active'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MARKET COMPENSATION BENCHMARK SECTION */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-900 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                Compensation Intelligence
              </span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Market Salary Benchmark vs Job Offering</span>
              </h3>
            </div>

            {benchmark && (
              <span
                className={`self-start sm:self-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(
                  benchmark.offeringComparison.status
                )}`}
              >
                {getStatusLabel(
                  benchmark.offeringComparison.status,
                  benchmark.offeringComparison.percentageDifference
                )}
              </span>
            )}
          </div>

          {benchmark && (
            <div className="space-y-4 text-xs">
              {/* Offering vs Benchmark Header Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Role Listing Stated Compensation:
                  </div>
                  <div className="text-base font-bold text-white">
                    {job.salary || 'Competitive / Undisclosed Base'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {benchmark.offeringComparison.percentileEstimate || 'Standard Industry Band'}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Market Baseline Range ({job.location}):
                  </div>
                  <div className="text-base font-bold text-emerald-400">
                    {benchmark.formattedRange}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Market Median: <span className="text-slate-200 font-semibold">{formatSalaryLPA(benchmark.medianSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Visual Percentile Distribution Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>P25 (Entry): {formatSalaryLPA(benchmark.p25Salary)}</span>
                  <span>Median (P50): {formatSalaryLPA(benchmark.medianSalary)}</span>
                  <span>P75 (Top Tier): {formatSalaryLPA(benchmark.p75Salary)}</span>
                  <span>P90 (Elite): {formatSalaryLPA(benchmark.p90Salary)}</span>
                </div>

                <div className="relative h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-indigo-600 to-emerald-500 opacity-80" />
                  {/* Market median indicator line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow"
                    style={{ left: '50%' }}
                    title="Market Median"
                  />
                  {/* Job position marker */}
                  <div
                    className="absolute top-0 bottom-0 w-2.5 bg-yellow-400 border border-slate-950 rounded-sm -ml-1 transition-all"
                    style={{ left: `${getPositionPercentage()}%` }}
                    title="Current Offering Position"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-400 inline-block" />
                    <span>Current Offering Marker</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-0.5 bg-white inline-block" />
                    <span>Market Median</span>
                  </div>
                </div>
              </div>

              {/* Benchmark Commentary */}
              <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-3 text-[11px] text-slate-300 leading-relaxed">
                <span className="font-semibold text-indigo-300">Market Analysis: </span>
                {benchmark.offeringComparison.commentary}
              </div>

              {/* Key Compensation Drivers */}
              {benchmark.keyCompensationDrivers.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Key Compensation Drivers for this Role & Location:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    {benchmark.keyCompensationDrivers.map((driver, i) => (
                      <li key={i}>{driver}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {benchmarkLoading && !benchmark && (
            <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
              <span>Analyzing market compensation percentiles...</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div>
            <h4 className="font-semibold text-sm text-slate-100 mb-1">About the Role</h4>
            <p className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              {job.description}
            </p>
          </div>

          {/* Mandatory vs Preferred Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h4 className="font-semibold text-xs text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Mandatory Requirements
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {job.mandatoryRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h4 className="font-semibold text-xs text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Preferred Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.preferredSkills.concat(job.requirements).map((skill, i) => (
                  <span
                    key={i}
                    className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Candidate Analysis */}
          {match && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
              <h4 className="font-semibold text-xs text-indigo-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>AI Candidate-Job Fit Analysis</span>
                <span className="font-bold text-indigo-400">{match.overallScore}% Match</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-200">Eligibility Status: </span>
                  <span className="text-emerald-400 font-medium">{match.eligibility}</span> — {match.eligibilityReason}
                </div>
                <div>
                  <span className="font-semibold text-slate-200">Interview Probability: </span>
                  <span className="text-cyan-400 font-medium">{match.interviewProbability}</span> — {match.interviewProbabilityReason}
                </div>

                {match.advantages.length > 0 && (
                  <div>
                    <span className="font-semibold text-emerald-400">Key Advantages:</span>
                    <ul className="list-disc list-inside mt-0.5 text-slate-300">
                      {match.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.rejectionRisks.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-400">Risks to Mitigate:</span>
                    <ul className="list-disc list-inside mt-0.5 text-slate-300">
                      {match.rejectionRisks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Source Provenance */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider mb-2">
              Source Provenance ({job.sources.length} Discovered Portals)
            </h4>
            <div className="space-y-1.5 text-[11px]">
              {job.sources.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{s.name}</span>
                    <span className="text-slate-500">({s.sourceType})</span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:underline"
                  >
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400">
            Official Application: <span className="font-medium text-slate-200">{job.applicationPlatform || 'Employer Careers'}</span>
          </div>

          <div className="flex items-center gap-2">
            {onPrep && (
              <button
                onClick={() => onPrep(job)}
                className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition"
              >
                <Brain className="h-3.5 w-3.5" />
                <span>Interview Prep</span>
              </button>
            )}

            <button
              onClick={() => onTailor(job)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tailor Resume</span>
            </button>

            <button
              onClick={() => onApply(job)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-cyan-500 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Apply Now (Router)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
