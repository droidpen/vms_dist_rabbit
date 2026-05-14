# VMS Booth Pitch Deck Outline
*Target Audience: Walk-by traffic at a tech/security booth.*
*Goal: Catch attention in 5 seconds, explain the value in 30 seconds, transition to the live demo.*

---

## Slide 1: The Hook (Title Slide)
**Visual:** The VMS Cover Image (Blue Shield with AI/Camera icon). Big, bold text.
**Headline:** Stop Drowning in Vulnerability Reports.
**Sub-headline:** Contextual Risk Review System: AI-Driven Risk Acceptance in Seconds, not Days.
**Talking Point:** "Hi! Are your SecOps teams spending hours manually reviewing CVEs in ServiceNow?"

---

## Slide 2: The Problem (The Pain)
**Visual:** A messy, overwhelming graphic of endless CSV rows, PDF vendor reports, and a frustrated security analyst. Or a red "Bottleneck" graphic.
**Headline:** The Manual Patching Bottleneck
**Bullets:**
- **Laborious:** Gathering system architecture, exposure, and exploits takes hours.
- **Slow:** Manual ServiceNow workflows delay critical patching.
- **Risky:** Slower assessments = longer exposure windows for zero-days.

---

## Slide 3: The Solution (The Magic)
**Visual:** Clean, modern UI screenshot of the VMS Dashboard.
**Headline:** Meet the Contextual Risk Review System (VMS)
**Bullets:**
- 🧠 **AI-Powered Threat Modeling:** Automatically applies MITRE ATT&CK frameworks.
- ⚡ **Instant Context:** Cross-references CVEs against *your* specific architecture and mitigations.
- 🎯 **Actionable Decisions:** Auto-generates the 5x5 Risk Matrix (Current vs. Residual Risk).

---

## Slide 4: How It Works (The Flow)
**Visual:** A simple 3-step left-to-right arrow diagram.
1. **Ingest:** Drop in Scanner CSVs & Vendor PDFs.
2. **Synthesize:** AI maps vulnerabilities to compensating controls (Firewalls, IPS).
3. **Endorse:** SecOps reviews the AI-substantiated decision and logs it.
**Talking Point:** "You literally just drop the files in, and the AI does the heavy analytical lifting based on your exact security matrix."

---

## Slide 5: The Live Demo (Interactive Slide)
**Visual:** Dual-screen mockup (or live monitors if you have two screens at the booth).
**Headline:** See It In Action
**Left Side:** Main VMS Risk System (The Analyst View)
**Right Side:** DevSecOps Portal (The Big Picture)
**Talking Point:** "Let me show you. Here is a raw vulnerability report. Let's run the evaluation..." *(Transition to live clicking)*

---

## Slide 6: Under the Hood (For the Techies/Architects)
**Visual:** The "Distributed Edge RAG" Mermaid diagram we generated earlier (High contrast, professional).
**Headline:** Built on "Sovereign AI" & Confidential RAG
**Bullets:**
- **Zero-Trust:** Core engine runs in an Encrypted Vault (`gocryptfs`).
- **Distributed Edge RAG:** Heavy parsing offloaded to Supabase Edge Functions.
- **Explainable AI (XAI):** Uses Gemini 1.5 Pro, but strictly grounded in *your* uploaded documents via `pgvector` similarity search.

---

## Slide 7: The Impact (Call to Action)
**Visual:** Big bold numbers. 
**Headline:** 50% Reduction in Assessment Time.
**Bullets:**
- Faster Patching.
- Happier SecOps Teams.
- Tighter Security Posture.
**Call to Action:** "Scan this QR code to read our architecture whitepaper, or let's chat about a pilot for your team."