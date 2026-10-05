import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Send,
  Award,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ExternalLink,
  Target,
  RefreshCw,
  Building2,
  Lightbulb,
  Compass,
  Rocket,
  Check,
  Zap,
  Users,
  MessageSquare,
  Share2,
  UserCheck,
} from 'lucide-react';
import { DashboardStats, Job, DashboardAIInsights, NetworkContact } from '../../types';
import { JobCard } from '../jobs/JobCard';
import {
  fetchDashboardAIInsights,
  refreshDashboardAIInsights,
  fetchNetworkContacts,
} from '../../api';
import { NetworkReferralModal } from '../network/NetworkReferralModal';

interface DashboardViewProps {
  stats: DashboardStats;
  p0Jobs: Job[];
  recentJobs: Job[];
  onApply: (job: Job) => void;
  onTailor: (job: Job) => void;
  onTrack: (job: Job) => void;
  onView: (job: Job) => void;
  onPrep?: (job: Job) => void;
  onNavigateToJobs: (filterCompany?: string) => void;
  onNavigateToTracker: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  p0Jobs,
  recentJobs,
  onApply,
  onTailor,
  onTrack,
  onView,
  onPrep,
  onNavigateToJobs,
  onNavigateToTracker,
}) => {
  const [insights, setInsights] = useState<DashboardAIInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsRefreshing, setInsightsRefreshing] = useState(false);

  // Network Referral State
  const [networkContacts, setNetworkContacts] = useState<NetworkContact[]>([]);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [selectedNetworkCompany, setSelectedNetworkCompany] = useState<string>('ALL');
  const [activeContactForModal, setActiveContactForModal] = useState<NetworkContact | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadInsights = async () => {
      try {
        setInsightsLoading(true);
        const data = await fetchDashboardAIInsights();
        if (mounted) setInsights(data);
      } catch (err) {
        console.error('Failed to load AI insights:', err);
      } finally {
        if (mounted) setInsightsLoading(false);
      }
    };
    loadInsights();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadContacts = async () => {
      try {
        setNetworkLoading(true);
        const data = await fetchNetworkContacts(selectedNetworkCompany);
        if (mounted) setNetworkContacts(data);
      } catch (err) {
        console.error('Failed to load network contacts:', err);
      } finally {
        if (mounted) setNetworkLoading(false);
      }
    };
    loadContacts();
    return () => {
      mounted = false;
    };
  }, [selectedNetworkCompany]);

  const handleRefreshInsights = async () => {
    try {
      setInsightsRefreshing(true);
      const data = await refreshDashboardAIInsights();
      setInsights(data);
    } catch (err) {
      console.error('Failed to refresh AI insights:', err);
    } finally {
      setInsightsRefreshing(false);
    }
  };

  const getDegreeBadge = (degree: string) => {
    switch (degree) {
      case 'Alumni':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case '1st':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case '2nd':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const availableCompanies = ['ALL', 'Postman', 'Swiggy', 'Razorpay', 'BrowserStack', 'CRED', 'PhonePe'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Targeting 2025 SDE 1, AI & Backend Roles in India</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            CareerOS — Job Search Operating System
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Discover verified active opportunities across India&apos;s tech hubs, eliminate duplicates, tailor factual resumes, and route directly to verified employer ATS pages.
          </p>
        </div>
      </div>

      {/* Top KPI Cards (Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Jobs Discovered</span>
            <Briefcase className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{stats.jobsFound}</div>
          <div className="text-[10px] text-slate-500 mt-1">{stats.uniqueJobs} unique after deduplication</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified Active</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{stats.verifiedCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">Grounding verified citations</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>P0 • Apply Now</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-300">{stats.p0Count}</div>
          <div className="text-[10px] text-slate-500 mt-1">{stats.p1Count} P1 Apply Today</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Applications Sent</span>
            <Send className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400">{stats.applicationsSent}</div>
          <div className="text-[10px] text-slate-500 mt-1">Direct ATS submissions</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Interviews & Offers</span>
            <Award className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-400">
            {stats.interviewsCount} / {stats.offersCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Interview stage active</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AI INSIGHTS & TOP 3 TARGET COMPANIES (GEMINI REASONING) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-6 space-y-6 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Gemini 3.8 Flash Application Intelligence</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-400" />
              <span>AI Application Insights & Top 3 Target Companies</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Synthesizing your recent application velocity with verified project strengths to identify the top employers in India where you hold the highest interview conversion probability.
            </p>
          </div>

          <button
            onClick={handleRefreshInsights}
            disabled={insightsRefreshing || insightsLoading}
            className="self-start sm:self-center flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${insightsRefreshing ? 'animate-spin' : ''}`} />
            <span>{insightsRefreshing ? 'Analyzing Pipeline...' : 'Refresh AI Analysis'}</span>
          </button>
        </div>

        {/* Velocity & Market Positioning Cards */}
        {insights && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Rocket className="h-3.5 w-3.5 text-emerald-400" />
                Market Positioning
              </div>
              <div className="font-bold text-slate-200 text-xs leading-snug">
                {insights.overallMarketCompetitiveness}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-cyan-400" />
                Highest-Yield Skill
              </div>
              <div className="font-bold text-cyan-300 text-xs leading-snug">
                {insights.conversionTrends.highestDemandSkill}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                Pipeline Momentum
              </div>
              <div className="font-bold text-slate-200 text-xs leading-snug">
                {insights.conversionTrends.interviewRateEstimated}
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {insightsLoading && !insights && (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <div className="text-xs font-semibold text-slate-300">
              Generating High-Probability Target Recommendations...
            </div>
            <p className="text-[11px] text-slate-500">
              Evaluating your Python, FastAPI, LangGraph, and Airflow skills against active hiring pipelines
            </p>
          </div>
        )}

        {/* 3 Top Target Companies Cards */}
        {insights && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <span>3 Prime Target Companies (Highest Realistic Interview Odds)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Ranked by project-JD compatibility
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {insights.recommendedTargetCompanies.map((target) => (
                <div
                  key={target.company}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3.5 flex flex-col justify-between shadow-sm hover:border-indigo-500/40 transition group"
                >
                  <div className="space-y-3">
                    {/* Company Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm">
                          {target.company.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                            {target.company}
                          </h4>
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {target.recommendedRole}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          target.interviewProbability === 'VERY HIGH'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        }`}
                      >
                        {target.probabilityScore}% {target.interviewProbability}
                      </span>
                    </div>

                    {/* Why Candidate Fits */}
                    <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                      <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>Why You Fit:</span>
                      </div>
                      {target.whyCandidateFits}
                    </div>

                    {/* Matching Tech Stack */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Matching Core Stack:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {target.matchingTechStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Tip */}
                    <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-2.5 text-[11px] text-slate-300 leading-relaxed">
                      <div className="font-semibold text-indigo-300 mb-0.5 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3 text-indigo-400 shrink-0" />
                        <span>Strategic Tip:</span>
                      </div>
                      {target.strategicTip}
                    </div>
                  </div>

                  {/* Card Action Links */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigateToJobs(target.company)}
                      className="font-semibold text-indigo-400 hover:text-indigo-300 transition text-[11px] flex items-center gap-1"
                    >
                      <span>Find {target.company} Jobs</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    {target.officialCareersUrl && (
                      <a
                        href={target.officialCareersUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
                      >
                        <span>Careers</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Next Best Actions */}
            {insights.nextBestActions && insights.nextBestActions.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-2 mt-2">
                <h4 className="font-semibold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Recommended Strategic Actions to Maximize Callback Rate</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {insights.nextBestActions.map((action, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-[11px] text-slate-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* NETWORK REFERRAL HELPER (LINKEDIN CROSS-REFERENCE) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 mb-1">
              <Users className="h-3 w-3" />
              <span>Warm Pipeline Unlocks (3x higher callback rates)</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <span>LinkedIn Network Referral Helper</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300 font-normal">
                {networkContacts.length} Contacts Cross-Referenced
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-referencing your Graphic Era Hill University alumni network, former internship mentors, and open-source collaborators at your target employers.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Alumni & 1st Degree Prioritized</span>
          </div>
        </div>

        {/* Company Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold mr-1">Filter Employer:</span>
          {availableCompanies.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedNetworkCompany(comp)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                selectedNetworkCompany === comp
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {comp === 'ALL' ? 'All Companies' : comp}
            </button>
          ))}
        </div>

        {/* Network Contacts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networkContacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition shadow-sm"
            >
              <div className="space-y-2.5">
                {/* Contact Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-sm">
                      {contact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug">{contact.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{contact.title}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getDegreeBadge(
                      contact.connectionDegree
                    )}`}
                  >
                    {contact.connectionDegree}
                  </span>
                </div>

                {/* Company & Mutual context */}
                <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-medium text-slate-200 flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-cyan-400" />
                      {contact.company}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {contact.mutualConnectionsCount} mutuals
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{contact.connectionContext}</span>
                  </div>
                </div>

                {/* Suggested Role */}
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Target Role: </span>
                  <span className="text-slate-200 font-semibold">{contact.suggestedRoleForReferral}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveContactForModal(contact)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Draft Referral Note (AI)</span>
                </button>

                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-300 transition"
                  title="View on LinkedIn"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}

          {networkContacts.length === 0 && !networkLoading && (
            <div className="col-span-full py-8 text-center text-xs text-slate-500 rounded-xl border border-dashed border-slate-800">
              No matching network contacts for the selected employer filter.
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Priority Action Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">Priority Applications (P0 & P1 Queue)</h2>
          </div>
          <button
            onClick={() => onNavigateToJobs()}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>View All Discovered ({stats.jobsFound})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {p0Jobs.map((job) => (
            <JobCard
              key={job.jobId}
              job={job}
              onApply={onApply}
              onTailor={onTailor}
              onTrack={onTrack}
              onView={onView}
              onPrep={onPrep}
            />
          ))}
          {p0Jobs.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-xs text-slate-400">
              No P0 listings currently in queue. Run a new search run to discover fresh active roles.
            </div>
          )}
        </div>
      </div>

      {/* Intelligence & Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Top In-Demand Skills */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Top Skills Requested Across Open Roles</span>
            </h3>
            <span className="text-[11px] text-slate-500">Live Frequency</span>
          </div>

          <div className="space-y-2">
            {stats.topSkillsDemand.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>{item.skill}</span>
                  <span className="font-semibold text-indigo-400">{item.count} roles</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (item.count / (stats.jobsFound || 1)) * 100 * 1.5)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Portal Provenance Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Job Source Provenance Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-500">Multi-Channel Ingestion</span>
          </div>

          <div className="space-y-2.5">
            {stats.sourceDistribution.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]"
              >
                <span className="font-medium text-slate-200">{item.source}</span>
                <span className="rounded bg-indigo-500/10 text-indigo-400 px-2 py-0.5 font-bold border border-indigo-500/20">
                  {item.count} listings
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Referral Modal */}
      {activeContactForModal && (
        <NetworkReferralModal
          contact={activeContactForModal}
          onClose={() => setActiveContactForModal(null)}
        />
      )}
    </div>
  );
};
