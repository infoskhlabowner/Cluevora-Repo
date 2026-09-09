const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

const profileImport = `import { User, LogOut, Flame, Trophy, ShieldAlert, CircleDollarSign, Star, Sparkles, Copy, Settings, CheckCircle2 } from "lucide-react";`;
content = content.replace(/import \{ User, LogOut, Flame, Trophy, ShieldAlert, CircleDollarSign, Star, Sparkles, Copy, Settings \} from "lucide-react";/, profileImport);

const copyIdFunc = `  const copyId = () => {
    navigator.clipboard.writeText(user.uid);
    setCopyMsg("Detective ID copied to clipboard!");
    setTimeout(() => setCopyMsg(""), 3000);
  };
  
  const handleClaimDaily = async () => {
    const { useStore } = await import('../store/useStore');
    const success = await useStore.getState().claimDailyCoins();
    if (success) {
      setCopyMsg("Claimed 100 Daily Premium Coins!");
    } else {
      setCopyMsg("Already claimed your daily coins today.");
    }
    setTimeout(() => setCopyMsg(""), 3000);
  };
  
  const handleIconChange = async () => {
    if (!stats.isPremium) return;
    const newIcon = prompt("Enter an emoji for your premium badge:", stats.premiumIcon || '🕵️');
    if (newIcon) {
       const { useStore } = await import('../store/useStore');
       await useStore.getState().updatePremiumIcon(newIcon);
    }
  };
`;

content = content.replace(/  const copyId = \(\) => \{[\s\S]*?setTimeout\(\(\) => setCopyMsg\(""\), 3000\);\n  \};/, copyIdFunc);

const headerSection = `
      <header className="mb-10 text-center flex flex-col items-center relative">
        <div 
          onClick={stats.isPremium ? handleIconChange : undefined}
          className={\`w-24 h-24 bg-white border border-[#E9EDC6] rounded-full shadow-sm flex items-center justify-center mb-4 relative \${stats.isPremium ? 'cursor-pointer hover:border-[#D4A373]' : ''}\`}
        >
          {stats.isPremium && stats.premiumIcon ? (
            <span className="text-4xl">{stats.premiumIcon}</span>
          ) : (
            <User size={40} className="text-[#7D8F69]" />
          )}
          {stats.isPremium && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#D4A373] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-[#FDFBF7]">
              <Star size={16} fill="currentColor" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-1">{stats.displayName || 'Detective'}</h1>
        <p className="text-[#7D8F69] text-xs font-bold uppercase tracking-widest">{stats.rank}</p>
        {stats.isPremium && (
           <p className="text-[10px] text-[#D4A373] uppercase tracking-widest mt-2">Tap avatar to change icon</p>
        )}
      </header>
`;

content = content.replace(/      <header className="mb-10 text-center flex flex-col items-center relative">[\s\S]*?<\/header>/, headerSection);

const claimSection = `
      <div className="mb-8 space-y-3">
        {stats.isPremium ? (
          <button 
             onClick={handleClaimDaily}
             className="w-full flex items-center justify-between p-5 bg-[#2D331F] border border-[#434832] rounded-[24px] text-[#FDFBF7] font-semibold hover:bg-[#434832] transition-all shadow-sm"
           >
             <div className="text-left">
               <p className="text-sm font-bold text-white">Daily Premium Reward</p>
               <p className="text-[10px] uppercase tracking-widest text-[#D4A373] mt-1">Claim 100 Coins Instantly</p>
             </div>
             <CircleDollarSign size={24} className="text-[#D4A373]" />
           </button>
        ) : (
          <button 
             onClick={async () => {
               setAdLoading(true);
               await watchAd();
               setAdLoading(false);
             }}
             disabled={adLoading}
             className="w-full flex items-center justify-between p-5 bg-white border border-[#E9EDC6] rounded-[24px] text-[#434832] font-semibold hover:border-[#7D8F69] transition-all shadow-sm"
           >
             <div className="text-left">
               <p className="text-sm font-bold text-[#2D331F]">Need more clues?</p>
               <p className="text-[10px] uppercase tracking-widest text-[#7D8F69] mt-1">{adLoading ? 'Watching...' : 'Watch Ad for +50 Coins'}</p>
             </div>
             <CircleDollarSign size={24} className="text-[#D4A373]" />
           </button>
        )}
      </div>
`;

content = content.replace(/      <div className="mb-8">[\s\S]*?<\/div>/, claimSection);

fs.writeFileSync('src/screens/ProfileScreen.tsx', content);
