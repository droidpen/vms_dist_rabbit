import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderKanban, ChevronDown, Plus, LayoutGrid, CheckCircle2 } from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  system_type: string;
  created_at: string;
}

interface ProjectSelectorProps {
  currentProject: string;
  onSelect: (projectName: string) => void;
  onNew: (projectName: string) => void;
}

export function ProjectSelector({ currentProject, onSelect, onNew }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [currentProject]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleCreateNew = () => {
    const name = window.prompt("Enter new project name:");
    if (name && name.trim().length > 0) {
      onNew(name.trim());
      setIsOpen(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This will erase all associated files and vectors.`)) {
      try {
        // 1. Fetch all file records to get their storage paths
        const { data: files } = await supabase
          .from('uploaded_files')
          .select('file_path, storage_bucket')
          .eq('project_name', projectName);

        // 2. Delete physical files from storage buckets
        if (files && files.length > 0) {
          console.log(`🧹 Cleaning up ${files.length} physical files for: ${projectName}`);
          for (const file of files) {
            await supabase.storage.from(file.storage_bucket).remove([file.file_path]);
          }
        }

        // 3. Delete from projects table (Cascades to uploaded_files and document_chunks in DB)
        const { error } = await supabase.from('projects').delete().eq('project_name', projectName);
        
        if (error) throw error;

        console.log(`✅ Successfully deleted project: ${projectName}`);
        fetchProjects();

        if (projectName === currentProject) {
          const fallback = projects.find(p => p.project_name !== projectName);
          if (fallback) onSelect(fallback.project_name);
          else handleCreateNew();
        }
      } catch (error: any) {
        console.error("❌ Failed to delete project completely:", error.message);
        alert("Failed to delete project fully. Check console for details.");
      }
    }
  };

  const PRELOADED_PROJECTS = [
    'E-Government Payment Gateway',
    'Financial Transaction Fraud Detection System',
    'Citizen Document Processing Platform'
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-secondary/50 border-2 border-border rounded-lg hover:border-primary/50 transition-all group"
        >
          <div className="p-1.5 bg-primary text-primary-foreground rounded-md shadow-sm group-hover:scale-110 transition-transform">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">Active Project</p>
            <h2 className="text-sm font-bold text-foreground leading-none flex items-center gap-2">
              {currentProject}
              <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </h2>
          </div>
        </button>

        <button
          onClick={handleCreateNew}
          className="px-3 py-2 bg-white border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-all shadow-sm flex items-center gap-2"
          title="Start New Project"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-bold whitespace-nowrap">New Project</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-3 w-[350px] bg-card border-2 border-border shadow-2xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Vault</h4>
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[8px] font-black">{projects.length} ACTIVE</span>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-muted-foreground font-mono animate-pulse">Scanning Cloud Vault...</div>
              ) : projects.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground font-mono italic">No projects found.</div>
              ) : (
                projects.map((p) => {
                  const isPreloaded = PRELOADED_PROJECTS.includes(p.project_name);
                  
                  return (
                    <div key={p.id} className="relative group">
                      <button
                        onClick={() => {
                          onSelect(p.project_name);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                          currentProject === p.project_name 
                            ? 'bg-primary/5 border border-primary/20' 
                            : 'hover:bg-secondary/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-8">
                          <LayoutGrid className={`w-4 h-4 flex-shrink-0 ${currentProject === p.project_name ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold leading-tight mb-0.5 truncate">{p.project_name}</p>
                            <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter truncate">
                              {p.system_type.replace(/-/g, ' ')}
                            </p>
                          </div>
                        </div>
                        {currentProject === p.project_name && <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />}
                      </button>
                      
                      {!isPreloaded && p.id !== 'temp' && (
                        <button
                          onClick={(e) => handleDeleteProject(e, p.project_name)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Delete Project"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
