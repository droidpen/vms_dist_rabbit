import { useState } from 'react';
import { X, Database, CheckSquare, Zap, Copy, ShieldCheck, HardDrive } from 'lucide-react';

export function InfraProvisioning({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'sql' | 'checklist'>('sql');

  const sqlContent = `-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. CORE TABLES
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_bucket TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  project_name TEXT NOT NULL,
  ra_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS risk_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ra_id TEXT NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  submitted_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  vulnerabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  proposed_controls TEXT[] NOT NULL DEFAULT '{}',
  supporting_docs TEXT[] NOT NULL DEFAULT '{}',
  recommendation TEXT,
  assessment_notes TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_name TEXT NOT NULL UNIQUE,
  description TEXT,
  architecture_diagram_url TEXT,
  system_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. RAG VECTOR TABLE
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_id UUID REFERENCES uploaded_files(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(768), 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS POLICIES (Allowing all for demo)
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON uploaded_files FOR ALL USING (true);
CREATE POLICY "Allow all" ON risk_acceptances FOR ALL USING (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all" ON document_chunks FOR ALL USING (true);

-- 5. INDEXES
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ SQL copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-8">
      <div className="bg-card border-2 border-border shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-border bg-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Infrastructure Provisioning</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">System Administrator Utility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-secondary/5">
          <button 
            onClick={() => setActiveTab('sql')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'sql' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            Database Schema
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'checklist' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            Cloud Checklist
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'sql' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                   <Copy className="w-4 h-4 text-primary" /> Core Schema (Postgres + pgvector)
                </h3>
                <button 
                  onClick={() => copyToClipboard(sqlContent)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold rounded uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Copy Full SQL
                </button>
              </div>
              <div className="relative group">
                <pre className="p-6 bg-slate-950 text-slate-100 rounded-xl font-mono text-[10px] leading-relaxed overflow-x-auto shadow-inner border-2 border-white/5">
                  {sqlContent}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none rounded-xl" />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Paste this script into the Supabase SQL Editor and click "Run". This will provision all tables, extensions, and RAG search functions.
              </p>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChecklistItem 
                  step="1"
                  title="Storage Buckets"
                  desc="Create 3 PUBLIC buckets: 'ra-presentation', 'correspondence', and 'supporting-evidence'."
                  icon={<HardDrive className="w-5 h-5 text-blue-600" />}
                />
                <ChecklistItem 
                  step="2"
                  title="Edge Runtime"
                  desc="Deploy the 'process-document' function and set the GEMINI_API_KEY secret."
                  icon={<Zap className="w-5 h-5 text-amber-600" />}
                />
                <ChecklistItem 
                  step="3"
                  title="Storage Webhooks"
                  desc="Enable Database Webhooks and point 'objects' INSERT event to the Edge Function."
                  icon={<ShieldCheck className="w-5 h-5 text-green-600" />}
                />
                <ChecklistItem 
                  step="4"
                  title="RLS Policies"
                  desc="Ensure document_chunks allows service_role insertion and public selection."
                  icon={<Database className="w-5 h-5 text-purple-600" />}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-secondary/10 border-t border-border flex items-center justify-center">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Elite Team Operational Tooling • VMS v1.0</span>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ step, title, desc, icon }: any) {
  return (
    <div className="p-6 border-2 border-border bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase text-primary tracking-widest">Step {step}</p>
          <h4 className="text-xs font-bold uppercase">{title}</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}
