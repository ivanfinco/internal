import { parseScientificBreakdown } from '../src/utils/nutritionEngine.js';

const testInput = "Colazione: 350g di yogurt greco 0%, 50g di frutti di bosco, Un cucchiaino abbondante di burro di 100% mandorle pelate, 200ml di latte di mandorle senza zuccheri senza olio, 1 kiwi gold, 1 caffe espresso, Cannella, Dolcificante zero";
const breakdown = parseScientificBreakdown(testInput);

console.log("=== SCIENTIFIC BREAKDOWN TEST RESULT ===");
console.log(JSON.stringify(breakdown, null, 2));

const totalCal = breakdown.reduce((s, i) => s + i.calories, 0);
const totalFat = Math.round(breakdown.reduce((s, i) => s + i.fats, 0) * 10) / 10;
const totalPro = Math.round(breakdown.reduce((s, i) => s + i.protein, 0) * 10) / 10;
const totalCarb = Math.round(breakdown.reduce((s, i) => s + i.carbs, 0) * 10) / 10;

console.log(`\nTOTALS: ${totalCal} kcal | ${totalPro}g P | ${totalFat}g F | ${totalCarb}g C`);
