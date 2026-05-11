import ChatMessage from '../models/ChatMessage.js';
import Expense from '../models/Expense.js';
import * as finance from '../utils/financeUtils.js';
import { detectIntent, INTENTS } from '../utils/intentEngine.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// CHAT AI CONFIG
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `Ikaw ay si "Spendly Coach", ang supportive pero honest na financial bestie ng user. 
  Ang goal mo ay tulungan silang mag-budget at mag-ipon. 
  
  STYLE RULES:
  - Speak in "Taglish" or Modern Filipino slang (e.g. "lodi", "idol", "budol", "petsa de peligro").
  - MAIKLI LANG DAPAT SUMAGOT. Maximum 2-3 sentences lang unless kailangan ng detailed breakdown.
  - Be relatable and slightly witty. Straight to the point dapat lodi.
  - Huwag masyadong pormal. 
  - Pag malaki ang gastos, pagsabihan sila nang pabiro (e.g. "Hala ka lodi, nabudol ka yata sa kape!").`
});

// @desc    Log a chat message
// @route   POST /api/chat/log
export const logMessage = async (req, res) => {
  try {
    const { user, text, sender, context } = req.body;

    const message = new ChatMessage({
      user,
      text,
      sender,
      context,
    });

    const savedMessage = await message.save();
    console.log(`✅ Chat Log Saved: [${sender}] ${text.substring(0, 30)}...`);
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get chat history for a user
// @route   GET /api/chat/history/:userId
export const getChatHistory = async (req, res) => {
  try {
    const history = await ChatMessage.find({ user: req.params.userId }).sort({ createdAt: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Ask AI a question (with dynamic intent engine)
// @route   POST /api/chat/ask
export const askQuestion = async (req, res) => {
  try {
    const { user, text, context } = req.body;

    // 1. Fetch Context from DB
    const history = await ChatMessage.find({ user }).sort({ createdAt: -1 }).limit(5);
    const expenses = await Expense.find({ user });
    
    // 2. Prepare Financial Context for AI
    const ranked = finance.getRankedCategories(expenses);
    const topExpense = finance.getTopExpenses(expenses, 1)[0];
    const worstDay = finance.getWorstSpendingDay(expenses);
    
    const financialContext = `
    KASALUKUYANG KAKAYAHAN:
    - Kita (Income): ₱${context.income || 0}
    - Natitira (Balance): ₱${context.budgetRemaining || 0}
    - Susunod na Sahod: ${context.paydayInfo || 'N/A'}
    
    STATS SA GASTOS:
    - Pinakamalaking Category: ${ranked[0] ? ranked[0][0] : 'N/A'} (₱${ranked[0] ? ranked[0][1] : 0})
    - Pinakamahal na Bilihin: ${topExpense ? `${topExpense.subcategory} - ₱${topExpense.amount}` : 'N/A'}
    - Worst Day nitong linggo: ${worstDay ? `${worstDay.date} (₱${worstDay.amount})` : 'N/A'}
    `;

    const chatHistory = history.reverse().map(h => `${h.sender === 'ai' ? 'Coach' : 'User'}: ${h.text}`).join('\n');

    let responseText = "";

    try {
      // 3. Call Gemini AI
      const prompt = `
      CHAT HISTORY:
      ${chatHistory}
      
      FINANCIAL CONTEXT:
      ${financialContext}
      
      USER QUESTION:
      ${text}
      
      Sumagot ka bilang Spendly Coach base sa context na ito.`;

      const result = await model.generateContent(prompt);
      responseText = result.response.text();

    } catch (aiError) {
      console.error("❌ Gemini API Full Error:", aiError);
      
      // 4. FALLBACK: Use local intent engine if AI fails
      const { intent } = detectIntent(text);
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      switch (intent) {
        case INTENTS.EXTREME:
          responseText = topExpense 
            ? `₱${topExpense.amount.toLocaleString()} ang pinakamalaki mong gastos para sa ${topExpense.subcategory}.`
            : "Wala ka pang recorded na gastos, lodi.";
          break;
        case INTENTS.SPENDING:
          responseText = ranked.length 
            ? `Dito ka nadadale sa "${ranked[0][0]}". Nakaka-₱${ranked[0][1].toLocaleString()} ka na!`
            : "Hati-hati pa ang record mo, lodi.";
          break;
        case INTENTS.SURVIVAL:
          const survival = finance.calculateSurvivalMath(context.budgetRemaining, 5);
          responseText = `Limit ka dapat sa ₱${survival.amount.toFixed(0)} per day para umabot ka sa sahod.`;
          break;
        case INTENTS.GREETING:
          responseText = pick(["Uy, hello!", "Mabuhay lodi!", "Yo! Spendly Coach here."]);
          break;
        default:
          responseText = "Pasensya na, lodi. Medyo offline ang AI utak ko ngayon, pero nandito lang ako para mag-compute ng listahan mo.";
      }
    }

    // 5. Save and Return
    const userMsg = new ChatMessage({ user, text, sender: 'user', context });
    await userMsg.save();

    const aiMsg = new ChatMessage({ user, text: responseText, sender: 'ai' });
    await aiMsg.save();

    res.status(200).json({ text: responseText });
  } catch (error) {
    console.error("❌ Chat Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};
