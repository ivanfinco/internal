import { parseUserInput } from '../src/utils/aiParser.js';

async function runTest() {
  console.log("Testing parseUserInput with Gemini 2.5 API...");
  const result = await parseUserInput("food: ho mangiato 200g petto di pollo, 100g riso basmati e 15g olio evo");
  console.log("RESULT CATEGORY:", result.category);
  console.log("RESULT LOG:", JSON.stringify(result.log, null, 2));
  console.log("RESULT MESSAGE:\n", result.message);
}

runTest();
