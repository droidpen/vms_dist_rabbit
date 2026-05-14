# VMS Source Code Deployment (Rabbit)

This repository contains the source code for the Vulnerability Management Interface (VMS) and the DevSecOps Mission Control Dashboard.

## Prerequisites
- Node.js v18+
- npm or pnpm

## Building for Internal Networks (Scenario B)
If you need to deploy these applications to internal IP addresses or custom domains, you must compile the code yourself to inject the correct environment variables.

### 1. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=https://[YOUR_SUPABASE_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
VITE_GEMINI_API_KEY=[YOUR_GEMINI_KEY]
VITE_DEVSECOPS_URL=http://[YOUR_INTERNAL_IP]:[PORT]
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Main VMS Portal
```bash
npm run build
```
The compiled static assets will be located in the `dist/` folder. Serve this folder using your preferred web server (Nginx, Apache, etc.).

### 4. Build the DevSecOps Dashboard
```bash
npm run build:devsecops
```
The compiled static assets will be located in the `apps/devsecops-portal/dist/` folder. Serve this folder on a separate port or route.