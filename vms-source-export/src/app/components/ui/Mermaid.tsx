import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
});

interface MermaidProps {
  chart: string;
  onHover?: (marker: string | null, x: number, y: number) => void;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart, onHover }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!onHover) return;

    const target = e.target as HTMLElement;
    // Mermaid text labels are usually inside <text> or <tspan>
    const textContent = target.textContent?.trim() || '';
    
    // Match markers like "1. Uploads Docs" or "A. Request Eval"
    const markerMatch = textContent.match(/^([1-6A-H])\.\s/);
    
    // Match Component Labels from the glossary
    const componentLabels = [
        'VMS Risk System', 'Retrieval Engine', 'Generation Engine', 
        'Google Gemini 3.1 Pro', 'Gemini embedding-2', 
        'Supabase Storage', 'pgvector Database', 'Edge Function'
    ];
    const isComponent = componentLabels.some(l => textContent.includes(l));
    
    if (markerMatch) {
      const marker = markerMatch[1];
      onHover(marker, e.clientX, e.clientY);
    } else if (isComponent) {
      // Find the specific component key
      const labelMap: Record<string, string> = {
        'VMS Risk System': 'VMS_App',
        'Retrieval Engine': 'Retrieval',
        'Generation Engine': 'Generation',
        'Google Gemini 3.1 Pro': 'Gemini',
        'Gemini embedding-2': 'EmbedModel',
        'Supabase Storage': 'Storage',
        'pgvector Database': 'VectorDB',
        'Edge Function': 'EdgeFunction'
      };
      const key = Object.keys(labelMap).find(l => textContent.includes(l));
      if (key) onHover(labelMap[key], e.clientX, e.clientY);
    } else {
      // Check if we are hovering near a marker (for better UX)
      // Or just clear if not directly on text
      onHover(null, 0, 0);
    }
  };

  return (
    <div 
      className="mermaid w-full flex justify-center bg-white p-6 border-2 border-border rounded-lg overflow-auto" 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover?.(null, 0, 0)}
    >
      {chart}
    </div>
  );
};
