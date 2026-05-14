import { demoFileSets } from './demos/demoFiles';

// Helper function to convert text content to File object
export const createFileFromContent = (filename: string, content: string): File => {
  const blob = new Blob([content], { type: 'text/plain' });
  return new File([blob], filename, { type: 'text/plain', lastModified: Date.now() });
};

export const getDemoFilesForProject = (projectName: string) => {
    let fileSet;
    let systemType = 'unknown';

    if (projectName === 'E-Government Payment Gateway') {
        fileSet = demoFileSets['3tier'];
        systemType = '3-tier-web-application';
    } else if (projectName === 'Financial Transaction Fraud Detection System') {
        fileSet = demoFileSets['ai-ml'];
        systemType = 'ai-ml-system';
    } else if (projectName === 'Citizen Document Processing Platform') {
        fileSet = demoFileSets['serverless'];
        systemType = 'serverless-architecture';
    } else if (projectName === 'National Identity Verification Platform') {
        fileSet = demoFileSets['microservices'];
        systemType = 'microservices-architecture';
    }

    if (!fileSet) return null;

    const organizedFiles = {
      presentation: [] as File[],
      email: [] as File[],
      evidence: [] as File[],
    };

    Object.entries(fileSet.files).forEach(([originalFilename, content]) => {
      const personalizedContent = content.replace(/PROJECT:\s*([^\n]+)/gi, `PROJECT: ${projectName}`);

      let newFilename = originalFilename;
      if (projectName !== 'Demo Project') {
         const suffixMatch = originalFilename.match(/_([A-Za-z_]+\.[a-z]+)$/);
         if (suffixMatch) {
             const safeName = projectName.replace(/\s+/g, '_');
             newFilename = `${safeName}_${suffixMatch[1]}`;
         }
      }

      const file = createFileFromContent(newFilename, personalizedContent);

      if (newFilename.includes('Presentation') || newFilename.includes('RA_')) {
        organizedFiles.presentation.push(file);
      } else if (newFilename.includes('Email') || newFilename.includes('Correspondence') || newFilename.includes('Vendor') || newFilename.includes('Thread')) {
        organizedFiles.email.push(file);
      } else {
        organizedFiles.evidence.push(file);
      }
    });

    return { files: organizedFiles, systemType };
};