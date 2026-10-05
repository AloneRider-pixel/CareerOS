import { Job, PriorityLevel } from '../../src/types';

export class RankingEngine {
  /**
   * Deterministically calculate priority based on candidate fit, verification, and ATS platform:
   * P0: Apply Immediately (Score >= 85, ELIGIBLE, HIGH interview likelihood, verified direct ATS)
   * P1: Apply Today (Score >= 75, ELIGIBLE or LIKELY_ELIGIBLE)
   * P2: Apply This Week (Score >= 60, not ineligible)
   * P3: Optional (Score < 60 or BORDERLINE)
   * IGNORE: Ineligible / Closed / Senior
   */
  public static calculatePriority(job: Job): PriorityLevel {
    if (!job.match) return 'P2';

    if (job.match.eligibility === 'NOT_ELIGIBLE') {
      return 'IGNORE';
    }

    const score = job.match.overallScore;
    const isVerified = job.verified || job.verificationStatus === 'VERIFIED';
    const isDirectOfficial =
      job.sources.some((s) => s.sourceType === 'official_careers' || s.sourceType === 'official_ats') ||
      job.applicationPlatform === 'Greenhouse' ||
      job.applicationPlatform === 'Lever' ||
      job.applicationPlatform === 'Ashby';

    if (
      score >= 85 &&
      job.match.eligibility === 'ELIGIBLE' &&
      isVerified &&
      isDirectOfficial &&
      job.match.interviewProbability === 'HIGH'
    ) {
      return 'P0';
    }

    if (score >= 75 && (job.match.eligibility === 'ELIGIBLE' || job.match.eligibility === 'LIKELY_ELIGIBLE')) {
      return 'P1';
    }

    if (score >= 60) {
      return 'P2';
    }

    if (score >= 45 || job.match.eligibility === 'BORDERLINE') {
      return 'P3';
    }

    return 'IGNORE';
  }

  /**
   * Sort jobs by priority (P0 -> P1 -> P2 -> P3 -> IGNORE) then by overallScore desc then postingDate desc
   */
  public static sortJobs(jobs: Job[]): Job[] {
    const priorityWeight: { [p in PriorityLevel]: number } = {
      P0: 5,
      P1: 4,
      P2: 3,
      P3: 2,
      IGNORE: 1,
    };

    return [...jobs].sort((a, b) => {
      const pA = priorityWeight[a.match?.priority || 'P2'];
      const pB = priorityWeight[b.match?.priority || 'P2'];
      if (pA !== pB) return pB - pA;

      const scoreA = a.match?.overallScore || 0;
      const scoreB = b.match?.overallScore || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;

      const dateA = new Date(a.postingDate).getTime() || 0;
      const dateB = new Date(b.postingDate).getTime() || 0;
      return dateB - dateA;
    });
  }
}
