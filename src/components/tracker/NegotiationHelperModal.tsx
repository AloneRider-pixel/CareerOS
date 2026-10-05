import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Briefcase,
  Building2,
  MapPin,
  Send,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Award,
  Layers,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Application, Job, SalaryBenchmark, NegotiationScenario, NegotiationEmailDraft } from '../../types';
import { fetchSalaryBenchmark, formatSalaryLPA } from '../../utils/salaryBenchmark';
import { draftNegotiationEmail } from '../../api';

interface NegotiationHelperModalProps {
  application: Application | null;
  job?: Job | null;
  onClose: () => void;
}

export const NegotiationHelperModal: React.FC<NegotiationHelperModalProps> = ({
  application,
  job,
  onClose,
}) => {
  if (!application) return null;

  const company = application.company;
  const role = application.canonicalTitle;
  const location = job?.location || 'Bengaluru / India';

  // State
  const [scenario, setScenario] = useState<NegotiationScenario>('COUNTER_OFFER');
  const [currentOffer, setCurrentOffer] = useState<string>('');
  const [targetSalary, setTargetSalary] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [benchmark, setBenchmark] = useState<SalaryBenchmark | null>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(true);

  // Draft state
  const [draft, setDraft] = useState<NegotiationEmailDraft | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);

  // Load benchmark
  useEffect(() => {
    let mounted = true;
    const loadBench = async () => {
      try {
        setBenchmarkLoading(true);
        const data = await fetchSalaryBenchmark(role, location, job?.salary);
        if (mounted) {
          setBenchmark(data);
          // Auto-suggest target salary as P75 or P90
          const p75Str = `₹${(data.p75Salary / 100000).toFixed(1)} LPA`;
          setTargetSalary(p75Str);
          if (job?.salary) {
            setCurrentOffer(job.salary);
          } else {
            setCurrentOffer(`₹${(data.medianSalary / 100000).toFixed(1)} LPA`);
          }
        }
      } catch (err) {
        console.error('Failed to load salary benchmark:', err);
      } finally {
        if (mounted) setBenchmarkLoading(false);
      }
    };
    loadBench();
    return () => {
      mounted = false;
    };
  }, [role, location, job?.salary]);

  const handleGenerateDraft = async () => {
    try {
      setDraftLoading(true);
      const res = await draftNegotiationEmail({
        company,
        role,
        location,
        currentOffer,
        targetSalary,
        scenario,
        benchmark: benchmark || undefined,
        additionalNotes: additionalNotes.trim() || undefined,
      });
      setDraft(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate negotiation email draft.');
    } finally {
      setDraftLoading(false);
    }
  };

  const handleCopyBody = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.emailBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopySubject = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.subjectLine);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const scenarios: { id: NegotiationScenario; label: string; desc: string }[] = [
    {
      id: 'COUNTER_OFFER',
      label: 'Counter-Offer (Market Data)',
      desc: 'Ask for higher base compensation grounded in verified 75th percentile benchmarks.',
    },
    {
      id: 'MULTIPLE_OFFERS',
      label: 'Competing Offer Leverage',
      desc: 'Respectfully leverage another active offer to expedite and increase compensation.',
    },
    {
      id: 'PRE_OFFER_SCREEN',
      label: 'Recruiter CTC Expectations',
      desc: 'Articulate your expected compensation band professionally during recruiter rounds.',
    },
    {
      id: 'EQUITY_OR_SIGN_ON',
      label: 'Sign-on / Relocation / Review',
      desc: 'Negotiate joining bonus, relocation support, or a 6-month review if base is fixed.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-7 shadow-2xl text-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Gemini Negotiation Strategist</span>
              </span>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                {application.status} Stage
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-white flex items-center gap-2">
              <span>Salary Negotiation Helper</span>
              <span className="text-xs font-normal text-slate-400">
                • {company} ({role})
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft professional, high-converting compensation correspondence backed by localized market percentiles.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Market Benchmark Summary Bar */}
        {benchmark && (
          <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">Local Market Benchmark:</span>
                <span className="text-slate-300">{location} • 0-2 YoE</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-400">
                Market Band: {benchmark.formattedRange}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <div className="text-[10px] text-slate-500">P25 (Entry)</div>
                <div className="font-bold text-slate-300">{formatSalaryLPA(benchmark.p25Salary)}</div>
              </div>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <div className="text-[10px] text-slate-500">Median (P50)</div>
                <div className="font-bold text-cyan-300">{formatSalaryLPA(benchmark.medianSalary)}</div>
              </div>
              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                <div className="text-[10px] text-slate-500">P75 (Top Quartile)</div>
                <div className="font-bold text-emerald-400">{formatSalaryLPA(benchmark.p75Salary)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Select Scenario */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            1. Select Negotiation Strategy & Scenario:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setScenario(sc.id)}
                className={`text-left p-3 rounded-xl border transition text-xs space-y-1 ${
                  scenario === sc.id
                    ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{sc.label}</span>
                  {scenario === sc.id && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{sc.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Compensation Levers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Current Offer / Initial Figure:
            </label>
            <input
              type="text"
              value={currentOffer}
              onChange={(e) => setCurrentOffer(e.target.value)}
              placeholder="e.g. ₹12.5 LPA or Under discussion"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Target CTC Request:
            </label>
            <input
              type="text"
              value={targetSalary}
              onChange={(e) => setTargetSalary(e.target.value)}
              placeholder="e.g. ₹16.5 LPA"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Optional Extra Context */}
        <div className="text-xs">
          <label className="font-semibold text-slate-300 block mb-1">
            Additional Context / Levers (Optional):
          </label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Have a competing offer deadline in 3 days; Willing to relocate to Bengaluru immediately"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={handleGenerateDraft}
            disabled={draftLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-emerald-500 hover:to-indigo-500 transition disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${draftLoading ? 'animate-spin' : ''}`} />
            <span>{draftLoading ? 'Drafting with Gemini 3.8 Flash...' : 'Generate Negotiation Email Template'}</span>
          </button>
        </div>

        {/* Generated Output */}
        {draft && (
          <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Generated Negotiation Draft</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySubject}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                >
                  {copiedSubject ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSubject ? 'Subject Copied' : 'Copy Subject'}</span>
                </button>
                <button
                  onClick={handleCopyBody}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  {copiedBody ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedBody ? 'Copied Full Email!' : 'Copy Email Body'}</span>
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Subject Line:</span>
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white font-medium">
                {draft.subjectLine}
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Email Template:</span>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {draft.emailBody}
              </div>
            </div>

            {/* Talking Points & Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Key Phone Talking Points</span>
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  {draft.talkingPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-3 space-y-1.5">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Strategic Advice</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {draft.strategicAdvice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
