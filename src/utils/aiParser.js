import { parseScientificBreakdown } from './nutritionEngine';

/**
 * Assistant AI Powered Parser for Ivan's Personal Dashboard
 * Supports Multilingual Response Generation, Ingredient Provenance Breakdown, & Natural Language Edits
 */

const getGeminiApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  return '';
};

function detectIntentCategory(text) {
  const lower = (text || '').toLowerCase().trim();

  if (
    lower.startsWith('trading') || 
    lower.includes('buy ') || 
    lower.includes('sell ') || 
    lower.includes('long ') || 
    lower.includes('short ') || 
    lower.includes('btc') || 
    lower.includes('eth') || 
    lower.includes('sol') || 
    lower.includes('trade') || 
    lower.includes('tp ') || 
    lower.includes('sl ') || 
    lower.includes('take profit') || 
    lower.includes('stop loss') || 
    lower.includes('entry price') || 
    lower.includes('comprato') || 
    lower.includes('venduto')
  ) {
    return 'trading';
  }

  if (
    lower.startsWith('training') || 
    lower.startsWith('allenamento') || 
    lower.includes('squat') || 
    lower.includes('panca') || 
    lower.includes('stacco') || 
    lower.includes('workout') || 
    lower.includes('serie') || 
    lower.includes('reps')
  ) {
    return 'training';
  }

  return 'food';
}

function detectMealType(text, timestamp) {
  const lower = (text || '').toLowerCase();

  if (lower.includes('pranzo')) return 'Pranzo';
  if (lower.includes('cena')) return 'Cena';
  if (lower.includes('colazione')) return 'Colazione';
  if (lower.includes('spuntino') || lower.includes('merenda')) return 'Spuntino';

  let hour = new Date().getHours();
  if (timestamp && timestamp.includes(':')) {
    const timePart = timestamp.split(' ')[1] || timestamp;
    const h = parseInt(timePart.split(':')[0], 10);
    if (!isNaN(h)) hour = h;
  }

  if (hour >= 5 && hour < 12) return 'Colazione';
  if (hour >= 12 && hour < 16) return 'Pranzo';
  if (hour >= 16 && hour < 19) return 'Spuntino';
  if (hour >= 19 && hour < 24) return 'Cena';
  return 'Spuntino';
}

export async function parseUserInput(rawText, currentLogs = { food: [], training: [], trading: [] }, lang = 'IT') {
  const text = rawText.trim();
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;

  try {
    const geminiResult = await callGeminiApi(text, currentLogs, timestamp, lang);
    if (geminiResult) {
      return geminiResult;
    }
  } catch (err) {
    console.warn("Assistant Gemini API call failed, falling back to scientific engine:", err);
  }

  return fallbackLocalParser(text, timestamp, lang);
}

async function callGeminiFetch(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key missing in environment variables");
  }

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastErr = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        lastErr = new Error(`HTTP ${response.status} for ${model}`);
        continue;
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) return replyText;
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error("Gemini API call failed for all models");
}

export async function parseTradeEditInstruction(instruction, currentTrade, lang = 'IT') {
  const prompt = `Sei l'AI Assistant per il Trading di Ivan.
L'utente vuole modificare una posizione di Trading esistente utilizzando una richiesta in linguaggio naturale.

Trade Attuale:
${JSON.stringify(currentTrade, null, 2)}

Istruzione di modifica dell'utente: "${instruction}"

Analizza l'istruzione e restituisci UNICAMENTE un oggetto JSON valido contenente i dati aggiornati del Trade.
Esempio se l'utente dice "imposta il TP a 68000 e chiudi la posizione in profitto di +15%":
{
  "ticker": "${currentTrade.ticker}",
  "type": "${currentTrade.type}",
  "entryPrice": ${currentTrade.entryPrice},
  "takeProfit": 68000,
  "stopLoss": ${currentTrade.stopLoss},
  "status": "CHIUSO",
  "pnl": "+15%",
  "notes": "Modificato da Assistant AI: TP aggiornato e posizione chiusa in target."
}

Rispondi ESCLUSIVAMENTE con il JSON valido (senza markdown o altro testo).`;

  try {
    const replyText = await callGeminiFetch(prompt);
    const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      ...currentTrade,
      ...parsed,
      id: currentTrade.id
    };
  } catch (err) {
    console.error("Failed to parse trade edit with Assistant AI:", err);
    return null;
  }
}

export async function parseFoodEditInstruction(instruction, currentFoodLog, lang = 'IT') {
  const prompt = `Sei l'AI Assistant per la Nutrizione di Ivan.
L'utente vuole modificare un pasto registrato esistente utilizzando una richiesta in linguaggio naturale.

Pasto Attuale:
${JSON.stringify(currentFoodLog, null, 2)}

Istruzione di modifica dell'utente: "${instruction}"

Analizza la richiesta, ricalcola con MASSIMA PRECISIONE SCIENTIFICA (basata sulle banche dati USDA/INRAN) le nuove calorie, macronutrienti (Proteine, Grassi, Carboidrati), i 8 micronutrienti essenziali (vitaminA, vitaminC, vitaminD, iron, calcium, zinc, magnesium, potassium), e la scomposizione per singolo ingrediente.

Restituisci UNICAMENTE un oggetto JSON valido:
{
  "mealType": "Colazione" | "Pranzo" | "Cena" | "Spuntino",
  "description": "Nuova descrizione aggiornata",
  "calories": 520,
  "protein": 45,
  "fats": 14,
  "carbs": 50,
  "micros": {
    "vitaminA": 150, "vitaminC": 40, "vitaminD": 2, "iron": 3, "calcium": 180, "zinc": 3, "magnesium": 70, "potassium": 550
  },
  "ingredientsBreakdown": [
    {
      "name": "Pasta di semola (100g)",
      "calories": 355,
      "protein": 13,
      "fats": 1.5,
      "carbs": 72,
      "micros": { "vitaminA": 0, "vitaminC": 0, "vitaminD": 0, "iron": 1.4, "calcium": 22, "zinc": 1.3, "magnesium": 53, "potassium": 223 }
    }
  ]
}

Rispondi ESCLUSIVAMENTE con il JSON valido (senza markdown o altro testo).`;

  try {
    const replyText = await callGeminiFetch(prompt);
    const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      ...currentFoodLog,
      ...parsed,
      id: currentFoodLog.id,
      timestamp: currentFoodLog.timestamp
    };
  } catch (err) {
    console.error("Failed to parse food edit with Assistant AI:", err);
    return null;
  }
}

async function callGeminiApi(userText, currentLogs, timestamp, lang = 'IT') {
  const isEn = lang === 'EN';
  const explicitCategory = detectIntentCategory(userText);

  const langInstruction = isEn
    ? 'IMPORTANT: Respond strictly in ENGLISH for all text messages, headings, and explanations.'
    : 'IMPORTANTE: Rispondi rigorosamente in ITALIANO per tutti i messaggi di testo, intestazioni e spiegazioni.';

  const detectedType = detectMealType(userText, timestamp);

  const prompt = `Sei l'AI Assistant personale di Ivan per Nutrizione (Food), Allenamento (Training), Trading e Archivio Storico.
${langInstruction}

Analizza la richiesta dell'utente Ivan e restituisci UNICAMENTE un oggetto JSON valido.

SE È TRADING (Trading):
{
  "category": "trading",
  "type": "log_entry",
  "log": {
    "ticker": "BTC/USDT",
    "type": "BUY" | "SELL",
    "entryPrice": 62500,
    "takeProfit": 66000,
    "stopLoss": 60000,
    "size": "1 Posizione",
    "status": "APERTO" | "CHIUSO",
    "notes": "note",
    "pnl": "0.0%"
  },
  "message": "..."
}

SE È CIBO (Food):
{
  "category": "food",
  "type": "log_entry",
  "log": {
    "mealType": "${detectedType}",
    "description": "descrizione",
    "calories": 460,
    "protein": 64,
    "fats": 8,
    "carbs": 28,
    "micros": {
      "vitaminA": 120, "vitaminC": 30, "vitaminD": 2, "iron": 3.5, "calcium": 150, "zinc": 2.5, "magnesium": 65, "potassium": 500
    },
    "ingredientsBreakdown": [...]
  },
  "message": "..."
}

Richiesta dell'utente Ivan: "${userText}"`;

  const replyText = await callGeminiFetch(prompt);
  const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  // Force category to explicit intent if detected
  const category = (explicitCategory !== 'food') ? explicitCategory : (parsed.category || 'food');
  let rawLog = parsed.log || parsed;

  let finalLog = {
    id: (category === 'food' ? 'f_' : category === 'training' ? 't_' : 'tr_') + Date.now(),
    timestamp,
    ...rawLog
  };

  let message = parsed.message;

  if (category === 'trading') {
    const tickerMatch = userText.match(/(btc|eth|sol|nvda|aapl|eurusd|usdt)/i);
    const priceMatch = userText.match(/(\d{4,6})/);

    const ticker = rawLog.ticker || (tickerMatch ? tickerMatch[1].toUpperCase() + '/USDT' : 'BTC/USDT');
    const entryPrice = Number(rawLog.entryPrice || rawLog.entry_price || (priceMatch ? parseInt(priceMatch[1], 10) : 62500));
    const type = rawLog.type || (userText.toLowerCase().includes('sell') || userText.toLowerCase().includes('short') ? 'SELL' : 'BUY');

    finalLog = {
      id: 'tr_' + Date.now(),
      timestamp,
      ticker,
      type,
      entryPrice,
      takeProfit: Number(rawLog.takeProfit || rawLog.take_profit || (type === 'BUY' ? Math.round(entryPrice * 1.05) : Math.round(entryPrice * 0.95))),
      stopLoss: Number(rawLog.stopLoss || rawLog.stop_loss || (type === 'BUY' ? Math.round(entryPrice * 0.96) : Math.round(entryPrice * 1.04))),
      size: rawLog.size || '1 Posizione',
      status: rawLog.status || 'APERTO',
      notes: rawLog.notes || userText,
      pnl: rawLog.pnl || '0.0%'
    };

    message = isEn
      ? `✅ **Trade logged!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${finalLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${finalLog.stopLoss.toLocaleString()}`
      : `✅ **Trade registrato!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${finalLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${finalLog.stopLoss.toLocaleString()}`;
  } else if (category === 'food') {
    finalLog.mealType = detectedType;
  }

  return {
    type: 'log_entry',
    category,
    log: finalLog,
    message: message || `✅ **Operazione registrata!**`
  };
}

function fallbackLocalParser(text, timestamp, lang = 'IT') {
  const isEn = lang === 'EN';
  const category = detectIntentCategory(text);

  if (category === 'trading') {
    const tickerMatch = text.match(/(btc|eth|sol|nvda|aapl|eurusd|usdt)/i);
    const priceMatch = text.match(/(\d{4,6})/);

    const ticker = tickerMatch ? tickerMatch[1].toUpperCase() + '/USDT' : 'BTC/USDT';
    const entryPrice = priceMatch ? parseInt(priceMatch[1], 10) : 62500;
    const type = text.toLowerCase().includes('sell') || text.toLowerCase().includes('short') ? 'SELL' : 'BUY';

    const tradeLog = {
      id: 'tr_' + Date.now(),
      timestamp,
      ticker,
      type,
      entryPrice,
      takeProfit: type === 'BUY' ? Math.round(entryPrice * 1.05) : Math.round(entryPrice * 0.95),
      stopLoss: type === 'BUY' ? Math.round(entryPrice * 0.96) : Math.round(entryPrice * 1.04),
      size: '1 Posizione',
      status: 'APERTO',
      notes: text,
      pnl: '0.0%'
    };

    return {
      type: 'log_entry',
      category: 'trading',
      log: tradeLog,
      message: isEn 
        ? `✅ **Trade logged!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${tradeLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${tradeLog.stopLoss.toLocaleString()}`
        : `✅ **Trade registrato!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${tradeLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${tradeLog.stopLoss.toLocaleString()}`
    };
  }

  // Food Fallback
  const breakdown = parseScientificBreakdown(text);
  const detectedType = detectMealType(text, timestamp);

  const cal = breakdown.reduce((s, i) => s + (i.calories || 0), 0);
  const pro = Math.round(breakdown.reduce((s, i) => s + (i.protein || 0), 0) * 10) / 10;
  const fat = Math.round(breakdown.reduce((s, i) => s + (i.fats || 0), 0) * 10) / 10;
  const carb = Math.round(breakdown.reduce((s, i) => s + (i.carbs || 0), 0) * 10) / 10;

  const micros = breakdown.reduce((acc, i) => {
    const m = i.micros || {};
    return {
      vitaminA: acc.vitaminA + (m.vitaminA || 0),
      vitaminC: acc.vitaminC + (m.vitaminC || 0),
      vitaminD: acc.vitaminD + (m.vitaminD || 0),
      iron: Math.round((acc.iron + (m.iron || 0)) * 10) / 10,
      calcium: acc.calcium + (m.calcium || 0),
      zinc: Math.round((acc.zinc + (m.zinc || 0)) * 10) / 10,
      magnesium: acc.magnesium + (m.magnesium || 0),
      potassium: acc.potassium + (m.potassium || 0)
    };
  }, { vitaminA: 0, vitaminC: 0, vitaminD: 0, iron: 0, calcium: 0, zinc: 0, magnesium: 0, potassium: 0 });

  return {
    type: 'log_entry',
    category: 'food',
    log: {
      id: 'f_' + Date.now(),
      timestamp,
      mealType: detectedType,
      description: text,
      calories: cal,
      protein: pro,
      fats: fat,
      carbs: carb,
      micros,
      ingredientsBreakdown: breakdown
    },
    message: isEn 
      ? `✅ **Food logged!**\n\n📝 **Description**: ${text}\n🔥 **Calories**: ${cal} kcal | 🥩 **Protein**: ${pro}g | 🥑 **Fats**: ${fat}g | 🍞 **Carbs**: ${carb}g`
      : `✅ **Pasto registrato!**\n\n📝 **Descrizione**: ${text}\n🔥 **Calorie**: ${cal} kcal | 🥩 **Proteine**: ${pro}g | 🥑 **Grassi**: ${fat}g | 🍞 **Carbo**: ${carb}g`
  };
}
