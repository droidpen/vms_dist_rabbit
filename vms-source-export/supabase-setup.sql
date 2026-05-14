-- Risk Acceptance Review System - Database Schema
-- Run this SQL in your Supabase SQL Editor
-- Instructions: Copy this entire file, paste in SQL Editor, click Run
--
-- SAFE TO RE-RUN: This script uses IF NOT EXISTS and DROP IF EXISTS to prevent errors

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: uploaded_files
-- Stores metadata and audit trail for all uploaded files
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_bucket TEXT NOT NULL CHECK (storage_bucket IN ('ra-presentation', 'correspondence', 'supporting-evidence')),
  uploaded_by TEXT NOT NULL,
  project_name TEXT NOT NULL,
  ra_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: risk_acceptances
-- Stores risk acceptance submissions and review results
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
  recommendation TEXT CHECK (recommendation IN ('APPROVE', 'REJECT', 'REQUEST_INFO')),
  assessment_notes TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected'))
);

-- Table: projects
-- Stores project information and system architecture
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_name TEXT NOT NULL UNIQUE,
  description TEXT,
  architecture_diagram_url TEXT,
  system_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON uploaded_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_bucket ON uploaded_files(storage_bucket);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_project ON uploaded_files(project_name);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_ra_id ON uploaded_files(ra_id);
CREATE INDEX IF NOT EXISTS idx_risk_acceptances_created_at ON risk_acceptances(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_acceptances_ra_id ON risk_acceptances(ra_id);
CREATE INDEX IF NOT EXISTS idx_risk_acceptances_status ON risk_acceptances(status);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(project_name);

-- Enable Row Level Security (RLS)
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - you can restrict later)
-- Drop existing policies first to allow re-running this script
DROP POLICY IF EXISTS "Allow all operations on uploaded_files" ON uploaded_files;
DROP POLICY IF EXISTS "Allow all operations on risk_acceptances" ON risk_acceptances;
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;

CREATE POLICY "Allow all operations on uploaded_files" ON uploaded_files FOR ALL USING (true);
CREATE POLICY "Allow all operations on risk_acceptances" ON risk_acceptances FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);

-- Insert sample project for demo
INSERT INTO projects (project_name, description, system_type) VALUES
('E-Government Payment Gateway', '3-tier web application for citizen payment services', '3-tier-web-application')
ON CONFLICT (project_name) DO NOTHING;

-- Insert sample risk acceptance for demo
INSERT INTO risk_acceptances (
  ra_id,
  project_name,
  submitted_by,
  submitted_date,
  expiry_date,
  vulnerabilities,
  proposed_controls,
  supporting_docs,
  recommendation,
  assessment_notes,
  concerns,
  status
) VALUES (
  'RA-2026-0042',
  'E-Government Payment Gateway',
  'Officer 1 (Product Security)',
  '2026-04-10',
  '2026-07-10',
  '[{"cveId": "CVE-2024-3457", "severity": "MEDIUM"}]'::jsonb,
  ARRAY[
    'The server is hosted in the internal network which is only accessible by CAM and can only be accessed by authorized user.',
    'The web application is not used by any other users except Good Luck Infra.',
    'Firewall and IPS solution are implemented within the Good Luck Infra with network monitoring in place to aid in the detection of any potential malicious or unauthorized activities.'
  ],
  ARRAY['Test for Hackathon_desens.pptx', 'Test_VMS_report.xlsm', 'Vendor_pdf.pdf'],
  'APPROVE',
  ARRAY[
    'Analyzed 3 supporting documents from submission.',
    'Business case presentation (Test for Hackathon_desens.pptx) provides clear justification and timeline.',
    'Proposed compensating controls are comprehensive and address key attack vectors.',
    'Supporting evidence (Test_VMS_report.xlsm) validates finding severity.',
    'Email correspondence (Vendor_pdf.pdf) shows alignment and constraints.'
  ],
  ARRAY[]::TEXT[],
  'approved'
)
ON CONFLICT (ra_id) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully!' AS status;
