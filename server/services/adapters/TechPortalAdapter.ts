import { CandidateProfile } from '../../../src/types';
import { JobSourceAdapter } from './JobSourceAdapter';

export class TechPortalAdapter implements JobSourceAdapter {
  public id = 'tech_portal_adapter';
  public name = 'India Tech Portals (Naukri, Cutshort, Instahyre, Wellfound)';
  public sourceType: 'job_portal' = 'job_portal';

  public buildQueries(candidate: CandidateProfile, targetLocations: string[], maxExp: number): string[] {
    return [
      `site:naukri.com OR site:instahyre.com ("Python Backend Developer" OR "FastAPI" OR "SDE 1") ("0-2 years" OR "fresher") ("Bengaluru" OR "Pune" OR "Gurugram")`,
      `site:cutshort.io OR site:wellfound.com ("Backend Engineer" OR "Python" OR "SDET" OR "Data Engineer") India 2025`,
    ];
  }
}
