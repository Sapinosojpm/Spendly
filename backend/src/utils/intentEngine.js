/**
 * Intent Engine for Spendly
 * Analyzes user messages and assigns an Intent with a confidence score.
 */

export const INTENTS = {
  SPENDING: 'SPENDING',
  EXTREME: 'EXTREME',
  SURVIVAL: 'SURVIVAL',
  HISTORY: 'HISTORY',
  GREETING: 'GREETING',
  AFFIRMATIVE: 'AFFIRMATIVE',
  NEGATION: 'NEGATION',
  UNKNOWN: 'UNKNOWN'
};

const intentKeywords = {
  [INTENTS.SPENDING]: ['san', 'saan', 'napunta', 'nauubos', 'leak', 'gastos', 'spent', 'tracking', 'pira', 'pera'],
  [INTENTS.EXTREME]: ['mahal', 'malaki', 'highest', 'expensive', 'luho', 'ginasta', 'mabigat'],
  [INTENTS.SURVIVAL]: ['kasya', 'survival', 'tiis', 'allowance', 'days', 'hanggang', 'sahod', 'kailan'],
  [INTENTS.HISTORY]: ['history', 'record', 'usapan', 'sinabi', 'naalala', 'dati'],
  [INTENTS.GREETING]: ['hi', 'hello', 'kamusta', 'uy', 'lodi', 'coach', 'mabuhay', 'wazzup', 'boss', 'sup', 'bossing', 'helo'],
  [INTENTS.AFFIRMATIVE]: ['oo', 'sige', 'game', 'ok', 'okay', 'yes', 'mismo', 'tumpak', 'uuch', 'ey',],
  [INTENTS.NEGATION]: ['hindi', 'ayoko', 'no', 'wala', 'mali', 'nope']
};

export const detectIntent = (text) => {
  const msg = text.toLowerCase();
  let bestIntent = INTENTS.UNKNOWN;
  let maxScore = 0;

  // Split into words for better matching of short words like "oo"
  const words = msg.split(/\s+/);

  Object.entries(intentKeywords).forEach(([intent, keywords]) => {
    let score = 0;
    keywords.forEach(kw => {
      // For short keywords (<= 3 chars), check for exact word match
      if (kw.length <= 3) {
        if (words.includes(kw)) score += 2;
      } else {
        if (msg.includes(kw)) score += 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  });

  return {
    intent: bestIntent,
    score: maxScore
  };
};
