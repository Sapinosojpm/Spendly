/**
 * Spendly "Super Coach" Chat Engine
 * An advanced analytical engine that interprets financial queries with depth.
 */
import { 
  getTopExpenses, 
  getRankedCategories, 
  getWorstSpendingDay,
  getAverageDailySpend 
} from './helpers';

export const processChatMessage = (message, storeData) => {
  const msg = message.toLowerCase();
  const { expenses, income, paydayInfo, totals } = storeData;
  const totalSpent = Object.values(totals.spent).reduce((a, b) => a + b, 0);
  const remainingTotal = income - totalSpent;

  // --- 1. DEEP ANALYTICS INTENTS ---

  // Highest Spending Analysis
  if (msg.includes('pinakamahal') || msg.includes('pinakamalaki') || msg.includes('highest')) {
    const top = getTopExpenses(expenses, 1)[0];
    if (!top) return "Wala ka pang recorded na gastos, lodi. Mag-add ka muna!";
    return `Ang pinakamahal mong binili ay "${top.subcategory}" sa halagang ₱${parseFloat(top.amount).toLocaleString()}. Nangyari ito noong ${new Date(top.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}. Grabe, lodi! 💸`;
  }

  // Category Leak Analysis
  if (msg.includes('saan napunta') || msg.includes('nauubos') || msg.includes('leak') || msg.includes('category')) {
    const ranked = getRankedCategories(expenses);
    if (!ranked.length) return "Hindi ko pa makita kung saan napupunta ang pera mo. Mag-track ka muna ng gastos!";
    const top = ranked[0];
    return `Mukhang sa "${top[0]}" talaga nauubos ang pera mo. ₱${top[1].toLocaleString()} na ang nagastos mo rito. Yan ang main wallet leaker mo! 📉`;
  }

  // Survival Math (Daily Allowance)
  if (msg.includes('survival') || msg.includes('kasya') || (msg.includes('budget') && msg.includes('araw'))) {
    if (paydayInfo.daysUntil <= 0) return "Sahod na! Hindi mo na kailangan mag-survival mode... for now. 😉";
    const dailyAllowance = remainingTotal / paydayInfo.daysUntil;
    
    if (dailyAllowance < 100) {
      return `⚠️ CRITICAL: May ${paydayInfo.daysUntil} araw pa bago ang sahod. ₱${dailyAllowance.toFixed(0)} na lang dapat ang gastusin mo bawat araw. Sobrang tight nito, lodi! Kapit lang.`;
    }
    return `Para umabot ka sa sahod sa loob ng ${paydayInfo.daysUntil} araw, dapat hindi lalampas sa ₱${dailyAllowance.toFixed(0)} ang average gastos mo araw-araw. Kaya 'yan!`;
  }

  // Bad Spending Day Analysis
  if (msg.includes('kailan') && (msg.includes('malakas') || msg.includes('gastos'))) {
    const worst = getWorstSpendingDay(expenses);
    if (!worst) return "Masyado pang maaga para malaman kung kailan ka pinakamalakas gumastos.";
    return `Noong ${worst.date} ka pinakamalakas gumastos ngayong linggo. Nakaka-₱${worst.amount.toLocaleString()} ka sa isang araw lang! Anyare? 😂`;
  }

  // --- 2. BASIC BUDGET INTENTS ---
  if (msg.includes('magkano') || msg.includes('gastos') || msg.includes('pera')) {
    if (msg.includes('total') || msg.includes('lahat') || msg.includes('ubos')) {
      return `Lodi, ₱${totalSpent.toLocaleString()} na ang total expenses mo. May ₱${remainingTotal.toLocaleString()} ka pang natitira mula sa sahod mo.`;
    }
  }

  // --- 3. EMOTIONAL & SUPPORT INTENTS ---
  if (msg.includes('stress') || msg.includes('pagod') || msg.includes('sad') || msg.includes('hirap')) {
    return "Naiintindihan kita, lodi. Minsan talaga nakaka-stress ang budget. Pero tandaan mo, temporary lang 'to. Basta disiplinado ka, giginhawa rin tayo soon! Galingan natin! 💪";
  }

  if (msg.includes('salamat') || msg.includes('thanks') || msg.includes('mabait') || msg.includes('lodi')) {
    return "Walang anuman, lodi! Lagi lang akong nandito para gabayan ka sa finances mo. Sabay-sabay tayong yayaman! 🚀💎";
  }

  if (msg.includes('hi') || msg.includes('hello') || msg.includes('kamusta') || msg.includes('uy')) {
    return "Uy, hello! I'm your Super Coach. Pwede mo akong tanungin tungkol sa pinakamahal mong binili, saan napunta ang pera mo, o kung kasya pa ang budget mo hanggang sahod. Game?";
  }

  // --- 4. DEFAULT ---
  return "Pasensya na, lodi. Hindi ko ma-process 'yan sa ngayon. Try mo itanong: 'Ano pinakamahal kong binili?' 'Saan napunta pera ko?' o 'Kasya ba ako hanggang sahod?'";
};
