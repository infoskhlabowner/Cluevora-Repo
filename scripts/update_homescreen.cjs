const fs = require('fs');
let content = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');

content = content.replace('import { CASES } from "../data/cases";', 'import { CASES } from "../data/cases";\nimport { getCaseImage } from "../lib/images";');

const imageInsertion = `
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9EDC6]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            {/* Case Image */}
            <div className="relative h-40 -mt-6 -mx-6 mb-6 overflow-hidden rounded-t-[32px] border-b border-[#E9EDC6]">
              <img src={getCaseImage(todayCase.dayNumber)} referrerPolicy="no-referrer" alt="Case Cover" className="w-full h-full object-cover" />
            </div>
`;

content = content.replace('{/* Background accent */}\n            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9EDC6]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />', imageInsertion);

fs.writeFileSync('src/screens/HomeScreen.tsx', content);
console.log('HomeScreen updated');
