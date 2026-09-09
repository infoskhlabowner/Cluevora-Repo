const fs = require('fs');
let content = fs.readFileSync('src/screens/admin/UserOpsTab.tsx', 'utf8');

content = content.replace(/import \{ collection, getDocs, doc, updateDoc, query, orderBy, limit \} from "firebase\/firestore";/, 'import { collection, getDocs, doc, updateDoc, query, orderBy, limit, addDoc } from "firebase/firestore";');

content = content.replace(/\/\/ Simple helper for audit logs\nimport \{ addDoc \} from "firebase\/firestore";/, '// Simple helper for audit logs');

fs.writeFileSync('src/screens/admin/UserOpsTab.tsx', content);
