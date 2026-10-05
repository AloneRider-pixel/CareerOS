import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { CandidateProfile, Job, ResumeVersion } from '../../types';

interface ApplicationRouterModalProps {
  job: Job | null;
  resumes: ResumeVersion[];
  candidate: CandidateProfile | null;
  onClose: () => void;
  onMarkApplied: (job: Job, resumeVersionId?: string, notes?: string) => Promise<void>;
}

export const ApplicationRouterModal: React.FC<ApplicationRouterModalProps> = ({
  job,
  resumes,
  candidate,
  onClose,
  onMarkApplied,
}) => {
  if (!job) return null;

  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    resumes.find((r) => r.jobId === job.jobId)?.id || resumes[0]?.id || ''
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasOpenedUrl, setHasOpenedUrl] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenApplication = () => {
    setHasOpenedUrl(true);
    window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitApplied = async () => {
    try {
      setIsSubmitting(true);
      await onMarkApplied(job, selectedResumeId, notes);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error tracking application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                Application Router
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Complexity: {job.applicationComplexity}
              </span>
              {job.applicationPlatform && (
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300 border border-slate-700">
                  Platform: {job.applicationPlatform}
                </span>
              )}
            </div>
            <h2 className="mt-2 text-lg font-bold text-white">
              Apply to {job.company} — {job.canonicalTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified destination: <span className="text-cyan-400 font-mono text-[11px] truncate">{job.applicationUrl}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Resume Selection */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            1. Select Resume Version for Submission
          </label>
          <div className="space-y-2">
            {resumes.map((r) => (
              <label
                key={r.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition text-xs ${
                  selectedResumeId === r.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="resumeSelection"
                  value={r.id}
                  checked={selectedResumeId === r.id}
                  onChange={() => setSelectedResumeId(r.id)}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{r.versionName}</span>
                    {r.matchScore && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 font-medium border border-emerald-500/20">
                        {r.matchScore}% Score
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {r.tailoredSummary}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Fast Copy Snippets */}
        {candidate && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-slate-400 mb-2">
              2. Assisted Form Autocomplete Snippets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center justify-between rounded bg-slate-900 px-3 py-2 border border-slate-800">
                <div className="truncate pr-2">
                  <div className="text-[10px] text-slate-500">Full Name</div>
                  <div className="text-slate-200 truncate">{candidate.name}</div>
                </div>
                <button
                  onClick={() => handleCopy(candidate.name, 'Name')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copiedField === 'Name' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded bg-slate-900 px-3 py-2 border border-slate-800">
                <div className="truncate pr-2">
                  <div className="text-[10px] text-slate-500">Email</div>
                  <div className="text-slate-200 truncate">{candidate.email}</div>
                </div>
                <button
                  onClick={() => handleCopy(candidate.email, 'Email')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copiedField === 'Email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded bg-slate-900 px-3 py-2 border border-slate-800">
                <div className="truncate pr-2">
                  <div className="text-[10px] text-slate-500">GitHub Profile</div>
                  <div className="text-slate-200 truncate">{candidate.links?.github || 'https://github.com/himanshu-bisht'}</div>
                </div>
                <button
                  onClick={() => handleCopy(candidate.links?.github || 'https://github.com/himanshu-bisht', 'GitHub')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copiedField === 'GitHub' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded bg-slate-900 px-3 py-2 border border-slate-800">
                <div className="truncate pr-2">
                  <div className="text-[10px] text-slate-500">LinkedIn Profile</div>
                  <div className="text-slate-200 truncate">{candidate.links?.linkedin || 'https://linkedin.com/in/himanshu-bisht-dev'}</div>
                </div>
                <button
                  onClick={() => handleCopy(candidate.links?.linkedin || 'https://linkedin.com/in/himanshu-bisht-dev', 'LinkedIn')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copiedField === 'LinkedIn' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {selectedResume && (
              <div className="mt-2.5 rounded bg-slate-900 p-2.5 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">Tailored Summary / Cover Note</span>
                  <button
                    onClick={() => handleCopy(selectedResume.tailoredSummary, 'Summary')}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedField === 'Summary' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedField === 'Summary' ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                  {selectedResume.tailoredSummary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. Launch Link & Guided Checklist */}
        <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                3. Open Official Verified Application
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Launches the direct {job.applicationPlatform || 'employer'} application page.
              </p>
            </div>

            <button
              onClick={handleOpenApplication}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition"
            >
              <span>Open Application</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {hasOpenedUrl && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Application page opened in new tab. Complete the form and mark below when submitted.</span>
            </div>
          )}
        </div>

        {/* Notes & Mark as Applied */}
        <div className="mt-4 space-y-2">
          <label className="block text-xs text-slate-400 font-medium">
            Application Notes (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Submitted via Greenhouse; attached Resume v2; referral from alumni..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitApplied}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Recording...' : 'Mark as Applied'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
