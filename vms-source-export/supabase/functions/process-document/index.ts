import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
import * as fflate from 'https://esm.sh/fflate@0.8.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? ''

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("Received Storage Webhook Payload:", JSON.stringify(payload, null, 2))

    // Supabase Storage Webhook payload structure:
    // payload.type is 'INSERT' (or 'UPDATE'/'DELETE')
    // payload.record contains metadata about the file in storage.objects
    
    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ message: "Skipping non-INSERT event" }), { status: 200 })
    }

    const { bucket_id, name: filePath } = payload.record
    const fileName = filePath.split('/').pop()

    console.log(`Processing file: ${fileName} in bucket: ${bucket_id}`)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Fetch file content from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucket_id)
      .download(filePath)

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`)
    }

    let text = ''
    const mimeType = payload.record.metadata?.mimetype || ''
    
    // NATIVE TEXT EXTRACTION
    if (mimeType === 'text/plain' || mimeType === 'text/markdown' || mimeType === 'image/svg+xml' || fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.svg')) {
      console.log('📄 Using native text extraction')
      text = await fileData.text()
    } 
    // MULTIMODAL AI EXTRACTION (PDF/IMAGE)
    else if (mimeType === 'application/pdf' || (mimeType.startsWith('image/') && !mimeType.includes('svg')) || fileName.endsWith('.pdf')) {
      console.log(`🧠 Using AI extraction for ${mimeType}`)
      
      const arrayBuffer = await fileData.arrayBuffer()
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      const extractionUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
      const extractionResponse = await fetch(extractionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Extract all technical text, data, and structure from this document. Output as clean Markdown text only. Do not add any preamble or commentary." },
              {
                inline_data: {
                  mime_type: mimeType || 'application/pdf',
                  data: base64Data
                }
              }
            ]
          }]
        })
      })

      if (!extractionResponse.ok) {
        const err = await extractionResponse.json()
        throw new Error(`AI Extraction Failed: ${JSON.stringify(err)}`)
      }

      const extractionData = await extractionResponse.json()
      text = extractionData.candidates[0].content.parts[0].text
    } 
    // CUSTOM PPTX EXTRACTION (XML PARSING + AI REFINEMENT)
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileName.endsWith('.pptx')) {
      console.log(`📽️ Using custom PPTX extraction for ${fileName}`)
      
      const arrayBuffer = await fileData.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Unzip PPTX in memory
      const unzipped = fflate.unzipSync(uint8Array)
      let rawXmlText = ""
      
      // Extract text from slide XMLs
      const slideKeys = Object.keys(unzipped)
        .filter(k => k.startsWith('ppt/slides/slide') && k.endsWith('.xml'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || '0')
            const numB = parseInt(b.match(/\d+/)?.[0] || '0')
            return numA - numB
        })
      
      for (const key of slideKeys) {
        const xmlBytes = unzipped[key]
        const xmlStr = new TextDecoder().decode(xmlBytes)
        const textMatches = xmlStr.match(/<a:t>(.*?)<\/a:t>/g)
        if (textMatches) {
          const slideText = textMatches.map(t => t.replace(/<\/?a:t>/g, '')).join(' ')
          rawXmlText += `\n[Slide ${key.match(/\d+/)?.[0]}]: ${slideText}\n`
        }
      }

      console.log(`📦 Raw XML Text length: ${rawXmlText.length}. Running AI Refinement...`)

      // Refine raw XML text using Gemini
      const refinementUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
      const refinementResponse = await fetch(refinementUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "You are an expert data structured parser. Below is raw text extracted from the XML of a PowerPoint presentation. It may be missing spaces or formatting. Reconstruct this into clean, highly readable Markdown. Preserve all technical details, lists, and semantic meaning perfectly. Do not add conversational filler." },
              { text: rawXmlText }
            ]
          }]
        })
      })

      if (!refinementResponse.ok) {
        const err = await refinementResponse.json()
        throw new Error(`AI PPTX Refinement Failed: ${JSON.stringify(err)}`)
      }

      const refinementData = await refinementResponse.json()
      text = refinementData.candidates[0].content.parts[0].text
    }
    // FALLBACK
    else {
      console.warn(`Unsupported file type: ${mimeType}. Attempting native text fallback.`)
      text = await fileData.text()
    }

    console.log(`Final processed text length: ${text.length} characters`)

    // 2. Lookup the record in uploaded_files to get IDs
    const { data: fileRecord, error: fileError } = await supabase
      .from('uploaded_files')
      .select('id, project_name')
      .eq('file_path', filePath)
      .single()

    if (fileError || !fileRecord) {
      console.warn(`Could not find database record for file path: ${filePath}. Proceeding with best-effort metadata.`)
    }

    // Lookup project ID based on project_name
    let projectId = null
    if (fileRecord?.project_name) {
      const { data: projectRecord } = await supabase
        .from('projects')
        .select('id')
        .eq('project_name', fileRecord.project_name)
        .single()
      projectId = projectRecord?.id
    }

    // 3. Chunking logic (Simple overlapping chunks)
    const chunkSize = 1000
    const chunkOverlap = 200
    const chunks: string[] = []
    
    for (let i = 0; i < text.length; i += (chunkSize - chunkOverlap)) {
      chunks.push(text.slice(i, i + chunkSize))
      if (i + chunkSize >= text.length) break
    }

    console.log(`Split into ${chunks.length} chunks. Generating embeddings...`)

    // 4. Generate embeddings and store in DB
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      
      // Call Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${GEMINI_API_KEY}`
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "models/gemini-embedding-2",
          content: { parts: [{ text: chunk }] },
          outputDimensionality: 768
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Gemini API Error for chunk ${i}:`, JSON.stringify(errorData))
        continue
      }

      const resData = await response.json()
      const embedding = resData.embedding.values

      // Store in document_chunks
      const { error: insertError } = await supabase
        .from('document_chunks')
        .insert({
          project_id: projectId,
          file_id: fileRecord?.id,
          content: chunk,
          metadata: {
            chunk_index: i,
            total_chunks: chunks.length,
            file_name: fileName,
            bucket_id: bucket_id
          },
          embedding: embedding
        })

      if (insertError) {
        console.error(`Error inserting chunk ${i} to DB:`, insertError.message)
      }
    }

    console.log(`Successfully processed and vectorized file: ${fileName}`)
    return new Response(JSON.stringify({ success: true, chunks: chunks.length }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Critical Error in Edge Function:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
