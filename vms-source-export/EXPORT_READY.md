# VMS Project Baseline

This project has reached a verified operational baseline.

## Validated Core Features
1. **Multimodal RAG Engine:** The Supabase Edge Function correctly processes text, PDFs, and images via Gemini 2.5 Flash and vectorizes them into `pgvector`.
2. **DevSecOps Command Center:** A dual-portal layout separates user risk assessment from administrative infrastructure provisioning and metric tracking.
3. **Deployment Pipelines:** The system is fully engineered for multi-environment distribution:
   *   **Cloud (Vercel):** Seamless dual-domain deployment linking `vms-main-portal` and `vms-devsecops-portal` via environment variables.
   *   **On-Premise (Rabbit):** Automated distribution packages generation, including pre-compiled SPAs (Scenario A) and full monorepo source code with build instructions for internal IPs (Scenario B).
4. **Multi-Project Vault:** Users can create, switch between, and completely delete isolated project workspaces.
5. **Intelligent Auto-Priming:** Core demo architectures (3-Tier, AI/ML, Serverless) automatically inject and vectorize pre-defined document sets when selected on a clean slate.
6. **Integrated File Management:** Uploaded artifacts can be deleted individually directly from the drop-zones, perfectly syncing with Supabase storage and DB cascade rules.
7. **UI Stability:** All components are hardened against missing metadata arrays, and UI changes are enforced via Playwright DOM-mounting checks to prevent React crashes.
8. **Attack Path Visualization:** Implemented a dynamic, interactive graph (via `@xyflow/react`) that maps CVEs to specific architecture nodes (e.g., 3-Tier, Microservices, AI/ML, Serverless), visually highlighting vulnerable critical paths and lateral movement potential based on AI threat modeling.

The system is now fully prepared for Phase 3: **Interactive Graph Tooltips** and Phase 4: **Automated Remediation / API Integrations**.