import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginModal({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toUpperCase();
    const cleanPass = password.trim();

    if (cleanUser === 'IVAN' && cleanPass === 'LUCKY') {
      setIsSubmitting(true);
      setTimeout(() => {
        onLogin({ name: 'Ivan', role: 'Admin' });
      }, 500);
    } else {
      setError('Credenziali errate! Username "IVAN" e Password "LUCKY"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-8 transition-all relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 text-white">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Accesso Riservato
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Internal AI Assistant & Personal Hub
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-medium animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="IVAN"
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Accesso in corso...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Entra nel Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          Uso interno riservato ad Ivan • Antigravity AI Powered
        </div>
      </div>
    </div>
  );
}
