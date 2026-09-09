const fs = require('fs');
let content = fs.readFileSync('src/screens/CaseScreen.tsx', 'utf8');

// Add getCaseImage import
content = content.replace('import { generateCaseVocab } from "../lib/vocabGenerator";', 'import { generateCaseVocab } from "../lib/vocabGenerator";\nimport { getCaseImage } from "../lib/images";');

const imageInsertion = `
                <div className="rounded-[32px] overflow-hidden mb-6 border border-[#E9EDC6] shadow-sm relative h-48 md:h-64">
                  <img src={getCaseImage(caseData.dayNumber)} referrerPolicy="no-referrer" alt="Case Cover" className="w-full h-full object-cover" />
                </div>
                
                <div className="bg-white rounded-[32px] p-6 border border-[#E9EDC6] shadow-sm">
`;

content = content.replace('<div className="bg-white rounded-[32px] p-6 border border-[#E9EDC6] shadow-sm">', imageInsertion);

fs.writeFileSync('src/screens/CaseScreen.tsx', content);
console.log('CaseScreen updated');
