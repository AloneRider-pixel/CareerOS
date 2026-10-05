import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { dbStore, DEFAULT_CANDIDATE } from './server/db/store';
import { SearchEngine } from './server/services/searchEngine';
import { tailorResumeForJob, verifyJobWithGrounding, parseResumeText, generateInterviewPrepPack, evaluateInterviewAnswer, generateDashboardAIInsights, generateReferralOutreachMessage, getSalaryBenchmarkWithGemini, generateNegotiationEmailDraft } from './server/gemini';
import { RankingEngine } from './server/services/rankingEngine';
import { ApplicationStatus, ResumeVersion, InterviewPrepPack, InterviewAnswerFeedback, DashboardAIInsights, NetworkContact, ReferralMessageResult, SalaryBenchmark, NegotiationScenario, NegotiationEmailDraft } from './src/types';
import { CompanyCultureService } from './server/services/companyCultureService';
import { FirestoreService } from './server/db/firestoreService';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Auth / Current Session
app.get('/api/auth/me', (req, res) => {
  const profile = dbStore.getCandidateProfile();
  res.json({
    userId: profile.userId,
    name: profile.name,
    email: profile.email,
    careerLevel: profile.careerLevel,
  });
});

// Candidate Profile
app.get('/api/profile', (req, res) => {
  const profile = dbStore.getCandidateProfile();
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const updated = dbStore.updateCandidateProfile(req.body);
  res.json(updated);
});

// Resume Ingestion / Parsing
app.post('/api/resume/upload', async (req, res) => {
  try {
    const { rawText, fileName } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    const parsed = await parseResumeText(rawText);

    // Merge parsed information into candidate profile without losing existing values
    const current = dbStore.getCandidateProfile();
    const updated = dbStore.updateCandidateProfile({
      name: parsed.name || current.name,
      summary: parsed.summary || current.summary,
      education: parsed.education && parsed.education.length ? parsed.education : current.education,
      primarySkills: parsed.primarySkills && parsed.primarySkills.length ? parsed.primarySkills : current.primarySkills,
      allSkills: Array.from(new Set([...(parsed.allSkills || []), ...current.allSkills])),
      experience: parsed.experience && parsed.experience.length ? parsed.experience : current.experience,
      projects: parsed.projects && parsed.projects.length ? parsed.projects : current.projects,
      certifications: parsed.certifications && parsed.certifications.length ? parsed.certifications : current.certifications,
    });

    res.json({ success: true, profile: updated, fileName });
  } catch (err: any) {
    console.error('[Resume Upload Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume.' });
  }
});

// Jobs
app.get('/api/jobs', (req, res) => {
  let jobs = dbStore.getJobs();

  const {
    q,
    priority,
    workMode,
    location,
    minMatch,
    verifiedOnly,
  } = req.query;

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    jobs = jobs.filter(
      (j) =>
        j.canonicalTitle.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.requirements.some((r) => r.toLowerCase().includes(query)) ||
        j.description.toLowerCase().includes(query)
    );
  }

  if (priority && typeof priority === 'string' && priority !== 'ALL') {
    jobs = jobs.filter((j) => j.match?.priority === priority);
  }

  if (workMode && typeof workMode === 'string' && workMode !== 'ALL') {
    jobs = jobs.filter((j) => j.workMode.toLowerCase() === workMode.toLowerCase());
  }

  if (location && typeof location === 'string' && location !== 'ALL') {
    const locLower = location.toLowerCase();
    jobs = jobs.filter((j) => j.location.toLowerCase().includes(locLower));
  }

  if (minMatch && !isNaN(Number(minMatch))) {
    const threshold = Number(minMatch);
    jobs = jobs.filter((j) => (j.match?.overallScore || 0) >= threshold);
  }

  if (verifiedOnly === 'true') {
    jobs = jobs.filter((j) => j.verified || j.verificationStatus === 'VERIFIED');
  }

  const sorted = RankingEngine.sortJobs(jobs);
  res.json({ jobs: sorted, total: sorted.length });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = dbStore.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }
  res.json(job);
});

// Search Engine Run
app.post('/api/jobs/search', async (req, res) => {
  try {
    const candidate = dbStore.getCandidateProfile();
    const filters = req.body || {};
    const result = await SearchEngine.executeSearch(candidate, filters);
    const allJobs = dbStore.getJobs();
    res.json({
      run: result.run,
      newDiscovered: result.discoveredJobs.length,
      totalJobs: allJobs.length,
      jobs: allJobs,
    });
  } catch (err: any) {
    console.error('[Search Execute Error]:', err);
    res.status(500).json({ error: err.message || 'Search execution failed.' });
  }
});

// Job Verification
app.post('/api/jobs/:id/verify', async (req, res) => {
  try {
    const job = dbStore.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const verificationResult = await verifyJobWithGrounding(job);
    const updated = dbStore.updateJob(job.jobId, {
      status: verificationResult.status,
      verificationStatus: verificationResult.verificationStatus,
      verificationConfidence: verificationResult.verificationConfidence,
      verificationNotes: verificationResult.verificationNotes,
      officialUrl: verificationResult.officialUrl || job.officialUrl,
      riskLevel: verificationResult.riskLevel,
      riskReason: verificationResult.riskReason,
      lastVerifiedAt: new Date().toISOString(),
      verified: verificationResult.verificationStatus === 'VERIFIED',
    });

    res.json(updated);
  } catch (err: any) {
    console.error('[Job Verify Error]:', err);
    res.status(500).json({ error: err.message || 'Verification failed.' });
  }
});

// Resume Tailoring for Specific Job
app.post('/api/jobs/:id/tailor', async (req, res) => {
  try {
    const job = dbStore.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const candidate = dbStore.getCandidateProfile();
    const tailored = await tailorResumeForJob(candidate, job);

    const versionNumber = dbStore.getResumeVersions().length + 1;
    const newVersion: ResumeVersion = {
      id: `res_v${versionNumber}_${Date.now()}`,
      userId: candidate.userId,
      versionName: `Resume v${versionNumber} - ${job.company} (${job.canonicalTitle.substring(0, 20)})`,
      jobId: job.jobId,
      jobTitle: job.canonicalTitle,
      company: job.company,
      matchScore: tailored.matchScore,
      tailoredSummary: tailored.tailoredSummary,
      highlightedSkills: tailored.highlightedSkills,
      reorderedBullets: tailored.reorderedBullets,
      missingKeywordsTargeted: tailored.missingKeywordsTargeted,
      createdAt: new Date().toISOString(),
    };

    dbStore.addResumeVersion(newVersion);
    res.json(newVersion);
  } catch (err: any) {
    console.error('[Resume Tailor Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to tailor resume.' });
  }
});

// Interview Prep Cache in memory
const interviewPrepCache = new Map<string, InterviewPrepPack>();

// Technical Interview Prep Generator
app.post('/api/jobs/:id/interview-prep', async (req, res) => {
  try {
    const job = dbStore.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const { resumeVersionId, forceRefresh } = req.body || {};
    const cacheKey = `${job.jobId}_${resumeVersionId || 'default'}`;

    if (!forceRefresh && interviewPrepCache.has(cacheKey)) {
      return res.json(interviewPrepCache.get(cacheKey));
    }

    const candidate = dbStore.getCandidateProfile();
    const resume = resumeVersionId
      ? dbStore.getResumeVersions().find((r) => r.id === resumeVersionId)
      : dbStore.getResumeVersions().find((r) => r.jobId === job.jobId) || dbStore.getResumeVersions()[0];

    const prepPack = await generateInterviewPrepPack(candidate, job, resume);
    interviewPrepCache.set(cacheKey, prepPack);
    res.json(prepPack);
  } catch (err: any) {
    console.error('[Interview Prep Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to generate interview prep questions.' });
  }
});

app.get('/api/jobs/:id/interview-prep', async (req, res) => {
  const job = dbStore.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  const { resumeVersionId } = req.query as { resumeVersionId?: string };
  const cacheKey = `${job.jobId}_${resumeVersionId || 'default'}`;

  if (interviewPrepCache.has(cacheKey)) {
    return res.json(interviewPrepCache.get(cacheKey));
  }

  // Generate on-demand if not in cache
  try {
    const candidate = dbStore.getCandidateProfile();
    const resume = resumeVersionId
      ? dbStore.getResumeVersions().find((r) => r.id === resumeVersionId)
      : dbStore.getResumeVersions().find((r) => r.jobId === job.jobId) || dbStore.getResumeVersions()[0];

    const prepPack = await generateInterviewPrepPack(candidate, job, resume);
    interviewPrepCache.set(cacheKey, prepPack);
    res.json(prepPack);
  } catch (err: any) {
    console.error('[Interview Prep Get Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch interview prep.' });
  }
});

// Evaluate Mock Interview Spoken/Recorded Answer
app.post('/api/jobs/:id/interview-prep/evaluate', async (req, res) => {
  try {
    const job = dbStore.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const { question, answer } = req.body;
    if (!question || !question.question) {
      return res.status(400).json({ error: 'Interview question details are required.' });
    }

    const candidate = dbStore.getCandidateProfile();
    const feedback = await evaluateInterviewAnswer(question, answer || '', job, candidate);
    res.json(feedback);
  } catch (err: any) {
    console.error('[Interview Prep Evaluate Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to evaluate interview answer.' });
  }
});

// Resumes
app.get('/api/resumes', (req, res) => {
  res.json(dbStore.getResumeVersions());
});

app.get('/api/resumes/:id', (req, res) => {
  const version = dbStore.getResumeVersions().find((v) => v.id === req.params.id);
  if (!version) return res.status(404).json({ error: 'Resume version not found.' });
  res.json(version);
});

// Applications Tracking
app.get('/api/applications', (req, res) => {
  res.json(dbStore.getApplications());
});

app.post('/api/applications', (req, res) => {
  const candidate = dbStore.getCandidateProfile();
  const { jobId, status, resumeVersionId, resumeVersionName, notes, applicationUrl, source } = req.body;

  const job = dbStore.getJobById(jobId);
  if (!job) {
    return res.status(400).json({ error: 'Invalid jobId.' });
  }

  const result = dbStore.addApplication({
    jobId,
    userId: candidate.userId,
    canonicalTitle: job.canonicalTitle,
    company: job.company,
    location: job.location,
    status: (status as ApplicationStatus) || 'READY_TO_APPLY',
    dateFound: job.createdAt,
    dateReady: new Date().toISOString(),
    dateApplied: status === 'APPLIED' ? new Date().toISOString() : undefined,
    applicationUrl: applicationUrl || job.applicationUrl,
    resumeVersionId,
    resumeVersionName,
    notes: notes || 'Application initiated from CareerOS unified router.',
    source: source || job.sources[0]?.name || 'Direct Employer Portal',
    matchScore: job.match?.overallScore,
    priority: job.match?.priority,
  });

  if (!result.success) {
    return res.status(409).json(result);
  }

  res.status(201).json(result.application);
});

app.put('/api/applications/:id', (req, res) => {
  const updated = dbStore.updateApplication(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Application not found.' });
  }
  res.json(updated);
});

// Search Runs History
app.get('/api/search-runs', (req, res) => {
  res.json(dbStore.getSearchRuns());
});

// Skill Gaps
app.get('/api/skills/gaps', (req, res) => {
  res.json(dbStore.getSkillGaps());
});

// Companies Intelligence
app.get('/api/companies', (req, res) => {
  res.json(dbStore.getCompanies());
});

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json(dbStore.getDashboardStats());
});

// In-memory cache for Dashboard AI Insights
let cachedAIInsights: DashboardAIInsights | null = null;

// Dashboard AI Insights & Target Company Recommendations
app.get('/api/dashboard/ai-insights', async (req, res) => {
  try {
    const { forceRefresh } = req.query as { forceRefresh?: string };
    if (!forceRefresh && cachedAIInsights) {
      return res.json(cachedAIInsights);
    }

    const candidate = dbStore.getCandidateProfile();
    const applications = dbStore.getApplications();
    const jobs = dbStore.getJobs();

    const insights = await generateDashboardAIInsights(candidate, applications, jobs);
    cachedAIInsights = insights;
    res.json(insights);
  } catch (err: any) {
    console.error('[Dashboard AI Insights Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to generate AI insights.' });
  }
});

app.post('/api/dashboard/ai-insights/refresh', async (req, res) => {
  try {
    const candidate = dbStore.getCandidateProfile();
    const applications = dbStore.getApplications();
    const jobs = dbStore.getJobs();

    const insights = await generateDashboardAIInsights(candidate, applications, jobs);
    cachedAIInsights = insights;
    res.json(insights);
  } catch (err: any) {
    console.error('[Dashboard AI Insights Refresh Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to refresh AI insights.' });
  }
});

// Network Referral Helper
app.get('/api/network/referrals', (req, res) => {
  const { company } = req.query as { company?: string };
  const contacts = dbStore.getNetworkContacts(company);
  res.json(contacts);
});

app.post('/api/network/referrals/generate-message', async (req, res) => {
  try {
    const { contactId, targetRole } = req.body;
    const contacts = dbStore.getNetworkContacts();
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Network contact not found.' });
    }

    const candidate = dbStore.getCandidateProfile();
    const messageResult = await generateReferralOutreachMessage(candidate, contact, targetRole);
    res.json(messageResult);
  } catch (err: any) {
    console.error('[Generate Referral Message Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to generate referral outreach message.' });
  }
});

// Salary Benchmark Route
app.get('/api/salary-benchmark', async (req, res) => {
  try {
    const { role, location, min, max, raw } = req.query as {
      role?: string;
      location?: string;
      min?: string;
      max?: string;
      raw?: string;
    };

    const benchmark = await getSalaryBenchmarkWithGemini(
      role || 'Software Engineer',
      location || 'Bengaluru',
      min ? Number(min) : undefined,
      max ? Number(max) : undefined,
      raw
    );

    res.json(benchmark);
  } catch (err: any) {
    console.error('[Salary Benchmark Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to generate salary benchmark.' });
  }
});

// Negotiation Helper Draft Route
app.post('/api/negotiation/draft-email', async (req, res) => {
  try {
    const { company, role, location, currentOffer, targetSalary, scenario, benchmark, additionalNotes } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: 'Company and Role are required to generate negotiation draft.' });
    }

    const candidate = dbStore.getCandidateProfile();
    const draft = await generateNegotiationEmailDraft(candidate, {
      company,
      role,
      location: location || 'India',
      currentOffer,
      targetSalary,
      scenario: scenario || 'COUNTER_OFFER',
      benchmark,
      additionalNotes,
    });

    res.json(draft);
  } catch (err: any) {
    console.error('[Negotiation Draft Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to generate negotiation email draft.' });
  }
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(dbStore.getSettings());
});

app.put('/api/settings', (req, res) => {
  res.json(dbStore.updateSettings(req.body));
});

// -------------------------------------------------------------
// VITE SPA INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CareerOS Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
