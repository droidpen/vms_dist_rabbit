import { useState } from 'react';
import { X, FileText, Zap, Download, Layers } from 'lucide-react';

// Import system diagram SVG files
import diagram3TierUrl from '../../imports/diagram-3tier.svg?url';
import diagramMicroservicesUrl from '../../imports/diagram-microservices.svg?url';
import diagramAiMlUrl from '../../imports/diagram-aiml.svg?url';
import diagramServerlessUrl from '../../imports/diagram-serverless.svg?url';
import { demoFileSets } from '../../lib/demos/demoFiles';

type SetupGuideProps = {
  onClose: () => void;
  activeProjectName?: string;
  onAutoRunDemo?: (files: {
    presentation: File[];
    email: File[];
    evidence: File[];
  }, systemType: string) => void;
};

export function SetupGuide({ onClose, onAutoRunDemo, activeProjectName }: SetupGuideProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'demos' | 'architecture'>('quick');

  // Helper function to convert text content to File object
  const createFileFromContent = (filename: string, content: string): File => {
    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], filename, { type: 'text/plain', lastModified: Date.now() });
  };

  // Auto-run demo for a specific architecture set
  const handleAutoRunDemo = async (fileSet: typeof demoFileSets[keyof typeof demoFileSets]) => {
    if (!onAutoRunDemo) return;

    const organizedFiles = {
      presentation: [] as File[],
      email: [] as File[],
      evidence: [] as File[],
    };

    let systemType = '3-tier-web-application';
    const effectiveProjectName = activeProjectName || 'Demo Project';

    Object.entries(fileSet.files).forEach(([originalFilename, content]) => {
      // Dynamically inject the user's active project name into the document
      let personalizedContent = content;
      if (activeProjectName) {
         personalizedContent = content.replace(/PROJECT:\s*([^\n]+)/gi, `PROJECT: ${activeProjectName}`);
      }

      // Rename the file to match the active project instead of the original demo name
      // E.g. "3Tier_Web_App_RA_Presentation.txt" -> "My_Project_RA_Presentation.txt"
      let newFilename = originalFilename;
      if (activeProjectName && activeProjectName !== 'Demo Project') {
         // Extract the suffix (e.g., "_RA_Presentation.txt")
         const suffixMatch = originalFilename.match(/_([A-Za-z_]+\.[a-z]+)$/);
         if (suffixMatch) {
             const safeName = activeProjectName.replace(/\s+/g, '_');
             newFilename = `${safeName}_${suffixMatch[1]}`;
         }
      }

      const file = createFileFromContent(newFilename, personalizedContent);

      // Extract system type from original content
      const typeMatch = content.match(/ARCHITECTURE TYPE:\s*([^\n]+)/i);
      if (typeMatch && systemType === '3-tier-web-application') {
        const archType = typeMatch[1].trim();
        console.log('🔍 Found ARCHITECTURE TYPE:', archType);
        const archLower = archType.toLowerCase();

        if (archLower.includes('ai/ml') || archLower.includes('machine learning') ||
            archLower.includes('ml platform') || archLower.includes('ml system') ||
            /\bai\b/.test(archLower) || /\bml\b/.test(archLower)) {
          systemType = 'ai-ml-system';
        } else if (archLower.includes('serverless')) {
          systemType = 'serverless-architecture';
        } else if (archLower.includes('microservices')) {
          systemType = 'microservices-architecture';
        } else if (archLower.includes('3-tier')) {
          systemType = '3-tier-web-application';
        }
      }

      if (newFilename.includes('Presentation') || newFilename.includes('RA_')) {
        organizedFiles.presentation.push(file);
      } else if (newFilename.includes('Email') || newFilename.includes('Correspondence') || newFilename.includes('Vendor') || newFilename.includes('Thread')) {
        organizedFiles.email.push(file);
      } else {
        organizedFiles.evidence.push(file);
      }
    });

    // Load appropriate system diagram SVG file based on architecture type
    const diagramMap: Record<string, string> = {
      '3-tier-web-application': diagram3TierUrl,
      'microservices-architecture': diagramMicroservicesUrl,
      'ai-ml-system': diagramAiMlUrl,
      'serverless-architecture': diagramServerlessUrl
    };

    const diagramUrl = diagramMap[systemType];
    if (diagramUrl) {
      try {
        const response = await fetch(diagramUrl);
        const blob = await response.blob();
        const diagramFilename = `${effectiveProjectName.replace(/\s+/g, '_')}_System_Diagram.svg`;
        const diagramFile = new File([blob], diagramFilename, { type: 'image/svg+xml' });
        organizedFiles.evidence.push(diagramFile);
      } catch (error) {
        console.warn('  ⚠️ Could not load system diagram:', error);
      }
    }

    onAutoRunDemo(organizedFiles, systemType);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-8">
      <div className="bg-card border-2 border-border shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border bg-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Onboarding & Interactive Demos</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">User Activation Guide</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-secondary/5">
          <button 
            onClick={() => setActiveTab('quick')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'quick' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            Getting Started
          </button>
          <button 
            onClick={() => setActiveTab('demos')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'demos' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            Demo Library
          </button>
          <button 
            onClick={() => setActiveTab('architecture')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'architecture' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            Architecture Insight
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'quick' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 flex items-start gap-4">
                <div className="p-2 bg-blue-500 text-white rounded-lg shadow-md shadow-blue-100">
                   <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-bold text-blue-900 uppercase tracking-tight mb-1">Elite Speed: 30-Second Activation</h3>
                   <p className="text-sm text-blue-800/80 leading-relaxed font-medium">Use the "Demo Library" tab above to instantly populate the system with pre-analyzed security artifacts. No manual uploading required.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border-2 border-border bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black mb-4 shadow-lg shadow-primary/20">1</div>
                   <h4 className="font-bold uppercase text-xs mb-2 tracking-widest text-foreground/80">Acquire Data</h4>
                   <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Gather your RA presentation slides, vendor correspondence, and supporting technical evidence.</p>
                </div>
                <div className="p-6 border-2 border-border bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black mb-4 shadow-lg shadow-primary/20">2</div>
                   <h4 className="font-bold uppercase text-xs mb-2 tracking-widest text-foreground/80">AI Ingestion</h4>
                   <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Upload artifacts to the color-coded zones. The AI Brain will automatically begin vectorizing the content.</p>
                </div>
                <div className="p-6 border-2 border-border bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black mb-4 shadow-lg shadow-primary/20">3</div>
                   <h4 className="font-bold uppercase text-xs mb-2 tracking-widest text-foreground/80">Synthesize</h4>
                   <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Click "Start Evaluation with AI" to generate a technical risk assessment with evidence-based reasoning.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demos' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚡</span>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">📁 Synthetic Demo Files for Architecture Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose an architecture type below, then click the green <strong>"Auto Run Demo"</strong> button
                      for instant architecture analysis - no manual downloading or uploading needed!
                    </p>
                    <div className="bg-white border border-green-300 rounded px-3 py-2 text-xs">
                      <strong>New:</strong> Auto Run Demo button automatically populates all upload boxes and runs the analysis.
                      The setup guide will close so you can see the results immediately. 🚀
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded p-4">
                <h4 className="font-medium mb-3 text-sm tracking-widest uppercase">Upload Zone Guide</h4>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono uppercase font-black">
                  <div className="bg-blue-100 border-2 border-blue-300 rounded p-2.5 text-center">
                    <div className="text-blue-800 mb-1">RA Presentation</div>
                  </div>
                  <div className="bg-purple-100 border-2 border-purple-300 rounded p-2.5 text-center">
                    <div className="text-purple-800 mb-1">Correspondence</div>
                  </div>
                  <div className="bg-green-100 border-2 border-green-300 rounded p-2.5 text-center">
                    <div className="text-green-800 mb-1">Supporting Evidence</div>
                  </div>
                </div>
              </div>

              {Object.entries(demoFileSets).map(([key, fileSet]) => {
                return (
                  <div key={key} className="border-2 border-border p-4 bg-white hover:bg-secondary/10 transition-colors flex items-center justify-between group rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-sm uppercase">{fileSet.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground italic font-medium">{fileSet.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAutoRunDemo(fileSet)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-md shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        Auto Run Demo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 mb-2">
                   <Layers className="w-5 h-5 text-primary" /> Architecture Synthesis Insight
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The VMS system doesn't just extract text; it synthesizes the architecture of the 
                  system being reviewed by analyzing technical patterns across all uploaded documents.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border-2 border-border bg-white rounded-xl">
                  <h4 className="font-bold text-xs uppercase mb-3 text-primary">How it works:</h4>
                  <ul className="space-y-3 text-[10px] font-medium text-muted-foreground leading-relaxed">
                    <li className="flex gap-2"><span className="text-primary font-black">1.</span> Semantic keyword extraction across PDF, PPTX, and Emails.</li>
                    <li className="flex gap-2"><span className="text-primary font-black">2.</span> Identification of core components (Databases, Gateways, ML Models).</li>
                    <li className="flex gap-2"><span className="text-primary font-black">3.</span> Mapping to standard architecture patterns (3-Tier, Serverless, Microservices).</li>
                    <li className="flex gap-2"><span className="text-primary font-black">4.</span> Automatic generation of system-specific attack surface diagrams.</li>
                  </ul>
                </div>
                
                <div className="p-6 border-2 border-border bg-white rounded-xl">
                  <h4 className="font-bold text-xs uppercase mb-3 text-primary">Analysis Tips:</h4>
                  <ul className="space-y-3 text-[10px] font-medium text-muted-foreground leading-relaxed">
                    <li>Upload documents to the correct color-coded zones for better accuracy</li>
                    <li>Confidence scores indicate analysis quality (higher is better)</li>
                    <li>If architecture type is "Unknown", add more descriptive keywords to your files</li>
                    <li>Network diagrams are auto-generated based on detected components</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-secondary/10 border-t border-border flex items-center justify-center">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Elite Team Operational Tooling • VMS Onboarding v1.0</span>
        </div>
      </div>
    </div>
  );
}
