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

import { 
  DEFAULT_TARGETS, 
  INITIAL_FOOD_LOGS, 
  INITIAL_TRAINING_LOGS, 
  INITIAL_TRADING_LOGS 
} from './constants/initialData';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ivan_dashboard_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ivan_theme');
    return saved ? saved === 'dark' : true;
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('ivan_lang') || 'IT';
  });

  const [showProfileModal, setShowProfileModal] = useState(false);

  // User Personal Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ivan_user_profile');
    if (saved) return JSON.parse(saved);
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
    const saved = localStorage.getItem('ivan_food_logs');
    if (saved) {
      const logs = JSON.parse(saved);
      return logs.map(item => ({
        ...item,
        ingredientsBreakdown: parseScientificBreakdown(item.description, item.calories, item.protein, item.fats, item.carbs, item.micros || {})
      }));
    }
    return INITIAL_FOOD_LOGS;
  });

  const [trainingLogs, setTrainingLogs] = useState(() => {
    const saved = localStorage.getItem('ivan_training_logs');
    return saved ? JSON.parse(saved) : INITIAL_TRAINING_LOGS;
  });

  const [tradingLogs, setTradingLogs] = useState(() => {
    const saved = localStorage.getItem('ivan_trading_logs');
    return saved ? JSON.parse(saved) : INITIAL_TRADING_LOGS;
  });

  // Initial Supabase Sync & Real-time Listener
  useEffect(() => {
    let isMounted = true;

    async function loadCloudData() {
      try {
        const [cloudProfile, cloudFood, cloudTraining, cloudTrading] = await Promise.all([
          fetchUserProfile(),
          fetchFoodLogs(),
          fetchTrainingLogs(),
          fetchTradingLogs()
        ]);

        if (!isMounted) return;

        if (cloudProfile) setProfile(cloudProfile);
        if (cloudFood && cloudFood.length > 0) setFoodLogs(cloudFood);
        if (cloudTraining && cloudTraining.length > 0) setTrainingLogs(cloudTraining);
        if (cloudTrading && cloudTrading.length > 0) setTradingLogs(cloudTrading);
      } catch (err) {
        console.warn("Supabase initial sync fallback:", err);
      }
    }

    loadCloudData();

    const unsubscribe = subscribeToRealtimeChanges(() => {
      loadCloudData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ivan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ivan_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ivan_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ivan_user_profile', JSON.stringify(profile));
    saveSupabaseProfile(profile);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ivan_food_logs', JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem('ivan_training_logs', JSON.stringify(trainingLogs));
  }, [trainingLogs]);

  useEffect(() => {
    localStorage.setItem('ivan_trading_logs', JSON.stringify(tradingLogs));
  }, [tradingLogs]);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('ivan_dashboard_user', JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ivan_dashboard_user');
  };

  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    saveSupabaseProfile(newProfile);
  };

  const handleAddLog = (category, newLog) => {
    if (category === 'food') {
      const scientificLog = {
        ...newLog,
        ingredientsBreakdown: parseScientificBreakdown(
          newLog.description,
          newLog.calories,
          newLog.protein,
          newLog.fats,
          newLog.carbs,
          newLog.micros || {}
        )
      };
      setFoodLogs(prev => [scientificLog, ...prev]);
      addSupabaseFoodLog(scientificLog);
    } else if (category === 'training') {
      setTrainingLogs(prev => [newLog, ...prev]);
      addSupabaseTrainingLog(newLog);
    } else if (category === 'trading') {
      setTradingLogs(prev => [newLog, ...prev]);
      addSupabaseTradingLog(newLog);
    }
  };

  const handleDeleteFoodLog = (id) => {
    setFoodLogs(prev => prev.filter(item => item.id !== id));
    deleteSupabaseFoodLog(id);
  };

  const handleUpdateFoodLog = (updatedLog) => {
    const scientificLog = {
      ...updatedLog,
      ingredientsBreakdown: parseScientificBreakdown(
        updatedLog.description,
        updatedLog.calories,
        updatedLog.protein,
        updatedLog.fats,
        updatedLog.carbs,
        updatedLog.micros || {}
      )
    };
    setFoodLogs(prev => prev.map(item => item.id === scientificLog.id ? scientificLog : item));
    updateSupabaseFoodLog(scientificLog);
  };

  const handleDeleteTrainingLog = (id) => {
    setTrainingLogs(prev => prev.filter(item => item.id !== id));
    deleteSupabaseTrainingLog(id);
  };

  const handleDeleteTradingLog = (id) => {
    setTradingLogs(prev => prev.filter(item => item.id !== id));
    deleteSupabaseTradingLog(id);
  };

  const handleUpdateTradingLog = (updatedLog) => {
    setTradingLogs(prev => prev.map(item => item.id === updatedLog.id ? updatedLog : item));
    updateSupabaseTradingLog(updatedLog);
  };

  const macroTotals = foodLogs.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    fats: acc.fats + (item.fats || 0),
    carbs: acc.carbs + (item.carbs || 0)
  }), { calories: 0, protein: 0, fats: 0, carbs: 0 });

  const calculateMicroMedian = () => {
    const totalMicros = foodLogs.reduce((acc, item) => {
      const m = item.micros || {};
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

    const targets = profile.targets?.micros || DEFAULT_TARGETS.micros;
    
    const percentages = [
      Math.min(100, (totalMicros.vitaminA / targets.vitaminA) * 100),
      Math.min(100, (totalMicros.vitaminC / targets.vitaminC) * 100),
      Math.min(100, (totalMicros.vitaminD / targets.vitaminD) * 100),
      Math.min(100, (totalMicros.iron / targets.iron) * 100),
      Math.min(100, (totalMicros.calcium / targets.calcium) * 100),
      Math.min(100, (totalMicros.zinc / targets.zinc) * 100),
      Math.min(100, (totalMicros.magnesium / targets.magnesium) * 100),
      Math.min(100, (totalMicros.potassium / targets.potassium) * 100)
    ].sort((a, b) => a - b);

    const mid = Math.floor(percentages.length / 2);
    const median = percentages.length % 2 !== 0 
      ? percentages[mid] 
      : (percentages[mid - 1] + percentages[mid]) / 2;

    return Math.round(median);
  };

  const microMedianPercent = calculateMicroMedian();
  const currentTargets = profile.targets || DEFAULT_TARGETS;

  if (!user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      {/* Top Header & Live Counter Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={handleLogout}
        macroTotals={macroTotals}
        targets={currentTargets}
        microMedianPercent={microMedianPercent}
        profile={profile}
        onOpenProfileModal={() => setShowProfileModal(true)}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'ai' && (
          <AiHomeScreen
            logs={{ food: foodLogs, training: trainingLogs, trading: tradingLogs }}
            onAddLog={handleAddLog}
            onQuickTabSwitch={(tab) => setActiveTab(tab)}
            lang={lang}
            profile={profile}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            logs={{ food: foodLogs, training: trainingLogs, trading: tradingLogs }}
          />
        )}

        {activeTab === 'food' && (
          <FoodView
            foodLogs={foodLogs}
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
            trainingLogs={trainingLogs}
            onAddTrainingLog={(newLog) => handleAddLog('training', newLog)}
            onDeleteTrainingLog={handleDeleteTrainingLog}
          />
        )}

        {activeTab === 'trading' && (
          <TradingView
            tradingLogs={tradingLogs}
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

    </div>
  );
}
