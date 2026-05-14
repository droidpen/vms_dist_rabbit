# Vibe Coding Architecture: Hybrid Memory & State Management

This document defines the specialized "Vibe Coding" architecture for the `gemini-brain-vault`. It is designed to maximize development velocity and LLM signal-to-noise ratio while minimizing token overhead and maintaining 100% technical fidelity.

## 🧠 Memory Tiering Strategy

### 1. Hot Buffer (Raw Context)
- **Scope:** The last 10 conversational turns + current active files.
- **Purpose:** Maintains immediate nuance, active code-snippets, and the user's current "vibe" and direction.
- **Action:** Retained in `reconciled_chat_history.jsonl` until a Phase Checkpoint is reached.

### 2. Warm State (Summarized Intent)
- **Scope:** High-level project progress, active goals, and recent architectural pivots.
- **Purpose:** Provides a "TL;DR" of the project's current trajectory for the LLM without raw logs.
- **Location:** `VMS/IMPLEMENTATION_SUMMARY.md` and `VMS/WORK_COMPLETED_REPORT.txt`.

### 3. Golden Source (Technical Anchor)
- **Scope:** Architecture rules, project constraints, coding standards, and persona mandates.
- **Purpose:** The absolute source of truth. Prevents "summary drift" by anchoring the LLM to technical specifications rather than conversational interpretations.
- **Location:** `./GEMINI.md` and `./VMS/docs/ARCHITECTURE.md`.

### 4. Cold Archive (Searchable History)
- **Scope:** All historical raw chat logs and tool outputs beyond the Hot Buffer.
- **Purpose:** The "Safety Net." Not sent to the LLM by default, but indexed and searchable via `grep_search` if detailed history (e.g., old stack traces, specific phrasing) is required.
- **Location:** `cipher/archives/chat_history_v{version}.jsonl.gz`.

## 🛠 Operational Protocols

### Protocol A: Surgical Verification
Before executing a complex implementation based on summarized memory, the agent MUST:
1. Consult **Golden Source** for architectural constraints.
2. If ambiguity exists, use `grep_search` on **Cold Archives** to verify the original user requirement.

### Protocol B: Phase Checkpointing
At the end of every significant feature or bug fix:
1. Update **Warm State** (Summary) with the outcome.
2. Prune **Hot Buffer** by moving processed turns into **Cold Archive**.
3. Re-anchor to **Golden Source** to ensure no drift occurred.

### Protocol C: Vibe Alignment
The agent acts as a senior partner. If the "vibe" (direction or tone) shifts significantly, the agent should update the **Persona Mandate** in `GEMINI.md` to reflect the new collaborative rhythm.
