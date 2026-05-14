/**
 * Threat Modeling Synthesis Engine
 * Generates MITRE ATT&CK and ATLAS tactics based on architecture analysis
 */

interface ThreatModel {
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
}

interface ArchitectureContext {
  architectureType: string;
  hasAI: boolean;
  detectedPatterns: string[];
}

/**
 * Generate MITRE ATT&CK tactics based on architecture
 */
function generateMitreAttackTactics(context: ArchitectureContext): ThreatModel['mitreAttackTactics'] {
  const tactics: ThreatModel['mitreAttackTactics'] = [];

  // Initial Access - applicable to most web-facing architectures
  if (context.detectedPatterns.includes('frontend') || context.detectedPatterns.includes('api-gateway')) {
    tactics.push({
      tactic: 'Initial Access (TA0001)',
      techniques: [
        'T1190 - Exploit Public-Facing Application',
        'T1133 - External Remote Services',
        'T1078 - Valid Accounts',
      ],
      description: `Attackers may exploit vulnerabilities in ${context.detectedPatterns.includes('api-gateway') ? 'API gateway' : 'web application'} to gain initial access. Common attack vectors include SQL injection, XSS, authentication bypass, and exploitation of known CVEs.`,
      reasoning: `Triggered by: ${context.detectedPatterns.includes('api-gateway') ? 'API Gateway' : 'Frontend'} pattern detected in architecture`,
    });
  }

  // Execution - relevant for application layers
  if (context.detectedPatterns.includes('backend') || context.detectedPatterns.includes('serverless')) {
    tactics.push({
      tactic: 'Execution (TA0002)',
      techniques: [
        'T1059 - Command and Scripting Interpreter',
        'T1203 - Exploitation for Client Execution',
        ...(context.detectedPatterns.includes('serverless') ? ['T1648 - Serverless Execution'] : []),
      ],
      description: `${context.detectedPatterns.includes('serverless') ? 'Serverless functions' : 'Application servers'} may be exploited to execute malicious code through command injection, deserialization attacks, or remote code execution vulnerabilities.`,
      reasoning: `Triggered by: ${context.detectedPatterns.includes('serverless') ? 'Serverless' : 'Backend'} pattern detected`,
    });
  }

  // Persistence - depends on deployment model
  if (context.detectedPatterns.includes('database-layer') || context.detectedPatterns.includes('backend')) {
    tactics.push({
      tactic: 'Persistence (TA0003)',
      techniques: [
        'T1505 - Server Software Component',
        'T1136 - Create Account',
        'T1098 - Account Manipulation',
      ],
      description: 'Attackers may establish persistence through backdoor accounts, web shells, malicious scheduled tasks, or database-level triggers and stored procedures.',
      reasoning: `Triggered by: ${context.detectedPatterns.includes('database-layer') ? 'Database layer' : 'Backend services'} detected`,
    });
  }

  // Privilege Escalation
  if (context.detectedPatterns.includes('microservices') || context.detectedPatterns.includes('containerized')) {
    tactics.push({
      tactic: 'Privilege Escalation (TA0004)',
      techniques: [
        'T1068 - Exploitation for Privilege Escalation',
        'T1611 - Escape to Host',
        ...(context.detectedPatterns.includes('containerized') ? ['T1610 - Deploy Container'] : []),
      ],
      description: 'Container escape vulnerabilities, kernel exploits, or misconfigured service accounts may allow attackers to escalate privileges and break out of containerized environments.',
      reasoning: `Triggered by: ${context.detectedPatterns.includes('containerized') ? 'Containerized (Kubernetes/Docker)' : 'Microservices'} architecture`,
    });
  } else {
    tactics.push({
      tactic: 'Privilege Escalation (TA0004)',
      techniques: [
        'T1068 - Exploitation for Privilege Escalation',
        'T1548 - Abuse Elevation Control Mechanism',
      ],
      description: 'Exploitation of application or OS vulnerabilities to gain elevated privileges, potentially leading to full system compromise.',
      reasoning: 'Triggered by: Traditional application architecture detected',
    });
  }

  // Defense Evasion
  tactics.push({
    tactic: 'Defense Evasion (TA0005)',
    techniques: [
      'T1027 - Obfuscated Files or Information',
      'T1070 - Indicator Removal',
      'T1562 - Impair Defenses',
    ],
    description: 'Attackers may attempt to evade detection by obfuscating malicious payloads, disabling security tools, or clearing logs and audit trails.',
    reasoning: 'Triggered by: Standard attacker behavior applicable to all architectures',
  });

  // Credential Access
  if (!context.detectedPatterns.includes('internal-deployment')) {
    tactics.push({
      tactic: 'Credential Access (TA0006)',
      techniques: [
        'T1110 - Brute Force',
        'T1212 - Exploitation for Credential Access',
        'T1555 - Credentials from Password Stores',
      ],
      description: 'Authentication mechanisms may be targeted through brute force attacks, credential dumping, or exploitation of password storage weaknesses.',
      reasoning: 'Triggered by: External-facing system (not internal-only deployment)',
    });
  }

  // Discovery
  tactics.push({
    tactic: 'Discovery (TA0007)',
    techniques: [
      'T1046 - Network Service Discovery',
      'T1083 - File and Directory Discovery',
      'T1082 - System Information Discovery',
    ],
    description: 'Attackers perform reconnaissance to understand the system architecture, identify additional targets, and map network topology.',
    reasoning: 'Triggered by: Standard post-compromise reconnaissance applicable to all systems',
  });

  // Lateral Movement
  if (context.detectedPatterns.includes('microservices') || context.detectedPatterns.includes('internal-deployment')) {
    tactics.push({
      tactic: 'Lateral Movement (TA0008)',
      techniques: [
        'T1021 - Remote Services',
        'T1534 - Internal Spearphishing',
        ...(context.detectedPatterns.includes('containerized') ? ['T1609 - Container Administration Command'] : []),
      ],
      description: `${context.detectedPatterns.includes('internal-deployment') ? 'Internal network deployment' : 'Microservices architecture'} may allow lateral movement between services or network segments if proper segmentation is not enforced.`,
      reasoning: `Triggered by: ${context.detectedPatterns.includes('internal-deployment') ? 'On-premise/Internal deployment' : 'Microservices architecture'}`,
    });
  }

  // Collection
  if (context.detectedPatterns.includes('database-layer')) {
    tactics.push({
      tactic: 'Collection (TA0009)',
      techniques: [
        'T1530 - Data from Cloud Storage',
        'T1005 - Data from Local System',
        'T1114 - Email Collection',
      ],
      description: 'Sensitive data in databases, file systems, or cloud storage may be targeted for collection and exfiltration.',
      reasoning: 'Triggered by: Database layer detected (contains sensitive data)',
    });
  }

  // Exfiltration
  tactics.push({
    tactic: 'Exfiltration (TA0010)',
    techniques: [
      'T1041 - Exfiltration Over C2 Channel',
      'T1567 - Exfiltration Over Web Service',
      'T1048 - Exfiltration Over Alternative Protocol',
    ],
    description: 'Data exfiltration may occur through encrypted channels, legitimate web services, or covert communication protocols to evade detection.',
    reasoning: 'Triggered by: Standard post-collection exfiltration applicable to all systems with data',
  });

  // Impact
  if (context.detectedPatterns.includes('database-layer') || context.architectureType.includes('Payment')) {
    tactics.push({
      tactic: 'Impact (TA0040)',
      techniques: [
        'T1486 - Data Encrypted for Impact',
        'T1565 - Data Manipulation',
        'T1491 - Defacement',
      ],
      description: 'Attackers may deploy ransomware, manipulate transaction data, or cause service disruption to achieve financial or reputational impact.',
      reasoning: `Triggered by: ${context.architectureType.includes('Payment') ? 'Payment system (high-impact target)' : 'Database layer detected (data at risk)'}`,
    });
  }

  return tactics;
}

/**
 * Generate MITRE ATLAS tactics for AI/ML systems
 */
function generateMitreAtlasTactics(context: ArchitectureContext): ThreatModel['mitreAtlasTactics'] {
  if (!context.hasAI) {
    return undefined;
  }

  return [
    {
      tactic: 'Reconnaissance (AML.TA0001)',
      techniques: [
        'AML.T0002 - Obtain ML Artifacts',
        'AML.T0003 - Discover ML Model Family',
      ],
      description: 'Attackers probe the ML system to understand model architecture, training data characteristics, and inference behavior.',
      reasoning: 'Triggered by: AI/ML system detected (ATLAS framework activated)',
    },
    {
      tactic: 'ML Attack Staging (AML.TA0002)',
      techniques: [
        'AML.T0005 - Develop Adversarial Examples',
        'AML.T0006 - Craft Poisoned Training Data',
      ],
      description: 'Adversaries craft malicious inputs or poisoned datasets designed to manipulate model predictions or degrade performance.',
      reasoning: 'Triggered by: ML model inference service (adversarial attack surface)',
    },
    {
      tactic: 'ML Model Access (AML.TA0003)',
      techniques: [
        'AML.T0007 - Inference API Access',
        'AML.T0008 - Model Inversion',
      ],
      description: 'Attackers exploit API access to extract model information through repeated queries or inversion attacks to reconstruct training data.',
      reasoning: 'Triggered by: External API access to ML inference endpoints',
    },
    {
      tactic: 'Exfiltration (AML.TA0005)',
      techniques: [
        'AML.T0024 - Exfiltrate ML Artifacts',
        'AML.T0025 - Exfiltrate Training Data',
      ],
      description: 'Model weights, architectures, or sensitive training data may be extracted for competitive advantage or to enable further attacks.',
      reasoning: 'Triggered by: Valuable ML models and training data present',
    },
    {
      tactic: 'Impact (AML.TA0006)',
      techniques: [
        'AML.T0018 - Model Evasion',
        'AML.T0020 - Model Poisoning',
      ],
      description: 'Adversarial inputs cause the model to make incorrect predictions, while poisoning attacks degrade model accuracy over time.',
      reasoning: 'Triggered by: ML model serving production traffic (operational impact risk)',
    },
  ];
}

/**
 * Main synthesis function
 */
export function synthesizeThreatModel(architectureContext: ArchitectureContext | null): ThreatModel | null {
  if (!architectureContext) {
    return null;
  }

  const mitreAttackTactics = generateMitreAttackTactics(architectureContext);
  const mitreAtlasTactics = generateMitreAtlasTactics(architectureContext);

  return {
    mitreAttackTactics,
    mitreAtlasTactics,
  };
}
