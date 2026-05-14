import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, RefreshCw } from 'lucide-react';
import { getUploadedFiles, deleteFile, type UploadedFile } from '../../lib/uploadHelpers';
import { supabase } from '../../lib/supabase';

type ArtifactsBrowserProps = {
  projectName?: string;
  raId?: string;
  onClose?: () => void;
};

export function ArtifactsBrowser({ projectName, raId, onClose }: ArtifactsBrowserProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ra-presentation' | 'correspondence' | 'supporting-evidence'>('all');

  const loadFiles = async () => {
    setLoading(true);
    console.log('🔍 ArtifactsBrowser.loadFiles() called');
    console.log('  Query params:', { projectName, raId, filter });

    // DEBUG: Check what's in the database without filters
    console.log('  🔎 DEBUG: Checking all files in database...');
    const { data: allFiles } = await supabase.from('uploaded_files').select('*');
    console.log('  🔎 DEBUG: Total files in database:', allFiles?.length || 0);
    if (allFiles && allFiles.length > 0) {
      console.log('  🔎 DEBUG: All files:', allFiles.map(f => ({
        name: f.file_name,
        project: f.project_name,
        raId: f.ra_id
      })));
    }

    try {
      const bucket = filter === 'all' ? undefined : filter;
      const data = await getUploadedFiles(projectName, raId, bucket);
      console.log('  📦 Files found:', data.length);
      setFiles(data);
    } catch (error) {
      console.error('  ❌ Error loading files:', error);
      setFiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, [projectName, raId, filter]);

  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;

    const result = await deleteFile(fileId);
    if (result.success) {
      await loadFiles();
    } else {
      alert(`Failed to delete: ${result.error}`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getBucketLabel = (bucket: string): string => {
    const labels: Record<string, string> = {
      'ra-presentation': 'RA Presentation',
      'correspondence': 'Correspondence',
      'supporting-evidence': 'Supporting Evidence',
    };
    return labels[bucket] || bucket;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Artifacts Browser</h2>
            {projectName && <p className="text-sm text-muted-foreground mt-1">{projectName}</p>}
            {raId && <p className="text-sm text-muted-foreground font-mono">{raId}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadFiles}
              disabled={loading}
              className="px-3 py-2 rounded bg-secondary hover:bg-accent text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-secondary hover:bg-accent text-foreground"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-border px-6 py-3 flex gap-2">
          {(['all', 'ra-presentation', 'correspondence', 'supporting-evidence'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-accent'
              }`}
            >
              {f === 'all' ? 'All Files' : getBucketLabel(f)}
            </button>
          ))}
        </div>

        {/* Files List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No files uploaded yet</p>
              <p className="text-xs mt-2">⚠️ Run supabase-setup.sql and create storage buckets to enable uploads</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{file.file_name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <span className="font-mono">{getBucketLabel(file.storage_bucket)}</span>
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>{file.uploaded_by}</span>
                          <span>{new Date(file.created_at).toLocaleString()}</span>
                        </div>
                        {file.ra_id && (
                          <div className="mt-1 text-sm">
                            <span className="font-mono text-muted-foreground">{file.ra_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {file.metadata?.public_url && (
                        <a
                          href={file.metadata.public_url}
                          download={(() => {
                            // Generate filename with project name prefix
                            const sanitizedPrefix = (file.project_name || 'Project')
                              .replace(/[^a-zA-Z0-9\s-]/g, '')
                              .replace(/\s+/g, '_')
                              .substring(0, 50);
                            return `${sanitizedPrefix}_${file.file_name}`;
                          })()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="px-3 py-2 rounded bg-destructive text-destructive-foreground hover:opacity-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Total files: {files.length}
          </p>
        </div>
      </div>
    </div>
  );
}
