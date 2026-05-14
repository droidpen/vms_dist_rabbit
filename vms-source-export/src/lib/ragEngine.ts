import { supabase } from './supabase';

export interface RAGContext {
  content: string;
  similarity: number;
  fileName: string;
}

/**
 * RAG Retrieval Engine
 * Orchestrates similarity search against the document_chunks table
 */

export async function getRAGContext(
  query: string,
  projectName: string,
  matchCount: number = 5,
  matchThreshold: number = 0.5
): Promise<RAGContext[]> {
  try {
    console.log(`🔍 RAG: Generating embedding for query: "${query}"`);

    // 1. Get embedding for the query using Gemini API
    // We use the same model and dimensionality as the ingestion pipeline
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: { parts: [{ text: query }] },
        outputDimensionality: 768
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini Embedding Error: ${JSON.stringify(errorData)}`);
    }

    const resData = await response.json();
    const queryEmbedding = resData.embedding.values;

    console.log(`📊 RAG: Query embedding generated (768 dims). Searching vector DB...`);

    // 2. Call the Postgres function match_document_chunks
    const { data, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      p_project_name: projectName
    });

    if (error) {
      throw new Error(`Supabase RPC Error: ${error.message}`);
    }

    console.log(`✅ RAG: Retrieved ${data?.length || 0} relevant chunks.`);

    return (data || []).map((row: any) => ({
      content: row.content,
      similarity: row.similarity,
      fileName: row.metadata?.file_name || 'Unknown Source'
    }));

  } catch (error) {
    console.error("❌ RAG Retrieval Failed:", error);
    return [];
  }
}

/**
 * Check how many files have been successfully vectorized for a specific RA ID
 */
export async function getVectorStatus(raId: string): Promise<{ readyCount: number; totalCount: number }> {
  try {
    // 1. Get all file IDs for this specific RA
    const { data: raFiles, error: fileError, count: totalCount } = await supabase
      .from('uploaded_files')
      .select('id', { count: 'exact' })
      .eq('ra_id', raId);

    if (fileError) throw fileError;
    if (!raFiles || raFiles.length === 0) return { readyCount: 0, totalCount: 0 };

    const raFileIds = raFiles.map(f => f.id);

    // 2. Count how many of those file IDs have chunks in the document_chunks table
    // We use a Set to get unique file IDs that have at least one chunk
    const { data: chunks, error: chunkError } = await supabase
      .from('document_chunks')
      .select('file_id')
      .in('file_id', raFileIds);
      
    if (chunkError) throw chunkError;

    const readyFileIds = new Set(chunks?.map(c => c.file_id) || []);

    return {
      readyCount: readyFileIds.size,
      totalCount: totalCount || 0
    };
  } catch (error) {
    console.error("Error checking vector status:", error);
    return { readyCount: 0, totalCount: 0 };
  }
}

/**
 * Synthesize Final Risk Assessment with RAG Context
 */
export async function synthesizeWithRAG(
  query: string,
  projectName: string,
  baseAssessment: any // The assessment from the rule-based engine
): Promise<string> {
  const contexts = await getRAGContext(query, projectName);
  
  if (contexts.length === 0) {
    return "No relevant context found in uploaded documents to refine this assessment.";
  }

  const contextText = contexts.map((c, i) => `[Source: ${c.fileName}]\n${c.content}`).join('\n\n---\n\n');

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`;

  const prompt = `
    You are an elite Cyber Risk Assessor.
    
    BASE ASSESSMENT:
    ${JSON.stringify(baseAssessment, null, 2)}
    
    USER QUERY:
    ${query}
    
    DOCUMENT CONTEXT (Extracted via Vector Search):
    ${contextText}
    
    TASK:
    Refine the base assessment using the provided document context. 
    Focus on specific technical details, vendor statements, or architecture specifics found in the documents.
    If the documents provide evidence of stronger or weaker controls, adjust the reasoning.
    Always cite the Source File.
    
    Output a professional, concise summary of your findings.
  `;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("LLM Synthesis Failed:", error);
    return "Failed to synthesize document context.";
  }
}
