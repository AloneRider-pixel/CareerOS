import { ApplicationComplexity, Job, ResumeVersion } from '../../src/types';

export class RouterService {
  /**
   * Determine platform and complexity for application flow.
   */
  public static assessComplexity(url: string, platform?: string): {
    complexity: ApplicationComplexity;
    platform: Job['applicationPlatform'];
    loginRequired: boolean;
    easyApply: boolean;
  } {
    const lower = url.toLowerCase();

    if (lower.includes('ashbyhq.com') || platform === 'Ashby') {
      return { complexity: 'LOW', platform: 'Ashby', loginRequired: false, easyApply: true };
    }
    if (lower.includes('lever.co') || platform === 'Lever') {
      return { complexity: 'LOW', platform: 'Lever', loginRequired: false, easyApply: true };
    }
    if (lower.includes('greenhouse.io') || platform === 'Greenhouse') {
      return { complexity: 'LOW', platform: 'Greenhouse', loginRequired: false, easyApply: false };
    }
    if (lower.includes('myworkdayjobs.com') || platform === 'Workday') {
      return { complexity: 'MEDIUM', platform: 'Workday', loginRequired: true, easyApply: false };
    }
    if (lower.includes('smartrecruiters.com') || platform === 'SmartRecruiters') {
      return { complexity: 'LOW', platform: 'SmartRecruiters', loginRequired: false, easyApply: true };
    }
    if (lower.includes('darwinbox') || lower.includes('recruitee')) {
      return { complexity: 'LOW', platform: 'Other', loginRequired: false, easyApply: false };
    }
    if (lower.includes('naukri.com')) {
      return { complexity: 'MEDIUM', platform: 'Naukri', loginRequired: true, easyApply: true };
    }
    if (lower.includes('linkedin.com')) {
      return { complexity: 'LOW', platform: 'LinkedIn', loginRequired: true, easyApply: false };
    }

    return { complexity: 'LOW', platform: 'DirectCareers', loginRequired: false, easyApply: false };
  }

  /**
   * Generate assisted checklist and copy-ready fields for user.
   */
  public static getChecklist(job: Job, resume?: ResumeVersion) {
    return [
      {
        step: 1,
        title: 'Review Tailored Resume & Keywords',
        description: `Verify that ${resume?.versionName || 'Tailored Resume'} targets top keywords: ${(job.match?.matchingSkills || job.requirements).slice(0, 4).join(', ')}.`,
      },
      {
        step: 2,
        title: 'Open Verified Employer Application Page',
        description: `Navigate directly to the official ${job.applicationPlatform || 'employer'} application form (${job.applicationUrl}).`,
      },
      {
        step: 3,
        title: 'Fill Profile Details & Upload Resume',
        description: 'Attach the tailored resume and paste links for GitHub, LinkedIn, and live project demos.',
      },
      {
        step: 4,
        title: 'Confirm Submission in CareerOS',
        description: 'Mark job as "Applied" in your application tracker to trigger follow-up schedules and status tracking.',
      },
    ];
  }
}
