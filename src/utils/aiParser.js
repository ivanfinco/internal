/**
 * Assistant AI Powered Parser for Ivan's Personal Dashboard
 * Supports Multilingual Response Generation, Ingredient Provenance Breakdown, & Natural Language Edits
 */

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_GEMINI_API_KEY : '');

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
    console.warn("Assistant API call failed, using fallback:", err);
  }

  return fallbackLocalParser(text, timestamp, lang);
}

/**
 * Direct function to parse natural language Trade Editing instructions with Assistant AI
 */
export async function parseTradeEditInstruction(instruction, currentTrade, lang = 'IT') {
  if (!GEMINI_API_KEY) return null;

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) return null;

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

/**
 * Direct function to parse natural language Food Meal Editing instructions with Assistant AI
 */
export async function parseFoodEditInstruction(instruction, currentFoodLog, lang = 'IT') {
  if (!GEMINI_API_KEY) return null;

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) return null;

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
  if (!GEMINI_API_KEY) return null;

  const langInstruction = lang === 'EN'
    ? 'IMPORTANT: Respond strictly in ENGLISH for all text messages, headings, and explanations.'
    : 'IMPORTANTE: Rispondi rigorosamente in ITALIANO per tutti i messaggi di testo, intestazioni e spiegazioni.';

  const prompt = `Sei l'AI Assistant personale di Ivan per Nutrizione (Food), Allenamento (Training), Trading e Archivio Storico.
${langInstruction}

Analizza la richiesta dell'utente Ivan e restituisci UNICAMENTE un oggetto JSON valido (senza tag o markdown al di fuori del JSON).

SE È CIBO (Food):
Calcola in modo ESTREMAMENTE ACCURATO e SCIENTIFICO (basato su banche dati nutrizionali ufficiali USDA/INRAN) le calorie, i macronutrienti ed i 8 micronutrienti essenziali:
- vitaminA (mcg)
- vitaminC (mg)
- vitaminD (mcg)
- iron (mg)
- calcium (mg)
- zinc (mg)
- magnesium (mg)
- potassium (mg)

Fornisci ANCHE la scomposizione esatta per ciascun ingrediente citato nel pasto (es. "Pasta 100g", "Grana 20g", "Petto di pollo 200g").

Schema JSON Cibo:
{
  "category": "food",
  "type": "log_entry",
  "log": {
    "mealType": "${lang === 'EN' ? 'Breakfast' : 'Colazione'}" | "${lang === 'EN' ? 'Lunch' : 'Pranzo'}" | "${lang === 'EN' ? 'Dinner' : 'Cena'}" | "${lang === 'EN' ? 'Snack' : 'Spuntino'}",
    "description": "descrizione",
    "calories": 460,
    "protein": 64,
    "fats": 8,
    "carbs": 28,
    "micros": {
      "vitaminA": 120, "vitaminC": 30, "vitaminD": 2, "iron": 3.5, "calcium": 150, "zinc": 2.5, "magnesium": 65, "potassium": 500
    },
    "ingredientsBreakdown": [
      {
        "name": "Ingredient Name (Weight)",
        "calories": 300,
        "protein": 30,
        "fats": 5,
        "carbs": 40,
        "micros": { "vitaminA": 100, "vitaminC": 20, "vitaminD": 0, "iron": 2, "calcium": 80, "zinc": 1.5, "magnesium": 40, "potassium": 300 }
      }
    ]
  },
  "message": "${lang === 'EN' ? '✅ **Food logged with Assistant AI!**' : '✅ **Cibo registrato con Assistant AI!**'}\\n\\n..."
}

SE È ALLENAMENTO (Training):
{
  "category": "training",
  "type": "log_entry",
  "log": {
    "title": "Titolo Sessione",
    "feeling": "🔥 In gran forma" | "⚡ Molto Carico" | "😴 Affaticato",
    "energyLevel": "9/10",
    "exercises": [
      { "name": "Squat", "sets": 4, "reps": 8, "weight": 110, "note": "..." }
    ],
    "notes": "note"
  },
  "message": "..."
}

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
    "status": "APERTO",
    "notes": "...",
    "pnl": "0.0%"
  },
  "message": "..."
}

SE È UNA DOMANDA SUL PASSATO O RIGUARDA GLI STORICI:
Ecco lo storico attuale per riferimento:
Food logs attuali: ${JSON.stringify(currentLogs.food.slice(0, 3))}
Training logs attuali: ${JSON.stringify(currentLogs.training.slice(0, 3))}
Trading logs attuali: ${JSON.stringify(currentLogs.trading.slice(0, 3))}

Schema JSON Domanda:
{
  "type": "query_response",
  "message": "Risposta amichevole e dettagliata nella lingua richiesta (${lang === 'EN' ? 'ENGLISH' : 'ITALIANO'})."
}

Richiesta dell'utente Ivan: "${userText}"`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`Assistant API HTTP Error ${response.status}`);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) return null;

  const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  if (parsed.log) {
    parsed.log.id = (parsed.category === 'food' ? 'f_' : parsed.category === 'training' ? 't_' : 'tr_') + Date.now();
    parsed.log.timestamp = timestamp;
  }

  return parsed;
}

function fallbackLocalParser(text, timestamp, lang = 'IT') {
  const isEn = lang === 'EN';
  return {
    type: 'log_entry',
    category: 'food',
    log: {
      id: 'f_' + Date.now(),
      timestamp,
      mealType: isEn ? 'Lunch' : 'Pranzo',
      description: text,
      calories: 450,
      protein: 30,
      fats: 12,
      carbs: 45,
      micros: { vitaminA: 150, vitaminC: 25, vitaminD: 2, iron: 2.5, calcium: 120, zinc: 1.8, magnesium: 45, potassium: 320 },
      ingredientsBreakdown: [
        {
          name: text,
          calories: 450,
          protein: 30,
          fats: 12,
          carbs: 45,
          micros: { vitaminA: 150, vitaminC: 25, vitaminD: 2, iron: 2.5, calcium: 120, zinc: 1.8, magnesium: 45, potassium: 320 }
        }
      ]
    },
    message: isEn 
      ? `✅ **Food logged!**\n\n📝 **Description**: ${text}\n🔥 **Calories**: 450 kcal | 🥩 **Protein**: 30g | 🥑 **Fats**: 12g | 🍞 **Carbs**: 45g`
      : `✅ **Pasto registrato!**\n\n📝 **Descrizione**: ${text}\n🔥 **Calorie**: 450 kcal | 🥩 **Proteine**: 30g | 🥑 **Grassi**: 12g | 🍞 **Carbo**: 45g`
  };
}
