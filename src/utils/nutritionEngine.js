/**
 * Scientific Food & Nutrient Composition Engine for Ivan's Personal Dashboard
 * Comprehensive database based on USDA FoodData Central & INRAN / CREA tables.
 * All values are per 100g or 100ml of edible portion.
 */

const FOOD_DATABASE = [
  // ═══════════════════════════════════════════════════
  // ALIMENTI ZERO CALORIE, DOLCIFICANTI & SPEZIE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['dolcificante zero', 'dolcificante', 'stevia', 'eritritolo', 'sucralosio', 'acqua', 'tè zero', 'tisana'],
    cal: 0, p: 0, f: 0, c: 0, k: 0, mg: 0, ca: 0, fe: 0, zn: 0, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['cannella', 'spezie', 'origano', 'basilico', 'pepe', 'sale', 'rosmarino', 'prezzemolo'],
    cal: 2, p: 0.1, f: 0, c: 0.5, k: 10, mg: 2, ca: 10, fe: 0.1, zn: 0, vitA: 0, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // CAFFÈ & BEVANDE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['caffè espresso', 'caffe espresso', 'caffè', 'caffe', 'espresso', 'americano'],
    cal: 2, p: 0.1, f: 0, c: 0.2, k: 115, mg: 8, ca: 2, fe: 0, zn: 0, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['latte di mandorla senza zuccheri', 'latte di mandorle senza zuccheri', 'latte di mandorla zero zuccheri', 'latte di mandorle zero zuccheri', 'latte di mandorla senza zucchero', 'latte di mandorle senza zucchero', 'latte di mandorla 0% zuccheri'],
    cal: 13, p: 0.4, f: 1.1, c: 0.1, k: 67, mg: 7, ca: 120, fe: 0.2, zn: 0.1, vitA: 0, vitC: 0, vitD: 0.75
  },
  {
    keywords: ['latte di mandorla', 'latte di mandorle'],
    cal: 24, p: 0.6, f: 1.1, c: 3.0, k: 67, mg: 7, ca: 120, fe: 0.3, zn: 0.2, vitA: 37, vitC: 0, vitD: 1.0
  },

  // ═══════════════════════════════════════════════════
  // BURRI & CREME DI FRUTTA A GUSCIO (100% NATURALE)
  // ═══════════════════════════════════════════════════
  {
    keywords: ['burro di 100% mandorle pelate', 'burro di mandorle pelate', 'crema di mandorle pelate', 'burro di mandorla pelata', 'crema di mandorla pelata'],
    cal: 614, p: 21.0, f: 53.8, c: 8.8, k: 748, mg: 279, ca: 269, fe: 3.7, zn: 3.3, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['mandorle', 'crema di mandorle', 'burro di mandorle', 'mandorla'],
    cal: 614, p: 21.0, f: 53.0, c: 19.0, k: 748, mg: 279, ca: 269, fe: 3.7, zn: 3.3, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['burro di arachidi', 'crema di arachidi', 'peanut butter', 'arachidi'],
    cal: 588, p: 25.0, f: 50.0, c: 16.0, k: 705, mg: 168, ca: 54, fe: 2.5, zn: 3.3, vitA: 0, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // FORMAGGI & LATTICINI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['grana grattugiato', 'grana padano', 'grana', 'parmigiano reggiano', 'parmigiano', 'pecorino'],
    cal: 392, p: 33.0, f: 28.4, c: 0.0, k: 100, mg: 44, ca: 1160, fe: 0.7, zn: 4.0, vitA: 268, vitC: 0, vitD: 0.5
  },
  {
    keywords: ['mozzarella', 'fiordilatte', 'burrata'],
    cal: 280, p: 22.0, f: 20.0, c: 2.2, k: 76, mg: 20, ca: 505, fe: 0.4, zn: 2.8, vitA: 179, vitC: 0, vitD: 0.4
  },
  {
    keywords: ['ricotta'],
    cal: 174, p: 11.0, f: 13.0, c: 3.0, k: 105, mg: 11, ca: 207, fe: 0.4, zn: 1.2, vitA: 120, vitC: 0, vitD: 0.3
  },
  {
    keywords: ['yogurt greco 0%', 'yogurt greco magro', 'skyr'],
    cal: 59, p: 10.0, f: 0.4, c: 3.6, k: 141, mg: 11, ca: 110, fe: 0.1, zn: 0.5, vitA: 5, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['yogurt greco', 'yogurt proteico'],
    cal: 97, p: 9.0, f: 5.0, c: 4.0, k: 141, mg: 11, ca: 110, fe: 0.1, zn: 0.5, vitA: 26, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['uovo', 'uova', 'uova intere'],
    cal: 155, p: 13.0, f: 11.0, c: 1.1, k: 138, mg: 12, ca: 56, fe: 1.8, zn: 1.3, vitA: 160, vitC: 0, vitD: 2.2
  },

  // ═══════════════════════════════════════════════════
  // SALSE & POMODORO
  // ═══════════════════════════════════════════════════
  {
    keywords: ['passata di pomodoro', 'passata', 'sugo di pomodoro', 'pomodoro', 'pomodorini', 'pelati', 'salsa'],
    cal: 18, p: 1.0, f: 0.2, c: 3.5, k: 290, mg: 12, ca: 18, fe: 0.5, zn: 0.2, vitA: 42, vitC: 14, vitD: 0
  },
  {
    keywords: ['pesto', 'pesto genovese'],
    cal: 387, p: 5.0, f: 38.0, c: 6.0, k: 230, mg: 55, ca: 200, fe: 2.0, zn: 1.5, vitA: 120, vitC: 3, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // CEREALI, PASTA, RISO, PANE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['pasta', 'spaghetti', 'penne', 'rigatoni', 'fusilli', 'linguine', 'maccheroni', 'bucatini'],
    cal: 353, p: 12.5, f: 1.5, c: 72.0, k: 223, mg: 53, ca: 22, fe: 1.4, zn: 1.5, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['riso basmati', 'basmati'],
    cal: 350, p: 7.5, f: 0.6, c: 78.0, k: 115, mg: 25, ca: 10, fe: 0.8, zn: 1.1, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['pane', 'panino', 'ciabatta', 'integrale', 'segale'],
    cal: 265, p: 9.0, f: 3.2, c: 49.0, k: 115, mg: 25, ca: 52, fe: 1.6, zn: 0.9, vitA: 0, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // CARNI & PESCE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['petto di pollo', 'fesa di pollo', 'pollo ai ferri', 'pollo'],
    cal: 110, p: 23.0, f: 1.3, c: 0.0, k: 340, mg: 28, ca: 14, fe: 0.4, zn: 0.8, vitA: 6, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['salmone', 'salmon'],
    cal: 208, p: 20.0, f: 13.0, c: 0.0, k: 363, mg: 29, ca: 12, fe: 0.3, zn: 0.6, vitA: 40, vitC: 0, vitD: 11.0
  },
  {
    keywords: ['tonno'],
    cal: 116, p: 26.0, f: 1.0, c: 0.0, k: 252, mg: 50, ca: 16, fe: 1.0, zn: 0.6, vitA: 655, vitC: 0, vitD: 4.9
  },

  // ═══════════════════════════════════════════════════
  // CONDIMENTI & OLI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['olio evo', 'olio extravergine', 'olio d\'oliva', 'olio oliva', 'olio'],
    cal: 884, p: 0.0, f: 100.0, c: 0.0, k: 1, mg: 0, ca: 1, fe: 0.6, zn: 0.0, vitA: 0, vitC: 0, vitD: 0
  }
];

function findFoodProfile(text) {
  const lower = text.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of FOOD_DATABASE) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = entry;
        }
      }
    }
  }

  return bestMatch;
}

function parseQuantityGrams(text) {
  const lower = text.toLowerCase();

  // Match ml or g directly: "110g", "50g", "26g", "200ml"
  const directMatch = lower.match(/(\d+[\.,]?\d*)\s*(g|ml|gr|grammi|millilitri)/i);
  if (directMatch) {
    return parseFloat(directMatch[1].replace(',', '.'));
  }

  // Household measures
  if (lower.includes('cucchiaino') || lower.includes('cucchiaini')) {
    const num = lower.match(/(\d+)\s*cucchiain/i);
    return (num ? parseInt(num[1], 10) : 1) * 7;
  }
  if (lower.includes('cucchiaio') || lower.includes('cucchiai')) {
    const num = lower.match(/(\d+)\s*cucchia/i);
    return (num ? parseInt(num[1], 10) : 1) * 15;
  }

  // Unit count: "1 kiwi", "1 caffe", "2 uova"
  const unitMatch = lower.match(/(\d+)\s*(kiwi|caffe|espresso|uovo|uova|mela|banana)/i);
  if (unitMatch) {
    const count = parseInt(unitMatch[1], 10);
    const unitName = unitMatch[2].toLowerCase();
    if (unitName.includes('kiwi')) return count * 70;
    if (unitName.includes('caffe') || unitName.includes('espresso')) return count * 30;
    if (unitName.includes('uov')) return count * 50;
  }

  return 100;
}

const DEFAULT_PROFILE = {
  cal: 15, p: 0.5, f: 0.2, c: 2.0, k: 20, mg: 3, ca: 5, fe: 0.1, zn: 0, vitA: 0, vitC: 0, vitD: 0
};

export function parseScientificBreakdown(description, totalCal = 0, totalPro = 0, totalFat = 0, totalCarb = 0, totalMicros = {}) {
  let text = (description || '').trim();

  // Strip leading meal category header like "Colazione: ", "Pranzo: "
  text = text.replace(/^(colazione|pranzo|cena|spuntino|pasto)\s*:\s*/i, '');

  // Split description into individual food items
  const rawItems = text.split(/,|\+|\se\s|\scon\s/i).map(s => s.trim()).filter(Boolean);

  // Filter out any leftover header words like "Colazione", "Pranzo"
  const items = rawItems.filter(itemStr => {
    const clean = itemStr.toLowerCase();
    return !['colazione', 'pranzo', 'cena', 'spuntino', 'pasto'].includes(clean);
  });

  const itemProfiles = items.map(itemStr => {
    const weightGrams = parseQuantityGrams(itemStr);
    const profile = findFoodProfile(itemStr) || DEFAULT_PROFILE;
    const factor = weightGrams / 100;

    return {
      name: capitalize(itemStr),
      weightGrams,
      profile,
      cal: factor * profile.cal,
      pro: factor * profile.p,
      fat: factor * profile.f,
      carb: factor * profile.c,
      k: factor * profile.k,
      mg: factor * profile.mg,
      ca: factor * profile.ca,
      fe: factor * profile.fe,
      zn: factor * profile.zn,
      vitA: factor * profile.vitA,
      vitC: factor * profile.vitC,
      vitD: factor * profile.vitD
    };
  });

  const sumCal = itemProfiles.reduce((s, i) => s + i.cal, 0);
  const sumPro = itemProfiles.reduce((s, i) => s + i.pro, 0);
  const sumFat = itemProfiles.reduce((s, i) => s + i.fat, 0);
  const sumCarb = itemProfiles.reduce((s, i) => s + i.carb, 0);

  // Use raw scientific sum directly unless totalCal is within 15% of sumCal
  const isInputRealistic = totalCal > 0 && Math.abs(totalCal - sumCal) / (sumCal || 1) < 0.15;

  const targetCal = isInputRealistic ? totalCal : Math.round(sumCal);
  const scale = isInputRealistic ? (targetCal / (sumCal || 1)) : 1;

  return itemProfiles.map(item => ({
    name: item.name,
    calories: Math.round(item.cal * scale),
    protein: Math.round((item.pro * scale) * 10) / 10,
    fats: Math.round((item.fat * scale) * 10) / 10,
    carbs: Math.round((item.carb * scale) * 10) / 10,
    micros: {
      potassium: Math.round(item.k),
      magnesium: Math.round(item.mg),
      calcium: Math.round(item.ca),
      iron: Math.round(item.fe * 10) / 10,
      zinc: Math.round(item.zn * 10) / 10,
      vitaminA: Math.round(item.vitA),
      vitaminC: Math.round(item.vitC),
      vitaminD: Math.round(item.vitD * 10) / 10
    }
  }));
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
