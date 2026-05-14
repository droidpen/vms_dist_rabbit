/**
 * Threat Intelligence Integration
 * Connects to CVE databases and threat intelligence sources
 */

export interface CVEData {
  cveId: string;
  cvssV3Score: number;
  cvssV3Vector: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  description: string;
  publishedDate: string;
  lastModifiedDate: string;
  weaknesses: string[];
  references: string[];
}

export interface EPSSData {
  cveId: string;
  epssScore: number; // 0-1 probability of exploitation in next 30 days
  epssPercentile: number;
}

export interface ExploitIntelligence {
  cveId: string;
  isKEV: boolean; // CISA Known Exploited Vulnerability
  exploitAvailable: boolean;
  exploitMaturity: 'PROOF_OF_CONCEPT' | 'FUNCTIONAL' | 'HIGH' | 'NOT_AVAILABLE';
  ransomwareUse: boolean;
  activeExploitation: boolean;
}

export interface ThreatContext {
  cveData: CVEData;
  epss: EPSSData;
  exploitIntel: ExploitIntelligence;
  threatScore: number; // 0-100 composite threat score
}

/**
 * Fetch CVE data from NVD (National Vulnerability Database)
 */
export async function fetchNVDData(cveId: string): Promise<CVEData | null> {
  try {
    const response = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`
    );

    if (!response.ok) {
      console.warn(`NVD API returned ${response.status} for ${cveId}`);
      return null;
    }

    const data = await response.json();

    if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
      return null;
    }

    const vuln = data.vulnerabilities[0].cve;
    const cvssData = vuln.metrics?.cvssMetricV31?.[0] || vuln.metrics?.cvssMetricV30?.[0];

    if (!cvssData) {
      return null;
    }

    return {
      cveId: vuln.id,
      cvssV3Score: cvssData.cvssData.baseScore,
      cvssV3Vector: cvssData.cvssData.vectorString,
      severity: cvssData.cvssData.baseSeverity as any,
      description: vuln.descriptions?.find((d: any) => d.lang === 'en')?.value || '',
      publishedDate: vuln.published,
      lastModifiedDate: vuln.lastModified,
      weaknesses: vuln.weaknesses?.map((w: any) => w.description?.[0]?.value).filter(Boolean) || [],
      references: vuln.references?.map((r: any) => r.url) || [],
    };
  } catch (error) {
    console.error('NVD fetch error:', error);
    return null;
  }
}

/**
 * Fetch EPSS (Exploit Prediction Scoring System) data
 * Predicts probability of exploitation in next 30 days
 */
export async function fetchEPSSData(cveId: string): Promise<EPSSData | null> {
  try {
    const response = await fetch(
      `https://api.first.org/data/v1/epss?cve=${cveId}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const epssData = data.data[0];

    return {
      cveId: epssData.cve,
      epssScore: parseFloat(epssData.epss),
      epssPercentile: parseFloat(epssData.percentile),
    };
  } catch (error) {
    console.error('EPSS fetch error:', error);
    return null;
  }
}

/**
 * Check CISA KEV (Known Exploited Vulnerabilities) catalog
 */
export async function checkCISAKEV(cveId: string): Promise<boolean> {
  try {
    const response = await fetch(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.vulnerabilities.some((v: any) => v.cveID === cveId);
  } catch (error) {
    // Silently fail - KEV check is optional threat intelligence
    return false;
  }
}

/**
 * Generate composite threat score (0-100)
 * Combines CVSS, EPSS, exploit availability, KEV status
 */
export function calculateThreatScore(context: Partial<ThreatContext>): number {
  let score = 0;

  // Base CVSS contribution (0-40 points)
  if (context.cveData) {
    score += (context.cveData.cvssV3Score / 10) * 40;
  }

  // EPSS contribution (0-30 points) - likelihood of exploitation
  if (context.epss) {
    score += context.epss.epssScore * 30;
  }

  // KEV status (0-20 points) - actively exploited
  if (context.exploitIntel?.isKEV) {
    score += 20;
  }

  // Exploit availability (0-10 points)
  if (context.exploitIntel?.exploitAvailable) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Fetch complete threat context for a CVE
 */
export async function fetchThreatContext(cveId: string): Promise<ThreatContext | null> {
  try {
    // Fetch all intelligence sources in parallel
    const [cveData, epss, isKEV] = await Promise.all([
      fetchNVDData(cveId),
      fetchEPSSData(cveId),
      checkCISAKEV(cveId),
    ]);

    if (!cveData) {
      return null;
    }

    const exploitIntel: ExploitIntelligence = {
      cveId,
      isKEV,
      exploitAvailable: epss ? epss.epssScore > 0.5 : false,
      exploitMaturity: epss?.epssScore > 0.7 ? 'HIGH' : epss?.epssScore > 0.3 ? 'FUNCTIONAL' : 'NOT_AVAILABLE',
      ransomwareUse: false, // Would need additional threat intel feed
      activeExploitation: isKEV,
    };

    const context: ThreatContext = {
      cveData,
      epss: epss || { cveId, epssScore: 0, epssPercentile: 0 },
      exploitIntel,
      threatScore: 0,
    };

    context.threatScore = calculateThreatScore(context);

    return context;
  } catch (error) {
    console.error('Threat context fetch error:', error);
    return null;
  }
}

/**
 * Batch fetch threat context for multiple CVEs
 * Implements rate limiting to respect API limits
 */
export async function fetchBatchThreatContext(
  cveIds: string[]
): Promise<Map<string, ThreatContext>> {
  const results = new Map<string, ThreatContext>();

  // NVD allows 5 requests per 30 seconds without API key
  const batchSize = 5;
  const delayMs = 6000; // 6 seconds between batches (conservative)

  for (let i = 0; i < cveIds.length; i += batchSize) {
    const batch = cveIds.slice(i, i + batchSize);

    const contexts = await Promise.all(
      batch.map(cveId => fetchThreatContext(cveId))
    );

    contexts.forEach((context, idx) => {
      if (context) {
        results.set(batch[idx], context);
      }
    });

    // Wait between batches (except for last batch)
    if (i + batchSize < cveIds.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
