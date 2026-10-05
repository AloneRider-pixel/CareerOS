import { CandidateProfile } from '../../../src/types';
import { JobSourceAdapter } from './JobSourceAdapter';

export class CompanyATSAdapter implements JobSourceAdapter {
  public id = 'official_ats_adapter';
  public name = 'Official Company ATS & Direct Careers';
  public sourceType: 'official_ats' = 'official_ats';

  public buildQueries(candidate: CandidateProfile, targetLocations: string[], maxExp: number): string[] {
    const locSnippet = targetLocations.slice(0, 3).join(' OR ');
    return [
      `site:boards.greenhouse.io OR site:jobs.lever.co OR site:jobs.ashbyhq.com ("India" OR ${locSnippet}) ("Software Engineer" OR "Backend Developer" OR "Python") (2025 OR "0-2 years")`,
      `site:myworkdayjobs.com OR site:smartrecruiters.com ("India" OR "Bengaluru" OR "Pune") ("Software Development Engineer" OR "FastAPI" OR "Python")`,
      `("careers.swiggy.com" OR "postman.com/careers" OR "razorpay.com/jobs" OR "browserstack.com/careers" OR "phonepe.com/careers") ("software engineer" OR "backend" OR "sde")`,
    ];
  }
}
