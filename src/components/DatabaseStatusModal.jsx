import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldCheck, ExternalLink } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function DatabaseStatusModal({ onClose, lang = 'IT' }) {
  const isEn = lang === 'EN';
  const [status, setStatus] = useState({
    url: 'https://wowtpkqdfvnbzbuareda.supabase.co',
    isReachable: false,
    tablesExist: false,
    loading: true,
    errorMsg: null,
    tableDetails: []
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, errorMsg: null }));

    try {
      // 1. Check user_profiles table
      const { error: pErr } = await supabase.from('user_profiles').select('id').limit(1);
      // 2. Check food_logs table
      const { error: fErr } = await supabase.from('food_logs').select('id').limit(1);
      // 3. Check training_logs table
      const { error: tErr } = await supabase.from('training_logs').select('id').limit(1);
      // 4. Check trading_logs table
      const { error: trErr } = await supabase.from('trading_logs').select('id').limit(1);

      const tableDetails = [
        { name: 'user_profiles', ok: !pErr, err: pErr?.message },
        { name: 'food_logs', ok: !fErr, err: fErr?.message },
        { name: 'training_logs', ok: !tErr, err: tErr?.message },
        { name: 'trading_logs', ok: !trErr, err: trErr?.message }
      ];

      const allOk = tableDetails.every(t => t.ok);

      setStatus({
        url: 'https://wowtpkqdfvnbzbuareda.supabase.co',
        isReachable: true,
        tablesExist: allOk,
        loading: false,
        errorMsg: allOk ? null : 'Alcune tabelle non sono ancora create su Supabase.',
        tableDetails
      });
    } catch (err) {
      setStatus({
        url: 'https://wowtpkqdfvnbzbuareda.supabase.co',
        isReachable: false,
        tablesExist: false,
        loading: false,
        errorMsg: err.message || 'Impossibile contattare Supabase.',
        tableDetails: []
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 cursor-default my-auto"
      >
        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">Supabase Connection Status</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" /> Diagnostica Connessione Database
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status.loading ? (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs text-zinc-500">Verifica connessione a Supabase in corso...</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Status Summary Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              status.tablesExist
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : status.isReachable
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}>
              {status.tablesExist ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-sm">
                  {status.tablesExist 
                    ? '🟢 Connessione Supabase & Tabelle Attive al 100%!' 
                    : status.isReachable 
                    ? '🟡 Supabase Raggiungibile • Mancano le Tabelle' 
                    : '🔴 Errore Connessione Supabase'}
                </h4>
                <p>
                  {status.tablesExist
                    ? 'Tutti i pasti, gli allenamenti, i trade ed il profilo si sincronizzano sul Cloud in tempo reale.'
                    : 'Supabase risponde, ma devi eseguire lo script SQL nel tuo Supabase SQL Editor per creare le tabelle.'}
                </p>
              </div>
            </div>

            {/* Table Details Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Stato Tabelle PostgreSQL:</span>
              <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                {status.tableDetails.map(t => (
                  <div key={t.name} className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-white">{t.name}</span>
                    {t.ok ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Collegata
                      </span>
                    ) : (
                      <span className="text-amber-500 text-[11px] font-sans">
                        ⚠️ Da creare in SQL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={checkConnection}
                className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Ricontrolla Connessione
              </button>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Apri Dashboard Supabase
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
