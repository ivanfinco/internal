import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Plus, Trash2, Edit2, ShieldCheck, DollarSign, Activity, Filter, Check, X, Sparkles, Send } from 'lucide-react';
import RealCalendar from './RealCalendar';
import { parseTradeEditInstruction } from '../utils/aiParser';

export default function TradingView({ tradingLogs, onAddTradingLog, onDeleteTradingLog, onUpdateTradingLog, lang = 'IT' }) {
  const isEn = lang === 'EN';
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // AI Prompt edit state
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Manual Add Form State
  const [ticker, setTicker] = useState('BTC/USDT');
  const [type, setType] = useState('BUY');
  const [entryPrice, setEntryPrice] = useState(62500);
  const [takeProfit, setTakeProfit] = useState(66000);
  const [stopLoss, setStopLoss] = useState(60000);
  const [notes, setNotes] = useState('Breakout di struttura 4H');

  // Edit Modal Form State
  const [editTicker, setEditTicker] = useState('');
  const [editType, setEditType] = useState('BUY');
  const [editEntryPrice, setEditEntryPrice] = useState(0);
  const [editTakeProfit, setEditTakeProfit] = useState(0);
  const [editStopLoss, setEditStopLoss] = useState(0);
  const [editStatus, setEditStatus] = useState('APERTO');
  const [editPnl, setEditPnl] = useState('0.0%');
  const [editNotes, setEditNotes] = useState('');

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newLog = {
      id: 'tr_' + Date.now(),
      timestamp,
      ticker: ticker.toUpperCase(),
      type,
      entryPrice: Number(entryPrice),
      takeProfit: Number(takeProfit),
      stopLoss: Number(stopLoss),
      size: '1 Posizione',
      status: 'APERTO',
      notes,
      pnl: '0.0%'
    };

    onAddTradingLog(newLog);
    setShowAddModal(false);
  };

  const handleStartEdit = (tr) => {
    setEditingTrade(tr);
    setAiEditPrompt('');
    setEditTicker(tr.ticker);
    setEditType(tr.type);
    setEditEntryPrice(tr.entryPrice);
    setEditTakeProfit(tr.takeProfit);
    setEditStopLoss(tr.stopLoss);
    setEditStatus(tr.status || 'APERTO');
    setEditPnl(tr.pnl || '0.0%');
    setEditNotes(tr.notes || '');
  };

  const handleApplyAiEdit = async (e) => {
    e.preventDefault();
    if (!aiEditPrompt.trim() || !editingTrade || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      const updatedByAi = await parseTradeEditInstruction(aiEditPrompt, editingTrade, lang);
      if (updatedByAi) {
        setEditTicker(updatedByAi.ticker || editTicker);
        setEditType(updatedByAi.type || editType);
        setEditEntryPrice(updatedByAi.entryPrice || editEntryPrice);
        setEditTakeProfit(updatedByAi.takeProfit || editTakeProfit);
        setEditStopLoss(updatedByAi.stopLoss || editStopLoss);
        setEditStatus(updatedByAi.status || editStatus);
        setEditPnl(updatedByAi.pnl || editPnl);
        setEditNotes(updatedByAi.notes || editNotes);
        setAiEditPrompt('');

        // Apply immediately in real-time to global app state!
        if (onUpdateTradingLog) {
          onUpdateTradingLog(updatedByAi);
        }
        setEditingTrade(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTrade) return;

    const updated = {
      ...editingTrade,
      ticker: editTicker.toUpperCase(),
      type: editType,
      entryPrice: Number(editEntryPrice),
      takeProfit: Number(editTakeProfit),
      stopLoss: Number(editStopLoss),
      status: editStatus,
      pnl: editPnl,
      notes: editNotes
    };

    if (onUpdateTradingLog) {
      onUpdateTradingLog(updated);
    }
    setEditingTrade(null);
  };

  const filteredLogs = selectedDate
    ? tradingLogs.filter(log => log.timestamp.startsWith(selectedDate))
    : tradingLogs;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              Sezione Trading & Market Logs
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tracciamento e gestione delle posizioni crypto, stock e forex
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Aggiungi Trade
        </button>
      </div>

      {/* Real Interactive Calendar Component */}
      <RealCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        section="trading"
        logs={{ trading: tradingLogs }}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-900 text-white p-5 rounded-3xl border border-purple-800/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-xs text-purple-200 block uppercase font-semibold">Operazioni Loggate</span>
            <span className="text-2xl font-extrabold font-mono">{tradingLogs.length} Posizioni</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-900 text-white p-5 rounded-3xl border border-emerald-800/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-emerald-200 block uppercase font-semibold">Win Rate Globale</span>
            <span className="text-2xl font-extrabold font-mono">78.5% Target</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-900 text-white p-5 rounded-3xl border border-indigo-800/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
            <DollarSign className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs text-indigo-200 block uppercase font-semibold">PnL Cumulato</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">+$1,450.00</span>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-500" /> Registro Ordini & Performance
          </h3>

          {selectedDate && (
            <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold rounded-xl flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtrato per data: {selectedDate}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase text-zinc-400 font-semibold">
                <th className="py-3 px-4">Data / Ora</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Prezzo Entry</th>
                <th className="py-3 px-4">Take Profit</th>
                <th className="py-3 px-4">Stop Loss</th>
                <th className="py-3 px-4">Stato</th>
                <th className="py-3 px-4">PnL</th>
                <th className="py-3 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs font-medium">
              {filteredLogs.map((tr) => {
                const isBuy = tr.type === 'BUY' || tr.type === 'LONG';
                return (
                  <tr key={tr.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all">
                    <td className="py-4 px-4 font-mono text-zinc-400 whitespace-nowrap flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {tr.timestamp}
                    </td>
                    <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white font-mono">
                      {tr.ticker}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        isBuy
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {tr.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                      ${tr.entryPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                      ${tr.takeProfit.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-rose-500">
                      ${tr.stopLoss.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                        {tr.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-500">
                      {tr.pnl}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleStartEdit(tr)}
                        className="px-2.5 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-all inline-flex items-center gap-1"
                        title="Modifica trade con Assistant AI"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Modifica AI</span>
                      </button>
                      <button
                        onClick={() => onDeleteTradingLog(tr.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Elimina trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Aggiungi Trade Manuale</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Ticker / Asset</label>
                  <input
                    type="text"
                    required
                    placeholder="BTC/USDT"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Tipo Ordine</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  >
                    <option value="BUY">BUY / LONG</option>
                    <option value="SELL">SELL / SHORT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Entry ($)</label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">TP ($)</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">SL ($)</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Note & Rationale</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Analisi tecnica..."
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
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl text-sm"
                >
                  Salva Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trade Modal with Natural Language AI Instruction Bar */}
      {editingTrade && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest block">Assistant AI Real-time Edit</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-mono">
                  Modifica Trade [{editingTrade.ticker}]
                </h3>
              </div>
              <button onClick={() => setEditingTrade(null)} className="p-2 text-zinc-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Prompt Box: Tell AI how to modify trade */}
            <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-teal-500/10 border border-purple-500/30 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                <span>{isEn ? 'Instruct Assistant AI to modify this trade:' : 'Comunica ad Assistant AI la modifica del trade:'}</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiEditPrompt}
                  onChange={(e) => setAiEditPrompt(e.target.value)}
                  placeholder={isEn ? "e.g. 'Set TP to $68,500 and close position with +12.5% PnL'" : "es. 'Imposta TP a 68500$ e chiudi la posizione in profitto del +12.5%'"}
                  className="flex-1 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleApplyAiEdit}
                  disabled={!aiEditPrompt.trim() || isAiProcessing}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-md shadow-purple-500/20"
                >
                  {isAiProcessing ? <span className="animate-pulse">AI...</span> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Ticker / Asset</label>
                  <input
                    type="text"
                    required
                    value={editTicker}
                    onChange={(e) => setEditTicker(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-mono font-bold dark:text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Tipo Ordine</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  >
                    <option value="BUY">BUY / LONG</option>
                    <option value="SELL">SELL / SHORT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Entry ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={editEntryPrice}
                    onChange={(e) => setEditEntryPrice(e.target.value)}
                    className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">TP ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={editTakeProfit}
                    onChange={(e) => setEditTakeProfit(e.target.value)}
                    className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">SL ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={editStopLoss}
                    onChange={(e) => setEditStopLoss(e.target.value)}
                    className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Stato Posizione</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white"
                  >
                    <option value="APERTO">APERTO</option>
                    <option value="CHIUSO">CHIUSO</option>
                    <option value="ANNULLATO">ANNULLATO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">PnL / Risultato</label>
                  <input
                    type="text"
                    value={editPnl}
                    onChange={(e) => setEditPnl(e.target.value)}
                    placeholder="es. +5.4% o +$500"
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-mono font-bold text-emerald-500 dark:text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Note & Rationale</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium dark:text-white h-20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTrade(null)}
                  className="flex-1 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-xl text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> Conferma & Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
