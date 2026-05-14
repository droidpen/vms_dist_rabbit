/**
 * Elite Risk Evaluation Engine
 * Combines threat intelligence, attack path analysis, and control validation
 * for comprehensive risk acceptance decision support
 */

import { ThreatContext, fetchThreatContext } from './threatIntelligence';
import {
  AttackPathAnalysis,
  EnvironmentContext,
  analyzeAttackPath,
  ControlEffectiveness,
} from './attackPathAnalysis';

export interface RiskAssessment {
  cveId: string;
  baseSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  adjustedSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  threatContext?: ThreatContext;
  attackPath?: AttackPathAnalysis;
  controlValidation: ControlEffectiveness[];
  riskScore: number; // 0-100
  recommendation: 'APPROVE' | 'REJECT' | 'REQUEST_INFO';
  reasoning: string[];
  concerns: string[];
  strengths: string[];
}

export interface EvaluationInput {
  cveId: string;
  baseCVSS: number;
  cvssVector: string;
  baseSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  environment: EnvironmentContext;
  proposedControls: string[];
  businessContext?: string;
}

/**
 * Determine adjusted severity based on environmental factors
 */
export function calculateAdjustedSeverity(
  baseSeverity: string,
  environmentalScore: number,
  threatScore: number
): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' {
  // Calculate weighted score
  const avgScore = (environmentalScore * 0.7 + (threatScore / 10) * 0.3);

  if (avgScore >= 9.0) return 'CRITICAL';
  if (avgScore >= 7.0) return 'HIGH';
  if (avgScore >= 4.0) return 'MEDIUM';
  if (avgScore >= 0.1) return 'LOW';
  return 'INFO';
}

/**
 * Calculate composite risk score (0-100)
 */
function calculateRiskScore(
  threatContext: ThreatContext | undefined,
  attackPath: AttackPathAnalysis | undefined,
  controlEffectiveness: ControlEffectiveness[]
): number {
  let score = 0;

  // Threat intelligence component (0-35 points)
  if (threatContext) {
    score += (threatContext.threatScore / 100) * 35;
  } else {
    // No threat intel, assume moderate threat
    score += 15;
  }

  // Attack path component (0-35 points)
  if (attackPath) {
    score += (attackPath.exploitability / 100) * 20;
    score += attackPath.lateralMovementPotential === 'EXTENSIVE' ? 10 :
             attackPath.lateralMovementPotential === 'MODERATE' ? 6 :
             attackPath.lateralMovementPotential === 'LIMITED' ? 3 : 0;
    score += attackPath.privilegeEscalation ? 5 : 0;
  } else {
    score += 15;
  }

  // Control effectiveness component (reduces score, 0-30 points reduction)
  const controlScore = controlEffectiveness.reduce((acc, ctrl) => {
    if (ctrl.effectiveness === 'COMPLETE') return acc + 10;
    if (ctrl.effectiveness === 'HIGH') return acc + 7;
    if (ctrl.effectiveness === 'MEDIUM') return acc + 4;
    if (ctrl.effectiveness === 'LOW') return acc + 2;
    return acc;
  }, 0);

  score -= Math.min(30, controlScore);

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Generate reasoning for recommendation
 */
function generateReasoning(
  input: EvaluationInput,
  assessment: RiskAssessment
): { reasoning: string[]; concerns: string[]; strengths: string[] } {
  const reasoning: string[] = [];
  const concerns: string[] = [];
  const strengths: string[] = [];

  // Threat context reasoning
  if (assessment.threatContext) {
    const tc = assessment.threatContext;

    if (tc.exploitIntel.isKEV) {
      concerns.push('CISA KEV: Actively exploited in the wild');
      reasoning.push(`${input.cveId} is listed in CISA Known Exploited Vulnerabilities catalog`);
    }

    if (tc.epss.epssScore > 0.5) {
      concerns.push(`High exploitation probability: ${(tc.epss.epssScore * 100).toFixed(1)}% in next 30 days`);
      reasoning.push(`EPSS score indicates ${(tc.epss.epssScore * 100).toFixed(1)}% likelihood of exploitation`);
    } else {
      strengths.push(`Low exploitation probability: ${(tc.epss.epssScore * 100).toFixed(1)}%`);
    }

    if (tc.exploitIntel.exploitAvailable) {
      concerns.push('Public exploits available');
    }
  }

  // Attack path reasoning
  if (assessment.attackPath) {
    const ap = assessment.attackPath;

    // Network accessibility
    if (ap.attackVector.vector === 'NETWORK') {
      if (input.environment.deployment === 'INTERNET_FACING') {
        concerns.push('Network-exploitable vulnerability on internet-facing system');
      } else {
        strengths.push('Network-exploitable but not internet-facing');
        reasoning.push('Internal deployment reduces attack surface');
      }
    } else {
      strengths.push(`${ap.attackVector.vector} attack vector limits exploitability`);
    }

    // Complexity
    if (ap.attackVector.complexity === 'LOW' && ap.attackVector.privilegesRequired === 'NONE') {
      concerns.push('Low complexity, no authentication required - easily exploitable');
    } else {
      strengths.push('Attack complexity or authentication requirements increase exploit difficulty');
    }

    // Lateral movement
    if (ap.lateralMovementPotential === 'EXTENSIVE') {
      concerns.push('High lateral movement potential - could spread to other systems');
    } else if (ap.lateralMovementPotential === 'NONE' || ap.lateralMovementPotential === 'LIMITED') {
      strengths.push('Limited lateral movement potential contains breach');
    }

    // Environmental score adjustment
    if (ap.environmentalScore < input.baseCVSS * 0.7) {
      strengths.push(`Environmental controls reduce effective CVSS from ${input.baseCVSS} to ${ap.environmentalScore.toFixed(1)}`);
      reasoning.push('Compensating controls significantly reduce risk');
    }
  }

  // Control validation reasoning
  const highEffectivenessControls = assessment.controlValidation.filter(c => c.effectiveness === 'HIGH' || c.effectiveness === 'COMPLETE');
  const lowEffectivenessControls = assessment.controlValidation.filter(c => c.effectiveness === 'LOW' || c.effectiveness === 'NONE');

  if (highEffectivenessControls.length > 0) {
    strengths.push(`${highEffectivenessControls.length} highly effective compensating controls in place`);
    reasoning.push(`Controls validated: ${highEffectivenessControls.map(c => c.control).join(', ')}`);
  }

  if (lowEffectivenessControls.length > 0) {
    concerns.push(`${lowEffectivenessControls.length} proposed controls have low effectiveness against this attack path`);
  }

  // Detection capability
  if (assessment.attackPath?.detectionDifficulty === 'EASY') {
    strengths.push('Strong detection capability for exploitation attempts');
  } else if (assessment.attackPath?.detectionDifficulty === 'HARD' || assessment.attackPath?.detectionDifficulty === 'VERY_HARD') {
    concerns.push('Limited detection capability for exploitation attempts');
  }

  return { reasoning, concerns, strengths };
}

/**
 * Generate final recommendation
 */
function generateRecommendation(
  assessment: RiskAssessment,
  input: EvaluationInput
): 'APPROVE' | 'REJECT' | 'REQUEST_INFO' {
  // Auto-reject if CISA KEV
  if (assessment.threatContext?.exploitIntel.isKEV) {
    return 'REJECT';
  }

  // Auto-reject if CRITICAL with high risk score
  if (assessment.baseSeverity === 'CRITICAL' && assessment.riskScore > 70) {
    return 'REJECT';
  }

  // Request more info if insufficient controls for HIGH/CRITICAL
  if ((assessment.baseSeverity === 'CRITICAL' || assessment.baseSeverity === 'HIGH') &&
      assessment.controlValidation.filter(c => c.effectiveness === 'HIGH' || c.effectiveness === 'COMPLETE').length === 0) {
    return 'REQUEST_INFO';
  }

  // Approve if risk score is low enough
  if (assessment.riskScore < 30) {
    return 'APPROVE';
  }

  // Approve with conditions if MEDIUM or lower with good controls
  if ((assessment.adjustedSeverity === 'MEDIUM' || assessment.adjustedSeverity === 'LOW') &&
      assessment.controlValidation.filter(c => c.effectiveness === 'HIGH').length >= 2) {
    return 'APPROVE';
  }

  // Request more info for borderline cases
  if (assessment.riskScore >= 30 && assessment.riskScore <= 60) {
    return 'REQUEST_INFO';
  }

  // Reject high risk
  return 'REJECT';
}

/**
 * Perform comprehensive risk evaluation
 */
export async function evaluateRisk(
  input: EvaluationInput,
  fetchThreatIntel: boolean = true
): Promise<RiskAssessment> {
  // Fetch threat intelligence if enabled
  let threatContext: ThreatContext | undefined;
  if (fetchThreatIntel) {
    threatContext = await fetchThreatContext(input.cveId) || undefined;
  }

  // Analyze attack paths
  const attackPath = analyzeAttackPath(
    input.cveId,
    input.cvssVector,
    input.baseCVSS,
    input.environment,
    input.proposedControls
  );

  // Validate controls
  const controlValidation = attackPath.killChain.length > 0
    ? attackPath.attackPath?.controlValidation || []
    : [];

  // Calculate adjusted severity
  const adjustedSeverity = calculateAdjustedSeverity(
    input.baseSeverity,
    attackPath.environmentalScore,
    threatContext?.threatScore || 50
  );

  // Calculate risk score
  const riskScore = calculateRiskScore(threatContext, attackPath, controlValidation);

  // Create initial assessment
  const assessment: RiskAssessment = {
    cveId: input.cveId,
    baseSeverity: input.baseSeverity,
    adjustedSeverity,
    threatContext,
    attackPath,
    controlValidation,
    riskScore,
    recommendation: 'REQUEST_INFO',
    reasoning: [],
    concerns: [],
    strengths: [],
  };

  // Generate reasoning
  const { reasoning, concerns, strengths } = generateReasoning(input, assessment);
  assessment.reasoning = reasoning;
  assessment.concerns = concerns;
  assessment.strengths = strengths;

  // Generate final recommendation
  assessment.recommendation = generateRecommendation(assessment, input);

  return assessment;
}

/**
 * Batch evaluate multiple CVEs
 */
export async function evaluateBatchRisk(
  inputs: EvaluationInput[],
  fetchThreatIntel: boolean = true
): Promise<RiskAssessment[]> {
  // Process in parallel with concurrency limit
  const maxConcurrent = 3;
  const results: RiskAssessment[] = [];

  for (let i = 0; i < inputs.length; i += maxConcurrent) {
    const batch = inputs.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(input => evaluateRisk(input, fetchThreatIntel))
    );
    results.push(...batchResults);
  }

  return results;
}
