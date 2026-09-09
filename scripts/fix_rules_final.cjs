const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(
  /!request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasAny\(\['role', 'isPremium', 'isDisabled', 'isAdmin'\]\)/,
  "!request.resource.data.diff(resource.data).affectedKeys().hasAny(['isPremium', 'isDisabled'])"
);

fs.writeFileSync('firestore.rules', content);
