export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'CLOSED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type EligibilityStatus = 'ELIGIBLE' | 'LIKELY_ELIGIBLE' | 'BORDERLINE' | 'NOT_ELIGIBLE';
export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3' | 'IGNORE';
export type InterviewProbability = 'HIGH' | 'MEDIUM' | 'LOW';
export type ApplicationComplexity = 'LOW' | 'MEDIUM' | 'HIGH';

export type ApplicationStatus =
  | 'FOUND'
  | 'VERIFIED'
  | 'SAVED'
  | 'READY_TO_APPLY'
  | 'APPLIED'
  | 'ASSESSMENT'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'FINAL_ROUND'
  | 'OFFER'
  | 'REJECTED'
  | 'GHOSTED'
  | 'CLOSED';

export interface JobSource {
  name: string;
  url: string;
  discoveredAt: string;
  sourceType: 'official_careers' | 'official_ats' | 'job_portal' | 'aggregator';
}

export interface Job {
  jobId: string;
  canonicalTitle: string;
  originalTitle: string;
  company: string;
  companyId?: string;
  companyLogo?: string;
  location: string;
  workMode: WorkMode;
  description: string;
  requirements: string[];
  mandatoryRequirements: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  salary?: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract';
  postingDate: string;
  freshnessDays?: number;
  freshnessLabel?: string;
  deadline?: string;
  status: 'ACTIVE' | 'CLOSED' | 'EXPIRED';
  officialUrl?: string;
  applicationUrl: string;
  canonicalUrl: string;
  sources: JobSource[];
  sourceCount: number;
  verified: boolean;
  verificationStatus: VerificationStatus;
  verificationConfidence: number; // 0 - 100
  verificationNotes?: string;
  riskLevel: RiskLevel;
  riskReason?: string;
  applicationComplexity: ApplicationComplexity;
  applicationPlatform?: 'Greenhouse' | 'Lever' | 'Workday' | 'Ashby' | 'SmartRecruiters' | 'Naukri' | 'LinkedIn' | 'DirectCareers' | 'Other';
  easyApply?: boolean;
  loginRequired?: boolean;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt: string;
  // Match & Rank embedded for fast client rendering
  match?: JobMatch;
}

export interface JobMatch {
  jobId: string;
  userId: string;
  overallScore: number; // 0 - 100
  technicalScore: number;
  experienceScore: number;
  roleScore: number;
  educationScore: number;
  locationScore: number;
  domainScore: number;
  cloudScore: number;
  keywordScore: number;
  eligibility: EligibilityStatus;
  eligibilityReason: string;
  priority: PriorityLevel;
  interviewProbability: InterviewProbability;
  interviewProbabilityReason: string;
  matchingSkills: string[];
  missingSkills: string[];
  mandatoryGaps: string[];
  advantages: string[];
  rejectionRisks: string[];
  createdAt: string;
}

export interface CandidateEducation {
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
  score?: string;
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  technologies: string[];
}

export interface CandidateProject {
  id: string;
  title: string;
  description: string[];
  technologies: string[];
  link?: string;
  github?: string;
}

export interface CandidateProfile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  summary: string;
  careerLevel: string;
  education: CandidateEducation[];
  location: string;
  relocationPreference: string;
  workModes: WorkMode[];
  targetRoles: string[];
  targetLocations: string[];
  primarySkills: string[];
  aiSkills: string[];
  dataSkills: string[];
  cloudSkills: string[];
  familiarSkills: string[];
  allSkills: string[];
  experience: CandidateExperience[];
  projects: CandidateProject[];
  certifications: string[];
  links: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  userId: string;
  versionName: string; // e.g., "Resume v1 - General Backend", "Resume v2 - FastAPI & AI (Swiggy)"
  jobId?: string;
  jobTitle?: string;
  company?: string;
  matchScore?: number;
  tailoredSummary: string;
  highlightedSkills: string[];
  reorderedBullets: { section: string; bullets: string[] }[];
  missingKeywordsTargeted: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  canonicalTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  dateFound: string;
  dateReady?: string;
  dateApplied?: string;
  lastUpdated: string;
  applicationUrl: string;
  resumeVersionId?: string;
  resumeVersionName?: string;
  notes: string;
  followUpDate?: string;
  source: string;
  interviewStage?: string;
  outcome?: string;
  matchScore?: number;
  priority?: PriorityLevel;
}

export interface SearchRun {
  searchRunId: string;
  startedAt: string;
  completedAt: string;
  queriesUsed: string[];
  sourcesChecked: string[];
  groundingCitations?: { uri: string; title: string }[];
  discoveredSources?: { name: string; url: string; count: number }[];
  rawJobsFound: number;
  verifiedJobs: number;
  duplicatesRemoved: number;
  eligibleJobs: number;
  p0Count: number;
  p1Count: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  summary?: string;
}

export interface SkillGap {
  id: string;
  skill: string;
  frequency: number; // number of jobs requiring this
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  jobsAffected: number;
  roleFamilies: string[];
  recommendedPriority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  studyGuide?: string;
}

export interface CompanyIntelligence {
  company: string;
  companyId: string;
  logo?: string;
  openRolesCount: number;
  openRoles: string[];
  locations: string[];
  technologyThemes: string[];
  averageMatchScore: number;
  officialCareersUrl: string;
  verifiedActive: boolean;
}

export interface SearchFilters {
  targetRoles: string[];
  targetLocations: string[];
  workModes: WorkMode[];
  minMatchScore: number;
  maxExperience: number;
  maxPostingAgeDays: number;
  priorityLevels: PriorityLevel[];
  verificationFilter: 'ALL' | 'VERIFIED_ONLY';
  includeInternships: boolean;
  includeContract: boolean;
  searchQuery?: string;
}

export interface DashboardStats {
  jobsFound: number;
  verifiedCount: number;
  uniqueJobs: number;
  strongMatchesCount: number;
  p0Count: number;
  p1Count: number;
  applicationsSent: number;
  interviewsCount: number;
  offersCount: number;
  activeSearchRuns: number;
  topSkillsDemand: { skill: string; count: number }[];
  sourceDistribution: { source: string; count: number }[];
  applicationStatusBreakdown: { status: string; count: number }[];
  weeklyDiscoveryTrends: { day: string; count: number; applied: number }[];
}

export interface InterviewQuestion {
  id: string;
  category:
    | 'Core Backend & Architecture'
    | 'FastAPI & Async Programming'
    | 'Databases & Query Optimization'
    | 'AI, LLM & RAG Systems'
    | 'Data Pipelines & Distributed ETL'
    | 'Test Automation & PyTest'
    | 'System Design & Scalability'
    | 'Behavioral & Project Defense';
  question: string;
  whyAsked: string;
  candidateAngle: string;
  keyConceptsToCover: string[];
  sampleAnswerOutline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewPrepPack {
  jobId: string;
  company: string;
  jobTitle: string;
  generatedAt: string;
  matchHighlights: string[];
  technicalFocusAreas: string[];
  questions: InterviewQuestion[];
}

export interface InterviewAnswerFeedback {
  score: number; // 0 - 100
  performanceTier: 'Exceptional' | 'Strong' | 'Needs Improvement' | 'Unsatisfactory';
  strengths: string[];
  missedConcepts: string[];
  suggestions: string[];
  polishedSampleRevision: string;
  clarityAndDepthAnalysis: string;
}

export interface TargetCompanyRecommendation {
  company: string;
  recommendedRole: string;
  interviewProbability: 'HIGH' | 'VERY HIGH';
  probabilityScore: number; // e.g. 92%
  whyCandidateFits: string;
  matchingTechStack: string[];
  strategicTip: string;
  officialCareersUrl?: string;
}

export interface DashboardAIInsights {
  generatedAt: string;
  overallMarketCompetitiveness: string;
  applicationVelocityAnalysis: string;
  conversionTrends: {
    appliedCount: number;
    interviewRateEstimated: string;
    keyStrengthArea: string;
    highestDemandSkill: string;
  };
  recommendedTargetCompanies: TargetCompanyRecommendation[];
  nextBestActions: string[];
}

export interface NetworkContact {
  id: string;
  name: string;
  avatarUrl?: string;
  title: string;
  company: string;
  connectionDegree: '1st' | '2nd' | 'Alumni';
  connectionContext: string;
  mutualConnectionsCount: number;
  linkedinUrl: string;
  suggestedRoleForReferral: string;
  referralProbability: 'VERY HIGH' | 'HIGH' | 'MODERATE';
  sampleMessage: string;
}

export interface ReferralMessageResult {
  contactName: string;
  company: string;
  subjectLine: string;
  messageBody: string;
  followUpTip: string;
}

export interface SalaryBenchmark {
  role: string;
  location: string;
  experienceLevel: string; // e.g. "0-2 years (Early Career / Fresher)"
  currency: 'INR' | 'USD';
  p25Salary: number; // in LPA or absolute INR
  medianSalary: number;
  p75Salary: number;
  p90Salary: number;
  formattedRange: string; // e.g. "₹8.0 - ₹18.0 LPA"
  offeringComparison: {
    status: 'ABOVE_MARKET' | 'COMPETITIVE' | 'BELOW_MARKET' | 'UNKNOWN';
    percentageDifference?: number;
    commentary: string;
    percentileEstimate?: string;
  };
  keyCompensationDrivers: string[];
  sourceNotes: string;
}

export type NegotiationScenario =
  | 'COUNTER_OFFER'
  | 'MULTIPLE_OFFERS'
  | 'PRE_OFFER_SCREEN'
  | 'EQUITY_OR_SIGN_ON';

export interface NegotiationEmailDraft {
  scenario: NegotiationScenario;
  subjectLine: string;
  emailBody: string;
  talkingPoints: string[];
  strategicAdvice: string;
  marketLeverageSummary: string;
}

export interface CompanyCultureInsight {
  company: string;
  summary: string;
  glassdoor: {
    overallRating: number;
    workLifeBalance: number;
    cultureAndValues: number;
    careerOpportunities: number;
    seniorLeadership: number;
    recommendToFriendPct: number;
    ceoApprovalPct: number;
    reviewCount: string;
  };
  sentiment: {
    positiveThemes: string[];
    potentialConcerns: string[];
    workCultureVerdict: string;
    engineeringAutonomy: string;
  };
  recentPressReleases: {
    title: string;
    date: string;
    url: string;
    summary: string;
  }[];
  lastUpdated: string;
  source: string;
}
