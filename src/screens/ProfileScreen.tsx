import { useStore } from "../store/useStore";
import { User, LogOut, Flame, Trophy, ShieldAlert, CircleDollarSign, Star, Sparkles, Copy, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

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

  return (
    <div className="p-6 pt-12">
      <header className="mb-10 text-center flex flex-col items-center relative">
        <div className="w-24 h-24 bg-white border border-[#E9EDC6] rounded-full shadow-sm flex items-center justify-center mb-4 relative">
          <User size={40} className="text-[#7D8F69]" />
          {stats.isPremium && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#D4A373] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-[#FDFBF7]">
              <Star size={16} fill="currentColor" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-1">Detective</h1>
        <p className="text-[#7D8F69] text-xs font-bold uppercase tracking-widest">{stats.rank}</p>
      </header>

      {!stats.isPremium && (
        <div className="mb-8 bg-[#2D331F] text-[#FDFBF7] p-6 rounded-[32px] shadow-sm flex flex-col items-center text-center border border-[#434832]">
          <Sparkles size={28} className="text-[#D4A373] mb-3" />
          <h2 className="text-xl font-serif italic mb-2">Cluevora Premium</h2>
          <p className="text-sm opacity-80 mb-6 px-4">Unlock all daily cases, remove ads, and earn the exclusive Gold Badge.</p>
          <button 
            onClick={purchasePremium}
            className="w-full bg-[#D4A373] hover:bg-[#b08256] text-[#FDFBF7] font-semibold tracking-wide py-4 rounded-full transition-all"
          >
            Upgrade for $19
          </button>
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

      <div className="mb-8">
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
