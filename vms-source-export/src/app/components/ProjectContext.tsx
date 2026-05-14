import { useState, useEffect } from 'react';
import { Building2, Layers, ChevronDown, ChevronUp, Shield, Database, Globe, Server } from 'lucide-react';
import { getProject } from '../../lib/uploadHelpers';
import { DIAGRAM_3_TIER, DIAGRAM_MICROSERVICES, DIAGRAM_AI_ML, DIAGRAM_SERVERLESS } from '../../lib/diagramConstants';

type ProjectContextProps = {
  projectName: string;
  uploadedFilesCount?: number;
  reloadTrigger?: number;
};

export function ProjectContext({ projectName, uploadedFilesCount = 0, reloadTrigger = 0 }: ProjectContextProps) {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      console.log('🏢 ProjectContext loading project:', projectName, '(trigger:', reloadTrigger, ')');
      setLoading(true);
      const data = await getProject(projectName);
      console.log('  📊 Project data loaded:', data ? 'Found in DB' : 'Using demo data');
      setProject(data);
      setLoading(false);
    };

    loadProject();
  }, [projectName, reloadTrigger]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Get diagram SVG based on system type
  const getDiagramSvg = (systemType: string): string | null => {
    if (!systemType) {
      console.log('[ProjectContext] getDiagramSvg: No systemType provided');
      return null;
    }

    const type = systemType.toLowerCase();
    console.log('[ProjectContext] getDiagramSvg input:', systemType, '| lowercase:', type);

    if (type.includes('ai') && (type.includes('ml') || type.includes('system'))) {
      console.log('[ProjectContext] → Matched: AI/ML');
      return DIAGRAM_AI_ML;
    } else if (type.includes('microservices')) {
      console.log('[ProjectContext] → Matched: Microservices');
      return DIAGRAM_MICROSERVICES;
    } else if (type.includes('serverless')) {
      console.log('[ProjectContext] → Matched: Serverless');
      return DIAGRAM_SERVERLESS;
    } else if (type.includes('3-tier') || type.includes('tier')) {
      console.log('[ProjectContext] → Matched: 3-Tier');
      return DIAGRAM_3_TIER;
    }

    console.log('[ProjectContext] → No match, using fallback 3-tier');
    return DIAGRAM_3_TIER; // default fallback
  };

  const displayProject = project || {
    project_name: 'E-Government Payment Gateway',
    description: '3-tier web application for citizen payment services',
    system_type: '3-tier-web-application',
  };

  // Format system type for display
  const formatSystemType = (systemType: string): string => {
    if (systemType === 'ai-ml-system') {
      return 'AI/ML System';
    }
    return systemType.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const renderArchitecture = () => {
    // MITRE ATT&CK threat model for CVE-2024-3457
    const threats = [
      {
        tactic: 'Initial Access',
        technique: 'T1078',
        name: 'Valid Accounts',
        description: 'Attacker uses valid low-privilege credentials',
        severity: 'medium',
      },
      {
        tactic: 'Discovery',
        technique: 'T1087',
        name: 'Account Discovery',
        description: 'Enumerate internal system configuration',
        severity: 'medium',
      },
      {
        tactic: 'Collection',
        technique: 'T1005',
        name: 'Data from Local System',
        description: 'Access sensitive configuration data via API',
        severity: 'high',
      },
    ];

    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: System Diagram with Attack Paths */}
          <div>
            <h4 className="font-medium mb-4">System Diagram & Attack Surface</h4>
            <div className="bg-white border-2 border-border rounded-lg p-4">
              <div
                className="w-full"
                style={{ minHeight: '400px' }}
                dangerouslySetInnerHTML={{ __html: getDiagramSvg(displayProject.system_type) || '' }}
              />
            </div>
          </div>

          {/* Right: MITRE ATT&CK Threat Model */}
          <div>
            <h4 className="font-medium mb-4">MITRE ATT&CK Threat Model</h4>
            <div className="space-y-3">
              {threats.map((threat, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-lg p-4 ${
                    threat.severity === 'high'
                      ? 'bg-red-50 border-red-300'
                      : threat.severity === 'medium'
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-yellow-50 border-yellow-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-600 mb-1">
                        {threat.tactic.toUpperCase()}
                      </div>
                      <div className="font-medium text-sm">{threat.name}</div>
                    </div>
                    <div className="bg-slate-800 text-white text-xs font-mono px-2 py-1 rounded">
                      {threat.technique}
                    </div>
                  </div>
                  <div className="text-xs text-slate-700">{threat.description}</div>
                </div>
              ))}

              {/* Mitigating Controls */}
              <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-700" />
                  <h5 className="font-medium text-green-900">Mitigating Controls</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-green-800">
                      <strong>Network Segmentation:</strong> Internal network, CAM access only
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-green-800">
                      <strong>Perimeter Defense:</strong> Firewall + IPS blocking exploit patterns
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-green-800">
                      <strong>Detection:</strong> SIEM monitoring for unauthorized API access
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-green-800">
                      <strong>Exposure Reduction:</strong> Limited to Good Luck Infra users only
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="mt-4 bg-blue-50 border border-blue-300 rounded p-3">
                <div className="text-xs font-medium text-blue-900 mb-2">Residual Risk: LOW</div>
                <div className="text-xs text-blue-700">
                  With compensating controls, attack likelihood reduced by 85%. 90-day acceptance window aligns with system decommission timeline.
                </div>
              </div>
            </div>
          </div>
        </div>

        {uploadedFilesCount > 0 && (
          <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
            <span className="font-medium">{uploadedFilesCount} supporting documents</span> analyzed for this threat model
          </div>
        )}
      </div>
    );
  };

  if (!project) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-medium">{displayProject.project_name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{displayProject.description}</p>
            <div className="flex items-center gap-2 text-sm mt-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                System Type:{' '}
                <span className="font-mono text-foreground">
                  {formatSystemType(displayProject.system_type)}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isExpanded ? 'Hide' : 'Show'} Architecture
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>
        {isExpanded && (
          <div className="px-6 pb-6">
            {renderArchitecture()}
          </div>
        )}
        {!isExpanded && (
          <div className="px-6 pb-3 text-xs text-muted-foreground italic">
            ℹ️ Demo mode - External database connections are unavailable in preview environment
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-medium">{project.project_name}</h3>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
          {project.system_type && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                System Type:{' '}
                <span className="font-mono text-foreground">
                  {project.system_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isExpanded ? 'Hide' : 'Show'} Architecture
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          {renderArchitecture()}
        </div>
      )}
    </div>
  );
}
