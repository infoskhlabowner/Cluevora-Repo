const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Replace isAdmin with role and isDisabled
content = content.replace('isAdmin?: boolean;', 'isAdmin?: boolean;\n  role?: string;\n  isDisabled?: boolean;');
content = content.replace('isAdmin: false,', 'isAdmin: false,\n  role: "USER",\n  isDisabled: false,');

fs.writeFileSync('src/store/useStore.ts', content);
console.log('Store updated');
