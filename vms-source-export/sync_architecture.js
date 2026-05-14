import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const archPath = path.resolve(__dirname, 'docs/ARCHITECTURE.md');
const outputPath = path.resolve(__dirname, 'src/lib/syncedArchitecture.ts');

function sync() {
  console.log('🔄 Syncing RAG Architecture Diagram...');
  
  if (!fs.existsSync(archPath)) {
    console.error('❌ Error: ARCHITECTURE.md not found');
    return;
  }

  const content = fs.readFileSync(archPath, 'utf8');
  
  // Extract the mermaid block from the Production section
  const regex = /### Production \(Vercel\) Architecture[\s\S]*?```mermaid([\s\S]*?)```/;
  const match = content.match(regex);

  if (!match || !match[1]) {
    console.error('❌ Error: Could not find Production Mermaid diagram in ARCHITECTURE.md');
    return;
  }

  const mermaidCode = match[1].trim();
  
  // Extract the Narrative section
  const narrativeRegex = /### Flow Narrative: The Lifecycle of a Risk Artifact([\s\S]*?)### Phase 1/;
  const narrativeMatch = content.match(narrativeRegex);
  const rawNarrative = narrativeMatch ? narrativeMatch[1].trim() : "Narrative not found.";
  
  // ESCAPE BACKTICKS to prevent breaking the TS template literal
  const narrativeContent = rawNarrative.replace(/`/g, '\\`');

  // EXTRACT STEPS FOR TOOLTIPS
  const stepMap = {};
  const lines = rawNarrative.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  lines.forEach(line => {
    const listMatch = line.match(/^(\d\.|\*|[A-G]\.)\s*(.*)/);
    if (listMatch) {
      let marker = listMatch[1].replace('.', '').trim();
      let rawContent = listMatch[2].trim();

      // Handle cases like "* **A. Title**"
      if (marker === '*') {
          const boldLetterMatch = rawContent.match(/^\*\*([A-G])\.\s*(.*?)\*\*(.*)/);
          if (boldLetterMatch) {
              marker = boldLetterMatch[1];
              // Re-adjust title and content
              rawContent = `**${boldLetterMatch[2]}** ${boldLetterMatch[3]}`;
          }
      }
      
      const boldMatch = rawContent.match(/\*\*(.*?)\*\*(.*)/);
      const title = boldMatch ? boldMatch[1] : '';
      const content = boldMatch ? boldMatch[2].replace(/^[:\s-]+/, '').trim() : rawContent;
      
      if (marker && marker !== '*' && (title || content)) {
        stepMap[marker] = { title, content: content.replace(/`/g, '') };
      }
    }
  });

  // EXTRACT COMPONENTS FOR TOOLTIPS
  const glossaryRegex = /### 🛠️ Component Glossary: The RAG Infrastructure([\s\S]*?)(?:###|The RAG implementation)/;
  const glossaryMatch = content.match(glossaryRegex);
  if (glossaryMatch) {
    const tableLines = glossaryMatch[1].split('\n').filter(l => l.includes('|'));
    tableLines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 3 && !parts[1].includes('---') && parts[1] !== 'Component') {
        const name = parts[1].replace(/\*\*/g, '').trim();
        const description = parts[2].trim();
        const role = parts[3].trim();
        
        // Find matching node ID/label from Mermaid
        // Mapping common labels to description
        const labelMap = {
            'VMS Risk System': 'VMS_App',
            'Retrieval Engine': 'Retrieval',
            'Generation Engine': 'Generation',
            'Google Gemini 3.1 Pro': 'Gemini',
            'Gemini embedding-2': 'EmbedModel',
            'Supabase Storage': 'Storage',
            'pgvector Database': 'VectorDB',
            'Edge Function': 'EdgeFunction'
        };

        const key = labelMap[name] || name;
        stepMap[key] = { title: role, content: description };
      }
    });
  }

  const tsContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * This file is updated by sync_architecture.js from docs/ARCHITECTURE.md
 */

export const RAG_ARCHITECTURE_MERMAID = \`
${mermaidCode.replace(/`/g, '\\`')}
\`;

export const RAG_FLOW_NARRATIVE = \`
${narrativeContent}
\`;

export const RAG_STEP_MAP: Record<string, { title: string, content: string }> = ${JSON.stringify(stepMap, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent);
  console.log('✅ Successfully synced architecture diagram to src/lib/syncedArchitecture.ts');
}

// Initial sync
sync();

// Watch for changes if --watch flag is provided
if (process.argv.includes('--watch')) {
  console.log('👀 Watching for changes in docs/ARCHITECTURE.md...');
  fs.watchFile(archPath, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      sync();
    }
  });
}

