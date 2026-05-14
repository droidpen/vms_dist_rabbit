import fs from 'fs';

const envFile = fs.readFileSync('VMS/.env', 'utf8');
const match = envFile.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
        console.log("All available models:");
        data.models.forEach(m => console.log(m.name));
    } else {
        console.log(`Error:`, data);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
