const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');
content = content.replace(/            <CircleDollarSign size=\{24\} className="text-\[#D4A373\]" \/>\s*<\/button>\s*<\/div>/, '');
fs.writeFileSync('src/screens/ProfileScreen.tsx', content);
