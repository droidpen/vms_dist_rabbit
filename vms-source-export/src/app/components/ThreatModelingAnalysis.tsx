import { Shield, Target, Brain, AlertTriangle, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Citation } from './Citation';
import { AttackChainVisualization } from './AttackChainVisualization';
import { AttackPathGraph } from './AttackPathGraph';
import { DIAGRAM_3_TIER, DIAGRAM_MICROSERVICES, DIAGRAM_AI_ML, DIAGRAM_SERVERLESS } from '../../lib/diagramConstants';

interface ThreatModelingAnalysisProps {
  architectureAnalysis?: {
    architectureType: string;
    hasAI: boolean;
  };
  threatModel?: {
    mitreAttackTactics: Array<{
      tactic: string;
      techniques: string[];
      description: string;
      reasoning?: string;
    }>;
    mitreAtlasTactics?: Array<{
      tactic: string;
      techniques: string[];
      description: string;
      reasoning?: string;
    }>;
    visualDiagram?: string;
  };
  cveId?: string;
}

export function ThreatModelingAnalysis({ architectureAnalysis, threatModel, cveId }: ThreatModelingAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Use provided CVE ID or infer from architecture type (for demos)
  const activeCVE = cveId || (() => {
    if (!architectureAnalysis?.architectureType) return null;
    const archType = architectureAnalysis.architectureType.toLowerCase();

    // Map architecture types to their demo CVEs
    if (archType.includes('3-tier') || archType.includes('payment')) {
      return 'CVE-2024-3400';
    } else if (archType.includes('microservices')) {
      return 'CVE-2023-44487';
    } else if (archType.match(/\b(ai|ml)\b/)) {
      return 'CVE-2023-25659';
    } else if (archType.includes('serverless')) {
      return 'CVE-2023-38545';
    }
    return null;
  })();

  console.log('[ThreatModelingAnalysis] Active CVE:', activeCVE, '(from prop:', cveId, ')');

  // Get diagram SVG based on architecture type
  const getDiagramSvg = (architectureType: string = 'unknown'): string | null => {
    const type = architectureType.toLowerCase();
    console.log('[ThreatModelingAnalysis] getDiagramSvg input:', architectureType, '| lowercase:', type);

    if (type === 'unknown') return null;

    if (type.match(/\b(ai|ml)\b/) || type.includes('machine learning') || type.includes('ai/ml')) {
      console.log('[ThreatModelingAnalysis] → Matched: AI/ML');
      return DIAGRAM_AI_ML;
    } else if (type.includes('microservices') || type.includes('micro-service')) {
      console.log('[ThreatModelingAnalysis] → Matched: Microservices');
      return DIAGRAM_MICROSERVICES;
    } else if (type.includes('serverless') || type.includes('lambda') || type.includes('event-driven')) {
      console.log('[ThreatModelingAnalysis] → Matched: Serverless');
      return DIAGRAM_SERVERLESS;
    } else if (type.includes('3-tier') || type.includes('three-tier') || type.includes('three tier')) {
      console.log('[ThreatModelingAnalysis] → Matched: 3-Tier');
      return DIAGRAM_3_TIER;
    }

    console.log('[ThreatModelingAnalysis] → No match, returning null (fallback diagram will show)');
    return null;
  };

  const diagramSvg = getDiagramSvg(architectureAnalysis?.architectureType || 'unknown');

  // Demo threat model
  const mockThreatModel = {
    mitreAttackTactics: [
      {
        tactic: 'Initial Access (TA0001)',
        techniques: ['T1190 - Exploit Public-Facing Application', 'T1078 - Valid Accounts'],
        description: 'Attackers may exploit CVE-2024-3400 to gain unauthorized access to the payment gateway.',
      },
      {
        tactic: 'Credential Access (TA0006)',
        techniques: ['T1110 - Brute Force', 'T1212 - Exploitation for Credential Access'],
        description: 'Basic authentication mechanism vulnerable to credential-based attacks.',
      },
      {
        tactic: 'Lateral Movement (TA0008)',
        techniques: ['T1021 - Remote Services'],
        description: 'Internal network deployment may allow lateral movement if perimeter is breached.',
      },
    ],
  };

  const model = threatModel || (architectureAnalysis ? mockThreatModel : null);

  return (
    <div className="border-2 border-border bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-b-2 border-border bg-secondary px-6 py-4 hover:bg-secondary/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 border-2 border-border bg-red-50">
            <Target className="w-5 h-5 text-red-600" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>
              Threat Modeling Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              MITRE ATT&CK and ATLAS framework mapping
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://attack.mitre.org/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-card hover:bg-secondary transition-colors text-sm"
            >
              <span style={{ fontFamily: 'var(--font-mono)' }}>ATT&CK</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
            <a
              href="https://atlas.mitre.org/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-card hover:bg-secondary transition-colors text-sm"
            >
              <span style={{ fontFamily: 'var(--font-mono)' }}>ATLAS</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-6">
          {!model ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" strokeWidth={1.5} />
              <p style={{ fontFamily: 'var(--font-mono)' }}>
                System architecture analysis required for threat modeling
              </p>
            </div>
          ) : (
          <div className="space-y-6">
            {/* Network Diagram Visualization */}
            {diagramSvg && (
              <div className="border-2 border-border bg-secondary/30 p-6">
                <div className="text-sm text-muted-foreground mb-4">Attack Surface Diagram</div>
                <div className="bg-white border-2 border-border p-4">
                  <div
                    className="w-full"
                    style={{ minHeight: '400px' }}
                    dangerouslySetInnerHTML={{ __html: diagramSvg }}
                  />
                </div>
              </div>
            )}

            {/* Fallback diagram if no architecture detected */}
            {!diagramSvg && (
              <div className="border-2 border-border bg-secondary/30 p-6">
                <div className="text-sm text-muted-foreground mb-4">Attack Surface Diagram</div>
                <div className="bg-white border-2 border-border p-8">
                  <svg viewBox="0 0 800 400" className="w-full h-auto">
                  {/* Internet/External Zone */}
                  <rect x="20" y="20" width="760" height="100" fill="#fee" stroke="#e53e3e" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="40" y="50" fontFamily="monospace" fontSize="14" fontWeight="600" fill="#c53030">EXTERNAL THREAT ZONE</text>
                  <circle cx="400" cy="80" r="20" fill="#fc8181" stroke="#c53030" strokeWidth="2" />
                  <text x="390" y="87" fontFamily="monospace" fontSize="12" fill="#1a202c">❌</text>

                  {/* Firewall/IPS */}
                  <rect x="350" y="140" width="100" height="40" fill="#4299e1" stroke="#2c5282" strokeWidth="2" />
                  <text x="368" y="165" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#fff">Firewall/IPS</text>
                  <line x1="400" y1="100" x2="400" y2="140" stroke="#718096" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* Internal Network Zone */}
                  <rect x="20" y="200" width="760" height="180" fill="#f0fff4" stroke="#38a169" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="40" y="230" fontFamily="monospace" fontSize="14" fontWeight="600" fill="#276749">INTERNAL NETWORK (CAM Access)</text>

                  {/* Presentation Layer */}
                  <rect x="100" y="260" width="150" height="60" fill="#90cdf4" stroke="#2c5282" strokeWidth="2" />
                  <text x="120" y="285" fontFamily="monospace" fontSize="11" fontWeight="600">Web Interface</text>
                  <text x="120" y="305" fontFamily="monospace" fontSize="10" fill="#2d3748">(Presentation)</text>
                  <line x1="400" y1="180" x2="175" y2="260" stroke="#718096" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* Application Layer */}
                  <rect x="325" y="260" width="150" height="60" fill="#90cdf4" stroke="#2c5282" strokeWidth="2" />
                  <text x="345" y="285" fontFamily="monospace" fontSize="11" fontWeight="600">Payment API</text>
                  <text x="345" y="305" fontFamily="monospace" fontSize="10" fill="#2d3748">(Application)</text>
                  <line x1="400" y1="180" x2="400" y2="260" stroke="#718096" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* Data Layer */}
                  <rect x="550" y="260" width="150" height="60" fill="#90cdf4" stroke="#2c5282" strokeWidth="2" />
                  <text x="570" y="285" fontFamily="monospace" fontSize="11" fontWeight="600">Database</text>
                  <text x="570" y="305" fontFamily="monospace" fontSize="10" fill="#2d3748">(Data Layer)</text>
                  <line x1="400" y1="180" x2="625" y2="260" stroke="#718096" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* CVE Vulnerability Indicator */}
                  <circle cx="400" cy="290" r="15" fill="#fed7d7" stroke="#e53e3e" strokeWidth="2" />
                  <text x="393" y="297" fontFamily="monospace" fontSize="14" fontWeight="600" fill="#c53030">⚠</text>

                  {/* Attack Path Arrows */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#718096" />
                    </marker>
                    <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#e53e3e" />
                    </marker>
                  </defs>

                  {/* Legend */}
                  <text x="40" y="365" fontFamily="monospace" fontSize="11" fontWeight="600" fill="#2d3748">Legend:</text>
                  <circle cx="120" cy="362" r="8" fill="#fc8181" stroke="#c53030" strokeWidth="1.5" />
                  <text x="135" y="367" fontFamily="monospace" fontSize="10" fill="#4a5568">Threat Actor</text>
                  <circle cx="250" cy="362" r="8" fill="#fed7d7" stroke="#e53e3e" strokeWidth="1.5" />
                  <text x="265" y="367" fontFamily="monospace" fontSize="10" fill="#4a5568">Vulnerability (CVE-2024-3400)</text>
                </svg>
              </div>
            </div>
            )}

            {/* CVE-Specific Attack Chain */}
            {activeCVE && (
              <div className="space-y-6">
                <AttackChainVisualization cveId={activeCVE} />
                
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                      Interactive Attack Path Graph
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visual representation of how {activeCVE} propagates through the {architectureAnalysis?.architectureType || 'system'} architecture. Nodes in red indicate critical vulnerability paths.
                  </p>
                  <AttackPathGraph 
                    systemType={architectureAnalysis?.architectureType || 'unknown'} 
                    cveId={activeCVE} 
                    killChain={[]} 
                  />
                </div>
              </div>
            )}

            {/* MITRE ATT&CK Tactics */}
            {model.mitreAttackTactics && model.mitreAttackTactics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                  Architecture-Based Threat Model
                </div>
              </div>
              <div className="space-y-4">
                {model.mitreAttackTactics.map((tactic, idx) => (
                  <div key={idx} className="border-2 border-border bg-card">
                    <div className="bg-red-50 border-b-2 border-border px-4 py-3">
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600 }} className="text-red-900 flex items-center">
                        <span>{tactic.tactic}</span>
                        {tactic.reasoning && (
                          <Citation
                            sources={[{
                              fileName: 'Architecture Pattern Detection',
                              excerpt: tactic.reasoning,
                              relevance: 'This tactic was selected based on detected architecture patterns'
                            }]}
                            inline
                            citationId={`attack-${idx}`}
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} className="text-foreground">
                        {tactic.description}
                      </p>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Relevant Techniques:</div>
                        <div className="space-y-1.5">
                          {tactic.techniques.map((technique, techIdx) => (
                            <div key={techIdx} className="flex items-center gap-2 p-2 bg-secondary/50 border border-border">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                                {technique}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* MITRE ATLAS (if AI system detected) */}
            {architectureAnalysis?.hasAI && model.mitreAtlasTactics && model.mitreAtlasTactics.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                    MITRE ATLAS Framework (AI/ML)
                  </div>
                </div>
                <div className="space-y-3">
                  {model.mitreAtlasTactics.map((tactic, idx) => (
                    <div key={idx} className="border-2 border-purple-300 bg-card">
                      <div className="bg-purple-50 border-b-2 border-purple-300 px-4 py-3">
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600 }} className="text-purple-900 flex items-center">
                          <span>{tactic.tactic}</span>
                          {tactic.reasoning && (
                            <Citation
                              sources={[{
                                fileName: 'AI/ML Architecture Detection',
                                excerpt: tactic.reasoning,
                                relevance: 'This tactic was selected based on AI/ML architecture patterns'
                              }]}
                              inline
                              citationId={`atlas-${idx}`}
                            />
                          )}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} className="text-foreground">
                          {tactic.description}
                        </p>
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Relevant Techniques:</div>
                          <div className="space-y-1.5">
                            {tactic.techniques.map((technique, techIdx) => (
                              <div key={techIdx} className="flex items-center gap-2 p-2 bg-purple-50 border border-purple-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                                  {technique}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
