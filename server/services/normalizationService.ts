import { WorkMode } from '../../src/types';

export class NormalizationService {
  /**
   * Normalize job titles to standard canonical engineering roles while preserving nuances.
   */
  public static normalizeTitle(title: string): string {
    const lower = title.toLowerCase().trim();

    if (
      lower.includes('sde 1') ||
      lower.includes('sde-1') ||
      lower.includes('sde i') ||
      lower.includes('software development engineer 1') ||
      lower.includes('software development engineer i')
    ) {
      if (lower.includes('python')) return 'Software Development Engineer I (Python)';
      if (lower.includes('backend')) return 'Software Development Engineer I (Backend)';
      return 'Software Development Engineer I';
    }

    if (
      lower.includes('associate software engineer') ||
      lower.includes('associate engineer') ||
      lower.includes('associate swe') ||
      lower.includes('graduate software engineer') ||
      lower.includes('graduate engineer trainee')
    ) {
      if (lower.includes('backend')) return 'Associate Software Engineer - Backend';
      return 'Associate Software Engineer';
    }

    if (lower.includes('genai') || lower.includes('generative ai') || lower.includes('llm') || lower.includes('rag')) {
      return 'AI / Generative AI Engineer (Associate / SDE 1)';
    }

    if (lower.includes('data engineer') || lower.includes('analytics engineer')) {
      return 'Data Engineer I / Associate Data Engineer';
    }

    if (lower.includes('sdet') || lower.includes('qa automation') || lower.includes('test automation')) {
      return 'Software Development Engineer in Test (SDET I)';
    }

    if (lower.includes('backend developer') || lower.includes('backend engineer')) {
      return 'Backend Software Engineer (Python / REST APIs)';
    }

    if (lower.includes('python developer') || lower.includes('python engineer')) {
      return 'Python Software Engineer';
    }

    // Capitalize words nicely if no specific canonical mapping
    return title.replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  }

  /**
   * Normalize company names by removing legal suffix variants.
   */
  public static normalizeCompany(company: string): string {
    return company
      .replace(/\s*(pvt|pvt\.|private|ltd|ltd\.|limited|llc|inc|inc\.|technologies|solutions|services|india)\b/gi, '')
      .replace(/[^\w\s-]/g, '')
      .trim();
  }

  /**
   * Normalize locations in India.
   */
  public static normalizeLocation(loc: string): string {
    const lower = loc.toLowerCase();
    if (lower.includes('bangalore') || lower.includes('bengaluru')) return 'Bengaluru, Karnataka';
    if (lower.includes('hyderabad')) return 'Hyderabad, Telangana';
    if (lower.includes('pune')) return 'Pune, Maharashtra';
    if (lower.includes('gurgaon') || lower.includes('gurugram')) return 'Gurugram, Haryana';
    if (lower.includes('noida') || lower.includes('greater noida')) return 'Noida, Uttar Pradesh';
    if (lower.includes('delhi') || lower.includes('ncr')) return 'Delhi NCR';
    if (lower.includes('mumbai')) return 'Mumbai, Maharashtra';
    if (lower.includes('chennai')) return 'Chennai, Tamil Nadu';
    if (lower.includes('dehradun')) return 'Dehradun, Uttarakhand';
    if (lower.includes('remote')) return 'Remote India';
    return loc.trim();
  }

  /**
   * Normalize work mode into Remote | Hybrid | On-site.
   */
  public static normalizeWorkMode(mode?: string, desc?: string): WorkMode {
    const combined = `${mode || ''} ${desc || ''}`.toLowerCase();
    if (combined.includes('remote') || combined.includes('work from home') || combined.includes('wfh')) {
      return 'Remote';
    }
    if (combined.includes('hybrid') || combined.includes('flexible')) {
      return 'Hybrid';
    }
    return 'On-site';
  }

  /**
   * Strip tracking query params from job URLs to find canonical link.
   */
  public static cleanUrl(rawUrl: string): string {
    try {
      const parsed = new URL(rawUrl);
      const trackingParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'ref',
        'source',
        'trk',
        'trackingId',
        'refId',
        'fbclid',
        'gclid',
      ];
      for (const p of trackingParams) {
        parsed.searchParams.delete(p);
      }
      return parsed.toString();
    } catch {
      return rawUrl.trim();
    }
  }
}
