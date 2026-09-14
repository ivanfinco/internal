/**
 * Scientific Food & Nutrient Composition Engine for Ivan's Personal Dashboard
 * Comprehensive database based on USDA FoodData Central & INRAN / CREA tables.
 * All values are per 100g of edible portion.
 */

const FOOD_DATABASE = [
  // ═══════════════════════════════════════════════════
  // CEREALI, PASTA, RISO, PANE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['pasta', 'spaghetti', 'penne', 'rigatoni', 'fusilli', 'linguine', 'maccheroni', 'bucatini', 'tagliatelle', 'lasagna', 'semola'],
    cal: 353, p: 12.5, f: 1.5, c: 72, k: 223, mg: 53, ca: 22, fe: 1.4, zn: 1.5, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['riso', 'basmati', 'arborio', 'carnaroli', 'jasmine'],
    cal: 360, p: 7, f: 0.6, c: 79, k: 115, mg: 25, ca: 10, fe: 0.8, zn: 1.1, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['farro'],
    cal: 335, p: 15, f: 2.5, c: 67, k: 390, mg: 130, ca: 18, fe: 3.7, zn: 2.8, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['quinoa'],
    cal: 368, p: 14, f: 6, c: 64, k: 563, mg: 197, ca: 47, fe: 4.6, zn: 3.1, vitA: 1, vitC: 0, vitD: 0
  },
  {
    keywords: ['avena', 'fiocchi d\'avena', 'porridge', 'oatmeal'],
    cal: 389, p: 17, f: 7, c: 66, k: 429, mg: 177, ca: 54, fe: 4.7, zn: 4, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['pane', 'panino', 'ciabatta', 'baguette', 'integrale', 'segale', 'fette biscottate'],
    cal: 265, p: 9, f: 3.2, c: 49, k: 115, mg: 25, ca: 52, fe: 1.6, zn: 0.9, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['crackers', 'grissini', 'gallette'],
    cal: 420, p: 10, f: 10, c: 72, k: 150, mg: 30, ca: 40, fe: 2, zn: 1, vitA: 0, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // CARNI & POLLAME
  // ═══════════════════════════════════════════════════
  {
    keywords: ['pollo', 'petto di pollo', 'fesa di pollo', 'chicken'],
    cal: 110, p: 23, f: 1.3, c: 0, k: 340, mg: 28, ca: 14, fe: 0.4, zn: 0.8, vitA: 6, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['tacchino', 'petto di tacchino', 'fesa di tacchino', 'turkey'],
    cal: 104, p: 24, f: 0.7, c: 0, k: 293, mg: 27, ca: 10, fe: 0.4, zn: 1.2, vitA: 5, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['manzo', 'vitello', 'filetto', 'bistecca', 'beef', 'hamburger'],
    cal: 250, p: 26, f: 15, c: 0, k: 315, mg: 21, ca: 18, fe: 2.6, zn: 4.8, vitA: 0, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['maiale', 'lonza', 'braciola', 'pork'],
    cal: 242, p: 27, f: 14, c: 0, k: 362, mg: 24, ca: 6, fe: 0.9, zn: 2, vitA: 2, vitC: 1, vitD: 0.6
  },
  {
    keywords: ['prosciutto cotto'],
    cal: 145, p: 22, f: 5, c: 1, k: 287, mg: 18, ca: 8, fe: 0.7, zn: 1.8, vitA: 0, vitC: 0, vitD: 0.3
  },
  {
    keywords: ['prosciutto crudo', 'bresaola', 'speck'],
    cal: 230, p: 28, f: 12, c: 0.5, k: 430, mg: 22, ca: 10, fe: 1.3, zn: 2.5, vitA: 0, vitC: 0, vitD: 0.3
  },

  // ═══════════════════════════════════════════════════
  // PESCE & FRUTTI DI MARE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['salmone', 'salmon'],
    cal: 208, p: 20, f: 13, c: 0, k: 363, mg: 29, ca: 12, fe: 0.3, zn: 0.6, vitA: 40, vitC: 0, vitD: 11
  },
  {
    keywords: ['tonno', 'tuna'],
    cal: 130, p: 29, f: 1, c: 0, k: 252, mg: 50, ca: 16, fe: 1, zn: 0.6, vitA: 655, vitC: 0, vitD: 4.9
  },
  {
    keywords: ['merluzzo', 'nasello', 'orata', 'branzino', 'sogliola', 'platessa', 'pesce'],
    cal: 82, p: 18, f: 0.7, c: 0, k: 413, mg: 32, ca: 16, fe: 0.4, zn: 0.5, vitA: 12, vitC: 1, vitD: 1
  },
  {
    keywords: ['gamberi', 'gamberetti', 'calamari', 'polpo', 'cozze', 'vongole'],
    cal: 85, p: 18, f: 1, c: 1, k: 220, mg: 37, ca: 70, fe: 2.4, zn: 1.3, vitA: 56, vitC: 2, vitD: 0.5
  },

  // ═══════════════════════════════════════════════════
  // LATTICINI & FORMAGGI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['grana', 'parmigiano', 'grana padano', 'parmigiano reggiano', 'pecorino romano'],
    cal: 392, p: 33, f: 28, c: 0, k: 100, mg: 44, ca: 1160, fe: 0.7, zn: 4, vitA: 268, vitC: 0, vitD: 0.5
  },
  {
    keywords: ['mozzarella', 'fiordilatte', 'burrata'],
    cal: 280, p: 22, f: 20, c: 2.2, k: 76, mg: 20, ca: 505, fe: 0.4, zn: 2.8, vitA: 179, vitC: 0, vitD: 0.4
  },
  {
    keywords: ['ricotta'],
    cal: 174, p: 11, f: 13, c: 3, k: 105, mg: 11, ca: 207, fe: 0.4, zn: 1.2, vitA: 120, vitC: 0, vitD: 0.3
  },
  {
    keywords: ['formaggio', 'emmental', 'fontina', 'asiago', 'edamer', 'gouda', 'cheddar'],
    cal: 380, p: 27, f: 29, c: 1, k: 90, mg: 30, ca: 800, fe: 0.5, zn: 3.5, vitA: 250, vitC: 0, vitD: 0.6
  },
  {
    keywords: ['yogurt greco', 'yogurt proteico', 'skyr'],
    cal: 97, p: 9, f: 5, c: 4, k: 141, mg: 11, ca: 110, fe: 0.1, zn: 0.5, vitA: 26, vitC: 0, vitD: 0.1
  },
  {
    keywords: ['yogurt', 'yogurt bianco', 'yogurt magro'],
    cal: 60, p: 3.5, f: 3.3, c: 4.7, k: 155, mg: 12, ca: 120, fe: 0.1, zn: 0.6, vitA: 22, vitC: 1, vitD: 0.1
  },
  {
    keywords: ['latte', 'latte intero', 'latte parzialmente scremato'],
    cal: 64, p: 3.3, f: 3.6, c: 4.8, k: 150, mg: 12, ca: 120, fe: 0, zn: 0.4, vitA: 28, vitC: 1, vitD: 1.3
  },

  // ═══════════════════════════════════════════════════
  // UOVA
  // ═══════════════════════════════════════════════════
  {
    keywords: ['uovo', 'uova', 'uova intere'],
    cal: 155, p: 13, f: 11, c: 1.1, k: 138, mg: 12, ca: 56, fe: 1.8, zn: 1.3, vitA: 160, vitC: 0, vitD: 2.2
  },
  {
    keywords: ['albume', 'albumi'],
    cal: 52, p: 11, f: 0.2, c: 0.7, k: 163, mg: 11, ca: 7, fe: 0.1, zn: 0, vitA: 0, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // FRUTTA A GUSCIO, SEMI & BURRI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['mandorle', 'crema di mandorle', 'burro di mandorle', 'mandorla'],
    cal: 614, p: 21, f: 53, c: 19, k: 748, mg: 279, ca: 269, fe: 3.7, zn: 3.3, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['arachidi', 'burro di arachidi', 'crema di arachidi', 'peanut butter'],
    cal: 588, p: 25, f: 50, c: 16, k: 705, mg: 168, ca: 54, fe: 2.5, zn: 3.3, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['noci', 'noce'],
    cal: 654, p: 15, f: 65, c: 14, k: 441, mg: 158, ca: 98, fe: 2.9, zn: 3.1, vitA: 1, vitC: 1.3, vitD: 0
  },
  {
    keywords: ['nocciole', 'nocciola', 'crema di nocciole'],
    cal: 628, p: 15, f: 61, c: 17, k: 680, mg: 163, ca: 114, fe: 4.7, zn: 2.5, vitA: 1, vitC: 6, vitD: 0
  },
  {
    keywords: ['pistacchi', 'pistacchio'],
    cal: 560, p: 20, f: 45, c: 28, k: 1025, mg: 121, ca: 105, fe: 3.9, zn: 2.2, vitA: 26, vitC: 6, vitD: 0
  },
  {
    keywords: ['semi di chia', 'chia'],
    cal: 486, p: 17, f: 31, c: 42, k: 407, mg: 335, ca: 631, fe: 7.7, zn: 4.6, vitA: 0, vitC: 2, vitD: 0
  },
  {
    keywords: ['semi di lino', 'lino'],
    cal: 534, p: 18, f: 42, c: 29, k: 813, mg: 392, ca: 255, fe: 5.7, zn: 4.3, vitA: 0, vitC: 1, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // LEGUMI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['lenticchie', 'lenticchia'],
    cal: 116, p: 9, f: 0.4, c: 20, k: 369, mg: 36, ca: 19, fe: 3.3, zn: 1.3, vitA: 2, vitC: 2, vitD: 0
  },
  {
    keywords: ['ceci', 'cece', 'hummus'],
    cal: 164, p: 9, f: 2.6, c: 27, k: 291, mg: 48, ca: 49, fe: 2.9, zn: 1.5, vitA: 1, vitC: 1, vitD: 0
  },
  {
    keywords: ['fagioli', 'fagiolo', 'borlotti', 'cannellini'],
    cal: 127, p: 9, f: 0.5, c: 22, k: 403, mg: 45, ca: 35, fe: 2.1, zn: 1, vitA: 0, vitC: 1, vitD: 0
  },
  {
    keywords: ['tofu'],
    cal: 76, p: 8, f: 4.8, c: 1.9, k: 121, mg: 30, ca: 350, fe: 5.4, zn: 0.8, vitA: 0, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // VERDURE & ORTAGGI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['broccoli', 'broccoletti'],
    cal: 34, p: 2.8, f: 0.4, c: 7, k: 316, mg: 21, ca: 47, fe: 0.7, zn: 0.4, vitA: 31, vitC: 89, vitD: 0
  },
  {
    keywords: ['spinaci', 'spinacio'],
    cal: 23, p: 2.9, f: 0.4, c: 3.6, k: 558, mg: 79, ca: 99, fe: 2.7, zn: 0.5, vitA: 469, vitC: 28, vitD: 0
  },
  {
    keywords: ['zucchine', 'zucchina'],
    cal: 17, p: 1.2, f: 0.3, c: 3, k: 261, mg: 18, ca: 16, fe: 0.4, zn: 0.3, vitA: 10, vitC: 18, vitD: 0
  },
  {
    keywords: ['insalata', 'lattuga', 'rucola', 'misticanza', 'valeriana'],
    cal: 15, p: 1.4, f: 0.2, c: 2.9, k: 194, mg: 13, ca: 36, fe: 0.9, zn: 0.2, vitA: 166, vitC: 9, vitD: 0
  },
  {
    keywords: ['carote', 'carota'],
    cal: 41, p: 0.9, f: 0.2, c: 10, k: 320, mg: 12, ca: 33, fe: 0.3, zn: 0.2, vitA: 835, vitC: 6, vitD: 0
  },
  {
    keywords: ['peperoni', 'peperone'],
    cal: 31, p: 1, f: 0.3, c: 6, k: 211, mg: 12, ca: 7, fe: 0.4, zn: 0.3, vitA: 157, vitC: 128, vitD: 0
  },
  {
    keywords: ['pomodori', 'pomodoro', 'pomodorini', 'ciliegini'],
    cal: 18, p: 0.9, f: 0.2, c: 3.9, k: 237, mg: 11, ca: 10, fe: 0.3, zn: 0.2, vitA: 42, vitC: 14, vitD: 0
  },
  {
    keywords: ['patate', 'patata'],
    cal: 77, p: 2, f: 0.1, c: 17, k: 425, mg: 23, ca: 12, fe: 0.8, zn: 0.3, vitA: 0, vitC: 20, vitD: 0
  },
  {
    keywords: ['avocado'],
    cal: 160, p: 2, f: 15, c: 9, k: 485, mg: 29, ca: 12, fe: 0.6, zn: 0.6, vitA: 7, vitC: 10, vitD: 0
  },
  {
    keywords: ['funghi', 'fungo', 'champignon', 'porcini'],
    cal: 22, p: 3.1, f: 0.3, c: 3.3, k: 318, mg: 9, ca: 3, fe: 0.5, zn: 0.5, vitA: 0, vitC: 2, vitD: 0.2
  },
  {
    keywords: ['melanzane', 'melanzana'],
    cal: 25, p: 1, f: 0.2, c: 6, k: 229, mg: 14, ca: 9, fe: 0.2, zn: 0.2, vitA: 1, vitC: 2, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // FRUTTA
  // ═══════════════════════════════════════════════════
  {
    keywords: ['banana', 'banane'],
    cal: 89, p: 1.1, f: 0.3, c: 23, k: 358, mg: 27, ca: 5, fe: 0.3, zn: 0.2, vitA: 3, vitC: 9, vitD: 0
  },
  {
    keywords: ['mela', 'mele'],
    cal: 52, p: 0.3, f: 0.2, c: 14, k: 107, mg: 5, ca: 6, fe: 0.1, zn: 0, vitA: 3, vitC: 5, vitD: 0
  },
  {
    keywords: ['arancia', 'arance', 'mandarino'],
    cal: 47, p: 0.9, f: 0.1, c: 12, k: 181, mg: 10, ca: 40, fe: 0.1, zn: 0.1, vitA: 11, vitC: 53, vitD: 0
  },
  {
    keywords: ['fragole', 'fragola', 'frutti di bosco', 'lamponi', 'mirtilli'],
    cal: 32, p: 0.7, f: 0.3, c: 8, k: 153, mg: 13, ca: 16, fe: 0.4, zn: 0.1, vitA: 1, vitC: 59, vitD: 0
  },
  {
    keywords: ['kiwi'],
    cal: 61, p: 1.1, f: 0.5, c: 15, k: 312, mg: 17, ca: 34, fe: 0.3, zn: 0.1, vitA: 4, vitC: 93, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // CONDIMENTI, OLI & GRASSI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['olio', 'olio evo', 'olio extravergine', 'olio d\'oliva', 'olio oliva'],
    cal: 884, p: 0, f: 100, c: 0, k: 1, mg: 0, ca: 1, fe: 0.6, zn: 0, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['burro'],
    cal: 717, p: 0.9, f: 81, c: 0.1, k: 24, mg: 2, ca: 24, fe: 0, zn: 0.1, vitA: 684, vitC: 0, vitD: 1.5
  },
  {
    keywords: ['maionese', 'mayo'],
    cal: 680, p: 1, f: 75, c: 0.6, k: 20, mg: 2, ca: 8, fe: 0.3, zn: 0.1, vitA: 32, vitC: 0, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // SALSE & SUGHI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['sugo', 'sugo di pomodoro', 'passata', 'pelati', 'salsa', 'ragù'],
    cal: 24, p: 1.2, f: 0.2, c: 4.5, k: 290, mg: 12, ca: 18, fe: 0.5, zn: 0.2, vitA: 25, vitC: 15, vitD: 0
  },
  {
    keywords: ['pesto', 'pesto genovese'],
    cal: 387, p: 5, f: 38, c: 6, k: 230, mg: 55, ca: 200, fe: 2, zn: 1.5, vitA: 120, vitC: 3, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // BEVANDE
  // ═══════════════════════════════════════════════════
  {
    keywords: ['caffè', 'caffe', 'espresso', 'americano'],
    cal: 2, p: 0.1, f: 0, c: 0, k: 115, mg: 8, ca: 2, fe: 0, zn: 0, vitA: 0, vitC: 0, vitD: 0
  },
  {
    keywords: ['succo d\'arancia', 'spremuta', 'succo'],
    cal: 45, p: 0.7, f: 0.2, c: 10, k: 200, mg: 11, ca: 11, fe: 0.2, zn: 0.1, vitA: 10, vitC: 50, vitD: 0
  },
  {
    keywords: ['latte di mandorla', 'latte vegetale', 'latte di soia', 'latte di avena'],
    cal: 24, p: 0.6, f: 1.1, c: 3, k: 67, mg: 7, ca: 184, fe: 0.3, zn: 0.2, vitA: 37, vitC: 0, vitD: 1
  },

  // ═══════════════════════════════════════════════════
  // DOLCI & SNACKS
  // ═══════════════════════════════════════════════════
  {
    keywords: ['cioccolato', 'cioccolata', 'cioccolato fondente', 'nutella', 'cacao'],
    cal: 546, p: 5, f: 31, c: 60, k: 400, mg: 100, ca: 56, fe: 3, zn: 1.6, vitA: 3, vitC: 0, vitD: 0
  },
  {
    keywords: ['miele'],
    cal: 304, p: 0.3, f: 0, c: 82, k: 52, mg: 2, ca: 6, fe: 0.4, zn: 0.2, vitA: 0, vitC: 1, vitD: 0
  },
  {
    keywords: ['marmellata', 'confettura', 'composta'],
    cal: 250, p: 0.4, f: 0.1, c: 63, k: 55, mg: 4, ca: 20, fe: 0.3, zn: 0.1, vitA: 2, vitC: 10, vitD: 0
  },

  // ═══════════════════════════════════════════════════
  // PROTEINE IN POLVERE & INTEGRATORI
  // ═══════════════════════════════════════════════════
  {
    keywords: ['whey', 'proteine in polvere', 'protein powder', 'proteina'],
    cal: 370, p: 80, f: 3, c: 8, k: 600, mg: 80, ca: 400, fe: 2, zn: 3, vitA: 0, vitC: 0, vitD: 0
  },
];

/**
 * Find the best matching food profile from our database
 */
function findFoodProfile(text) {
  const lower = text.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of FOOD_DATABASE) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        // Longer keyword match = more specific = better
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

/**
 * Default fallback profile for unrecognized foods (moderate mixed food)
 */
const DEFAULT_PROFILE = {
  cal: 180, p: 8, f: 6, c: 22, k: 200, mg: 25, ca: 40, fe: 1, zn: 0.8, vitA: 20, vitC: 5, vitD: 0.1
};

/**
 * Parse a meal description into scientifically accurate ingredient-level breakdown.
 * Each ingredient gets calories, macros, and full micronutrient profile proportional
 * to its real-world composition, then the totals are normalized to match the AI-reported totals.
 */
export function parseScientificBreakdown(description, totalCal, totalPro, totalFat, totalCarb, totalMicros = {}) {
  const text = (description || '').toLowerCase();
  
  // Split description into ingredient items
  const items = text.split(/,|\+|\se\s|\scon\s/i).map(s => s.trim()).filter(Boolean);
  
  if (items.length <= 1) {
    const profile = findFoodProfile(text) || DEFAULT_PROFILE;
    const weightMatch = text.match(/(\d+)\s*g/i);
    const w = weightMatch ? parseInt(weightMatch[1], 10) : 100;

    return [
      {
        name: capitalize(description),
        calories: Number(totalCal) || Math.round((w / 100) * profile.cal),
        protein: Number(totalPro) || Math.round((w / 100) * profile.p * 10) / 10,
        fats: Number(totalFat) || Math.round((w / 100) * profile.f * 10) / 10,
        carbs: Number(totalCarb) || Math.round((w / 100) * profile.c * 10) / 10,
        micros: {
          potassium: totalMicros.potassium || Math.round((w / 100) * profile.k),
          magnesium: totalMicros.magnesium || Math.round((w / 100) * profile.mg),
          calcium: totalMicros.calcium || Math.round((w / 100) * profile.ca),
          iron: totalMicros.iron || Math.round((w / 100) * profile.fe * 10) / 10,
          zinc: totalMicros.zinc || Math.round((w / 100) * profile.zn * 10) / 10,
          vitaminA: totalMicros.vitaminA || Math.round((w / 100) * profile.vitA),
          vitaminC: totalMicros.vitaminC || Math.round((w / 100) * profile.vitC),
          vitaminD: totalMicros.vitaminD || Math.round((w / 100) * profile.vitD * 10) / 10
        }
      }
    ];
  }

  // Parse each item: detect food type and weight
  const itemProfiles = items.map(itemStr => {
    const weightMatch = itemStr.match(/(\d+)\s*g/i);
    const weightGrams = weightMatch ? parseInt(weightMatch[1], 10) : 100;
    const profile = findFoodProfile(itemStr) || DEFAULT_PROFILE;

    const factor = weightGrams / 100;

    return {
      name: itemStr,
      weightGrams,
      profile,
      rawCal: factor * profile.cal,
      rawPro: factor * profile.p,
      rawFat: factor * profile.f,
      rawCarb: factor * profile.c,
      rawK: factor * profile.k,
      rawMg: factor * profile.mg,
      rawCa: factor * profile.ca,
      rawFe: factor * profile.fe,
      rawZn: factor * profile.zn,
      rawVitA: factor * profile.vitA,
      rawVitC: factor * profile.vitC,
      rawVitD: factor * profile.vitD
    };
  });

  // Sum raw estimates
  const sumCal = itemProfiles.reduce((s, i) => s + i.rawCal, 0) || 1;
  const sumPro = itemProfiles.reduce((s, i) => s + i.rawPro, 0) || 1;
  const sumFat = itemProfiles.reduce((s, i) => s + i.rawFat, 0) || 1;
  const sumCarb = itemProfiles.reduce((s, i) => s + i.rawCarb, 0) || 1;
  const sumK = itemProfiles.reduce((s, i) => s + i.rawK, 0) || 1;
  const sumMg = itemProfiles.reduce((s, i) => s + i.rawMg, 0) || 1;
  const sumCa = itemProfiles.reduce((s, i) => s + i.rawCa, 0) || 1;
  const sumFe = itemProfiles.reduce((s, i) => s + i.rawFe, 0) || 1;
  const sumZn = itemProfiles.reduce((s, i) => s + i.rawZn, 0) || 1;
  const sumVitA = itemProfiles.reduce((s, i) => s + i.rawVitA, 0) || 1;
  const sumVitC = itemProfiles.reduce((s, i) => s + i.rawVitC, 0) || 1;
  const sumVitD = itemProfiles.reduce((s, i) => s + i.rawVitD, 0) || 1;

  // Use AI totals if provided, otherwise use raw scientific estimates
  const targetCal = Number(totalCal) || Math.round(sumCal);
  const targetPro = Number(totalPro) || Math.round(sumPro);
  const targetFat = Number(totalFat) || Math.round(sumFat);
  const targetCarb = Number(totalCarb) || Math.round(sumCarb);
  const targetK = totalMicros.potassium || Math.round(sumK);
  const targetMg = totalMicros.magnesium || Math.round(sumMg);
  const targetCa = totalMicros.calcium || Math.round(sumCa);
  const targetFe = totalMicros.iron || Math.round(sumFe * 10) / 10;
  const targetZn = totalMicros.zinc || Math.round(sumZn * 10) / 10;
  const targetVitA = totalMicros.vitaminA || Math.round(sumVitA);
  const targetVitC = totalMicros.vitaminC || Math.round(sumVitC);
  const targetVitD = totalMicros.vitaminD || Math.round(sumVitD * 10) / 10;

  // Distribute proportionally based on each item's real composition ratio
  return itemProfiles.map(item => ({
    name: capitalize(item.name),
    calories: Math.round((item.rawCal / sumCal) * targetCal),
    protein: Math.round(((item.rawPro / sumPro) * targetPro) * 10) / 10,
    fats: Math.round(((item.rawFat / sumFat) * targetFat) * 10) / 10,
    carbs: Math.round(((item.rawCarb / sumCarb) * targetCarb) * 10) / 10,
    micros: {
      potassium: Math.round((item.rawK / sumK) * targetK),
      magnesium: Math.round((item.rawMg / sumMg) * targetMg),
      calcium: Math.round((item.rawCa / sumCa) * targetCa),
      iron: Math.round(((item.rawFe / sumFe) * targetFe) * 10) / 10,
      zinc: Math.round(((item.rawZn / sumZn) * targetZn) * 10) / 10,
      vitaminA: Math.round((item.rawVitA / sumVitA) * targetVitA),
      vitaminC: Math.round((item.rawVitC / sumVitC) * targetVitC),
      vitaminD: Math.round(((item.rawVitD / sumVitD) * targetVitD) * 10) / 10
    }
  }));
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
