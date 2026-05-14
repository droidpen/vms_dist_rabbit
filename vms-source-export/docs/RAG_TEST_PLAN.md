# RAG Implementation Test Plan

This document outlines the testing strategy for the three phases of the Retrieval-Augmented Generation (RAG) implementation in the VMS project. Because the system is decoupled, we will use a "shift-left" testing approach, verifying each component independently before testing the end-to-end flow.

## Tools Required
- **Supabase Dashboard:** For inspecting database tables, logs, and edge function executions.
- **cURL / Postman:** For manually triggering webhooks and testing external APIs.
- **Vitest:** For unit testing local extraction and chunking logic.
- **Playwright:** For end-to-end UI testing (Phase 3).

---

## Phase 1: Foundation & Vector Database
**Objective:** Verify that `pgvector` is active, the schema is correct, and the Gemini API is reachable from the environment.

### 1.1 Database Schema Verification
- **Method:** Supabase SQL Editor / Dashboard.
- **Action:** Run a test insert into `document_chunks`.
- **Expected Result:** The insert succeeds, and the `embedding` column accepts a 768-dimensional array.
- **Test Query:**
  ```sql
  INSERT INTO document_chunks (content, embedding) 
  VALUES ('Test content', array_fill(0, ARRAY[768])::vector);
  ```

### 1.2 Gemini API Connectivity
- **Method:** Node.js script (using `fetch`).
- **Action:** Send a simple text string to the Gemini `gemini-embedding-2` API using the configured `.env` key, specifying `outputDimensionality: 768`.
- **Expected Result:** The API returns a 200 OK status and a JSON payload containing an array of 768 floats.
- **Status:** ✅ **COMPLETED (May 11, 2026)** - Verified `gemini-embedding-2` returning 768 dimensions and `gemini-3.1-pro-preview` for generation.

---

## Phase 2: Distributed Ingestion Pipeline (Edge Compute)
**Objective:** Verify that uploading a file triggers the webhook, the edge function executes without crashing, and vectors appear in the database.

### 2.1 Webhook Trigger Verification
- **Method:** Supabase Storage & Edge Function Logs.
- **Action:** Manually upload a small PDF or TXT to the `ra-presentation` bucket via the Supabase Dashboard.
- **Expected Result:** The Edge Function logs show an invocation triggered by the `INSERT` event on the storage bucket.

### 2.2 Extraction & Chunking Logic
- **Method:** Edge Function Logs.
- **Action:** Monitor logs during upload.
- **Expected Result:** Logs show "Extracted text length" and "Split into X chunks".

### 2.3 Vector Generation Verification
- **Method:** SQL Query.
- **Action:** Wait 30 seconds after upload, then run:
  ```sql
  SELECT count(*), file_id FROM document_chunks GROUP BY file_id;
  ```
- **Expected Result:** `count` should be > 0, indicating chunks and vectors were successfully stored.

### 2.4 Edge Function Deployment
- **Method:** Supabase CLI.
- **Command:**
  ```bash
  supabase functions deploy process-document
  supabase secrets set GEMINI_API_KEY=your_key_here
  ```
- **Status:** 🏗️ **IN PROGRESS** - Edge Function logic implemented in `supabase/functions/process-document/index.ts`. Awaiting deployment and webhook wiring.

---

## Phase 3: Generation (Local RAG Execution)
**Objective:** Verify that the local VMS Vault can successfully query the vector database and generate an accurate response using the LLM.

### 3.1 Vector Similarity Search
- **Method:** VMS App (Backend logic test / API route test).
- **Action:** Programmatically execute the `match_document_chunks` Postgres function with a test query embedding.
- **Expected Result:** The function returns the most semantically relevant text chunks from the database, ordered by similarity score.

### 3.2 LLM Synthesis & Prompt Injection
- **Method:** Vitest / Console Logging.
- **Action:** Verify the prompt constructed by the Generation Engine. Ensure the retrieved chunks are properly formatted within the context boundaries of the prompt sent to Gemini.
- **Expected Result:** The prompt strictly instructs the LLM to use only the provided context.

### 3.3 End-to-End User Flow
- **Method:** Playwright / Manual UI Testing.
- **Action:** 
  1. Upload a sample Risk Acceptance PDF containing a specific, known vulnerability.
  2. Click "Start Evaluation".
- **Expected Result:** The UI updates with a risk assessment. The text of the assessment explicitly references data found *only* in the uploaded PDF, proving the RAG pipeline is functioning end-to-end.
