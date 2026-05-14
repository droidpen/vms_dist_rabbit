# User Testing & Feedback Log

This document tracks direct feedback from user testing sessions, prioritizing UX, stability, and workflow logic. Issues logged here must be resolved before advancing to new roadmap features.

## Session: May 12, 2026
**Tester:** Peter Kuan

### Feedback Addressed & Resolved
- **Orphaned Storage:** Project deletion was leaving physical files in Supabase Storage. *(Resolved: Updated `handleDeleteProject` to perform a two-stage purge of storage + database)*
- **Data Contamination:** Demo files cross-contaminating custom project names. *(Resolved: Dynamic renaming on upload)*
- **Ghost Rendering:** Upload zones retaining old file lists when switching projects. *(Resolved: Added strict React `useEffect` prop sync)*
- **Blank Screen Crashes:** React `.map()` errors on undefined arrays when loading empty/new projects. *(Resolved: Enforced `length > 0` safety checks in `SystemArchitectureAnalysis` and `ThreatModelingAnalysis`)*
- **Auto-Primer Loop:** The "Clear" button appeared to delete the wrong files, because navigating away and back caused the Auto-Primer to instantly resurrect the demo files. *(Resolved: Added `auto_primed` state flag to DB metadata. Auto-primer now only fires once per project)*
- **DevSecOps Crash:** Unhandled exceptions in the VMS frontend caused the shared backend to hang/crash. *(Resolved: Hardened React components and switched to detached background processes for Vite)*

### Open Feedback / Pending Observation
- *(Add new feedback here during testing phases)*

## Testing Protocol Mandate
Based on feedback regarding "false positive" functionality reports, all future UI features must be validated against `VMS/docs/TESTING_MANDATE.md` using the Playwright headless browser check before being presented as "Resolved" to the user.