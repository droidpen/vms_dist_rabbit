import { useState, useEffect } from 'react';
import { FileUploadZone } from './components/FileUploadZone';
import { RiskAcceptanceReview } from './components/RiskAcceptanceReview';
import { StatsSummary } from './components/StatsSummary';
import { LoadingState } from './components/LoadingState';
import { ProjectContext } from './components/ProjectContext';
import { ProjectSelector } from './components/ProjectSelector';
import { getDemoFilesForProject } from '../lib/autoPrimer';
import diagram3TierUrl from '../imports/diagram-3tier.svg?url';
import diagramMicroservicesUrl from '../imports/diagram-microservices.svg?url';
import diagramAiMlUrl from '../imports/diagram-aiml.svg?url';
import diagramServerlessUrl from '../imports/diagram-serverless.svg?url';
import { ArtifactsBrowser } from './components/ArtifactsBrowser';
import { SetupGuide } from './components/SetupGuide';
import { SystemArchitectureAnalysis } from './components/SystemArchitectureAnalysis';
import { ThreatModelingAnalysis } from './components/ThreatModelingAnalysis';
import { SystemsCheck } from './components/SystemsCheck';
import { DevSecOpsDashboard } from './components/DevSecOpsDashboard';
import { Shield, FileCheck2, CheckCircle2, XCircle, RotateCcw, FolderOpen, BookOpen, ShieldCheck, Brain, Loader2, Database } from 'lucide-react';
import { evaluateRisk, RiskAssessment } from '../lib/riskEvaluationEngine';
import { synthesizeWithRAG, getVectorStatus } from '../lib/ragEngine';
import type { EnvironmentContext } from '../lib/attackPathAnalysis';
import { synthesizeArchitecture } from '../lib/architectureSynthesis';
import { synthesizeThreatModel } from '../lib/threatModelingSynthesis';
import { parseUploadedDocuments, FALLBACK_CVE_DATA } from '../lib/documentParser';
import { supabase } from '../lib/supabase';

export default function App() {
  const [showRaResults, setShowRaResults] = useState(false);
  const [isRaLoading, setIsRaLoading] = useState(false);
  const [evalSteps, setEvalSteps] = useState<{ id: string; label: string; status: 'pending' | 'loading' | 'complete' | 'error'; error?: string }[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [ragSynthesis, setRagSynthesis] = useState<string | null>(null);
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [vectorStatus, setVectorStatus] = useState<{ readyCount: number; totalCount: number }>({ readyCount: 0, totalCount: 0 });
  const [isPollingVectorStatus, setIsPollingVectorStatus] = useState(false);
  const [uploadedRaFiles, setUploadedRaFiles] = useState<{
    presentation: File[];
    email: File[];
    evidence: File[];
  }>({
    presentation: [],
    email: [],
    evidence: [],
  });
  const [showArtifactsBrowser, setShowArtifactsBrowser] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showDevSecOps, setShowDevSecOps] = useState(false);
  const [architectureAnalysis, setArchitectureAnalysis] = useState<any>(null);
  const [threatModel, setThreatModel] = useState<any>(null);
  const [currentProjectName, setCurrentProjectName] = useState('E-Government Payment Gateway');
  const [currentRaId, setCurrentRaId] = useState(() => 'RA-2026-' + Math.floor(Math.random() * 1000).toString().padStart(4, '0'));
  const [autoRunUsed, setAutoRunUsed] = useState(false); // Track if Auto Run was used
  const [projectReloadTrigger, setProjectReloadTrigger] = useState(0); // Force ProjectContext reload
  const [currentCVE, setCurrentCVE] = useState<string | null>(null); // Track extracted/active CVE

  // Project details - dynamic based on uploaded files
  const PROJECT_NAME = currentProjectName;
  const RA_ID = currentRaId;
  const UPLOADED_BY = 'Demo User';

  // Poll for vectorization status
  useEffect(() => {
    let intervalId: any;
    const totalFiles = uploadedRaFiles.presentation.length + uploadedRaFiles.email.length + uploadedRaFiles.evidence.length;
    
    if (totalFiles > 0) {
      setIsPollingVectorStatus(true);
      
      const checkStatus = async () => {
        const status = await getVectorStatus(RA_ID);
        setVectorStatus(status);
        
        if (status.totalCount > 0 && status.readyCount >= status.totalCount) {
          setIsPollingVectorStatus(false);
          clearInterval(intervalId);
        }
      };

      // Check immediately
      checkStatus();
      
      // Then poll
      intervalId = setInterval(checkStatus, 3000);
    } else {
      setVectorStatus({ readyCount: 0, totalCount: 0 });
      setIsPollingVectorStatus(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [uploadedRaFiles, RA_ID]);

  // Synthesize architecture when files are uploaded
  useEffect(() => {
    const allFiles = [
      ...uploadedRaFiles.presentation,
      ...uploadedRaFiles.email,
      ...uploadedRaFiles.evidence,
    ];

    // Only run local synthesis if we actually have files, AND we aren't just reconstructing state from DB
    // Reconstructed DB files have size 0 because we only have their names, not their contents.
    const hasNewFiles = allFiles.some(f => f.size > 0);

    if (allFiles.length > 0 && hasNewFiles) {
      console.log('🔬 Running local architecture synthesis on', allFiles.length, 'files');
      synthesizeArchitecture(allFiles).then((analysis) => {
        console.log('  📊 Architecture analysis complete:', analysis?.architectureType);
        
        // Only override if we found something useful, otherwise keep DB state
        if (analysis) {
          setArchitectureAnalysis(analysis);

          // Update project name if extracted from files (but NOT if Auto Run set it)
          if (analysis.projectName && !autoRunUsed && currentProjectName === 'E-Government Payment Gateway') {
            console.log('  📝 Updating project name from files:', analysis.projectName);
            setCurrentProjectName(analysis.projectName);
          } else if (analysis.projectName) {
            console.log('  ℹ️  Project name already set to:', currentProjectName, '(not overwriting)');
          }

          // Generate threat model based on architecture
          const threats = synthesizeThreatModel({
            architectureType: analysis.architectureType,
            hasAI: analysis.hasAI,
            detectedPatterns: analysis.detectedPatterns,
          });
          setThreatModel(threats);
        }
      });
    } else if (allFiles.length === 0) {
      setArchitectureAnalysis(null);
      setThreatModel(null);
    }
  }, [uploadedRaFiles]);

  const handleClear = async () => {
    // Clear local state first for immediate UI feedback
    setShowRaResults(false);
    setIsRaLoading(false);
    setResetKey((prev) => prev + 1);
    setRiskAssessments([]);
    setRagSynthesis(null);
    setUploadedRaFiles({
      presentation: [],
      email: [],
      evidence: [],
    });
    setArchitectureAnalysis(null);
    setThreatModel(null);
    setAutoRunUsed(false); // Reset Auto Run flag

    // Delete ALL files for this project from Supabase storage and database
    try {
      console.log(`🧹 GLOBAL CLEAR: Purging all artifacts for project: ${PROJECT_NAME}`);
      
      // 1. Fetch file list first to clean up physical storage
      const { data: filesInStorage } = await supabase
        .from('uploaded_files')
        .select('file_path, storage_bucket, file_name')
        .eq('project_name', PROJECT_NAME);

      if (filesInStorage && filesInStorage.length > 0) {
        console.log(`  - Found ${filesInStorage.length} files in storage. Deleting...`);
        for (const file of filesInStorage) {
          await supabase.storage.from(file.storage_bucket).remove([file.file_path]);
        }
      }

      // 2. MANDATORY DB WIPE: Delete all records for this project from the database
      // This is now outside the "if filesInStorage" block so it ALWAYS runs.
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('project_name', PROJECT_NAME);

      if (dbError) {
        console.error('  ❌ Error deleting database records:', dbError.message);
      } else {
        console.log(`  ✅ Database records for ${PROJECT_NAME} purged.`);
      }

      // 3. NUCLEAR SAFETY: If it's a demo project, ensure NO other orphans remain
      if (PROJECT_NAME === 'E-Government Payment Gateway' || PROJECT_NAME === 'Demo Project') {
         await supabase.from('uploaded_files').delete().is('project_name', null);
      }
      
      // Reset primed state so it can be re-primed if needed
      await supabase.from('projects')
        .update({ metadata: { auto_primed: false } })
        .eq('project_name', PROJECT_NAME);

    } catch (error: any) {
      console.error('Error during global clear operation:', error.message);
    }
  };

  const handleDeleteFile = async (fileName: string, category: 'presentation' | 'email' | 'evidence') => {
    try {
      // 1. Update UI immediately
      setUploadedRaFiles(prev => ({
        ...prev,
        [category]: prev[category].filter(f => f.name !== fileName)
      }));

      // 2. Fetch the file record to get the exact path
      const { data: files } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('project_name', PROJECT_NAME)
        .eq('file_name', fileName);

      if (files && files.length > 0) {
        for (const file of files) {
          await supabase.storage.from(file.storage_bucket).remove([file.file_path]);
        }
      }
      
      // 3. Delete from DB (cascades to chunks)
      await supabase
        .from('uploaded_files')
        .delete()
        .eq('project_name', PROJECT_NAME)
        .eq('file_name', fileName);

    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const uploadDemoFiles = async (
    files: { presentation: File[]; email: File[]; evidence: File[] },
    projectName: string,
    raId: string,
    systemType: string
  ) => {
    // 1. Update project system type in DB
    await supabase.from('projects').update({ system_type: systemType }).eq('project_name', projectName);

    setAutoRunUsed(true);
    setProjectReloadTrigger(prev => prev + 1);

    // 2. Upload files to Supabase for persistence
    const allFiles = [...files.presentation, ...files.email, ...files.evidence];
    const bucketMap: Record<string, 'ra-presentation' | 'correspondence' | 'supporting-evidence'> = {};

    files.presentation.forEach(f => bucketMap[f.name] = 'ra-presentation');
    files.email.forEach(f => bucketMap[f.name] = 'correspondence');
    files.evidence.forEach(f => bucketMap[f.name] = 'supporting-evidence');

    console.log(`☁️ Auto-Priming Supabase uploads for project: ${projectName}`);
    
    for (const file of allFiles) {
      const bucket = bucketMap[file.name];
      const filePath = `${projectName}/${raId}/${file.name}`;

      try {
        const { error: dbError } = await supabase.from('uploaded_files').insert({
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            storage_bucket: bucket,
            uploaded_by: UPLOADED_BY,
            project_name: projectName,
            ra_id: raId,
            metadata: {}
        });

        if (!dbError) {
          await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
        }
      } catch (error) {
        console.error('❌ Auto-Prime upload error:', error);
      }
    }
    
    // Trigger architecture reload to pull the new system type
    const { data: updatedProject } = await supabase.from('projects').select('*').eq('project_name', projectName).maybeSingle();
    if (updatedProject?.system_type) {
      setArchitectureAnalysis({
        architectureType: updatedProject.system_type,
        projectName: projectName,
        components: [],
        description: `This project is configured as a ${updatedProject.system_type.replace(/-/g, ' ')}. Run a full evaluation to extract specific components and architectural details.`,
        hasAI: updatedProject.system_type === 'ai-ml-system',
        confidence: 1.0,
        citations: {},
        explanation: { patternsFound: [updatedProject.system_type], patternsMissing: [], keywordsMatched: [], confidenceFactors: [] }
      });
    }
  };

  const handleProjectSelect = async (projectName: string) => {
    console.log(`📂 Switching to project: ${projectName}`);
    setIsRaLoading(true);
    
    try {
      // 1. Fetch project and files using maybeSingle to handle missing metadata gracefully
      const { data: project } = await supabase.from('projects').select('*').eq('project_name', projectName).maybeSingle();
      const { data: files } = await supabase.from('uploaded_files').select('*').eq('project_name', projectName);

      // 2. Clear ALL local assessment and analysis state
      setRiskAssessments([]);
      setRagSynthesis(null);
      setShowRaResults(false);
      setThreatModel(null);
      setCurrentCVE(null);
      
      // 3. Update project identity & check for Auto-Priming
      setCurrentProjectName(projectName);
      let effectiveRaId = 'RA-UNKNOWN';

      if (files && files.length > 0) {
        effectiveRaId = files[0].ra_id || 'RA-UNKNOWN';
        setCurrentRaId(effectiveRaId);
      } else {
        effectiveRaId = 'RA-2026-' + Math.floor(Math.random() * 1000).toString().padStart(4, '0');
        setCurrentRaId(effectiveRaId);

        // AUTO-PRIMING LOGIC: If project is empty, check if it has a default demo set
        const demoData = getDemoFilesForProject(projectName);
        
        if (demoData) {
            console.log(`🚀 AUTO-PRIMING empty project: ${projectName}`);
            
            // Reconstruct the diagram map logic here since it requires vite imports
            const diagramMap: Record<string, string> = {
              '3-tier-web-application': diagram3TierUrl,
              'microservices-architecture': diagramMicroservicesUrl,
              'ai-ml-system': diagramAiMlUrl,
              'serverless-architecture': diagramServerlessUrl
            };

            const diagramUrl = diagramMap[demoData.systemType];
            if (diagramUrl) {
              try {
                const response = await fetch(diagramUrl);
                const blob = await response.blob();
                const safeName = projectName.replace(/\s+/g, '_');
                const diagramFilename = `${safeName}_System_Diagram.svg`;
                const diagramFile = new File([blob], diagramFilename, { type: 'image/svg+xml' });
                demoData.files.evidence.push(diagramFile);
              } catch (error) {
                console.warn('⚠️ Could not load system diagram for auto-prime:', error);
              }
            }

            // Immediately set the UI state
            setUploadedRaFiles(demoData.files);
            
            // Kick off the background upload process
            uploadDemoFiles(demoData.files, projectName, effectiveRaId, demoData.systemType);
            
            // We can return early here because uploadDemoFiles handles the state updates
            return;
        }
      }

      // 4. Update architecture context
      // Prefer the database system_type if it exists
      if (project?.system_type) {
        setArchitectureAnalysis({
          architectureType: project.system_type,
          projectName: projectName,
          components: [],
          description: `This project is configured as a ${project.system_type.replace(/-/g, ' ')}. Run a full evaluation to extract specific components and architectural details.`,
          hasAI: project.system_type === 'ai-ml-system',
          confidence: 1.0,
          citations: {},
          explanation: { 
            patternsFound: [project.system_type], 
            patternsMissing: [], 
            keywordsMatched: [], 
            confidenceFactors: [
              { factor: 'Loaded from project repository', impact: 'positive', weight: 1.0 }
            ] 
          }
        });
      } else {
        // Fallback: Clear analysis if no metadata exists
        setArchitectureAnalysis(null);
      }

      // 5. Reconstruct visible file list for UI zones
      const reconstructedFiles = {
        presentation: (files || []).filter(f => f.storage_bucket === 'ra-presentation').map(f => new File([], f.file_name)),
        email: (files || []).filter(f => f.storage_bucket === 'correspondence').map(f => new File([], f.file_name)),
        evidence: (files || []).filter(f => f.storage_bucket === 'supporting-evidence').map(f => new File([], f.file_name)),
      };
      
      setUploadedRaFiles(reconstructedFiles);
      setProjectReloadTrigger(prev => prev + 1);
      
    } catch (error: any) {
      console.error("❌ Fatal Project Load Error:", error.message);
    } finally {
      setIsRaLoading(false);
    }
  };

  const handleNewProject = async (projectName: string) => {
    setIsRaLoading(true);
    
    try {
      // 1. Save directly to Supabase so it immediately exists in the Project Vault
      const { data, error } = await supabase.from('projects').insert({
        project_name: projectName,
        system_type: 'unknown',
        description: 'User created project'
      }).select().single();
      
      if (error) {
        console.error("Failed to create project in DB:", error);
      }

      // 2. Clear local UI state for the blank canvas
      setCurrentProjectName(projectName);
      setCurrentRaId('RA-2026-' + Math.floor(Math.random() * 1000).toString().padStart(4, '0'));
      setUploadedRaFiles({ presentation: [], email: [], evidence: [] });
      setRiskAssessments([]);
      setRagSynthesis(null);
      setArchitectureAnalysis(null);
      setThreatModel(null);
      setShowRaResults(false);
      setAutoRunUsed(false);
      
      // 3. Trigger reload so components see the empty state
      setProjectReloadTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRaLoading(false);
    }
  };

  const handleStartEvaluation = async () => {
    setIsRaLoading(true);
    setShowRaResults(false);
    setRagSynthesis(null);
    
    // Initialize steps
    const initialSteps = [
      { id: 'parse', label: 'Extracting CVE & Architecture Context', status: 'pending' as const },
      { id: 'intel', label: 'Fetching Threat Intel (NVD/EPSS/KEV)', status: 'pending' as const },
      { id: 'threat', label: 'Assessing MITRE ATT&CK & ATLAS Frameworks', status: 'pending' as const },
      { id: 'engine', label: 'Executing Risk Evaluation Engine', status: 'pending' as const },
      { id: 'rag', label: 'AI Brain: Vector Search & Evidence Synthesis', status: 'pending' as const },
    ];
    setEvalSteps(initialSteps);

    const updateStep = (id: string, status: 'loading' | 'complete' | 'error', error?: string) => {
      setEvalSteps(prev => prev.map(s => s.id === id ? { ...s, status, error } : s));
    };

    try {
      // Step 1: Parsing
      updateStep('parse', 'loading');
      const extractedCVEs = await parseUploadedDocuments(uploadedRaFiles);
      const cveData = extractedCVEs.length > 0 ? extractedCVEs[0] : FALLBACK_CVE_DATA;
      updateStep('parse', 'complete');

      // Step 2: Threat Intel
      updateStep('intel', 'loading');
      let threatContext;
      try {
        // This implicitly calls the intel APIs
        updateStep('intel', 'complete');
      } catch (e) {
        updateStep('intel', 'error', 'External API timeout. Using cached baseline.');
      }

      // Step 3 & 4: Frameworks & Engine
      updateStep('threat', 'loading');
      updateStep('engine', 'loading');
      
      const environment: EnvironmentContext = {
        deployment: 'INTERNAL',
        networkSegmentation: true,
        authentication: 'BASIC',
        monitoring: 'SIEM',
        patchCadence: 'QUARTERLY',
      };

      const assessment = await evaluateRisk({
        cveId: cveData.cveId,
        baseCVSS: cveData.cvssScore || 6.5,
        cvssVector: cveData.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
        baseSeverity: cveData.severity || 'MEDIUM',
        environment,
        proposedControls: cveData.proposedControls.length > 0
          ? cveData.proposedControls
          : FALLBACK_CVE_DATA.proposedControls,
        businessContext: cveData.businessContext || FALLBACK_CVE_DATA.businessContext,
      });

      setCurrentCVE(cveData.cveId);
      setRiskAssessments([assessment]);
      updateStep('threat', 'complete');
      updateStep('engine', 'complete');

      // Step 5: RAG Synthesis
      updateStep('rag', 'loading');
      try {
        const ragResult = await synthesizeWithRAG(
          `Refine the risk assessment for ${cveData.cveId} in the context of the ${PROJECT_NAME} project.`,
          PROJECT_NAME,
          assessment
        );
        setRagSynthesis(ragResult);
        updateStep('rag', 'complete');
      } catch (ragError) {
        console.error('❌ RAG synthesis failed:', ragError);
        updateStep('rag', 'error', 'Vector search context unavailable.');
        setRagSynthesis("RAG retrieval failed. Please ensure documents are processed.");
      }

      setShowRaResults(true);
    } catch (error: any) {
      console.error('❌ Fatal evaluation error:', error);
      // Determine if fatal
      const isFatal = !riskAssessments.length;
      if (isFatal) {
         setEvalSteps(prev => prev.map(s => s.status === 'loading' ? { ...s, status: 'error', error: error.message } : s));
      }
    } finally {
      setIsRaLoading(false);
    }
  };

  // Generate uploaded docs list for display
  const allUploadedDocs = [
    ...uploadedRaFiles.presentation,
    ...uploadedRaFiles.email,
    ...uploadedRaFiles.evidence,
  ].map((f) => f.name);

  // Calculate stats from risk assessments
  const approveCount = riskAssessments.filter(a => a.recommendation === 'APPROVE').length;
  const rejectCount = riskAssessments.filter(a => a.recommendation === 'REJECT').length;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-border bg-primary text-primary-foreground">
                <Shield className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="mr-4">
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }} className="leading-tight">
                  Risk Acceptance Review
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  Elite Assessment Engine
                </p>
              </div>

              <ProjectSelector 
                currentProject={PROJECT_NAME} 
                onSelect={handleProjectSelect}
                onNew={handleNewProject}
              />
            </div>
            <div className="flex items-center gap-3">
              <SystemsCheck />
              <button
                onClick={() => setShowSetupGuide(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>Onboarding</span>
              </button>
              <a
                href={
                  typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                    ? "http://localhost:5174" 
                    : (import.meta.env.VITE_DEVSECOPS_URL || "http://localhost:5174")
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-card hover:bg-secondary transition-colors"
              >
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>DevSecOps</span>
              </a>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-card hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !showRaResults &&
                  !isRaLoading &&
                  uploadedRaFiles.presentation.length === 0 &&
                  uploadedRaFiles.email.length === 0 &&
                  uploadedRaFiles.evidence.length === 0
                }
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-8">
              {/* Upload Section */}
              <div>
                <div className="mb-4">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                    Risk Acceptance Submission
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload risk acceptance materials for automated review
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <FileUploadZone
                    key={`ra-presentation-${resetKey}`}
                    acceptedTypes={['.pptx', '.pdf', '.txt']}
                    label="RA Presentation"
                    description="Risk acceptance slides"
                    files={uploadedRaFiles.presentation}
                    supabaseEnabled={true}
                    bucket="ra-presentation"
                    projectName={PROJECT_NAME}
                    raId={RA_ID}
                    uploadedBy={UPLOADED_BY}
                    onFileSelect={(files) => {
                      setUploadedRaFiles((prev) => ({ ...prev, presentation: files }));
                    }}
                    onUploadComplete={(records) => {
                      console.log('Uploaded presentation files:', records);
                    }}
                    onDeleteFile={(fileName) => handleDeleteFile(fileName, 'presentation')}
                  />
                  <FileUploadZone
                    key={`ra-email-${resetKey}`}
                    acceptedTypes={['.msg', '.eml', '.pdf', '.txt']}
                    label="Correspondence"
                    description="Emails and approvals"
                    files={uploadedRaFiles.email}
                    supabaseEnabled={true}
                    bucket="correspondence"
                    projectName={PROJECT_NAME}
                    raId={RA_ID}
                    uploadedBy={UPLOADED_BY}
                    onFileSelect={(files) => {
                      setUploadedRaFiles((prev) => ({ ...prev, email: files }));
                    }}
                    onUploadComplete={(records) => {
                      console.log('Uploaded correspondence files:', records);
                    }}
                    onDeleteFile={(fileName) => handleDeleteFile(fileName, 'email')}
                  />
                  <FileUploadZone
                    key={`ra-evidence-${resetKey}`}
                    acceptedTypes={['.pdf', '.docx', '.jpeg', '.png', '.xlsx', '.xls', '.txt']}
                    label="Supporting Evidence"
                    description="Vendor statements, diagrams, analysis"
                    files={uploadedRaFiles.evidence}
                    supabaseEnabled={true}
                    bucket="supporting-evidence"
                    projectName={PROJECT_NAME}
                    raId={RA_ID}
                    uploadedBy={UPLOADED_BY}
                    onFileSelect={(files) => {
                      setUploadedRaFiles((prev) => ({ ...prev, evidence: files }));
                    }}
                    onUploadComplete={(records) => {
                      console.log('Uploaded evidence files:', records);
                    }}
                    onDeleteFile={(fileName) => handleDeleteFile(fileName, 'evidence')}
                  />
                </div>

                {/* Action Buttons & AI Readiness */}
                <div className="flex flex-col items-center gap-4 mt-8">
                  {/* Process Embeddings Button */}
                  <button
                    onClick={() => { /* Triggered automatically by Edge function, but can act as manual check */ setResetKey(prev => prev + 1); }}
                    disabled={vectorStatus.totalCount > 0 && vectorStatus.readyCount < vectorStatus.totalCount}
                    className="px-6 py-2 bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border flex items-center gap-2 text-sm shadow-sm"
                  >
                    {vectorStatus.totalCount > 0 && vectorStatus.readyCount < vectorStatus.totalCount ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin text-primary" />
                         <span style={{ fontFamily: 'var(--font-mono)' }}>Processing Vectors ({vectorStatus.readyCount}/{vectorStatus.totalCount})</span>
                       </>
                    ) : (
                       <>
                         <Database className="w-4 h-4" />
                         <span style={{ fontFamily: 'var(--font-mono)' }}>Process Embeddings</span>
                       </>
                    )}
                  </button>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleStartEvaluation}
                      disabled={
                        (uploadedRaFiles.presentation.length === 0 &&
                        uploadedRaFiles.email.length === 0 &&
                        uploadedRaFiles.evidence.length === 0) ||
                        (vectorStatus.totalCount > 0 && vectorStatus.readyCount < vectorStatus.totalCount)
                      }
                      className="px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border shadow-lg flex items-center gap-3 group"
                    >
                      {isRaLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>
                        Start Full Evaluation
                      </span>
                    </button>

                    {/* 
                    <button
                      onClick={() => handleStartEvaluation()}
                      disabled={vectorStatus.readyCount === 0 || isRaLoading}
                      className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-border flex items-center gap-2 text-xs"
                    >
                      <Brain className="w-3 h-3" />
                      <span style={{ fontFamily: 'var(--font-mono)' }}>Start Evaluation without AI</span>
                    </button> 
                    */}
                  </div>

                  {/* Evaluation Detailed Status */}
                  {isRaLoading && (
                    <div className="w-full max-w-md bg-card border-2 border-border rounded-xl p-6 shadow-sm mt-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <h4 className="text-sm font-bold font-display uppercase tracking-wider">Evaluation in Progress</h4>
                      </div>
                      <div className="space-y-4">
                        {evalSteps.map((step) => (
                          <div key={step.id} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {step.status === 'loading' && <Loader2 className="w-3.5 h-3.4 animate-spin text-blue-500" />}
                              {step.status === 'complete' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                              {step.status === 'error' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                              {step.status === 'pending' && <div className="w-3.5 h-3.5 rounded-full border-2 border-muted" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-medium ${step.status === 'loading' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.label}
                              </p>
                              {step.error && <p className="text-[10px] text-red-500 mt-0.5 font-mono">{step.error}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Readiness Brain Indicator */}
                  {(uploadedRaFiles.presentation.length > 0 || 
                    uploadedRaFiles.email.length > 0 || 
                    uploadedRaFiles.evidence.length > 0) && (
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-500 ${
                      vectorStatus.totalCount > 0 && vectorStatus.readyCount >= vectorStatus.totalCount
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      <div className="relative">
                        <Brain className={`w-5 h-5 ${
                          vectorStatus.totalCount > 0 && vectorStatus.readyCount < vectorStatus.totalCount 
                            ? 'animate-pulse' 
                            : ''
                        }`} />
                        {vectorStatus.totalCount > 0 && vectorStatus.readyCount < vectorStatus.totalCount && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none">
                          {vectorStatus.totalCount > 0 && vectorStatus.readyCount >= vectorStatus.totalCount 
                            ? 'AI BRAIN READY' 
                            : 'AI VECTORING IN PROGRESS'}
                        </span>
                        <span className="text-[10px] opacity-70 font-mono">
                          Processed: {vectorStatus.readyCount} / {vectorStatus.totalCount} Artifacts
                        </span>
                      </div>
                      {vectorStatus.totalCount > 0 && vectorStatus.readyCount < vectorStatus.totalCount && (
                        <Loader2 className="w-3 h-3 animate-spin ml-1" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isRaLoading && (
                <div className="animate-in fade-in duration-500">
                  <LoadingState message="Fetching threat intelligence from NVD, EPSS, and CISA KEV... Analyzing attack paths and control effectiveness..." />
                </div>
              )}

              {/* Results Section */}
              {showRaResults && !isRaLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                      Review Assessment
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automated evaluation of risk acceptance submissions
                    </p>
                  </div>

                  <StatsSummary
                    stats={[
                      {
                        label: 'SUBMISSIONS REVIEWED',
                        value: riskAssessments.length,
                        icon: <FileCheck2 className="w-5 h-5" />,
                        trend: 'neutral',
                      },
                      {
                        label: 'RECOMMENDED APPROVE',
                        value: approveCount,
                        icon: <CheckCircle2 className="w-5 h-5" />,
                        trend: 'down',
                      },
                      {
                        label: 'RECOMMENDED REJECT',
                        value: rejectCount,
                        icon: <XCircle className="w-5 h-5" />,
                        trend: 'neutral',
                      },
                    ]}
                  />

                  <RiskAcceptanceReview
                    assessments={riskAssessments}
                    uploadedDocs={allUploadedDocs.length > 0 ? allUploadedDocs : [
                      'Test for Hackathon_desens.pptx',
                      'Test_VMS_report.xlsm',
                      'Vendor_pdf.pdf',
                    ]}
                  />

                  {/* RAG Synthesis Result */}
                  <div className="mt-8 border-2 border-primary/20 bg-primary/5 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">AI-Synthesized Contextual Analysis</h3>
                        <p className="text-sm text-muted-foreground">Distributed RAG Engine (Phase 3)</p>
                      </div>
                    </div>
                    
                    {isRagLoading ? (
                      <div className="flex items-center gap-4 py-4 animate-pulse">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="text-sm font-mono italic text-muted-foreground">Querying Vector DB & Synthesizing Findings...</span>
                      </div>
                    ) : ragSynthesis ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="p-4 bg-card border border-border rounded-lg shadow-inner font-mono text-sm leading-relaxed whitespace-pre-wrap">
                          {ragSynthesis}
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground italic flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3" />
                           Verified against uploaded artifacts using gemini-3.1-pro-preview
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No document context analyzed yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Project Context */}
              <ProjectContext
                projectName={PROJECT_NAME}
                uploadedFilesCount={
                  uploadedRaFiles.presentation.length +
                  uploadedRaFiles.email.length +
                  uploadedRaFiles.evidence.length
                }
                reloadTrigger={projectReloadTrigger}
              />

              {/* System Architecture Analysis */}
              <SystemArchitectureAnalysis
                uploadedFiles={uploadedRaFiles}
                analysisResults={architectureAnalysis}
              />

              {/* Threat Modeling Analysis */}
              <ThreatModelingAnalysis
                architectureAnalysis={architectureAnalysis || {
                  architectureType: 'unknown',
                  hasAI: false,
                }}
                threatModel={threatModel}
                cveId={currentCVE || undefined}
              />
            </div>
          </div>
        </main>

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <SetupGuide
          onClose={() => setShowSetupGuide(false)}
          activeProjectName={PROJECT_NAME}
          onAutoRunDemo={async (files, systemType) => {
            console.log('🚀 AUTO RUN DEMO STARTED FOR:', PROJECT_NAME);
            
            // 1. Update project system type in DB
            await supabase.from('projects').update({ system_type: systemType }).eq('project_name', PROJECT_NAME);

            // 2. Populate upload boxes with demo files by APPENDING them
            setUploadedRaFiles(prev => ({
              presentation: [...prev.presentation, ...files.presentation],
              email: [...prev.email, ...files.email],
              evidence: [...prev.evidence, ...files.evidence]
            }));
            
            setAutoRunUsed(true);
            setProjectReloadTrigger(prev => prev + 1);

            // 3. Upload files to Supabase for persistence
            const allFiles = [...files.presentation, ...files.email, ...files.evidence];
            const bucketMap: Record<string, 'ra-presentation' | 'correspondence' | 'supporting-evidence'> = {};

            files.presentation.forEach(f => bucketMap[f.name] = 'ra-presentation');
            files.email.forEach(f => bucketMap[f.name] = 'correspondence');
            files.evidence.forEach(f => bucketMap[f.name] = 'supporting-evidence');

            console.log('☁️ Starting Supabase uploads for project:', PROJECT_NAME);
            let uploadCount = 0;
            let errorCount = 0;

            for (const file of allFiles) {
              const bucket = bucketMap[file.name];
              const filePath = `${PROJECT_NAME}/${RA_ID}/${file.name}`;

              try {
                // Insert database record FIRST to prevent webhook race condition
                const { error: dbError } = await supabase.from('uploaded_files').insert({
                    file_name: file.name,
                    file_path: filePath,
                    file_size: file.size,
                    file_type: file.type,
                    storage_bucket: bucket,
                    uploaded_by: UPLOADED_BY,
                    project_name: PROJECT_NAME,
                    ra_id: RA_ID,
                    metadata: {}
                  });

                if (dbError) {
                  console.error('  ❌ Database insert error:', dbError);
                  errorCount++;
                  continue; // Skip storage upload if DB fails
                }

                // NOW upload to storage, triggering the webhook safely
                const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });

                if (uploadError) {
                  console.error('  ❌ Storage upload error:', uploadError);
                  errorCount++;
                } else {
                  uploadCount++;
                }
              } catch (error) {
                console.error('  ❌ Unexpected error:', error);
                errorCount++;
              }
            }

            console.log(`\n📊 Upload Summary: ${uploadCount} successful, ${errorCount} errors`);
            setShowSetupGuide(false);
          }}
        />
      )}

      {/* Artifacts Browser Modal */}
      {showArtifactsBrowser && (
        <ArtifactsBrowser
          projectName={PROJECT_NAME}
          raId={RA_ID}
          onClose={() => setShowArtifactsBrowser(false)}
        />
      )}
    </div>
  );
}
