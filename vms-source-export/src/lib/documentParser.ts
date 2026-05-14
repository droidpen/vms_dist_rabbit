/**
 * Document Parser
 * Extracts CVE IDs, CVSS scores, and risk acceptance details from uploaded documents
 */

export interface ExtractedCVEData {
  cveId: string;
  cvssScore?: number;
  cvssVector?: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  description?: string;
  proposedControls: string[];
  businessContext?: string;
  acceptancePeriod?: number; // days
}

/**
 * Extract CVE IDs from text content
 * Matches patterns like CVE-2024-3400, CVE-2023-44487
 */
function extractCVEIds(content: string): string[] {
  const cvePattern = /CVE-\d{4}-\d{4,7}/gi;
  const matches = content.match(cvePattern);

  if (!matches) return [];

  // Deduplicate and uppercase
  return [...new Set(matches.map(cve => cve.toUpperCase()))];
}

/**
 * Extract CVSS score from text
 * Matches patterns like "CVSS: 7.5", "CVSS Score: 10.0", "CVSS v3.1: 6.5"
 */
function extractCVSSScore(content: string): number | null {
  const patterns = [
    /CVSS\s*(?:v?3\.\d\s*)?(?:Score)?:\s*(\d+\.?\d*)/i,
    /CVSS\s*(?:Base\s*)?Score\s*(?:is|=)?\s*(\d+\.?\d*)/i,
    /Score:\s*(\d+\.?\d*)\s*\/\s*10/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const score = parseFloat(match[1]);
      if (score >= 0 && score <= 10) {
        return score;
      }
    }
  }

  return null;
}

/**
 * Extract CVSS vector string
 * Matches patterns like "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N"
 */
function extractCVSSVector(content: string): string | null {
  const pattern = /CVSS:3\.\d\/[A-Z]+:[A-Z](?:\/[A-Z]+:[A-Z])+/i;
  const match = content.match(pattern);
  return match ? match[0] : null;
}

/**
 * Extract severity from text
 */
function extractSeverity(content: string): ExtractedCVEData['severity'] | null {
  const patterns = [
    /severity:\s*(critical|high|medium|low)/i,
    /severity\s*(?:level|rating)?:\s*(critical|high|medium|low)/i,
    /(critical|high|medium|low)\s*severity/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].toUpperCase() as ExtractedCVEData['severity'];
    }
  }

  // Infer from CVSS score if found
  const cvssScore = extractCVSSScore(content);
  if (cvssScore !== null) {
    if (cvssScore >= 9.0) return 'CRITICAL';
    if (cvssScore >= 7.0) return 'HIGH';
    if (cvssScore >= 4.0) return 'MEDIUM';
    if (cvssScore > 0) return 'LOW';
    return 'NONE';
  }

  return null;
}

/**
 * Extract compensating/mitigating controls from text
 */
function extractControls(content: string): string[] {
  const controls: string[] = [];

  // Pattern 1: Bullet points or numbered lists
  const bulletPatterns = [
    /(?:^|\n)\s*[-•*]\s*(.+?)(?=\n|$)/g,
    /(?:^|\n)\s*\d+\.\s*(.+?)(?=\n|$)/g,
  ];

  // Pattern 2: Explicit sections mentioning controls/mitigations
  const controlSections = [
    /(?:compensating|mitigating|mitigation)\s+controls?:?\s*([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i,
    /proposed\s+controls?:?\s*([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i,
    /security\s+measures?:?\s*([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i,
  ];

  // Extract from control sections first
  for (const pattern of controlSections) {
    const match = content.match(pattern);
    if (match) {
      const sectionContent = match[1];

      // Extract bullet points from this section
      for (const bulletPattern of bulletPatterns) {
        const bullets = [...sectionContent.matchAll(bulletPattern)];
        bullets.forEach(b => {
          const control = b[1].trim();
          if (control.length > 10 && control.length < 500) {
            controls.push(control);
          }
        });
      }
    }
  }

  // Pattern 3: Common control keywords
  const controlKeywords = [
    /network\s+segmentation/i,
    /firewall/i,
    /IPS|IDS|intrusion\s+(?:prevention|detection)/i,
    /SIEM|security\s+information\s+and\s+event\s+management/i,
    /monitoring/i,
    /access\s+control/i,
    /authentication/i,
    /internal\s+network/i,
    /CAM\s+access/i,
  ];

  const sentences = content.split(/[.!?]\s+/);
  sentences.forEach(sentence => {
    for (const keyword of controlKeywords) {
      if (keyword.test(sentence) && sentence.length > 20 && sentence.length < 500) {
        if (!controls.some(c => c.toLowerCase().includes(sentence.toLowerCase().substring(0, 30)))) {
          controls.push(sentence.trim());
          break; // Only add once per sentence
        }
      }
    }
  });

  return controls.slice(0, 10); // Limit to top 10 controls
}

/**
 * Extract business context
 */
function extractBusinessContext(content: string): string | null {
  const patterns = [
    /(?:business\s+context|justification):?\s*(.+?)(?=\n\n|\n[A-Z]|$)/i,
    /(?:reason|rationale)\s+for\s+(?:acceptance|risk):?\s*(.+?)(?=\n\n|\n[A-Z]|$)/i,
    /(?:legacy|temporary|migration|decommission).{0,100}/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0].trim().substring(0, 500);
    }
  }

  return null;
}

/**
 * Extract acceptance period (in days)
 */
function extractAcceptancePeriod(content: string): number | null {
  const patterns = [
    /(\d+)\s*[-–]\s*day/i,
    /(\d+)\s*day\s*(?:acceptance|window|period)/i,
    /(?:acceptance|window|period)\s*(?:of)?\s*(\d+)\s*days?/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const days = parseInt(match[1], 10);
      if (days > 0 && days <= 365) {
        return days;
      }
    }
  }

  return null;
}

/**
 * Parse single file content
 */
async function parseFile(file: File): Promise<ExtractedCVEData[]> {
  try {
    const text = await file.text();
    const cveIds = extractCVEIds(text);

    if (cveIds.length === 0) {
      return [];
    }

    // For each CVE found, extract associated data
    return cveIds.map(cveId => ({
      cveId,
      cvssScore: extractCVSSScore(text) || undefined,
      cvssVector: extractCVSSVector(text) || undefined,
      severity: extractSeverity(text) || undefined,
      proposedControls: extractControls(text),
      businessContext: extractBusinessContext(text) || undefined,
      acceptancePeriod: extractAcceptancePeriod(text) || undefined,
    }));
  } catch (error) {
    console.error('File parsing error:', error);
    return [];
  }
}

/**
 * Parse all uploaded files and extract CVE data
 */
export async function parseUploadedDocuments(files: {
  presentation: File[];
  email: File[];
  evidence: File[];
}): Promise<ExtractedCVEData[]> {
  const allFiles = [
    ...files.presentation,
    ...files.email,
    ...files.evidence,
  ];

  console.log(`📄 Parsing ${allFiles.length} documents for CVE data...`);

  const results = await Promise.all(allFiles.map(parseFile));
  const allCVEs = results.flat();

  console.log(`  ✓ Found ${allCVEs.length} CVE entries`);
  allCVEs.forEach(cve => {
    console.log(`    - ${cve.cveId}: CVSS ${cve.cvssScore || 'N/A'}, ${cve.proposedControls.length} controls`);
  });

  // Merge data for the same CVE from multiple files
  const merged = new Map<string, ExtractedCVEData>();

  allCVEs.forEach(cve => {
    if (merged.has(cve.cveId)) {
      const existing = merged.get(cve.cveId)!;

      // Merge controls (deduplicate)
      const allControls = [...existing.proposedControls, ...cve.proposedControls];
      const uniqueControls = [...new Set(allControls)];

      merged.set(cve.cveId, {
        cveId: cve.cveId,
        cvssScore: cve.cvssScore || existing.cvssScore,
        cvssVector: cve.cvssVector || existing.cvssVector,
        severity: cve.severity || existing.severity,
        proposedControls: uniqueControls,
        businessContext: cve.businessContext || existing.businessContext,
        acceptancePeriod: cve.acceptancePeriod || existing.acceptancePeriod,
      });
    } else {
      merged.set(cve.cveId, cve);
    }
  });

  return Array.from(merged.values());
}

/**
 * Fallback CVE data for demos (using real CVEs)
 */
export const FALLBACK_CVE_DATA: ExtractedCVEData = {
  cveId: 'CVE-2024-3400',
  cvssScore: 10.0,
  cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
  severity: 'CRITICAL',
  proposedControls: [
    'Network segmentation: Internal network, CAM access only',
    'Perimeter defense: Firewall + IPS blocking exploit patterns',
    'Detection: SIEM monitoring for unauthorized API access',
    'Exposure reduction: Limited to authorized users only',
  ],
  businessContext: 'Legacy system migration - temporary 90-day risk acceptance window before decommission',
  acceptancePeriod: 90,
};
