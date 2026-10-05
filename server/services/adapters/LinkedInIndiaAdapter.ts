import { CandidateProfile } from '../../../src/types';
import { JobSourceAdapter } from './JobSourceAdapter';

export class LinkedInIndiaAdapter implements JobSourceAdapter {
  public id = 'linkedin_india_adapter';
  public name = 'LinkedIn India Jobs';
  public sourceType: 'job_portal' = 'job_portal';

  public buildQueries(candidate: CandidateProfile, targetLocations: string[], maxExp: number): string[] {
    return [
      `site:linkedin.com/jobs ("Software Engineer" OR "SDE 1" OR "Associate Software Engineer") ("FastAPI" OR "Python") ("Bengaluru" OR "Hyderabad" OR "Pune" OR "India") ("0-2 years" OR "fresher" OR "2025")`,
      `site:linkedin.com/jobs ("AI Engineer" OR "Generative AI" OR "RAG" OR "LangGraph") ("India" OR "Remote") ("Associate" OR "Junior" OR "Fresher")`,
    ];
  }
}
