const fs = require('fs');
let content = fs.readFileSync('src/screens/SettingsScreen.tsx', 'utf8');

content = content.replace(/import \{ Settings, ShieldAlert, Key, LogOut, Trash2, Languages \} from "lucide-react";/, 'import { Settings, ShieldAlert, Key, LogOut, Trash2, Languages, Star, Users } from "lucide-react";');

const premiumSection = `
        {!stats?.isPremium && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-4 flex items-center gap-2"><Star size={14} /> Upgrade to Premium</h2>
            <div className="bg-white rounded-[24px] border border-[#E9EDC6] overflow-hidden shadow-sm p-5 space-y-4">
              <p className="text-sm text-[#434832] leading-relaxed">
                Unlock all cases, skip all ads, create a custom avatar icon, and claim 100 free coins daily!
              </p>
              
              <button 
                onClick={async () => {
                  await purchasePremium();
                  setMsg("Successfully upgraded to Premium!");
                  setTimeout(() => setMsg(""), 3000);
                }}
                className="w-full bg-[#D4A373] hover:bg-[#b0875e] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
              >
                Pay $19 for Premium
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#E9EDC6]"></div>
                <span className="flex-shrink-0 mx-4 text-[#7D8F69] text-[10px] font-bold uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-[#E9EDC6]"></div>
              </div>

              <div className="text-center">
                <p className="text-xs text-[#7D8F69] font-bold mb-2">Refer 19 friends to get it for FREE!</p>
                <div className="w-full bg-[#F5F2ED] rounded-full h-2 mb-2 overflow-hidden">
                  <div 
                    className="bg-[#D4A373] h-full rounded-full transition-all duration-1000" 
                    style={{ width: \`\${Math.min(100, ((stats?.referrals || 0) / 19) * 100)}%\` }} 
                  />
                </div>
                <p className="text-[10px] font-bold text-[#434832] mb-3">{stats?.referrals || 0} / 19 Referrals</p>
                
                <button 
                  onClick={async () => {
                    const { useStore } = await import('../store/useStore');
                    await useStore.getState().addReferral();
                    setMsg("Simulated Referral Added!");
                    setTimeout(() => setMsg(""), 2000);
                  }}
                  className="w-full bg-white border-2 border-[#D4A373] text-[#D4A373] hover:bg-[#F5F2ED] py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
                >
                  <Users size={16} /> Simulate Referral
                </button>
              </div>
            </div>
          </section>
        )}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-4">Account</h2>
`;

content = content.replace(/<section>[\s]*<h2 className="text-xs font-bold uppercase tracking-widest text-\[#D4A373\] mb-4">Account<\/h2>/, premiumSection);

fs.writeFileSync('src/screens/SettingsScreen.tsx', content);
