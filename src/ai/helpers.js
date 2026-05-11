import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  isWithinInterval, 
  parseISO, 
  differenceInDays 
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
 * Groups expenses by subcategory and finds the most frequent one.
 */
export const getMostFrequentSubcategory = (expenses) => {
  if (!expenses.length) return null;
  const counts = expenses.reduce((acc, exp) => {
    acc[exp.subcategory] = (acc[exp.subcategory] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
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
 * Filters expenses within a specific date range.
 */
export const filterByRange = (expenses, start, end) => {
  return expenses.filter(exp => {
    const date = parseISO(exp.date);
    return isWithinInterval(date, { start: startOfDay(start), end: endOfDay(end) });
  });
};

/**
 * Calculates average daily spend for a given set of expenses.
 */
export const getAverageDailySpend = (expenses) => {
  if (!expenses.length) return 0;
  
  const dates = expenses.map(e => parseISO(e.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date();
  const days = Math.max(1, differenceInDays(maxDate, minDate) + 1);
  
  const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  return total / days;
};

/**
 * Gets the current vs previous week expense totals.
 */
export const getWeeklyTrends = (expenses) => {
  const now = new Date();
  const last7Days = filterByRange(expenses, subDays(now, 6), now);
  const prev7Days = filterByRange(expenses, subDays(now, 13), subDays(now, 7));
  
  const lastTotal = last7Days.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const prevTotal = prev7Days.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  return {
    current: lastTotal,
    previous: prevTotal,
    diff: lastTotal - prevTotal,
    percent: prevTotal === 0 ? 0 : ((lastTotal - prevTotal) / prevTotal) * 100
  };
};

/**
 * Finds the "Bad Spending Day" (highest spend in last 7 days).
 */
export const getWorstSpendingDay = (expenses) => {
  if (!expenses.length) return null;
  const now = new Date();
  const last7Days = filterByRange(expenses, subDays(now, 6), now);
  
  const dailyTotals = {};
  last7Days.forEach(e => {
    const dateKey = startOfDay(parseISO(e.date)).toISOString();
    dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + parseFloat(e.amount);
  });
  
  const worst = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0];
  if (!worst) return null;
  
  return {
    date: new Date(worst[0]).toLocaleDateString('en-PH', { weekday: 'long' }),
    amount: worst[1]
  };
};
