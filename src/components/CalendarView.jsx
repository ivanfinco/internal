import React, { useState } from 'react';
import { Calendar as CalendarIcon, Filter, Utensils, Dumbbell, TrendingUp } from 'lucide-react';
import RealCalendar from './RealCalendar';
import { getLocalDateStr } from '../utils/dateUtils';

export default function CalendarView({ logs }) {
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr());

  const filteredFood = selectedDate
    ? logs.food.filter(l => l.timestamp.startsWith(selectedDate))
    : logs.food;

  const filteredTraining = selectedDate
    ? logs.training.filter(l => l.timestamp.startsWith(selectedDate))
    : logs.training;

  const filteredTrading = selectedDate
    ? logs.trading.filter(l => l.timestamp.startsWith(selectedDate))
    : logs.trading;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              Sezione Calendario Generale
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Vista d'insieme dell'archivio storico completo per data con possibilità di ingrandire ciascun giorno
          </p>
        </div>
      </div>

      {/* Real Full General Calendar */}
      <RealCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        section="all"
        logs={logs}
      />

      {/* Filtered Logs Recap List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-500" /> 
            Archivio Registrazioni {selectedDate ? `per la data ${selectedDate}` : 'Generale'}
          </h3>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Ripristina Filtro
            </button>
          )}
        </div>

        {/* Food Recap */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Utensils className="w-4 h-4" /> Food Logs ({filteredFood.length})
          </h4>
          {filteredFood.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">Nessun cibo loggato in questa data.</p>
          ) : (
            <div className="space-y-2">
              {filteredFood.map(f => (
                <div key={f.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">[{f.mealType}] {f.description}</span>
                    <span className="text-[11px] text-zinc-400 block font-mono">Data: {f.timestamp}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-500">{f.calories} kcal ({f.protein}g P)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Training Recap */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Dumbbell className="w-4 h-4" /> Training Logs ({filteredTraining.length})
          </h4>
          {filteredTraining.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">Nessun allenamento loggato in questa data.</p>
          ) : (
            <div className="space-y-2">
              {filteredTraining.map(t => (
                <div key={t.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">{t.title}</span>
                    <span className="text-[11px] text-zinc-400 block font-mono">Data: {t.timestamp}</span>
                  </div>
                  <span className="font-bold text-blue-500">{t.feeling}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trading Recap */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Trading Logs ({filteredTrading.length})
          </h4>
          {filteredTrading.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">Nessun trade loggato in questa data.</p>
          ) : (
            <div className="space-y-2">
              {filteredTrading.map(tr => (
                <div key={tr.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white font-mono">{tr.ticker} ({tr.type})</span>
                    <span className="text-[11px] text-zinc-400 block font-mono">Data: {tr.timestamp}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-500">{tr.pnl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
