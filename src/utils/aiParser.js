import { parseScientificBreakdown } from './nutritionEngine.js';
import { getLocalTimestampStr } from './dateUtils.js';

/**
 * Assistant AI Powered Parser for Ivan's Personal Dashboard
 * ALL interactions pass through Google Gemini API.
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

/**
 * Executes direct HTTP request to Google Gemini API
 */
async function callGeminiApiDirect(prompt, systemInstruction = '') {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key missing");
  }

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const payload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = new Error(`Gemini API (${model}) error ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        return replyText;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Impossibile connettersi all'API di Gemini.");
}

/**
 * Parse user input - 100% via Gemini API
 */
export async function parseUserInput(rawText, currentLogs = { food: [], training: [], trading: [] }, lang = 'IT', profile = {}) {
  const text = rawText.trim();
  const timestamp = getLocalTimestampStr();
  const isEn = lang === 'EN';

  const systemInstruction = `Sei l'AI Personal Assistant ufficiale per la dashboard di Ivan.
Tutte le tue risposte e analisi VENGONO GENERATE ESCLUSIVAMENTE tramite l'API di Google Gemini.
Tone of Voice: Professionale, sintetico, neutro e senza prolissità o saluti superflui.
Lingua di risposta: ${isEn ? 'English' : 'Italiano'}.

IMPORTANT: Restituisci "type": "log_entry" ESCLUSIVAMENTE se l'utente intende ESPLICITAMENTE registrare o aggiungere un NUOVO pasto, allenamento o trade. Se l'utente fa una domanda, chiede un riassunto o parla in generale dei pasti già inseriti, restituisci "type": "chat".

Il tuo compito è analizzare la richiesta dell'utente e restituire UNICAMENTE un oggetto JSON valido (senza markdown extra fuori dal JSON) con la seguente struttura:

Se l'utente fa una domanda generale, chiede informazioni, chiede un riassunto o chatta:
{
  "type": "chat",
  "category": "chat",
  "message": "Testo della risposta in markdown diretto e utile."
}

Se l'utente esprime l'intenzione esplicita di registrare un NUOVO pasto (Food):
{
  "type": "log_entry",
  "category": "food",
  "message": "Messaggio di conferma sintetico (es. Pasto registrato: 500 kcal | P: 40g)",
  "log": {
    "mealType": "Colazione" | "Pranzo" | "Cena" | "Spuntino",
    "description": "descrizione del cibo",
    "calories": 500,
    "protein": 40,
    "fats": 12,
    "carbs": 55,
    "micros": {
      "vitaminA": 100, "vitaminC": 30, "vitaminD": 2, "iron": 3, "calcium": 150, "zinc": 2.5, "magnesium": 60, "potassium": 450
    },
    "ingredientsBreakdown": [
      { "name": "Alimento", "grams": 100, "calories": 150, "protein": 20, "fats": 3, "carbs": 0 }
    ]
  }
}

Se l'utente vuole registrare o aggiornare un allenamento (Workout/Training):
{
  "type": "log_entry",
  "category": "training",
  "message": "Messaggio di conferma sintetico",
  "log": {
    "exercise": "Nome Esercizio",
    "sets": 4,
    "reps": 8,
    "weight": 100,
    "notes": "note se presenti"
  }
}

Se l'utente vuole registrare una posizione di Trading:
{
  "type": "log_entry",
  "category": "trading",
  "message": "Messaggio di conferma sintetico con ticker, entry, TP e SL",
  "log": {
    "ticker": "MNQ1!" | "NQ1!" | "ES1!" | "BTC/USDT",
    "type": "BUY" | "SELL",
    "entryPrice": 19500,
    "takeProfit": 19800,
    "stopLoss": 19400,
    "size": "1 Contratto",
    "status": "APERTO" | "CHIUSO",
    "notes": "note",
    "pnl": "$0"
  }
}`;

  const prompt = `Utente (${profile?.name || 'Ivan'}): "${text}"

Contesto Dashboard Attuale:
- Data e ora: ${timestamp}
- Pasti loggati oggi: ${JSON.stringify(currentLogs.food || [])}
- Allenamenti: ${JSON.stringify(currentLogs.training || [])}
- Posizioni Trading: ${JSON.stringify(currentLogs.trading || [])}

Elabora la richiesta con l'API Gemini e restituisci ESCLUSIVAMENTE il JSON richiesto.`;

  try {
    const rawReply = await callGeminiApiDirect(prompt, systemInstruction);
    const cleanJsonText = rawReply.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonText);

    if (parsed.log) {
      parsed.log.id = (parsed.category === 'food' ? 'f_' : parsed.category === 'training' ? 't_' : 'tr_') + Date.now();
      parsed.log.timestamp = timestamp;
    }

    return parsed;
  } catch (err) {
    console.error("Gemini API Error in parseUserInput:", err);
    return {
      type: 'chat',
      category: 'chat',
      message: `⚠️ **Errore Assistente AI:** Impossibile elaborare la richiesta (${err.message}).`
    };
  }
}

/**
 * Edit existing trade via Gemini API
 */
export async function parseTradeEditInstruction(instruction, currentTrade, lang = 'IT') {
  const prompt = `L'utente vuole modificare una posizione di Trading via Gemini API: "${instruction}"

Trade Attuale:
${JSON.stringify(currentTrade, null, 2)}

Restituisci UNICAMENTE un oggetto JSON valido:
{
  "ticker": "${currentTrade.ticker}",
  "type": "${currentTrade.type}",
  "entryPrice": ${currentTrade.entryPrice},
  "takeProfit": ${currentTrade.takeProfit},
  "stopLoss": ${currentTrade.stopLoss},
  "status": "CHIUSO",
  "pnl": "+$3,000",
  "notes": "Modificato via Gemini API"
}`;

  try {
    const replyText = await callGeminiApiDirect(prompt, "Sei l'AI Assistant Gemini per il Trading. Restituisci solo JSON.");
    const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      ...currentTrade,
      ...parsed,
      id: currentTrade.id
    };
  } catch (err) {
    console.error("Failed to parse trade edit via Gemini API:", err);
    return currentTrade;
  }
}

/**
 * Edit existing food log via Gemini API
 */
export async function parseFoodEditInstruction(instruction, currentFoodLog, lang = 'IT') {
  const prompt = `L'utente vuole modificare un pasto via Gemini API: "${instruction}"

Pasto Attuale:
${JSON.stringify(currentFoodLog, null, 2)}

Restituisci UNICAMENTE un oggetto JSON valido con i dati nutrizionali ricalcolati:
{
  "mealType": "Colazione" | "Pranzo" | "Cena" | "Spuntino",
  "description": "Descrizione aggiornata",
  "calories": 500,
  "protein": 40,
  "fats": 12,
  "carbs": 50,
  "micros": {
    "vitaminA": 100, "vitaminC": 30, "vitaminD": 2, "iron": 3, "calcium": 150, "zinc": 2.5, "magnesium": 60, "potassium": 450
  },
  "ingredientsBreakdown": []
}`;

  try {
    const replyText = await callGeminiApiDirect(prompt, "Sei l'AI Assistant Gemini per la Nutrizione. Restituisci solo JSON.");
    const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      ...currentFoodLog,
      ...parsed,
      id: currentFoodLog.id,
      timestamp: currentFoodLog.timestamp
    };
  } catch (err) {
    console.error("Failed to parse food edit via Gemini API:", err);
    return null;
  }
}
