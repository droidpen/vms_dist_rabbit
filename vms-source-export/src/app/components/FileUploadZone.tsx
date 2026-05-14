import { Upload, FileText, FileSpreadsheet, FileImage, Mail, Presentation, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { uploadFileToSupabase } from '../../lib/uploadHelpers';

interface FileUploadZoneProps {
  acceptedTypes: string[];
  label: string;
  description: string;
  onFileSelect?: (files: File[]) => void;
  files?: File[]; // External files to display (e.g., from demo)
  // Supabase integration props (optional)
  supabaseEnabled?: boolean;
  bucket?: 'ra-presentation' | 'correspondence' | 'supporting-evidence';
  projectName?: string;
  raId?: string;
  uploadedBy?: string;
  onUploadComplete?: (fileRecords: any[]) => void;
  onDeleteFile?: (fileName: string) => void;
}

const getIconForType = (type: string) => {
  if (type.includes('sheet') || type.includes('excel')) return FileSpreadsheet;
  if (type.includes('presentation') || type.includes('ppt')) return Presentation;
  if (type.includes('image')) return FileImage;
  if (type.includes('msg')) return Mail;
  return FileText;
};

export function FileUploadZone({
  acceptedTypes,
  label,
  description,
  onFileSelect,
  files,
  supabaseEnabled = false,
  bucket,
  projectName,
  raId,
  uploadedBy,
  onUploadComplete,
  onDeleteFile
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'uploading' | 'success' | 'error'>>({});

  // Sync internal state with external prop changes (e.g. when switching projects)
  useEffect(() => {
    if (files) {
      setUploadedFiles(files);
    }
  }, [files]);

  // Use external files if provided, otherwise use local state
  const displayedFiles = uploadedFiles;

  const handleFiles = async (files: File[]) => {
    setUploadedFiles(files);
    onFileSelect?.(files);

    // If Supabase is enabled, upload files immediately
    if (supabaseEnabled && bucket && projectName && raId) {
      const fileRecords: any[] = [];

      for (const file of files) {
        const fileName = file.name;
        setUploadStatus(prev => ({ ...prev, [fileName]: 'uploading' }));

        try {
          const result = await uploadFileToSupabase(
            file,
            bucket,
            projectName,
            raId,
            uploadedBy
          );

          if (result.success && result.fileRecord) {
            setUploadStatus(prev => ({ ...prev, [fileName]: 'success' }));
            fileRecords.push(result.fileRecord);
          } else {
            setUploadStatus(prev => ({ ...prev, [fileName]: 'error' }));
          }
        } catch (error) {
          console.error('Upload error:', error);
          setUploadStatus(prev => ({ ...prev, [fileName]: 'error' }));
        }
      }

      onUploadComplete?.(fileRecords);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const Icon = getIconForType(acceptedTypes[0]);

  return (
    <div className="border-2 border-border bg-card transition-all hover:border-foreground/20">
      <div className="p-4 border-b-2 border-border">
        <h3 style={{ fontFamily: 'var(--font-display)' }}>{label}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-8 transition-all duration-200 ${isDragging ? 'bg-accent border-primary' : 'bg-card'}`}
      >
        <label className="flex flex-col items-center cursor-pointer">
          <div className={`p-4 border-2 ${isDragging ? 'border-primary' : 'border-border'} transition-colors`}>
            <Icon className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <span className="mt-4 text-sm">Drop files or click to browse</span>
          <span className="mt-1 text-xs text-muted-foreground">
            {acceptedTypes.join(', ')}
          </span>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </label>

        {displayedFiles.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-border">
            <div className="space-y-2">
              {displayedFiles.map((file, idx) => {
                const status = uploadStatus[file.name];
                return (
                  <div key={idx} className="flex items-center gap-3 text-sm p-2 bg-secondary">
                    {status === 'uploading' && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                    {status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                    {status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    )}
                    {!status && <FileText className="w-4 h-4 flex-shrink-0" />}
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground mr-2">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (onDeleteFile) {
                          onDeleteFile(file.name);
                        } else {
                          const updatedFiles = uploadedFiles.filter(f => f.name !== file.name);
                          setUploadedFiles(updatedFiles);
                          onFileSelect?.(updatedFiles);
                        }
                      }}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
