import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Building2,
  Calendar,
  Sparkles,
  Download,
} from 'lucide-react';
import { ResumeVersion } from '../../types';

interface ResumeVersionsViewProps {
  resumes: ResumeVersion[];
}

export const ResumeVersionsView: React.FC<ResumeVersionsViewProps> = ({ resumes }) => {
  const [selectedId, setSelectedId] = useState<string>(resumes[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selected = resumes.find((r) => r.id === selectedId) || resumes[0];

  const handleCopy = () => {
    if (!selected) return;
    const text = `# ${selected.versionName}
Summary: ${selected.tailoredSummary}

Skills: ${selected.highlightedSkills.join(', ')}

Highlights:
${selected.reorderedBullets.map((s) => `${s.section}:\n${s.bullets.map((b) => `- ${b}`).join('\n')}`).join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Resume Studio & Versions</h1>
        <p className="text-xs text-slate-400 mt-1">
          Target-tailored, factual resume iterations generated for specific companies and role profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Versions List */}
        <div className="space-y-2">
          {resumes.map((r) => {
            const isSelected = r.id === selectedId;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-100">{r.versionName}</span>
                  {r.matchScore && (
                    <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold">
                      {r.matchScore}%
                    </span>
                  )}
                </div>

                {r.company && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Building2 className="h-3 w-3 text-cyan-400" />
                    <span>{r.company}</span>
                    {r.jobTitle && <span className="truncate">• {r.jobTitle}</span>}
                  </div>
                )}

                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created {new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed View */}
        {selected && (
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selected.versionName}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Linked to {selected.company || 'General Technical Profile'}
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Content'}</span>
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1.5">
                Executive Profile Summary
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                {selected.tailoredSummary}
              </p>
            </div>

            {/* Skills */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Emphasized Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selected.highlightedSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bullets */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                Targeted Bullet Points
              </h4>
              <div className="space-y-3">
                {selected.reorderedBullets.map((group, idx) => (
                  <div key={idx}>
                    <div className="text-xs font-semibold text-slate-300 mb-1">{group.section}</div>
                    <ul className="space-y-1 list-disc list-inside text-xs text-slate-400">
                      {group.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
