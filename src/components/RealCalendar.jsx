import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Maximize2, X, Utensils, Dumbbell, TrendingUp, Clock, Info, CheckCircle2 } from 'lucide-react';

export default function RealCalendar({ 
  selectedDate, 
  onSelectDate, 
  section = 'all', // 'food' | 'training' | 'trading' | 'all'
  logs = { food: [], training: [], trading: [] }
}) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    return new Date(2026, 8, 1); // Sept 2026
  });

  // Zoomed Day Modal State
  const [zoomedDay, setZoomedDay] = useState(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const setToday = () => {
    setCurrentMonthDate(new Date(2026, 8, 1));
    onSelectDate('2026-09-14');
  };

  const firstDayOfMonth = new Date(year, month, 1);
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
    calendarDays.push({
      dateStr: formatDateStr(prevDate),
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currDate = new Date(year, month, day);
    calendarDays.push({
      dateStr: formatDateStr(currDate),
      dayNum: day,
      isCurrentMonth: true
    });
  }

  const remainingCells = (calendarDays.length > 35 ? 42 : 35) - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    calendarDays.push({
      dateStr: formatDateStr(nextDate),
      dayNum: i,
      isCurrentMonth: false
    });
  }

  function formatDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Logs grouped by date safely
  const foodByDate = {};
  (logs.food || []).forEach(item => {
    if (!item || typeof item.timestamp !== 'string') return;
    const d = item.timestamp.split(' ')[0];
    if (!foodByDate[d]) foodByDate[d] = { calories: 0, protein: 0, items: [] };
    foodByDate[d].calories += item.calories || 0;
    foodByDate[d].protein += item.protein || 0;
    foodByDate[d].items.push(item);
  });

  const trainingByDate = {};
  (logs.training || []).forEach(item => {
    if (!item || typeof item.timestamp !== 'string') return;
    const d = item.timestamp.split(' ')[0];
    if (!trainingByDate[d]) trainingByDate[d] = [];
    trainingByDate[d].push(item);
  });

  const tradingByDate = {};
  (logs.trading || []).forEach(item => {
    if (!item || typeof item.timestamp !== 'string') return;
    const d = item.timestamp.split(' ')[0];
    if (!tradingByDate[d]) tradingByDate[d] = [];
    tradingByDate[d].push(item);
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Calendar Month Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
            Calendario • {monthNames[month]} {year}
          </h3>
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {section === 'food' ? 'Nutrizione' : section === 'training' ? 'Training' : section === 'trading' ? 'Trading' : 'Vista Globale'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={setToday}
            className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-all"
          >
            Oggi (14 Set)
          </button>
          
          {selectedDate && (
            <button
              onClick={() => onSelectDate(null)}
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 rounded-xl transition-all"
            >
              Mostra Tutti
            </button>
          )}

          <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
            <button
              onClick={prevMonth}
              className="p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
        {daysOfWeek.map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((cell, idx) => {
          const isSelected = selectedDate === cell.dateStr;
          const isToday = cell.dateStr === '2026-09-14';

          const hasFood = foodByDate[cell.dateStr];
          const hasTraining = trainingByDate[cell.dateStr];
          const hasTrading = tradingByDate[cell.dateStr];

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(cell.dateStr === selectedDate ? null : cell.dateStr)}
              className={`min-h-[85px] p-2 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                !cell.isCurrentMonth
                  ? 'opacity-30 border-transparent bg-zinc-50/50 dark:bg-zinc-950/20'
                  : isSelected
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                  : isToday
                  ? 'border-amber-500/60 bg-amber-500/5 dark:bg-amber-950/20'
                  : 'border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:border-emerald-500/40'
              }`}
            >
              {/* Day Header & Zoom Trigger */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-extrabold ${
                  isToday ? 'text-amber-500 font-mono' : isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'
                }`}>
                  {cell.dayNum}
                </span>

                <div className="flex items-center gap-1">
                  {isToday && (
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedDay(cell.dateStr);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 rounded-md transition-all"
                    title="Ingrandisci Giorno"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Badges depending on section */}
              <div className="space-y-1 mt-1">
                {(section === 'food' || section === 'all') && hasFood && (
                  <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold leading-tight truncate">
                    🔥 {Math.round(hasFood.calories)} kcal ({Math.round(hasFood.protein * 10) / 10}g P)
                  </div>
                )}

                {(section === 'training' || section === 'all') && hasTraining && (
                  <div className="px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 text-[10px] font-bold leading-tight truncate">
                    🏋️ {(hasTraining[0].title || 'Workout').replace('Workout ', '').replace('Allenamento ', '')}
                  </div>
                )}

                {(section === 'trading' || section === 'all') && hasTrading && (
                  <div className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-bold leading-tight truncate">
                    📈 {hasTrading.length} Trade ({hasTrading[0].ticker || 'BTC'})
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Day Zoom Modal */}
      {zoomedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto relative">
            
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">Dettaglio Giornaliero Ingrandito</span>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono">
                  {zoomedDay}
                </h3>
              </div>

              <button
                onClick={() => setZoomedDay(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Food Section Logs for Zoomed Day */}
            {(section === 'food' || section === 'all') && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Utensils className="w-4 h-4" /> Pasti Registrati ({foodByDate[zoomedDay]?.items.length || 0})
                </h4>

                {!foodByDate[zoomedDay] || foodByDate[zoomedDay].items.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Nessun cibo registrato in questa data.</p>
                ) : (
                  <div className="space-y-2">
                    {foodByDate[zoomedDay].items.map(f => (
                      <div key={f.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
                        <div className="flex justify-between font-semibold text-zinc-900 dark:text-white">
                          <span>[{f.mealType}] {f.description}</span>
                          <span className="font-mono text-emerald-500">{Math.round(f.calories)} kcal</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono mt-1">
                          🥩 Proteine: {Math.round((f.protein || 0) * 10) / 10}g | 🥑 Grassi: {Math.round((f.fats || 0) * 10) / 10}g | 🍞 Carbo: {Math.round((f.carbs || 0) * 10) / 10}g
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Training Logs for Zoomed Day */}
            {(section === 'training' || section === 'all') && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Allenamenti Registrati ({trainingByDate[zoomedDay]?.length || 0})
                </h4>

                {!trainingByDate[zoomedDay] || trainingByDate[zoomedDay].length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Nessun allenamento registrato in questa data.</p>
                ) : (
                  <div className="space-y-2">
                    {trainingByDate[zoomedDay].map(t => (
                      <div key={t.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                          <span>{t.title}</span>
                          <span className="text-blue-500">{t.feeling}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Esercizi: {(t.exercises || []).map(e => `${e.name} ${e.sets}x${e.reps} (${e.weight}kg)`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trading Logs for Zoomed Day */}
            {(section === 'trading' || section === 'all') && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Trade Registrati ({tradingByDate[zoomedDay]?.length || 0})
                </h4>

                {!tradingByDate[zoomedDay] || tradingByDate[zoomedDay].length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Nessun trade registrato in questa data.</p>
                ) : (
                  <div className="space-y-2">
                    {tradingByDate[zoomedDay].map(tr => (
                      <div key={tr.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white font-mono">{tr.ticker} ({tr.type})</span>
                          <div className="text-[11px] text-zinc-400 font-mono">Entry: ${tr.entryPrice || tr.entry_price || 0} | TP: ${tr.takeProfit || tr.take_profit || 0} | SL: ${tr.stopLoss || tr.stop_loss || 0}</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-500">{tr.pnl || '0.0%'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setZoomedDay(null)}
                className="px-5 py-2.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Chiudi
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
