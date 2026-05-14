/**
 * Architecture Synthesis Engine
 * Analyzes uploaded files to identify system architecture type and components
 */

interface ArchitectureAnalysis {
  architectureType: string;
  components: string[];
  hasAI: boolean;
  aiComponents?: string[];
  description: string;
  confidence: number;
  detectedPatterns: string[];
  projectName?: string;
  explanation: {
    patternsFound: string[];
    patternsMissing: string[];
    keywordsMatched: Array<{ keyword: string; context: string }>;
    confidenceFactors: Array<{ factor: string; impact: 'positive' | 'negative'; weight: number }>;
  };
  citations: {
    architectureType: Array<{ fileName: string; excerpt: string; relevance: string }>;
    components: Array<{ fileName: string; excerpt: string; relevance: string }>;
    aiComponents: Array<{ fileName: string; excerpt: string; relevance: string }>;
    patterns: Record<string, Array<{ fileName: string; excerpt: string }>>;
  };
}

interface FileContent {
  name: string;
  type: string;
  content: string;
}

/**
 * Extract text content from files (in production, this would use actual file parsing)
 */
async function extractFileContent(file: File): Promise<FileContent> {
  try {
    // Read actual file content as text
    const text = await file.text();
    return {
      name: file.name,
      type: file.type,
      content: text.toLowerCase(), // Use actual content
    };
  } catch (error) {
    console.error('Error reading file content:', error);
    // Fallback to filename if reading fails
    return {
      name: file.name,
      type: file.type,
      content: file.name.toLowerCase(),
    };
  }
}

interface PatternCitation {
  fileName: string;
  excerpt: string;
}

/**
 * Detect architecture patterns from file content
 */
function detectArchitecturePatterns(contents: FileContent[]): {
  patterns: string[];
  citations: Record<string, PatternCitation[]>
} {
  const patterns: string[] = [];
  const citations: Record<string, PatternCitation[]> = {};
  const allContent = contents.map(c => c.content + ' ' + c.name).join(' ').toLowerCase();

  // Helper to add citation
  const addCitation = (pattern: string, fileName: string, excerpt: string) => {
    if (!citations[pattern]) {
      citations[pattern] = [];
    }
    citations[pattern].push({ fileName, excerpt });
  };

  // Architecture pattern detection
  // Check for microservices but exclude explicit negations
  const hasMicroservicesNegation = allContent.includes('no microservice') ||
                                   allContent.includes('not microservice') ||
                                   allContent.includes('no micro-service');

  if (!hasMicroservicesNegation && (allContent.includes('microservice') || allContent.includes('micro-service'))) {
    patterns.push('microservices');
    // Find which files mention microservices
    contents.forEach(file => {
      if (file.content.includes('microservice') || file.content.includes('micro-service')) {
        const match = file.content.match(/(.{0,40})(microservice[s]?|micro-service[s]?)(.{0,40})/i);
        if (match) {
          addCitation('microservices', file.name, match[0].trim());
        }
      }
    });
  }

  // Serverless - check BEFORE 3-tier to avoid false positives
  const hasServerlessNegation = allContent.includes('no serverless') ||
                                allContent.includes('not serverless');

  if (!hasServerlessNegation && (allContent.includes('serverless') || allContent.includes('lambda function') ||
      allContent.includes('faas') || allContent.includes('function-as-a-service') ||
      allContent.includes('aws lambda') || allContent.includes('azure functions') ||
      allContent.includes('cloud functions'))) {
    patterns.push('serverless');
    contents.forEach(file => {
      const serverlessTerms = ['serverless', 'lambda function', 'faas', 'aws lambda', 'azure functions', 'cloud functions'];
      for (const term of serverlessTerms) {
        if (file.content.includes(term)) {
          const match = file.content.match(new RegExp(`(.{0,40})(${term})(.{0,40})`, 'i'));
          if (match) {
            addCitation('serverless', file.name, match[0].trim());
            break;
          }
        }
      }
    });
  }

  // 3-tier - be more specific to avoid false positives
  if (allContent.includes('3-tier') || allContent.includes('three tier') || allContent.includes('three-tier') ||
      (allContent.includes('presentation layer') && allContent.includes('application layer') && allContent.includes('data layer')) ||
      (allContent.includes('presentation tier') && allContent.includes('application tier') && allContent.includes('data tier'))) {
    patterns.push('3-tier');
    contents.forEach(file => {
      const tierTerms = ['3-tier', 'three tier', 'three-tier', 'presentation layer', 'application layer', 'data layer'];
      for (const term of tierTerms) {
        if (file.content.includes(term)) {
          const match = file.content.match(new RegExp(`(.{0,40})(${term})(.{0,40})`, 'i'));
          if (match) {
            addCitation('3-tier', file.name, match[0].trim());
            break;
          }
        }
      }
    });
  }
  if (allContent.includes('monolith')) {
    patterns.push('monolithic');
  }
  if (allContent.includes('soa') || allContent.includes('service-oriented')) {
    patterns.push('soa');
  }
  if (allContent.includes('event-driven') || allContent.includes('event driven')) {
    patterns.push('event-driven');
  }
  if (allContent.includes('api gateway') || allContent.includes('api-gateway')) {
    patterns.push('api-gateway');
  }
  if (allContent.includes('kubernetes') || allContent.includes('k8s') || allContent.includes('container')) {
    patterns.push('containerized');
  }

  // Component detection
  if (allContent.includes('database') || allContent.includes('db') || allContent.includes('sql')) {
    patterns.push('database-layer');
  }
  if (allContent.includes('frontend') || allContent.includes('ui') || allContent.includes('web interface')) {
    patterns.push('frontend');
  }
  if (allContent.includes('backend') || allContent.includes('api') || allContent.includes('server')) {
    patterns.push('backend');
  }
  if (allContent.includes('cache') || allContent.includes('redis') || allContent.includes('memcache')) {
    patterns.push('caching-layer');
  }
  if (allContent.includes('load balancer') || allContent.includes('loadbalancer')) {
    patterns.push('load-balancing');
  }
  if (allContent.includes('firewall') || allContent.includes('ips') || allContent.includes('waf')) {
    patterns.push('security-perimeter');
  }

  // AI/ML detection - must have explicit AI/ML keywords, not just substring matches
  // Exclude cases where "No AI/ML" is explicitly stated
  const hasAiMlNegation = allContent.includes('no ai') ||
                          allContent.includes('no ml') ||
                          allContent.includes('no machine learning') ||
                          allContent.includes('no ai/ml');

  if (!hasAiMlNegation) {
    // Check for explicit AI/ML keywords with word boundaries or specific phrases
    const aiMlKeywords = [
      'machine learning', 'ml model', 'neural network',
      'tensorflow', 'pytorch', 'xgboost', 'scikit-learn',
      'model training', 'model inference', 'ml inference',
      'feature engineering', 'model registry', 'mlflow',
      'sagemaker', 'ai platform', 'ai/ml', 'artificial intelligence'
    ];

    const hasAiMlKeyword = aiMlKeywords.some(keyword => allContent.includes(keyword));

    if (hasAiMlKeyword) {
      patterns.push('ai-ml');
      contents.forEach(file => {
        for (const term of aiMlKeywords) {
          if (file.content.includes(term)) {
            const match = file.content.match(new RegExp(`(.{0,40})(${term})(.{0,40})`, 'i'));
            if (match) {
              addCitation('ai-ml', file.name, match[0].trim());
              break;
            }
          }
        }
      });
    }
  }

  // Deployment patterns
  if (allContent.includes('cloud') || allContent.includes('aws') || allContent.includes('azure') || allContent.includes('gcp')) {
    patterns.push('cloud-deployment');
  }
  if (allContent.includes('internal network') || allContent.includes('on-premise') || allContent.includes('on-prem')) {
    patterns.push('internal-deployment');
  }

  return { patterns, citations };
}

/**
 * Build compound architecture description from all detected patterns
 * Example: "AI/ML System Architecture (Microservices-based, Cloud-native)"
 */
function buildCompoundArchitecture(patterns: string[]): string {
  // Determine primary architecture type
  let primary = '';

  if (patterns.includes('ai-ml')) {
    primary = 'AI/ML System Architecture';
  } else if (patterns.includes('microservices')) {
    primary = 'Microservices Architecture';
  } else if (patterns.includes('serverless')) {
    primary = 'Serverless Architecture';
  } else if (patterns.includes('3-tier')) {
    primary = '3-Tier Web Application Architecture';
  } else if (patterns.includes('event-driven')) {
    primary = 'Event-Driven Architecture';
  } else if (patterns.includes('soa')) {
    primary = 'Service-Oriented Architecture (SOA)';
  } else if (patterns.includes('monolithic')) {
    primary = 'Monolithic Architecture';
  } else if (patterns.includes('frontend') && patterns.includes('backend')) {
    primary = 'Client-Server Architecture';
  } else {
    primary = 'Unknown Architecture';
  }

  // Build modifiers from secondary patterns
  const modifiers: string[] = [];

  // Architecture modifiers
  if (primary !== 'Microservices Architecture' && patterns.includes('microservices')) {
    modifiers.push('Microservices-based');
  }
  if (primary !== 'Serverless Architecture' && patterns.includes('serverless')) {
    modifiers.push('Serverless components');
  }
  if (primary !== 'Event-Driven Architecture' && patterns.includes('event-driven')) {
    modifiers.push('Event-driven');
  }

  // Deployment modifiers
  if (patterns.includes('cloud-deployment')) {
    modifiers.push('Cloud-native');
  }
  if (patterns.includes('internal-deployment')) {
    modifiers.push('On-premise');
  }
  if (patterns.includes('containerized')) {
    modifiers.push('Containerized');
  }

  // Infrastructure modifiers
  if (patterns.includes('api-gateway')) {
    modifiers.push('API Gateway');
  }

  // Return compound description
  if (modifiers.length > 0) {
    return `${primary} (${modifiers.join(', ')})`;
  }
  return primary;
}

/**
 * Determine architecture type from detected patterns
 */
function determineArchitectureType(patterns: string[]): { type: string; confidence: number; reason: string } {
  // Build compound architecture description
  const compoundType = buildCompoundArchitecture(patterns);

  // Determine confidence and reason based on primary architecture
  if (patterns.includes('ai-ml')) {
    return {
      type: compoundType,
      confidence: 0.92,
      reason: 'Machine learning and AI components detected with model training/inference infrastructure.',
    };
  }

  if (patterns.includes('microservices')) {
    return {
      type: compoundType,
      confidence: 0.9,
      reason: 'Multiple independent services detected with decoupled components and service-oriented design patterns.',
    };
  }

  // Check serverless BEFORE 3-tier (serverless systems may have "application" and "data" keywords)
  if (patterns.includes('serverless')) {
    return {
      type: compoundType,
      confidence: 0.88,
      reason: 'Function-as-a-Service (FaaS) components and event-driven patterns detected.',
    };
  }

  if (patterns.includes('3-tier')) {
    return {
      type: compoundType,
      confidence: 0.85,
      reason: 'Clear separation of presentation, application logic, and data layers detected.',
    };
  }

  if (patterns.includes('event-driven')) {
    return {
      type: compoundType,
      confidence: 0.82,
      reason: 'Event bus, message queues, and asynchronous communication patterns detected.',
    };
  }

  if (patterns.includes('soa')) {
    return {
      type: compoundType,
      confidence: 0.8,
      reason: 'Service-oriented design with enterprise service bus patterns detected.',
    };
  }

  if (patterns.includes('monolithic')) {
    return {
      type: compoundType,
      confidence: 0.75,
      reason: 'Single deployable unit with tightly coupled components detected.',
    };
  }

  // Default fallback
  if (patterns.includes('frontend') && patterns.includes('backend')) {
    return {
      type: compoundType,
      confidence: 0.7,
      reason: 'Basic client-server separation detected with frontend and backend components.',
    };
  }

  return {
    type: compoundType,
    confidence: 0.3,
    reason: 'Insufficient information to determine specific architecture pattern.',
  };
}

/**
 * Extract components from patterns
 */
function extractComponents(patterns: string[], archType: string): string[] {
  const components: string[] = [];

  if (archType.includes('AI/ML')) {
    // AI/ML specific components
    if (patterns.includes('ai-ml')) {
      components.push('ML Model Inference Engine: Real-time prediction service');
      components.push('Model Training Pipeline: Model development and retraining');
      components.push('Feature Engineering Module: Data preprocessing and transformation');
    }
    if (patterns.includes('backend') || patterns.includes('api-gateway')) {
      components.push('API Gateway: ML model serving and request handling');
    }
    if (patterns.includes('database-layer')) {
      components.push('Data Storage: Training data, feature store, model registry');
    }
  } else if (archType.includes('3-Tier')) {
    if (patterns.includes('frontend')) {
      components.push('Presentation Layer: Web Interface / Frontend Application');
    }
    if (patterns.includes('backend') || patterns.includes('api-gateway')) {
      components.push('Application Layer: Business Logic / API Services');
    }
    if (patterns.includes('database-layer')) {
      components.push('Data Layer: Database Server / Data Storage');
    }
  } else if (archType.includes('Microservices')) {
    if (patterns.includes('api-gateway')) {
      components.push('API Gateway: Request routing and aggregation');
    }
    if (patterns.includes('backend')) {
      components.push('Microservices: Independent service components');
    }
    if (patterns.includes('database-layer')) {
      components.push('Data Store: Per-service databases');
    }
  } else {
    // Generic component extraction
    if (patterns.includes('frontend')) {
      components.push('Frontend: User-facing interface');
    }
    if (patterns.includes('backend')) {
      components.push('Backend: Application server');
    }
    if (patterns.includes('database-layer')) {
      components.push('Database: Data persistence layer');
    }
  }

  // Add infrastructure components
  if (patterns.includes('security-perimeter')) {
    components.push('Security Infrastructure: Firewall / IPS / WAF');
  }
  if (patterns.includes('load-balancing')) {
    components.push('Load Balancer: Traffic distribution');
  }
  if (patterns.includes('caching-layer')) {
    components.push('Cache Layer: Redis / Memcache');
  }

  // If no specific components detected, provide generic ones
  if (components.length === 0) {
    components.push('Application Components: Details pending file analysis');
  }

  return components;
}

/**
 * Detect AI/ML components
 */
function detectAIComponents(patterns: string[]): { hasAI: boolean; components?: string[] } {
  if (!patterns.includes('ai-ml')) {
    return { hasAI: false };
  }

  const aiComponents: string[] = [];

  // Generic AI components (in production, would extract from actual content)
  aiComponents.push('ML Model Inference Service');
  aiComponents.push('Model Training Pipeline');
  aiComponents.push('Feature Engineering Module');

  return {
    hasAI: true,
    components: aiComponents,
  };
}

/**
 * Generate architecture description
 */
function generateDescription(archType: string, patterns: string[], confidence: number): string {
  const deployment = patterns.includes('cloud-deployment') ? 'cloud infrastructure' :
                    patterns.includes('internal-deployment') ? 'internal network infrastructure' :
                    'hybrid infrastructure';

  const security = patterns.includes('security-perimeter') ?
    ' Protected by firewall and intrusion prevention systems.' : '';

  const scaling = patterns.includes('load-balancing') ?
    ' Includes load balancing for high availability.' : '';

  const containerization = patterns.includes('containerized') ?
    ' Deployed using containerized architecture (Kubernetes/Docker).' : '';

  return `${archType} deployed on ${deployment}.${security}${scaling}${containerization} Analysis confidence: ${Math.round(confidence * 100)}%.`;
}

/**
 * Extract project name from file contents
 */
function extractProjectName(contents: FileContent[]): string | undefined {
  const allContent = contents.map(c => c.content).join(' ');

  // Look for "PROJECT:" or "PROJECT NAME:" patterns
  const projectMatch = allContent.match(/project(?:\s+name)?:\s*([^\n]+)/i);
  if (projectMatch) {
    return projectMatch[1].trim();
  }

  // Look for common project name patterns
  const systemMatch = allContent.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Platform|System|Gateway|Service|Application))/);
  if (systemMatch) {
    return systemMatch[1].trim();
  }

  return undefined;
}

/**
 * Build explainability for confidence score
 */
function buildExplanation(
  patterns: string[],
  contents: FileContent[],
  archType: string,
  confidence: number
): ArchitectureAnalysis['explanation'] {
  const allContent = contents.map(c => c.content).join(' ').toLowerCase();
  const keywordsMatched: Array<{ keyword: string; context: string }> = [];
  const confidenceFactors: Array<{ factor: string; impact: 'positive' | 'negative'; weight: number }> = [];

  // Track what was found
  const patternsFound = [...patterns];

  // Track what's expected but missing
  const patternsMissing: string[] = [];

  // Keyword detection with context
  const keywordChecks = [
    { keyword: 'microservices', pattern: /microservice[s]?/gi },
    { keyword: '3-tier', pattern: /3-tier|three tier/gi },
    { keyword: 'serverless', pattern: /serverless|lambda/gi },
    { keyword: 'kubernetes', pattern: /kubernetes|k8s/gi },
    { keyword: 'api gateway', pattern: /api gateway/gi },
    { keyword: 'database', pattern: /database|postgresql|mongodb/gi },
    { keyword: 'machine learning', pattern: /machine learning|ml model/gi },
    { keyword: 'tensorflow', pattern: /tensorflow/gi },
    { keyword: 'firewall', pattern: /firewall|ips/gi },
    { keyword: 'cloud', pattern: /aws|azure|gcp|cloud/gi },
  ];

  keywordChecks.forEach(({ keyword, pattern }) => {
    const matches = allContent.match(pattern);
    if (matches && matches.length > 0) {
      // Find context around first match
      const index = allContent.indexOf(matches[0]);
      const start = Math.max(0, index - 30);
      const end = Math.min(allContent.length, index + matches[0].length + 30);
      const context = allContent.substring(start, end).replace(/\s+/g, ' ').trim();

      keywordsMatched.push({
        keyword,
        context: `...${context}...`
      });
    }
  });

  // Confidence factors
  if (patterns.length >= 5) {
    confidenceFactors.push({
      factor: `Rich pattern detection: ${patterns.length} patterns identified`,
      impact: 'positive',
      weight: 0.2
    });
  } else if (patterns.length < 3) {
    confidenceFactors.push({
      factor: `Limited pattern detection: only ${patterns.length} patterns found`,
      impact: 'negative',
      weight: -0.15
    });
  }

  // Architecture-specific checks
  if (archType.includes('AI/ML')) {
    const aiKeywords = ['tensorflow', 'pytorch', 'neural network', 'training', 'inference', 'machine learning', 'ml model'];
    const foundAiKeywords = aiKeywords.filter(kw => allContent.includes(kw));
    if (foundAiKeywords.length >= 3) {
      confidenceFactors.push({
        factor: `Strong AI/ML indicators: ${foundAiKeywords.length} ML-specific terms found`,
        impact: 'positive',
        weight: 0.2
      });
    }
    if (!patterns.includes('database-layer')) {
      patternsMissing.push('data storage (feature store/model registry)');
      confidenceFactors.push({
        factor: 'No data storage mentioned (expected for ML systems)',
        impact: 'negative',
        weight: -0.1
      });
    }
  }

  if (archType.includes('3-Tier')) {
    if (!patterns.includes('database-layer')) {
      patternsMissing.push('database-layer');
      confidenceFactors.push({
        factor: 'Missing database layer component (expected in 3-tier)',
        impact: 'negative',
        weight: -0.1
      });
    }
    if (patterns.includes('frontend') && patterns.includes('backend') && patterns.includes('database-layer')) {
      confidenceFactors.push({
        factor: 'All three tiers clearly identified (presentation, application, data)',
        impact: 'positive',
        weight: 0.15
      });
    }
  }

  if (archType.includes('Microservices')) {
    if (!patterns.includes('containerized')) {
      patternsMissing.push('containerization (Docker/Kubernetes)');
      confidenceFactors.push({
        factor: 'No containerization mentioned (common for microservices)',
        impact: 'negative',
        weight: -0.1
      });
    }
    if (patterns.includes('api-gateway')) {
      confidenceFactors.push({
        factor: 'API Gateway present (standard microservices component)',
        impact: 'positive',
        weight: 0.1
      });
    }
  }

  if (archType.includes('Serverless')) {
    if (patterns.includes('event-driven')) {
      confidenceFactors.push({
        factor: 'Event-driven architecture detected (aligns with serverless)',
        impact: 'positive',
        weight: 0.1
      });
    }
  }


  // Security infrastructure
  if (patterns.includes('security-perimeter')) {
    confidenceFactors.push({
      factor: 'Security infrastructure documented (firewall/IPS/WAF)',
      impact: 'positive',
      weight: 0.05
    });
  }

  // File count factor
  if (contents.length >= 3) {
    confidenceFactors.push({
      factor: `Comprehensive documentation: ${contents.length} files analyzed`,
      impact: 'positive',
      weight: 0.1
    });
  }

  return {
    patternsFound,
    patternsMissing,
    keywordsMatched: keywordsMatched.slice(0, 10), // Top 10
    confidenceFactors
  };
}

/**
 * Build citations for architecture type and components
 */
function buildCitations(
  patterns: string[],
  patternCitations: Record<string, PatternCitation[]>,
  archType: string,
  contents: FileContent[]
): ArchitectureAnalysis['citations'] {
  // Architecture type citations - use the primary pattern's citations
  const architectureTypeCitations: Array<{ fileName: string; excerpt: string; relevance: string }> = [];

  if (archType.includes('AI/ML') && patternCitations['ai-ml']) {
    patternCitations['ai-ml'].forEach(cite => {
      architectureTypeCitations.push({
        fileName: cite.fileName,
        excerpt: cite.excerpt,
        relevance: 'AI/ML keywords detected in this file'
      });
    });
  } else if (archType.includes('Microservices') && patternCitations['microservices']) {
    patternCitations['microservices'].forEach(cite => {
      architectureTypeCitations.push({
        fileName: cite.fileName,
        excerpt: cite.excerpt,
        relevance: 'Microservices architecture mentioned'
      });
    });
  } else if (archType.includes('Serverless') && patternCitations['serverless']) {
    patternCitations['serverless'].forEach(cite => {
      architectureTypeCitations.push({
        fileName: cite.fileName,
        excerpt: cite.excerpt,
        relevance: 'Serverless architecture mentioned'
      });
    });
  } else if (archType.includes('3-Tier') && patternCitations['3-tier']) {
    patternCitations['3-tier'].forEach(cite => {
      architectureTypeCitations.push({
        fileName: cite.fileName,
        excerpt: cite.excerpt,
        relevance: '3-tier architecture mentioned'
      });
    });
  }

  // Component citations - aggregate from all files
  const componentCitations: Array<{ fileName: string; excerpt: string; relevance: string }> = [];
  contents.forEach(file => {
    if (file.content.includes('database') || file.content.includes('api') || file.content.includes('frontend')) {
      const match = file.content.match(/(.{0,50})(database|api|frontend|backend|service)(.{0,50})/i);
      if (match) {
        componentCitations.push({
          fileName: file.name,
          excerpt: match[0].trim(),
          relevance: 'Component information found'
        });
      }
    }
  });

  // AI component citations
  const aiComponentCitations: Array<{ fileName: string; excerpt: string; relevance: string }> = [];
  if (patternCitations['ai-ml']) {
    patternCitations['ai-ml'].forEach(cite => {
      aiComponentCitations.push({
        fileName: cite.fileName,
        excerpt: cite.excerpt,
        relevance: 'ML/AI component mentioned'
      });
    });
  }

  return {
    architectureType: architectureTypeCitations,
    components: componentCitations,
    aiComponents: aiComponentCitations,
    patterns: patternCitations
  };
}

/**
 * Main synthesis function
 */
export async function synthesizeArchitecture(files: File[]): Promise<ArchitectureAnalysis | null> {
  if (files.length === 0) {
    return null;
  }

  // Extract content from all files
  const contents = await Promise.all(files.map(extractFileContent));

  // Detect patterns
  const { patterns, citations: patternCitations } = detectArchitecturePatterns(contents);

  if (patterns.length === 0) {
    return null;
  }

  // Determine architecture type
  const { type, confidence, reason } = determineArchitectureType(patterns);

  // Extract components
  const components = extractComponents(patterns, type);

  // Detect AI components
  const { hasAI, components: aiComponents } = detectAIComponents(patterns);

  // Generate description
  const description = generateDescription(type, patterns, confidence);

  // Extract project name
  const projectName = extractProjectName(contents);

  // Build explanation
  const explanation = buildExplanation(patterns, contents, type, confidence);

  // Build citations
  const citations = buildCitations(patterns, patternCitations, type, contents);

  return {
    architectureType: type,
    components,
    hasAI,
    aiComponents,
    description: `${description} ${reason}`,
    confidence,
    detectedPatterns: patterns,
    projectName,
    explanation,
    citations
  };
}
