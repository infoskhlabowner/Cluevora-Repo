const fs = require('fs');
let content = fs.readFileSync('src/screens/admin/UserOpsTab.tsx', 'utf8');

content = content.replace(
  /const \[users, setUsers\] = useState<any\[\]>\(\[\]\);/,
  "const [users, setUsers] = useState<any[]>([]);\n  const [updatingId, setUpdatingId] = useState<string | null>(null);"
);

content = content.replace(
  /const updateUserField = async \(userId: string, field: string, value: any\) => \{/,
  "const updateUserField = async (userId: string, field: string, value: any) => {\n    setUpdatingId(userId);"
);

content = content.replace(
  /alert\("Failed to update user\. Check permissions\."\);\n    \}/,
  "alert(\"Failed to update user. Check permissions.\");\n    } finally {\n      setUpdatingId(null);\n    }"
);

content = content.replace(
  /<button \n                        onClick=\{.*updateUserField\(u.id, 'isPremium', !u.isPremium\)\}/g,
  "<button \n                        disabled={updatingId === u.id}\n                        onClick={() => updateUserField(u.id, 'isPremium', !u.isPremium)}"
);

content = content.replace(
  /<button \n                        onClick=\{.*updateUserField\(u.id, 'isDisabled', !u.isDisabled\)\}/g,
  "<button \n                        disabled={updatingId === u.id}\n                        onClick={() => updateUserField(u.id, 'isDisabled', !u.isDisabled)}"
);

content = content.replace(
  /<select \n                          value=\{u.role/g,
  "<select \n                          disabled={updatingId === u.id}\n                          value={u.role"
);

// Fix isSuperAdmin check in the UI to also respect isAdmin
content = content.replace(
  /const isSuperAdmin = stats\?\.role === 'SUPER_ADMIN';/,
  "const isSuperAdmin = stats?.role === 'SUPER_ADMIN' || stats?.isAdmin === true;"
);

fs.writeFileSync('src/screens/admin/UserOpsTab.tsx', content);
