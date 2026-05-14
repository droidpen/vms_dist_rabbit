import { SeverityBadge } from './SeverityBadge';
import { DataSourceBadge } from './DataSourceBadge';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  User,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Eye,
  AlertOctagon,
} from 'lucide-react';
import type { RiskAssessment } from '../../lib/riskEvaluationEngine';

interface RiskAcceptanceReviewProps {
  assessments: RiskAssessment[];
  uploadedDocs: string[];
}

export function RiskAcceptanceReview({ assessments, uploadedDocs }: RiskAcceptanceReviewProps) {
  if (assessments.length === 0) {
    return (
      <div className="border-2 border-border bg-card p-8 text-center">
        <div className="text-muted-foreground">No risk assessments available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {assessments.map((assessment, idx) => (
        <div key={idx} className="border-2 border-border bg-card">
          {/* Header */}
          <div className="p-4 border-b-2 border-border bg-secondary">
            <div className="flex items-start justify-between">
              <div>
                <h3 style={{ fontFamily: 'var(--font-mono)' }}>RA-2026-0042</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Officer 1 (Product Security)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    2026-04-10
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Expires 2026-07-10
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <SeverityBadge severity={assessment.baseSeverity} size="sm" />
                {assessment.adjustedSeverity !== assessment.baseSeverity && (
                  <>
                    <span className="text-muted-foreground">→</span>
                    <SeverityBadge severity={assessment.adjustedSeverity} size="sm" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Vulnerability */}
          <div className="p-4 border-b-2 border-border">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
              <span>VULNERABILITIES</span>
              {assessment.threatContext && <DataSourceBadge source="nvd" label="Live NVD Data" />}
              {!assessment.threatContext && <DataSourceBadge source="manual" label="Document Extracted" />}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-sm px-3 py-1 bg-secondary border border-border"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {assessment.cveId}
              </span>
              {assessment.threatContext?.exploitIntel.isKEV && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--severity-critical-bg)] border border-[var(--severity-critical-border)] text-[var(--severity-critical)]">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">CISA KEV</span>
                  <DataSourceBadge source="kev" showIcon={false} />
                </div>
              )}
              {assessment.threatContext && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>EPSS: {(assessment.threatContext.epss.epssScore * 100).toFixed(1)}%</span>
                    <DataSourceBadge source="epss" showIcon={false} />
                  </div>
                  <span className="mx-2">|</span>
                  <span>Risk Score: {assessment.riskScore}/100</span>
                </div>
              )}
            </div>
          </div>

          {/* Threat Intelligence */}
          {assessment.threatContext && (
            <div className="p-4 border-b-2 border-border bg-[var(--severity-info-bg)]">
              <div className="text-xs text-muted-foreground mb-3">THREAT INTELLIGENCE</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">CVSS Score</div>
                  <div className="font-medium">{assessment.threatContext.cveData.cvssV3Score}/10</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Exploitation Probability</div>
                  <div className="font-medium">
                    {(assessment.threatContext.epss.epssScore * 100).toFixed(1)}% (next 30 days)
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Threat Score</div>
                  <div className="font-medium">{assessment.threatContext.threatScore}/100</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Exploit Availability</div>
                  <div className="font-medium">
                    {assessment.threatContext.exploitIntel.exploitAvailable ? 'Public exploits available' : 'No public exploits'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Active Exploitation</div>
                  <div className="font-medium">
                    {assessment.threatContext.exploitIntel.isKEV ? 'Yes (CISA KEV)' : 'Not observed'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Exploit Maturity</div>
                  <div className="font-medium">{assessment.threatContext.exploitIntel.exploitMaturity.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Attack Path Analysis */}
          {assessment.attackPath && (
            <div className="p-4 border-b-2 border-border">
              <div className="text-xs text-muted-foreground mb-3">ATTACK PATH ANALYSIS</div>

              {/* Attack Characteristics */}
              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Attack Vector</div>
                  <div className="font-medium">{assessment.attackPath.attackVector.vector}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Complexity</div>
                  <div className="font-medium">{assessment.attackPath.attackVector.complexity}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Privileges Required</div>
                  <div className="font-medium">{assessment.attackPath.attackVector.privilegesRequired}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">User Interaction</div>
                  <div className="font-medium">{assessment.attackPath.attackVector.userInteraction}</div>
                </div>
              </div>

              {/* Kill Chain */}
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">MITRE ATT&CK Kill Chain</div>
                <div className="space-y-2">
                  {assessment.attackPath.killChain.map((phase, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-secondary border border-border">
                      <div className="flex-shrink-0 w-24">
                        <div className="text-xs font-medium">{phase.phase}</div>
                        {phase.mitreAttackTechnique && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {phase.mitreAttackTechnique}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{phase.description}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`text-xs px-2 py-1 border ${
                          phase.difficulty === 'TRIVIAL' || phase.difficulty === 'EASY' ? 'bg-[var(--severity-critical-bg)] border-[var(--severity-critical-border)] text-[var(--severity-critical)]' :
                          phase.difficulty === 'MODERATE' ? 'bg-[var(--severity-medium-bg)] border-[var(--severity-medium-border)] text-[var(--severity-medium)]' :
                          'bg-[var(--severity-low-bg)] border-[var(--severity-low-border)] text-[var(--severity-low)]'
                        }`}>
                          {phase.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environmental Scoring */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Exploitability
                  </div>
                  <div className="font-medium">{assessment.attackPath.exploitability}/100</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Lateral Movement
                  </div>
                  <div className="font-medium">{assessment.attackPath.lateralMovementPotential}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Privilege Escalation
                  </div>
                  <div className="font-medium">{assessment.attackPath.privilegeEscalation ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Detection Difficulty
                  </div>
                  <div className="font-medium">{assessment.attackPath.detectionDifficulty}</div>
                </div>
              </div>
            </div>
          )}

          {/* Proposed Controls */}
          <div className="p-4 border-b-2 border-border">
            <div className="text-xs text-muted-foreground mb-2">PROPOSED MITIGATING CONTROLS</div>
            <div className="space-y-2">
              <div className="flex gap-3 text-sm">
                <span className="text-muted-foreground">1.</span>
                <span>The server is hosted in the internal network which is only accessible by CAM and can only be accessed by authorized user.</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-muted-foreground">2.</span>
                <span>The web application is not used by any other users except Good Luck Infra.</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-muted-foreground">3.</span>
                <span>Firewall and IPS solution are implemented within the Good Luck Infra with network monitoring in place to aid in the detection of any potential malicious or unauthorized activities.</span>
              </div>
            </div>
          </div>

          {/* Control Validation */}
          {assessment.controlValidation.length > 0 && (
            <div className="p-4 border-b-2 border-border">
              <div className="text-xs text-muted-foreground mb-3">CONTROL EFFECTIVENESS (PURPLE TEAM VALIDATION)</div>
              <div className="space-y-3">
                {assessment.controlValidation.map((control, i) => (
                  <div key={i} className="p-3 bg-secondary border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 text-sm font-medium">{control.control}</div>
                      <span className={`text-xs px-2 py-1 border ml-3 ${
                        control.effectiveness === 'COMPLETE' || control.effectiveness === 'HIGH' ? 'bg-[var(--severity-low-bg)] border-[var(--severity-low-border)] text-[var(--severity-low)]' :
                        control.effectiveness === 'MEDIUM' ? 'bg-[var(--severity-medium-bg)] border-[var(--severity-medium-border)] text-[var(--severity-medium)]' :
                        'bg-[var(--severity-high-bg)] border-[var(--severity-high-border)] text-[var(--severity-high)]'
                      }`}>
                        {control.effectiveness} EFFECTIVENESS
                      </span>
                    </div>
                    {control.validatedAgainst.length > 0 && (
                      <div className="text-xs text-muted-foreground mb-1">
                        Validated against: {control.validatedAgainst.join(', ')}
                      </div>
                    )}
                    {control.bypasses.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Potential bypasses: {control.bypasses.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supporting Documents */}
          <div className="p-4 border-b-2 border-border">
            <div className="text-xs text-muted-foreground mb-2">SUPPORTING DOCUMENTS</div>
            <div className="grid grid-cols-2 gap-2">
              {uploadedDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm p-2 bg-secondary border border-border">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div className="p-4 border-b-2 border-border">
            <div className="text-xs text-muted-foreground mb-3">ASSESSMENT</div>

            {/* Strengths */}
            {assessment.strengths.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-[var(--severity-low)] mb-2 font-medium">STRENGTHS</div>
                <div className="space-y-1">
                  {assessment.strengths.map((strength, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-[var(--severity-low)]">✓</span>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning */}
            {assessment.reasoning.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">DETAILED REASONING</div>
                <div className="space-y-1">
                  {assessment.reasoning.map((reason, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concerns */}
            {assessment.concerns.length > 0 && (
              <div className="p-3 bg-[var(--severity-high-bg)] border-2 border-[var(--severity-high-border)]">
                <div className="text-xs text-[var(--severity-high)] mb-2 font-medium">CONCERNS IDENTIFIED</div>
                <div className="space-y-1">
                  {assessment.concerns.map((concern, i) => (
                    <div key={i} className="flex gap-2 text-sm text-[var(--severity-high)]">
                      <span>⚠</span>
                      <span>{concern}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-secondary">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-2">RECOMMENDATION</div>
                <div className="flex items-center gap-3">
                  {assessment.recommendation === 'APPROVE' && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[var(--severity-low)]" />
                      <span className="text-[var(--severity-low)]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        APPROVE
                      </span>
                    </>
                  )}
                  {assessment.recommendation === 'REJECT' && (
                    <>
                      <XCircle className="w-5 h-5 text-[var(--severity-critical)]" />
                      <span className="text-[var(--severity-critical)]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        REJECT
                      </span>
                    </>
                  )}
                  {assessment.recommendation === 'REQUEST_INFO' && (
                    <>
                      <AlertTriangle className="w-5 h-5 text-[var(--severity-medium)]" />
                      <span className="text-[var(--severity-medium)]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        REQUEST ADDITIONAL INFORMATION
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Risk Score: <span className="font-medium">{assessment.riskScore}/100</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
