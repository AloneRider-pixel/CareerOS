import assert from 'node:assert/strict';
import test from 'node:test';
import type { CandidateProfile, Job } from '../src/types';
import { MatchingEngine, mergeProfileSkills } from '../server/services/matchingEngine';

// Synthetic data only. These fixtures do not describe a real candidate or job.
const candidate: CandidateProfile = {
  userId: 'fixture-user', name: 'Test Candidate', email: 'candidate@example.invalid',
  summary: '', careerLevel: 'Graduate', location: 'India', relocationPreference: '',
  education: [{ degree: 'B.Tech', field: 'Computer Science', institution: 'Test University', graduationYear: 2025 }],
  workModes: ['Remote'], targetRoles: ['Backend Engineer'], targetLocations: ['India'],
  primarySkills: ['Python'], aiSkills: [], dataSkills: [], cloudSkills: [],
  familiarSkills: [], allSkills: ['Python'], experience: [], certifications: [], links: {},
  projects: [{ id: 'fixture-project', title: 'WidgetBridge', description: ['A sample service'], technologies: [] }],
  createdAt: '2026-01-01', updatedAt: '2026-01-01',
};
const job: Job = {
  jobId: 'fixture-job', canonicalTitle: 'Backend Engineer', originalTitle: 'Backend Engineer',
  company: 'Test Company', location: 'India', workMode: 'Remote',
  description: 'Graduate backend role for a B.Tech candidate.', requirements: ['Python', 'WidgetBridge'],
  mandatoryRequirements: ['Python', 'WidgetBridge'], preferredSkills: [],
  experienceMin: 0, experienceMax: 1, employmentType: 'Full-time', postingDate: '2026-01-01',
  status: 'ACTIVE', applicationUrl: 'https://example.invalid/job', canonicalUrl: 'https://example.invalid/job',
  sources: [], sourceCount: 0, verified: false, verificationStatus: 'UNVERIFIED',
  verificationConfidence: 0, riskLevel: 'LOW', applicationComplexity: 'LOW',
  createdAt: '2026-01-01', updatedAt: '2026-01-01', lastVerifiedAt: '2026-01-01',
};

test('matching consumes declared skill/project/education fields and returns a reason', async () => {
  const result = await MatchingEngine.matchCandidateWithJob(candidate, job, false);
  assert.ok(result.matchingSkills.some((skill) => skill.toLowerCase() === 'python'));
  assert.ok(result.matchingSkills.some((skill) => skill.toLowerCase() === 'widgetbridge'));
  assert.equal(typeof result.eligibilityReason, 'string');
  assert.ok(result.eligibilityReason.length > 0);
  assert.ok(result.advantages.some((text) => text.includes('2025 batch')));
});

test('a closed job remains ineligible and ignored with an explicit reason', async () => {
  const result = await MatchingEngine.matchCandidateWithJob(candidate, { ...job, status: 'CLOSED' }, false);
  assert.equal(result.eligibility, 'NOT_ELIGIBLE');
  assert.equal(result.priority, 'IGNORE');
  assert.match(result.eligibilityReason, /closed|expired/i);
});

test('education from another year does not earn the 2025 batch advantage', async () => {
  const other = { ...candidate, education: [{ ...candidate.education[0], graduationYear: 2024 }] };
  const result = await MatchingEngine.matchCandidateWithJob(other, job, false);
  assert.ok(!result.advantages.some((text) => text.includes('2025 batch')));
});


test('profile skill-group edits refresh matching and remove stale grouped skills', async () => {
  const current = { ...candidate, allSkills: ['Python', 'ResumeOnly'] };
  // ProfileView sends a full form including the old aggregate.
  const edited = mergeProfileSkills(current, { ...current, primarySkills: ['Rust'], cloudSkills: [' Docker ', 'rust'] });
  assert.deepEqual(edited.allSkills, ['Rust', 'Docker', 'ResumeOnly']);
  const result = await MatchingEngine.matchCandidateWithJob(edited, {
    ...job, requirements: ['Rust'], mandatoryRequirements: ['Rust'],
  }, false);
  assert.ok(result.matchingSkills.some((skill) => skill.toLowerCase() === 'rust'));
  assert.ok(!result.matchingSkills.some((skill) => skill.toLowerCase() === 'python'));
});

test('partial skill edits preserve untouched groups and resume-only skills', () => {
  const current = { ...candidate, aiSkills: ['RAG'], allSkills: ['Python', 'RAG', 'ResumeOnly'] };
  const edited = mergeProfileSkills(current, { primarySkills: [] });
  assert.deepEqual(edited.allSkills, ['RAG', 'ResumeOnly']);
  assert.equal(mergeProfileSkills(current, { name: 'New Name' }).allSkills, current.allSkills);
});
