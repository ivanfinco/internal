import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldCheck, ExternalLink, Activity, Server, Layers } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function DatabaseStatusModal({ onClose, lang = 'IT' }) {
  const isEn = lang === 'EN';
  const [status, setStatus] = useState({
    url: 'https://wowtpkqdfvnbzbuareda.supabase.co',
    isReachable: false,
    tablesExist: false,
    loading: true,
    errorMsg: null,
    tableDetails: [],
    pingMs: null
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, errorMsg: null }));
    const startTime = performance.now();

    try {
      // 1. Check user_profiles table
      const { error: pErr, count: pCount } = await supabase.from('user_profiles').select('id', { count: 'exact', head: true });
      // 2. Check food_logs table
      const { error: fErr, count: fCount } = await supabase.from('food_logs').select('id', { count: 'exact', head: true });
      // 3. Check training_logs table
      const { error: tErr, count: tCount } = await supabase.from('training_logs').select('id', { count: 'exact', head: true });
      // 4. Check trading_logs table
      const { error: trErr, count: trCount } = await supabase.from('trading_logs').select('id', { count: 'exact', head: true });

      const endTime = performance.now();
      const pingMs = Math.round(endTime - startTime);

      const tableDetails = [
        { name: 'user_profiles', label: 'Profilo & Target Utente', ok: !pErr, count: pCount || 0, err: pErr?.message },
        { name: 'food_logs', label: 'Diario Nutrizionale (Pasti)', ok: !fErr, count: fCount || 0, err: fErr?.message },
        { name: 'training_logs', label: 'Sessioni di Allenamento', ok: !tErr, count: tErr || 0, err: tErr?.message },
        { name: 'trading_logs', label: 'Ordini & Posizioni Trading', ok: !trErr, count: trCount || 0, err: trErr?.message }
      ];

      const allOk = tableDetails.every(t => t.ok);

      setStatus({
        url: 'https://wowtpkqdfvnbzbuareda.supabase.co',
        isReachable: true,
        tablesExist: allOk,
        loading: false,
        errorMsg: allOk ? null : 'Alcune tabelle non sono ancora attive su Supabase.',
        tableDetails,
        pingMs
      });
    } catch (err) {
      setStatus({
        url: 'https://wowtpkqdfvnbzbuareda.supabase.co',
        isReachable: false,
        tablesExist: false,
        loading: false,
        errorMsg: err.message || 'Impossibile contattare i server Cloud di Supabase.',
        tableDetails: [],
        pingMs: null
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-xl overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 cursor-default my-auto overflow-hidden"
      >
        
        {/* Modal Top Header */}
        <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Supabase Cloud Infrastructure</span>
                {status.pingMs && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                    ⚡ {status.pingMs} ms
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                Diagnostica Connessione Database
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status.loading ? (
          <div className="py-12 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Test diagnostico in corso...</h4>
              <p className="text-xs text-zinc-500">Interrogazione endpoint Supabase Cloud e stato tabelle PostgreSQL.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Status Summary Banner */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              status.tablesExist
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : status.isReachable
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}>
              {status.tablesExist ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <h4 className="font-extrabold text-base">
                  {status.tablesExist 
                    ? '🟢 Connessione Supabase & Cloud Sync Attivi al 100%!' 
                    : status.isReachable 
                    ? '🟡 Server Supabase Raggiungibile • Mancano le Tabelle' 
                    : '🔴 Errore Connessione Supabase'}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {status.tablesExist
                    ? 'Tutti i tuoi pasti, le sessioni di allenamento, gli ordini di trading ed il tuo profilo personale si sincronizzano in tempo reale sul Cloud e su tutti i tuoi dispositivi.'
                    : 'Il server Supabase risponde correttamente, ma devi eseguire lo script SQL nel tuo Supabase SQL Editor per creare le 4 tabelle.'}
                </p>
              </div>
            </div>

            {/* Cloud Endpoint & Database Metadata Info Box */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold font-sans">
                  <Server className="w-3.5 h-3.5 text-emerald-500" /> Endpoint Cloud Supabase:
                </span>
                <span className="text-zinc-900 dark:text-white font-bold">{status.url}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-700/60 pt-2">
                <span className="flex items-center gap-1.5 font-bold font-sans">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Motore Sincronizzazione:
                </span>
                <span className="text-emerald-500 font-bold font-sans">Postgres Real-time Subscriptions</span>
              </div>
            </div>

            {/* Table Details Matrix */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Stato Tabelle PostgreSQL:
                </span>
                <span className="text-[11px] font-mono text-zinc-400">4 / 4 Tabelle</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 font-mono text-xs">
                {status.tableDetails.map(t => (
                  <div key={t.name} className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">{t.name}</span>
                      <span className="text-[11px] font-sans text-zinc-400">{t.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {t.ok && (
                        <span className="px-2 py-0.5 text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg">
                          {t.count} record
                        </span>
                      )}
                      {t.ok ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1 font-sans">
                          <CheckCircle2 className="w-4 h-4" /> Collegata
                        </span>
                      ) : (
                        <span className="text-amber-500 text-xs font-sans font-bold">
                          ⚠️ Da creare in SQL
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={checkConnection}
                className="flex-1 py-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-xs"
              >
                <RefreshCw className="w-4 h-4" /> Ricontrolla Connessione
              </button>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Apri Dashboard Supabase
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
