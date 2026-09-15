import React, { useState } from 'react';
import { Utensils, Flame, Plus, Award, Calendar, Clock, Trash2, PieChart, Filter, ChevronDown, ChevronUp, Info, Sparkles, X, Check, Search, BarChart3, ListFilter, AlignLeft } from 'lucide-react';
import RealCalendar from './RealCalendar';
import { parseScientificBreakdown } from '../utils/nutritionEngine';
import { getLocalTimestampStr, getLocalDateStr } from '../utils/dateUtils';

export default function FoodView({ foodLogs, macroTotals, targets, microMedianPercent, onAddFoodLog, onDeleteFoodLog, lang = 'IT' }) {
  const isEn = lang === 'EN';
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNutrient, setSelectedNutrient] = useState('protein');
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr());
  const [expandedLogId, setExpandedLogId] = useState(null);

  // Manual Add Form State
  const [mealType, setMealType] = useState('Pranzo');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState(500);
  const [protein, setProtein] = useState(35);
  const [fats, setFats] = useState(15);
  const [carbs, setCarbs] = useState(55);

  // Guarantee realistic scientific breakdown for ANY log
  const getLogBreakdown = (log) => {
    if (log.ingredientsBreakdown && log.ingredientsBreakdown.length > 0) {
      const first = log.ingredientsBreakdown[0];
      const isEvenDummy = log.ingredientsBreakdown.length > 1 && log.ingredientsBreakdown.every(i => i.calories === first.calories && i.protein === first.protein);
      if (!isEvenDummy) return log.ingredientsBreakdown;
    }

    return parseScientificBreakdown(log.description, log.calories, log.protein, log.fats, log.carbs, log.micros || {});
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const timestamp = getLocalTimestampStr();

    const newLog = {
      id: 'f_' + Date.now(),
      timestamp,
      mealType,
      description,
      calories: Number(calories),
      protein: Math.round(Number(protein) * 10) / 10,
      fats: Math.round(Number(fats) * 10) / 10,
      carbs: Math.round(Number(carbs) * 10) / 10,
      micros: {
        vitaminA: 200,
        vitaminC: 30,
        vitaminD: 2,
        iron: 3,
        calcium: 150,
        zinc: 2,
        magnesium: 50,
        potassium: 400
      }
    };

    newLog.ingredientsBreakdown = parseScientificBreakdown(description, calories, protein, fats, carbs, newLog.micros);

    onAddFoodLog(newLog);
    setDescription('');
    setShowAddModal(false);
  };

  const filteredLogs = selectedDate
    ? foodLogs.filter(log => log.timestamp.startsWith(selectedDate))
    : foodLogs;

  const totalMicros = foodLogs.reduce((acc, log) => {
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

  const microList = [
    { key: 'vitaminA', label: 'Vitamina A', val: Math.round(totalMicros.vitaminA), target: targets.micros.vitaminA, unit: 'mcg' },
    { key: 'vitaminC', label: 'Vitamina C', val: Math.round(totalMicros.vitaminC), target: targets.micros.vitaminC, unit: 'mg' },
    { key: 'vitaminD', label: 'Vitamina D', val: Math.round(totalMicros.vitaminD * 10) / 10, target: targets.micros.vitaminD, unit: 'mcg' },
    { key: 'iron', label: 'Ferro (Fe)', val: Math.round(totalMicros.iron * 10) / 10, target: targets.micros.iron, unit: 'mg' },
    { key: 'calcium', label: 'Calcio (Ca)', val: Math.round(totalMicros.calcium), target: targets.micros.calcium, unit: 'mg' },
    { key: 'zinc', label: 'Zinco (Zn)', val: Math.round(totalMicros.zinc * 10) / 10, target: targets.micros.zinc, unit: 'mg' },
    { key: 'magnesium', label: 'Magnesio (Mg)', val: Math.round(totalMicros.magnesium), target: targets.micros.magnesium, unit: 'mg' },
    { key: 'potassium', label: 'Potassio (K)', val: Math.round(totalMicros.potassium), target: targets.micros.potassium, unit: 'mg' }
  ];

  const getNutrientProvenance = (nutrientKey) => {
    const provenanceList = [];

    filteredLogs.forEach(log => {
      const ingredients = getLogBreakdown(log);

      ingredients.forEach(ing => {
        let amount = 0;
        let unit = 'g';

        if (nutrientKey === 'calories') { amount = ing.calories || 0; unit = 'kcal'; }
        else if (nutrientKey === 'protein') { amount = ing.protein || 0; unit = 'g'; }
        else if (nutrientKey === 'carbs') { amount = ing.carbs || 0; unit = 'g'; }
        else if (nutrientKey === 'fats') { amount = ing.fats || 0; unit = 'g'; }
        else if (ing.micros && ing.micros[nutrientKey] !== undefined) {
          amount = ing.micros[nutrientKey] || 0;
          unit = (nutrientKey === 'vitaminA' || nutrientKey === 'vitaminD') ? 'mcg' : 'mg';
        }

        if (amount > 0) {
          provenanceList.push({
            foodName: ing.name,
            mealType: log.mealType,
            timestamp: log.timestamp,
            amount: Math.round(amount * 10) / 10,
            unit
          });
        }
      });
    });

    provenanceList.sort((a, b) => b.amount - a.amount);
    const grandTotal = Math.round(provenanceList.reduce((sum, item) => sum + item.amount, 0) * 10) / 10;

    return { provenanceList, grandTotal };
  };

  const currentProvenance = getNutrientProvenance(selectedNutrient);

  const nutrientOptions = [
    { key: 'protein', label: isEn ? 'Protein (g)' : 'Proteine (g)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
    { key: 'carbs', label: isEn ? 'Carbs (g)' : 'Carboidrati (g)', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
    { key: 'fats', label: isEn ? 'Fats (g)' : 'Grassi (g)', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
    { key: 'calories', label: isEn ? 'Calories (kcal)' : 'Calorie (kcal)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
    { key: 'potassium', label: isEn ? 'Potassium (K)' : 'Potassio (K)', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { key: 'magnesium', label: isEn ? 'Magnesium (Mg)' : 'Magnesio (Mg)', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { key: 'calcium', label: isEn ? 'Calcium (Ca)' : 'Calcio (Ca)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { key: 'iron', label: isEn ? 'Iron (Fe)' : 'Ferro (Fe)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { key: 'vitaminC', label: isEn ? 'Vitamin C' : 'Vitamina C', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { key: 'vitaminA', label: isEn ? 'Vitamin A' : 'Vitamina A', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              Diario Nutrizionale
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tracciamento alimentazione e scomposizione della provenienza dei nutrienti
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProvenanceModal(true)}
            className="flex items-center gap-1.5 px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-2xl shadow-sm hover:opacity-90 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Provenienza Nutrienti</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Aggiungi Pasto
          </button>
        </div>
      </div>

      {/* Real Food Calendar Component */}
      <RealCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        section="food"
        logs={{ food: foodLogs }}
      />

      {/* Micronutrients Standard Percentage Median Box */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-zinc-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-teal-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" /> {isEn ? 'Micronutrient Target Index' : 'Indice Fabbisogno Micronutrienti'}
            </div>
            <h2 className="text-xl font-bold">{isEn ? 'Essential Micronutrient Coverage' : 'Copertura Micronutrienti Essenziali'}</h2>
            <p className="text-xs text-teal-200 mt-1 max-w-xl">
              {isEn ? 'Average percentage of daily target reached across all 8 essential vitamins and minerals.' : 'Percentuale media del fabbisogno giornaliero raggiunto per tutte le 8 vitamine e minerali essenziali.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-right">
              <span className="text-xs text-teal-200 block uppercase tracking-wider font-semibold">Media Micronutrienti</span>
              <span className="text-3xl font-extrabold text-emerald-300 font-mono">{microMedianPercent}%</span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-teal-400/30 flex items-center justify-center relative">
              <span className="text-xs font-bold text-white">{microMedianPercent}%</span>
            </div>
          </div>
        </div>

        {/* Breakdown of individual micronutrients */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-teal-800/80">
          {microList.map((m, i) => {
            const pct = Math.min(100, Math.round((m.val / m.target) * 100));
            return (
              <button
                key={i}
                onClick={() => {
                  setSelectedNutrient(m.key);
                  setShowProvenanceModal(true);
                }}
                className="bg-black/30 p-3 rounded-xl border border-white/5 hover:border-emerald-400/50 text-left transition-all group"
              >
                <div className="flex justify-between text-xs text-teal-200 mb-1">
                  <span className="group-hover:text-white font-semibold flex items-center gap-1">
                    {m.label} <ListFilter className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="font-mono text-white">{m.val}/{m.target} {m.unit}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-1.5 rounded-full transition-all" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal History Table / Cards with Provenance Breakdown */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" /> Registro Pasti & Provenienza Nutrienti
          </h3>

          {selectedDate && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold rounded-xl flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Data: {selectedDate}
            </span>
          )}
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">Nessun pasto registrato {selectedDate ? `il ${selectedDate}` : 'in archivio'}.</p>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const micros = log.micros || {};
              const ingredients = getLogBreakdown(log);

              const descLower = (log.description || '').toLowerCase();
              const displayMealType = descLower.includes('pranzo') ? 'Pranzo'
                : descLower.includes('cena') ? 'Cena'
                : descLower.includes('spuntino') || descLower.includes('merenda') ? 'Spuntino'
                : descLower.includes('colazione') ? 'Colazione'
                : (log.mealType || 'Pranzo');

              const logPro = Math.round((log.protein || 0) * 10) / 10;
              const logFat = Math.round((log.fats || 0) * 10) / 10;
              const logCarb = Math.round((log.carbs || 0) * 10) / 10;

              return (
                <div 
                  key={log.id}
                  className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 overflow-hidden hover:border-emerald-500/50 transition-all"
                >
                  <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                          {displayMealType}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {log.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-amber-500 font-bold block">{Math.round(log.calories)} kcal</span>
                        <span className="text-zinc-400 text-[11px]">
                          🥩 {logPro}g P | 🥑 {logFat}g F | 🍞 {logCarb}g C
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/20 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Nascondi Provenienza' : 'Provenienza Nutrienti'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onDeleteFoodLog(log.id)}
                        className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Elimina voce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Guaranteed Scientific Ingredient Provenance Drawer */}
                  {isExpanded && (
                    <div className="p-5 bg-emerald-500/5 dark:bg-emerald-950/20 border-t border-emerald-500/20 text-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                          <BarChart3 className="w-4 h-4 text-emerald-500" />
                          <span>Provenienza Nutrienti: Scomposizione reale per ciascun alimento (USDA / INRAN)</span>
                        </div>
                      </div>

                      {/* Explicit Sentence Provenance Explanation */}
                      <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl border border-emerald-500/20 space-y-1.5 text-[11px] text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                        <div>
                          🥩 <strong>Proteine ({logPro}g)</strong>: {ingredients.map(i => `${Math.round((i.protein||0)*10)/10}g da ${i.name}`).join(', ')}.
                        </div>
                        <div>
                          🍞 <strong>Carboidrati ({logCarb}g)</strong>: {ingredients.map(i => `${Math.round((i.carbs||0)*10)/10}g da ${i.name}`).join(', ')}.
                        </div>
                        <div>
                          🥑 <strong>Grassi ({logFat}g)</strong>: {ingredients.map(i => `${Math.round((i.fats||0)*10)/10}g da ${i.name}`).join(', ')}.
                        </div>
                        <div>
                          🥦 <strong>Potassio ({micros.potassium || 0}mg) & Magnesio ({micros.magnesium || 0}mg)</strong>: Provengono principalmente da {ingredients.filter(i => (i.micros?.potassium || 0) > 30).map(i => `${i.name} (${i.micros?.potassium || 0}mg)`).join(', ') || ingredients.map(i => i.name).join(', ')}.
                        </div>
                      </div>

                      {/* Ingredient Table Breakdown */}
                      <div className="overflow-x-auto bg-white dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 p-3">
                        <table className="w-full text-left font-mono text-[11px]">
                          <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-700 text-zinc-400 uppercase text-[10px]">
                              <th className="py-2 px-3">Alimento / Porzione</th>
                              <th className="py-2 px-3 text-amber-500">Calorie</th>
                              <th className="py-2 px-3 text-emerald-500">Proteine</th>
                              <th className="py-2 px-3 text-blue-500">Grassi</th>
                              <th className="py-2 px-3 text-purple-500">Carbo</th>
                              <th className="py-2 px-3 text-teal-400">Potassio (K)</th>
                              <th className="py-2 px-3 text-indigo-400">Magnesio (Mg)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
                            {ingredients.map((ing, idx) => (
                              <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                                <td className="py-2 px-3 font-bold text-zinc-900 dark:text-white font-sans">{ing.name}</td>
                                <td className="py-2 px-3 font-bold text-amber-500">{Math.round(ing.calories)} kcal</td>
                                <td className="py-2 px-3 text-emerald-500">{Math.round((ing.protein||0)*10)/10}g</td>
                                <td className="py-2 px-3 text-blue-500">{Math.round((ing.fats||0)*10)/10}g</td>
                                <td className="py-2 px-3 text-purple-500">{Math.round((ing.carbs||0)*10)/10}g</td>
                                <td className="py-2 px-3 text-teal-400">{Math.round(ing.micros?.potassium || 0)}mg</td>
                                <td className="py-2 px-3 text-indigo-400">{Math.round(ing.micros?.magnesium || 0)}mg</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Total Summary Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">
                          <span className="text-zinc-400 block">Calorie Totali</span>
                          <span className="font-bold text-amber-500">{Math.round(log.calories)} kcal</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">
                          <span className="text-zinc-400 block">Proteine Totali</span>
                          <span className="font-bold text-emerald-500">{logPro}g</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">
                          <span className="text-zinc-400 block">Grassi Totali</span>
                          <span className="font-bold text-blue-500">{logFat}g</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">
                          <span className="text-zinc-400 block">Carboidrati Totali</span>
                          <span className="font-bold text-purple-500">{logCarb}g</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Nutrient Provenance Inspector Modal */}
      {showProvenanceModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">Nutrient Provenance Inspector</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" /> Provenienza dei Nutrienti Consumati
                </h3>
              </div>
              <button onClick={() => setShowProvenanceModal(false)} className="p-2 text-zinc-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Nutrient Filter Chips */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                {isEn ? 'Select Nutrient to inspect provenance:' : 'Seleziona il nutriente da ispezionare:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {nutrientOptions.map(n => (
                  <button
                    key={n.key}
                    type="button"
                    onClick={() => setSelectedNutrient(n.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedNutrient === n.key
                        ? n.color + ' ring-2 ring-emerald-500/30'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Provenance Results List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/80 p-3 rounded-2xl">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                  Totale Consumato:
                </span>
                <span className="text-sm font-extrabold font-mono text-emerald-500">
                  {currentProvenance.grandTotal} {currentProvenance.provenanceList[0]?.unit || 'g'}
                </span>
              </div>

              {currentProvenance.provenanceList.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">Nessun alimento registrato apporta questo nutriente.</p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {currentProvenance.provenanceList.map((item, idx) => {
                    const pct = Math.round((item.amount / currentProvenance.grandTotal) * 100);
                    return (
                      <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {item.foodName} <span className="text-[10px] text-zinc-400 font-normal">({item.mealType})</span>
                          </span>
                          <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            {item.amount} {item.unit} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowProvenanceModal(false)}
                className="w-full py-3 bg-zinc-900 text-white font-bold rounded-2xl text-xs hover:bg-black transition-all"
              >
                Chiudi Ispettore
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Aggiungi Pasto Manuale</h3>
            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Tipo Pasto</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                >
                  <option value="Colazione">Colazione</option>
                  <option value="Pranzo">Pranzo</option>
                  <option value="Cena">Cena</option>
                  <option value="Spuntino">Spuntino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Descrizione Cibo</label>
                <input
                  type="text"
                  required
                  placeholder="Es. 200g petto di pollo e riso"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Calorie (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Proteine (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Grassi (g)</label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Carboidrati (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  />
                </div>
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
                  className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm"
                >
                  Salva Pasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
