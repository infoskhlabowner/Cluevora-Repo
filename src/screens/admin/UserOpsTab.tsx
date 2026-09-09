import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy, limit, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Users, Search, ShieldCheck, Ban, CheckCircle } from "lucide-react";
import { useStore } from "../../store/useStore";

export default function UserOpsTab() {
  const { stats, user: currentUser } = useStore();
  const [users, setUsers] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const isSuperAdmin = stats?.role === 'SUPER_ADMIN' || stats?.isAdmin === true;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Just fetching 50 for admin panel prototype
      const q = query(collection(db, "users"), limit(50));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateUserField = async (userId: string, field: string, value: any) => {
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, "users", userId), { [field]: value });
      // Log action
      if (currentUser) {
        await addAuditLog(`Updated user ${userId} field ${field} to ${value}`, currentUser.uid, userId);
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
    } catch (e) {
      console.error(e);
      alert("Failed to update user. Check permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.id.includes(search) || (u.email && u.email.includes(search))
  );

  return (
    <div className="bg-[#F5F2ED] border border-[#E9EDC6] rounded-[32px] p-6 shadow-inner">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={28} className="text-[#D4A373]" />
          <h2 className="text-xl font-serif text-[#2D331F]">User Operations</h2>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8F69]" />
          <input 
            type="text" 
            placeholder="Search UID or Email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full border border-[#E9EDC6] text-sm focus:outline-none focus:border-[#7D8F69]"
          />
        </div>
      </div>
      
      {loading ? (
        <p className="text-center text-[#7D8F69]">Loading user database...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-[16px] border border-[#E9EDC6]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#E9EDC6]/30 border-b border-[#E9EDC6] text-[10px] uppercase font-bold text-[#7D8F69] tracking-wider">
                <th className="p-4">User ID & Email</th>
                <th className="p-4">Rank & Stats</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-[#E9EDC6] last:border-b-0 hover:bg-[#FDFBF7] transition-colors">
                  <td className="p-4 align-top">
                    <p className="text-sm font-bold text-[#2D331F]">{u.displayName || (u.email ? u.email.split('@')[0] : 'Anonymous Detective')}</p>
                    <code className="text-[10px] text-[#434832] font-mono block mt-1">{u.id}</code>
                    {u.email && <span className="text-xs text-[#7D8F69] block mt-1">{u.email}</span>}
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-sm font-bold text-[#2D331F]">{u.rank || 'Recruit'}</p>
                    <p className="text-xs text-[#7D8F69] mt-1">
                      XP: {u.xp || 0} | Coins: {u.coins || 0}
                    </p>
                  </td>
                  <td className="p-4 align-top space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#D4A373]/20 text-[#D4A373] px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider">
                        {u.role || 'USER'}
                      </span>
                      {u.isPremium && (
                        <span className="bg-[#7D8F69]/20 text-[#7D8F69] px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider">
                          Premium
                        </span>
                      )}
                    </div>
                    {u.isDisabled && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[8px] uppercase font-bold flex items-center w-max gap-1 mt-1">
                        <Ban size={10} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-top text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button 
                        disabled={updatingId === u.id}
                        onClick={() => updateUserField(u.id, 'isPremium', !u.isPremium)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isPremium ? 'bg-[#7D8F69] text-white' : 'bg-[#E9EDC6] text-[#434832]'}`}
                      >
                        {u.isPremium ? 'Revoke Pro' : 'Grant Pro'}
                      </button>
                      <button 
                        disabled={updatingId === u.id}
                        onClick={() => updateUserField(u.id, 'isDisabled', !u.isDisabled)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isDisabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {u.isDisabled ? 'Restore' : 'Disable'}
                      </button>
                      {isSuperAdmin && (
                        <select 
                          disabled={updatingId === u.id}
                          value={u.role || 'USER'} 
                          onChange={(e) => updateUserField(u.id, 'role', e.target.value)}
                          className="px-2 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200 outline-none"
                        >
                          <option value="USER">USER</option>
                          <option value="PREMIUM_USER">PREMIUM_USER</option>
                          <option value="MODERATOR">MODERATOR</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Simple helper for audit logs
async function addAuditLog(action: string, adminId: string, targetId?: string) {
  try {
    await addDoc(collection(db, "audit_logs"), {
      action,
      adminId,
      targetId: targetId || null,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error("Failed to log audit", e);
  }
}
