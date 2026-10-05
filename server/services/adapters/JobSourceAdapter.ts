import { CandidateProfile, JobSource } from '../../../src/types';

export interface RawDiscoveredJob {
  title: string;
  company: string;
  location: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  experienceMin?: number;
  experienceMax?: number;
  salary?: string;
  postingDate?: string;
  freshnessDays?: number;
  freshnessLabel?: string;
  officialUrl?: string;
  applicationUrl: string;
  sourcePortal: string;
  sourceType: 'official_ats' | 'official_careers' | 'job_portal' | 'aggregator';
  requiredSkills: string[];
  mandatoryRequirements: string[];
  preferredSkills: string[];
  description: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  verificationConfidence?: number;
  verificationNotes?: string;
  groundingQuery?: string;
  groundingCitations?: { uri: string; title: string }[];
}

export interface JobSourceAdapter {
  id: string;
  name: string;
  sourceType: 'official_ats' | 'official_careers' | 'job_portal' | 'aggregator';
  buildQueries(candidate: CandidateProfile, targetLocations: string[], maxExp: number): string[];
}
