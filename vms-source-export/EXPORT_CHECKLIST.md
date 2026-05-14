# Export Checklist for Deployment

Use this checklist before exporting the project as a ZIP file for deployment.

## ✅ Critical Files Verification

Ensure these files are present in the project root:

### Required Files
- [x] `package.json` - Dependencies and scripts
- [x] `pnpm-lock.yaml` - Lock file for reproducible builds
- [x] `.env.example` - Environment variable template
- [x] `.gitignore` - Git ignore rules
- [x] `README.md` - Project documentation
- [x] `DEPLOYMENT.md` - Deployment instructions
- [x] `.gitlab-ci.yml` - CI/CD configuration
- [x] `supabase-setup.sql` - Database schema
- [x] `storage-policies.sql` - Storage bucket policies

### Source Files
- [x] `src/` directory with all application code
- [x] `src/app/App.tsx` - Main application
- [x] `src/app/components/` - All React components
- [x] `src/lib/` - Utility libraries
- [x] `src/styles/` - CSS files
- [x] `src/imports/` - SVG diagrams

### Configuration Files
- [x] `postcss.config.mjs` - PostCSS configuration
- [x] `vite.config.ts` - Vite build configuration (if exists)

### Optional but Recommended
- [x] `CLAUDE.md` - Architecture documentation
- [x] `demo-files/` - Demo data (optional for production)

---

## ❌ Files to EXCLUDE from Export

**Do NOT include these files** (they're in `.gitignore`):

- [ ] `.env` - Contains secrets (use `.env.example` instead)
- [ ] `.env.local` - Local environment overrides
- [ ] `.env.production` - Production secrets
- [ ] `node_modules/` - Will be reinstalled during build
- [ ] `dist/` - Build output (generated during deployment)
- [ ] `.vite/` - Vite cache
- [ ] `.supabase/` - Supabase local dev files
- [ ] `.claude/` - Claude Code session data
- [ ] `sessions/` - Session files

---

## 📦 Creating the Export ZIP

### Option 1: Manual ZIP (Recommended)

```bash
# From project root
zip -r risk-acceptance-app.zip . \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".vite/*" \
  -x ".env" \
  -x ".env.local" \
  -x ".env.production" \
  -x ".supabase/*" \
  -x ".claude/*" \
  -x "sessions/*" \
  -x "*.log"
```

### Option 2: Using Git

```bash
# Create archive from git (excludes .gitignore files automatically)
git archive -o risk-acceptance-app.zip HEAD
```

---

## 🔍 Post-Export Verification

After creating the ZIP, verify it contains:

### 1. Extract and Check Structure

```bash
# Extract to temporary location
unzip risk-acceptance-app.zip -d /tmp/verify-export

# Check critical files exist
ls -la /tmp/verify-export/package.json
ls -la /tmp/verify-export/.env.example
ls -la /tmp/verify-export/src/
```

### 2. Verify package.json

```bash
cat /tmp/verify-export/package.json | grep -E '"name"|"version"|"dependencies"'
```

Should show:
- `"name": "risk-acceptance-review-system"`
- `"version": "1.0.0"`
- Dependencies including `@supabase/supabase-js`

### 3. Test Build (Optional but Recommended)

```bash
cd /tmp/verify-export
pnpm install
pnpm run build
```

Should create `dist/` folder with:
- `index.html`
- `assets/` folder with JS and CSS

---

## 📋 Deployment Preparation

Before sending to deployment team:

### 1. Document Requirements

Create a handoff document with:

```markdown
# Deployment Handoff

## Required Services
- Supabase account (free tier works)
- Hosting platform (Vercel/Netlify/GitLab Pages)

## Environment Variables
- VITE_SUPABASE_URL=https://your-project.supabase.co
- VITE_SUPABASE_ANON_KEY=your-anon-key-here

## Pre-Deployment Steps
1. Create Supabase project
2. Run supabase-setup.sql in SQL Editor
3. Create storage buckets (ra-presentation, correspondence, supporting-evidence)
4. Run storage-policies.sql
5. Set environment variables in hosting platform
6. Deploy

## Support Contacts
- Technical Lead: [name]
- Email: [email]
```

### 2. Verify Documentation

Ensure these docs are in the ZIP:
- `README.md` - Getting started
- `DEPLOYMENT.md` - Deployment instructions
- `SETUP_GUIDE.md` - Detailed setup (if exists)

### 3. Security Check

- [ ] No `.env` file with real credentials
- [ ] No hardcoded API keys in source code
- [ ] No sensitive data in demo files
- [ ] `.env.example` has placeholder values only

---

## 🚀 Handoff to Deployment Team

Send them:

1. **ZIP file**: `risk-acceptance-app.zip`
2. **Deployment guide**: Point to `DEPLOYMENT.md` inside ZIP
3. **Supabase credentials**: 
   - Project URL
   - Anon key (public, safe to share)
   - Service role key (if needed, share securely)
4. **SQL scripts**:
   - `supabase-setup.sql` (database schema)
   - `storage-policies.sql` (storage security)

---

## 🔄 Re-Export After Changes

If you need to update the export:

1. **Make code changes**
2. **Test locally**: `pnpm run build`
3. **Update version** in `package.json`:
   ```json
   "version": "1.1.0"
   ```
4. **Commit changes**: `git commit -am "Update: [description]"`
5. **Re-create ZIP**: Use commands above
6. **Rename ZIP**: `risk-acceptance-app-v1.1.0.zip`
7. **Document changes** in release notes

---

## 📝 Export Metadata

When sending the ZIP, include:

```
Project: Risk Acceptance Review System
Version: 1.0.0
Export Date: 2026-05-07
Node Version Required: 18.x or higher
Package Manager: pnpm 8.x
Build Command: pnpm run build
Output Directory: dist/

Dependencies Installed: NO (node_modules excluded - run pnpm install)
Environment Configured: NO (create .env from .env.example)
Database Setup: REQUIRED (run supabase-setup.sql)
Storage Setup: REQUIRED (create buckets + run storage-policies.sql)
```

---

## ⚠️ Common Export Issues

### Issue: ZIP file too large (>50MB)

**Cause**: `node_modules/` or `dist/` included

**Fix**: 
```bash
# Remove from ZIP
zip -d risk-acceptance-app.zip "node_modules/*" "dist/*"

# Or re-create excluding these
zip -r risk-acceptance-app.zip . -x "node_modules/*" -x "dist/*"
```

### Issue: Missing package.json after extraction

**Cause**: Hidden files not included

**Fix**: 
```bash
# Use -a flag to include hidden files
zip -r -a risk-acceptance-app.zip .
```

### Issue: Build fails after extraction

**Cause**: Missing dependencies or lock file

**Fix**: Verify `pnpm-lock.yaml` is in ZIP:
```bash
unzip -l risk-acceptance-app.zip | grep pnpm-lock
```

---

## ✅ Final Pre-Export Checklist

Before creating the final ZIP:

- [ ] All code changes committed
- [ ] `pnpm run build` works locally
- [ ] `.env.example` has correct template
- [ ] No `.env` file with real secrets
- [ ] `package.json` has correct version
- [ ] `README.md` is up to date
- [ ] `DEPLOYMENT.md` has correct instructions
- [ ] SQL files are present and tested
- [ ] `.gitignore` excludes sensitive files
- [ ] Demo files work correctly
- [ ] All tests pass (if applicable)

---

**Ready to export?** Follow the "Creating the Export ZIP" section above.

**Need help?** Review `DEPLOYMENT.md` for detailed deployment instructions.
