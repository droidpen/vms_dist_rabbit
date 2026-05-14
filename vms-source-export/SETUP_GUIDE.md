# 🚀 Supabase Setup Guide - Risk Acceptance Review System

Welcome back! While you were sleeping, I've built the complete Supabase integration for your demo. This guide will walk you through the 3 simple setup steps needed to activate everything.

**⏱️ Total Time Required: ~5 minutes**

---

## ✅ What's Already Done

While you were sleeping, I completed:

1. ✅ **Backend Integration Code**
   - Supabase client library installed (`@supabase/supabase-js`)
   - Database helper functions created
   - File upload/download functionality implemented
   - Artifacts browser component built

2. ✅ **UI Components**
   - Project context display (shows E-Government Payment Gateway)
   - Artifacts browser with file management
   - File upload zones with Supabase integration
   - Real-time upload status indicators

3. ✅ **Demo Files**
   - 3 sample files created in `/demo-files/` folder:
     - `Test_for_Hackathon_desens.txt` (RA Presentation)
     - `Vendor_correspondence.txt` (Correspondence)
     - `Test_VMS_vulnerability_report.txt` (Vulnerability Report)

4. ✅ **Configuration Files**
   - `.env` file with your Supabase credentials
   - Database schema SQL ready to run
   - Storage bucket setup instructions

---

## 🎯 What You Need to Do (3 Steps)

### Step 1: Create Database Tables (2 minutes)

1. Go to https://supabase.com/dashboard/project/rcojgwrpyurkwbvlyxmi
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `/workspaces/default/code/supabase-setup.sql` in your code editor
5. **Copy the entire contents** of that file
6. **Paste it** into the Supabase SQL Editor
7. Click **Run** button (bottom right)
8. ✅ You should see: `"Database schema created successfully!"`

**What this does:**
- Creates 3 tables: `uploaded_files`, `risk_acceptances`, `projects`
- Sets up indexes for fast queries
- Enables Row Level Security
- Inserts demo project data ("E-Government Payment Gateway")
- Inserts sample RA-2026-0042 record

---

### Step 2: Create Storage Buckets (2 minutes)

1. Still in Supabase Dashboard, click **Storage** in the left sidebar
2. Click **New bucket**
3. Create these 3 buckets (one by one):

**Bucket 1:**
- Name: `ra-presentation`
- Public bucket: **Toggle ON** ✓
- Click **Create bucket**

**Bucket 2:**
- Name: `correspondence`
- Public bucket: **Toggle ON** ✓
- Click **Create bucket**

**Bucket 3:**
- Name: `supporting-evidence`
- Public bucket: **Toggle ON** ✓
- Click **Create bucket**

**Verification:** You should now see all 3 buckets listed in Storage.

📋 *Detailed instructions also available in: `/workspaces/default/code/SUPABASE_STORAGE_SETUP.md`*

---

### Step 3: Test the Demo! (1 minute)

1. **Refresh your Figma Make preview** (hard refresh if needed)
2. You should see:
   - ✅ Project context header: "E-Government Payment Gateway"
   - ✅ "View Artifacts" button in top-right
   - ✅ Three file upload zones

3. **Test File Upload:**
   - Navigate to `/workspaces/default/code/demo-files/`
   - Drag `Test_for_Hackathon_desens.txt` into "RA Presentation" box
   - You should see:
     - ✓ Green checkmark (upload successful)
     - File appears with size

4. **View Artifacts:**
   - Click "View Artifacts" button
   - You should see:
     - Your uploaded file listed
     - File metadata (name, size, timestamp, uploader)
     - Download button

5. **Test Team Collaboration:**
   - Share your Figma project with a teammate
   - Have them open the same app
   - They should see the same uploaded files! 🎉

---

## 🎨 How to Use the Demo

### Workflow for Demo Presentation:

1. **Show Project Context** (top of page)
   - Displays: "E-Government Payment Gateway"
   - System Type: "3-Tier Web Application"

2. **Upload Files** (drag & drop or click)
   - **RA Presentation**: Business case slides
   - **Correspondence**: Vendor emails and approvals  
   - **Supporting Evidence**: Vulnerability reports, diagrams
   
3. **Watch Upload Status**
   - Spinner = Uploading
   - Green checkmark = Success
   - Red alert = Error

4. **Click "Start Evaluation"**
   - Triggers AI analysis with threat intelligence
   - Shows assessment results
   - Displays recommendation (APPROVE/REJECT)

5. **View All Artifacts**
   - Click "View Artifacts" button
   - See complete audit trail
   - Filter by category
   - Download files
   - Delete if needed

---

## 📂 File Locations Reference

| File | Purpose |
|------|---------|
| `/workspaces/default/code/.env` | Supabase credentials (already configured) |
| `/workspaces/default/code/supabase-setup.sql` | Database schema (run in SQL Editor) |
| `/workspaces/default/code/SUPABASE_STORAGE_SETUP.md` | Storage bucket guide |
| `/workspaces/default/code/demo-files/` | Sample files for testing uploads |
| `/workspaces/default/code/src/lib/supabase.ts` | Supabase client initialization |
| `/workspaces/default/code/src/lib/uploadHelpers.ts` | Upload/download functions |
| `/workspaces/default/code/src/app/components/ArtifactsBrowser.tsx` | Artifacts viewer |
| `/workspaces/default/code/src/app/components/ProjectContext.tsx` | Project info display |

---

## 🔍 Verification Checklist

After completing Steps 1-3, verify:

- [ ] 3 tables visible in Supabase → **Database** → **Tables**
- [ ] 3 storage buckets visible in Supabase → **Storage**
- [ ] 1 project record in `projects` table ("E-Government Payment Gateway")
- [ ] 1 risk acceptance in `risk_acceptances` table (RA-2026-0042)
- [ ] File upload shows green checkmark ✓
- [ ] "View Artifacts" shows uploaded files
- [ ] Teammate can see the same files (team collaboration works!)

---

## 🐛 Troubleshooting

### "Failed to upload" error
- Check bucket names match exactly: `ra-presentation`, `correspondence`, `supporting-evidence`
- Verify buckets are set to **Public**
- Check browser console (F12) for specific error message

### "No files uploaded yet" in Artifacts Browser
- Make sure you uploaded files AFTER creating the buckets
- Try refreshing the artifacts browser (click refresh icon)
- Check Supabase Storage to confirm files are there

### Teammate can't see files
- Verify they're using the SAME Figma project (not a copy)
- Check they've refreshed their browser
- Confirm they're looking at the same project name in the app

### Database schema errors
- Make sure you ran the ENTIRE SQL file (scroll to the bottom to verify)
- Check for red error messages in SQL Editor
- Try running it again (SQL has `IF NOT EXISTS` checks, safe to re-run)

---

## 🎯 Demo Script Suggestion

**For your 2-day deadline demo:**

1. **Intro** (30 sec)
   - "This is a decision-support system for SecOps teams reviewing risk acceptances"
   
2. **Upload Demo** (1 min)
   - Drag demo files into the 3 upload zones
   - Point out real-time upload status
   - Show green checkmarks

3. **Analysis** (1 min)
   - Click "Start Evaluation"
   - Show loading state with threat intelligence message
   - Display recommendation with assessment notes

4. **Artifacts Browser** (1 min)
   - Click "View Artifacts"
   - Show complete audit trail
   - Filter by category
   - Show download capability

5. **Team Collaboration** (30 sec)
   - "Files are stored in Supabase, visible to entire team"
   - "Complete audit trail: who uploaded what, when"

---

## ✨ What Makes This Special

✅ **Persistent Storage**: Files survive browser refresh, shared across team
✅ **Audit Trail**: Every upload tracked with timestamp and user
✅ **Real Integration**: Uses actual Supabase (not mock data)
✅ **Production-Ready**: Same architecture scales to real deployment
✅ **Migration Path**: Easy to move from Supabase → SHIP-HATS PostgreSQL

---

## 🚀 Ready to Go?

1. ☐ Run SQL schema (Step 1)
2. ☐ Create 3 storage buckets (Step 2)
3. ☐ Test upload + artifacts viewer (Step 3)

**That's it! Your demo is ready! 🎉**

---

## 📞 Need Help?

If anything doesn't work:
1. Check the browser console (F12) for error messages
2. Check Supabase dashboard for data/buckets
3. Try clearing browser cache and hard refresh
4. Let me know the specific error message

**Good luck with your demo! 🚀**

*Built with ❤️ while you were sleeping*
