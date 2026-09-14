import React from 'react';
import { Wallet, Construction, Sparkles, PieChart, CreditCard, Landmark, ArrowUpRight, Lock } from 'lucide-react';

export default function FinanceView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Banner Work In Progress */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Construction className="w-4 h-4 animate-bounce" /> Work In Progress
            </div>
            <h1 className="text-3xl font-extrabold">Sezione Finance & Personal Banking</h1>
            <p className="text-sm text-amber-100 max-w-xl">
              Modulo in fase di sviluppo avanzato. Presto potrai tracciare spese, budget mensili, cash flow e portafoglio investimenti in tempo reale.
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0">
            <Lock className="w-8 h-8 mx-auto mb-1 text-amber-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-100">Lancio Imminente</span>
          </div>
        </div>
      </div>

      {/* Interactive Teaser / Prototype Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-75 grayscale-25 hover:grayscale-0 transition-all duration-300">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <PieChart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Budget & Cash Flow</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Monitoraggio intelligente delle uscite mensili con categorizzazione automatica AI.
          </p>
          <div className="pt-2">
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-2 bg-amber-500 w-3/4 rounded-full" />
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1 font-mono">75% Completato</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Patrimonio Netto</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Aggregazione conti bancari, asset liquidi e conti di deposito per una visione d'insieme.
          </p>
          <div className="pt-2">
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-2 bg-emerald-500 w-1/2 rounded-full" />
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1 font-mono">50% Completato</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Investimenti & Dividendi</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Tracciamento passività, rendimenti storici e dividendi staccati periodicamente.
          </p>
          <div className="pt-2">
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-2 bg-indigo-500 w-2/3 rounded-full" />
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1 font-mono">65% Completato</span>
          </div>
        </div>

      </div>

    </div>
  );
}
