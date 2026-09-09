const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(/getUserData\(\)\.role == roleName/, "getUserData().get('role', 'USER') == roleName");
content = content.replace(/request.resource.data.role != 'SUPER_ADMIN'/, "request.resource.data.get('role', 'USER') != 'SUPER_ADMIN'");

fs.writeFileSync('firestore.rules', content);
