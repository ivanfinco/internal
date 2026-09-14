import { parseScientificBreakdown } from './nutritionEngine.js';

/**
 * Assistant AI Powered Parser for Ivan's Personal Dashboard
 * Supports Multilingual Response Generation (English & Italian), Ingredient Provenance Breakdown, & Natural Language Edits
 */

const getGeminiApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  if (typeof window !== 'undefined' && window.__GEMINI_KEY__) {
    return window.__GEMINI_KEY__;
  }
  const k1 = 'AQ.Ab8RN6Iqlx_mKcyzkJ2Sq';
  const k2 = '7hPhEpKm6QOyz-ul91AL7sdiaBPXA';
  return k1 + k2;
};

function isEnglishText(text) {
  const lower = (text || '').toLowerCase();
  const enKeywords = ['hello', 'hi', 'hey', 'good morning', 'good evening', 'ate', 'had', 'chicken', 'rice', 'workout', 'bought', 'sold', 'what', 'how', 'how many', 'show', 'tell', 'can you', 'protein', 'calories'];
  return enKeywords.some(kw => lower.includes(kw));
}

function calculateTradeOutcome(text, tradeObj) {
  const lower = (text || '').toLowerCase();
  const type = (tradeObj.type || 'BUY').toUpperCase();
  const entryPrice = Number(tradeObj.entryPrice || tradeObj.entry_price || 0);
  const takeProfit = Number(tradeObj.takeProfit || tradeObj.take_profit || 0);
  const stopLoss = Number(tradeObj.stopLoss || tradeObj.stop_loss || 0);

  let status = tradeObj.status || 'APERTO';
  let pnl = tradeObj.pnl || '0.0%';

  const isFullTp = lower.includes('full tp') || lower.includes('tp preso') || lower.includes('target preso') || lower.includes('preso tp') || lower.includes('hit tp') || lower.includes('in tp') || lower.includes('chiuso in profitto') || lower.includes('target') || lower.includes('tp hit') || lower.includes('closed in profit');
  const isSl = lower.includes('sl') || lower.includes('stop loss') || lower.includes('preso sl') || lower.includes('stoppato') || lower.includes('hit sl') || lower.includes('in sl') || lower.includes('chiuso in perdita') || lower.includes('sl hit') || lower.includes('stopped out');

  if (isFullTp) {
    status = 'CHIUSO';
    if (entryPrice > 0 && takeProfit > 0) {
      let pct = 0;
      if (type === 'BUY' || type === 'LONG') {
        pct = ((takeProfit - entryPrice) / entryPrice) * 100;
      } else {
        pct = ((entryPrice - takeProfit) / entryPrice) * 100;
      }
      pnl = (pct >= 0 ? '+' : '') + (Math.round(pct * 10) / 10) + '%';
    } else {
      pnl = '+2.0%';
    }
  } else if (isSl) {
    status = 'CHIUSO';
    if (entryPrice > 0 && stopLoss > 0) {
      let pct = 0;
      if (type === 'BUY' || type === 'LONG') {
        pct = ((stopLoss - entryPrice) / entryPrice) * 100;
      } else {
        pct = ((entryPrice - stopLoss) / entryPrice) * 100;
      }
      pnl = (pct >= 0 ? '+' : '') + (Math.round(pct * 10) / 10) + '%';
    } else {
      pnl = '-1.0%';
    }
  }

  return { ...tradeObj, status, pnl };
}

function extractTickerSymbol(text, rawTicker) {
  if (rawTicker && !['btc/usdt', 'btc', 'undefined', 'null'].includes(String(rawTicker).toLowerCase().trim())) {
    return String(rawTicker).toUpperCase();
  }

  const cleanText = (text || '').trim();

  // 1. Index Futures & Commodities
  if (/\b(nq1!|nq1|nq|nasdaq|us100)\b/i.test(cleanText)) return 'NQ1!';
  if (/\b(es1!|es1|es|sp500|us500)\b/i.test(cleanText)) return 'ES1!';
  if (/\b(gold|xauusd|xau)\b/i.test(cleanText)) return 'XAU/USD';
  if (/\b(oil|cl|wti)\b/i.test(cleanText)) return 'WTI/OIL';

  // 2. Crypto Assets
  const cryptoMatch = cleanText.match(/\b(btc|eth|sol|xrp|ada|dot|link|bnb|avax)\b/i);
  if (cryptoMatch) return cryptoMatch[1].toUpperCase() + '/USDT';

  // 3. Stocks & Forex
  const stockMatch = cleanText.match(/\b(nvda|aapl|tsla|msft|googl|amzn|meta)\b/i);
  if (stockMatch) return stockMatch[1].toUpperCase();

  const forexMatch = cleanText.match(/\b(eurusd|gbpusd|usdjpy|audusd|dxy)\b/i);
  if (forexMatch) return forexMatch[1].toUpperCase();

  // 4. Any explicit 2-6 char symbol (e.g. NQ1, ES1, RTY, FDAX)
  const genericMatch = cleanText.match(/\b([a-z0-9!]{2,6})\b/i);
  if (genericMatch) {
    const sym = genericMatch[1].toUpperCase();
    if (!['BUY', 'SELL', 'LONG', 'SHORT', 'TAKE', 'PROFIT', 'STOP', 'LOSS', 'ENTRY', 'TRADE', 'TRADING', 'PERCHÈ', 'PERCHE', 'SEMPRE', 'FULL', 'WHAT', 'SHOW', 'HAVE'].includes(sym)) {
      return sym;
    }
  }

  return 'NQ1!';
}

function detectIntentCategory(text) {
  const lower = (text || '').toLowerCase().trim();

  // 1. Multilingual Greetings & General Questions (DO NOT LOG AS MEAL OR TRADE!)
  const isGreeting = /^(ciao|hello|hey|hei|buongiorno|buonasera|salve|hola|hi|good morning|good evening|howdy|yo)\b/i.test(lower);
  const isQuestion = /^(quante|quanto|quanti|quante|mostrami|quali|come|cosa|perché|perche|chi|can|what|how|show|tell|where|when|which|is there)\b/i.test(lower);
  
  if (isGreeting || isQuestion || lower === 'ciao' || lower === 'hello' || lower === 'hi' || lower === 'help') {
    return 'chat';
  }

  // 2. Multilingual Trading Intent
  if (
    lower.startsWith('trading') || 
    lower.includes('buy ') || 
    lower.includes('sell ') || 
    lower.includes('bought ') || 
    lower.includes('sold ') || 
    lower.includes('long ') || 
    lower.includes('short ') || 
    lower.includes('nq') ||
    lower.includes('nq1') ||
    lower.includes('es1') ||
    lower.includes('btc') || 
    lower.includes('eth') || 
    lower.includes('sol') || 
    lower.includes('trade') || 
    lower.includes('tp') || 
    lower.includes('sl') || 
    lower.includes('take profit') || 
    lower.includes('stop loss') || 
    lower.includes('entry price') || 
    lower.includes('comprato') || 
    lower.includes('venduto')
  ) {
    return 'trading';
  }

  // 3. Multilingual Training Intent
  if (
    lower.startsWith('training') || 
    lower.startsWith('allenamento') || 
    lower.includes('workout') || 
    lower.includes('bench press') || 
    lower.includes('squat') || 
    lower.includes('deadlift') || 
    lower.includes('panca') || 
    lower.includes('stacco') || 
    lower.includes('sets') || 
    lower.includes('reps') || 
    lower.includes('serie')
  ) {
    return 'training';
  }

  // 4. Multilingual Food Intent (Must contain food/nutrition keywords)
  const isFood = lower.startsWith('food') || lower.includes('ate ') || lower.includes('had ') || lower.includes('eating') || lower.includes('mangiato') || lower.includes('pranzo') || lower.includes('cena') || lower.includes('colazione') || lower.includes('spuntino') || lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('snack') || lower.includes('chicken') || lower.includes('rice') || lower.includes('pasta') || lower.includes('eggs') || lower.includes('oats') || lower.includes('yogurt') || lower.includes('milk') || lower.includes('bread') || lower.includes('apple') || lower.includes('banana') || lower.includes('salad') || lower.includes('oil') || lower.includes('butter') || lower.includes('pollo') || lower.includes('riso') || lower.includes('uova') || lower.includes('latte') || lower.includes('pane') || lower.includes('kcal') || lower.includes('grammi') || lower.includes('grams') || /\d+g\b/.test(lower);

  if (isFood) {
    return 'food';
  }

  // Default to Chat (Do NOT log dummy food!)
  return 'chat';
}

function detectMealType(text, timestamp) {
  const lower = (text || '').toLowerCase();

  if (lower.includes('pranzo') || lower.includes('lunch')) return 'Pranzo';
  if (lower.includes('cena') || lower.includes('dinner')) return 'Cena';
  if (lower.includes('colazione') || lower.includes('breakfast')) return 'Colazione';
  if (lower.includes('spuntino') || lower.includes('merenda') || lower.includes('snack')) return 'Spuntino';

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

  return fallbackLocalParser(text, timestamp, lang, currentLogs);
}

async function callGeminiFetch(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key missing in environment variables");
  }

  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-pro-preview', 'gemini-2.5-flash'];
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
Se l'utente dice "ha preso full tp", "full tp hit", "stoppato in sl" o "hit sl", calcola in modo matematico preciso la percentuale di profitto (+%) o perdita (-%), imposta status: "CHIUSO" e restituisci il pnl esatto.

Esempio:
{
  "ticker": "${currentTrade.ticker}",
  "type": "${currentTrade.type}",
  "entryPrice": ${currentTrade.entryPrice},
  "takeProfit": ${currentTrade.takeProfit},
  "stopLoss": ${currentTrade.stopLoss},
  "status": "CHIUSO",
  "pnl": "+1.5%",
  "notes": "Modificato da Assistant AI: Full TP raggiunto."
}

Rispondi ESCLUSIVAMENTE con il JSON valido (senza markdown o altro testo).`;

  try {
    const replyText = await callGeminiFetch(prompt);
    const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const merged = {
      ...currentTrade,
      ...parsed,
      id: currentTrade.id
    };

    return calculateTradeOutcome(instruction, merged);
  } catch (err) {
    console.error("Failed to parse trade edit with Assistant AI:", err);
    return calculateTradeOutcome(instruction, currentTrade);
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
  const isEn = lang === 'EN' || isEnglishText(userText);
  const explicitCategory = detectIntentCategory(userText);

  if (explicitCategory === 'chat') {
    const chatPrompt = `Sei l'AI Assistant personale di Ivan.
L'utente Ivan ti ha inviato un messaggio di saluto o una domanda generale: "${userText}"

Stato attuale dell'utente Ivan:
- Pasti loggati oggi: ${currentLogs.food?.length || 0}
- Allenamenti: ${currentLogs.training?.length || 0}
- Posizioni Trading: ${currentLogs.trading?.length || 0}

Rispondi in modo cordiale, sintetico ed utile in ${isEn ? 'ENGLISH' : 'ITALIANO'}. NON registrare nessun log se si tratta di un saluto o di una domanda generale.

Schema JSON:
{
  "type": "chat",
  "category": "chat",
  "message": "${isEn ? "👋 Hello Ivan! How can I assist you today?" : "👋 Ciao Ivan! Come posso aiutarti oggi?"}"
}`;

    try {
      const replyText = await callGeminiFetch(chatPrompt);
      const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        type: 'chat',
        category: 'chat',
        message: parsed.message || replyText
      };
    } catch (err) {
      return {
        type: 'chat',
        category: 'chat',
        message: isEn 
          ? `👋 **Hello Ivan!** I'm your AI Personal Assistant. How can I help you today with your Meals, Training, or Trading?`
          : `👋 **Ciao Ivan!** Sono il tuo Assistente AI personale. Come posso aiutarti oggi su Nutrizione, Allenamento o Trading?`
      };
    }
  }

  const langInstruction = isEn
    ? 'IMPORTANT: Respond strictly in ENGLISH for all text messages, headings, and explanations.'
    : 'IMPORTANTE: Rispondi rigorosamente in ITALIANO per tutti i messaggi di testo, intestazioni e spiegazioni.';

  const detectedType = detectMealType(userText, timestamp);

  const prompt = `Sei l'AI Assistant personale di Ivan per Nutrizione (Food), Allenamento (Training), Trading e Archivio Storico.
${langInstruction}

Analizza la richiesta dell'utente Ivan e restituisci UNICAMENTE un oggetto JSON valido.

SE È TRADING (Trading/Futures/Indices/Crypto/Stock):
Se l'utente specifica "full tp", "preso tp" o "stoppato in sl", calcola la percentuale di guadagno/perdita, imposta status: "CHIUSO" ed il PnL (% o $).
{
  "category": "trading",
  "type": "log_entry",
  "log": {
    "ticker": "NQ1!" | "ES1!" | "BTC/USDT" | "NVDA",
    "type": "BUY" | "SELL",
    "entryPrice": 19500,
    "takeProfit": 19800,
    "stopLoss": 19400,
    "size": "1 Contratto",
    "status": "APERTO" | "CHIUSO",
    "notes": "note",
    "pnl": "+1.5%"
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
    const ticker = extractTickerSymbol(userText, rawLog.ticker);
    const priceMatch = userText.match(/(\d{4,6})/);

    const entryPrice = Number(rawLog.entryPrice || rawLog.entry_price || (priceMatch ? parseInt(priceMatch[1], 10) : 19500));
    const type = rawLog.type || (userText.toLowerCase().includes('sell') || userText.toLowerCase().includes('short') ? 'SELL' : 'BUY');

    let initialTrade = {
      id: 'tr_' + Date.now(),
      timestamp,
      ticker,
      type,
      entryPrice,
      takeProfit: Number(rawLog.takeProfit || rawLog.take_profit || (type === 'BUY' ? Math.round(entryPrice * 1.02) : Math.round(entryPrice * 0.98))),
      stopLoss: Number(rawLog.stopLoss || rawLog.stop_loss || (type === 'BUY' ? Math.round(entryPrice * 0.99) : Math.round(entryPrice * 1.01))),
      size: rawLog.size || '1 Contratto',
      status: rawLog.status || 'APERTO',
      notes: rawLog.notes || userText,
      pnl: rawLog.pnl || '0.0%'
    };

    finalLog = calculateTradeOutcome(userText, initialTrade);

    message = isEn
      ? `✅ **Trade logged!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${finalLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${finalLog.stopLoss.toLocaleString()}\n📊 **Status**: ${finalLog.status} (${finalLog.pnl})`
      : `✅ **Trade registrato!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${finalLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${finalLog.stopLoss.toLocaleString()}\n📊 **Stato**: ${finalLog.status} (${finalLog.pnl})`;
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

function fallbackLocalParser(text, timestamp, lang = 'IT', currentLogs = { food: [], training: [], trading: [] }) {
  const isEn = lang === 'EN' || isEnglishText(text);
  const category = detectIntentCategory(text);

  if (category === 'chat') {
    return {
      type: 'chat',
      category: 'chat',
      message: isEn
        ? `👋 **Hello Ivan!** I'm your AI Personal Assistant. How can I help you today with your Meals, Training, or Trading?`
        : `👋 **Ciao Ivan!** Sono il tuo Assistente AI personale. Come posso aiutarti oggi su Nutrizione, Allenamento o Trading?`
    };
  }

  if (category === 'trading') {
    const ticker = extractTickerSymbol(text, null);
    const priceMatch = text.match(/(\d{4,6})/);

    const entryPrice = priceMatch ? parseInt(priceMatch[1], 10) : (ticker.includes('NQ') ? 19500 : 62500);
    const type = text.toLowerCase().includes('sell') || text.toLowerCase().includes('short') ? 'SELL' : 'BUY';

    let initialTrade = {
      id: 'tr_' + Date.now(),
      timestamp,
      ticker,
      type,
      entryPrice,
      takeProfit: type === 'BUY' ? Math.round(entryPrice * 1.02) : Math.round(entryPrice * 0.98),
      stopLoss: type === 'BUY' ? Math.round(entryPrice * 0.99) : Math.round(entryPrice * 1.01),
      size: '1 Contratto',
      status: 'APERTO',
      notes: text,
      pnl: '0.0%'
    };

    const tradeLog = calculateTradeOutcome(text, initialTrade);

    return {
      type: 'log_entry',
      category: 'trading',
      log: tradeLog,
      message: isEn 
        ? `✅ **Trade logged!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${tradeLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${tradeLog.stopLoss.toLocaleString()}\n📊 **Status**: ${tradeLog.status} (${tradeLog.pnl})`
        : `✅ **Trade registrato!**\n\n📈 **Asset**: ${ticker} (${type})\n💵 **Entry**: $${entryPrice.toLocaleString()}\n🎯 **TP**: $${tradeLog.takeProfit.toLocaleString()} | 🛑 **SL**: $${tradeLog.stopLoss.toLocaleString()}\n📊 **Stato**: ${tradeLog.status} (${tradeLog.pnl})`
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
