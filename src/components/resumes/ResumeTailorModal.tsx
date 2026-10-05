import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { CandidateProfile, Job, ResumeVersion } from '../../types';
import { tailorResume } from '../../api';

interface ResumeTailorModalProps {
  job: Job | null;
  candidate: CandidateProfile | null;
  onClose: () => void;
  onSavedTailoredResume: (newVersion: ResumeVersion) => void;
}

export const ResumeTailorModal: React.FC<ResumeTailorModalProps> = ({
  job,
  candidate,
  onClose,
  onSavedTailoredResume,
}) => {
  if (!job) return null;

  const [loading, setLoading] = useState(false);
  const [tailoredData, setTailoredData] = useState<ResumeVersion | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const version = await tailorResume(job.jobId);
      setTailoredData(version);
      onSavedTailoredResume(version);
    } catch (err: any) {
      alert(err.message || 'Failed to tailor resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!tailoredData) return;
    const text = `# ${tailoredData.versionName}
Candidate: ${candidate?.name || 'Himanshu Bisht'}
Target Role: ${job.canonicalTitle} (${job.company})
Match Score: ${tailoredData.matchScore}%

## PROFESSIONAL SUMMARY
${tailoredData.tailoredSummary}

## TARGETED SKILLS
${tailoredData.highlightedSkills.join(' • ')}

## TARGETED IMPACT & ACHIEVEMENTS
${tailoredData.reorderedBullets
  .map(
    (sec) => `### ${sec.section}\n${sec.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## ATS KEYWORDS EMPHASIZED
${tailoredData.missingKeywordsTargeted.join(', ')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                AI Resume Tailoring Engine
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Target: {job.company}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-white">
              Tailor Resume for {job.canonicalTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict factual optimization: Re-weights and aligns your genuine projects & skills without fabricating claims.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Generate Trigger */}
        {!tailoredData && (
          <div className="mt-6 text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-400 mb-3 border border-indigo-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">
              Generate ATS-Optimized Version
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Gemini will analyze {job.company}&apos;s job requirements, select the most relevant achievements from your background, and reorder skill priorities.
            </p>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-cyan-500 transition disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing JD & Tailoring...' : 'Generate Tailored Resume'}</span>
            </button>
          </div>
        )}

        {/* Tailored Result */}
        {tailoredData && (
          <div className="mt-5 space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-xl bg-indigo-950/30 border border-indigo-500/30 p-3">
              <div>
                <span className="font-semibold text-white text-sm">{tailoredData.versionName}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Saved to your Resume Studio versions library.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold border border-emerald-500/30">
                  {tailoredData.matchScore}% Fit
                </span>
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-slate-700"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="font-semibold text-xs text-indigo-400 uppercase tracking-wider mb-1.5">
                Tailored Professional Summary
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {tailoredData.tailoredSummary}
              </p>
            </div>

            {/* Prioritized Skills */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="font-semibold text-xs text-cyan-400 uppercase tracking-wider mb-2">
                Recommended Skills Priority
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tailoredData.highlightedSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-slate-200 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Targeted Achievement Bullets */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="font-semibold text-xs text-emerald-400 uppercase tracking-wider mb-2">
                Highlighted Projects & Impact Bullets
              </h4>
              <div className="space-y-3">
                {tailoredData.reorderedBullets.map((section, idx) => (
                  <div key={idx}>
                    <div className="font-semibold text-slate-300 text-xs mb-1">{section.section}</div>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                      {section.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Keywords Targeted */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="font-semibold text-xs text-amber-400 uppercase tracking-wider mb-1.5">
                ATS Keywords Emphasized
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tailoredData.missingKeywordsTargeted.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 text-[11px]"
                  >
                    +{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 transition"
          >
            Close
          </button>

          {tailoredData && (
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full Tailored Resume'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
