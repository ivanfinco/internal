export const DEFAULT_TARGETS = {
  calories: 2500,
  protein: 180,
  fats: 70,
  carbs: 280,
  micros: {
    vitaminA: 900,  // mcg
    vitaminC: 90,   // mg
    vitaminD: 20,   // mcg
    iron: 14,       // mg
    calcium: 1000,  // mg
    zinc: 11,       // mg
    magnesium: 400, // mg
    potassium: 3500 // mg
  }
};

export const INITIAL_FOOD_LOGS = [
  {
    id: 'f1',
    timestamp: '2026-09-14 08:30',
    mealType: 'Colazione',
    description: '3 uova intere strapazzate con 2 fette di pane di segale e 100g yogurt greco',
    calories: 475,
    protein: 36,
    fats: 17,
    carbs: 43,
    micros: {
      vitaminA: 490,
      vitaminC: 0,
      vitaminD: 6,
      iron: 4.8,
      calcium: 278,
      zinc: 4.5,
      magnesium: 79,
      potassium: 555
    },
    ingredientsBreakdown: [
      {
        name: "3 Uova Intere (150g)",
        calories: 215,
        protein: 18.0,
        fats: 14.5,
        carbs: 1.1,
        micros: { vitaminA: 400, vitaminC: 0, vitaminD: 5.5, iron: 2.7, calcium: 75, zinc: 1.9, magnesium: 18, potassium: 200 }
      },
      {
        name: "Pane di Segale (60g - 2 fette)",
        calories: 150,
        protein: 5.0,
        fats: 1.0,
        carbs: 30.0,
        micros: { vitaminA: 0, vitaminC: 0, vitaminD: 0, iron: 1.6, calcium: 24, zinc: 1.8, magnesium: 40, potassium: 215 }
      },
      {
        name: "Yogurt Greco 0% (100g)",
        calories: 110,
        protein: 13.0,
        fats: 1.5,
        carbs: 11.9,
        micros: { vitaminA: 90, vitaminC: 0, vitaminD: 0.5, iron: 0.5, calcium: 179, zinc: 0.8, magnesium: 21, potassium: 140 }
      }
    ]
  },
  {
    id: 'f2',
    timestamp: '2026-09-14 12:45',
    mealType: 'Pranzo',
    description: '200g petto di pollo ai ferri, 120g riso basmati, 150g broccoli a vapore con 15g olio evo',
    calories: 933,
    protein: 75,
    fats: 23,
    carbs: 104,
    micros: {
      vitaminA: 994,
      vitaminC: 133,
      vitaminD: 0,
      iron: 3.8,
      calcium: 115,
      zinc: 4.4,
      magnesium: 130,
      potassium: 1118
    },
    ingredientsBreakdown: [
      {
        name: "Petto di Pollo (200g)",
        calories: 330,
        protein: 62.0,
        fats: 7.2,
        carbs: 0.0,
        micros: { vitaminA: 60, vitaminC: 0, vitaminD: 0, iron: 2.0, calcium: 28, zinc: 2.6, magnesium: 56, potassium: 678 }
      },
      {
        name: "Riso Basmati crudo (120g)",
        calories: 420,
        protein: 8.5,
        fats: 1.0,
        carbs: 94.0,
        micros: { vitaminA: 0, vitaminC: 0, vitaminD: 0, iron: 0.8, calcium: 15, zinc: 1.2, magnesium: 42, potassium: 56 }
      },
      {
        name: "Broccoli a vapore (150g)",
        calories: 51,
        protein: 4.2,
        fats: 0.6,
        carbs: 10.0,
        micros: { vitaminA: 934, vitaminC: 133, vitaminD: 0, iron: 1.0, calcium: 72, zinc: 0.6, magnesium: 32, potassium: 384 }
      },
      {
        name: "Olio Extravergine d'Oliva (15g)",
        calories: 132,
        protein: 0.0,
        fats: 14.2,
        carbs: 0.0,
        micros: { vitaminA: 0, vitaminC: 0, vitaminD: 0, iron: 0.0, calcium: 0, zinc: 0.0, magnesium: 0, potassium: 0 }
      }
    ]
  },
  {
    id: 'f3',
    timestamp: '2026-09-13 20:15',
    mealType: 'Cena',
    description: '200g filetto di salmone, 200g patate, 150g insalata mista con 10g olio evo',
    calories: 690,
    protein: 48,
    fats: 34,
    carbs: 42,
    micros: {
      vitaminA: 400,
      vitaminC: 45,
      vitaminD: 22,
      iron: 3.5,
      calcium: 120,
      zinc: 2.5,
      magnesium: 95,
      potassium: 1120
    },
    ingredientsBreakdown: [
      {
        name: "Filetto di Salmone fresco (200g)",
        calories: 416,
        protein: 40.0,
        fats: 26.0,
        carbs: 0.0,
        micros: { vitaminA: 100, vitaminC: 0, vitaminD: 22, iron: 1.6, calcium: 24, zinc: 1.2, magnesium: 54, potassium: 720 }
      },
      {
        name: "Patate lesse (200g)",
        calories: 174,
        protein: 4.0,
        fats: 0.2,
        carbs: 40.0,
        micros: { vitaminA: 0, vitaminC: 39, vitaminD: 0, iron: 1.6, calcium: 24, zinc: 0.7, magnesium: 36, potassium: 850 }
      },
      {
        name: "Insalata Mista (150g)",
        calories: 22,
        protein: 2.0,
        fats: 0.3,
        carbs: 3.2,
        micros: { vitaminA: 300, vitaminC: 6, vitaminD: 0, iron: 1.3, calcium: 54, zinc: 0.4, magnesium: 19, potassium: 280 }
      },
      {
        name: "Olio Extravergine d'Oliva (10g)",
        calories: 88,
        protein: 0.0,
        fats: 9.5,
        carbs: 0.0,
        micros: { vitaminA: 0, vitaminC: 0, vitaminD: 0, iron: 0.0, calcium: 0, zinc: 0.0, magnesium: 0, potassium: 0 }
      }
    ]
  }
];

export const INITIAL_TRAINING_LOGS = [
  {
    id: 't1',
    timestamp: '2026-09-14 10:30',
    title: 'Workout Gambe & Addome',
    exercises: [
      { name: 'Squat con bilanciere', sets: 4, reps: 8, weight: 110, note: 'Ottima profondità' },
      { name: 'Leg Press 45°', sets: 3, reps: 10, weight: 220, note: 'Focus contrazione' },
      { name: 'Rumeno Stacco', sets: 3, reps: 10, weight: 90, note: 'Stretching femorali' },
      { name: 'Plank ponderato', sets: 3, reps: 60, weight: 15, note: 'Sec ciascuno' }
    ],
    feeling: '🔥 In gran forma',
    energyLevel: '9/10',
    notes: 'Sensazione di carica enorme dopo il riscaldamento, carichi in aumento sul bilanciere.'
  },
  {
    id: 't2',
    timestamp: '2026-09-12 17:00',
    title: 'Workout Petto & Spalle',
    exercises: [
      { name: 'Panca piana bilanciere', sets: 4, reps: 8, weight: 85, note: 'Fermo al petto pulito' },
      { name: 'Spinte manubri panca inclinata', sets: 3, reps: 10, weight: 30, note: 'Controllo eccentrica' },
      { name: 'Military Press bilanciere', sets: 4, reps: 8, weight: 55, note: 'Focus core rigido' },
      { name: 'Alzate laterali ai cavi', sets: 4, reps: 12, weight: 12, note: 'Isolamento deltoide' }
    ],
    feeling: '⚡ Molto Carico',
    energyLevel: '8/10',
    notes: 'Ottima risposta nei tricipiti e spalle, fermo al petto solido.'
  }
];

export const INITIAL_TRADING_LOGS = [
  {
    id: 'tr1',
    timestamp: '2026-09-14 11:15',
    ticker: 'BTC/USDT',
    type: 'BUY',
    entryPrice: 62450,
    takeProfit: 66500,
    stopLoss: 60800,
    size: '0.5 BTC',
    status: 'APERTO',
    notes: 'Breakout di struttura su time-frame 4H con volumi sostenuti sopra la media mobile 50 giorni.',
    pnl: '+2.8%'
  },
  {
    id: 'tr2',
    timestamp: '2026-09-13 15:40',
    ticker: 'ETH/USDT',
    type: 'BUY',
    entryPrice: 2420,
    takeProfit: 2650,
    stopLoss: 2340,
    size: '5 ETH',
    status: 'CHIUSO',
    notes: 'Retest riuscito del supporto settimanale. Chiuso in target a $2,650.',
    pnl: '+9.5%'
  },
  {
    id: 'tr3',
    timestamp: '2026-09-11 19:20',
    ticker: 'NVDA',
    type: 'BUY',
    entryPrice: 118,
    takeProfit: 132,
    stopLoss: 112,
    size: '40 Azioni',
    status: 'CHIUSO',
    notes: 'Inversione bullish dopo dati utili trimestre.',
    pnl: '+11.8%'
  }
];
