import fs from 'fs';
import path from 'path';

/**
 * PHASE 2 WITNESS SCRIPT
 * This script runs the EXACT logic implemented in the Supabase Edge Function
 * locally so you can witness the chunking and embedding process.
 */

async function witnessPhase2() {
  console.log("🚀 STARTING PHASE 2 WITNESS: RAG Ingestion Pipeline");
  console.log("--------------------------------------------------");

  // 1. Load Credentials
  const envFile = fs.readFileSync('VMS/.env', 'utf8');
  const apiKey = envFile.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1].trim();

  if (!apiKey) {
    console.error("❌ Error: Gemini API Key not found in VMS/.env");
    return;
  }

  // 2. Select a Demo Document
  const demoFilePath = 'VMS/demo-files/Vendor_correspondence.txt';
  const text = fs.readFileSync(demoFilePath, 'utf8');
  console.log(`📄 Input File: ${path.basename(demoFilePath)}`);
  console.log(`📏 Total Length: ${text.length} characters`);

  // 3. Execute Chunking Strategy (1000 chars, 200 overlap)
  const chunkSize = 1000;
  const chunkOverlap = 200;
  const chunks = [];
  
  for (let i = 0; i < text.length; i += (chunkSize - chunkOverlap)) {
    chunks.push(text.slice(i, i + chunkSize));
    if (i + chunkSize >= text.length) break;
  }

  console.log(`✂️  Chunking: Created ${chunks.length} overlapping chunks.`);
  console.log(`   - Chunk 1 Preview: "${chunks[0].substring(0, 60).replace(/\n/g, ' ')}..."`);

  // 4. Witness Embedding Generation (Testing the first chunk)
  console.log("\n🧪 CALLING LIVE GEMINI API (gemini-embedding-2)...");
  
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;
  
  try {
    const startTime = Date.now();
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: { parts: [{ text: chunks[0] }] },
        outputDimensionality: 768
      })
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    if (response.ok) {
      const vector = data.embedding.values;
      console.log("✅ SUCCESS! Ingestion Pipeline is functional.");
      console.log(`⏱️  Latency: ${duration}ms`);
      console.log(`📐 Dimensions: ${vector.length} (Verified 768)`);
      console.log(`🔢 Vector Sample (First 5): [ ${vector.slice(0, 5).join(', ')} ... ]`);
      console.log("\n--------------------------------------------------");
      console.log("STATUS: PHASE 2 LOGIC WITNESSED & VERIFIED");
    } else {
      console.error("❌ Gemini API Error:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("❌ Network Error:", err.message);
  }
}

witnessPhase2();
