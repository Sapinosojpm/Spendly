import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_TO_TEST = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-2.0-flash-exp"
];

async function testModels() {
  console.log("🚀 STARTING AI DIAGNOSTICS...");
  for (const modelName of MODELS_TO_TEST) {
    try {
      console.log(`\n🔍 testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi, are you online?");
      const text = result.response.text();
      console.log(`✅ SUCCESS! Response: "${text.substring(0, 30)}..."`);
      console.log(`💡 USE THIS NAME: ${modelName}`);
    } catch (err) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`   Reason: ${err.message}`);
      if (err.status) console.log(`   Status: ${err.status}`);
    }
  }
}

testModels();
