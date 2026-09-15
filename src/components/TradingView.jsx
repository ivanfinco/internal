import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Plus, Trash2, ShieldCheck, DollarSign, Activity, Filter, Check, X, Sparkles, PieChart, BarChart2, Award, Zap } from 'lucide-react';
import RealCalendar from './RealCalendar';
import { getLocalDateStr, getLocalTimestampStr } from '../utils/dateUtils';

export default function TradingView({ tradingLogs = [], onAddTradingLog, onDeleteTradingLog, lang = 'IT' }) {
  const isEn = lang === 'EN';
  const safeLogs = Array.isArray(tradingLogs) ? tradingLogs : [];

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr());

  // Manual Add Form State
  const [ticker, setTicker] = useState('MNQ1!');
  const [type, setType] = useState('BUY');
  const [entryPrice, setEntryPrice] = useState(19500);
  const [takeProfit, setTakeProfit] = useState(19800);
  const [stopLoss, setStopLoss] = useState(19400);
  const [notes, setNotes] = useState('Breakout 5 micro contratti MNQ');

  // ═══════════════════════════════════════════════════
  // REAL STATISTICAL CALCULATORS FOR TRADING & FUTURES
  // ═══════════════════════════════════════════════════
  const parsePnlNum = (pnlStr) => {
    if (!pnlStr) return 0;
    const str = String(pnlStr);
    const dollarMatch = str.match(/([+-]?\$[\d,]+)/) || str.match(/([+-]?[\d,]+\$)/);
    if (dollarMatch) {
      const clean = dollarMatch[1].replace('$', '').replace(/,/g, '').trim();
      const val = parseFloat(clean);
      if (!isNaN(val)) return val;
    }
    const clean = str.replace('$', '').replace('%', '').replace('+', '').replace(/,/g, '').trim();
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const totalTradesCount = safeLogs.length;
  const closedTrades = safeLogs.filter(t => t && (t.status === 'CHIUSO' || t.status === 'CLOSED'));
  const openTradesCount = safeLogs.filter(t => t && (t.status === 'APERTO' || t.status === 'OPEN' || !t.status)).length;

  const winningTrades = closedTrades.filter(t => parsePnlNum(t.pnl) > 0);
  const losingTrades = closedTrades.filter(t => parsePnlNum(t.pnl) < 0);

  const realWinRate = closedTrades.length > 0 
    ? Math.round((winningTrades.length / closedTrades.length) * 1000) / 10 
    : (safeLogs.length > 0 ? 100 : 0);

  const totalPnlVal = safeLogs.reduce((sum, t) => sum + parsePnlNum(t.pnl), 0);
  const realPnlDisplay = (totalPnlVal >= 0 ? '+$' : '-$') + Math.abs(Math.round(totalPnlVal)).toLocaleString();

  const grossProfit = winningTrades.reduce((sum, t) => sum + parsePnlNum(t.pnl), 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + parsePnlNum(t.pnl), 0));
  const realProfitFactor = grossLoss > 0 
    ? (grossProfit / grossLoss).toFixed(2) 
    : grossProfit > 0 ? 'MAX' : '1.00';

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    const timestamp = getLocalTimestampStr();

    const newLog = {
      id: 'tr_' + Date.now(),
      timestamp,
      ticker: ticker.toUpperCase(),
      type,
      entryPrice: Number(entryPrice) || 0,
      takeProfit: Number(takeProfit) || 0,
      stopLoss: Number(stopLoss) || 0,
      size: '1 Contratto',
      status: 'APERTO',
      notes,
      pnl: '$0'
    };

    setSelectedDate(null);
    onAddTradingLog(newLog);
    setShowAddModal(false);
  };

  const filteredLogs = selectedDate
    ? safeLogs.filter(log => log && log.timestamp && log.timestamp.startsWith(selectedDate))
    : safeLogs;

  const formatPrice = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '$0';
    return '$' + num.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pb-8 sm:pb-12 px-2 sm:px-4 md:px-0">
      
      {/* Header Banner - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
              Sezione Trading & Market Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tracciamento e gestione delle posizioni Futures (MNQ, NQ, MES, ES), Crypto e Stock
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Aggiungi Trade
        </button>
      </div>

      {/* Performance Recap Bar */}
      <div className="p-3 sm:p-4 bg-zinc-900 border border-purple-500/40 rounded-2xl text-xs font-mono text-zinc-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-white font-sans text-xs sm:text-sm">Recap Prestazioni Trading:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-bold w-full sm:w-auto justify-between sm:justify-end">
          <div>📊 Posizioni: <strong className="text-white font-mono">{totalTradesCount}</strong></div>
          <div>🎯 Win Rate: <strong className="text-emerald-400 font-mono">{realWinRate}%</strong></div>
          <div>🏆 Profit Factor: <strong className="text-indigo-300 font-mono">{realProfitFactor}</strong></div>
          <div>💰 PnL Netto: <strong className={totalPnlVal >= 0 ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>{realPnlDisplay}</strong></div>
        </div>
      </div>

      {/* Real Summary KPI Cards - Mobile Grid 2x2 & iPad/Desktop 4x1 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Trades Card */}
        <div className="bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-900 text-white p-4 sm:p-5 rounded-3xl border border-purple-800/60 shadow-sm flex flex-col justify-between space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs text-purple-300 uppercase tracking-wider font-bold">Posizioni Totali</span>
            <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono block">{totalTradesCount}</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-400">
              {openTradesCount} Aperte • {closedTrades.length} Chiuse
            </span>
          </div>
        </div>

        {/* Real Win Rate Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-900 text-white p-4 sm:p-5 rounded-3xl border border-emerald-800/60 shadow-sm flex flex-col justify-between space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs text-emerald-300 uppercase tracking-wider font-bold">Win Rate Reale</span>
            <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 block">{realWinRate}%</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-400">
              {winningTrades.length} W / {losingTrades.length} L su posizioni chiuse
            </span>
          </div>
        </div>

        {/* Real Cumulative PnL Card */}
        <div className={`bg-gradient-to-br text-white p-4 sm:p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-2 sm:space-y-3 ${
          totalPnlVal >= 0
            ? 'from-emerald-950 via-zinc-900 to-zinc-900 border-emerald-800/60'
            : 'from-rose-950 via-zinc-900 to-zinc-900 border-rose-800/60'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs text-indigo-300 uppercase tracking-wider font-bold">PnL Cumulato Reale</span>
            <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className={`text-xl sm:text-2xl font-extrabold font-mono block ${totalPnlVal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {realPnlDisplay}
            </span>
            <span className="text-[10px] sm:text-[11px] text-zinc-400">
              Rendimento complessivo portafoglio
            </span>
          </div>
        </div>

        {/* Real Profit Factor Card */}
        <div className="bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-800/60 shadow-sm flex flex-col justify-between space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs text-indigo-300 uppercase tracking-wider font-bold">Profit Factor</span>
            <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-300 block">{realProfitFactor}</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-400">
              Rapporto Vincite / Perdite
            </span>
          </div>
        </div>

      </div>

      {/* Real Interactive Calendar Component */}
      <RealCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        section="trading"
        logs={{ trading: safeLogs }}
      />

      {/* Trades Table - Responsive Overflow */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" /> Registro Ordini & Performance ({filteredLogs.length})
          </h3>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all"
            >
              <Filter className="w-3 h-3" /> Filtrato: {selectedDate}
            </button>
          )}
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-xs sm:text-sm text-zinc-500 text-center py-8">Nessun trade registrato {selectedDate ? `il ${selectedDate}` : 'in archivio'}.</p>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase text-zinc-400 font-semibold">
                  <th className="py-3 px-3 sm:px-4">Data / Ora</th>
                  <th className="py-3 px-3 sm:px-4">Asset</th>
                  <th className="py-3 px-3 sm:px-4">Tipo</th>
                  <th className="py-3 px-3 sm:px-4">Prezzo Entry</th>
                  <th className="py-3 px-3 sm:px-4">Take Profit</th>
                  <th className="py-3 px-3 sm:px-4">Stop Loss</th>
                  <th className="py-3 px-3 sm:px-4">Stato</th>
                  <th className="py-3 px-3 sm:px-4">PnL</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs font-medium">
                {filteredLogs.map((tr) => {
                  if (!tr) return null;
                  const isBuy = tr.type === 'BUY' || tr.type === 'LONG';
                  return (
                    <tr key={tr.id || Math.random()} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all">
                      <td className="py-3.5 px-3 sm:px-4 font-mono text-zinc-400 whitespace-nowrap flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {tr.timestamp || 'N/D'}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-bold text-zinc-900 dark:text-white font-mono text-xs">
                        {tr.ticker || 'N/D'}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          isBuy
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {tr.type || 'BUY'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-mono text-zinc-700 dark:text-zinc-300 text-xs">
                        {formatPrice(tr.entryPrice || tr.entry_price)}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                        {formatPrice(tr.takeProfit || tr.take_profit)}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-mono text-rose-500 text-xs">
                        {formatPrice(tr.stopLoss || tr.stop_loss)}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                          {tr.status || 'APERTO'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-emerald-500 text-xs">
                        {tr.pnl || '$0'}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onDeleteTradingLog(tr.id)}
                          className="p-1 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Elimina trade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">Aggiungi Trade Manuale</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Ticker / Asset</label>
                  <input
                    type="text"
                    required
                    placeholder="MNQ1!"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-medium dark:text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Tipo Ordine</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-medium dark:text-white"
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
                    className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">TP ($)</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">SL ($)</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Note & Rationale</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Analisi tecnica..."
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-medium dark:text-white h-20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 sm:py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-xl text-xs sm:text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 bg-purple-600 text-white font-bold rounded-xl text-xs sm:text-sm"
                >
                  Salva Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
