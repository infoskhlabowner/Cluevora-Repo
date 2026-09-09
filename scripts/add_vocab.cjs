const fs = require('fs');

let content = fs.readFileSync('src/screens/CaseScreen.tsx', 'utf8');

// Add import
if (!content.includes('VocabText')) {
  content = content.replace('import { cn } from "../lib/utils";', 'import { cn } from "../lib/utils";\nimport VocabText from "../components/VocabText";');
}

// Replace caseData.introduction
content = content.replace(
  '<p className="text-[#434832] leading-relaxed text-sm">{caseData.introduction}</p>',
  '<p className="text-[#434832] leading-relaxed text-sm"><VocabText>{caseData.introduction}</VocabText></p>'
);

// Replace s.statement
content = content.replace(
  '<p className="text-sm text-[#434832] italic leading-relaxed">"{s.statement}"</p>',
  '<p className="text-sm text-[#434832] italic leading-relaxed">"<VocabText>{s.statement}</VocabText>"</p>'
);

// Replace c.description
content = content.replace(
  '<p className="text-sm text-[#434832] leading-relaxed">{c.description}</p>',
  '<p className="text-sm text-[#434832] leading-relaxed"><VocabText>{c.description}</VocabText></p>'
);

// Replace event.description
content = content.replace(
  '<p className="text-sm text-[#434832] leading-relaxed">{event.description}</p>',
  '<p className="text-sm text-[#434832] leading-relaxed"><VocabText>{event.description}</VocabText></p>'
);

// Replace hint
content = content.replace(
  '<p className="text-sm text-[#434832] leading-relaxed">{hint}</p>',
  '<p className="text-sm text-[#434832] leading-relaxed"><VocabText>{hint}</VocabText></p>'
);

fs.writeFileSync('src/screens/CaseScreen.tsx', content);
console.log('Updated CaseScreen.tsx');
