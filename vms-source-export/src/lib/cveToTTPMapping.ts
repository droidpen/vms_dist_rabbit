/**
 * CVE-to-TTP Mapping Engine
 * Maps specific CVE vulnerabilities to MITRE ATT&CK techniques based on exploitation vectors
 */

interface CVETTPMapping {
  cveId: string;
  primaryTechniques: Array<{
    id: string;
    name: string;
    tactic: string;
    reasoning: string;
  }>;
  attackChain: Array<{
    step: number;
    technique: string;
    description: string;
  }>;
  exploitPath: string;
}

/**
 * Map CWE categories to MITRE ATT&CK techniques
 */
const CWE_TO_TTP: Record<string, Array<{ id: string; name: string; tactic: string }>> = {
  // Command Injection (CWE-77, CWE-78)
  'command-injection': [
    { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution' },
    { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
    { id: 'T1068', name: 'Exploitation for Privilege Escalation', tactic: 'Privilege Escalation' },
  ],

  // HTTP Request Smuggling / Protocol Manipulation
  'http-protocol': [
    { id: 'T1499', name: 'Endpoint Denial of Service', tactic: 'Impact' },
    { id: 'T1498', name: 'Network Denial of Service', tactic: 'Impact' },
    { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
  ],

  // Buffer Overflow (CWE-119, CWE-120, CWE-787)
  'buffer-overflow': [
    { id: 'T1203', name: 'Exploitation for Client Execution', tactic: 'Execution' },
    { id: 'T1068', name: 'Exploitation for Privilege Escalation', tactic: 'Privilege Escalation' },
    { id: 'T1211', name: 'Exploitation for Defense Evasion', tactic: 'Defense Evasion' },
  ],

  // Code Execution
  'code-execution': [
    { id: 'T1203', name: 'Exploitation for Client Execution', tactic: 'Execution' },
    { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution' },
    { id: 'T1505', name: 'Server Software Component', tactic: 'Persistence' },
  ],

  // Authentication Bypass (CWE-287, CWE-306)
  'auth-bypass': [
    { id: 'T1078', name: 'Valid Accounts', tactic: 'Initial Access' },
    { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
    { id: 'T1548', name: 'Abuse Elevation Control Mechanism', tactic: 'Privilege Escalation' },
  ],

  // SQL Injection (CWE-89)
  'sql-injection': [
    { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
    { id: 'T1213', name: 'Data from Information Repositories', tactic: 'Collection' },
    { id: 'T1005', name: 'Data from Local System', tactic: 'Collection' },
  ],

  // Deserialization (CWE-502)
  'deserialization': [
    { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution' },
    { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
    { id: 'T1203', name: 'Exploitation for Client Execution', tactic: 'Execution' },
  ],
};

/**
 * Known CVE-to-TTP mappings for high-profile vulnerabilities
 */
const KNOWN_CVE_MAPPINGS: Record<string, CVETTPMapping> = {
  'CVE-2024-3400': {
    cveId: 'CVE-2024-3400',
    primaryTechniques: [
      {
        id: 'T1059.004',
        name: 'Command and Scripting Interpreter: Unix Shell',
        tactic: 'Execution (TA0002)',
        reasoning: 'Command injection allows arbitrary shell command execution via GlobalProtect gateway'
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access (TA0001)',
        reasoning: 'Exploits unauthenticated GlobalProtect gateway interface accessible from internet'
      },
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation',
        tactic: 'Privilege Escalation (TA0004)',
        reasoning: 'Command injection executes with elevated privileges (root context)'
      },
      {
        id: 'T1505.003',
        name: 'Server Software Component: Web Shell',
        tactic: 'Persistence (TA0003)',
        reasoning: 'Attackers deploy web shells for persistent access after initial compromise'
      },
      {
        id: 'T1083',
        name: 'File and Directory Discovery',
        tactic: 'Discovery (TA0007)',
        reasoning: 'Post-exploitation reconnaissance to map system and identify targets'
      },
    ],
    attackChain: [
      { step: 1, technique: 'T1190', description: 'Exploit unauthenticated GlobalProtect gateway endpoint' },
      { step: 2, technique: 'T1059.004', description: 'Inject arbitrary shell commands via vulnerable parameter' },
      { step: 3, technique: 'T1068', description: 'Commands execute as root/SYSTEM (privilege escalation)' },
      { step: 4, technique: 'T1505.003', description: 'Deploy web shell for persistent backdoor access' },
      { step: 5, technique: 'T1083', description: 'Enumerate system for lateral movement targets' },
    ],
    exploitPath: 'Unauthenticated attacker → Command injection → Root execution → Web shell → Lateral movement'
  },

  'CVE-2023-44487': {
    cveId: 'CVE-2023-44487',
    primaryTechniques: [
      {
        id: 'T1498',
        name: 'Network Denial of Service',
        tactic: 'Impact (TA0040)',
        reasoning: 'HTTP/2 Rapid Reset causes resource exhaustion via stream cancellation flood'
      },
      {
        id: 'T1499.004',
        name: 'Endpoint Denial of Service: Application Exhaustion Flood',
        tactic: 'Impact (TA0040)',
        reasoning: 'Overwhelms application layer by opening/canceling thousands of HTTP/2 streams'
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access (TA0001)',
        reasoning: 'Targets public-facing HTTP/2 endpoints (API gateways, load balancers)'
      },
    ],
    attackChain: [
      { step: 1, technique: 'T1190', description: 'Target public HTTP/2 endpoint (Kong Gateway, ALB)' },
      { step: 2, technique: 'T1498', description: 'Open HTTP/2 connection and send rapid RST_STREAM frames' },
      { step: 3, technique: 'T1499.004', description: 'Exhaust server resources (CPU, memory, connection pools)' },
      { step: 4, technique: 'T1498', description: 'Service becomes unavailable (DoS achieved)' },
    ],
    exploitPath: 'Attacker → HTTP/2 connection → Rapid stream reset → Resource exhaustion → Service unavailable'
  },

  'CVE-2023-25659': {
    cveId: 'CVE-2023-25659',
    primaryTechniques: [
      {
        id: 'T1203',
        name: 'Exploitation for Client Execution',
        tactic: 'Execution (TA0002)',
        reasoning: 'TensorFlow vulnerability allows code execution via malicious model inputs'
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access (TA0001)',
        reasoning: 'Exploits ML inference API exposed to external users'
      },
      {
        id: 'AML.T0018',
        name: 'ML Model Evasion',
        tactic: 'ATLAS Impact (AML.TA0006)',
        reasoning: 'Crafted inputs cause model to produce incorrect predictions'
      },
    ],
    attackChain: [
      { step: 1, technique: 'T1190', description: 'Send malicious input to ML inference API' },
      { step: 2, technique: 'T1203', description: 'TensorFlow processes malformed tensor → code execution' },
      { step: 3, technique: 'AML.T0018', description: 'Adversarial input also causes model evasion' },
      { step: 4, technique: 'T1059', description: 'Arbitrary code execution in ML serving context' },
    ],
    exploitPath: 'Attacker → Malicious ML input → TensorFlow vulnerability → Code execution + Model evasion'
  },

  'CVE-2023-38545': {
    cveId: 'CVE-2023-38545',
    primaryTechniques: [
      {
        id: 'T1203',
        name: 'Exploitation for Client Execution',
        tactic: 'Execution (TA0002)',
        reasoning: 'Heap buffer overflow in cURL SOCKS5 proxy handling allows code execution'
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access (TA0001)',
        reasoning: 'Serverless functions using cURL for external requests are vulnerable'
      },
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation',
        tactic: 'Privilege Escalation (TA0004)',
        reasoning: 'Lambda functions run with IAM role permissions (potential privilege escalation)'
      },
    ],
    attackChain: [
      { step: 1, technique: 'T1190', description: 'Trigger Lambda function that makes HTTP request via cURL' },
      { step: 2, technique: 'T1203', description: 'SOCKS5 proxy response triggers heap overflow in cURL' },
      { step: 3, technique: 'T1068', description: 'Code executes in Lambda context with IAM role' },
      { step: 4, technique: 'T1098', description: 'Modify IAM permissions for persistence' },
    ],
    exploitPath: 'Trigger Lambda → cURL SOCKS5 overflow → Code execution → IAM role abuse'
  },
};

/**
 * Map CVE to MITRE ATT&CK techniques
 */
export function mapCVEToTTPs(cveId: string, cweCategory?: string): CVETTPMapping | null {
  // Check for known CVE mapping first
  if (KNOWN_CVE_MAPPINGS[cveId]) {
    return KNOWN_CVE_MAPPINGS[cveId];
  }

  // Fallback to CWE-based mapping if available
  if (cweCategory && CWE_TO_TTP[cweCategory]) {
    const techniques = CWE_TO_TTP[cweCategory];
    return {
      cveId,
      primaryTechniques: techniques.map(t => ({
        ...t,
        reasoning: `Based on ${cweCategory} vulnerability class`
      })),
      attackChain: [],
      exploitPath: 'Generic exploit path based on vulnerability type'
    };
  }

  return null;
}

/**
 * Get attack chain visualization data
 */
export function getAttackChain(cveId: string): CVETTPMapping['attackChain'] {
  const mapping = KNOWN_CVE_MAPPINGS[cveId];
  return mapping?.attackChain || [];
}

/**
 * Get all TTPs for a CVE
 */
export function getAllTTPsForCVE(cveId: string): string[] {
  const mapping = KNOWN_CVE_MAPPINGS[cveId];
  if (!mapping) return [];

  return mapping.primaryTechniques.map(t => t.id);
}
