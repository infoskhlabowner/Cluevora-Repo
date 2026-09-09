const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

// Replace stats.isAdmin with role check
content = content.replace('{stats.isAdmin && (', '{(stats.isAdmin || stats.role === "ADMIN" || stats.role === "SUPER_ADMIN") && (');
content = content.replace('{!stats.isAdmin && (', '{!(stats.isAdmin || stats.role === "ADMIN" || stats.role === "SUPER_ADMIN") && (');
content = content.replace('await updateDoc(doc(db, "users", user.uid), { isAdmin: true });', 'await updateDoc(doc(db, "users", user.uid), { isAdmin: true, role: "SUPER_ADMIN" });');

fs.writeFileSync('src/screens/ProfileScreen.tsx', content);
console.log('ProfileScreen updated');
