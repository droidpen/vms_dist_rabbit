import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function checkFlags() {
  const env = fs.readFileSync('VMS/.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();
  const supabase = createClient(url, key);

  console.log("--- PROJECT FLAGS ---");
  const { data: projects } = await supabase.from('projects').select('project_name, metadata');
  console.table(projects);
}
checkFlags();