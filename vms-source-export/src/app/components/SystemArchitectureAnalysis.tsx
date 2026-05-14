import { Cpu, Layers, Brain, Network, ChevronDown, ChevronRight, HelpCircle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { DIAGRAM_3_TIER, DIAGRAM_MICROSERVICES, DIAGRAM_AI_ML, DIAGRAM_SERVERLESS } from '../../lib/diagramConstants';
import { Citation } from './Citation';

interface SystemArchitectureAnalysisProps {
  uploadedFiles: {
    presentation: File[];
    email: File[];
    evidence: File[];
  };
  analysisResults?: {
    architectureType: string;
    components: string[];
    hasAI: boolean;
    aiComponents?: string[];
    description: string;
    confidence?: number;
    detectedPatterns?: string[];
    citations?: {
      architectureType: Array<{ fileName: string; excerpt: string; relevance: string }>;
      components: Array<{ fileName: string; excerpt: string; relevance: string }>;
      aiComponents: Array<{ fileName: string; excerpt: string; relevance: string }>;
      patterns: Record<string, Array<{ fileName: string; excerpt: string }>>;
    };
  };
}

export function SystemArchitectureAnalysis({ uploadedFiles, analysisResults }: SystemArchitectureAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  const hasFiles =
    uploadedFiles.presentation.length > 0 ||
    uploadedFiles.email.length > 0 ||
    uploadedFiles.evidence.length > 0;

  const analysis = analysisResults;

  // Get diagram SVG content based on architecture type
  const getDiagramSvg = (architectureType?: string): string | null => {
    if (!architectureType) return null;

    const type = architectureType.toLowerCase();

    // Check for AI/ML with word boundaries to avoid matching "application"
    if (type.match(/\b(ai|ml)\b/) || type.includes('machine learning') || type.includes('ai/ml')) {
      return DIAGRAM_AI_ML;
    } else if (type.includes('microservices') || type.includes('micro-service')) {
      return DIAGRAM_MICROSERVICES;
    } else if (type.includes('serverless') || type.includes('lambda') || type.includes('event-driven')) {
      return DIAGRAM_SERVERLESS;
    } else if (type.includes('3-tier') || type.includes('three-tier') || type.includes('three tier')) {
      return DIAGRAM_3_TIER;
    }

    return null;
  };

  const diagramSvg = getDiagramSvg(analysis?.architectureType);

  return (
    <div className="border-2 border-border bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-b-2 border-border bg-secondary px-6 py-4 hover:bg-secondary/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 border-2 border-border bg-blue-50">
            <Layers className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>
              System Architecture Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated identification of architecture type and components
            </p>
          </div>
          <div className="flex items-center gap-3">
            {analysis && (
              <div className="px-3 py-1.5 border-2 border-border bg-card">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} className="text-muted-foreground">
                  {analysis.confidence ? `${Math.round(analysis.confidence * 100)}% confidence` : 'Analyzed'}
                </span>
              </div>
            )}
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
          {!analysis ? (
            <div className="text-center py-8 text-muted-foreground">
              <Network className="w-12 h-12 mx-auto mb-3 opacity-50" strokeWidth={1.5} />
              <p style={{ fontFamily: 'var(--font-mono)' }}>
                Upload files to analyze system architecture
              </p>
            </div>
          ) : (
          <div className="space-y-6">
            {/* System Diagram Display */}
            {diagramSvg && (
              <div key={analysis?.architectureType} className="border-2 border-primary/20 bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600 }} className="text-primary">
                    System Architecture Diagram
                  </span>
                </div>
                <div className="bg-white border-2 border-border rounded-lg p-4">
                  <div
                    className="w-full"
                    style={{ minHeight: '400px' }}
                    dangerouslySetInnerHTML={{ __html: diagramSvg }}
                  />
                </div>
              </div>
            )}

            {/* Architecture Type */}
            <div className="flex items-start gap-4">
              <div className="p-2 border-2 border-border bg-primary/10">
                <Cpu className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Architecture Type</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }} className="flex items-start">
                  <span>{analysis.architectureType}</span>
                  {analysis.citations?.architectureType && analysis.citations.architectureType.length > 0 && (
                    <Citation sources={analysis.citations.architectureType} inline />
                  )}
                </div>
                {analysis.confidence && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">
                      Confidence: <span className="font-semibold text-foreground">{Math.round(analysis.confidence * 100)}%</span>
                    </div>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center gap-1 px-2 py-1 text-xs border border-border bg-secondary hover:bg-accent rounded transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Why this confidence?</span>
                    </button>
                  </div>
                )}
              </div>
              {analysis.hasAI && (
                <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-purple-300 bg-purple-50">
                  <Brain className="w-4 h-4 text-purple-600" strokeWidth={1.5} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }} className="text-purple-700">
                    AI SYSTEM DETECTED
                  </span>
                </div>
              )}
            </div>

            {/* Explainability Section */}
            {showExplanation && analysis.explanation && (
              <div className="border-2 border-blue-300 bg-blue-50 p-4 rounded animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }} className="text-blue-900">
                    AI Analysis Explanation
                  </h4>
                </div>

                {/* Confidence Factors */}
                {analysis.explanation.confidenceFactors && analysis.explanation.confidenceFactors.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">Confidence Factors:</div>
                    <div className="space-y-2">
                      {analysis.explanation.confidenceFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white border border-blue-200 rounded p-2">
                          {factor.impact === 'positive' ? (
                            <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          )}
                          <div className="flex-1">
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }} className="text-foreground">
                              {factor.factor}
                            </span>
                            <span className={`ml-2 text-xs font-semibold ${factor.impact === 'positive' ? 'text-green-600' : 'text-orange-600'}`}>
                              ({factor.weight > 0 ? '+' : ''}{Math.round(factor.weight * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords Matched */}
                {analysis.explanation.keywordsMatched && analysis.explanation.keywordsMatched.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">
                      Keywords Detected ({analysis.explanation.keywordsMatched.length}):
                    </div>
                    <div className="space-y-1.5">
                      {analysis.explanation.keywordsMatched.slice(0, 5).map((match, idx) => (
                        <div key={idx} className="bg-white border border-blue-200 rounded p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }} className="text-blue-900">
                              {match.keyword}
                            </span>
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }} className="text-muted-foreground pl-5">
                            {match.context}
                          </div>
                        </div>
                      ))}
                      {analysis.explanation.keywordsMatched.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{analysis.explanation.keywordsMatched.length - 5} more keywords detected
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Patterns Found vs Missing */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-green-200 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2} />
                      <span className="text-sm font-medium text-green-800">Patterns Found</span>
                    </div>
                    <div className="space-y-1">
                      {analysis.explanation.patternsFound.map((pattern, idx) => (
                        <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} className="text-green-700">
                          • {pattern}
                        </div>
                      ))}
                    </div>
                  </div>
                  {analysis.explanation.patternsMissing && analysis.explanation.patternsMissing.length > 0 && (
                    <div className="bg-white border border-orange-200 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-orange-600" strokeWidth={2} />
                        <span className="text-sm font-medium text-orange-800">Expected but Missing</span>
                      </div>
                      <div className="space-y-1">
                        {analysis.explanation.patternsMissing.map((pattern, idx) => (
                          <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} className="text-orange-700">
                            • {pattern}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {analysis.description && (
            <div className="p-4 border-2 border-border bg-secondary/30">
              <div className="text-sm text-muted-foreground mb-2">System Overview</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} className="text-foreground">
                {analysis.description}
                {analysis.citations?.architectureType && analysis.citations.architectureType.length > 0 && (
                  <Citation sources={analysis.citations.architectureType} inline citationId="description" />
                )}
              </div>
            </div>
            )}

            {/* Components */}
            {analysis.components && analysis.components.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-3 flex items-center">
                <span>Identified Components</span>
                {analysis.citations?.components && analysis.citations.components.length > 0 && (
                  <Citation sources={analysis.citations.components} inline citationId="components" />
                )}
              </div>
              <div className="space-y-2">
                {analysis.components.map((component, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 border-2 border-border bg-card hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-6 h-6 flex items-center justify-center border-2 border-border bg-primary/10 text-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
                      {idx + 1}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} className="flex-1">
                      {component}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* AI Components if present */}
            {analysis.hasAI && analysis.aiComponents && analysis.aiComponents.length > 0 && (
              <div className="border-2 border-purple-300 bg-purple-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-purple-600" strokeWidth={1.5} />
                  <div className="text-sm text-purple-700 flex items-center" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    <span>AI/ML Components</span>
                    {analysis.citations?.aiComponents && analysis.citations.aiComponents.length > 0 && (
                      <Citation sources={analysis.citations.aiComponents} inline citationId="ai-components" />
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {analysis.aiComponents.map((component, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} className="text-purple-900">
                        {component}
                      </span>
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
