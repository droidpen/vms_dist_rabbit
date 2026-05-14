/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * This file is updated by sync_architecture.js from docs/ARCHITECTURE.md
 */

export const RAG_ARCHITECTURE_MERMAID = `
graph TB
    subgraph PUBLIC ["Public Internet"]
        User[End User / Analyst]
        
        subgraph VERCEL ["Vercel Global CDN (Serverless)"]
            VMS_App[VMS Risk System<br>vms-main-portal.vercel.app]
            DevSecOps_App[DevSecOps Dashboard<br>vms-devsecops-portal.vercel.app]
            
            subgraph VAULT ["Vercel Edge Functions: RAG Orchestrator"]
                Retrieval[Retrieval Engine<br>Similarity Search]
                Generation[Generation Engine<br>Prompt Building]
            end
        end
    end

    subgraph INTEL ["External Intelligence"]
        Gemini[Google Gemini 3.1 Pro<br>LLM Synthesis]
        EmbedModel[Gemini embedding-2<br>Embedding Generator]
    end

    subgraph CLOUD ["Trusted Persistence Cloud: Supabase"]
        Storage[(Blob Storage<br>Raw Files)]
        VectorDB[("PostgreSQL + pgvector<br>(Vector Database)")]
        
        subgraph EDGE ["Edge Compute: Asynchronous"]
            EdgeFunction[Supabase Edge Function<br>Heavy Ingestion]
        end
    end

    %% Upload Flow
    User -- 1. Uploads Docs --> VMS_App
    VMS_App -- 2. Saves File --> Storage
    Storage -- 3. Triggers Webhook --> EdgeFunction
    EdgeFunction -- 4. Send Chunks --> EmbedModel
    EmbedModel -- 5. Return Vectors --> EdgeFunction
    EdgeFunction -- 6. Store Embeddings --> VectorDB
    
    %% Query Flow
    User -- A. Request Eval --> VMS_App
    VMS_App -- B. Query --> Retrieval
    Retrieval -- C. Request Embedding --> EmbedModel
    EmbedModel -- D. Return Vector --> Retrieval
    Retrieval -- E. Vector Search --> VectorDB
    VectorDB -- F. Relevant Chunks --> Generation
    Generation -- G. Prompt + Context --> Gemini
    Gemini -- H. Final Assessment --> VMS_App
    
    %% DevSecOps Flow
    User -- Views Metrics --> DevSecOps_App
    DevSecOps_App -- Queries Status --> VectorDB

    %% Styling
    classDef public fill:#dcfce7,stroke:#166534,stroke-width:2px,color:#166534;
    classDef vault fill:#f0f9ff,stroke:#075985,stroke-width:2px,color:#075985;
    classDef intel fill:#f5f3ff,stroke:#5b21b6,stroke-width:2px,color:#5b21b6;
    classDef cloud fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#334155;
    classDef edge fill:#fffbeb,stroke:#92400e,stroke-width:2px,color:#92400e;

    class User,VMS_App,DevSecOps_App public;
    class Retrieval,Generation vault;
    class Gemini,EmbedModel intel;
    class Storage,VectorDB cloud;
    class EdgeFunction edge;

    style PUBLIC fill:none,stroke:#64748b,stroke-width:2px,stroke-dasharray: 5 5;
    style VERCEL fill:none,stroke:#000000,stroke-width:2px,stroke-dasharray: 5 5;
    style VAULT fill:none,stroke:#0891b2,stroke-width:2px,stroke-dasharray: 5 5;
    style INTEL fill:none,stroke:#8b5cf6,stroke-width:2px,stroke-dasharray: 5 5;
    style CLOUD fill:none,stroke:#475569,stroke-width:2px,stroke-dasharray: 5 5;
    style EDGE fill:none,stroke:#f59e0b,stroke-width:2px,stroke-dasharray: 5 5;
`;

export const RAG_FLOW_NARRATIVE = `
The RAG system operates in two distinct cycles: **The Ingestion Cycle (Numeric 1-6)** and **The Analytical Cycle (Alphabetic A-H)**.

#### 🔄 The Ingestion Cycle: Building the "Brain"
This cycle happens asynchronously in the background whenever a user uploads an artifact.
1.  **Upload:** User submits artifacts (PDF/TXT/Email) via the React UI.
2.  **Persistence:** The file is securely stored in a private Supabase Storage bucket.
3.  **Webhook Trigger:** Supabase automatically detects the new file and sends a webhook notification to an Edge Function.
4.  **Edge Processing:** A dedicated Edge Function downloads the file, extracts raw text, and sends it to the embedding model.
5.  **Return Vector:** **Gemini embedding-2** returns the mathematical representation of the text.
6.  **Vector Storage:** The processed text "chunks" and their vectors are stored in the PostgreSQL **pgvector** database.

#### 🧠 The Analytical Cycle: Retrieval-Augmented Evaluation
This cycle happens in real-time when the user clicks "Start Evaluation with AI".
*   **A. Evaluation Request:** The user triggers the risk assessment process.
*   **B. Contextual Query:** The VMS Retrieval Engine formulates a specific query based on the active CVE.
*   **C. Request Embedding:** The text query is sent to the Gemini embedding model.
*   **D. Return Vector:** The model returns a vector that semantically represents the user's query.
*   **E. Vector Search:** The engine uses that vector to perform a "Cosine Similarity" search against the database.
*   **F. Context Injection:** The database returns the technical evidence (relevant chunks) found in the artifacts.
*   **G. LLM Synthesis:** The raw assessment + the newly retrieved evidence is sent to **Gemini 3.1 Pro**.
*   **H. Final Assessment:** The AI synthesizes a final, substantiated report which is rendered in the UI.

### 🛠️ Component Glossary: The RAG Infrastructure

| Component | Description | Technical Role |
| :--- | :--- | :--- |
| **VMS Risk System** | The primary React-based interface (Port 5173). | Frontend Orchestrator |
| **Retrieval Engine** | Local logic that formulates RAG queries and manages similarity search requests. | Search Coordinator |
| **Generation Engine** | Logic that constructs prompts and handles LLM response synthesis. | AI Synthesis Layer |
| **Google Gemini 3.1 Pro** | State-of-the-art LLM used for high-fidelity risk assessment and substantiation. | Cognitive Engine |
| **Gemini embedding-2** | Specialized AI model used to convert raw text into 768-dimensional vectors. | Semantic Encoder |
| **Supabase Storage** | Secure cloud object storage for raw risk artifacts (PDFs, Emails, Diagrams). | Artifact Repository |
| **pgvector Database** | High-performance PostgreSQL database specialized for similarity search. | Vector Store |
| **Edge Function** | Asynchronous Supabase function that executes document parsing and chunking. | Ingestion Pipeline |

The RAG implementation is structured into three phases (see \`docs/RAG_TEST_PLAN.md\` for detailed verification steps):
`;

export const RAG_STEP_MAP: Record<string, { title: string, content: string }> = {
  "1": {
    "title": "Upload:",
    "content": "User submits artifacts (PDF/TXT/Email) via the React UI."
  },
  "2": {
    "title": "Persistence:",
    "content": "The file is securely stored in a private Supabase Storage bucket."
  },
  "3": {
    "title": "Webhook Trigger:",
    "content": "Supabase automatically detects the new file and sends a webhook notification to an Edge Function."
  },
  "4": {
    "title": "Edge Processing:",
    "content": "A dedicated Edge Function downloads the file, extracts raw text, and sends it to the embedding model."
  },
  "5": {
    "title": "Return Vector:",
    "content": "**Gemini embedding-2** returns the mathematical representation of the text."
  },
  "6": {
    "title": "Vector Storage:",
    "content": "The processed text \"chunks\" and their vectors are stored in the PostgreSQL **pgvector** database."
  },
  "A": {
    "title": "Evaluation Request:",
    "content": "The user triggers the risk assessment process."
  },
  "B": {
    "title": "Contextual Query:",
    "content": "The VMS Retrieval Engine formulates a specific query based on the active CVE."
  },
  "C": {
    "title": "Request Embedding:",
    "content": "The text query is sent to the Gemini embedding model."
  },
  "D": {
    "title": "Return Vector:",
    "content": "The model returns a vector that semantically represents the user's query."
  },
  "E": {
    "title": "Vector Search:",
    "content": "The engine uses that vector to perform a \"Cosine Similarity\" search against the database."
  },
  "F": {
    "title": "Context Injection:",
    "content": "The database returns the technical evidence (relevant chunks) found in the artifacts."
  },
  "G": {
    "title": "LLM Synthesis:",
    "content": "The raw assessment + the newly retrieved evidence is sent to **Gemini 3.1 Pro**."
  },
  "VMS_App": {
    "title": "Frontend Orchestrator",
    "content": "The primary React-based interface (Port 5173)."
  },
  "Retrieval": {
    "title": "Search Coordinator",
    "content": "Local logic that formulates RAG queries and manages similarity search requests."
  },
  "Generation": {
    "title": "AI Synthesis Layer",
    "content": "Logic that constructs prompts and handles LLM response synthesis."
  },
  "Gemini": {
    "title": "Cognitive Engine",
    "content": "State-of-the-art LLM used for high-fidelity risk assessment and substantiation."
  },
  "EmbedModel": {
    "title": "Semantic Encoder",
    "content": "Specialized AI model used to convert raw text into 768-dimensional vectors."
  },
  "Storage": {
    "title": "Artifact Repository",
    "content": "Secure cloud object storage for raw risk artifacts (PDFs, Emails, Diagrams)."
  },
  "VectorDB": {
    "title": "Vector Store",
    "content": "High-performance PostgreSQL database specialized for similarity search."
  },
  "EdgeFunction": {
    "title": "Ingestion Pipeline",
    "content": "Asynchronous Supabase function that executes document parsing and chunking."
  }
};
