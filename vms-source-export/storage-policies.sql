-- ============================================
-- STORAGE BUCKET POLICIES - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================
-- This allows authenticated and anonymous users to upload/download files
-- from the storage buckets
--
-- SAFE TO RE-RUN: This script drops existing policies before recreating them

-- Policy for ra-presentation bucket
DROP POLICY IF EXISTS "Allow all operations on ra-presentation" ON storage.objects;
CREATE POLICY "Allow all operations on ra-presentation"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'ra-presentation')
WITH CHECK (bucket_id = 'ra-presentation');

-- Policy for correspondence bucket
DROP POLICY IF EXISTS "Allow all operations on correspondence" ON storage.objects;
CREATE POLICY "Allow all operations on correspondence"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'correspondence')
WITH CHECK (bucket_id = 'correspondence');

-- Policy for supporting-evidence bucket
DROP POLICY IF EXISTS "Allow all operations on supporting-evidence" ON storage.objects;
CREATE POLICY "Allow all operations on supporting-evidence"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'supporting-evidence')
WITH CHECK (bucket_id = 'supporting-evidence');
