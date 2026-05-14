import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function reset() {
  const env = fs.readFileSync('.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1].trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1].trim();
  const supabase = createClient(url, key);

  console.log("Resetting auto_primed flags...");
  const { error } = await supabase.from('projects').update({ metadata: { auto_primed: false } }).neq('project_name', '');
  if (error) console.error(error);
  else console.log("Done.");
}
reset();
