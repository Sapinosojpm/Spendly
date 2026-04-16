import { 
  groupByCategory, 
  getMostFrequentSubcategory, 
  getAverageDailySpend, 
  getWeeklyTrends 
} from './helpers';

/**
 * Calculates a financial health score (0-100).
 */
const calculateHealthScore = (totals, budget) => {
  if (budget === 0) return 0;
  
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
  const usageRatio = totalSpent / budget;
  
  // Base score 100
  let score = 100;
  
  // Penalize overspending
  if (usageRatio > 1) score -= (usageRatio - 1) * 100;
  
  // Penalize lack of savings (if savings makes up less than 10% of spending and we are deep in the month)
  const savingsRatio = totals.Savings / (totalSpent || 1);
  if (savingsRatio < 0.1 && totalSpent > 0) score -= 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Main function to generate all AI insights.
 */
export const runInsightsEngine = (data) => {
  const { income, budgetAllocation, expenses } = data;
  const insights = [];
  
  const totals = groupByCategory(expenses);
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
  
  // 1. Budget Usage
  const categories = ['Bills', 'Wants', 'Savings'];
  categories.forEach(cat => {
    const allocated = (budgetAllocation[cat.toLowerCase()] / 100) * income;
    const spent = totals[cat] || 0;
    const usage = (spent / allocated) * 100;
    
    if (usage > 100) {
      insights.push({
        id: `over-${cat}`,
        type: "warning",
        title: `Lampas na sa ${cat === 'Bills' ? 'Bayarin' : cat === 'Wants' ? 'Wants' : 'Ipon'}!`,
        description: `Naku! Lumampas ka na ng ₱${(spent - allocated).toFixed(0)} sa iyong budget para sa ${cat}.`,
        priority: "high"
      });
    } else if (usage > 80) {
      insights.push({
        id: `near-${cat}`,
        type: "warning",
        title: `Konting-konti na lang sa ${cat}`,
        description: `Huy, hinay-hinay lang! ${usage.toFixed(0)}% na ang nagamit mo sa ${cat}.`,
        priority: "medium"
      });
    }
  });

  // 2. Top Spending Detection
  const mostFrequent = getMostFrequentSubcategory(expenses);
  if (mostFrequent) {
    insights.push({
      id: 'most-frequent',
      type: "insight",
      title: "Paboritong Gastos",
      description: `Mukhang malakas ka sa "${mostFrequent[0]}". Naka-${mostFrequent[1]} beses ka na rito!`,
      priority: "low"
    });
  }

  // 3. Trends
  const trends = getWeeklyTrends(expenses);
  if (trends.percent > 10) {
    insights.push({
      id: 'trend-spike',
      type: "warning",
      title: "Biglang Taas!",
      description: `Ang taas ng gastos mo ngayong linggo! ${trends.percent.toFixed(0)}% na mas mahal kaysa dati.`,
      priority: "medium"
    });
  } else if (trends.percent < -10) {
    insights.push({
      id: 'trend-progress',
      type: "tip",
      title: "Ang Galing Mo!",
      description: `Bumaba ang gastos mo ng ${Math.abs(trends.percent).toFixed(0)}% ngayong linggo. Yan ang galawan!`,
      priority: "medium"
    });
  }

  // 4. Prediction
  const avgDaily = getAverageDailySpend(expenses);
  if (avgDaily > 0) {
    const remainingBudget = income - totalSpent;
    const daysLeft = Math.floor(remainingBudget / avgDaily);
    
    if (daysLeft < 7 && daysLeft >= 0) {
      insights.push({
        id: 'pred-low',
        type: "warning",
        title: "Dikit na ang Budget",
        description: `Sa galawa mo ngayon, mukhang ${daysLeft} araw na lang at mauubos na ang budget mo.`,
        priority: "high"
      });
    } else if (daysLeft > 0) {
      insights.push({
        id: 'pred-rate',
        type: "insight",
        title: "Daily Burn",
        description: `Ang average na gastos mo araw-araw ay ₱${avgDaily.toFixed(0)}.`,
        priority: "low"
      });
    }
  }

  // 5. Health Score
  const healthScore = calculateHealthScore(totals, income);

  return {
    insights: insights.sort((a, b) => {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }),
    healthScore,
    totalSpent,
    avgDaily
  };
};
