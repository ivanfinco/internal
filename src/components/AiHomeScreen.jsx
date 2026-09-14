import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Utensils, Dumbbell, TrendingUp, HelpCircle, CheckCircle2, Clock, MessageSquare, Bot } from 'lucide-react';
import { parseUserInput } from '../utils/aiParser';
import { TRANSLATIONS } from '../constants/translations';
import DailyTipCard from './DailyTipCard';

export default function AiHomeScreen({ logs, onAddLog, onQuickTabSwitch, lang = 'IT', profile, chatHistory: externalHistory, setChatHistory: setExternalHistory }) {
  const t = TRANSLATIONS[lang].aiHome;
  const isEn = lang === 'EN';

  const avatar = profile?.avatar || '⚡';
  const isImageAvatar = avatar && (avatar.startsWith('http') || avatar.startsWith('data:image'));

  const [inputText, setInputText] = useState('');
  
  const [internalHistory, setInternalHistory] = useState(() => [
    {
      id: 'welcome',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      message: isEn
        ? `👋 **Hello ${profile?.name || 'Ivan'}! I'm your AI Personal Assistant.**`
        : `👋 **Ciao ${profile?.name || 'Ivan'}! Sono il tuo Assistente AI personale.**`
    }
  ]);

  const chatHistory = externalHistory || internalHistory;
  const setChatHistory = setExternalHistory || setInternalHistory;

  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isProcessing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const text = inputText;
    setInputText('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user',
      timestamp: timeStr,
      message: text
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const result = await parseUserInput(text, logs, lang);

      if (result.type === 'log_entry') {
        onAddLog(result.category, result.log);
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        message: result.message,
        category: result.category
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = isEn ? [
    { label: "🥗 food: 200g chicken, 120g rice", text: "food: 200g chicken, 120g rice" },
    { label: "🏋️ training: squat 4x8 110kg", text: "training: squat 4x8 110kg" },
    { label: "📈 trading: BUY 5 MNQ @ 19500", text: "trading: BUY 5 MNQ @ 19500" },
    { label: "❓ how much protein did I eat today?", text: "how much protein did I eat today?" }
  ] : [
    { label: "🥗 food: 200g pollo, 120g riso", text: "food: 200g pollo, 120g riso" },
    { label: "🏋️ training: squat 4x8 110kg", text: "training: squat 4x8 110kg" },
    { label: "📈 trading: BUY 5 MNQ @ 19500", text: "trading: BUY 5 MNQ @ 19500" },
    { label: "❓ quante proteine ho mangiato oggi?", text: "quante proteine ho mangiato oggi?" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-8 sm:pb-12 px-2 sm:px-4 md:px-0">
      
      {/* Daily AI Lifestyle & Nutrition Tip Card */}
      <DailyTipCard profile={profile} logs={logs} lang={lang} />

      {/* Refined Responsive Hero Header Card */}
      <div className="relative overflow-hidden bg-zinc-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-zinc-800">
        <div className="relative z-10 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Assistant AI • {isEn ? 'English' : 'Italiano'}
          </div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 relative z-10">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(item.text)}
              className="text-[11px] sm:text-xs bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 px-3 py-1.5 rounded-xl transition-all font-medium text-zinc-300 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main AI Chat Container - Fully Responsive for Mobile Phone & iPad */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden flex flex-col h-[calc(100vh-250px)] min-h-[420px] sm:h-[560px]">
        
        {/* Chat Feed Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center font-bold border border-zinc-200/80 dark:border-zinc-700">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">AI Assistant</h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">Assistant AI Direct API ({isEn ? 'English' : 'Italiano'})</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onQuickTabSwitch('food')}
              className="px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
            >
              🥗 Food ({logs.food.length})
            </button>
            <button
              onClick={() => onQuickTabSwitch('training')}
              className="px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
            >
              🏋️ Workout ({logs.training.length})
            </button>
            <button
              onClick={() => onQuickTabSwitch('trading')}
              className="px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
            >
              📈 Trading ({logs.trading.length})
            </button>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
          {chatHistory.map((item) => (
            <div
              key={item.id}
              className={`flex gap-2 sm:gap-3 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {item.sender === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs border border-zinc-700/50 mt-1">
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-tr-xs shadow-xs'
                    : 'bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {item.message}
                </div>
                <div className={`mt-1.5 text-[9px] sm:text-[10px] text-right font-mono ${
                  item.sender === 'user' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'
                }`}>
                  {item.timestamp}
                </div>
              </div>

              {item.sender === 'user' && (
                isImageAvatar ? (
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-xs mt-1"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm sm:text-base border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-xs mt-1">
                    {avatar}
                  </div>
                )
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs">
                AI
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm text-zinc-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span>{t.processing}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full pl-4 pr-12 py-3 sm:py-4 bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs sm:text-sm font-medium transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-1.5 p-2.5 sm:p-3 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 disabled:opacity-50 rounded-xl transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
