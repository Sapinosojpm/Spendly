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
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
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
  
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return total / days;
};

/**
 * Gets the current vs previous week expense totals.
 */
export const getWeeklyTrends = (expenses) => {
  const now = new Date();
  const last7Days = filterByRange(expenses, subDays(now, 6), now);
  const prev7Days = filterByRange(expenses, subDays(now, 13), subDays(now, 7));
  
  const lastTotal = last7Days.reduce((sum, e) => sum + e.amount, 0);
  const prevTotal = prev7Days.reduce((sum, e) => sum + e.amount, 0);
  
  return {
    current: lastTotal,
    previous: prevTotal,
    diff: lastTotal - prevTotal,
    percent: prevTotal === 0 ? 0 : ((lastTotal - prevTotal) / prevTotal) * 100
  };
};
