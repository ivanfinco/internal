import { parseScientificBreakdown } from '../src/utils/nutritionEngine.js';

const testInput = "pranzo: 110g di pasta, 50g di passata di pomodoro senza alcun additivo, 26g di grana grattugiato, caffe espresso";
const breakdown = parseScientificBreakdown(testInput);

console.log("=== SCIENTIFIC BREAKDOWN TEST RESULT FOR PRANZO ===");
console.log(JSON.stringify(breakdown, null, 2));

const totalCal = breakdown.reduce((s, i) => s + i.calories, 0);
const totalFat = Math.round(breakdown.reduce((s, i) => s + i.fats, 0) * 10) / 10;
const totalPro = Math.round(breakdown.reduce((s, i) => s + i.protein, 0) * 10) / 10;
const totalCarb = Math.round(breakdown.reduce((s, i) => s + i.carbs, 0) * 10) / 10;

console.log(`\nTOTALS: ${totalCal} kcal | ${totalPro}g P | ${totalFat}g F | ${totalCarb}g C`);
