# System Prompt / Context Preface for VMS Pitch Deck Generation

**Instructions for the AI:** 
I am building a presentation for a tech/security booth to showcase my new project: the **Contextual Risk Review System (VMS)**. I need you to generate compelling slide content based on the pitch deck outline provided below. 

Before generating the slides, you MUST read and internalize the following Domain Knowledge and Technical Architecture constraints. This context is critical to ensuring the tone is accurate for a cybersecurity audience and that the technical claims are precise.

---

## 1. Domain Knowledge & The "Why"
*   **The Problem:** SecOps teams currently spend hours manually reviewing vulnerability scanner reports (CSVs) and vendor correspondence (PDFs) to figure out if a vulnerability is actually exploitable in their specific environment. They use slow, manual ServiceNow workflows to document "Risk Acceptances" (allowing a vulnerability to remain unpatched temporarily).
*   **The Solution (VMS):** An AI-driven assistant that automates this workflow. It aims to reduce assessment time by 50%.
*   **The Analytical Framework:** The AI does not just guess; it strictly follows a human framework. It calculates risk using a 5x5 matrix. 
    *   `Impact` is the maximum of Confidentiality, Integrity, and Availability.
    *   `Likelihood` is the average of Discoverability, Exploitability, and Reproducibility.
    *   The system calculates the "Current Risk" (baseline) and then factors in mitigating controls (like firewalls) to calculate the "Residual Risk."

## 2. Technical Architecture & The "How" (Confidential RAG)
This is not a standard, leaky API wrapper. This system is built for highly sensitive government/enterprise environments using a unique **"Confidential RAG"** architecture:
*   **Zero-Trust Storage:** The core analytical engine and user data reside within an encrypted vault (using `gocryptfs`).
*   **Distributed Edge RAG:** To prevent the local app from freezing during heavy PDF parsing, ingestion is offloaded to asynchronous **Supabase Edge Functions**.
*   **Vector Database:** We use **PostgreSQL + pgvector** (via Supabase) to store document embeddings.
*   **Intelligence:** The system uses **Google Gemini 1.5 Pro** for synthesis and `text-embedding-004` for vectors. The LLM is strictly instructed (via RAG prompting) to base its answers *only* on the retrieved context from the user's uploaded files.
*   **Dual Portals:** The system features two React UIs: The main "Analyst View" (VMS) and an executive "DevSecOps Portal" dashboard.

---

## 3. The Pitch Deck Outline to Expand Upon
*(Please use the following structure to generate the final slide content, speaker notes, and visual suggestions)*

**Slide 1: Stop Drowning in Vulnerability Reports**
- Contextual Risk Review System: AI-Driven Risk Acceptance in Seconds, not Days.

**Slide 2: The Manual Patching Bottleneck**
- Laborious: Gathering system architecture and exposure takes hours.
- Slow: Manual ServiceNow workflows delay critical patching.
- Risky: Slower assessments lead to longer exposure windows.

**Slide 3: Meet the Contextual Risk Review System (VMS)**
- AI-Powered Threat Modeling: Automatically applies MITRE ATT&CK.
- Instant Context: Cross-references CVEs against your specific architecture.
- Actionable Decisions: Auto-generates the 5x5 Risk Matrix.

**Slide 4: How It Works**
1. Ingest: Drop in Scanner CSVs & Vendor PDFs.
2. Synthesize: AI maps vulnerabilities to compensating controls.
3. Endorse: SecOps reviews the AI-substantiated decision.

**Slide 5: See It In Action (Live Demo)**
- Main VMS Risk System (Analyst View)
- DevSecOps Portal (Executive View)

**Slide 6: Built on Sovereign AI & Confidential RAG**
- Zero-Trust: Core engine runs in an Encrypted Vault.
- Distributed Edge RAG: Parsing offloaded to Supabase Edge Functions.
- Explainable AI: Grounded in your documents via pgvector search.

**Slide 7: 50% Reduction in Assessment Time**
- Faster Patching, Happier Teams, Tighter Security.
- Call to Action: Scan for architecture whitepaper or chat about a pilot.