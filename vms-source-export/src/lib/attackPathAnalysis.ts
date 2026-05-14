/**
 * Attack Path Analysis Engine
 * Red Team / Purple Team perspective on attack vectors and exploitation paths
 */

export interface AttackVector {
  vector: 'NETWORK' | 'ADJACENT' | 'LOCAL' | 'PHYSICAL';
  complexity: 'LOW' | 'HIGH';
  privilegesRequired: 'NONE' | 'LOW' | 'HIGH';
  userInteraction: 'NONE' | 'REQUIRED';
}

export interface ImpactAnalysis {
  confidentiality: 'NONE' | 'LOW' | 'HIGH';
  integrity: 'NONE' | 'LOW' | 'HIGH';
  availability: 'NONE' | 'LOW' | 'HIGH';
  scope: 'UNCHANGED' | 'CHANGED';
}

export interface AttackPath {
  phase: string;
  description: string;
  mitreAttackTechnique?: string;
  difficulty: 'TRIVIAL' | 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD';
}

export interface EnvironmentContext {
  deployment: 'INTERNET_FACING' | 'INTERNAL' | 'ISOLATED' | 'AIR_GAPPED';
  networkSegmentation: boolean;
  authentication: 'NONE' | 'BASIC' | 'MFA' | 'CERTIFICATE';
  monitoring: 'NONE' | 'BASIC' | 'SIEM' | 'EDR_XDR';
  patchCadence: 'IMMEDIATE' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'NEVER';
}

export interface ControlEffectiveness {
  control: string;
  effectiveness: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'COMPLETE';
  bypasses: string[];
  validatedAgainst: string[];
}

export interface AttackPathAnalysis {
  cveId: string;
  attackVector: AttackVector;
  impact: ImpactAnalysis;
  killChain: AttackPath[];
  exploitability: number; // 0-100
  lateralMovementPotential: 'NONE' | 'LIMITED' | 'MODERATE' | 'EXTENSIVE';
  privilegeEscalation: boolean;
  persistenceMechanisms: string[];
  detectionDifficulty: 'TRIVIAL' | 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD';
  environmentalScore: number; // Context-adjusted CVSS
  attackPath?: {
    controlValidation: ControlEffectiveness[];
  };
}

/**
 * Parse CVSS vector to extract attack characteristics
 */
export function parseCVSSVector(vectorString: string): AttackVector & ImpactAnalysis {
  const components = vectorString.split('/');
  const vectorMap: Record<string, string> = {};

  components.forEach(component => {
    const [key, value] = component.split(':');
    if (key && value) {
      vectorMap[key] = value;
    }
  });

  return {
    vector: vectorMap['AV'] === 'N' ? 'NETWORK' :
            vectorMap['AV'] === 'A' ? 'ADJACENT' :
            vectorMap['AV'] === 'L' ? 'LOCAL' : 'PHYSICAL',
    complexity: vectorMap['AC'] === 'L' ? 'LOW' : 'HIGH',
    privilegesRequired: vectorMap['PR'] === 'N' ? 'NONE' :
                        vectorMap['PR'] === 'L' ? 'LOW' : 'HIGH',
    userInteraction: vectorMap['UI'] === 'N' ? 'NONE' : 'REQUIRED',
    confidentiality: (vectorMap['C'] as any) || 'NONE',
    integrity: (vectorMap['I'] as any) || 'NONE',
    availability: (vectorMap['A'] as any) || 'NONE',
    scope: vectorMap['S'] === 'C' ? 'CHANGED' : 'UNCHANGED',
  };
}

/**
 * Generate attack kill chain based on CVE characteristics
 */
export function generateKillChain(
  cveId: string,
  attackVector: AttackVector,
  impact: ImpactAnalysis
): AttackPath[] {
  const killChain: AttackPath[] = [];

  // Phase 1: Initial Access
  if (attackVector.vector === 'NETWORK') {
    killChain.push({
      phase: 'Initial Access',
      description: attackVector.userInteraction === 'NONE'
        ? 'Direct network exploitation without user interaction'
        : 'Social engineering required for initial access',
      mitreAttackTechnique: attackVector.userInteraction === 'NONE' ? 'T1190' : 'T1566',
      difficulty: attackVector.complexity === 'LOW' ? 'EASY' : 'MODERATE',
    });
  } else if (attackVector.vector === 'ADJACENT') {
    killChain.push({
      phase: 'Initial Access',
      description: 'Requires adjacent network access (same network segment)',
      mitreAttackTechnique: 'T1200',
      difficulty: 'MODERATE',
    });
  } else {
    killChain.push({
      phase: 'Initial Access',
      description: 'Requires local access or physical presence',
      mitreAttackTechnique: 'T1078',
      difficulty: 'HARD',
    });
  }

  // Phase 2: Execution
  killChain.push({
    phase: 'Execution',
    description: `Execute exploit code ${attackVector.privilegesRequired === 'NONE' ? 'without authentication' : 'with user-level privileges'}`,
    mitreAttackTechnique: 'T1203',
    difficulty: attackVector.complexity === 'LOW' ? 'EASY' : 'MODERATE',
  });

  // Phase 3: Privilege Escalation (if scope changed)
  if (impact.scope === 'CHANGED') {
    killChain.push({
      phase: 'Privilege Escalation',
      description: 'Escalate privileges to compromise system integrity',
      mitreAttackTechnique: 'T1068',
      difficulty: 'MODERATE',
    });
  }

  // Phase 4: Impact
  const impacts = [];
  if (impact.confidentiality === 'HIGH') impacts.push('data exfiltration');
  if (impact.integrity === 'HIGH') impacts.push('system modification');
  if (impact.availability === 'HIGH') impacts.push('service disruption');

  killChain.push({
    phase: 'Impact',
    description: `Achieve impact: ${impacts.join(', ')}`,
    mitreAttackTechnique: impact.availability === 'HIGH' ? 'T1499' : 'T1485',
    difficulty: 'EASY',
  });

  return killChain;
}

/**
 * Calculate environmental CVSS score based on deployment context
 */
export function calculateEnvironmentalScore(
  baseCVSS: number,
  environment: EnvironmentContext
): number {
  let modifier = 1.0;

  // Deployment exposure
  if (environment.deployment === 'AIR_GAPPED') modifier *= 0.3;
  else if (environment.deployment === 'ISOLATED') modifier *= 0.5;
  else if (environment.deployment === 'INTERNAL') modifier *= 0.7;
  else if (environment.deployment === 'INTERNET_FACING') modifier *= 1.2;

  // Network segmentation
  if (environment.networkSegmentation) modifier *= 0.8;

  // Authentication
  if (environment.authentication === 'CERTIFICATE') modifier *= 0.6;
  else if (environment.authentication === 'MFA') modifier *= 0.7;
  else if (environment.authentication === 'BASIC') modifier *= 0.9;

  // Monitoring
  if (environment.monitoring === 'EDR_XDR') modifier *= 0.7;
  else if (environment.monitoring === 'SIEM') modifier *= 0.8;
  else if (environment.monitoring === 'BASIC') modifier *= 0.9;

  return Math.min(10, baseCVSS * modifier);
}

/**
 * Validate control effectiveness against attack paths (Purple Team)
 */
export function validateControls(
  killChain: AttackPath[],
  controls: string[]
): ControlEffectiveness[] {
  return controls.map(control => {
    const effectiveness = assessControlEffectiveness(control, killChain);
    return {
      control,
      effectiveness: effectiveness.level,
      bypasses: effectiveness.bypasses,
      validatedAgainst: effectiveness.phases,
    };
  });
}

function assessControlEffectiveness(
  control: string,
  killChain: AttackPath[]
): { level: ControlEffectiveness['effectiveness']; bypasses: string[]; phases: string[] } {
  const controlLower = control.toLowerCase();
  const bypasses: string[] = [];
  const phases: string[] = [];

  // Network controls
  if (controlLower.includes('firewall') || controlLower.includes('network segmentation')) {
    phases.push('Initial Access');
    if (killChain.some(p => p.phase === 'Initial Access' && p.description.includes('network'))) {
      if (controlLower.includes('monitoring')) {
        return { level: 'HIGH', bypasses: ['Encrypted C2 channels'], phases };
      }
      return { level: 'MEDIUM', bypasses: ['Allowed protocols', 'Misconfiguration'], phases };
    }
  }

  // Authentication controls
  if (controlLower.includes('mfa') || controlLower.includes('authentication')) {
    phases.push('Initial Access');
    if (killChain.some(p => p.mitreAttackTechnique === 'T1078')) {
      return { level: 'HIGH', bypasses: ['Stolen tokens', 'Session hijacking'], phases };
    }
    return { level: 'MEDIUM', bypasses: ['Bypass vulnerabilities'], phases };
  }

  // Monitoring/Detection controls
  if (controlLower.includes('ids') || controlLower.includes('ips') ||
      controlLower.includes('siem') || controlLower.includes('monitoring')) {
    phases.push('Execution', 'Impact');
    return { level: 'MEDIUM', bypasses: ['Living off the land', 'Encrypted traffic'], phases };
  }

  // WAF controls
  if (controlLower.includes('waf')) {
    phases.push('Initial Access', 'Execution');
    return { level: 'MEDIUM', bypasses: ['Protocol smuggling', 'Rule bypasses'], phases };
  }

  // EDR/Endpoint controls
  if (controlLower.includes('edr') || controlLower.includes('endpoint')) {
    phases.push('Execution', 'Privilege Escalation');
    return { level: 'HIGH', bypasses: ['Kernel exploits', 'Direct memory access'], phases };
  }

  // Access controls
  if (controlLower.includes('access') || controlLower.includes('authorized')) {
    phases.push('Initial Access');
    return { level: 'MEDIUM', bypasses: ['Credential theft', 'Insider threat'], phases };
  }

  // Default for unrecognized controls
  return { level: 'LOW', bypasses: ['Unknown - validation needed'], phases: [] };
}

/**
 * Perform comprehensive attack path analysis
 */
export function analyzeAttackPath(
  cveId: string,
  cvssVector: string,
  baseCVSS: number,
  environment: EnvironmentContext,
  proposedControls: string[]
): AttackPathAnalysis {
  const parsed = parseCVSSVector(cvssVector);
  const killChain = generateKillChain(cveId, parsed, parsed);
  const environmentalScore = calculateEnvironmentalScore(baseCVSS, environment);
  const controlValidation = validateControls(killChain, proposedControls);

  // Calculate exploitability
  let exploitability = 0;
  if (parsed.complexity === 'LOW') exploitability += 50;
  else exploitability += 20;
  if (parsed.privilegesRequired === 'NONE') exploitability += 30;
  else if (parsed.privilegesRequired === 'LOW') exploitability += 15;
  if (parsed.userInteraction === 'NONE') exploitability += 20;
  else exploitability += 5;

  // Assess lateral movement
  const lateralMovement = parsed.scope === 'CHANGED' ? 'EXTENSIVE' :
                         parsed.vector === 'NETWORK' ? 'MODERATE' :
                         parsed.vector === 'ADJACENT' ? 'LIMITED' : 'NONE';

  // Detection difficulty based on controls
  const hasEDR = proposedControls.some(c => c.toLowerCase().includes('edr'));
  const hasSIEM = proposedControls.some(c => c.toLowerCase().includes('siem') || c.toLowerCase().includes('monitoring'));
  const detectionDifficulty = hasEDR ? 'EASY' :
                              hasSIEM ? 'MODERATE' : 'HARD';

  return {
    cveId,
    attackVector: parsed,
    impact: parsed,
    killChain,
    exploitability,
    lateralMovementPotential: lateralMovement,
    privilegeEscalation: parsed.scope === 'CHANGED',
    persistenceMechanisms: parsed.scope === 'CHANGED' ?
      ['Registry modification', 'Scheduled tasks', 'Service creation'] : [],
    detectionDifficulty,
    environmentalScore,
    attackPath: {
      controlValidation,
    },
  };
}
