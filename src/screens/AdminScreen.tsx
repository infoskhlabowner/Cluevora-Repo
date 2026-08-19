import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { ShieldCheck, Database, FileKey, Users, UserCheck } from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AdminScreen() {
  const { stats } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'users'>('overview');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (activeTab === 'users' && stats?.isAdmin) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const snapshot = await getDocs(collection(db, "users"));
          const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAllUsers(usersData);
        } catch (e) {
          console.error(e);
        }
        setLoadingUsers(false);
      };
      fetchUsers();
    }
  }, [activeTab, stats?.isAdmin]);

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), { isPremium: !currentStatus });
      setAllUsers(users => users.map(u => u.id === userId ? { ...u, isPremium: !currentStatus } : u));
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to update user.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  if (!stats?.isAdmin) {
    return (
      <div className="p-6 pt-12 text-center">
        <ShieldCheck size={48} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-serif text-[#2D331F]">Access Denied</h1>
        <p className="text-[#434832] opacity-80 mt-2">You do not have clearance for this terminal.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#D4A373] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
          <ShieldCheck size={14} />
          Super Admin
        </div>
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">HQ Dashboard</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Manage game content and operative databases.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 border-b border-[#E9EDC6] pb-2">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'overview' ? 'bg-[#2D331F] text-[#FDFBF7]' : 'text-[#434832] bg-white border border-[#E9EDC6]'}`}>Overview</button>
        <button onClick={() => setActiveTab('cases')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'cases' ? 'bg-[#2D331F] text-[#FDFBF7]' : 'text-[#434832] bg-white border border-[#E9EDC6]'}`}>Case Editor</button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'users' ? 'bg-[#2D331F] text-[#FDFBF7]' : 'text-[#434832] bg-white border border-[#E9EDC6]'}`}>User Ops</button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm text-center">
            <Database size={24} className="text-[#7D8F69] mx-auto mb-2" />
            <p className="text-xl font-serif text-[#2D331F] mb-1">Firestore</p>
            <p className="text-[10px] text-[#D4A373] font-bold uppercase tracking-widest">Active</p>
          </div>
          <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm text-center">
            <FileKey size={24} className="text-[#7D8F69] mx-auto mb-2" />
            <p className="text-xl font-serif text-[#2D331F] mb-1">2</p>
            <p className="text-[10px] text-[#D4A373] font-bold uppercase tracking-widest">Published Cases</p>
          </div>
          <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm text-center">
            <Users size={24} className="text-[#7D8F69] mx-auto mb-2" />
            <p className="text-xl font-serif text-[#2D331F] mb-1">Live</p>
            <p className="text-[10px] text-[#D4A373] font-bold uppercase tracking-widest">Auth Service</p>
          </div>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="bg-[#F5F2ED] border border-[#E9EDC6] rounded-[32px] p-8 text-center shadow-inner">
          <FileKey size={32} className="text-[#D4A373] mx-auto mb-4" />
          <h2 className="text-xl font-serif text-[#2D331F] mb-2">Content Engine</h2>
          <p className="text-[#434832] text-sm opacity-80 mb-6">The visual case editor is currently offline for maintenance. You can still modify the cases via the source data definitions.</p>
          <button disabled className="bg-[#E9EDC6] text-[#434832] px-6 py-3 rounded-full font-bold text-sm opacity-50 cursor-not-allowed">
            Create New Case
          </button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#F5F2ED] border border-[#E9EDC6] rounded-[32px] p-8 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <Users size={28} className="text-[#D4A373]" />
            <h2 className="text-xl font-serif text-[#2D331F]">User Operations</h2>
          </div>
          
          {loadingUsers ? (
            <p className="text-center text-[#7D8F69]">Loading user database...</p>
          ) : (
            <div className="space-y-4">
              {allUsers.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-[16px] border border-[#E9EDC6] flex justify-between items-center text-left">
                  <div>
                    <code className="text-[10px] text-[#434832] font-mono block mb-1">{u.id}</code>
                    <p className="text-sm font-bold text-[#2D331F] flex items-center gap-2">
                      {u.rank} 
                      {u.isAdmin && <span className="bg-[#D4A373]/20 text-[#D4A373] px-2 py-0.5 rounded text-[8px] uppercase">Admin</span>}
                    </p>
                    <p className="text-xs text-[#7D8F69]">XP: {u.xp} | Coins: {u.coins}</p>
                  </div>
                  <button 
                    onClick={() => togglePremium(u.id, u.isPremium)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isPremium ? 'bg-[#7D8F69] text-white' : 'bg-[#E9EDC6] text-[#434832]'}`}
                  >
                    {u.isPremium ? 'Revoke Pro' : 'Grant Pro'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
