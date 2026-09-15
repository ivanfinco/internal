import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Utensils, Dumbbell, TrendingUp, Bot, Cpu, Trash2 } from 'lucide-react';
import { parseUserInput } from '../utils/aiParser';
import { TRANSLATIONS } from '../constants/translations';
import DailyTipCard from './DailyTipCard';

export default function AiHomeScreen({ logs, onAddLog, onQuickTabSwitch, lang = 'IT', profile, chatHistory: externalHistory, setChatHistory: setExternalHistory }) {
  const t = TRANSLATIONS[lang]?.aiHome || {
    title: 'Assistant AI',
    description: 'Gestisci Nutrizione, Allenamento e Trading conversando direttamente con l\'Assistente AI.',
    placeholder: 'Chiedi all\'Assistente AI o registra pasto/allenamento/trade...',
    processing: 'L\'Assistente AI sta elaborando...'
  };
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
        ? `👋 **Hello ${profile?.name || 'Ivan'}!** I am your **Assistant AI**. How can I help you today with your Meals, Workouts, or Trading?`
        : `👋 **Ciao ${profile?.name || 'Ivan'}!** Sono il tuo **Assistente AI**. Come posso aiutarti oggi con Nutrizione, Allenamento o Trading?`
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
      const result = await parseUserInput(text, logs, lang, profile);

      if (result.type === 'log_entry' && result.category && result.log) {
        onAddLog(result.category, result.log);
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        message: result.message || (isEn ? 'Processed.' : 'Elaborato.'),
        category: result.category
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Submit Error:", err);
      const errorMsg = {
        id: 'err_' + Date.now(),
        sender: 'ai',
        timestamp: timeStr,
        message: `⚠️ **Errore:** ${err.message}`
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([
      {
        id: 'welcome_' + Date.now(),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        message: isEn
          ? `⚡ **Chat reset.** Ready for new interactions.`
          : `⚡ **Chat azzerata.** Pronta per nuove interazioni.`
      }
    ]);
  };

  const quickPrompts = isEn ? [
    { label: "🥗 200g chicken breast, 150g basmati rice", text: "food: 200g chicken breast, 150g basmati rice" },
    { label: "🏋️ Bench press 4x8 100kg", text: "training: Bench press 4x8 100kg" },
    { label: "📈 BUY 5 MNQ @ 19500 TP 19800 SL 19400", text: "BUY 5 MNQ @ 19500 TP 19800 SL 19400" },
    { label: "❓ Summarize my daily macros and trading PnL", text: "Summarize my daily macros and trading PnL" }
  ] : [
    { label: "🥗 200g petto di pollo e 150g riso basmati", text: "food: 200g petto di pollo e 150g riso basmati" },
    { label: "🏋️ Panca piana 4x8 100kg", text: "training: Panca piana 4x8 100kg" },
    { label: "📈 BUY 5 MNQ @ 19500 TP 19800 SL 19400", text: "BUY 5 MNQ @ 19500 TP 19800 SL 19400" },
    { label: "❓ Fai un riassunto dei miei macro e PnL di oggi", text: "Fai un riassunto dei miei macro e PnL di oggi" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-8 sm:pb-12 px-2 sm:px-4 md:px-0">
      
      {/* Lifestyle Tip Banner */}
      <DailyTipCard profile={profile} logs={logs} lang={lang} />

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-zinc-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-zinc-800">
        <div className="relative z-10 space-y-2 sm:space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Assistant AI • Online
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {isEn ? 'English' : 'Italiano'}
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.title || 'Assistant AI'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Ogni richiesta inviata in questa chat viene elaborata dall'Assistente AI per analizzare cibo, workout, trading o quesiti generali.
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 relative z-10">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(item.text)}
              className="text-[11px] sm:text-xs bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700/80 px-3 py-1.5 rounded-xl transition-all font-medium text-zinc-300 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main AI Chat Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)] min-h-[440px] sm:h-[580px]">
        
        {/* Chat Feed Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                Assistant AI
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">Personal Assistant ({isEn ? 'English' : 'Italiano'})</p>
            </div>
          </div>

          {/* Action buttons & tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onQuickTabSwitch('food')}
              className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
            >
              🥗 Food ({logs.food?.length || 0})
            </button>
            <button
              onClick={() => onQuickTabSwitch('training')}
              className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
            >
              🏋️ Workout ({logs.training?.length || 0})
            </button>
            <button
              onClick={() => onQuickTabSwitch('trading')}
              className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
            >
              📈 Trading ({logs.trading?.length || 0})
            </button>
            <button
              onClick={handleClearHistory}
              title="Azzera chat"
              className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
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
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-emerald-400 flex items-center justify-center shrink-0 text-xs shadow-xs border border-zinc-700/50 mt-1 font-mono font-bold">
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
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-900 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-mono font-bold border border-zinc-700">
                AI
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm text-zinc-500 flex items-center gap-2 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono">Elaborazione richiesta in corso...</span>
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
              placeholder={t.placeholder || "Chiedi all'Assistente AI o registra un pasto/workout/trade..."}
              className="w-full pl-4 pr-12 py-3 sm:py-4 bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs sm:text-sm font-medium transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-1.5 p-2.5 sm:p-3 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 rounded-xl transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
