import { FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CitationProps {
  sources: Array<{
    fileName: string;
    excerpt?: string;
    relevance?: string;
  }>;
  inline?: boolean;
  citationId?: string;
}

export function Citation({ sources, inline = false, citationId }: CitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sources.length === 0) {
    return null;
  }

  if (inline) {
    return (
      <>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.5 text-xs text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded transition-colors align-super"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', lineHeight: '1' }}
          title={`View ${sources.length} source${sources.length > 1 ? 's' : ''}`}
        >
          <FileText className="w-2.5 h-2.5" strokeWidth={2.5} />
          <span>{sources.length}</span>
        </button>

        {isExpanded && (
          <div className="mt-2 ml-0 border-l-2 border-blue-300 bg-blue-50 pl-3 pr-2 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
              <span className="text-xs font-semibold text-blue-800" style={{ fontFamily: 'var(--font-mono)' }}>
                Source{sources.length > 1 ? 's' : ''}:
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-auto text-xs text-blue-600 hover:text-blue-800"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {sources.map((source, idx) => (
                <div key={idx} className="bg-white border border-blue-200 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-3 h-3 text-blue-600" strokeWidth={2} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600 }} className="text-blue-900">
                      {source.fileName}
                    </span>
                  </div>
                  {source.relevance && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }} className="text-blue-700 mb-1">
                      {source.relevance}
                    </div>
                  )}
                  {source.excerpt && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }} className="text-muted-foreground italic">
                      "{source.excerpt}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mt-2 border-l-2 border-blue-300 bg-blue-50 pl-3 pr-2 py-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 w-full text-left"
      >
        <FileText className="w-3.5 h-3.5" strokeWidth={2} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
          Source{sources.length > 1 ? 's' : ''}: {sources.map(s => s.fileName).join(', ')}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" strokeWidth={2} />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 ml-auto" strokeWidth={2} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, idx) => (
            <div key={idx} className="bg-white border border-blue-200 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-3 h-3 text-blue-600" strokeWidth={2} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600 }} className="text-blue-900">
                  {source.fileName}
                </span>
              </div>
              {source.relevance && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }} className="text-blue-700 mb-1">
                  {source.relevance}
                </div>
              )}
              {source.excerpt && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }} className="text-muted-foreground italic">
                  "{source.excerpt}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
