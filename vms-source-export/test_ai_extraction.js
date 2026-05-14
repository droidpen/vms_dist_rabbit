import fs from 'fs';
import path from 'path';

async function testPdfExtraction() {
  console.log("🧪 TESTING: AI-Powered PDF Extraction (Gemini 1.5 Flash)");
  console.log("------------------------------------------------------");

  // 1. Load Credentials
  const envFile = fs.readFileSync('VMS/.env', 'utf8');
  const apiKey = envFile.match(/VITE_GEMINI_API_KEY=(.+)/)?.[1].trim();

  if (!apiKey) {
    console.error("❌ Error: Gemini API Key not found");
    return;
  }

  // 2. Select a PPTX
  const pptxPath = 'VMS/docs/Stop-Drowning-in-Vulnerability-Reports.pptx';
  if (!fs.existsSync(pptxPath)) {
    console.error(`❌ Error: PPTX not found at ${pptxPath}`);
    return;
  }
  
  const fileBuffer = fs.readFileSync(pptxPath);
  const base64Data = fileBuffer.toString('base64');
  console.log(`📄 File: ${path.basename(pptxPath)} (${fileBuffer.length} bytes)`);

  // 3. Call Gemini 2.5 Flash for extraction
  console.log("🧠 AI is reading the document...");
  
  const model = "gemini-2.5-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [
        { text: "Extract all text from this document. Output as clean text only. No conversational filler." },
        {
          inline_data: {
            mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            data: base64Data
          }
        }
      ]
    }]
  };

  try {
    const startTime = Date.now();
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (response.ok) {
      const extractedText = data.candidates[0].content.parts[0].text;
      console.log("✅ SUCCESS! AI extracted the text.");
      console.log(`⏱️  Latency: ${duration}ms`);
      console.log(`📏 Length: ${extractedText.length} characters`);
      console.log("\n--- PREVIEW ---");
      console.log(extractedText.substring(0, 500) + "...");
      console.log("---------------");
    } else {
      console.error("❌ Gemini API Error:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testPdfExtraction();
