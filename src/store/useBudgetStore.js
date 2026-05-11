import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runInsightsEngine } from '../ai/insightsEngine';
import { syncExpense, deleteExpenseSync } from '../services/api';

const useBudgetStore = create(
  persist(
    (set, get) => ({
      income: 0,
      allocations: {
        Bills: 50,
        Wants: 30,
        Savings: 20,
      },
      expenses: [],
      goals: [
        { id: '1', name: 'Boracay Fund 🏝️', target: 25000, icon: 'palmtree' }
      ],
      isOnboarded: false,
      themeId: 'yellow',

      // Actions
      setIncome: (income) => set({ income }),
      setAllocations: (allocations) => set({ allocations }),
      setOnboarded: (status) => set({ isOnboarded: !!status }),
      setTheme: (themeId) => set({ themeId }),
      
      addExpense: (expense) => {
        const id = Date.now().toString();
        const date = new Date().toISOString();
        const userId = "661e5f5e5f5e5f5e5f5e5f5e"; // Placeholder

        set((state) => ({
          expenses: [
            ...state.expenses,
            { id, date, ...expense }
          ]
        }));

        // SYNC TO BACKEND
        syncExpense({
          user: userId,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: date
        }).catch(err => console.log("Failed to sync expense:", err));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id)
        }));

        // SYNC TO BACKEND (Optional: Requires record of MongoDB ID)
        // For now, local ID doesn't match MongoDB ID, so we skip backend delete
        // unless we store the backend ID in the local state.
      },

      clearData: () => set({
        income: 0,
        allocations: { Bills: 50, Wants: 30, Savings: 20 },
        expenses: [],
        goals: [{ id: '1', name: 'Boracay Fund 🏝️', target: 25000, icon: 'palmtree' }],
        isOnboarded: false
      }),

      // Goal Actions
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { id: Date.now().toString(), ...goal }]
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),

      // Computed totals
      getTotals: () => {
        const { expenses, income, allocations } = get();
        
        const totals = {
          Bills: 0,
          Wants: 0,
          Savings: 0,
        };

        expenses.forEach((expense) => {
          if (totals[expense.category] !== undefined) {
            totals[expense.category] += parseFloat(expense.amount);
          }
        });

        const allocatedAmounts = {
          Bills: (income * allocations.Bills) / 100,
          Wants: (income * allocations.Wants) / 100,
          Savings: (income * allocations.Savings) / 100,
        };

        return {
          spent: totals,
          allocated: allocatedAmounts,
          remaining: {
            Bills: allocatedAmounts.Bills - totals.Bills,
            Wants: allocatedAmounts.Wants - totals.Wants,
            Savings: allocatedAmounts.Savings - totals.Savings,
          }
        };
      },

      getWeeklyStats: () => {
        const { expenses } = get();
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0,0,0,0);

        const weeklyExpenses = expenses.filter(e => new Date(e.date) >= startOfWeek);
        
        const totals = { Bills: 0, Wants: 0, Savings: 0 };
        weeklyExpenses.forEach(e => {
          if (totals[e.category] !== undefined) totals[e.category] += e.amount;
        });

        return {
          total: Object.values(totals).reduce((a, b) => a + b, 0),
          breakdown: totals,
          count: weeklyExpenses.length
        };
      },

      getMonthlyTrend: (daysCount = 7) => {
        const { expenses } = get();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = [];

        // Get expenses for last X days
        const now = new Date();
        for (let i = 0; i < daysCount; i++) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          const dayName = days[d.getDay()];
          const dayExpenses = expenses.filter(e => {
            const ed = new Date(e.date);
            return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth();
          });
          
          const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
          
          if (daysCount > 7) {
            // For longer trends, show every 5th date to avoid overlap
            const showLabel = i % 5 === 0 || i === daysCount - 1;
            data.push({ label: showLabel ? d.getDate().toString() : '', value: dayTotal });
          } else {
            data.push({ label: dayName, value: dayTotal });
          }
        }

        return data.reverse();
      },

      getAIResults: () => {
        const { income, allocations, expenses } = get();
        const budgetAllocation = {
          bills: allocations.Bills,
          wants: allocations.Wants,
          savings: allocations.Savings,
        };
        const paydayInfo = get().getPaydayInfo();
        return runInsightsEngine({ income, budgetAllocation, expenses, paydayInfo });
      },

      // Vibe Features
      paydayDays: [15, 30],
      setPaydayDays: (days) => set({ paydayDays: days }),

      getPaydayInfo: () => {
        const { paydayDays } = get();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        // Generate dates for current month and next month
        let candidates = [];
        
        // Current month candidates
        paydayDays.forEach(day => {
          candidates.push(new Date(currentYear, currentMonth, day, 23, 59, 59));
        });
        
        // Next month candidates
        paydayDays.forEach(day => {
          candidates.push(new Date(currentYear, currentMonth + 1, day, 23, 59, 59));
        });

        // Filter for those in the future and pick the nearest
        const futureCandidates = candidates
          .filter(date => date >= now)
          .sort((a, b) => a - b);

        const nextPayday = futureCandidates[0] || new Date(currentYear, currentMonth, 15);
        
        // Reset hours for clean date math
        const nextPaydayClean = new Date(nextPayday);
        nextPaydayClean.setHours(0, 0, 0, 0);
        const nowClean = new Date(now);
        nowClean.setHours(0, 0, 0, 0);

        const diffTime = nextPaydayClean - nowClean;
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        
        return {
          daysUntil: diffDays,
          isDelikado: diffDays <= 3,
          date: nextPayday.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
        };
      },

      getDailyHack: () => {
        const hacks = [
          "Mag-baon muna ng kanin at ulam sa work/school. Tipid ka na, busog pa!",
          "I-off ang mga appliances na hindi ginagamit. Bawas sa kuryente, dagdag sa ipon.",
          "Mag-lista muna bago mag-grocery. Huwag magpadala sa 'sale'.",
          "Tubig na lang muna sa halip na milk tea o kape sa labas.",
          "Gamitin ang 24-hour rule: Palipasin ang 24 oras bago bumili ng hindi kailangan.",
          "I-set ang automatic transfer sa savings account tuwing sahod."
        ];
        // Use date as seed for daily consistency
        const index = new Date().getDate() % hacks.length;
        return hacks[index];
      },

      getMotivationalQuote: () => {
        const quotes = [
          "ANG PAG-IIPON AY HINDI TUNGKOL SA DAMI, KUNDI SA DISIPLINA. GALING MO, IDOL!",
          "ANG PERANG TINIPID AY PERANG KINITA. TULOY-TULOY LANG!",
          "MAGING MATALINO SA PAGGASTOS, PARA SA KINABUKASAN NG PAMILYA.",
          "HINDI KAILANGAN MAGING MAYAMAN PARA MAGSIMULANG MAG-IPON.",
          "SABAY-SABAY TAYONG MAG-IPON PARA SA PANGARAP!",
          "DISIPLINA NGAYON, GINHAWA BUKAS. KAYA MO 'YAN!"
        ];
        const index = new Date().getDate() % quotes.length;
        return quotes[index];
      }
    }),
    {
      name: 'spendly-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useBudgetStore;
