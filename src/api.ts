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
  InterviewPrepPack,
  InterviewQuestion,
  InterviewAnswerFeedback,
  DashboardAIInsights,
  NetworkContact,
  ReferralMessageResult,
  SalaryBenchmark,
  NegotiationScenario,
  NegotiationEmailDraft,
} from './types';

const API_BASE = '/api';

export async function fetchProfile(): Promise<CandidateProfile> {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error('Failed to fetch candidate profile');
  return res.json();
}

export async function updateProfile(updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update candidate profile');
  return res.json();
}

export async function uploadResumeText(rawText: string, fileName?: string): Promise<{ success: boolean; profile: CandidateProfile }> {
  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText, fileName }),
  });
  if (!res.ok) throw new Error('Failed to parse uploaded resume');
  return res.json();
}

export async function fetchJobs(params?: {
  q?: string;
  priority?: string;
  workMode?: string;
  location?: string;
  minMatch?: number;
  verifiedOnly?: boolean;
}): Promise<{ jobs: Job[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set('q', params.q);
  if (params?.priority) searchParams.set('priority', params.priority);
  if (params?.workMode) searchParams.set('workMode', params.workMode);
  if (params?.location) searchParams.set('location', params.location);
  if (params?.minMatch) searchParams.set('minMatch', params.minMatch.toString());
  if (params?.verifiedOnly) searchParams.set('verifiedOnly', 'true');

  const res = await fetch(`${API_BASE}/jobs?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function fetchJobById(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch job details');
  return res.json();
}

export async function executeSearch(filters?: Partial<SearchFilters>): Promise<{
  run: SearchRun;
  newDiscovered: number;
  totalJobs: number;
  jobs: Job[];
}> {
  const res = await fetch(`${API_BASE}/jobs/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters || {}),
  });
  if (!res.ok) throw new Error('Failed to execute grounded job search');
  return res.json();
}

export async function verifyJob(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/verify`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to verify job');
  return res.json();
}

export async function tailorResume(jobId: string): Promise<ResumeVersion> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/tailor`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to tailor resume for job');
  return res.json();
}

export async function fetchResumes(): Promise<ResumeVersion[]> {
  const res = await fetch(`${API_BASE}/resumes`);
  if (!res.ok) throw new Error('Failed to fetch resume versions');
  return res.json();
}

export async function fetchApplications(): Promise<Application[]> {
  const res = await fetch(`${API_BASE}/applications`);
  if (!res.ok) throw new Error('Failed to fetch tracked applications');
  return res.json();
}

export async function createApplication(payload: {
  jobId: string;
  status?: string;
  resumeVersionId?: string;
  resumeVersionName?: string;
  notes?: string;
  applicationUrl?: string;
  source?: string;
}): Promise<Application> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to track application');
  }
  return data;
}

export async function updateApplication(
  appId: string,
  updates: Partial<Application>
): Promise<Application> {
  const res = await fetch(`${API_BASE}/applications/${appId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update application');
  return res.json();
}

export async function fetchSearchRuns(): Promise<SearchRun[]> {
  const res = await fetch(`${API_BASE}/search-runs`);
  if (!res.ok) throw new Error('Failed to fetch search runs');
  return res.json();
}

export async function fetchSkillGaps(): Promise<SkillGap[]> {
  const res = await fetch(`${API_BASE}/skills/gaps`);
  if (!res.ok) throw new Error('Failed to fetch skill gaps');
  return res.json();
}

export async function fetchCompanies(): Promise<CompanyIntelligence[]> {
  const res = await fetch(`${API_BASE}/companies`);
  if (!res.ok) throw new Error('Failed to fetch company intelligence');
  return res.json();
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}

export async function fetchInterviewPrep(
  jobId: string,
  resumeVersionId?: string,
  forceRefresh?: boolean
): Promise<InterviewPrepPack> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/interview-prep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeVersionId, forceRefresh }),
  });
  if (!res.ok) throw new Error('Failed to generate technical interview prep questions');
  return res.json();
}

export async function evaluateInterviewAnswer(
  jobId: string,
  question: InterviewQuestion,
  answer: string
): Promise<InterviewAnswerFeedback> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/interview-prep/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error('Failed to evaluate spoken answer');
  return res.json();
}

export async function fetchDashboardAIInsights(forceRefresh = false): Promise<DashboardAIInsights> {
  const url = forceRefresh ? `${API_BASE}/dashboard/ai-insights?forceRefresh=true` : `${API_BASE}/dashboard/ai-insights`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch dashboard AI insights');
  return res.json();
}

export async function refreshDashboardAIInsights(): Promise<DashboardAIInsights> {
  const res = await fetch(`${API_BASE}/dashboard/ai-insights/refresh`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to refresh dashboard AI insights');
  return res.json();
}

export async function fetchNetworkContacts(company?: string): Promise<NetworkContact[]> {
  const url = company && company !== 'ALL' ? `${API_BASE}/network/referrals?company=${encodeURIComponent(company)}` : `${API_BASE}/network/referrals`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch network contacts');
  return res.json();
}

export async function generateReferralMessage(
  contactId: string,
  targetRole?: string
): Promise<ReferralMessageResult> {
  const res = await fetch(`${API_BASE}/network/referrals/generate-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contactId, targetRole }),
  });
  if (!res.ok) throw new Error('Failed to generate referral outreach message');
  return res.json();
}

export async function draftNegotiationEmail(params: {
  company: string;
  role: string;
  location: string;
  currentOffer?: string;
  targetSalary?: string;
  scenario: NegotiationScenario;
  benchmark?: SalaryBenchmark;
  additionalNotes?: string;
}): Promise<NegotiationEmailDraft> {
  const res = await fetch(`${API_BASE}/negotiation/draft-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to generate negotiation email draft');
  return res.json();
}

