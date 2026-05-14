import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values for demo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rcojgwrpyurkwbvlyxmi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjb2pnd3JweXVya3didmx5eG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODY2NDIsImV4cCI6MjA5MzY2MjY0Mn0.TgGuoXyqfkEyM-0l5edx8PPuZ8ZUdlhwokaeFobmWVo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UploadedFile = {
  id: string;
  created_at: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  storage_bucket: 'ra-presentation' | 'correspondence' | 'supporting-evidence';
  uploaded_by: string;
  project_name: string;
  ra_id: string | null;
  metadata: Record<string, any>;
};

export type RiskAcceptance = {
  id: string;
  created_at: string;
  ra_id: string;
  project_name: string;
  submitted_by: string;
  submitted_date: string;
  expiry_date: string;
  vulnerabilities: Array<{ cveId: string; severity: string }>;
  proposed_controls: string[];
  supporting_docs: string[];
  recommendation: 'APPROVE' | 'REJECT' | 'REQUEST_INFO' | null;
  assessment_notes: string[];
  concerns: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
};

export type Project = {
  id: string;
  created_at: string;
  project_name: string;
  description: string | null;
  architecture_diagram_url: string | null;
  system_type: string | null;
  metadata: Record<string, any>;
};
