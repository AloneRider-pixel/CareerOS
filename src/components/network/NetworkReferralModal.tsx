import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Users,
  Send,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Building2,
  Share2,
} from 'lucide-react';
import { NetworkContact, ReferralMessageResult } from '../../types';
import { generateReferralMessage } from '../../api';

interface NetworkReferralModalProps {
  contact: NetworkContact | null;
  onClose: () => void;
}

export const NetworkReferralModal: React.FC<NetworkReferralModalProps> = ({
  contact,
  onClose,
}) => {
  if (!contact) return null;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReferralMessageResult | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      const res = await generateReferralMessage(contact.id, contact.suggestedRoleForReferral);
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate referral outreach message.');
    } finally {
      setLoading(false);
    }
  };

  const currentMessage = result?.messageBody || contact.sampleMessage;
  const currentSubject =
    result?.subjectLine ||
    `${contact.connectionDegree === 'Alumni' ? 'GEHU Alum / ' : ''}Connecting regarding ${contact.suggestedRoleForReferral} at ${contact.company}`;
  const currentTip =
    result?.followUpTip ||
    'Send on weekday mornings (Tuesday to Thursday, 9:30 AM - 11:00 AM IST) for highest response rates.';

  const handleCopyBody = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopySubject = () => {
    navigator.clipboard.writeText(currentSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-7 shadow-2xl text-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> LinkedIn Referral Helper
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {contact.connectionDegree} Connection
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-white flex items-center gap-2">
              <span>{contact.name}</span>
              <span className="text-xs font-normal text-slate-400">
                • {contact.title} at {contact.company}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Relationship: <span className="text-slate-300 font-medium">{contact.connectionContext}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Target Role & Connection Context */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <span className="text-slate-400">Target Role:</span>
              <span className="font-semibold text-white">{contact.suggestedRoleForReferral}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Mutual Connections:</span>
              <span className="font-bold text-indigo-400">{contact.mutualConnectionsCount}</span>
            </div>
          </div>
        </div>

        {/* Outreach Note Generator */}
        <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-5 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>Personalized LinkedIn Referral Request</span>
            </span>

            <button
              onClick={handleGenerateAI}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition disabled:opacity-50"
            >
              <Sparkles className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Generating with Gemini...' : 'Regenerate Note (AI)'}</span>
            </button>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Subject Line (for InMail / Connection request headline):</span>
              <button
                onClick={handleCopySubject}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
              >
                {copiedSubject ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSubject ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-200 font-medium">
              {currentSubject}
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Message Body:</span>
              <button
                onClick={handleCopyBody}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                {copiedBody ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedBody ? 'Copied to Clipboard!' : 'Copy Message'}</span>
              </button>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {currentMessage}
            </div>
          </div>

          {/* Strategic Follow-Up Tip */}
          <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-3 text-xs text-slate-300 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-300">Outreach Tip: </span>
              {currentTip}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-500 transition"
          >
            <span>Open {contact.name.split(' ')[0]}&apos;s LinkedIn</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-850 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
