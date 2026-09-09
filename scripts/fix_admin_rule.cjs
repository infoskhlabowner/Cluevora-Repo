const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(/getUserData\(\)\.get\('role', 'USER'\) == roleName;/, "getUserData().get('role', 'USER') == roleName || (roleName == 'SUPER_ADMIN' && getUserData().get('isAdmin', false) == true);");

fs.writeFileSync('firestore.rules', content);
