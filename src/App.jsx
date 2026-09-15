import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import AiHomeScreen from './components/AiHomeScreen';
import CalendarView from './components/CalendarView';
import FoodView from './components/FoodView';
import TrainingView from './components/TrainingView';
import TradingView from './components/TradingView';
import FinanceView from './components/FinanceView';
import ProfileModal from './components/ProfileModal';
import DatabaseStatusModal from './components/DatabaseStatusModal';
import { parseScientificBreakdown } from './utils/nutritionEngine';
import {
  fetchUserProfile,
  saveUserProfile as saveSupabaseProfile,
  fetchFoodLogs,
  addFoodLog as addSupabaseFoodLog,
  updateFoodLog as updateSupabaseFoodLog,
  deleteFoodLog as deleteSupabaseFoodLog,
  fetchTrainingLogs,
  addTrainingLog as addSupabaseTrainingLog,
  deleteTrainingLog as deleteSupabaseTrainingLog,
  fetchTradingLogs,
  addTradingLog as addSupabaseTradingLog,
  updateTradingLog as updateSupabaseTradingLog,
  deleteTradingLog as deleteSupabaseTradingLog,
  subscribeToRealtimeChanges
} from './services/supabaseDb';

import { getLocalDateStr, migrateLegacySeedTimestamp } from './utils/dateUtils';
import { 
  DEFAULT_TARGETS, 
  INITIAL_FOOD_LOGS, 
  INITIAL_TRAINING_LOGS, 
  INITIAL_TRADING_LOGS 
} from './constants/initialData';

function sanitizeFoodLogMealType(log) {
  if (!log) return null;

  // Clean up any previously generated phantom/dummy pasto entries
  if (log.description === 'Pasto' && Number(log.calories) === 400 && Number(log.protein) === 30 && Number(log.fats) === 10 && Number(log.carbs) === 45) {
    return null;
  }

  const desc = (log.description || '').toLowerCase();
  let mealType = log.mealType || 'Pranzo';

  if (desc.includes('pranzo')) mealType = 'Pranzo';
  else if (desc.includes('cena')) mealType = 'Cena';
  else if (desc.includes('colazione')) mealType = 'Colazione';
  else if (desc.includes('spuntino') || desc.includes('merenda')) mealType = 'Spuntino';

  return {
    ...log,
    timestamp: migrateLegacySeedTimestamp(log.timestamp),
    mealType,
    calories: Math.round(Number(log.calories) || 0),
    protein: Math.round((Number(log.protein) || 0) * 10) / 10,
    fats: Math.round((Number(log.fats) || 0) * 10) / 10,
    carbs: Math.round((Number(log.carbs) || 0) * 10) / 10
  };
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_dashboard_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_theme');
      return saved ? saved === 'dark' : true;
    } catch (e) {
      return true;
    }
  });

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('ivan_lang') || 'IT';
    } catch (e) {
      return 'IT';
    }
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  // Persistent AI Chat History State across Tab Switch & Storage
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    return [
      {
        id: 'welcome',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        message: lang === 'EN'
          ? `👋 **Hello Ivan! I'm your AI Personal Assistant.**`
          : `👋 **Ciao Ivan! Sono il tuo Assistente AI personale.**`
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ivan_chat_history', JSON.stringify(chatHistory));
    } catch (e) {}
  }, [chatHistory]);

  // User Personal Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      name: 'Ivan',
      avatar: '⚡',
      dob: '1995-06-15',
      age: 31,
      height: 180,
      weight: 80,
      targets: DEFAULT_TARGETS
    };
  });

  const [activeTab, setActiveTab] = useState('ai');

  const [foodLogs, setFoodLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_food_logs');
      if (saved) {
        const logs = JSON.parse(saved);
        if (Array.isArray(logs) && logs.length > 0) {
          return logs.filter(Boolean).map(item => {
            const sanitized = sanitizeFoodLogMealType(item);
            if (!sanitized) return null;
            return {
              ...sanitized,
              ingredientsBreakdown: parseScientificBreakdown(sanitized.description, sanitized.calories, sanitized.protein, sanitized.fats, sanitized.carbs, sanitized.micros || {})
            };
          }).filter(Boolean);
        }
      }
    } catch (e) {}

    return INITIAL_FOOD_LOGS.map(sanitizeFoodLogMealType).filter(Boolean);
  });

  const [trainingLogs, setTrainingLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_training_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            timestamp: migrateLegacySeedTimestamp(item?.timestamp)
          }));
        }
      }
    } catch (e) {}

    return INITIAL_TRAINING_LOGS.map(item => ({
      ...item,
      timestamp: migrateLegacySeedTimestamp(item?.timestamp)
    }));
  });

  const [tradingLogs, setTradingLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('ivan_trading_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            timestamp: migrateLegacySeedTimestamp(item?.timestamp)
          }));
        }
      }
    } catch (e) {}

    return INITIAL_TRADING_LOGS.map(item => ({
      ...item,
      timestamp: migrateLegacySeedTimestamp(item?.timestamp)
    }));
  });

  // Load from Supabase on initial mount
  useEffect(() => {
    async function loadData() {
      try {
        const [prof, food, train, trade] = await Promise.all([
          fetchUserProfile(),
          fetchFoodLogs(),
          fetchTrainingLogs(),
          fetchTradingLogs()
        ]);

        if (prof) setProfile(prof);

        if (food && Array.isArray(food) && food.length > 0) {
          const sanitizedFood = food.filter(Boolean).map(item => {
            const sanitized = sanitizeFoodLogMealType(item);
            if (!sanitized) return null;
            return {
              ...sanitized,
              ingredientsBreakdown: parseScientificBreakdown(sanitized.description, sanitized.calories, sanitized.protein, sanitized.fats, sanitized.carbs, sanitized.micros || {})
            };
          }).filter(Boolean);
          setFoodLogs(sanitizedFood);
        }

        if (train && Array.isArray(train) && train.length > 0) {
          setTrainingLogs(train.map(item => ({
            ...item,
            timestamp: migrateLegacySeedTimestamp(item?.timestamp)
          })));
        }
        if (trade && Array.isArray(trade) && trade.length > 0) {
          setTradingLogs(trade.map(item => ({
            ...item,
            timestamp: migrateLegacySeedTimestamp(item?.timestamp)
          })));
        }
      } catch (err) {
        console.warn("Supabase initial load notice (fallback to local state):", err.message);
      }
    }

    loadData();

    const unsubscribe = subscribeToRealtimeChanges((payload) => {
      console.log('Supabase Realtime update received:', payload);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save state to localStorage as fallback
  useEffect(() => {
    try {
      localStorage.setItem('ivan_theme', darkMode ? 'dark' : 'light');
    } catch (e) {}

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('ivan_lang', lang);
    } catch (e) {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('ivan_user_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('ivan_food_logs', JSON.stringify(foodLogs));
    } catch (e) {}
  }, [foodLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('ivan_training_logs', JSON.stringify(trainingLogs));
    } catch (e) {}
  }, [trainingLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('ivan_trading_logs', JSON.stringify(tradingLogs));
    } catch (e) {}
  }, [tradingLogs]);

  // Handlers
  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    saveSupabaseProfile(newProfile);
  };

  const handleAddLog = (category, newLog) => {
    if (!newLog) return;
    if (category === 'food') {
      const sanitized = sanitizeFoodLogMealType(newLog);
      if (!sanitized) return;
      const withBreakdown = {
        ...sanitized,
        ingredientsBreakdown: parseScientificBreakdown(sanitized.description, sanitized.calories, sanitized.protein, sanitized.fats, sanitized.carbs, sanitized.micros || {})
      };
      setFoodLogs(prev => [withBreakdown, ...(prev || [])]);
      addSupabaseFoodLog(withBreakdown);
    } else if (category === 'training') {
      setTrainingLogs(prev => [newLog, ...(prev || [])]);
      addSupabaseTrainingLog(newLog);
    } else if (category === 'trading') {
      setTradingLogs(prev => [newLog, ...(prev || [])]);
      addSupabaseTradingLog(newLog);
    }
  };

  const handleDeleteFoodLog = (id) => {
    setFoodLogs(prev => (prev || []).filter(log => log && log.id !== id));
    deleteSupabaseFoodLog(id);
  };

  const handleUpdateFoodLog = (updatedLog) => {
    const sanitized = sanitizeFoodLogMealType(updatedLog);
    if (!sanitized) return;
    const withBreakdown = {
      ...sanitized,
      ingredientsBreakdown: parseScientificBreakdown(sanitized.description, sanitized.calories, sanitized.protein, sanitized.fats, sanitized.carbs, sanitized.micros || {})
    };

    setFoodLogs(prev => (prev || []).map(log => log && log.id === sanitized.id ? withBreakdown : log));
    updateSupabaseFoodLog(withBreakdown);
  };

  const handleDeleteTrainingLog = (id) => {
    setTrainingLogs(prev => (prev || []).filter(log => log && log.id !== id));
    deleteSupabaseTrainingLog(id);
  };

  const handleDeleteTradingLog = (id) => {
    setTradingLogs(prev => (prev || []).filter(log => log && log.id !== id));
    deleteSupabaseTradingLog(id);
  };

  const handleUpdateTradingLog = (updatedLog) => {
    setTradingLogs(prev => (prev || []).map(log => log && log.id === updatedLog.id ? updatedLog : log));
    updateSupabaseTradingLog(updatedLog);
  };

  // Macro Totals for Today with strict 1-decimal rounding (Fix JS floating point precision zeros)
  const todayStr = getLocalDateStr();
  const safeFoodLogs = Array.isArray(foodLogs) ? foodLogs.filter(Boolean) : [];
  const safeTrainingLogs = Array.isArray(trainingLogs) ? trainingLogs.filter(Boolean) : [];
  const safeTradingLogs = Array.isArray(tradingLogs) ? tradingLogs.filter(Boolean) : [];

  const todayFoodLogs = safeFoodLogs.filter(log => log && log.timestamp && log.timestamp.startsWith(todayStr));

  const rawMacroTotals = todayFoodLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + (Number(log.calories) || 0),
      protein: acc.protein + (Number(log.protein) || 0),
      fats: acc.fats + (Number(log.fats) || 0),
      carbs: acc.carbs + (Number(log.carbs) || 0)
    }),
    { calories: 0, protein: 0, fats: 0, carbs: 0 }
  );

  const macroTotals = {
    calories: Math.round(rawMacroTotals.calories),
    protein: Math.round(rawMacroTotals.protein * 10) / 10,
    fats: Math.round(rawMacroTotals.fats * 10) / 10,
    carbs: Math.round(rawMacroTotals.carbs * 10) / 10
  };

  const currentTargets = profile?.targets || DEFAULT_TARGETS;

  const totalMicrosToday = todayFoodLogs.reduce((acc, log) => {
    const m = log.micros || {};
    return {
      vitaminA: acc.vitaminA + (m.vitaminA || 0),
      vitaminC: acc.vitaminC + (m.vitaminC || 0),
      vitaminD: acc.vitaminD + (m.vitaminD || 0),
      iron: acc.iron + (m.iron || 0),
      calcium: acc.calcium + (m.calcium || 0),
      zinc: acc.zinc + (m.zinc || 0),
      magnesium: acc.magnesium + (m.magnesium || 0),
      potassium: acc.potassium + (m.potassium || 0)
    };
  }, { vitaminA: 0, vitaminC: 0, vitaminD: 0, iron: 0, calcium: 0, zinc: 0, magnesium: 0, potassium: 0 });

  const microPercents = [
    (totalMicrosToday.vitaminA / (currentTargets.micros?.vitaminA || 900)) * 100,
    (totalMicrosToday.vitaminC / (currentTargets.micros?.vitaminC || 90)) * 100,
    (totalMicrosToday.vitaminD / (currentTargets.micros?.vitaminD || 20)) * 100,
    (totalMicrosToday.iron / (currentTargets.micros?.iron || 14)) * 100,
    (totalMicrosToday.calcium / (currentTargets.micros?.calcium || 1000)) * 100,
    (totalMicrosToday.zinc / (currentTargets.micros?.zinc || 11)) * 100,
    (totalMicrosToday.magnesium / (currentTargets.micros?.magnesium || 400)) * 100,
    (totalMicrosToday.potassium / (currentTargets.micros?.potassium || 3500)) * 100
  ].map(p => Math.min(isNaN(p) ? 0 : p, 100));

  microPercents.sort((a, b) => a - b);
  const microMedianPercent = Math.round(((microPercents[3] || 0) + (microPercents[4] || 0)) / 2);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 font-sans pb-12">
      
      {/* Top Fixed Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lang={lang}
        setLang={setLang}
        profile={profile}
        macroTotals={macroTotals}
        targets={currentTargets}
        microMedianPercent={microMedianPercent}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onOpenDbModal={() => setShowDbModal(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* Keep AiHomeScreen Mounted in DOM to preserve scroll & chat history */}
        <div className={activeTab === 'ai' ? 'block' : 'hidden'}>
          <AiHomeScreen
            logs={{ food: safeFoodLogs, training: safeTrainingLogs, trading: safeTradingLogs }}
            onAddLog={handleAddLog}
            onQuickTabSwitch={(tab) => setActiveTab(tab)}
            lang={lang}
            profile={profile}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </div>

        {activeTab === 'calendar' && (
          <CalendarView
            logs={{ food: safeFoodLogs, training: safeTrainingLogs, trading: safeTradingLogs }}
          />
        )}

        {activeTab === 'food' && (
          <FoodView
            foodLogs={safeFoodLogs}
            macroTotals={macroTotals}
            targets={currentTargets}
            microMedianPercent={microMedianPercent}
            onAddFoodLog={(newLog) => handleAddLog('food', newLog)}
            onDeleteFoodLog={handleDeleteFoodLog}
            onUpdateFoodLog={handleUpdateFoodLog}
            lang={lang}
          />
        )}

        {activeTab === 'training' && (
          <TrainingView
            trainingLogs={safeTrainingLogs}
            onAddTrainingLog={(newLog) => handleAddLog('training', newLog)}
            onDeleteTrainingLog={handleDeleteTrainingLog}
          />
        )}

        {activeTab === 'trading' && (
          <TradingView
            tradingLogs={safeTradingLogs}
            onAddTradingLog={(newLog) => handleAddLog('trading', newLog)}
            onDeleteTradingLog={handleDeleteTradingLog}
            onUpdateTradingLog={handleUpdateTradingLog}
            lang={lang}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView />
        )}
      </main>

      {/* Top Level Independent Profile Modal Popup */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onSave={handleUpdateProfile}
          onClose={() => setShowProfileModal(false)}
          lang={lang}
        />
      )}

      {/* Root-Level Independent Database Status Diagnostics Modal Popup */}
      {showDbModal && (
        <DatabaseStatusModal
          onClose={() => setShowDbModal(false)}
          lang={lang}
        />
      )}

    </div>
  );
}
