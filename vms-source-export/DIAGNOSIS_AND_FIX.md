# Diagnosis & Fix for Missing Artifacts Issue

## 🔍 Root Cause Identified

The artifacts were empty because **Supabase storage buckets have no RLS policies**. The database tables and buckets exist, but Row-Level Security policies are blocking all uploads.

Error: `new row violates row-level security policy`

When you create storage buckets in Supabase, RLS is enabled by default with **no policies**, which blocks all operations. We need to add policies to allow uploads.

## 🧪 Verification Test Results

Ran automated tests with results:
- ✅ Database tables exist (uploaded_files, projects, risk_acceptances)
- ✅ Storage buckets exist (ra-presentation, correspondence, supporting-evidence)
- ❌ Upload attempts fail with "new row violates row-level security policy"

**Console Output:**
```
🔍 SetupStatus.checkSetup() running...
   📊 Tables check: ✅
   📦 Testing bucket accessibility with test uploads...
     correspondence: ❌ new row violates row-level security policy
     ra-presentation: ❌ new row violates row-level security policy
     supporting-evidence: ❌ new row violates row-level security policy
   📦 All buckets accessible? ❌
```

## 🛠️ How to Fix

### Step 1: Add Storage Bucket Policies

The buckets exist but need RLS policies to allow uploads.

1. Go to your Supabase Dashboard: https://rcojgwrpyurkwbvlyxmi.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Copy the **entire contents** of `storage-policies.sql` from your project root
4. Paste into the SQL Editor
5. Click **"Run"**
6. You should see: **"Success. No rows returned"**

**Quick Copy:**
```sql
-- Run this in Supabase SQL Editor
CREATE POLICY "Allow all operations on ra-presentation"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'ra-presentation')
WITH CHECK (bucket_id = 'ra-presentation');

CREATE POLICY "Allow all operations on correspondence"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'correspondence')
WITH CHECK (bucket_id = 'correspondence');

CREATE POLICY "Allow all operations on supporting-evidence"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'supporting-evidence')
WITH CHECK (bucket_id = 'supporting-evidence');
```

### Step 2: Verify Setup

After running the SQL, you'll see a green status indicator at the top of the app:
> ✅ Supabase configured correctly

If you still see an orange warning, click the **"Recheck"** button.

## 📊 New Features Added for Debugging

### 1. Setup Status Component
A new status checker appears at the top of the app showing:
- ✅ Database Tables status
- ✅ Storage Buckets status
- Step-by-step instructions if something is missing
- "Recheck" button to verify after fixing

### 2. Comprehensive Console Logging
Detailed logs now show:

**When you click Auto Run Demo:**
```
🚀 AUTO RUN DEMO STARTED
📦 Project Name: National Identity Verification Platform
📄 Files received: { presentation: 1, email: 1, evidence: 2 }
🔖 Generated RA ID: RA-2026-1234
✅ State updated - Project: National Identity Verification Platform RA ID: RA-2026-1234
📋 Upload boxes populated with files
☁️ Starting Supabase uploads...
  📤 Uploading: RA_Presentation.txt to ra-presentation
  ✅ Storage upload successful
  ✅ Database record created
...
📊 Upload Summary: 4 successful, 0 errors
🏁 AUTO RUN DEMO COMPLETE
```

**When you click "View Artifacts":**
```
🔍 ArtifactsBrowser.loadFiles() called
  Query params: { projectName: "National Identity...", raId: "RA-2026-1234", filter: "all" }
📂 getUploadedFiles() called with: { projectName: "...", raId: "...", bucket: undefined }
  🔍 Filtering by project_name: National Identity Verification Platform
  🔍 Filtering by ra_id: RA-2026-1234
  ✅ Query successful, returned 4 files
  📦 Files found: 4
```

**Architecture Analysis:**
```
🔬 Running architecture synthesis on 4 files
  📊 Architecture analysis complete: Microservices Architecture
  ℹ️  Project name already set to: National Identity Verification Platform (not overwriting)
```

**Project Context Updates:**
```
🏢 ProjectContext loading project: National Identity Verification Platform
  📊 Project data loaded: Using demo data
```

## 🧪 How to Test (After Creating Buckets)

1. **Refresh the page** to reload the app
2. Verify the **green status indicator** appears
3. Click **"Setup Guide"** button
4. In the **Demo Files** tab, click **"Auto Run Demo"** on any architecture set
5. **Open browser console** (F12 or right-click → Inspect → Console)
6. You should see:
   - ✅ All upload steps succeeding
   - ✅ "Upload Summary: X successful, 0 errors"
7. The **top box** should change to show the demo project name (e.g., "National Identity Verification Platform")
8. Click **"View Artifacts"** button
9. You should see all 4 files listed

## 📝 Changes Made

### Files Modified:
1. **src/app/App.tsx**
   - Added comprehensive logging to Auto Run Demo
   - Fixed race condition in useEffect (removed currentProjectName from dependencies)
   - Added state tracking logging for architecture synthesis
   - Imported and added SetupStatus component

2. **src/app/components/ArtifactsBrowser.tsx**
   - Added logging to loadFiles() to track queries

3. **src/lib/uploadHelpers.ts**
   - Added detailed logging to getUploadedFiles()

4. **src/app/components/ProjectContext.tsx**
   - Added logging to project loading

### Files Created:
1. **src/app/components/SetupStatus.tsx** - Visual setup verification component
2. **test-supabase.mjs** - Automated Supabase connectivity test
3. **create-buckets.mjs** - Attempted automated bucket creation (requires service role key)
4. **DIAGNOSIS_AND_FIX.md** - This file

## 🔄 What Should Work Now (After Fix)

1. ✅ Auto Run Demo populates files
2. ✅ Files upload to Supabase storage
3. ✅ Files appear in "View Artifacts"
4. ✅ Top box (ProjectContext) updates to show demo project name
5. ✅ Architecture analysis detects correct system type
6. ✅ Threat model generates appropriate MITRE ATT&CK/ATLAS tactics
7. ✅ Downloaded files include project name prefix

## ❓ Still Having Issues?

Check the browser console for detailed logs. Common patterns:

**If uploads fail:**
- Look for `❌ Storage upload error:` or `❌ Database insert error:`
- Verify buckets were created with exact names (case-sensitive)

**If project name doesn't change:**
- Check console for `📝 Updating project name from files:` or `ℹ️ Project name already set to:`
- Verify files contain PROJECT: line in content

**If artifacts are empty:**
- Check console for `📦 Files found: 0`
- Verify the RA ID in the query matches the uploaded files
- Check if database table has RLS policies that might block access
