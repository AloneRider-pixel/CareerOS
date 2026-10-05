import { Job, JobSource } from '../../src/types';
import { NormalizationService } from './normalizationService';

export class DeduplicationService {
  /**
   * Deduplicate and merge an array of discovered raw jobs into canonical listings.
   */
  public static deduplicate(jobs: Job[]): { uniqueJobs: Job[]; duplicatesMergedCount: number } {
    const canonicalMap = new Map<string, Job>();
    let duplicatesMergedCount = 0;

    for (const job of jobs) {
      const normCompany = NormalizationService.normalizeCompany(job.company).toLowerCase();
      const normTitle = NormalizationService.normalizeTitle(job.canonicalTitle).toLowerCase();
      const normLocation = NormalizationService.normalizeLocation(job.location).toLowerCase();

      // Key for grouping identical company + role family + general city
      const dedupeKey = `${normCompany}::${normTitle.substring(0, 25)}::${normLocation.split(',')[0].trim()}`;

      if (canonicalMap.has(dedupeKey)) {
        duplicatesMergedCount++;
        const existing = canonicalMap.get(dedupeKey)!;

        // Merge sources preserving provenance
        const existingUrls = new Set(existing.sources.map((s) => NormalizationService.cleanUrl(s.url)));
        const mergedSources: JobSource[] = [...existing.sources];

        for (const s of job.sources) {
          const clean = NormalizationService.cleanUrl(s.url);
          if (!existingUrls.has(clean)) {
            existingUrls.add(clean);
            mergedSources.push(s);
          }
        }

        // Determine best official application URL
        // Priority: official_careers (1) > official_ats (2) > trusted portal (3) > aggregator (4)
        let bestAppUrl = existing.applicationUrl;
        let bestPlatform = existing.applicationPlatform;

        const isNewSourceBetter =
          job.sources.some((s) => s.sourceType === 'official_careers' || s.sourceType === 'official_ats') &&
          !existing.sources.some((s) => s.sourceType === 'official_careers' || s.sourceType === 'official_ats');

        if (isNewSourceBetter) {
          bestAppUrl = job.applicationUrl;
          bestPlatform = job.applicationPlatform;
        }

        canonicalMap.set(dedupeKey, {
          ...existing,
          sources: mergedSources,
          sourceCount: mergedSources.length,
          applicationUrl: bestAppUrl,
          applicationPlatform: bestPlatform,
          // Retain the higher verification confidence
          verificationConfidence: Math.max(existing.verificationConfidence, job.verificationConfidence),
          verified: existing.verified || job.verified,
        });
      } else {
        canonicalMap.set(dedupeKey, {
          ...job,
          sourceCount: job.sources.length,
        });
      }
    }

    return {
      uniqueJobs: Array.from(canonicalMap.values()),
      duplicatesMergedCount,
    };
  }
}
