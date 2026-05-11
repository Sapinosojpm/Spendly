import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  isWithinInterval, 
} from 'date-fns';

/**
 * Groups expenses by category and calculates totals.
 */
export const groupByCategory = (expenses) => {
  return expenses.reduce((acc, exp) => {
    const amount = parseFloat(exp.amount) || 0;
    acc[exp.category] = (acc[exp.category] || 0) + amount;
    return acc;
  }, {});
};

/**
 * Finds the top X most expensive purchases.
 */
export const getTopExpenses = (expenses, limit = 1) => {
  if (!expenses.length) return [];
  return [...expenses]
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, limit);
};

/**
 * Gets a ranked list of categories by total spend.
 */
export const getRankedCategories = (expenses) => {
  const totals = groupByCategory(expenses);
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);
};

/**
 * Finds the "Worst Spending Day" (highest spend in last 7 days).
 */
export const getWorstSpendingDay = (expenses) => {
  if (!expenses.length) return null;
  const now = new Date();
  const weekStart = subDays(now, 7);
  
  const dailyTotals = {};
  expenses.forEach(e => {
    const eDate = new Date(e.date);
    if (eDate >= weekStart) {
      const dateKey = startOfDay(eDate).toISOString();
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + parseFloat(e.amount);
    }
  });
  
  const worst = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0];
  if (!worst) return null;
  
  return {
    date: new Date(worst[0]).toLocaleDateString('en-PH', { weekday: 'long' }),
    amount: worst[1]
  };
};

/**
 * Calculates survival math: how much daily spend is allowed until payday.
 */
export const calculateSurvivalMath = (remainingBudget, daysUntilPayday) => {
  if (daysUntilPayday <= 0) return { status: 'sahod', amount: 0 };
  const daily = remainingBudget / daysUntilPayday;
  return {
    status: daily < 200 ? 'critical' : 'ok',
    amount: daily
  };
};
