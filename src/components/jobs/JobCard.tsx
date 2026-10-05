import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  MapPin,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Send,
  Eye,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { Job, PriorityLevel } from '../../types';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onTailor: (job: Job) => void;
  onTrack: (job: Job) => void;
  onView: (job: Job) => void;
  onVerify?: (job: Job) => void;
  onPrep?: (job: Job) => void;
  isTracked?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onTailor,
  onTrack,
  onView,
  onVerify,
  onPrep,
  isTracked = false,
}) => {
  const [showMatchBreakdown, setShowMatchBreakdown] = useState(false);

  const match = job.match;
  const overallScore = match?.overallScore ?? 75;
  const priority = match?.priority || 'P2';
  const interviewProb = match?.interviewProbability || 'MEDIUM';

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'P0':
        return {
          label: 'P0 • APPLY IMMEDIATELY',
          style: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20',
        };
      case 'P1':
        return {
          label: 'P1 • APPLY TODAY',
          style: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        };
      case 'P2':
        return {
          label: 'P2 • APPLY THIS WEEK',
          style: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        };
      case 'P3':
        return {
          label: 'P3 • OPTIONAL',
          style: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        };
      default:
        return {
          label: 'IGNORE',
          style: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        };
    }
  };

  const getInterviewProbBadge = (prob: string) => {
    switch (prob) {
      case 'HIGH':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const priorityMeta = getPriorityBadge(priority);

  return (
    <div className="group relative rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700 hover:bg-slate-900 shadow-sm">
      {/* Top Bar: Verification, Priority, Probability & Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${priorityMeta.style}`}>
            {priorityMeta.label}
          </span>

          {/* Verification Badge */}
          <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] text-slate-300">
            {job.verificationStatus === 'VERIFIED' ? (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>
              {job.verificationStatus} ({job.verificationConfidence}%)
            </span>
          </div>

          {/* Risk Level Warning (Never hidden if Medium or High) */}
          {job.riskLevel !== 'LOW' && (
            <div className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{job.riskLevel} RISK WARNING</span>
            </div>
          )}
        </div>

        {/* Right: Interview Probability & Match Score */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${getInterviewProbBadge(interviewProb)}`}>
              {interviewProb} Interview Probability
            </span>
          </div>

          {/* Match Score Gauge */}
          <button
            onClick={() => setShowMatchBreakdown(!showMatchBreakdown)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            <span>{overallScore}% Match</span>
            {showMatchBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Match Breakdown Popover */}
      {showMatchBreakdown && match && (
        <div className="my-3 rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs animate-in fade-in duration-150">
          <div className="font-semibold text-slate-200 mb-2 flex items-center justify-between">
            <span>Candidate Fit Breakdown (Target: Himanshu Bisht)</span>
            <span className="text-[11px] text-slate-400">Weighted Model Calculation</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="rounded bg-slate-900 p-2 border border-slate-800/80">
              <div className="text-slate-400">Technical (30%)</div>
              <div className="font-bold text-slate-200">{match.technicalScore}/100</div>
            </div>
            <div className="rounded bg-slate-900 p-2 border border-slate-800/80">
              <div className="text-slate-400">Experience (20%)</div>
              <div className="font-bold text-slate-200">{match.experienceScore}/100</div>
            </div>
            <div className="rounded bg-slate-900 p-2 border border-slate-800/80">
              <div className="text-slate-400">Role Alignment (15%)</div>
              <div className="font-bold text-slate-200">{match.roleScore}/100</div>
            </div>
            <div className="rounded bg-slate-900 p-2 border border-slate-800/80">
              <div className="text-slate-400">Education (10%)</div>
              <div className="font-bold text-slate-200">{match.educationScore}/100</div>
            </div>
          </div>
          {match.interviewProbabilityReason && (
            <div className="mt-2.5 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="font-semibold text-indigo-400">Interview Rationale: </span>
              {match.interviewProbabilityReason}
            </div>
          )}
        </div>
      )}

      {/* Core Details */}
      <div className="mt-3.5 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h3
              onClick={() => onView(job)}
              className="text-base font-semibold text-slate-100 hover:text-indigo-400 transition cursor-pointer"
            >
              {job.canonicalTitle}
            </h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="font-medium text-slate-200">{job.company}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-cyan-400" />
              {job.location} ({job.workMode})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-slate-400" />
              {job.experienceMin}-{job.experienceMax} yrs exp
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
              <Clock className="h-3 w-3 text-emerald-400" />
              {job.freshnessLabel || `Posted ${job.postingDate}`}
            </span>
            {job.salary && (
              <>
                <span>•</span>
                <span className="font-medium text-emerald-400">{job.salary}</span>
              </>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>
      </div>

      {/* Skills Comparison */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 mr-1">Matching:</span>
        {(match?.matchingSkills?.length ? match.matchingSkills : job.requirements.slice(0, 5)).map((skill) => (
          <span
            key={skill}
            className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
          >
            {skill}
          </span>
        ))}

        {match?.missingSkills && match.missingSkills.length > 0 && (
          <>
            <span className="text-[11px] font-semibold text-slate-500 ml-2 mr-1">Missing:</span>
            {match.missingSkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-300"
              >
                {skill}
              </span>
            ))}
          </>
        )}
      </div>

      {/* Sources Provenance & Platform */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Found on:</span>
          {job.sources.map((s, idx) => (
            <span key={idx} className="font-medium text-slate-300 bg-slate-800/60 px-1.5 py-0.5 rounded">
              {s.name}
            </span>
          ))}
          {job.applicationPlatform && (
            <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-indigo-300">
              ATS: {job.applicationPlatform}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(job)}
            className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition"
          >
            View JD
          </button>

          <button
            onClick={() => onTailor(job)}
            className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            <Sparkles className="h-3 w-3" />
            <span>Tailor Resume</span>
          </button>

          {onPrep && (
            <button
              onClick={() => onPrep(job)}
              className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition"
              title="Technical Interview Prep"
            >
              <Brain className="h-3 w-3" />
              <span>Prep</span>
            </button>
          )}

          <button
            onClick={() => onTrack(job)}
            disabled={isTracked}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isTracked
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default'
                : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isTracked ? <CheckCircle2 className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            <span>{isTracked ? 'Tracked' : 'Track'}</span>
          </button>

          {/* Primary Action: APPLY NOW */}
          <button
            onClick={() => onApply(job)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-cyan-500 transition"
          >
            <Send className="h-3 w-3" />
            <span>Apply Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
