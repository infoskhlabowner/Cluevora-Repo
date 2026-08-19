const fs = require('fs');
let code = fs.readFileSync('src/screens/AdminScreen.tsx', 'utf8');

const t1 = `const [allUsers, setAllUsers] = useState<any[]>([]);`;
const r1 = `const [allUsers, setAllUsers] = useState<any[]>([]);\n  const [errorMsg, setErrorMsg] = useState("");`;

const t2 = `      console.error(e);
      alert("Failed to update user.");
    }`;
const r2 = `      console.error(e);
      setErrorMsg("Failed to update user.");
      setTimeout(() => setErrorMsg(""), 3000);
    }`;

const t3 = `      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">HQ Terminal</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Super Admin Operations</p>
      </header>`;
const r3 = `      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">HQ Terminal</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Super Admin Operations</p>
      </header>
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-[16px] flex items-center gap-2">
          {errorMsg}
        </div>
      )}`;

code = code.replace(t1, r1).replace(t2, r2).replace(t3, r3);
fs.writeFileSync('src/screens/AdminScreen.tsx', code);
console.log('Patched AdminScreen');
