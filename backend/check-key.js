import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkApiKey() {
  console.log("🔍 Testing API Key directly with fetch...");
  console.log(`🔑 Key: ${API_KEY.substring(0, 10)}...`);
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ API Key is working!");
      console.log("--- AVAILABLE MODELS BY GOOGLE ---");
      if (data.models) {
        data.models.forEach(m => console.log(`- ${m.name}`));
      } else {
        console.log("No models found in response.");
      }
    } else {
      console.log(`❌ API Call Failed: ${response.status} ${response.statusText}`);
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log("❌ Network Error:", err.message);
  }
}

checkApiKey();
