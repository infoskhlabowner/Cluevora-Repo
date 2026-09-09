const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(
  /exists\(\/databases\/\$\(database\)\/documents\/users\/\$\(request\.auth\.uid\)\) &&\s*\(getUserData\(\)\.get\('role', 'USER'\) == roleName \|\| \(roleName == 'SUPER_ADMIN' && getUserData\(\)\.get\('isAdmin', false\) == true\)\);/,
  "exists(/databases/$(database)/documents/users/$(request.auth.uid)) && (getUserData().get('role', 'USER') == roleName || (roleName == 'SUPER_ADMIN' && getUserData().get('isAdmin', false) == true));"
);

fs.writeFileSync('firestore.rules', content);
