import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useStore } from "../store/useStore";
import { Trophy, Medal, User, Users, Plus } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  rank: string;
  xp: number;
  isPremium?: boolean;
}

export default function LeaderboardScreen() {
  const { user, stats, addFriend } = useStore();
  const [globalLeaders, setGlobalLeaders] = useState<LeaderboardEntry[]>([]);
  const [friendLeaders, setFriendLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [friendId, setFriendId] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchLeaderboards() {
      setLoading(true);
      try {
        // Fetch Global
        const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedGlobal: LeaderboardEntry[] = [];
        querySnapshot.forEach((d) => {
          const data = d.data();
          fetchedGlobal.push({
            id: d.id,
            rank: data.rank || 'Recruit',
            xp: data.xp || 0,
            isPremium: data.isPremium || false
          });
        });
        setGlobalLeaders(fetchedGlobal);

        // Fetch Friends (including self)
        if (user && stats) {
          const friendIds = [user.uid, ...(stats.friends || [])];
          const friendPromises = friendIds.map(id => getDoc(doc(db, "users", id)));
          const friendDocs = await Promise.all(friendPromises);
          
          const fetchedFriends: LeaderboardEntry[] = [];
          friendDocs.forEach(d => {
            if (d.exists()) {
              const data = d.data();
              fetchedFriends.push({
                id: d.id,
                rank: data.rank || 'Recruit',
                xp: data.xp || 0,
                isPremium: data.isPremium || false
              });
            }
          });
          fetchedFriends.sort((a, b) => b.xp - a.xp);
          setFriendLeaders(fetchedFriends);
        }

      } catch (err) {
        console.error("Failed to fetch leaderboards", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboards();
  }, [user, stats?.friends]); // Refetch if friends change

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendId.trim()) return;
    setAddingFriend(true);
    const success = await addFriend(friendId.trim());
    setAddingFriend(false);
    if (success) {
      setFriendId("");
      setMsg({ text: "Friend added successfully!", type: "success" });
    } else {
      setMsg({ text: "Could not add friend. Check the ID and try again.", type: "error" });
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const leaders = activeTab === 'global' ? globalLeaders : friendLeaders;

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">Rankings</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">See how you stack up against other detectives.</p>
      </header>

      <div className="flex bg-white rounded-full p-1 border border-[#E9EDC6] mb-6 shadow-sm">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold tracking-wide transition-colors ${activeTab === 'global' ? 'bg-[#7D8F69] text-white' : 'text-[#434832] opacity-60'}`}
        >
          <Trophy size={16} /> Global
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold tracking-wide transition-colors ${activeTab === 'friends' ? 'bg-[#7D8F69] text-white' : 'text-[#434832] opacity-60'}`}
        >
          <Users size={16} /> Friends
        </button>
      </div>

      {msg.text && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}
      {activeTab === 'friends' && (
        <form onSubmit={handleAddFriend} className="mb-6 flex gap-2">
          <input 
            type="text" 
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            placeholder="Enter Friend's Detective ID..."
            className="flex-1 bg-white border border-[#E9EDC6] rounded-full px-4 py-2 text-sm text-[#2D331F] focus:outline-none focus:border-[#7D8F69] shadow-sm"
          />
          <button 
            type="submit" 
            disabled={addingFriend || !friendId.trim()}
            className="bg-[#D4A373] text-white p-2 rounded-full hover:bg-[#b08256] disabled:opacity-50 transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin text-[#D4A373]">
            <Trophy size={32} />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E9EDC6] rounded-[32px] overflow-hidden shadow-sm">
          {leaders.map((leader, index) => {
            const isMe = leader.id === user?.uid;
            let MedalIcon = null;
            let medalColor = "";
            
            if (index === 0) {
              MedalIcon = Medal;
              medalColor = "text-yellow-500";
            } else if (index === 1) {
              MedalIcon = Medal;
              medalColor = "text-slate-400";
            } else if (index === 2) {
              MedalIcon = Medal;
              medalColor = "text-amber-700";
            }

            return (
              <div 
                key={leader.id}
                className={`flex items-center gap-4 p-4 border-b border-[#E9EDC6] last:border-b-0 ${isMe ? 'bg-[#F5F2ED]' : ''}`}
              >
                <div className="w-8 flex justify-center font-serif text-lg text-[#2D331F] font-bold">
                  {MedalIcon ? <MedalIcon size={24} className={medalColor} /> : `#${index + 1}`}
                </div>
                
                <div className="w-12 h-12 bg-[#E9EDC6]/40 rounded-full flex items-center justify-center shrink-0 border border-[#E9EDC6]">
                  <User size={20} className="text-[#7D8F69]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2D331F]">{isMe ? "You" : "Anonymous"}</span>
                    {leader.isPremium && (
                      <span className="bg-[#D4A373] text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        Pro
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#7D8F69] font-medium tracking-wide uppercase">
                    {leader.rank}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif font-bold text-[#2D331F] text-lg">{leader.xp}</div>
                  <div className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">XP</div>
                </div>
              </div>
            );
          })}
          
          {leaders.length === 0 && (
            <div className="p-8 text-center text-[#7D8F69]">
              No detectives found yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
