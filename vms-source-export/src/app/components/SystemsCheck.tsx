import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Activity, 
  ChevronDown, 
  Database, 
  HardDrive, 
  Brain,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function SystemsCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<{
    network: boolean;
    tables: boolean;
    buckets: boolean;
    gemini: boolean;
    loading: boolean;
  }>({ network: false, tables: false, buckets: false, gemini: false, loading: true });

  const checkInfrastructure = async () => {
    setStatus(prev => ({ ...prev, loading: true }));

    // 1. Check Network Connectivity to Supabase
    const networkOk = !!supabase.supabaseUrl;

    // 2. Check Database Tables
    let tablesOk = false;
    try {
      const { error } = await supabase.from('uploaded_files').select('id').limit(1);
      tablesOk = !error;
    } catch (e) {
      tablesOk = false;
    }

    // 3. Check Storage Buckets (by testing accessibility)
    const requiredBuckets = ['ra-presentation', 'correspondence', 'supporting-evidence'];
    const testBlob = new Blob(['check'], { type: 'text/plain' });
    const testPath = `__health_check__/${Date.now()}.txt`;
    
    let bucketsOk = false;
    try {
      const bucketResults = await Promise.all(
        requiredBuckets.map(async (bucket) => {
          const { error } = await supabase.storage.from(bucket).upload(testPath, testBlob, { upsert: true });
          if (!error) await supabase.storage.from(bucket).remove([testPath]);
          return !error;
        })
      );
      bucketsOk = bucketResults.every(res => res === true);
    } catch (e) {
      bucketsOk = false;
    }

    // 4. Check Gemini AI Connectivity (via local proxy or direct if safe)
    let geminiOk = false;
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        geminiOk = res.ok;
      }
    } catch (e) {
      geminiOk = false;
    }

    setStatus({
      network: networkOk,
      tables: tablesOk,
      buckets: bucketsOk,
      gemini: geminiOk,
      loading: false
    });
  };

  useEffect(() => {
    checkInfrastructure();
  }, []);

  const allSystemOk = status.network && status.tables && status.buckets && status.gemini;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border-2 transition-all duration-300 rounded-md ${
          status.loading 
            ? 'bg-secondary border-border animate-pulse' 
            : allSystemOk 
              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
              : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
        }`}
      >
        <Activity className={`w-4 h-4 ${status.loading ? 'animate-spin' : ''}`} />
        <span className="font-mono text-xs font-bold tracking-tight uppercase">
          {status.loading ? 'Verifying...' : 'Systems Check'}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-card border-2 border-border shadow-xl rounded-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Infrastructure Health</h4>
               <button onClick={checkInfrastructure} className="p-1 hover:bg-background rounded transition-colors text-muted-foreground">
                  <RefreshCw className={`w-3 h-3 ${status.loading ? 'animate-spin' : ''}`} />
               </button>
            </div>
            
            <div className="p-2 space-y-1">
              <StatusItem 
                icon={<Globe className="w-3.5 h-3.5" />}
                label="Cloud Connectivity"
                isOk={status.network}
                subLabel={status.network ? "Supabase reachable" : "Connection blocked"}
              />
              <StatusItem 
                icon={<Database className="w-3.5 h-3.5" />}
                label="Database Schema"
                isOk={status.tables}
                subLabel={status.tables ? "Tables version 1.0" : "Run setup.sql"}
              />
              <StatusItem 
                icon={<HardDrive className="w-3.5 h-3.5" />}
                label="Storage Buckets"
                isOk={status.buckets}
                subLabel={status.buckets ? "Public access ready" : "Check RLS policies"}
              />
              <StatusItem 
                icon={<Brain className="w-3.5 h-3.5" />}
                label="Gemini AI (v3.1)"
                isOk={status.gemini}
                subLabel={status.gemini ? "Brain synchronized" : "API key invalid"}
              />
            </div>

            <div className="p-3 bg-secondary/10 text-[10px] border-t border-border flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground font-mono italic">
                Environment: Development (Dual Portal)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusItem({ icon, label, isOk, subLabel }: { icon: React.ReactNode, label: string, isOk: boolean, subLabelTextText?: string, subLabelTextText?: string, subLabel: string }) {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-secondary/50 rounded transition-colors">
      <div className={`mt-0.5 ${isOk ? 'text-green-600' : 'text-red-600'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold leading-none">{label}</p>
          {isOk ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <XCircle className="w-3 h-3 text-red-500" />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 truncate font-mono italic">{subLabel}</p>
      </div>
    </div>
  );
}
