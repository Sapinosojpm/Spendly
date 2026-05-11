import { 
  groupByCategory, 
  getMostFrequentSubcategory, 
  getAverageDailySpend, 
  getWeeklyTrends 
} from './helpers';

/**
 * Calculates a financial health score (0-100).
 */
const calculateHealthScore = (totals, budget, paydayInfo) => {
  if (budget === 0) return 0;
  
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
  const usageRatio = totalSpent / budget;
  
  // Base score 100
  let score = 100;
  
  // Penalize overspending
  if (usageRatio > 1) score -= (usageRatio - 1) * 100;
  
  // Penalize lack of savings
  const savingsRatio = (totals.Savings || 0) / (budget * 0.2); // Relative to 20% goal
  if (savingsRatio < 0.5) score -= 15;
  
  // Penalize if "Petsa de Peligro" is active and budget is low
  if (paydayInfo.isDelikado && usageRatio > 0.9) score -= 20;
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Main function to generate all AI insights.
 */
export const runInsightsEngine = (data) => {
  const { income, budgetAllocation, expenses, paydayInfo } = data;
  const insights = [];
  
  const totals = groupByCategory(expenses);
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
  const remainingBudget = income - totalSpent;
  
  // 1. Budget Usage & "Petsa de Peligro" Logic
  const categories = ['Bills', 'Wants', 'Savings'];
  categories.forEach(cat => {
    const allocatedPercentage = budgetAllocation[cat.toLowerCase()] || 0;
    const allocatedAmount = (allocatedPercentage / 100) * income;
    const spent = totals[cat] || 0;
    const usage = (spent / allocatedAmount) * 100;
    
    if (usage > 100) {
      insights.push({
        id: `over-${cat}`,
        type: "warning",
        title: `WALWAL MODE: ${cat.toUpperCase()}! 🚩`,
        description: `Lodi, lumampas ka na ng ₱${(spent - allocatedAmount).toFixed(0)} sa budget mo para sa ${cat}. Hingang malalim!`,
        priority: "high"
      });
    } else if (usage > 90 && !paydayInfo.isDelikado) {
      insights.push({
        id: `near-${cat}`,
        type: "warning",
        title: `HINAY-HINAY LANG SA ${cat.toUpperCase()}!`,
        description: `${usage.toFixed(0)}% na ang nagamit mo. Baka hindi umabot sa sahod!`,
        priority: "medium"
      });
    }
  });

  // 2. Survival Mode (S.O.S)
  if (paydayInfo.daysUntil > 0) {
    const avgDailyAllowed = remainingBudget / paydayInfo.daysUntil;
    const avgDailyActual = getAverageDailySpend(expenses);
    
    if (avgDailyActual > avgDailyAllowed && remainingBudget < (income * 0.15)) {
      insights.push({
        id: 'sos-mode',
        type: "warning",
        title: "PETSA DE PELIGRO: S.O.S! 🔥",
        description: `May ${paydayInfo.daysUntil} araw pa bago ang sahod pero ₱${remainingBudget.toFixed(0)} na lang ang pera mo. Mag-can goods muna tayo, lods!`,
        priority: "high"
      });
    }
  }

  // 3. Ipon Achievement
  const savingsAllocated = (budgetAllocation.savings / 100) * income;
  const savingsSpent = totals.Savings || 0;
  if (savingsSpent >= savingsAllocated && savingsAllocated > 0) {
    insights.push({
      id: 'savings-star',
      type: "tip",
      title: "IPON MASTER REACHED! ⭐",
      description: "Na-hit mo ang savings goal mo ngayong buwan! Ikaw na ang tunay na financial king/queen.",
      priority: "high"
    });
  }

  // 4. Frequency Detection
  const mostFrequent = getMostFrequentSubcategory(expenses);
  if (mostFrequent && mostFrequent[1] >= 3) {
    insights.push({
      id: 'most-frequent',
      type: "insight",
      title: "WALLET LEAKER DETECTED 💸",
      description: `Paborito mo talaga ang "${mostFrequent[0]}". ${mostFrequent[1]} times mo na 'to ginastusan! Sulit ba talaga?`,
      priority: "medium"
    });
  }

  // 5. Weekly Trend coaching
  const trends = getWeeklyTrends(expenses);
  if (trends.percent > 20) {
    insights.push({
      id: 'trend-spike',
      type: "warning",
      title: "BIGLANG TAAS NG GASTOS! 📈",
      description: `Umakyat ng ${trends.percent.toFixed(0)}% ang gastos mo vs last week. Kumapit ka sa table, pre!`,
      priority: "medium"
    });
  } else if (trends.percent < -15) {
    insights.push({
      id: 'trend-progress',
      type: "tip",
      title: "TIPID LEVEL: PRO 💎",
      description: `Bumaba ang gastos mo ng ${Math.abs(trends.percent).toFixed(0)}%! Kitang-kita ang disiplina mo.`,
      priority: "medium"
    });
  }

  // 6. Fallback if no insights
  if (insights.length === 0) {
    insights.push({
      id: 'all-clear',
      type: "tip",
      title: "ALL CLEAR! ✅",
      description: "Wala akong makitang issues sa spending mo ngayon. Tuloy mo lang ang disiplina!",
      priority: "low"
    });
  }

  // 7. Final Health Score
  const healthScore = calculateHealthScore(totals, income, paydayInfo);

  return {
    insights: insights.sort((a, b) => {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }),
    healthScore,
    totalSpent,
    avgDaily: getAverageDailySpend(expenses)
  };
};
