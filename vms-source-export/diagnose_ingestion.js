import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function diagnose() {
  const env = fs.readFileSync('VMS/.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();

  const supabase = createClient(url, key);

  console.log("--- DIAGNOSTIC REPORT ---");
  
  // Check latest files
  const { data: files } = await supabase.from('uploaded_files').select('id, file_name, ra_id').order('created_at', { ascending: false }).limit(5);
  console.log("\nLatest Uploaded Files:");
  console.table(files);

  const raId = files?.[0]?.ra_id;
  console.log(`Checking for RA_ID: ${raId}`);

  if (raId) {
     const { data: raFiles } = await supabase.from('uploaded_files').select('id, file_name').eq('ra_id', raId);
     console.log("\nFiles for this RA:");
     
     for (const file of raFiles || []) {
       const { count } = await supabase.from('document_chunks').select('*', { count: 'exact', head: true }).eq('file_id', file.id);
       console.log(`- ${file.file_name}: ${count} chunks`);
     }
  }
}

diagnose();
