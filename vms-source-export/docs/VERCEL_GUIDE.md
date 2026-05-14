# Vercel Deployment Guide (Dual Portal)

Since the system consists of two independent React applications (VMS Portal and DevSecOps Portal) that share a single Supabase backend, they must be deployed as two distinct projects in Vercel. This gives you two separate public URLs.

## Prerequisites
1. Ensure all code is committed and pushed to GitHub.
2. Have your Supabase credentials ready (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

---

## Deployment 1: The DevSecOps Portal (Dashboard)
*Deploy this first so we know its public URL.*

1. Log into Vercel and click **Add New → Project**.
2. Import your GitHub repository (`gemini-brain-vault`).
3. Configure the Project:
   * **Project Name:** `vms-devsecops-portal`
   * **Framework Preset:** `Vite`
   * **Root Directory:** `VMS/apps/devsecops-portal`
4. **Environment Variables:**
   * `VITE_SUPABASE_URL` = (Your Supabase URL)
   * `VITE_SUPABASE_ANON_KEY` = (Your Anon Key)
5. Click **Deploy**.
6. **Result:** Vercel will generate a URL like `https://vms-devsecops-portal.vercel.app`. **Copy this URL.**

---

## Deployment 2: The Main VMS Portal
*Deploy this second so we can link it to the Dashboard.*

1. Go back to your Vercel Dashboard and click **Add New → Project**.
2. Import the exact same GitHub repository (`gemini-brain-vault`).
3. Configure the Project:
   * **Project Name:** `vms-main-portal`
   * **Framework Preset:** `Vite`
   * **Root Directory:** `VMS`
4. **Environment Variables:**
   * `VITE_SUPABASE_URL` = (Your Supabase URL)
   * `VITE_SUPABASE_ANON_KEY` = (Your Anon Key)
   * `VITE_GEMINI_API_KEY` = (Your Gemini API Key, for RAG)
   * `VITE_DEVSECOPS_URL` = **(Paste the DevSecOps URL you copied in Step 1)**
5. Click **Deploy**.
6. **Result:** Vercel will generate a URL like `https://vms-main-portal.vercel.app`.

---

## Verification
You now have two completely independent public URLs. 
You can visit the DevSecOps portal directly, or you can click the "DevSecOps" button inside the main VMS portal, and it will route you to the correct Vercel-hosted dashboard instead of `localhost`.