import React from 'react';
import { TrendingUp, BookOpen, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SkillGap } from '../../types';

interface SkillGapsViewProps {
  skillGaps: SkillGap[];
}

export const SkillGapsView: React.FC<SkillGapsViewProps> = ({ skillGaps }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH PRIORITY':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'MEDIUM PRIORITY':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Skill Gap Engine & Upskilling Roadmap</h1>
        <p className="text-xs text-slate-400 mt-1">
          Aggregated recurring technologies requested across active job descriptions but absent from your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGaps.map((gap) => (
          <div
            key={gap.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3.5 shadow-sm text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getPriorityStyle(gap.recommendedPriority)}`}>
                  {gap.recommendedPriority}
                </span>
                <h3 className="mt-2 text-base font-bold text-white">{gap.skill}</h3>
              </div>

              <div className="text-right">
                <div className="text-lg font-extrabold text-cyan-400">{gap.frequency}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Jobs Affected</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Associated Roles:</span>
              {gap.roleFamilies.map((role, i) => (
                <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                  {role}
                </span>
              ))}
            </div>

            {gap.studyGuide && (
              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-slate-300 text-[11px] leading-relaxed">
                <div className="font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> High-Impact Action Guide
                </div>
                {gap.studyGuide}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
