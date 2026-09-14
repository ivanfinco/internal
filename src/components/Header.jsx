import React from 'react';
import { 
  Sun, Moon, LogOut, Flame, Dumbbell, TrendingUp, Wallet, Sparkles, Utensils, Award, Calendar as CalendarIcon, Database 
} from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode, 
  onLogout,
  macroTotals = { calories: 0, protein: 0, fats: 0, carbs: 0 },
  targets = { calories: 2500, protein: 180, fats: 70, carbs: 280 },
  microMedianPercent = 0,
  profile = {},
  onOpenProfileModal,
  onOpenDbModal,
  lang = 'IT',
  setLang
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['IT'];

  const tabs = [
    { id: 'ai', label: t.tabs.ai, icon: Sparkles },
    { id: 'food', label: t.tabs.food, icon: Utensils },
    { id: 'training', label: t.tabs.training, icon: Dumbbell },
    { id: 'trading', label: t.tabs.trading, icon: TrendingUp },
    { id: 'finance', label: t.tabs.finance, icon: Wallet, isWip: true },
    { id: 'calendar', label: t.tabs.calendar, icon: CalendarIcon },
  ];

  const safeMacros = macroTotals || { calories: 0, protein: 0, fats: 0, carbs: 0 };
  const safeTargets = targets || { calories: 2500, protein: 180, fats: 70, carbs: 280 };
  const safeProfile = profile || {};

  const avatar = safeProfile.avatar || '⚡';
  const isImageAvatar = avatar && (avatar.startsWith('http') || avatar.startsWith('data:image'));

  const bodyBadge = safeProfile.bodyType === 'skinny' ? '⚡ Lean'
    : safeProfile.bodyType === 'fit' ? '🔥 Fit'
    : safeProfile.bodyType === 'chubby' ? '🐻 Soft'
    : '⚖️ Avg';

  const calPercent = Math.min(100, Math.round(((safeMacros.calories || 0) / (safeTargets.calories || 2500)) * 100));
  const proPercent = Math.min(100, Math.round(((safeMacros.protein || 0) / (safeTargets.protein || 180)) * 100));
  const fatPercent = Math.min(100, Math.round(((safeMacros.fats || 0) / (safeTargets.fats || 70)) * 100));
  const carbPercent = Math.min(100, Math.round(((safeMacros.carbs || 0) / (safeTargets.carbs || 280)) * 100));

  const displayPro = Math.round((safeMacros.protein || 0) * 10) / 10;
  const displayFat = Math.round((safeMacros.fats || 0) * 10) / 10;
  const displayCarb = Math.round((safeMacros.carbs || 0) * 10) / 10;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      
      {/* Top Header & Quick Profile Info */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        
        {/* Welcome Greeting & Custom Profile Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenProfileModal}
            className="relative group shrink-0 transition-transform active:scale-95"
            title="Profilo & Impostazioni"
          >
            {isImageAvatar ? (
              <img
                src={avatar}
                alt={safeProfile.name || 'Ivan'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover border border-emerald-500/40 shadow-xs"
              />
            ) : (
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-lg sm:text-xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
                {avatar}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-tight">
                {safeProfile.name || 'Ivan'}
              </h2>
              <button
                onClick={onOpenProfileModal}
                className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-1"
              >
                <span>{safeProfile.age || 31}y • {safeProfile.weight || 80}kg • {safeProfile.height || 180}cm</span>
                <span className="font-bold border-l border-zinc-300 dark:border-zinc-700 pl-1">{bodyBadge}</span>
              </button>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Right Controls: Database Status, Language Selector, Theme Switcher & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Database Status Button */}
          <button
            onClick={onOpenDbModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-2xl transition-all border border-emerald-500/20"
            title="Diagnostica Connessione Database Supabase"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Database</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 sm:p-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80">
            <button
              onClick={() => setLang('IT')}
              className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                lang === 'IT' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              🇮🇹 IT
            </button>
            <button
              onClick={() => setLang('EN')}
              className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                lang === 'EN' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 sm:p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-200/80 dark:border-zinc-700/80"
            title={darkMode ? "Passa a Tema Chiaro" : "Passa a Tema Scuro"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Logout if provided */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all"
              title="Disconnetti"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Macros & Micronutrients Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 border-t border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          
          {/* Calorie Counter */}
          <div className="bg-white dark:bg-zinc-800/60 p-2 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-semibold flex items-center gap-1 text-[11px]">
                <Flame className="w-3 h-3 text-amber-500" /> {t.calories}
              </span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white text-[11px]">
                {Math.round(safeMacros.calories || 0)} / {safeTargets.calories}
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${calPercent}%` }} 
              />
            </div>
          </div>

          {/* Proteine Counter */}
          <div className="bg-white dark:bg-zinc-800/60 p-2 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px]">
                🥩 {t.protein}
              </span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white text-[11px]">
                {displayPro}g / {safeTargets.protein}g
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${proPercent}%` }} 
              />
            </div>
          </div>

          {/* Grassi Counter */}
          <div className="bg-white dark:bg-zinc-800/60 p-2 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-semibold flex items-center gap-1 text-blue-500 text-[11px]">
                🥑 {t.fats}
              </span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white text-[11px]">
                {displayFat}g / {safeTargets.fats}g
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${fatPercent}%` }} 
              />
            </div>
          </div>

          {/* Carboidrati Counter */}
          <div className="bg-white dark:bg-zinc-800/60 p-2 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-semibold flex items-center gap-1 text-purple-500 text-[11px]">
                🍞 {t.carbs}
              </span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white text-[11px]">
                {displayCarb}g / {safeTargets.carbs}g
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${carbPercent}%` }} 
              />
            </div>
          </div>

          {/* Micronutrienti Standard Mediano % Bar */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-900/20 dark:to-emerald-900/20 p-2 rounded-2xl border border-teal-500/20 dark:border-teal-700/40 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1 text-teal-700 dark:text-teal-300 text-[11px]">
                <Award className="w-3 h-3" /> {t.micronutrients}
              </span>
              <span className="font-mono font-extrabold text-teal-800 dark:text-teal-200 text-[11px]">
                {microMedianPercent}% {t.standard}
              </span>
            </div>
            <div className="w-full bg-teal-200/50 dark:bg-teal-950 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${microMedianPercent}%` }} 
              />
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex space-x-1.5 overflow-x-auto py-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
              {tab.isWip && (
                <span className={`px-1.5 py-0.5 text-[9px] rounded-md font-mono ${
                  isActive ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  WIP
                </span>
              )}
            </button>
          );
        })}
      </div>

    </header>
  );
}
