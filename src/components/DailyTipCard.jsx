import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, X, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';

export default function DailyTipCard({ profile, logs, lang = 'IT' }) {
  const [tip, setTip] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const isEn = lang === 'EN';

  // Analyze profile & logs to derive a personalized daily tip
  const generatePersonalizedTip = () => {
    const food = logs.food || [];
    const training = logs.training || [];
    const target = profile.targets || {};

    const totalCal = food.reduce((a, b) => a + (b.calories || 0), 0);
    const totalP = food.reduce((a, b) => a + (b.protein || 0), 0);

    const preset = profile.preset || 'auto';
    const bodyType = profile.bodyType || 'fit';

    // Tip options pool based on data
    const tips = [];

    if (totalP < (target.protein || 160) * 0.7) {
      tips.push({
        title: isEn ? "💡 Boost Your Protein Intake" : "💡 Incrementa l'Apporto Proteico",
        body: isEn
          ? `Based on your recent logs, you logged ${totalP}g of protein out of your ${target.protein || 180}g target. Consider adding 1 scoop of whey or 150g greek yogurt as a snack to optimize muscle recovery.`
          : `Dai tuoi registri recenti, hai totalizzato ${totalP}g di proteine rispetto al target di ${target.protein || 180}g. Valuta di aggiungere uno snack con 150g di yogurt greco o uno shake proteico per sostenere la sintesi muscolare.`
      });
    }

    if (training.length > 0) {
      const lastWorkout = training[0];
      tips.push({
        title: isEn ? `💡 Post-Workout Recovery (${lastWorkout.title})` : `💡 Recupero Post-Workout (${lastWorkout.title})`,
        body: isEn
          ? `You completed an intense session: "${lastWorkout.title}". Make sure to drink at least 2.5L of water today and maintain good sleep quality for optimal muscle growth.`
          : `Hai completato una sessione intensa: "${lastWorkout.title}". Assicurati di bere almeno 2.5L di acqua oggi e dormire 7-8 ore per ottimizzare il recupero e la supercompensazione.`
      });
    }

    if (preset === 'cut') {
      tips.push({
        title: isEn ? "💡 Cut Strategy Tip: Satiety & High-Volume Foods" : "💡 Tip Strategia Cut: Sazietà & Cibi ad Alto Volume",
        body: isEn
          ? "You are currently in a Fat Loss (Cut) deficit. Prioritize high-volume low-calorie foods like steamed broccoli, boiled potatoes, and berries to stay full effortlessly."
          : "Sei attualmente in fase di Definizione (Cut). Prediligi cibi ad alto volume e basse calorie come broccoli a vapore, verdure a foglia verde e patate lesse per mantenere la sazietà ai massimi livelli."
      });
    } else if (preset === 'bulk') {
      tips.push({
        title: isEn ? "💡 Bulk Strategy Tip: Calorie Density & Carbs" : "💡 Tip Strategia Bulk: Densità Calorica & Carboidrati",
        body: isEn
          ? "You are in Muscle Growth (Bulk) mode. Ensure you consume nutrient-dense carbs like basmati rice and healthy fats (olive oil, almonds) to easily reach your daily target."
          : "Sei in fase di Crescita Muscolare (Bulk). Assicurati di consumare carboidrati puliti come riso basmati e grassi sani (olio EVO, mandorle, burro d'arachidi) per raggiungere agevolmente il surplus energetico."
      });
    }

    // Default lifestyle tip fallback
    tips.push({
      title: isEn ? "💡 Daily Health & Metabolism Rule" : "💡 Regola Quotidiana per Salute & Metabolismo",
      body: isEn
        ? "Drinking a large glass of water right upon waking up reactivates your digestion, boosts metabolic rate, and improves focus for the rest of the day."
        : "Bere un bicchiere d'acqua a temperatura ambiente appena svegli riattiva la digestione, stimola il metabolismo basale e migliora la concentrazione per tutta la giornata."
    });

    // Pick tip deterministically or based on hour
    const selected = tips[Math.floor(Math.random() * tips.length)];
    setTip(selected);
  };

  useEffect(() => {
    generatePersonalizedTip();
  }, [profile, logs, lang]);

  if (dismissed || !tip) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 dark:from-amber-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 border border-amber-500/30 dark:border-emerald-500/30 rounded-3xl p-5 shadow-sm relative overflow-hidden transition-all animate-fadeIn">
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-md">
                AI Lifestyle & Nutrition Tip
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {isEn ? 'Personalized for you' : 'Personalizzata per te'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              {tip.title}
            </h4>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {tip.body}
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white rounded-xl hover:bg-black/10 transition-all shrink-0"
          title="Chiudi consiglio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
