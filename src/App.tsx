import React, { useState, useEffect } from 'react';
import {
  fetchProfile,
  fetchJobs,
  fetchApplications,
  fetchResumes,
  fetchSearchRuns,
  fetchSkillGaps,
  fetchCompanies,
  fetchDashboardStats,
  executeSearch,
  verifyJob,
  createApplication,
  updateApplication,
} from './api';
import {
  Application,
  CandidateProfile,
  CompanyIntelligence,
  DashboardStats,
  Job,
  ResumeVersion,
  SearchFilters,
  SearchRun,
  SkillGap,
} from './types';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { JobsListView } from './components/jobs/JobsListView';
import { JobDetailModal } from './components/jobs/JobDetailModal';
import { ApplicationRouterModal } from './components/router/ApplicationRouterModal';
import { ResumeTailorModal } from './components/resumes/ResumeTailorModal';
import { InterviewPrepModal } from './components/interview/InterviewPrepModal';
import { ResumeVersionsView } from './components/resumes/ResumeVersionsView';
import { ApplicationTrackerView } from './components/tracker/ApplicationTrackerView';
import { SearchControlView } from './components/search/SearchControlView';
import { SkillGapsView } from './components/skills/SkillGapsView';
import { CompanyIntelligenceView } from './components/companies/CompanyIntelligenceView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // State
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [searchRuns, setSearchRuns] = useState<SearchRun[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [companies, setCompanies] = useState<CompanyIntelligence[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Modals
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [selectedJobForTailor, setSelectedJobForTailor] = useState<Job | null>(null);
  const [selectedJobForPrep, setSelectedJobForPrep] = useState<Job | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial load
  const loadAllData = async () => {
    try {
      setInitialLoading(true);
      const [
        profileData,
        jobsData,
        appsData,
        resumesData,
        runsData,
        gapsData,
        compsData,
        statsData,
      ] = await Promise.all([
        fetchProfile(),
        fetchJobs(),
        fetchApplications(),
        fetchResumes(),
        fetchSearchRuns(),
        fetchSkillGaps(),
        fetchCompanies(),
        fetchDashboardStats(),
      ]);

      setProfile(profileData);
      setJobs(jobsData.jobs);
      setApplications(appsData);
      setResumes(resumesData);
      setSearchRuns(runsData);
      setSkillGaps(gapsData);
      setCompanies(compsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('[CareerOS] Load error:', err);
      showToast(err.message || 'Failed to initialize CareerOS', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Theme toggle
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Trigger Grounded Search
  const handleTriggerSearch = async (filters?: Partial<SearchFilters>) => {
    try {
      setSearchLoading(true);
      showToast('Executing Google Search Grounding for live jobs across India...', 'info');
      const res = await executeSearch(filters);
      setJobs(res.jobs);
      setSearchRuns([res.run, ...searchRuns]);
      const updatedStats = await fetchDashboardStats();
      setStats(updatedStats);
      showToast(`Discovery completed: ${res.newDiscovered} new jobs indexed, verified active.`);
    } catch (err: any) {
      showToast(err.message || 'Search execution failed.', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  // Re-verify Job
  const handleVerifyJob = async (job: Job) => {
    try {
      setVerifyLoading(true);
      const updated = await verifyJob(job.jobId);
      setJobs((prev) => prev.map((j) => (j.jobId === updated.jobId ? updated : j)));
      if (selectedJobForDetail?.jobId === updated.jobId) {
        setSelectedJobForDetail(updated);
      }
      showToast(`Verified active: ${updated.company} (${updated.verificationConfidence}% confidence)`);
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Add Job to Application Tracker
  const handleTrackJob = async (job: Job) => {
    try {
      const app = await createApplication({
        jobId: job.jobId,
        status: 'READY_TO_APPLY',
        applicationUrl: job.applicationUrl,
        source: job.sources[0]?.name || 'Direct Employer Portal',
        notes: 'Saved from discovered queue to application pipeline.',
      });
      setApplications([app, ...applications]);
      const updatedStats = await fetchDashboardStats();
      setStats(updatedStats);
      showToast(`Added to application pipeline: ${job.company}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to track application', 'error');
    }
  };

  // Mark Job as Applied from Router
  const handleMarkApplied = async (job: Job, resumeVersionId?: string, notes?: string) => {
    const resume = resumes.find((r) => r.id === resumeVersionId);
    const existing = applications.find((a) => a.jobId === job.jobId);

    if (existing) {
      const updated = await updateApplication(existing.id, {
        status: 'APPLIED',
        dateApplied: new Date().toISOString(),
        resumeVersionId,
        resumeVersionName: resume?.versionName,
        notes: notes || existing.notes,
      });
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const newApp = await createApplication({
        jobId: job.jobId,
        status: 'APPLIED',
        resumeVersionId,
        resumeVersionName: resume?.versionName,
        applicationUrl: job.applicationUrl,
        notes: notes || 'Submitted via verified application router.',
      });
      setApplications([newApp, ...applications]);
    }

    const updatedStats = await fetchDashboardStats();
    setStats(updatedStats);
    showToast(`Application recorded for ${job.company}! Pipeline updated.`);
  };

  // Update Existing Application
  const handleUpdateApplication = async (appId: string, updates: Partial<Application>) => {
    try {
      const updated = await updateApplication(appId, updates);
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      const updatedStats = await fetchDashboardStats();
      setStats(updatedStats);
      showToast(`Status updated: ${updated.company} → ${updated.status}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update application', 'error');
    }
  };

  const trackedJobIds = new Set(applications.map((a) => a.jobId));
  const p0Jobs = jobs.filter((j) => j.match?.priority === 'P0' || j.match?.priority === 'P1');
  const recentJobs = jobs.slice(0, 5);

  if (initialLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <div className="font-semibold text-sm tracking-wide">Initializing CareerOS...</div>
          <p className="text-xs text-slate-500">Loading verified candidate profile & active listings</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs text-white shadow-2xl animate-in slide-in-from-bottom-2">
          {toast.type === 'error' ? (
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        profile={profile}
        onOpenSearch={() => handleTriggerSearch()}
        onQuickSearch={(query) => {
          if (query.trim() && currentTab !== 'jobs') {
            setCurrentTab('jobs');
          }
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        searchLoading={searchLoading}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          p0Count={p0Jobs.length}
          activeAppsCount={applications.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {currentTab === 'dashboard' && stats && (
              <DashboardView
                stats={stats}
                p0Jobs={p0Jobs}
                recentJobs={recentJobs}
                onApply={(job) => setSelectedJobForApply(job)}
                onTailor={(job) => setSelectedJobForTailor(job)}
                onTrack={handleTrackJob}
                onView={(job) => setSelectedJobForDetail(job)}
                onPrep={(job) => setSelectedJobForPrep(job)}
                onNavigateToJobs={() => setCurrentTab('jobs')}
                onNavigateToTracker={() => setCurrentTab('applications')}
              />
            )}

            {currentTab === 'jobs' && (
              <JobsListView
                jobs={jobs}
                onApply={(job) => setSelectedJobForApply(job)}
                onTailor={(job) => setSelectedJobForTailor(job)}
                onTrack={handleTrackJob}
                onView={(job) => setSelectedJobForDetail(job)}
                onVerify={handleVerifyJob}
                onPrep={(job) => setSelectedJobForPrep(job)}
                onTriggerSearch={() => handleTriggerSearch()}
                isSearching={searchLoading}
                trackedJobIds={trackedJobIds}
              />
            )}

            {currentTab === 'applications' && (
              <ApplicationTrackerView
                applications={applications}
                jobs={jobs}
                onUpdateApplication={handleUpdateApplication}
                onPrep={(jobId) => {
                  const job = jobs.find((j) => j.jobId === jobId);
                  if (job) setSelectedJobForPrep(job);
                }}
              />
            )}

            {currentTab === 'resumes' && (
              <ResumeVersionsView resumes={resumes} />
            )}

            {currentTab === 'search' && (
              <SearchControlView
                candidate={profile}
                searchRuns={searchRuns}
                onTriggerSearch={handleTriggerSearch}
                isLoading={searchLoading}
              />
            )}

            {currentTab === 'skills' && (
              <SkillGapsView skillGaps={skillGaps} />
            )}

            {currentTab === 'companies' && (
              <CompanyIntelligenceView
                companies={companies}
                onSelectCompany={(companyName) => {
                  setCurrentTab('jobs');
                }}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                candidate={profile}
                onProfileUpdated={(updated) => {
                  setProfile(updated);
                  showToast('Candidate master profile updated.');
                }}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                theme={theme}
                onToggleTheme={handleToggleTheme}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
          onApply={(job) => {
            setSelectedJobForDetail(null);
            setSelectedJobForApply(job);
          }}
          onTailor={(job) => {
            setSelectedJobForDetail(null);
            setSelectedJobForTailor(job);
          }}
          onVerify={handleVerifyJob}
          onPrep={(job) => {
            setSelectedJobForDetail(null);
            setSelectedJobForPrep(job);
          }}
          isVerifying={verifyLoading}
        />
      )}

      {selectedJobForApply && (
        <ApplicationRouterModal
          job={selectedJobForApply}
          resumes={resumes}
          candidate={profile}
          onClose={() => setSelectedJobForApply(null)}
          onMarkApplied={handleMarkApplied}
        />
      )}

      {selectedJobForTailor && (
        <ResumeTailorModal
          job={selectedJobForTailor}
          candidate={profile}
          onClose={() => setSelectedJobForTailor(null)}
          onSavedTailoredResume={(newVersion) => {
            setResumes([newVersion, ...resumes]);
            showToast(`Generated & saved ${newVersion.versionName}!`);
          }}
        />
      )}

      {selectedJobForPrep && (
        <InterviewPrepModal
          job={selectedJobForPrep}
          resumes={resumes}
          onClose={() => setSelectedJobForPrep(null)}
        />
      )}
    </div>
  );
}
