import React from 'react';
import { Building2, ExternalLink, MapPin, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CompanyIntelligence } from '../../types';

interface CompanyIntelligenceViewProps {
  companies: CompanyIntelligence[];
  onSelectCompany: (companyName: string) => void;
}

export const CompanyIntelligenceView: React.FC<CompanyIntelligenceViewProps> = ({
  companies,
  onSelectCompany,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Company Hiring Hub & Intelligence</h1>
        <p className="text-xs text-slate-400 mt-1">
          Leading Indian technology employers hiring early-career software engineers with multiple verified openings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((comp) => (
          <div
            key={comp.companyId}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 text-xs shadow-sm hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-base">
                  {comp.company.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{comp.company}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Employer</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold">
                  {comp.averageMatchScore}% Fit
                </span>
              </div>
            </div>

            {/* Locations */}
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{comp.locations.join(', ')}</span>
            </div>

            {/* Open Roles */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Active Open Roles ({comp.openRolesCount}):
              </span>
              <div className="space-y-1">
                {comp.openRoles.map((role, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectCompany(comp.company)}
                    className="flex items-center justify-between rounded bg-slate-950 px-2.5 py-1.5 text-slate-200 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <span className="truncate">{role}</span>
                    <span className="text-[10px] text-indigo-400 font-semibold">View</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Themes */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400">Technology Themes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {comp.technologyThemes.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Careers Link */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <a
                href={comp.officialCareersUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Official Careers Hub <ExternalLink className="h-3 w-3" />
              </a>

              <button
                onClick={() => onSelectCompany(comp.company)}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Filter Jobs →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
