import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from '../models/Expense.js';
import ChatMessage from '../models/ChatMessage.js';

dotenv.config();

const userId = "661e5f5e5f5e5f5e5f5e5f5e";

const categories = ['Bills', 'Wants', 'Savings', 'Food', 'Transport'];
const subcategories = {
  Bills: ['Rent', 'Electricity', 'Water', 'Internet', 'Netflix'],
  Wants: ['Shopping', 'Gaming', 'Coffee', 'Hobbies', 'Movie'],
  Savings: ['Emergency Fund', 'Travel Savings', 'Stocks', 'Crypto'],
  Food: ['Groceries', 'Dine out', 'Fast food', 'GrabFood'],
  Transport: ['Gas', 'Grab', 'Angkas', 'LRT/MRT', 'Parking']
};

const generateRandomData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Optionally clear data if you want a fresh start
    // await Expense.deleteMany({ user: userId });
    // await ChatMessage.deleteMany({ user: userId });

    const expenses = [];
    const now = new Date();

    console.log('Generating 180 days of expenses...');

    for (let i = 0; i < 180; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      // 2 to 5 expenses per day
      const dailyCount = Math.floor(Math.random() * 4) + 2;

      for (let j = 0; j < dailyCount; j++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const sub = subcategories[category][Math.floor(Math.random() * subcategories[category].length)];
        
        let amount = 0;
        if (category === 'Bills') amount = Math.floor(Math.random() * 5000) + 500;
        else if (category === 'Savings') amount = Math.floor(Math.random() * 2000) + 200;
        else amount = Math.floor(Math.random() * 500) + 50;

        expenses.push({
          user: userId,
          amount,
          category,
          subcategory: sub, // Adding subcategory for better data
          description: `Sample ${sub} expense`,
          date: date
        });
      }
    }

    await Expense.insertMany(expenses);
    console.log(`Successfully added ${expenses.length} expenses!`);

    // Generate some Sample Conversations
    const chats = [
      { user: userId, text: "Hi Coach!", sender: "user", timestamp: new Date(now.getTime() - 1000 * 60 * 60) },
      { user: userId, text: "Hello lodi! Kamusta ang budget natin?", sender: "ai", timestamp: new Date(now.getTime() - 1000 * 60 * 55) },
      { user: userId, text: "Ano ang pinakamahal kong binili ngayong buwan?", sender: "user", timestamp: new Date(now.getTime() - 1000 * 60 * 50) },
      { user: userId, text: "Teka, iche-check ko ang records mo...", sender: "ai", timestamp: new Date(now.getTime() - 1000 * 60 * 45) }
    ];

    await ChatMessage.insertMany(chats);
    console.log(`Successfully added ${chats.length} chat messages!`);

    console.log('Seeding Complete! 🎉');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

generateRandomData();
