import { parseScientificBreakdown } from '../src/utils/nutritionEngine.js';

const testInput = "200ml latte di mandorle zero zuccheri e 7g di burro di mandorle pelate";
const breakdown = parseScientificBreakdown(testInput);

console.log("=== SCIENTIFIC BREAKDOWN TEST RESULT ===");
console.log(JSON.stringify(breakdown, null, 2));

const totalCal = breakdown.reduce((s, i) => s + i.calories, 0);
const totalFat = breakdown.reduce((s, i) => s + i.fats, 0);
const totalPro = breakdown.reduce((s, i) => s + i.protein, 0);
const totalCarb = breakdown.reduce((s, i) => s + i.carbs, 0);

console.log(`TOTALS: ${totalCal} kcal | ${totalPro}g P | ${totalFat}g F | ${totalCarb}g C`);
