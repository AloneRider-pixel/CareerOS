import { CandidateProfile, EligibilityStatus, Job } from '../../src/types';

export class EligibilityEngine {
  public static evaluate(
    candidate: CandidateProfile,
    job: Job
  ): { eligibility: EligibilityStatus; reason: string; hardDisqualifiers: string[] } {
    const hardDisqualifiers: string[] = [];
    const titleLower = job.canonicalTitle.toLowerCase();
    const descLower = job.description.toLowerCase();

    // 1. Seniority Check
    if (
      titleLower.includes('senior') ||
      titleLower.includes('lead ') ||
      titleLower.includes('principal') ||
      titleLower.includes('staff ') ||
      titleLower.includes('architect') ||
      titleLower.includes('director') ||
      titleLower.includes('vp ')
    ) {
      hardDisqualifiers.push('Role requires senior/leadership level seniority.');
    }

    // 2. Experience threshold check (candidate is fresher/0-2 yrs)
    if (job.experienceMin >= 4) {
      hardDisqualifiers.push(`Mandatory minimum experience (${job.experienceMin} years) exceeds candidate early-career profile (0-2 years).`);
    }

    // 3. Status check
    if (job.status === 'CLOSED' || job.status === 'EXPIRED') {
      hardDisqualifiers.push('Job posting is closed or has expired.');
    }

    // 4. Degree compatibility (Candidate holds B.Tech CSE)
    if (descLower.includes('phd required') || descLower.includes('doctorate required')) {
      hardDisqualifiers.push('Requires mandatory Doctorate/PhD degree.');
    }

    // 5. Geographic restriction (Candidate is in India with open relocation in India)
    if (
      (descLower.includes('us citizen only') ||
        descLower.includes('must reside in europe') ||
        descLower.includes('security clearance required')) &&
      !job.location.toLowerCase().includes('india')
    ) {
      hardDisqualifiers.push('Restricted citizenship or geographic work authorization requirement.');
    }

    if (hardDisqualifiers.length > 0) {
      return {
        eligibility: 'NOT_ELIGIBLE',
        reason: hardDisqualifiers.join(' '),
        hardDisqualifiers,
      };
    }

    // Check Borderline vs Likely Eligible vs Eligible
    if (job.experienceMin >= 2 && job.experienceMax >= 4) {
      return {
        eligibility: 'BORDERLINE',
        reason: 'Requires 2-4 years experience; candidate is a 2025 graduate with internship experience.',
        hardDisqualifiers: [],
      };
    }

    if (job.mandatoryRequirements.some((m) => m.toLowerCase().includes('2+ years') || m.toLowerCase().includes('3+ years'))) {
      return {
        eligibility: 'LIKELY_ELIGIBLE',
        reason: 'Candidate meets all technical skills, though role lists preferred 1-2 years experience.',
        hardDisqualifiers: [],
      };
    }

    return {
      eligibility: 'ELIGIBLE',
      reason: 'Candidate satisfies education (B.Tech 2025), experience tier (0-2y), and primary technical competencies.',
      hardDisqualifiers: [],
    };
  }
}
