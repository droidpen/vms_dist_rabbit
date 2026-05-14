# VMS Project Roadmap & TODOs

This document tracks the long-term objectives for the Vulnerability Management Interface (VMS).

## 🚀 Active Phase: Phase 2+ (Advanced Ingestion)

### 1. Robust Document Support (CURRENT FOCUS)
- [x] Implement PDF text extraction in Supabase Edge Functions (via Gemini 2.5 Flash).
- [x] Implement Image-based artifacts OCR (via Gemini 2.5 Flash).
- [x] Implement PPTX text extraction in Supabase Edge Functions (via custom XML parser + Gemini 2.5 Flash).
- [ ] Optimize chunking for formatted documents (preserving tables/lists).

**Technical Note:**
We have implemented an "AI-First" extraction strategy using `gemini-2.5-flash`. Instead of complex local parsing libraries, the Edge Function now sends raw PDF/Image bytes to Gemini, which returns high-fidelity Markdown text. This ensures we capture structured data, tables, and handwritten notes that traditional parsers often miss.

## 📅 Future Phases

### 2. Attack Path Visualization
- [x] Build interactive graph UI to show "Threat Paths".
- [x] Map CVE vulnerabilities to specific system components visually.
- [x] Highlight "Critical Paths" where mitigations are missing.

### 3. Multi-Project Management
- [x] Implement "Project Vault" Selector UI for switching between active projects.
- [x] Support distinct RAG namespaces per project ID.
- [x] Automatic workspace reconstruction (re-fetching files/meta from Supabase on switch).
- [ ] Dashboard-level aggregation of risks across multiple project deployments.

### 4. Automated Remediation
- [ ] Implement the "Ticket Triggering" logic (Shelved).
- [ ] Integrate with Jira/ServiceNow APIs for automated ticket creation.
- [ ] Track ticket status within the Ops pillar.

---
*Updated: May 11, 2026*
