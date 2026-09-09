const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

// Add imports
content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { doc, updateDoc } from "firebase/firestore";\nimport { db } from "../lib/firebase";');

const btnInsertion = `
        {stats.isAdmin && (
          <Link 
            to="/admin"
            className="w-full flex items-center justify-between p-5 bg-[#2D331F] border border-[#434832] rounded-[24px] text-[#FDFBF7] font-semibold hover:bg-[#434832] transition-colors shadow-sm"
          >
            <span className="flex items-center gap-3">
              <ShieldAlert size={20} className="text-[#D4A373]" />
              Admin Dashboard
            </span>
          </Link>
        )}
        
        {!stats.isAdmin && (
          <button 
            onClick={async () => {
              if (user) {
                await updateDoc(doc(db, "users", user.uid), { isAdmin: true });
                window.location.reload();
              }
            }}
            className="w-full flex items-center justify-center p-3 bg-red-50 text-red-700 border border-red-200 rounded-[24px] font-semibold hover:bg-red-100 transition-colors shadow-sm mt-4"
          >
            <ShieldAlert size={16} className="mr-2" />
            Developer: Unlock Admin Privileges
          </button>
        )}
`;

content = content.replace(/\{stats\.isAdmin && \(\s*<Link\s*to="\/admin"[\s\S]*?<\/Link>\s*\)\}/m, btnInsertion);

fs.writeFileSync('src/screens/ProfileScreen.tsx', content);
console.log('ProfileScreen updated with dev admin button');
