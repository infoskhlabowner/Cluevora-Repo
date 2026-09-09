const fs = require('fs');
let content = fs.readFileSync('src/screens/CaseScreen.tsx', 'utf8');

// Add useEffect import
content = content.replace('import { useState }', 'import { useState, useEffect }');

// Add generateCaseVocab import
content = content.replace('import { useStore } from "../store/useStore";', 'import { useStore } from "../store/useStore";\nimport { generateCaseVocab } from "../lib/vocabGenerator";');

// Extract setActiveDictionary
content = content.replace('const { stats, solveCase, spendCoins } = useStore();', 'const { stats, solveCase, spendCoins, setActiveDictionary } = useStore();');

// Insert useEffect after caseData
const useEffectCode = `
  useEffect(() => {
    if (caseData) {
      // Gather all text
      const fullText = [
        caseData.introduction,
        ...caseData.suspects.map(s => s.statement),
        ...caseData.clues.map(c => c.description),
        ...caseData.timeline.map(t => t.description)
      ].join(' ');
      
      generateCaseVocab(fullText).then(dict => {
        setActiveDictionary(dict);
      });
    }
  }, [caseData, setActiveDictionary]);
`;

content = content.replace('  if (!caseData) return <div className="p-6">Case not found</div>;', useEffectCode + '\n  if (!caseData) return <div className="p-6">Case not found</div>;');

fs.writeFileSync('src/screens/CaseScreen.tsx', content);
console.log('Updated CaseScreen.tsx');
