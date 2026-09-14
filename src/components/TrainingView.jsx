import React, { useState } from 'react';
import { Dumbbell, Calendar, Clock, Zap, Plus, Trash2, Award, Activity, Filter } from 'lucide-react';
import RealCalendar from './RealCalendar';

export default function TrainingView({ trainingLogs, onAddTrainingLog, onDeleteTrainingLog }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [title, setTitle] = useState('Workout Petto & Spalle');
  const [feeling, setFeeling] = useState('🔥 In gran forma');
  const [exName, setExName] = useState('Panca Piana');
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(100);
  const [notes, setNotes] = useState('');

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newLog = {
      id: 't_' + Date.now(),
      timestamp,
      title,
      feeling,
      energyLevel: '9/10',
      exercises: [
        { name: exName, sets: Number(sets), reps: Number(reps), weight: Number(weight), note: 'Serie pesante' }
      ],
      notes
    };

    onAddTrainingLog(newLog);
    setShowAddModal(false);
  };

  const filteredLogs = selectedDate
    ? trainingLogs.filter(log => log.timestamp.startsWith(selectedDate))
    : trainingLogs;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              Sezione Training & Allenamento
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Registro carichi, ripetizioni, serie e sensazioni post-allenamento con calendario reale
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Aggiungi Allenamento
        </button>
      </div>

      {/* Real Interactive Calendar Component */}
      <RealCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        section="training"
        logs={{ training: trainingLogs }}
      />

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900 to-zinc-900 text-white p-5 rounded-3xl border border-blue-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <span className="text-xs text-blue-200 block uppercase font-semibold">Sessioni Totali</span>
            <span className="text-2xl font-extrabold font-mono">{trainingLogs.length} Allenamenti</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-zinc-900 text-white p-5 rounded-3xl border border-indigo-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs text-indigo-200 block uppercase font-semibold">Energy Mood Peak</span>
            <span className="text-2xl font-extrabold">9.2 / 10 Avg</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-900 to-zinc-900 text-white p-5 rounded-3xl border border-cyan-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Award className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs text-cyan-200 block uppercase font-semibold">Max Load Record</span>
            <span className="text-2xl font-extrabold font-mono">220 kg (Leg Press)</span>
          </div>
        </div>
      </div>

      {/* Training History Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" /> Storico Schede & Log Carichi
          </h3>

          {selectedDate && (
            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold rounded-xl flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtrato per data: {selectedDate}
            </span>
          )}
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">Nessun allenamento registrato {selectedDate ? `il ${selectedDate}` : 'in archivio'}.</p>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-blue-500/50 transition-all space-y-4"
            >
              {/* Log Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {log.title}
                    </h4>
                    <span className="px-3 py-1 text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
                      {log.feeling}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Registrato il {log.timestamp}
                  </p>
                </div>

                <button
                  onClick={() => onDeleteTrainingLog(log.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                  title="Elimina allenamento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Exercises Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {log.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block mb-1">
                      {ex.name}
                    </span>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{ex.sets}x{ex.reps}</span> 
                      {ex.weight ? ` @ ${ex.weight}kg` : ''}
                    </div>
                    {ex.note && (
                      <span className="text-[10px] text-zinc-400 block mt-1 italic">
                        "{ex.note}"
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {log.notes && (
                <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  📝 <strong>Note & Sensazioni</strong>: {log.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Aggiungi Workout Manuale</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Titolo Sessione</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Sensazione / Mood</label>
                <select
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                >
                  <option value="🔥 In gran forma">🔥 In gran forma</option>
                  <option value="⚡ Molto Carico">⚡ Molto Carico</option>
                  <option value="😴 Affaticato">😴 Affaticato</option>
                </select>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Esercizio Principale</span>
                <input
                  type="text"
                  placeholder="Nome esercizio"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium dark:text-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Serie"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Note aggiuntive</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Come ti sei sentito..."
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white h-20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-xl text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm"
                >
                  Salva Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
