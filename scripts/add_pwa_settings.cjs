const fs = require('fs');
let content = fs.readFileSync('src/screens/SettingsScreen.tsx', 'utf8');

content = content.replace(
  /import \{ useNavigate \} from "react-router-dom";/,
  `import { useNavigate } from "react-router-dom";\nimport { PWAInstallButton } from "../components/PWAInstallButton";`
);

content = content.replace(
  /<div className="space-y-6">/,
  `<div className="space-y-6">\n        <PWAInstallButton />`
);

fs.writeFileSync('src/screens/SettingsScreen.tsx', content);
