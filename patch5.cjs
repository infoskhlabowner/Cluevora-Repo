const fs = require('fs');
let code = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

const t1 = `  const [adLoading, setAdLoading] = useState(false);`;
const r1 = `  const [adLoading, setAdLoading] = useState(false);\n  const [copyMsg, setCopyMsg] = useState("");`;

const t2 = `  const copyId = () => {
    navigator.clipboard.writeText(user.uid);
    alert("Detective ID copied to clipboard!");
  };`;
const r2 = `  const copyId = () => {
    navigator.clipboard.writeText(user.uid);
    setCopyMsg("Detective ID copied to clipboard!");
    setTimeout(() => setCopyMsg(""), 3000);
  };`;

const t3 = `      <div className="space-y-4">
        <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm">
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest mb-2">Your Detective ID</p>`;

const r3 = `      {copyMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-[16px] text-center">
          {copyMsg}
        </div>
      )}
      <div className="space-y-4">
        <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm">
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest mb-2">Your Detective ID</p>`;

code = code.replace(t1, r1).replace(t2, r2).replace(t3, r3);
fs.writeFileSync('src/screens/ProfileScreen.tsx', code);
console.log('Patched ProfileScreen');
