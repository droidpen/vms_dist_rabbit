import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function cleanupDB() {
  const env = fs.readFileSync('VMS/.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();
  const supabase = createClient(url, key);

  console.log("Cleaning up database...");

  // 1. Delete "Demo Project" entirely
  await supabase.from('projects').delete().eq('project_name', 'Demo Project');
  console.log("- Deleted 'Demo Project' from projects table.");

  // 2. Wipe physical file records for the two broken projects so they auto-prime cleanly
  const projectsToWipe = [
      'Financial Transaction Fraud Detection System',
      'Citizen Document Processing Platform'
  ];

  for (const proj of projectsToWipe) {
      const { count, error } = await supabase.from('uploaded_files')
          .delete({ count: 'exact' })
          .eq('project_name', proj);
      console.log(`- Purged ${count || 0} stuck/duplicate file records for '${proj}'.`);
  }

  console.log("Cleanup complete!");
}
cleanupDB();