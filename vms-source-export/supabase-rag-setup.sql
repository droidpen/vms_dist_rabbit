-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create table for storing document chunks and their embeddings
-- We use 768 dimensions for Gemini text-embedding-004
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_id UUID REFERENCES uploaded_files(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(768), -- Optimized for Google Gemini
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create HNSW index for high-performance similarity search
-- (Free tier might have RAM limits for HNSW, but it's fine for small/medium datasets)
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. Create function for performing similarity search
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT,
  p_project_name TEXT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  JOIN uploaded_files uf ON dc.file_id = uf.id
  WHERE 1 - (dc.embedding <=> query_embedding) > match_threshold
    AND uf.project_name = p_project_name
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
