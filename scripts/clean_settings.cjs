const fs = require('fs');
let content = fs.readFileSync('src/screens/SettingsScreen.tsx', 'utf8');
content = content.replace(/\{!stats\?\.isPremium && \([\s\S]*?<\/section>\s*\)\}\s*<section>/, '<section>');
fs.writeFileSync('src/screens/SettingsScreen.tsx', content);
