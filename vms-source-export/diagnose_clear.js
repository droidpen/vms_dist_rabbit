import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function diagnoseClear() {
  const env = fs.readFileSync('VMS/.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();

  const supabase = createClient(url, key);

  console.log("--- CLEAR DIAGNOSTIC ---");
  
  // 1. Check what's in the table
  const { data: records, error: fetchError } = await supabase.from('uploaded_files').select('project_name, file_name');
  if (fetchError) {
      console.error("❌ Failed to fetch records:", fetchError.message);
  } else {
      console.log(`Found ${records.length} records in uploaded_files:`);
      console.table(records);
  }

  // 2. Try a test deletion
  if (records.length > 0) {
      const targetProject = records[0].project_name;
      console.log(`\nAttempting test deletion for project: "${targetProject}"`);
      const { data, error, count } = await supabase
        .from('uploaded_files')
        .delete({ count: 'exact' })
        .eq('project_name', targetProject);
      
      if (error) {
          console.error("❌ Delete failed with error:", error.message);
          console.error("Details:", error.details);
          console.error("Hint:", error.hint);
      } else {
          console.log(`✅ Delete successful. Rows affected: ${count}`);
      }
  } else {
      console.log("\nNo records to test deletion with.");
  }
}

diagnoseClear();
