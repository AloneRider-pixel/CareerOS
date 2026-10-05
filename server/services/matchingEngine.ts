import {
  CandidateProfile,
  Job,
  JobMatch,
  EligibilityStatus,
  PriorityLevel,
  InterviewProbability,
} from '../../src/types';
import { FirestoreService } from '../db/firestoreService';

// Semantic synonym clusters for tech skills and concepts
const SKILL_SYNONYMS: { [key: string]: string[] } = {
  python: ['python', 'python3', 'py', 'asyncio', 'pep8'],
  fastapi: ['fastapi', 'starlette', 'pydantic', 'rest api', 'rest apis', 'restful', 'openapi', 'swagger', 'uvicorn'],
  flask: ['flask', 'werkzeug', 'rest api'],
  django: ['django', 'django rest framework', 'drf'],
  postgresql: ['postgresql', 'postgres', 'sql', 'rdbms', 'relational database', 'relational databases', 'psql'],
  sql: ['sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'query optimization', 'indexing', 'acid'],
  redis: ['redis', 'caching', 'in-memory', 'cache', 'key-value store'],
  docker: ['docker', 'docker compose', 'containerization', 'containers', 'dockerfile'],
  pytest: ['pytest', 'unit testing', 'automated testing', 'software testing', 'integration testing', 'tdd', 'test automation'],
  git: ['git', 'github', 'version control', 'git flow'],
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloud'],
  rag: ['rag', 'retrieval-augmented generation', 'retrieval augmented generation', 'langchain', 'langgraph', 'embeddings', 'vector search', 'vector db', 'vector store', 'pgvector', 'chroma', 'faiss', 'llm', 'generative ai', 'genai', 'ai agents'],
  langgraph: ['langgraph', 'langchain', 'ai agents', 'agentic workflows', 'rag', 'llm'],
  airflow: ['airflow', 'apache airflow', 'data pipelines', 'etl', 'elt', 'workflow orchestration', 'data orchestration'],
  dbt: ['dbt', 'data modeling', 'analytics engineering', 'data transformation'],
  linux: ['linux', 'bash', 'shell scripting', 'unix'],
  microservices: ['microservices', 'distributed systems', 'rest apis', 'api design', 'event-driven'],
  kafka: ['kafka', 'apache kafka', 'message queues', 'event streaming', 'pub/sub', 'rabbitmq'],
  dsa: ['dsa', 'data structures', 'algorithms', 'problem solving', 'competitive programming', 'complexity analysis'],
};

export interface RequirementCategorization {
  mandatory: string[];
  preferred: string[];
}

export class MatchingEngine {
  /**
   * Production candidate-job matching, scoring, eligibility, and ranking.
   * Does NOT rely on crude keyword counts alone; evaluates semantic taxonomy,
   * experience tiers, degree criteria, location preferences, and risk factors.
   */
  public static async matchCandidateWithJob(
    candidate: CandidateProfile,
    job: Job,
    persistToFirestore = true
  ): Promise<JobMatch> {
    // 1. Categorize requirements into Mandatory vs Preferred
    const { mandatory, preferred } = this.categorizeRequirements(job);

    // 2. Candidate skill set (normalized)
    const candidateSkillSet = new Set(candidate.skills.map((s) => s.toLowerCase().trim()));
    const candidateProjectText = candidate.projects.map((p) => `${p.name} ${p.description} ${p.technologies.join(' ')}`).join(' ').toLowerCase();

    // 3. Technical Score (30% weight)
    const { technicalScore, matchingSkills, missingSkills, missingMandatory } = this.calculateTechnicalFit(
      candidate,
      candidateSkillSet,
      candidateProjectText,
      mandatory,
      preferred,
      job.requirements
    );

    // 4. Experience Score (20% weight)
    const { experienceScore, experienceRisk } = this.calculateExperienceFit(candidate, job);

    // 5. Role Alignment Score (15% weight)
    const roleScore = this.calculateRoleFit(candidate, job);

    // 6. Education Score (15% weight)
    const { educationScore, educationRisk } = this.calculateEducationFit(candidate, job);

    // 7. Location & Work Mode Score (10% weight)
    const { locationScore, locationRisk } = this.calculateLocationFit(candidate, job);

    // 8. Domain Score (5% weight)
    const domainScore = this.calculateDomainFit(candidate, job);

    // 9. Contextual Keyword & Bullet Match Score (5% weight)
    const keywordScore = this.calculateContextualKeywordFit(candidate, job);

    // 10. Overall 0-100 Weighted Score
    const overallScore = Math.min(
      99,
      Math.max(
        20,
        Math.round(
          technicalScore * 0.30 +
          experienceScore * 0.20 +
          roleScore * 0.15 +
          educationScore * 0.15 +
          locationScore * 0.10 +
          domainScore * 0.05 +
          keywordScore * 0.05
        )
      )
    );

    // 11. Eligibility Classification
    const { eligibility, eligibilityReason } = this.determineEligibility(
      candidate,
      job,
      missingMandatory,
      experienceScore,
      educationScore,
      technicalScore
    );

    // 12. Rejection Risks Compilation
    const rejectionRisks: string[] = [];
    if (experienceRisk) rejectionRisks.push(experienceRisk);
    if (educationRisk) rejectionRisks.push(educationRisk);
    if (locationRisk) rejectionRisks.push(locationRisk);
    if (missingMandatory.length > 0) {
      rejectionRisks.push(`Missing non-negotiable mandatory requirement(s): ${missingMandatory.join(', ')}.`);
    }
    if (job.company.toLowerCase().includes('juspay') || job.company.toLowerCase().includes('cred')) {
      rejectionRisks.push('High-bar competitive coding / DSA assessment round requires rigorous speed and accuracy.');
    }
    if (rejectionRisks.length === 0) {
      rejectionRisks.push('High early-career applicant volume on public listings; direct ATS referral or fast application recommended.');
    }

    // 13. Candidate Advantages for this role
    const advantages: string[] = [];
    if (matchingSkills.some((s) => s.toLowerCase().includes('fastapi'))) {
      advantages.push('Proven hands-on FastAPI asynchronous API microservice implementation in GitHub portfolio.');
    }
    if (matchingSkills.some((s) => s.toLowerCase().includes('rag') || s.toLowerCase().includes('langgraph'))) {
      advantages.push('Distinctive edge with LangGraph agentic RAG and vector database architectures.');
    }
    if (matchingSkills.some((s) => s.toLowerCase().includes('airflow'))) {
      advantages.push('End-to-end data pipeline automation project using Apache Airflow and dbt.');
    }
    if (matchingSkills.some((s) => s.toLowerCase().includes('pytest'))) {
      advantages.push('Automated testing mindset with PyTest test suites and CI/CD automation.');
    }
    if (candidate.graduationYear === 2025 && (job.experienceMin === 0 || job.description.toLowerCase().includes('fresher'))) {
      advantages.push('2025 batch candidate directly eligible for campus/graduate engineer intake programs.');
    }
    if (advantages.length === 0) {
      advantages.push('Solid core Python, SQL, and Git fundamentals for early-career backend engineering.');
    }

    // 14. Interview Likelihood & Explanation
    const { interviewProbability, interviewProbabilityReason } = this.estimateInterviewLikelihood(
      overallScore,
      eligibility,
      missingMandatory,
      matchingSkills,
      advantages
    );

    // 15. Priority Assignment (P0 / P1 / P2 / P3 / IGNORE)
    const priority = this.assignPriority(overallScore, eligibility, interviewProbability, job);

    const match: JobMatch = {
      jobId: job.jobId,
      userId: candidate.userId,
      overallScore,
      technicalScore,
      experienceScore,
      roleScore,
      educationScore,
      locationScore,
      domainScore,
      cloudScore: Math.round((technicalScore + keywordScore) / 2),
      keywordScore,
      eligibility,
      eligibilityReason,
      priority,
      interviewProbability,
      interviewProbabilityReason,
      matchingSkills,
      missingSkills,
      mandatoryGaps: missingMandatory,
      advantages,
      rejectionRisks,
      createdAt: new Date().toISOString(),
    };

    // 16. Persist to Firestore if requested
    if (persistToFirestore) {
      FirestoreService.saveJobMatch(match).catch((err) => {
        console.error('[Firestore Match Sync Error]:', err.message);
      });
    }

    return match;
  }

  /**
   * Categorize requirements into Mandatory vs Preferred
   */
  public static categorizeRequirements(job: Job): RequirementCategorization {
    const mandatory: string[] = [];
    const preferred: string[] = [];

    // Use job's explicit mandatory requirements if populated
    if (job.mandatoryRequirements && job.mandatoryRequirements.length > 0) {
      mandatory.push(...job.mandatoryRequirements);
    }

    // Use job's explicit preferred skills if populated
    if (job.preferredSkills && job.preferredSkills.length > 0) {
      preferred.push(...job.preferredSkills);
    }

    // Parse general requirements if either list is empty
    if (mandatory.length === 0 || preferred.length === 0) {
      for (const req of job.requirements) {
        const lower = req.toLowerCase();
        const isPreferred =
          lower.includes('preferred') ||
          lower.includes('nice to have') ||
          lower.includes('plus') ||
          lower.includes('bonus') ||
          lower.includes('good to have') ||
          lower.includes('exposure to') ||
          lower.includes('familiarity with');

        if (isPreferred) {
          if (!preferred.includes(req)) preferred.push(req);
        } else {
          if (!mandatory.includes(req)) mandatory.push(req);
        }
      }
    }

    // Ensure mandatory has at least core technology if both were empty
    if (mandatory.length === 0 && job.requirements.length > 0) {
      mandatory.push(job.requirements[0]);
      preferred.push(...job.requirements.slice(1));
    }

    return { mandatory, preferred };
  }

  /**
   * Check if a candidate matches a requirement item using ontology synonyms
   */
  public static checkSkillMatch(
    requirement: string,
    candidateSkills: Set<string>,
    candidateProjectText: string
  ): { matched: boolean; matchedTerm?: string } {
    const reqLower = requirement.toLowerCase();

    // Check direct candidate skills
    for (const skill of candidateSkills) {
      if (reqLower.includes(skill) || skill.includes(reqLower)) {
        return { matched: true, matchedTerm: skill };
      }
    }

    // Check synonym clusters
    for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
      const reqMatchesCluster = synonyms.some((syn) => reqLower.includes(syn));
      if (reqMatchesCluster) {
        const candidateHasSkill = synonyms.some((syn) => candidateSkills.has(syn) || candidateProjectText.includes(syn));
        if (candidateHasSkill) {
          return { matched: true, matchedTerm: canonical };
        }
      }
    }

    // Check candidate project description text
    const cleanTokens = reqLower.split(/[\s,/;()]+/).filter((t) => t.length > 2);
    for (const token of cleanTokens) {
      if (candidateProjectText.includes(token)) {
        return { matched: true, matchedTerm: token };
      }
    }

    return { matched: false };
  }

  /**
   * Technical Fit Calculation (30% weight)
   */
  private static calculateTechnicalFit(
    candidate: CandidateProfile,
    candidateSkills: Set<string>,
    candidateProjectText: string,
    mandatoryReqs: string[],
    preferredReqs: string[],
    allReqs: string[]
  ): {
    technicalScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    missingMandatory: string[];
  } {
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    const missingMandatory: string[] = [];

    let mandatoryMatched = 0;
    for (const req of mandatoryReqs) {
      const match = this.checkSkillMatch(req, candidateSkills, candidateProjectText);
      if (match.matched) {
        mandatoryMatched++;
        if (match.matchedTerm && !matchingSkills.includes(match.matchedTerm)) {
          matchingSkills.push(match.matchedTerm);
        }
      } else {
        missingMandatory.push(req);
        missingSkills.push(req);
      }
    }

    let preferredMatched = 0;
    for (const req of preferredReqs) {
      const match = this.checkSkillMatch(req, candidateSkills, candidateProjectText);
      if (match.matched) {
        preferredMatched++;
        if (match.matchedTerm && !matchingSkills.includes(match.matchedTerm)) {
          matchingSkills.push(match.matchedTerm);
        }
      } else {
        if (!missingSkills.includes(req)) missingSkills.push(req);
      }
    }

    // Ensure candidate's primary skills that appear in allReqs are included in matchingSkills
    for (const skill of candidate.skills) {
      const sLower = skill.toLowerCase();
      if (allReqs.some((r) => r.toLowerCase().includes(sLower))) {
        if (!matchingSkills.includes(skill)) matchingSkills.push(skill);
      }
    }

    const mandatoryRatio = mandatoryReqs.length > 0 ? mandatoryMatched / mandatoryReqs.length : 1;
    const preferredRatio = preferredReqs.length > 0 ? preferredMatched / preferredReqs.length : 0.8;

    // Weighted technical score: 70% mandatory coverage + 30% preferred coverage
    const technicalScore = Math.min(100, Math.max(30, Math.round(mandatoryRatio * 75 + preferredRatio * 25)));

    return {
      technicalScore,
      matchingSkills,
      missingSkills,
      missingMandatory,
    };
  }

  /**
   * Experience Fit Calculation (20% weight)
   */
  private static calculateExperienceFit(
    candidate: CandidateProfile,
    job: Job
  ): { experienceScore: number; experienceRisk?: string } {
    const candExp = 0.8; // Candidate is 2025 graduate with practical internship experience
    const min = job.experienceMin ?? 0;
    const max = job.experienceMax ?? 2;

    if (min === 0 && max <= 2) {
      return { experienceScore: 98 };
    }
    if (min <= 1 && max <= 3) {
      return { experienceScore: 90 };
    }
    if (min <= 2 && max <= 4) {
      return {
        experienceScore: 72,
        experienceRisk: `Role asks for ${min}-${max} years experience; candidate is early-career (2025 batch).`,
      };
    }
    if (min >= 3 && min <= 4) {
      return {
        experienceScore: 40,
        experienceRisk: `Role requires minimum ${min} years full-time experience.`,
      };
    }
    if (min >= 5) {
      return {
        experienceScore: 15,
        experienceRisk: `Seniority mismatch: requires ${min}+ years experience.`,
      };
    }

    return { experienceScore: 80 };
  }

  /**
   * Role Alignment Score (15% weight)
   */
  private static calculateRoleFit(candidate: CandidateProfile, job: Job): number {
    const titleLower = job.canonicalTitle.toLowerCase();
    const targetRoles = candidate.targetRoles.map((r) => r.toLowerCase());

    for (const role of targetRoles) {
      if (titleLower.includes(role)) return 96;
      const parts = role.split(' ');
      if (parts.every((p) => titleLower.includes(p))) return 92;
    }

    if (
      titleLower.includes('software engineer') ||
      titleLower.includes('sde') ||
      titleLower.includes('backend') ||
      titleLower.includes('python') ||
      titleLower.includes('developer')
    ) {
      return 88;
    }

    if (titleLower.includes('data engineer') || titleLower.includes('sdet') || titleLower.includes('ai engineer')) {
      return 84;
    }

    return 65;
  }

  /**
   * Education Fit Score (15% weight)
   */
  private static calculateEducationFit(
    candidate: CandidateProfile,
    job: Job
  ): { educationScore: number; educationRisk?: string } {
    const descLower = (job.description + ' ' + job.requirements.join(' ')).toLowerCase();
    const candGradYear = candidate.graduationYear || 2025;

    // Check for explicit older batch requirements
    if (descLower.includes('2022 batch') || descLower.includes('2023 batch only')) {
      return {
        educationScore: 40,
        educationRisk: 'Role explicitly targets 2022/2023 batches rather than 2025 graduates.',
      };
    }

    // Check for higher degrees
    if (descLower.includes('phd required') || descLower.includes('doctorate')) {
      return {
        educationScore: 30,
        educationRisk: 'Requires PhD or Doctorate degree.',
      };
    }

    // Standard B.Tech / BE / Computer Science requirement
    if (
      descLower.includes('b.tech') ||
      descLower.includes('be in') ||
      descLower.includes('computer science') ||
      descLower.includes('engineering degree') ||
      descLower.includes('bachelor') ||
      descLower.includes('2024') ||
      descLower.includes('2025')
    ) {
      return { educationScore: 98 };
    }

    return { educationScore: 90 };
  }

  /**
   * Location & Work Mode Fit Score (10% weight)
   */
  private static calculateLocationFit(
    candidate: CandidateProfile,
    job: Job
  ): { locationScore: number; locationRisk?: string } {
    if (job.workMode === 'Remote') {
      return { locationScore: 100 };
    }

    const jobLoc = job.location.toLowerCase();
    const candidateTargetLocs = candidate.targetLocations.map((l) => l.toLowerCase());

    const matchesTargetCity = candidateTargetLocs.some((city) => jobLoc.includes(city));
    if (matchesTargetCity) {
      return { locationScore: 95 };
    }

    // India location with open relocation
    if (jobLoc.includes('india') || candidate.relocationPreference === 'Open to Relocate') {
      return {
        locationScore: 82,
        locationRisk: `On-site/Hybrid in ${job.location}; relocation required.`,
      };
    }

    return {
      locationScore: 60,
      locationRisk: `Location ${job.location} is outside candidate primary target areas.`,
    };
  }

  /**
   * Domain Fit Score (5% weight)
   */
  private static calculateDomainFit(candidate: CandidateProfile, job: Job): number {
    const descLower = job.description.toLowerCase();
    const compLower = job.company.toLowerCase();

    // High synergy tech domains matching candidate projects
    if (
      descLower.includes('api') ||
      descLower.includes('platform') ||
      descLower.includes('developer tools') ||
      descLower.includes('genai') ||
      descLower.includes('llm') ||
      descLower.includes('pipeline') ||
      compLower.includes('postman') ||
      compLower.includes('browserstack') ||
      compLower.includes('swiggy')
    ) {
      return 95;
    }

    if (descLower.includes('payments') || descLower.includes('fintech') || compLower.includes('razorpay') || compLower.includes('phonepe')) {
      return 90;
    }

    return 80;
  }

  /**
   * Contextual Keyword Fit Score (5% weight)
   */
  private static calculateContextualKeywordFit(candidate: CandidateProfile, job: Job): number {
    const candidateTokens = new Set([
      ...candidate.skills.map((s) => s.toLowerCase()),
      'fastapi', 'python', 'sql', 'postgres', 'docker', 'pytest', 'rag', 'langgraph', 'airflow', 'rest', 'api'
    ]);

    const reqText = job.requirements.join(' ').toLowerCase();
    let hits = 0;
    for (const token of candidateTokens) {
      if (reqText.includes(token)) hits++;
    }

    const ratio = Math.min(1, hits / 6);
    return Math.round(70 + ratio * 28);
  }

  /**
   * Determine Eligibility
   */
  private static determineEligibility(
    candidate: CandidateProfile,
    job: Job,
    missingMandatory: string[],
    experienceScore: number,
    educationScore: number,
    technicalScore: number
  ): { eligibility: EligibilityStatus; reason: string } {
    // Hard Disqualification: Closed or expired
    if (job.status === 'CLOSED' || job.status === 'EXPIRED') {
      return {
        eligibility: 'NOT_ELIGIBLE',
        reason: 'Job posting is confirmed closed or has expired on company career portal.',
      };
    }

    // Hard Disqualification: Seniority / Experience >= 4 years
    if (job.experienceMin >= 4) {
      return {
        eligibility: 'NOT_ELIGIBLE',
        reason: `Position requires minimum ${job.experienceMin} years experience (Senior/Lead level), exceeding candidate 0-2y tier.`,
      };
    }

    // Hard Disqualification: Missing non-negotiable mandatory skills
    if (missingMandatory.length >= 2 && technicalScore < 50) {
      return {
        eligibility: 'NOT_ELIGIBLE',
        reason: `Missing critical mandatory tech requirements: ${missingMandatory.join(', ')}.`,
      };
    }

    // Borderline Cases
    if (job.experienceMin >= 2 && job.experienceMax >= 4) {
      return {
        eligibility: 'BORDERLINE',
        reason: 'Requires 2-4 years experience; candidate is a 2025 graduate with internship experience.',
      };
    }

    if (missingMandatory.length === 1 && technicalScore < 70) {
      return {
        eligibility: 'BORDERLINE',
        reason: `Candidate meets most requirements but is missing: ${missingMandatory[0]}.`,
      };
    }

    // Likely Eligible
    if (technicalScore >= 65 && experienceScore >= 70 && missingMandatory.length <= 1) {
      if (missingMandatory.length === 1) {
        return {
          eligibility: 'LIKELY_ELIGIBLE',
          reason: 'Meets primary technical competencies and graduate criteria; minor experience or stack variance.',
        };
      }
    }

    // Fully Eligible
    return {
      eligibility: 'ELIGIBLE',
      reason: 'Satisfies B.Tech 2025 graduate criteria, early-career experience tier (0-2y), and primary technical competencies.',
    };
  }

  /**
   * Estimate Interview Likelihood as HIGH / MEDIUM / LOW with explanation
   */
  private static estimateInterviewLikelihood(
    overallScore: number,
    eligibility: EligibilityStatus,
    missingMandatory: string[],
    matchingSkills: string[],
    advantages: string[]
  ): { interviewProbability: InterviewProbability; interviewProbabilityReason: string } {
    if (eligibility === 'NOT_ELIGIBLE' || overallScore < 55) {
      return {
        interviewProbability: 'LOW',
        interviewProbabilityReason: 'Low profile alignment with role seniority or mandatory skill prerequisites.',
      };
    }

    if (overallScore >= 85 && eligibility === 'ELIGIBLE' && missingMandatory.length === 0) {
      return {
        interviewProbability: 'HIGH',
        interviewProbabilityReason: `Strong alignment (${matchingSkills.slice(0, 4).join(', ')}). ${advantages[0] || 'Direct early-career project relevance.'}`,
      };
    }

    if (overallScore >= 70 && (eligibility === 'ELIGIBLE' || eligibility === 'LIKELY_ELIGIBLE')) {
      return {
        interviewProbability: 'MEDIUM',
        interviewProbabilityReason: 'Good baseline skills match; competitive application volume requires tailoring resume summary to highlight relevant project metrics.',
      };
    }

    return {
      interviewProbability: 'LOW',
      interviewProbabilityReason: 'Partial match with missing mandatory competencies or competitive experience threshold.',
    };
  }

  /**
   * Priority assignment: P0 / P1 / P2 / P3 / IGNORE
   */
  private static assignPriority(
    overallScore: number,
    eligibility: EligibilityStatus,
    interviewProbability: InterviewProbability,
    job: Job
  ): PriorityLevel {
    if (eligibility === 'NOT_ELIGIBLE') {
      return 'IGNORE';
    }

    const isVerified = job.verified || job.verificationStatus === 'VERIFIED';
    const isDirectATS =
      job.applicationPlatform === 'Greenhouse' ||
      job.applicationPlatform === 'Lever' ||
      job.applicationPlatform === 'Ashby' ||
      job.sources.some((s) => s.sourceType === 'official_ats' || s.sourceType === 'official_careers');

    if (overallScore >= 85 && eligibility === 'ELIGIBLE' && interviewProbability === 'HIGH' && isVerified && isDirectATS) {
      return 'P0';
    }

    if (overallScore >= 75 && (eligibility === 'ELIGIBLE' || eligibility === 'LIKELY_ELIGIBLE')) {
      return 'P1';
    }

    if (overallScore >= 60 && eligibility !== 'NOT_ELIGIBLE') {
      return 'P2';
    }

    if (overallScore < 60 || eligibility === 'BORDERLINE') {
      return 'P3';
    }

    return 'IGNORE';
  }
}
