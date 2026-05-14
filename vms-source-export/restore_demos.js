import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function restoreDemos() {
  const env = fs.readFileSync('VMS/.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();
  const supabase = createClient(url, key);

  const projects = [
    'E-Government Payment Gateway',
    'Financial Transaction Fraud Detection System',
    'Citizen Document Processing Platform',
    'Demo Project'
  ];

  console.log("Checking project status...");
  
  for (const proj of projects) {
      const { count } = await supabase.from('uploaded_files').select('*', { count: 'exact', head: true }).eq('project_name', proj);
      console.log(`- ${proj}: ${count} files attached.`);
  }
}
restoreDemos();