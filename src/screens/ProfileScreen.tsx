import { useStore } from "../store/useStore";
import { User, LogOut, Flame, Trophy, ShieldAlert, CircleDollarSign, Star, Sparkles, Copy, Settings, CheckCircle2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ProfileScreen() {
  const { user, stats, signOut, purchasePremium, watchAd } = useStore();
  const [adLoading, setAdLoading] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");

  if (!stats || !user) return null;

  const copyId = () => {
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


  return (
    <div className="p-6 pt-12">

      <header className="mb-10 text-center flex flex-col items-center relative">
        <div 
          onClick={stats.isPremium ? handleIconChange : undefined}
          className={`w-24 h-24 bg-white border border-[#E9EDC6] rounded-full shadow-sm flex items-center justify-center mb-4 relative ${stats.isPremium ? 'cursor-pointer hover:border-[#D4A373]' : ''}`}
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


      {!stats.isPremium && (
        <div className="mb-8 bg-[#2D331F] text-[#FDFBF7] p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col items-center text-center border border-[#434832]">
          <Sparkles size={32} className="text-[#D4A373] mb-4" />
          <h2 className="text-2xl font-serif italic mb-2">Cluevora Premium</h2>
          
          <div className="text-sm opacity-90 mb-8 space-y-3 text-left w-full max-w-sm mx-auto">
            <p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4A373] shrink-0" /> Unlock all Premium Cases</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4A373] shrink-0" /> Zero Ads (Instant Deductions)</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4A373] shrink-0" /> 100 Free Coins Daily</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4A373] shrink-0" /> Custom Premium Avatar Icon</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4A373] shrink-0" /> Official Master Detective Certificate</p>
          </div>

          <button 
            onClick={purchasePremium}
            className="w-full max-w-sm bg-[#D4A373] hover:bg-[#b08256] text-[#FDFBF7] font-semibold tracking-wide py-4 rounded-full transition-all text-sm uppercase mb-4"
          >
            Upgrade for $19
          </button>

          <div className="w-full max-w-sm relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-[#434832]"></div>
            <span className="flex-shrink-0 mx-4 text-[#7D8F69] text-[10px] font-bold uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-[#434832]"></div>
          </div>

          <div className="w-full max-w-sm text-center">
            <p className="text-xs text-[#E9EDC6] font-bold mb-3">Refer 19 friends to get it for FREE!</p>
            <div className="w-full bg-[#1A1E11] rounded-full h-3 mb-2 overflow-hidden border border-[#434832]">
              <div 
                className="bg-gradient-to-r from-[#7D8F69] to-[#D4A373] h-full rounded-full transition-all duration-1000 relative" 
                style={{ width: `${Math.min(100, ((stats.referrals || 0) / 19) * 100)}%` }} 
              >
                <div className="absolute inset-0 bg-white/20 w-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)' }}></div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#7D8F69] uppercase tracking-widest mb-4">
              {stats.referrals || 0} / 19 Referrals Completed
            </p>
            
            <button 
              onClick={async () => {
                const { useStore } = await import('../store/useStore');
                await useStore.getState().addReferral();
                setCopyMsg("Simulated Referral Added!");
                setTimeout(() => setCopyMsg(""), 2000);
              }}
              className="w-full bg-transparent border border-[#7D8F69] text-[#E9EDC6] hover:bg-[#7D8F69]/20 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
            >
              <Users size={16} /> Simulate Invite
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#E9EDC6]/40 border border-[#E9EDC6] rounded-[32px] p-6 text-center">
          <Flame size={24} className="text-[#D4A373] mx-auto mb-2" />
          <p className="text-2xl font-serif text-[#2D331F] mb-1">{stats.streak}</p>
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">Day Streak</p>
        </div>
        <div className="bg-[#E9EDC6]/40 border border-[#E9EDC6] rounded-[32px] p-6 text-center">
          <ShieldAlert size={24} className="text-[#7D8F69] mx-auto mb-2" />
          <p className="text-2xl font-serif text-[#2D331F] mb-1">{stats.completedCases.length}</p>
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">Cases Solved</p>
        </div>
        <div className="bg-[#E9EDC6]/40 border border-[#E9EDC6] rounded-[32px] p-6 text-center">
          <CircleDollarSign size={24} className="text-[#D4A373] mx-auto mb-2" />
          <p className="text-2xl font-serif text-[#2D331F] mb-1">{stats.coins}</p>
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">Coins</p>
        </div>
        <div className="bg-[#E9EDC6]/40 border border-[#E9EDC6] rounded-[32px] p-6 text-center">
          <Trophy size={24} className="text-[#7D8F69] mx-auto mb-2" />
          <p className="text-2xl font-serif text-[#2D331F] mb-1">{stats.xp}</p>
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">Total XP</p>
        </div>
      </div>


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



      {copyMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-[16px] text-center">
          {copyMsg}
        </div>
      )}
      <div className="space-y-4">
        <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm">
          <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest mb-2">Your Detective ID</p>
          <div className="flex items-center justify-between bg-[#F5F2ED] p-3 rounded-[16px]">
            <code className="text-xs text-[#2D331F] font-mono">{user.uid}</code>
            <button onClick={copyId} className="text-[#7D8F69] hover:text-[#434832] transition-colors">
              <Copy size={16} />
            </button>
          </div>
          <p className="text-[10px] text-[#434832] opacity-60 mt-2">Share this ID with friends so they can add you to their leaderboard.</p>
        </div>

        
        {(stats.isAdmin || stats.role === "ADMIN" || stats.role === "SUPER_ADMIN") && (
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
        
        {!(stats.isAdmin || stats.role === "ADMIN" || stats.role === "SUPER_ADMIN") && (
          <button 
            onClick={async () => {
              if (user) {
                await updateDoc(doc(db, "users", user.uid), { isAdmin: true, role: "SUPER_ADMIN" });
                window.location.reload();
              }
            }}
            className="w-full flex items-center justify-center p-3 bg-red-50 text-red-700 border border-red-200 rounded-[24px] font-semibold hover:bg-red-100 transition-colors shadow-sm mt-4"
          >
            <ShieldAlert size={16} className="mr-2" />
            Developer: Unlock Admin Privileges
          </button>
        )}


        <Link 
          to="/settings"
          className="w-full flex items-center justify-between p-5 bg-white border border-[#E9EDC6] rounded-[24px] text-[#434832] font-semibold hover:bg-[#F5F2ED] transition-colors shadow-sm"
        >
          <span className="flex items-center gap-3">
            <Settings size={20} className="text-[#7D8F69]" />
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
}
