import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Explicitly use 'v1' instead of 'v1beta'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_TO_TEST = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

async function testV1() {
  console.log("🚀 TESTING API v1...");
  for (const modelName of MODELS_TO_TEST) {
    try {
      console.log(`\n🔍 testing model: ${modelName} on v1...`);
      // Note: In some versions of the SDK, v1 can be forced like this:
      const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });
      const result = await model.generateContent("Hi");
      console.log(`✅ SUCCESS on v1!`);
      console.log(`💡 USE THIS NAME: ${modelName}`);
    } catch (err) {
      console.log(`❌ FAILED on v1: ${modelName}`);
      console.log(`   Reason: ${err.message}`);
    }
  }
}

testV1();
