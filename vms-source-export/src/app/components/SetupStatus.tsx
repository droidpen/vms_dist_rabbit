import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function SetupStatus() {
  const [status, setStatus] = useState<{
    tables: boolean;
    buckets: boolean;
    loading: boolean;
  }>({ tables: false, buckets: false, loading: true });

  const checkSetup = async () => {
    console.log('🔍 SetupStatus.checkSetup() running...');
    setStatus(prev => ({ ...prev, loading: true }));

    try {
      // Check tables
      const { error: tablesError } = await supabase
        .from('uploaded_files')
        .select('id')
        .limit(1);

      // Tables are OK only if there's NO error
      // Any error (network, permissions, table not found) = NOT OK
      const tablesOk = !tablesError;
      console.log('  📊 Tables check:', tablesOk ? '✅' : '❌', tablesError);

      // Check buckets by attempting test uploads
      // Note: listBuckets() requires service_role key, so we test upload capability instead
      const requiredBuckets = ['ra-presentation', 'correspondence', 'supporting-evidence'];
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testPath = `__setup_test__/${Date.now()}.txt`;

      console.log('  📦 Testing bucket accessibility with test uploads...');
      const bucketResults = await Promise.all(
        requiredBuckets.map(async (bucket) => {
          const { error } = await supabase.storage
            .from(bucket)
            .upload(testPath, testBlob, { upsert: true });

          console.log(`    ${bucket}:`, error ? `❌ ${error.message}` : '✅');

          // Clean up test file if upload succeeded
          if (!error) {
            await supabase.storage.from(bucket).remove([testPath]);
          }

          return !error;
        })
      );

      const bucketsOk = bucketResults.every(result => result === true);
      console.log('  📦 All buckets accessible?', bucketsOk ? '✅' : '❌');

      setStatus({ tables: tablesOk, buckets: bucketsOk, loading: false });
    } catch (err) {
      // Network error - cannot reach Supabase at all
      console.log('  ℹ️ Cannot connect to Supabase - network blocked or offline');
      setStatus({ tables: false, buckets: false, loading: false });
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  if (status.loading) {
    return null;
  }

  if (status.tables && status.buckets) {
    return (
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-green-900">Supabase configured correctly</div>
          <div className="text-sm text-green-700 mt-1">Database tables and storage buckets are ready</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-orange-900">Supabase Setup Required</div>
          <div className="text-sm text-orange-700 mt-1">Some components are not configured yet</div>
        </div>
        <button
          onClick={checkSetup}
          className="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Recheck
        </button>
      </div>

      <div className="space-y-2 ml-8">
        <div className="flex items-center gap-2 text-sm">
          {status.tables ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className={status.tables ? 'text-green-700' : 'text-red-700'}>
            Database Tables {status.tables ? '(Ready)' : '(Missing - Run supabase-setup.sql)'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {status.buckets ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className={status.buckets ? 'text-green-700' : 'text-red-700'}>
            Storage Buckets {status.buckets ? '(Ready)' : '(Missing - Create in Supabase Dashboard)'}
          </span>
        </div>
      </div>

      {!status.buckets && (
        <div className="mt-3 ml-8 text-sm bg-white border border-orange-200 rounded p-3">
          <div className="font-medium text-orange-900 mb-2">
            {status.tables
              ? '⚠️ Storage bucket RLS policies need configuration'
              : 'ℹ️ Cannot connect to Supabase - Network unavailable'}
          </div>
          <div className="space-y-3">
            <div className="text-orange-700">
              {status.tables
                ? 'The buckets exist but have no policies. You need to add RLS policies:'
                : 'External database connections are blocked in this environment. If you are in the Figma Make preview, this is expected - the app will use demo data. If you are on a deployed instance, check your network connectivity and Supabase configuration.'}
            </div>
            {status.tables && (
              <>
                <ol className="list-decimal list-inside space-y-2 text-orange-700">
                  <li>Open Supabase Dashboard → SQL Editor</li>
                  <li>Copy the contents of <code className="bg-orange-100 px-1 py-0.5 rounded font-mono text-xs">storage-policies.sql</code> from the project root</li>
                  <li>Paste into SQL Editor and click "Run"</li>
                  <li>You should see "Success. No rows returned"</li>
                  <li>Click "Recheck" above to verify</li>
                </ol>
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                  <div className="text-xs font-medium text-orange-900 mb-1">Quick Copy (storage-policies.sql):</div>
                  <pre className="text-xs font-mono text-orange-800 overflow-x-auto whitespace-pre-wrap">
{`-- Run this in Supabase SQL Editor
-- SAFE TO RE-RUN: Drops existing policies before recreating

DROP POLICY IF EXISTS "Allow all operations on ra-presentation" ON storage.objects;
CREATE POLICY "Allow all operations on ra-presentation"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'ra-presentation')
WITH CHECK (bucket_id = 'ra-presentation');

DROP POLICY IF EXISTS "Allow all operations on correspondence" ON storage.objects;
CREATE POLICY "Allow all operations on correspondence"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'correspondence')
WITH CHECK (bucket_id = 'correspondence');

DROP POLICY IF EXISTS "Allow all operations on supporting-evidence" ON storage.objects;
CREATE POLICY "Allow all operations on supporting-evidence"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'supporting-evidence')
WITH CHECK (bucket_id = 'supporting-evidence');`}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
