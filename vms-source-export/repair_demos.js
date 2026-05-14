import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function repairDemos() {
  const env = fs.readFileSync('VMS/.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();
  const supabase = createClient(url, key);

  console.log("Cleaning up extra projects...");
  await supabase.from('projects').delete().neq('project_name', 'E-Government Payment Gateway').neq('project_name', 'National Identity Verification Platform');
  
  console.log("Restoring core preloaded projects...");
  const projects = [
    { project_name: 'E-Government Payment Gateway', system_type: '3-tier-web-application' },
    { project_name: 'Financial Transaction Fraud Detection System', system_type: 'ai-ml-system' },
    { project_name: 'Citizen Document Processing Platform', system_type: 'serverless-architecture' },
    { project_name: 'Demo Project', system_type: 'unknown' }
  ];

  for (const proj of projects) {
      await supabase.from('projects').upsert(proj, { onConflict: 'project_name' });
      console.log(`- Upserted: ${proj.project_name}`);
  }
}
repairDemos();