import { supabase } from './supabase';

type BucketName = 'ra-presentation' | 'correspondence' | 'supporting-evidence';

export async function uploadFileToSupabase(
  file: File,
  bucket: BucketName,
  projectName: string,
  raId: string,
  uploadedBy: string = 'Demo User'
): Promise<{ success: boolean; error?: string; fileRecord?: any }> {
  try {
    // Generate unique file path
    const timestamp = new Date().getTime();
    const filePath = `${projectName}/${raId}/${timestamp}_${file.name}`;
    
    // Get public URL ahead of time (deterministic based on path)
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    console.log('    🔗 Generated URL:', urlData.publicUrl);

    // 1. Insert file metadata into database FIRST to prevent webhook race condition
    console.log('    💾 Inserting database record...');
    const { data: fileRecord, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        storage_bucket: bucket,
        uploaded_by: uploadedBy,
        project_name: projectName,
        ra_id: raId,
        metadata: {
          public_url: urlData.publicUrl,
          original_name: file.name,
        },
      })
      .select()
      .single();

    if (dbError) {
      if (dbError.message?.includes('row-level security policy')) {
        console.error('RLS policy error:', dbError);
        return { success: false, error: 'Database not configured. Run SQL setup in Setup Guide.' };
      }
      console.error('Database error:', dbError);
      return { success: false, error: dbError.message };
    }

    // 2. NOW upload to storage bucket, triggering the webhook safely
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Clean up the db record if storage upload fails
      await supabase.from('uploaded_files').delete().eq('id', fileRecord.id);
      return { success: false, error: uploadError.message };
    }

    return { success: true, fileRecord };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: String(err) };
  }
}

export async function getUploadedFiles(
  projectName?: string,
  raId?: string,
  bucket?: BucketName
): Promise<any[]> {
  console.log('📂 getUploadedFiles() called with:', { projectName, raId, bucket });
  try {
    let query = supabase
      .from('uploaded_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectName) {
      query = query.eq('project_name', projectName);
      console.log('  🔍 Filtering by project_name:', projectName);
    }
    if (raId) {
      query = query.eq('ra_id', raId);
      console.log('  🔍 Filtering by ra_id:', raId);
    }
    if (bucket) {
      query = query.eq('storage_bucket', bucket);
      console.log('  🔍 Filtering by storage_bucket:', bucket);
    }

    const { data, error } = await query;

    if (error) {
      // Silently handle table not found (database not set up yet)
      if (error.code === 'PGRST205') {
        console.log('  ℹ️ Table not found (database not set up)');
        return [];
      }
      console.log('  ℹ️ Database query failed - using demo mode');
      return [];
    }

    console.log('  ✅ Query successful, returned', data?.length || 0, 'files');

    if (data && data.length > 0) {
      console.log('  📋 File details:');
      data.forEach((file, idx) => {
        console.log(`    ${idx + 1}. ${file.file_name} (${file.storage_bucket}) - RA ID: ${file.ra_id}`);
      });
    }

    return data || [];
  } catch (err) {
    // Handle network errors (Supabase unreachable, CORS, sandboxed environment, etc.)
    if (err instanceof TypeError && (err as Error).message.includes('fetch')) {
      console.log('  ℹ️ External API calls blocked in preview environment');
      return [];
    }
    console.log('  ℹ️ Database connection unavailable');
    return [];
  }
}

export async function deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get file record
    const { data: fileRecord, error: fetchError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .maybeSingle();

    if (fetchError || !fileRecord) {
      return { success: false, error: 'File not found' };
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(fileRecord.storage_bucket)
      .remove([fileRecord.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: String(err) };
  }
}

export async function getRiskAcceptance(raId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('risk_acceptances')
      .select('*')
      .eq('ra_id', raId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

    if (error) {
      // Silently handle table not found (database not set up yet)
      if (error.code === 'PGRST205') {
        console.log('ℹ️ Table not found - database not set up');
        return null;
      }
      console.log('ℹ️ Database query failed - using demo mode');
      return null;
    }

    return data; // Will be null if no rows found, which is fine
  } catch (err) {
    // Handle network errors (Supabase unreachable, CORS, sandboxed environment, etc.)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      console.log('ℹ️ External API calls blocked in preview environment');
      return null;
    }
    console.log('ℹ️ Database connection unavailable');
    return null;
  }
}

export async function getProject(projectName: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('project_name', projectName)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

    if (error) {
      // Silently handle table not found (database not set up yet)
      if (error.code === 'PGRST205') {
        console.log('ℹ️ Table not found - database not set up, using demo data');
        return null;
      }
      // Suppress error logging in preview environments - connection failures are expected
      console.log('ℹ️ Database connection unavailable - using demo data');
      return null;
    }

    return data; // Will be null if no rows found, which is fine
  } catch (err) {
    // Handle network errors (Supabase unreachable, CORS, sandboxed environment, etc.)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      // This is expected in Figma Make preview - external APIs are blocked by sandbox
      console.log('ℹ️ External API calls blocked in preview environment - using demo data');
      return null;
    }
    console.log('ℹ️ Cannot connect to database - using demo data');
    return null;
  }
}
