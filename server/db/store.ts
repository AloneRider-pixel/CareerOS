import fs from 'fs';
import path from 'path';
import {
  CandidateProfile,
  Job,
  JobMatch,
  Application,
  ResumeVersion,
  SearchRun,
  SkillGap,
  CompanyIntelligence,
  DashboardStats,
  NetworkContact,
} from '../../src/types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  candidateProfile: CandidateProfile;
  jobs: Job[];
  applications: Application[];
  resumeVersions: ResumeVersion[];
  searchRuns: SearchRun[];
  skillGaps: SkillGap[];
  companies: CompanyIntelligence[];
  networkContacts?: NetworkContact[];
  settings: {
    theme: 'dark' | 'light';
    notificationsEnabled: boolean;
    autoVerifyGrounding: boolean;
    minMatchThreshold: number;
    emailAlerts: boolean;
  };
}

export const DEFAULT_CANDIDATE: CandidateProfile = {
  userId: 'user_himanshu_2025',
  name: 'Himanshu Bisht',
  email: 'bihimanshu21@gmail.com',
  phone: '+91 98765 43210',
  summary:
    'Early-career Software Engineer (B.Tech CSE 2025, Graphic Era Hill University) specializing in Python, FastAPI backend services, scalable REST APIs, and production LLM/RAG pipelines. Strong foundations in SQL, PostgreSQL, automated testing with PyTest, Docker containerization, and AWS cloud deployments.',
  careerLevel: 'Early-career Software Engineer / Fresher',
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      field: 'Computer Science',
      institution: 'Graphic Era Hill University',
      graduationYear: 2025,
      score: '8.4 CGPA',
    },
  ],
  location: 'Dehradun / India',
  relocationPreference: 'Open to relocate anywhere in India (Bengaluru, Hyderabad, Pune, Gurugram, Noida, Mumbai, etc.)',
  workModes: ['Remote', 'Hybrid', 'On-site'],
  targetRoles: [
    'Software Engineer',
    'Software Development Engineer',
    'SDE I',
    'Associate Software Engineer',
    'Graduate Software Engineer',
    'Junior Software Engineer',
    'Backend Engineer',
    'Backend Developer',
    'Python Developer',
    'Python Software Engineer',
    'FastAPI Developer',
    'API Developer',
    'AI Engineer',
    'Generative AI Engineer',
    'LLM Engineer',
    'AI/ML Engineer',
    'Data Engineer',
    'Junior Data Engineer',
    'Analytics Engineer',
    'Cloud Engineer',
    'Platform Engineer',
    'QA Automation Engineer',
    'SDET',
    'Test Automation Engineer',
  ],
  targetLocations: [
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Gurugram',
    'Noida',
    'Delhi NCR',
    'Mumbai',
    'Chennai',
    'Remote India',
    'Hybrid India',
  ],
  primarySkills: [
    'Python',
    'SQL',
    'PostgreSQL',
    'FastAPI',
    'REST APIs',
    'PyTest',
    'Test Automation',
    'Software Testing',
    'Docker',
    'AWS',
    'Git',
    'GitHub',
    'Linux',
  ],
  aiSkills: [
    'LLM applications',
    'RAG',
    'LangGraph',
    'AI agents',
    'Agentic workflows',
    'OpenAI APIs',
    'AI automation',
    'Prompt engineering',
  ],
  dataSkills: [
    'ETL',
    'ELT',
    'Apache Airflow',
    'dbt',
    'Snowflake',
    'Data validation',
    'Data transformation',
    'Data pipelines',
    'Batch processing',
    'API ingestion',
  ],
  cloudSkills: [
    'AWS EC2',
    'AWS S3',
    'AWS Lambda',
    'AWS API Gateway',
    'Docker',
    'CI/CD',
    'GitHub Actions',
  ],
  familiarSkills: [
    'Java',
    'JavaScript',
    'React',
    'TypeScript',
    'Node.js',
    'Flask',
    'Spring Boot',
    'HTML',
    'CSS',
  ],
  allSkills: [
    'Python',
    'SQL',
    'PostgreSQL',
    'FastAPI',
    'REST APIs',
    'PyTest',
    'Test Automation',
    'Software Testing',
    'Docker',
    'AWS',
    'Git',
    'GitHub',
    'Linux',
    'LLM applications',
    'RAG',
    'LangGraph',
    'AI agents',
    'Agentic workflows',
    'OpenAI APIs',
    'AI automation',
    'Prompt engineering',
    'ETL',
    'ELT',
    'Apache Airflow',
    'dbt',
    'Snowflake',
    'Data validation',
    'Data transformation',
    'Data pipelines',
    'Batch processing',
    'API ingestion',
    'AWS EC2',
    'AWS S3',
    'AWS Lambda',
    'AWS API Gateway',
    'CI/CD',
    'GitHub Actions',
    'Java',
    'JavaScript',
    'React',
    'TypeScript',
    'Node.js',
    'Flask',
    'Spring Boot',
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Backend & Automation Engineering Intern',
      company: 'TechFlow Systems',
      location: 'Remote',
      startDate: '2024-06',
      endDate: '2024-12',
      current: false,
      description: [
        'Developed modular REST microservices using FastAPI and PostgreSQL handling 50,000+ daily requests.',
        'Authored 120+ comprehensive automated unit and integration tests using PyTest, achieving 94% test suite coverage.',
        'Containerized services with Docker and setup CI/CD pipelines via GitHub Actions, reducing deployment time by 40%.',
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'PyTest', 'Docker', 'GitHub Actions'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Agentic RAG Knowledge Assistant',
      description: [
        'Constructed multi-document semantic search engine combining LangGraph, vector embeddings, and FastAPI backend.',
        'Implemented hybrid lexical and semantic search with re-ranking, boosting retrieval relevance by 35%.',
        'Deployed containerized backend on AWS EC2 with automated Docker Compose orchestration.',
      ],
      technologies: ['Python', 'FastAPI', 'LangGraph', 'RAG', 'PostgreSQL', 'Docker', 'AWS'],
      github: 'https://github.com/himanshu-bisht/rag-agent-os',
    },
    {
      id: 'proj-2',
      title: 'Automated Data Pipeline & Validation Framework',
      description: [
        'Built scalable batch ETL ingestion pipeline using Python, Apache Airflow, and dbt to process structured telemetric records.',
        'Implemented schema drift detection and automated data quality checks saving 10+ hours of manual debugging weekly.',
      ],
      technologies: ['Python', 'Airflow', 'dbt', 'SQL', 'PostgreSQL', 'Docker'],
      github: 'https://github.com/himanshu-bisht/data-pipeline-framework',
    },
    {
      id: 'proj-3',
      title: 'FastAPI Microservices Testing Suite',
      description: [
        'Built full-coverage automated test suite covering auth, business logic, and API contracts with PyTest and Faker.',
        'Created mock database fixtures with Dockerized PostgreSQL testing containers.',
      ],
      technologies: ['Python', 'FastAPI', 'PyTest', 'PostgreSQL', 'Docker', 'CI/CD'],
      github: 'https://github.com/himanshu-bisht/fastapi-test-suite',
    },
  ],
  certifications: [
    'AWS Certified Cloud Practitioner',
    'PostgreSQL Advanced Database Design (Coursera)',
    'DeepLearning.AI: Generative AI with LLMs',
  ],
  links: {
    github: 'https://github.com/himanshu-bisht',
    linkedin: 'https://linkedin.com/in/himanshu-bisht-dev',
    portfolio: 'https://himanshubisht.dev',
  },
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_JOBS: Job[] = [
  {
    jobId: 'job_razorpay_sde1_py',
    canonicalTitle: 'Software Development Engineer I (Backend - Python)',
    originalTitle: 'SDE 1 - Backend (Python / FastAPI)',
    company: 'Razorpay',
    companyId: 'comp_razorpay',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    description:
      'Razorpay is seeking an SDE 1 for the core payments platform. You will build and scale high-throughput REST APIs, write bulletproof asynchronous batch workers, and collaborate with product teams on payment integrations across India.',
    requirements: [
      'Strong problem-solving skills in Python or Go',
      'Solid understanding of relational databases (PostgreSQL or MySQL) and query optimization',
      'Hands-on experience with FastAPI, Flask, or Django',
      'Familiarity with Docker and microservices architecture',
      'Dedication to automated testing (PyTest) and clean code',
    ],
    mandatoryRequirements: [
      'B.Tech / B.E. in Computer Science, IT, or related degree (2024 or 2025 graduates welcome)',
      '0-2 years of software engineering experience or relevant internships',
      'Strong foundational knowledge of Data Structures and Algorithms',
    ],
    preferredSkills: ['FastAPI', 'PostgreSQL', 'AWS', 'Docker', 'Redis', 'PyTest'],
    experienceMin: 0,
    experienceMax: 2,
    salary: '₹14,00,000 - ₹20,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-09-28',
    status: 'ACTIVE',
    officialUrl: 'https://razorpay.com/jobs/sde1-backend-python',
    applicationUrl: 'https://boards.greenhouse.io/razorpay/jobs/6291823002',
    canonicalUrl: 'https://razorpay.com/jobs/sde1-backend-python',
    sources: [
      {
        name: 'Razorpay Careers (Greenhouse ATS)',
        url: 'https://boards.greenhouse.io/razorpay/jobs/6291823002',
        discoveredAt: '2026-09-28T09:15:00Z',
        sourceType: 'official_ats',
      },
      {
        name: 'LinkedIn Jobs India',
        url: 'https://www.linkedin.com/jobs/view/4028192019',
        discoveredAt: '2026-09-28T10:00:00Z',
        sourceType: 'job_portal',
      },
      {
        name: 'Naukri.com',
        url: 'https://www.naukri.com/job-listings-sde1-razorpay-bangalore-0-to-2-years',
        discoveredAt: '2026-09-28T11:20:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 3,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 96,
    verificationNotes: 'Direct Greenhouse ATS listing verified active and accepting applications.',
    riskLevel: 'LOW',
    applicationComplexity: 'LOW',
    applicationPlatform: 'Greenhouse',
    easyApply: false,
    loginRequired: false,
    createdAt: '2026-09-28T09:15:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_razorpay_sde1_py',
      userId: 'user_himanshu_2025',
      overallScore: 94,
      technicalScore: 96,
      experienceScore: 95,
      roleScore: 95,
      educationScore: 95,
      locationScore: 90,
      domainScore: 90,
      cloudScore: 90,
      keywordScore: 94,
      eligibility: 'ELIGIBLE',
      eligibilityReason: '2025 B.Tech CSE degree + hands-on Python/FastAPI/PostgreSQL aligns with SDE 1 requirements.',
      priority: 'P0',
      interviewProbability: 'HIGH',
      interviewProbabilityReason: 'Top-tier fit on core backend stack (Python, FastAPI, SQL, Docker, PyTest). Direct official ATS link.',
      matchingSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs', 'PyTest', 'Git', 'Linux'],
      missingSkills: ['Redis'],
      mandatoryGaps: [],
      advantages: [
        'Proven FastAPI REST microservices architecture',
        'Strong automated testing background with PyTest and Docker',
        '2025 CSE graduate directly eligible for Fresher/SDE 1 cohort',
      ],
      rejectionRisks: ['High applicant volume; early submission via official ATS advised'],
      createdAt: '2026-09-28T09:20:00Z',
    },
  },
  {
    jobId: 'job_swiggy_ai_eng_1',
    canonicalTitle: 'AI / Generative AI Engineer (Associate / SDE 1)',
    originalTitle: 'Associate Software Engineer - GenAI & Agents',
    company: 'Swiggy',
    companyId: 'comp_swiggy',
    location: 'Bengaluru, Karnataka / Remote Friendly',
    workMode: 'Hybrid',
    description:
      'Swiggy is building conversational commerce and intelligent AI assistants. We are looking for an early-career AI engineer who understands LLM orchestration, RAG architectures, prompt pipelines, and Python backend services.',
    requirements: [
      'Hands-on experience with LLM APIs, prompt engineering, and RAG architectures',
      'Proficiency in Python and backend frameworks like FastAPI',
      'Experience with vector databases and embeddings',
      'Understanding of agentic workflows (LangGraph, LangChain, or custom agents)',
      'Knowledge of cloud services (AWS EC2, Lambda) and Docker',
    ],
    mandatoryRequirements: [
      'B.Tech in Computer Science or related degree (2024 or 2025 batch)',
      '0-2 years of relevant experience in software development or AI projects',
      'Working knowledge of REST APIs and Git',
    ],
    preferredSkills: ['LangGraph', 'RAG', 'FastAPI', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
    experienceMin: 0,
    experienceMax: 2,
    salary: '₹12,00,000 - ₹18,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-09-30',
    status: 'ACTIVE',
    officialUrl: 'https://careers.swiggy.com/jobs/associate-genai-engineer',
    applicationUrl: 'https://swiggy.darwinbox.in/ms/candidate/careers/req_ai_associate_2026',
    canonicalUrl: 'https://careers.swiggy.com/jobs/associate-genai-engineer',
    sources: [
      {
        name: 'Swiggy Careers Portal',
        url: 'https://careers.swiggy.com/jobs/associate-genai-engineer',
        discoveredAt: '2026-09-30T08:00:00Z',
        sourceType: 'official_careers',
      },
      {
        name: 'Instahyre India',
        url: 'https://www.instahyre.com/job-291823-swiggy-ai-engineer-bangalore',
        discoveredAt: '2026-09-30T10:15:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 2,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 94,
    verificationNotes: 'Active role on Swiggy career portal confirmed with direct Darwinbox application link.',
    riskLevel: 'LOW',
    applicationComplexity: 'LOW',
    applicationPlatform: 'Other',
    easyApply: false,
    loginRequired: true,
    createdAt: '2026-09-30T08:00:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_swiggy_ai_eng_1',
      userId: 'user_himanshu_2025',
      overallScore: 96,
      technicalScore: 98,
      experienceScore: 95,
      roleScore: 96,
      educationScore: 95,
      locationScore: 95,
      domainScore: 98,
      cloudScore: 90,
      keywordScore: 96,
      eligibility: 'ELIGIBLE',
      eligibilityReason: 'Exceptional alignment with candidate personal projects in RAG and LangGraph.',
      priority: 'P0',
      interviewProbability: 'HIGH',
      interviewProbabilityReason: 'Rare combination of production Python/FastAPI backend skills with LangGraph agent experience at 0-2 year seniority.',
      matchingSkills: [
        'Python',
        'FastAPI',
        'RAG',
        'LangGraph',
        'AI agents',
        'OpenAI APIs',
        'PostgreSQL',
        'Docker',
        'AWS',
      ],
      missingSkills: [],
      mandatoryGaps: [],
      advantages: [
        'Direct project experience building Agentic RAG Knowledge Assistant with LangGraph',
        'FastAPI backend expertise for serving inference endpoints',
        'Fresh 2025 graduate matching the Associate / SDE 1 target',
      ],
      rejectionRisks: ['Verify enterprise scale understanding during technical rounds'],
      createdAt: '2026-09-30T08:10:00Z',
    },
  },
  {
    jobId: 'job_postman_junior_be',
    canonicalTitle: 'Associate Software Engineer - Backend',
    originalTitle: 'Associate Software Engineer - Backend (Python / Node.js)',
    company: 'Postman',
    companyId: 'comp_postman',
    location: 'Bengaluru, Karnataka / Remote India',
    workMode: 'Remote',
    description:
      'Join Postmans developer experience engineering group. Build and maintain API infrastructure, automated testing platforms, and developer tooling serving 30M+ developers globally.',
    requirements: [
      'Strong proficiency in Python or TypeScript/Node.js',
      'Solid comprehension of REST API principles and HTTP protocol',
      'Experience with SQL databases and relational modeling',
      'Keen interest in developer tooling, test automation, and CI/CD',
      'Familiarity with AWS services and Docker containers',
    ],
    mandatoryRequirements: [
      'B.Tech / BE in Computer Science, Software Engineering, or equivalent',
      '0-1 year of professional experience or strong internship track record',
      'Clear technical communication skills',
    ],
    preferredSkills: ['Python', 'REST APIs', 'Docker', 'AWS', 'PyTest', 'Git', 'Linux'],
    experienceMin: 0,
    experienceMax: 1,
    salary: '₹12,00,000 - ₹16,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-10-01',
    status: 'ACTIVE',
    officialUrl: 'https://www.postman.com/company/careers/open-roles/associate-software-engineer-backend',
    applicationUrl: 'https://jobs.ashbyhq.com/postman/849102-associate-swe-backend',
    canonicalUrl: 'https://www.postman.com/company/careers/open-roles/associate-software-engineer-backend',
    sources: [
      {
        name: 'Postman Ashby Careers',
        url: 'https://jobs.ashbyhq.com/postman/849102-associate-swe-backend',
        discoveredAt: '2026-10-01T11:00:00Z',
        sourceType: 'official_ats',
      },
      {
        name: 'LinkedIn Jobs India',
        url: 'https://www.linkedin.com/jobs/view/4029412918',
        discoveredAt: '2026-10-01T12:30:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 2,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 98,
    verificationNotes: 'Official Ashby ATS posting confirmed active and accepts direct 1-click submission.',
    riskLevel: 'LOW',
    applicationComplexity: 'LOW',
    applicationPlatform: 'Ashby',
    easyApply: true,
    loginRequired: false,
    createdAt: '2026-10-01T11:00:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_postman_junior_be',
      userId: 'user_himanshu_2025',
      overallScore: 92,
      technicalScore: 94,
      experienceScore: 95,
      roleScore: 92,
      educationScore: 95,
      locationScore: 95,
      domainScore: 90,
      cloudScore: 90,
      keywordScore: 92,
      eligibility: 'ELIGIBLE',
      eligibilityReason: 'Targeted directly at 0-1 year experience candidates; remote friendly.',
      priority: 'P0',
      interviewProbability: 'HIGH',
      interviewProbabilityReason: 'Candidate project portfolio focuses heavily on API design, automated testing, and developer tooling.',
      matchingSkills: ['Python', 'REST APIs', 'PostgreSQL', 'SQL', 'PyTest', 'Docker', 'AWS', 'Git', 'Linux'],
      missingSkills: [],
      mandatoryGaps: [],
      advantages: [
        'Deep focus on REST API contracts and automated test suite design',
        'Direct Ashby ATS application with low friction',
        'Remote India flexibility',
      ],
      rejectionRisks: ['Ensure familiarity with TypeScript/Node.js is highlighted alongside Python'],
      createdAt: '2026-10-01T11:15:00Z',
    },
  },
  {
    jobId: 'job_phonepe_de_1',
    canonicalTitle: 'Data Engineer I / Associate Data Engineer',
    originalTitle: 'Associate Data Engineer - Big Data & Pipelines',
    company: 'PhonePe',
    companyId: 'comp_phonepe',
    location: 'Pune / Bengaluru',
    workMode: 'Hybrid',
    description:
      'PhonePe is looking for an Associate Data Engineer to build reliable batch and streaming data pipelines. You will write data ingestion jobs in Python, work with Airflow, optimize SQL queries on analytical data stores, and ensure data validation across millions of daily transactions.',
    requirements: [
      'Strong programming proficiency in Python and advanced SQL',
      'Hands-on experience with workflow orchestration (Apache Airflow or similar)',
      'Understanding of data modeling, schema design, and ELT/ETL architectures',
      'Knowledge of data warehouse concepts (Snowflake, BigQuery, or Redshift)',
      'Exposure to Docker and Linux environments',
    ],
    mandatoryRequirements: [
      'B.Tech / BE in CSE, IT, Data Science or related stream',
      '0-2 years experience in data engineering, data pipelines, or backend',
      'Clear grasp of relational databases and batch transformation',
    ],
    preferredSkills: ['Python', 'SQL', 'Apache Airflow', 'dbt', 'Snowflake', 'PostgreSQL', 'Docker'],
    experienceMin: 0,
    experienceMax: 2,
    salary: '₹10,00,000 - ₹15,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-10-02',
    status: 'ACTIVE',
    officialUrl: 'https://phonepe.com/careers/associate-data-engineer',
    applicationUrl: 'https://phonepe.wd3.myworkdayjobs.com/PhonePe_Careers/job/Associate-Data-Engineer_R-2026-4412',
    canonicalUrl: 'https://phonepe.com/careers/associate-data-engineer',
    sources: [
      {
        name: 'PhonePe Workday ATS',
        url: 'https://phonepe.wd3.myworkdayjobs.com/PhonePe_Careers/job/Associate-Data-Engineer_R-2026-4412',
        discoveredAt: '2026-10-02T09:00:00Z',
        sourceType: 'official_ats',
      },
      {
        name: 'Naukri.com',
        url: 'https://www.naukri.com/job-listings-phonepe-associate-data-engineer-pune-0-to-2-years',
        discoveredAt: '2026-10-02T10:00:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 2,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 95,
    verificationNotes: 'Verified official Workday ATS job opening with active requisition number.',
    riskLevel: 'LOW',
    applicationComplexity: 'MEDIUM',
    applicationPlatform: 'Workday',
    easyApply: false,
    loginRequired: true,
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_phonepe_de_1',
      userId: 'user_himanshu_2025',
      overallScore: 89,
      technicalScore: 92,
      experienceScore: 90,
      roleScore: 88,
      educationScore: 95,
      locationScore: 90,
      domainScore: 92,
      cloudScore: 85,
      keywordScore: 90,
      eligibility: 'ELIGIBLE',
      eligibilityReason: 'Candidate matches Python, SQL, Airflow, and dbt skill requirements.',
      priority: 'P1',
      interviewProbability: 'HIGH',
      interviewProbabilityReason: 'Concrete portfolio project in Airflow + dbt batch pipeline mirrors job responsibilities directly.',
      matchingSkills: ['Python', 'SQL', 'PostgreSQL', 'Apache Airflow', 'dbt', 'Snowflake', 'Data validation', 'Docker', 'Linux'],
      missingSkills: ['Kafka', 'Spark'],
      mandatoryGaps: [],
      advantages: [
        'Dedicated project in automated Airflow data pipelines and schema drift validation',
        'Strong SQL and data transformation background',
      ],
      rejectionRisks: ['PhonePe Workday ATS requires account creation and structured profile entry'],
      createdAt: '2026-10-02T09:15:00Z',
    },
  },
  {
    jobId: 'job_browserstack_sdet_1',
    canonicalTitle: 'Software Development Engineer in Test (SDET I)',
    originalTitle: 'SDET I - Test Automation (Python / API Testing)',
    company: 'BrowserStack',
    companyId: 'comp_browserstack',
    location: 'Mumbai / Remote India',
    workMode: 'Remote',
    description:
      'BrowserStack is seeking an SDET I to build test automation frameworks, API validation testbeds, and CI/CD test runners for our cloud testing infrastructure. You will write robust Python automation scripts and ensure zero regressions across releases.',
    requirements: [
      'Strong programming skills in Python with focus on test frameworks (PyTest, Unittest)',
      'Experience in automated REST API testing and contract validation',
      'Good understanding of Docker, Linux, and CI/CD automation (GitHub Actions or Jenkins)',
      'Solid debugging and exploratory testing mindset',
      'Knowledge of SQL and test database setups',
    ],
    mandatoryRequirements: [
      'B.Tech / BE in Computer Science, IT or related field (2024 or 2025 batch)',
      '0-2 years experience in software testing, QA automation, or backend development',
      'Good understanding of software development lifecycles',
    ],
    preferredSkills: ['Python', 'PyTest', 'Test Automation', 'Docker', 'REST APIs', 'Git', 'Linux'],
    experienceMin: 0,
    experienceMax: 2,
    salary: '₹10,00,000 - ₹15,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-10-03',
    status: 'ACTIVE',
    officialUrl: 'https://www.browserstack.com/careers/sdet-1-python',
    applicationUrl: 'https://jobs.lever.co/browserstack/491029-sdet-1-python',
    canonicalUrl: 'https://www.browserstack.com/careers/sdet-1-python',
    sources: [
      {
        name: 'BrowserStack Lever ATS',
        url: 'https://jobs.lever.co/browserstack/491029-sdet-1-python',
        discoveredAt: '2026-10-03T10:00:00Z',
        sourceType: 'official_ats',
      },
      {
        name: 'Indeed India',
        url: 'https://in.indeed.com/viewjob?jk=browserstack_sdet_py_mumbai',
        discoveredAt: '2026-10-03T12:00:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 2,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 97,
    verificationNotes: 'Official Lever ATS posting verified active and accepting candidate applications.',
    riskLevel: 'LOW',
    applicationComplexity: 'LOW',
    applicationPlatform: 'Lever',
    easyApply: true,
    loginRequired: false,
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_browserstack_sdet_1',
      userId: 'user_himanshu_2025',
      overallScore: 93,
      technicalScore: 96,
      experienceScore: 95,
      roleScore: 94,
      educationScore: 95,
      locationScore: 95,
      domainScore: 92,
      cloudScore: 90,
      keywordScore: 94,
      eligibility: 'ELIGIBLE',
      eligibilityReason: 'PyTest and API test automation skills match 100% with SDET 1 profile.',
      priority: 'P0',
      interviewProbability: 'HIGH',
      interviewProbabilityReason: 'PyTest, FastAPI microservice testing, and GitHub Actions CI/CD make candidate an ideal SDET 1 match.',
      matchingSkills: ['Python', 'PyTest', 'Test Automation', 'Software Testing', 'REST APIs', 'Docker', 'Git', 'GitHub', 'Linux'],
      missingSkills: ['Selenium'],
      mandatoryGaps: [],
      advantages: [
        'Created custom automated test suite for FastAPI microservices',
        'Lever ATS quick 1-page form allows immediate application',
        'Full remote work authorization across India',
      ],
      rejectionRisks: ['Mention UI test automation willingness alongside backend API automation'],
      createdAt: '2026-10-03T10:15:00Z',
    },
  },
  {
    jobId: 'job_fractal_ai_dev',
    canonicalTitle: 'Junior AI Engineer / GenAI Developer',
    originalTitle: 'AI Engineer I - LLM Solutions',
    company: 'Fractal Analytics',
    companyId: 'comp_fractal',
    location: 'Gurugram / Bengaluru / Mumbai',
    workMode: 'Hybrid',
    description:
      'Fractal is hiring early-career AI Engineers to join our Enterprise GenAI practice. Build retrieval-augmented generation pipelines, fine-tune open-source models, construct evaluation harnesses, and integrate agentic workflows with enterprise APIs.',
    requirements: [
      'Strong programming in Python and modern libraries',
      'Hands-on experience with LLMs, RAG, prompt engineering, and embeddings',
      'Knowledge of vector stores (pgvector, Chroma, FAISS)',
      'Understanding of API frameworks (FastAPI or Flask)',
      'Familiarity with cloud platforms (AWS or Azure)',
    ],
    mandatoryRequirements: [
      'B.Tech / BE in Computer Science, Data Science, or related engineering discipline (2024 or 2025 graduates)',
      '0-2 years experience with demonstrable AI / LLM projects on GitHub',
    ],
    preferredSkills: ['Python', 'FastAPI', 'RAG', 'LangGraph', 'AI agents', 'PostgreSQL', 'Docker', 'AWS'],
    experienceMin: 0,
    experienceMax: 2,
    salary: '₹9,00,000 - ₹14,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-10-04',
    status: 'ACTIVE',
    officialUrl: 'https://fractal.ai/careers/ai-engineer-llm',
    applicationUrl: 'https://fractal.darwinbox.in/ms/candidate/careers/req_fractal_ai_2026',
    canonicalUrl: 'https://fractal.ai/careers/ai-engineer-llm',
    sources: [
      {
        name: 'Fractal Careers Portal',
        url: 'https://fractal.ai/careers/ai-engineer-llm',
        discoveredAt: '2026-10-04T07:30:00Z',
        sourceType: 'official_careers',
      },
      {
        name: 'LinkedIn Jobs India',
        url: 'https://www.linkedin.com/jobs/view/4030192819',
        discoveredAt: '2026-10-04T09:00:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 2,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 93,
    verificationNotes: 'Verified fresh opening on Fractal Analytics careers hub.',
    riskLevel: 'LOW',
    applicationComplexity: 'LOW',
    applicationPlatform: 'Other',
    easyApply: false,
    loginRequired: false,
    createdAt: '2026-10-04T07:30:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_fractal_ai_dev',
      userId: 'user_himanshu_2025',
      overallScore: 95,
      technicalScore: 96,
      experienceScore: 95,
      roleScore: 95,
      educationScore: 95,
      locationScore: 90,
      domainScore: 96,
      cloudScore: 90,
      keywordScore: 95,
      eligibility: 'ELIGIBLE',
      eligibilityReason: 'Candidate 2025 graduation year and RAG/LangGraph portfolio match requirements.',
      priority: 'P0',
      interviewProbability: 'HIGH',
      interviewProbabilityReason: 'Active GitHub repository with Agentic RAG Knowledge Assistant gives immediate credibility.',
      matchingSkills: ['Python', 'FastAPI', 'RAG', 'LangGraph', 'AI agents', 'OpenAI APIs', 'PostgreSQL', 'Docker', 'AWS'],
      missingSkills: ['Azure'],
      mandatoryGaps: [],
      advantages: [
        'Production LangGraph agentic implementation with vector search in GitHub',
        'FastAPI API server expertise',
      ],
      rejectionRisks: ['Be prepared to explain token cost optimization and evaluation metrics'],
      createdAt: '2026-10-04T07:45:00Z',
    },
  },
  {
    jobId: 'job_juspay_swe_1',
    canonicalTitle: 'Software Development Engineer I (Systems & Python)',
    originalTitle: 'SDE 1 - Core Payments Infrastructure',
    company: 'Juspay',
    companyId: 'comp_juspay',
    location: 'Bengaluru, Karnataka',
    workMode: 'On-site',
    description:
      'Juspay processes billions of payments for Amazon, Swiggy, and Flipkart. We are hiring SDE 1 engineers passionate about low latency systems, Python/Haskell/Rust, and rock-solid database transactions.',
    requirements: [
      'Strong command over functional programming or modern Python',
      'Solid comprehension of operating systems, Linux, processes, and concurrency',
      'Experience with SQL databases and distributed systems concepts',
      'Tenacity for debugging performance bottlenecks',
    ],
    mandatoryRequirements: [
      'B.Tech / BE in CS / IT (2024 or 2025 batch)',
      '0-2 years of software engineering experience',
      'Good DSA and problem solving skills',
    ],
    preferredSkills: ['Python', 'SQL', 'PostgreSQL', 'Linux', 'Docker', 'Git'],
    experienceMin: 0,
    experienceMax: 2,
    salary: '₹15,00,000 - ₹24,00,000 PA',
    employmentType: 'Full-time',
    postingDate: '2026-09-25',
    status: 'ACTIVE',
    officialUrl: 'https://juspay.in/careers/sde-1',
    applicationUrl: 'https://juspay.recruitee.com/o/sde-1-core-payments',
    canonicalUrl: 'https://juspay.in/careers/sde-1',
    sources: [
      {
        name: 'Juspay Careers',
        url: 'https://juspay.recruitee.com/o/sde-1-core-payments',
        discoveredAt: '2026-09-25T10:00:00Z',
        sourceType: 'official_ats',
      },
      {
        name: 'Cutshort India',
        url: 'https://cutshort.io/job/juspay-sde1-bengaluru',
        discoveredAt: '2026-09-25T11:00:00Z',
        sourceType: 'job_portal',
      },
    ],
    sourceCount: 2,
    verified: true,
    verificationStatus: 'VERIFIED',
    verificationConfidence: 94,
    verificationNotes: 'Active Recruitee ATS listing verified.',
    riskLevel: 'LOW',
    applicationComplexity: 'LOW',
    applicationPlatform: 'Other',
    easyApply: false,
    loginRequired: false,
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: new Date().toISOString(),
    lastVerifiedAt: '2026-10-04T12:00:00Z',
    match: {
      jobId: 'job_juspay_swe_1',
      userId: 'user_himanshu_2025',
      overallScore: 86,
      technicalScore: 88,
      experienceScore: 90,
      roleScore: 90,
      educationScore: 95,
      locationScore: 85,
      domainScore: 85,
      cloudScore: 80,
      keywordScore: 85,
      eligibility: 'ELIGIBLE',
      eligibilityReason: 'Candidate meets B.Tech 2025 criteria and foundational Python/Linux/SQL skills.',
      priority: 'P1',
      interviewProbability: 'MEDIUM',
      interviewProbabilityReason: 'High compensation and competitive coding rounds require thorough DSA preparation.',
      matchingSkills: ['Python', 'SQL', 'PostgreSQL', 'Linux', 'Docker', 'Git'],
      missingSkills: ['Haskell', 'Rust'],
      mandatoryGaps: [],
      advantages: ['Solid grasp of Linux, Docker, and PostgreSQL transaction fundamentals'],
      rejectionRisks: ['Challenging DSA assessment round'],
      createdAt: '2026-09-25T10:20:00Z',
    },
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_razorpay_1',
    jobId: 'job_razorpay_sde1_py',
    userId: 'user_himanshu_2025',
    canonicalTitle: 'Software Development Engineer I (Backend - Python)',
    company: 'Razorpay',
    location: 'Bengaluru, Karnataka',
    status: 'READY_TO_APPLY',
    dateFound: '2026-09-28T09:15:00Z',
    dateReady: '2026-10-01T10:00:00Z',
    lastUpdated: '2026-10-04T08:30:00Z',
    applicationUrl: 'https://boards.greenhouse.io/razorpay/jobs/6291823002',
    resumeVersionId: 'res_v2_tailored_razorpay',
    resumeVersionName: 'Resume v2 - FastAPI & Payments Backend',
    notes: 'Tailored resume highlighted sub-50ms API benchmarks and PyTest suite. Ready for official Greenhouse submission.',
    source: 'Greenhouse ATS',
    matchScore: 94,
    priority: 'P0',
  },
  {
    id: 'app_swiggy_1',
    jobId: 'job_swiggy_ai_eng_1',
    userId: 'user_himanshu_2025',
    canonicalTitle: 'AI / Generative AI Engineer (Associate / SDE 1)',
    company: 'Swiggy',
    location: 'Bengaluru, Karnataka',
    status: 'APPLIED',
    dateFound: '2026-09-30T08:00:00Z',
    dateReady: '2026-09-30T14:00:00Z',
    dateApplied: '2026-10-01T11:20:00Z',
    lastUpdated: '2026-10-01T11:20:00Z',
    applicationUrl: 'https://swiggy.darwinbox.in/ms/candidate/careers/req_ai_associate_2026',
    resumeVersionId: 'res_v3_tailored_genai',
    resumeVersionName: 'Resume v3 - GenAI & LangGraph Focus',
    notes: 'Submitted via Swiggy Darwinbox portal. Included GitHub repository link to Agentic RAG assistant.',
    source: 'Swiggy Careers Portal',
    matchScore: 96,
    priority: 'P0',
    interviewStage: 'Resume Screening',
  },
  {
    id: 'app_postman_1',
    jobId: 'job_postman_junior_be',
    userId: 'user_himanshu_2025',
    canonicalTitle: 'Associate Software Engineer - Backend',
    company: 'Postman',
    location: 'Remote India',
    status: 'ASSESSMENT',
    dateFound: '2026-10-01T11:00:00Z',
    dateReady: '2026-10-01T15:00:00Z',
    dateApplied: '2026-10-02T09:45:00Z',
    lastUpdated: '2026-10-04T14:00:00Z',
    applicationUrl: 'https://jobs.ashbyhq.com/postman/849102-associate-swe-backend',
    resumeVersionId: 'res_v1_general',
    resumeVersionName: 'Resume v1 - General Backend & Testing',
    notes: 'Received online technical assessment invite (HackerRank test on backend logic & REST contracts). Deadline Oct 8.',
    followUpDate: '2026-10-08T18:00:00Z',
    source: 'Ashby ATS',
    matchScore: 92,
    priority: 'P0',
    interviewStage: 'Online Coding Assessment',
  },
];

export const INITIAL_RESUME_VERSIONS: ResumeVersion[] = [
  {
    id: 'res_v1_general',
    userId: 'user_himanshu_2025',
    versionName: 'Resume v1 - Core Backend & PyTest Automation',
    matchScore: 90,
    tailoredSummary:
      'Early-career Software Engineer (2025 B.Tech CSE, Graphic Era Hill University) specializing in scalable Python and FastAPI backend development. Experienced with PostgreSQL optimization, automated unit/integration testing with PyTest, Docker containerization, and AWS deployments.',
    highlightedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'PyTest', 'Docker', 'REST APIs', 'AWS', 'Git', 'Linux'],
    reorderedBullets: [
      {
        section: 'Technical Focus',
        bullets: [
          'Engineered resilient FastAPI REST microservices handling 50k+ daily transactions with sub-50ms latency.',
          'Authored comprehensive test suites using PyTest and Dockerized database fixtures, maintaining 94% code coverage.',
          'Configured automated CI/CD pipelines via GitHub Actions for zero-downtime test validation and container builds.',
        ],
      },
    ],
    missingKeywordsTargeted: ['FastAPI', 'PyTest', 'Docker CI/CD'],
    createdAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'res_v2_tailored_razorpay',
    userId: 'user_himanshu_2025',
    versionName: 'Resume v2 - FastAPI & Payments Backend (Razorpay)',
    jobId: 'job_razorpay_sde1_py',
    jobTitle: 'Software Development Engineer I (Backend - Python)',
    company: 'Razorpay',
    matchScore: 94,
    tailoredSummary:
      'High-energy Backend Software Engineer (2025 B.Tech CSE) with production-ready expertise in Python, FastAPI, and PostgreSQL. Focused on reliable API contract enforcement, high-throughput database queries, and test-driven development with PyTest. Ready to contribute immediately to Razorpay payments platform.',
    highlightedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'SQL Optimization', 'Docker', 'PyTest', 'REST APIs', 'AWS'],
    reorderedBullets: [
      {
        section: 'Targeted Achievements for Payments Infrastructure',
        bullets: [
          'Engineered asynchronous REST APIs with FastAPI and PostgreSQL enforcing strict Pydantic schemas and idempotency.',
          'Optimized database queries and connection pooling in PostgreSQL, cutting peak API latency by 32%.',
          'Authored 120+ PyTest test cases simulating edge-case payment workflows, automated via GitHub Actions.',
        ],
      },
    ],
    missingKeywordsTargeted: ['FastAPI', 'PostgreSQL', 'PyTest', 'Docker', 'Idempotency'],
    createdAt: '2026-09-28T14:00:00Z',
  },
  {
    id: 'res_v3_tailored_genai',
    userId: 'user_himanshu_2025',
    versionName: 'Resume v3 - GenAI, RAG & LangGraph (Swiggy / Fractal)',
    jobId: 'job_swiggy_ai_eng_1',
    jobTitle: 'AI / Generative AI Engineer (Associate / SDE 1)',
    company: 'Swiggy',
    matchScore: 96,
    tailoredSummary:
      'GenAI and Backend Software Engineer (2025 B.Tech CSE) with hands-on expertise building production RAG pipelines, LangGraph agent workflows, and FastAPI inference services. Combines strong Python fundamentals and PostgreSQL storage with modern LLM orchestration and vector embeddings.',
    highlightedSkills: [
      'Python',
      'FastAPI',
      'RAG',
      'LangGraph',
      'AI Agents',
      'OpenAI APIs',
      'PostgreSQL',
      'Docker',
      'AWS EC2',
    ],
    reorderedBullets: [
      {
        section: 'AI & LLM Systems Engineering',
        bullets: [
          'Architected an Agentic RAG Knowledge Assistant using LangGraph, hybrid vector search, and FastAPI, boosting retrieval relevance by 35%.',
          'Implemented token-efficient prompt pipelines and structured JSON schema validations using modern LLM APIs.',
          'Deployed containerized inference microservices onto AWS EC2 with automated Docker Compose orchestration.',
        ],
      },
    ],
    missingKeywordsTargeted: ['LangGraph', 'RAG', 'AI Agents', 'Vector Embeddings', 'FastAPI'],
    createdAt: '2026-09-30T11:00:00Z',
  },
];

export const INITIAL_SEARCH_RUNS: SearchRun[] = [
  {
    searchRunId: 'run_init_20261004_1',
    startedAt: '2026-10-04T07:00:00Z',
    completedAt: '2026-10-04T07:02:15Z',
    queriesUsed: [
      'Python backend engineer India 0-2 years',
      'FastAPI software development engineer fresher Bengaluru',
      'AI engineer fresher LangGraph RAG India',
      'SDET Python automation fresher remote India',
      'Associate data engineer Airflow dbt India',
    ],
    sourcesChecked: [
      'Greenhouse ATS',
      'Lever ATS',
      'Workday ATS',
      'Ashby ATS',
      'LinkedIn India Jobs',
      'Naukri.com',
      'Indeed India',
      'Instahyre',
      'Cutshort',
      'Official Company Careers',
    ],
    rawJobsFound: 24,
    verifiedJobs: 18,
    duplicatesRemoved: 12,
    eligibleJobs: 14,
    p0Count: 4,
    p1Count: 2,
    status: 'COMPLETED',
    summary: 'Discovery completed across top tech hubs (Bengaluru, Pune, Gurugram, Remote). 6 high-fit verified openings ready to apply.',
  },
];

export const INITIAL_SKILL_GAPS: SkillGap[] = [
  {
    id: 'gap_redis',
    skill: 'Redis / In-memory Caching',
    frequency: 9,
    importance: 'HIGH',
    jobsAffected: 9,
    roleFamilies: ['Backend Engineer', 'SDE 1', 'FastAPI Developer'],
    recommendedPriority: 'HIGH PRIORITY',
    studyGuide: 'Learn Redis data structures (Strings, Hashes, Sorted Sets) and implement caching middleware in your FastAPI microservices.',
  },
  {
    id: 'gap_kafka',
    skill: 'Apache Kafka / Event Streaming',
    frequency: 7,
    importance: 'MEDIUM',
    jobsAffected: 7,
    roleFamilies: ['Data Engineer', 'Backend Engineer'],
    recommendedPriority: 'MEDIUM PRIORITY',
    studyGuide: 'Build a small publisher-consumer event stream with Python kafka-python or confluent-kafka connecting to PostgreSQL.',
  },
  {
    id: 'gap_k8s',
    skill: 'Kubernetes / Container Orchestration',
    frequency: 6,
    importance: 'MEDIUM',
    jobsAffected: 6,
    roleFamilies: ['Cloud Engineer', 'Platform Engineer', 'Backend Engineer'],
    recommendedPriority: 'MEDIUM PRIORITY',
    studyGuide: 'Use Minikube or k3s to write Kubernetes Deployment and Service YAML manifests for your Dockerized FastAPI app.',
  },
  {
    id: 'gap_selenium',
    skill: 'Playwright / Selenium (UI Automation)',
    frequency: 4,
    importance: 'LOW',
    jobsAffected: 4,
    roleFamilies: ['SDET', 'QA Automation Engineer'],
    recommendedPriority: 'LOW PRIORITY',
    studyGuide: 'Write 3-4 Playwright Python end-to-end tests for browser login and dashboard navigation.',
  },
];

export const INITIAL_COMPANIES: CompanyIntelligence[] = [
  {
    company: 'Razorpay',
    companyId: 'comp_razorpay',
    openRolesCount: 3,
    openRoles: ['SDE 1 (Python)', 'Frontend Engineer (React)', 'QA Engineer'],
    locations: ['Bengaluru'],
    technologyThemes: ['Python', 'Go', 'Microservices', 'PostgreSQL', 'Payments'],
    averageMatchScore: 94,
    officialCareersUrl: 'https://razorpay.com/jobs',
    verifiedActive: true,
  },
  {
    company: 'Swiggy',
    companyId: 'comp_swiggy',
    openRolesCount: 4,
    openRoles: ['Associate GenAI Engineer', 'Backend SDE 1', 'Data Analyst'],
    locations: ['Bengaluru', 'Remote'],
    technologyThemes: ['Python', 'GenAI', 'LangGraph', 'FastAPI', 'AWS'],
    averageMatchScore: 96,
    officialCareersUrl: 'https://careers.swiggy.com',
    verifiedActive: true,
  },
  {
    company: 'Postman',
    companyId: 'comp_postman',
    openRolesCount: 2,
    openRoles: ['Associate SWE Backend', 'Associate Developer Advocate'],
    locations: ['Bengaluru', 'Remote India'],
    technologyThemes: ['API Infrastructure', 'Python', 'Node.js', 'Developer Tools'],
    averageMatchScore: 92,
    officialCareersUrl: 'https://www.postman.com/company/careers',
    verifiedActive: true,
  },
  {
    company: 'PhonePe',
    companyId: 'comp_phonepe',
    openRolesCount: 3,
    openRoles: ['Associate Data Engineer', 'SDE 1 Backend', 'DevOps Associate'],
    locations: ['Pune', 'Bengaluru'],
    technologyThemes: ['Airflow', 'Python', 'SQL', 'Big Data', 'Distributed Systems'],
    averageMatchScore: 89,
    officialCareersUrl: 'https://phonepe.com/careers',
    verifiedActive: true,
  },
  {
    company: 'BrowserStack',
    companyId: 'comp_browserstack',
    openRolesCount: 2,
    openRoles: ['SDET I (Python)', 'Software Engineer'],
    locations: ['Mumbai', 'Remote India'],
    technologyThemes: ['Test Automation', 'PyTest', 'Docker', 'Cloud Infrastructure'],
    averageMatchScore: 93,
    officialCareersUrl: 'https://www.browserstack.com/careers',
    verifiedActive: true,
  },
];

export const DEFAULT_NETWORK_CONTACTS: NetworkContact[] = [
  {
    id: 'net_postman_1',
    name: 'Rohan Joshi',
    title: 'Software Engineer II (API Runtime & Gateway)',
    company: 'Postman',
    connectionDegree: 'Alumni',
    connectionContext: 'Graphic Era Hill University Alumni (B.Tech CSE 2022)',
    mutualConnectionsCount: 14,
    linkedinUrl: 'https://www.linkedin.com/in/rohan-joshi-postman-alumni',
    suggestedRoleForReferral: 'Software Engineer I - Developer Platform & Tooling',
    referralProbability: 'VERY HIGH',
    sampleMessage: "Hi Rohan! Hope you're doing great. I'm Himanshu, graduating in CSE from Graphic Era Hill University (Class of '25). I saw you're working on API Runtime at Postman—super inspiring! I've been building FastAPI microservices with extensive automated test suites and noticed the SE 1 role on the platform team. Would you be open to a quick chat or passing along my resume for a referral? Thanks a ton!",
  },
  {
    id: 'net_swiggy_1',
    name: 'Aman Verma',
    title: 'Senior Software Engineer (Search & AI Discovery)',
    company: 'Swiggy',
    connectionDegree: 'Alumni',
    connectionContext: 'Graphic Era Hill University Alumni (B.Tech CSE 2021)',
    mutualConnectionsCount: 22,
    linkedinUrl: 'https://www.linkedin.com/in/aman-verma-swiggy-alumni',
    suggestedRoleForReferral: 'Associate Software Engineer - GenAI & Search',
    referralProbability: 'VERY HIGH',
    sampleMessage: "Hi Aman, noticed we're both GEHU alumni! I've been admiring Swiggy's GenAI search initiatives. As an upcoming 2025 grad, I built an Agentic RAG system with LangGraph and vector search that addresses similar conversational discovery challenges. Would you be open to referring me for the Associate SDE role on the search team?",
  },
  {
    id: 'net_swiggy_2',
    name: 'Priyanka Nair',
    title: 'Engineering Manager (Core Order & Platform)',
    company: 'Swiggy',
    connectionDegree: '1st',
    connectionContext: 'Former Internship Mentor at TechFlow Systems',
    mutualConnectionsCount: 38,
    linkedinUrl: 'https://www.linkedin.com/in/priyanka-nair-swiggy',
    suggestedRoleForReferral: 'Software Development Engineer 1 - Backend',
    referralProbability: 'VERY HIGH',
    sampleMessage: "Hi Priyanka! Hope things are great at Swiggy. I'm graduating in 2025 and actively looking for SDE 1 backend roles. Since our time at TechFlow, I've deepened my FastAPI and PostgreSQL scaling work and would love to bring that hands-on rigor to Swiggy. Could you refer me for the SDE 1 backend opening?",
  },
  {
    id: 'net_razorpay_1',
    name: 'Vikramaditya Chauhan',
    title: 'Software Development Engineer 1 (Payments Core)',
    company: 'Razorpay',
    connectionDegree: 'Alumni',
    connectionContext: 'Graphic Era Hill University Alumni (B.Tech CSE 2023)',
    mutualConnectionsCount: 19,
    linkedinUrl: 'https://www.linkedin.com/in/vikram-chauhan-razorpay',
    suggestedRoleForReferral: 'Software Development Engineer 1 - Payments Platform',
    referralProbability: 'VERY HIGH',
    sampleMessage: "Hey Vikram! Great to see a fellow GEHU alum thriving on Razorpay's payments core team! I'm preparing to graduate in 2025 with strong Python/FastAPI/PostgreSQL foundations and ACID transaction projects. Would you have 5 mins for a quick connection, or could you consider submitting a referral for the SDE 1 opening? Would really appreciate your guidance!",
  },
  {
    id: 'net_browserstack_1',
    name: 'Karan Malhotra',
    title: 'Staff Engineer (Cloud Platform & Infra)',
    company: 'BrowserStack',
    connectionDegree: '1st',
    connectionContext: 'Open Source Python Maintainer & Co-contributor',
    mutualConnectionsCount: 29,
    linkedinUrl: 'https://www.linkedin.com/in/karan-malhotra-browserstack',
    suggestedRoleForReferral: 'Software Engineer - Infrastructure & Tooling',
    referralProbability: 'HIGH',
    sampleMessage: "Hi Karan, really enjoyed collaborating on the open-source async testing libraries! I'm targeting full-time SDE 1 / Infra roles for 2025 and saw BrowserStack's infrastructure engineering team is expanding in Mumbai/Bengaluru. Would you be comfortable putting in a referral for me?",
  },
  {
    id: 'net_cred_1',
    name: 'Divya Sundaram',
    title: 'Backend Software Engineer (Platform Services)',
    company: 'CRED',
    connectionDegree: '2nd',
    connectionContext: 'Mutual Connection with Prof. Sharma (HOD at GEHU)',
    mutualConnectionsCount: 11,
    linkedinUrl: 'https://www.linkedin.com/in/divya-sundaram-cred',
    suggestedRoleForReferral: 'Software Engineer I - Backend',
    referralProbability: 'HIGH',
    sampleMessage: "Hi Divya, I see we're both connected with Prof. Sharma from GEHU! I've been fascinated by CRED's event-driven architecture. I'm a 2025 CSE graduate specializing in high-performance Python services and async workers. Would you be open to referring me for the Backend Engineer I role?",
  },
  {
    id: 'net_phonepe_1',
    name: 'Siddharth Rao',
    title: 'Lead Software Engineer (Fintech Ledger Architecture)',
    company: 'PhonePe',
    connectionDegree: '2nd',
    connectionContext: 'Speaker at PyCon India 2024 (Attended Workshop)',
    mutualConnectionsCount: 17,
    linkedinUrl: 'https://www.linkedin.com/in/siddharth-rao-phonepe',
    suggestedRoleForReferral: 'Software Engineer - Backend Ledger Systems',
    referralProbability: 'MODERATE',
    sampleMessage: "Hi Siddharth, loved your talk on async concurrency at PyCon India! I'm an upcoming 2025 graduate with a strong focus on FastAPI, PostgreSQL, and distributed reliability. I'd love to apply for PhonePe's backend openings and was wondering if you might be open to reviewing my resume for a referral.",
  },
];

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          candidateProfile: parsed.candidateProfile || DEFAULT_CANDIDATE,
          jobs: parsed.jobs || INITIAL_JOBS,
          applications: parsed.applications || INITIAL_APPLICATIONS,
          resumeVersions: parsed.resumeVersions || INITIAL_RESUME_VERSIONS,
          searchRuns: parsed.searchRuns || INITIAL_SEARCH_RUNS,
          skillGaps: parsed.skillGaps || INITIAL_SKILL_GAPS,
          companies: parsed.companies || INITIAL_COMPANIES,
          networkContacts: parsed.networkContacts || DEFAULT_NETWORK_CONTACTS,
          settings: parsed.settings || {
            theme: 'dark',
            notificationsEnabled: true,
            autoVerifyGrounding: true,
            minMatchThreshold: 60,
            emailAlerts: true,
          },
        };
      }
    } catch (err) {
      console.error('[DB Store] Error reading db.json, initializing fresh store:', err);
    }

    const initial: DatabaseSchema = {
      candidateProfile: DEFAULT_CANDIDATE,
      jobs: INITIAL_JOBS,
      applications: INITIAL_APPLICATIONS,
      resumeVersions: INITIAL_RESUME_VERSIONS,
      searchRuns: INITIAL_SEARCH_RUNS,
      skillGaps: INITIAL_SKILL_GAPS,
      companies: INITIAL_COMPANIES,
      networkContacts: DEFAULT_NETWORK_CONTACTS,
      settings: {
        theme: 'dark',
        notificationsEnabled: true,
        autoVerifyGrounding: true,
        minMatchThreshold: 60,
        emailAlerts: true,
      },
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB Store] Error saving db.json:', err);
    }
  }

  // Profile operations
  public getCandidateProfile(): CandidateProfile {
    return this.data.candidateProfile;
  }

  public updateCandidateProfile(updates: Partial<CandidateProfile>): CandidateProfile {
    this.data.candidateProfile = {
      ...this.data.candidateProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.candidateProfile;
  }

  // Jobs operations
  public getJobs(): Job[] {
    return this.data.jobs;
  }

  public getJobById(jobId: string): Job | undefined {
    return this.data.jobs.find((j) => j.jobId === jobId);
  }

  public addJobs(newJobs: Job[]): { added: number; updated: number } {
    let added = 0;
    let updated = 0;

    for (const job of newJobs) {
      const idx = this.data.jobs.findIndex(
        (j) => j.jobId === job.jobId || (j.company.toLowerCase() === job.company.toLowerCase() && j.canonicalTitle.toLowerCase() === job.canonicalTitle.toLowerCase())
      );

      if (idx >= 0) {
        // Merge sources and update
        const existing = this.data.jobs[idx];
        const existingUrls = new Set(existing.sources.map((s) => s.url));
        const mergedSources = [...existing.sources];
        for (const s of job.sources) {
          if (!existingUrls.has(s.url)) {
            mergedSources.push(s);
          }
        }
        this.data.jobs[idx] = {
          ...existing,
          ...job,
          sources: mergedSources,
          sourceCount: mergedSources.length,
          updatedAt: new Date().toISOString(),
        };
        updated++;
      } else {
        this.data.jobs.unshift(job);
        added++;
      }
    }

    this.saveData();
    return { added, updated };
  }

  public updateJob(jobId: string, updates: Partial<Job>): Job | null {
    const idx = this.data.jobs.findIndex((j) => j.jobId === jobId);
    if (idx === -1) return null;
    this.data.jobs[idx] = {
      ...this.data.jobs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.jobs[idx];
  }

  // Applications
  public getApplications(): Application[] {
    return this.data.applications;
  }

  public addApplication(appData: Omit<Application, 'id' | 'lastUpdated'>): { success: boolean; application?: Application; message?: string } {
    // Prevent duplicate application to same job
    const existing = this.data.applications.find((a) => a.jobId === appData.jobId);
    if (existing) {
      return {
        success: false,
        application: existing,
        message: `Application already tracked for ${existing.company} - ${existing.canonicalTitle} (Status: ${existing.status}). Duplicate prevention enforced.`,
      };
    }

    const newApp: Application = {
      ...appData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      lastUpdated: new Date().toISOString(),
    };

    this.data.applications.unshift(newApp);
    this.saveData();
    return { success: true, application: newApp };
  }

  public updateApplication(appId: string, updates: Partial<Application>): Application | null {
    const idx = this.data.applications.findIndex((a) => a.id === appId);
    if (idx === -1) return null;
    this.data.applications[idx] = {
      ...this.data.applications[idx],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.saveData();
    return this.data.applications[idx];
  }

  // Resume versions
  public getResumeVersions(): ResumeVersion[] {
    return this.data.resumeVersions;
  }

  public addResumeVersion(version: ResumeVersion): ResumeVersion {
    this.data.resumeVersions.unshift(version);
    this.saveData();
    return version;
  }

  // Search runs
  public getSearchRuns(): SearchRun[] {
    return this.data.searchRuns;
  }

  public addSearchRun(run: SearchRun): SearchRun {
    this.data.searchRuns.unshift(run);
    this.saveData();
    return run;
  }

  // Skill gaps
  public getSkillGaps(): SkillGap[] {
    return this.data.skillGaps;
  }

  public updateSkillGaps(gaps: SkillGap[]) {
    this.data.skillGaps = gaps;
    this.saveData();
  }

  // Companies
  public getCompanies(): CompanyIntelligence[] {
    return this.data.companies;
  }

  public updateCompanies(companies: CompanyIntelligence[]) {
    this.data.companies = companies;
    this.saveData();
  }

  // Settings
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<DatabaseSchema['settings']>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveData();
    return this.data.settings;
  }

  // Dashboard Aggregates
  public getDashboardStats(): DashboardStats {
    const jobs = this.data.jobs;
    const verifiedJobs = jobs.filter((j) => j.verified || j.verificationStatus === 'VERIFIED');
    const p0Count = jobs.filter((j) => j.match?.priority === 'P0').length;
    const p1Count = jobs.filter((j) => j.match?.priority === 'P1').length;
    const strongMatchesCount = jobs.filter((j) => (j.match?.overallScore || 0) >= 80).length;

    const apps = this.data.applications;
    const applicationsSent = apps.filter((a) => ['APPLIED', 'ASSESSMENT', 'PHONE_SCREEN', 'INTERVIEW', 'FINAL_ROUND', 'OFFER'].includes(a.status)).length;
    const interviewsCount = apps.filter((a) => ['PHONE_SCREEN', 'INTERVIEW', 'FINAL_ROUND'].includes(a.status)).length;
    const offersCount = apps.filter((a) => a.status === 'OFFER').length;

    // Top skills requested across jobs
    const skillCounts: { [skill: string]: number } = {};
    for (const job of jobs) {
      for (const s of [...job.requirements, ...job.preferredSkills]) {
        const clean = s.trim();
        if (clean.length > 2 && clean.length < 25) {
          skillCounts[clean] = (skillCounts[clean] || 0) + 1;
        }
      }
    }

    const topSkillsDemand = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Source distribution
    const sourceCounts: { [src: string]: number } = {};
    for (const job of jobs) {
      for (const src of job.sources) {
        sourceCounts[src.name] = (sourceCounts[src.name] || 0) + 1;
      }
    }
    const sourceDistribution = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Application status breakdown
    const statusCounts: { [status: string]: number } = {};
    for (const app of apps) {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    }
    const applicationStatusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    return {
      jobsFound: jobs.length,
      verifiedCount: verifiedJobs.length,
      uniqueJobs: jobs.length,
      strongMatchesCount,
      p0Count,
      p1Count,
      applicationsSent,
      interviewsCount,
      offersCount,
      activeSearchRuns: this.data.searchRuns.length,
      topSkillsDemand,
      sourceDistribution,
      applicationStatusBreakdown,
      weeklyDiscoveryTrends: [
        { day: 'Mon', count: 4, applied: 1 },
        { day: 'Tue', count: 6, applied: 2 },
        { day: 'Wed', count: 5, applied: 1 },
        { day: 'Thu', count: 8, applied: 3 },
        { day: 'Fri', count: 9, applied: 2 },
        { day: 'Sat', count: 7, applied: 1 },
        { day: 'Sun', count: 6, applied: 2 },
      ],
    };
  }

  // Network Contacts (LinkedIn)
  public getNetworkContacts(company?: string): NetworkContact[] {
    const list = this.data.networkContacts || DEFAULT_NETWORK_CONTACTS;
    if (company && company !== 'ALL') {
      return list.filter((c) => c.company.toLowerCase() === company.toLowerCase());
    }
    return list;
  }
}

export const dbStore = new Store();
