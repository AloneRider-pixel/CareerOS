import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Sparkles, Save, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [minScore, setMinScore] = useState(65);
  const [autoVerify, setAutoVerify] = useState(true);
  const [antiScam, setAntiScam] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl text-xs">
      <div>
        <h1 className="text-xl font-bold text-white">System Settings & Matching Rules</h1>
        <p className="text-slate-400 mt-1 text-xs">
          Configure algorithmic thresholds, anti-scam quality protections, and grounding verification policies.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <h3 className="font-semibold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Verification & Quality Discipline</span>
        </h3>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoVerify}
              onChange={(e) => setAutoVerify(e.target.checked)}
              className="mt-0.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-medium text-slate-200">Continuous Google Search Grounding Verification</div>
              <div className="text-[11px] text-slate-400">
                Automatically verify that job URLs and employer requisitions remain active before routing applications.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={antiScam}
              onChange={(e) => setAntiScam(e.target.checked)}
              className="mt-0.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-medium text-slate-200">Strict Job Fraud & Quality Detection</div>
              <div className="text-[11px] text-slate-400">
                Flag suspicious recruiters, payment demands, Telegram/WhatsApp-only interview scams, and fake domains. Never hide high-risk warnings.
              </div>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between mb-1.5">
            <span className="font-medium text-slate-200">Minimum Match Score Threshold for P0/P1 Alerts</span>
            <span className="font-bold text-indigo-400">{minScore}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={90}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Jobs scoring below this threshold will not be classified as immediate priority.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-200">Display Theme</div>
            <div className="text-[11px] text-slate-400">Current mode: {theme}</div>
          </div>
          <button
            onClick={onToggleTheme}
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Preferences saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
