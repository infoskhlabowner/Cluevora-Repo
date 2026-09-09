import { useState } from "react";
import { useStore } from "../store/useStore";
import { Settings, ShieldAlert, Key, LogOut, Trash2, Languages, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsScreen() {
  const { stats, purchasePremium, signOut, toggleLearningMode } = useStore();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">Settings</h1>
          <p className="text-[#7D8F69] text-sm opacity-80">Manage your detective account.</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-[#434832] opacity-60 hover:opacity-100 font-bold uppercase tracking-widest text-xs">
          Done
        </button>
      </header>

      {msg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-[16px] flex items-center justify-center">
          {msg}
        </div>
      )}

      <div className="space-y-6">
        
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-4">Account</h2>

          <div className="bg-white rounded-[24px] border border-[#E9EDC6] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-[#E9EDC6]">
              <div className="flex items-center gap-3 text-[#434832] font-semibold">
                <Languages size={18} className="text-[#7D8F69]" />
                <div>
                  <span>Learn English Mode</span>
                  <p className="text-xs text-[#7D8F69] font-normal mt-0.5">Highlight mystery vocabulary in cases</p>
                </div>
              </div>
              <button 
                onClick={() => toggleLearningMode()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${stats?.learningMode ? 'bg-[#7D8F69]' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stats?.learningMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <button 
              onClick={() => {
                if(!stats?.isPremium) purchasePremium();
                setMsg("Purchases Restored!");
                setTimeout(() => setMsg(""), 3000);
              }}
              className="w-full flex items-center gap-3 p-5 border-b border-[#E9EDC6] text-[#434832] font-semibold hover:bg-[#F5F2ED] transition-colors"
            >
              <Key size={18} className="text-[#7D8F69]" /> Restore Purchases
            </button>
            <button 
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 p-5 border-b border-[#E9EDC6] text-[#434832] font-semibold hover:bg-[#F5F2ED] transition-colors"
            >
              <LogOut size={18} className="text-[#7D8F69]" /> Sign Out
            </button>
            <button 
              className="w-full flex items-center gap-3 p-5 text-red-600 font-semibold hover:bg-red-50 transition-colors"
              onClick={() => confirm("Are you sure you want to delete your account? This action cannot be undone.")}
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-4">Support & Legal</h2>
          <div className="bg-white rounded-[24px] border border-[#E9EDC6] overflow-hidden shadow-sm text-sm font-semibold text-[#434832]">
            <a href="#" className="flex items-center gap-3 p-5 border-b border-[#E9EDC6] hover:bg-[#F5F2ED]">Privacy Policy</a>
            <a href="#" className="flex items-center gap-3 p-5 border-b border-[#E9EDC6] hover:bg-[#F5F2ED]">Terms of Service</a>
            <a href="#" className="flex items-center gap-3 p-5 hover:bg-[#F5F2ED]">Contact Support</a>
          </div>
        </section>
      </div>
    </div>
  );
}
