const fs = require('fs');
let tsContent = fs.readFileSync('src/data/cases.ts', 'utf8');

if (!tsContent.includes("import generatedCases")) {
  tsContent = tsContent.replace("export const CASES: MysteryCase[] = [", "import generatedCases from './generated_cases.json';\n\nconst baseCases: MysteryCase[] = [");
  
  tsContent = tsContent + "\n\nexport const CASES: MysteryCase[] = [...baseCases, ...(generatedCases as MysteryCase[])];";
  
  fs.writeFileSync('src/data/cases.ts', tsContent);
  console.log("Updated cases.ts successfully.");
} else {
  console.log("Already updated.");
}
