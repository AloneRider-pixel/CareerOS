import React, { useState } from 'react';
import {
  User,
  Upload,
  FileText,
  Sparkles,
  Save,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Plus,
  Trash2,
} from 'lucide-react';
import { CandidateProfile } from '../../types';
import { updateProfile, uploadResumeText } from '../../api';

interface ProfileViewProps {
  candidate: CandidateProfile | null;
  onProfileUpdated: (updated: CandidateProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  candidate,
  onProfileUpdated,
}) => {
  if (!candidate) return null;

  const [form, setForm] = useState<CandidateProfile>(candidate);
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await updateProfile(form);
      onProfileUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsParsing(true);
      setUploadNotice(`Parsing ${file.name} with Gemini AI...`);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = (event.target?.result as string) || '';
        try {
          const res = await uploadResumeText(text, file.name);
          setForm(res.profile);
          onProfileUpdated(res.profile);
          setUploadNotice(`Successfully parsed ${file.name} into profile!`);
        } catch (err: any) {
          setUploadNotice(`Error: ${err.message || 'Failed to parse file'}`);
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsText(file);
    } catch (err: any) {
      setIsParsing(false);
      setUploadNotice(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Candidate Profile & Master Resume</h1>
          <p className="text-xs text-slate-400 mt-1">
            The factual source of truth for all matching, ranking, and tailoring workflows.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile Saved</span>
          </div>
        )}
      </div>

      {/* Resume File Upload Dropzone */}
      <div className="rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-950/20 p-6 text-center text-xs">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2">
          <Upload className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-200">Upload Resume (PDF, DOCX, TXT)</h3>
        <p className="mt-1 text-slate-400 max-w-md mx-auto text-[11px]">
          Ingest raw resume files to automatically extract and verify your education, technical skills, projects, and work history.
        </p>

        <label className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition cursor-pointer">
          <FileText className="h-3.5 w-3.5" />
          <span>{isParsing ? 'Parsing Resume...' : 'Choose File to Ingest'}</span>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            disabled={isParsing}
            className="hidden"
          />
        </label>

        {uploadNotice && (
          <div className="mt-2 text-[11px] font-medium text-cyan-400">
            {uploadNotice}
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm border-b border-slate-800 pb-2">
            Personal & Career Stage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Phone</label>
              <input
                type="text"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Mobility & Relocation</label>
              <input
                type="text"
                value={form.relocationPreference}
                onChange={(e) => setForm({ ...form, relocationPreference: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Professional Summary</label>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Education */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm border-b border-slate-800 pb-2">
            Education (Factual Source of Truth)
          </h3>
          {form.education.map((edu, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 text-[11px]">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const next = [...form.education];
                    next[idx].degree = e.target.value;
                    setForm({ ...form, education: next });
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const next = [...form.education];
                    next[idx].institution = e.target.value;
                    setForm({ ...form, education: next });
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">Graduation Year</label>
                <input
                  type="number"
                  value={edu.graduationYear}
                  onChange={(e) => {
                    const next = [...form.education];
                    next[idx].graduationYear = Number(e.target.value);
                    setForm({ ...form, education: next });
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Technical Competencies */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm border-b border-slate-800 pb-2">
            Technical Competencies & Skills
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Primary Skills (Comma-separated)</label>
              <input
                type="text"
                value={form.primarySkills.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    primarySkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">AI & GenAI (LLM, RAG, LangGraph)</label>
              <input
                type="text"
                value={form.aiSkills.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    aiSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Data Engineering (Airflow, dbt, Snowflake, ETL)</label>
              <input
                type="text"
                value={form.dataSkills.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dataSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Cloud & Infrastructure (AWS, Docker, CI/CD)</label>
              <input
                type="text"
                value={form.cloudSkills.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cloudSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-cyan-500 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Master Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
