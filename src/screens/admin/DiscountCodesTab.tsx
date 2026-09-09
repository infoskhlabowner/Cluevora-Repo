import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { CircleDollarSign, Plus } from "lucide-react";
import { useStore } from "../../store/useStore";

export default function DiscountCodesTab() {
  const { user } = useStore();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCode, setNewCode] = useState({ code: '', discount: 10, active: true });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "discount_codes"));
      setCodes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newCode.code) return;
    try {
      const codeData = {
        ...newCode,
        startDate: Date.now(),
        expiration: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        redemptionLimit: 100,
        perUserLimit: 1
      };
      const d = await addDoc(collection(db, "discount_codes"), codeData);
      setCodes([...codes, { id: d.id, ...codeData }]);
      setNewCode({ code: '', discount: 10, active: true });
      
      addDoc(collection(db, "audit_logs"), {
        action: `Created discount code ${codeData.code}`,
        adminId: user?.uid,
        timestamp: Date.now()
      }).catch(console.error);

    } catch (e) {
      console.error(e);
      alert("Failed to create code");
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await updateDoc(doc(db, "discount_codes", id), { active: !active });
      setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#F5F2ED] border border-[#E9EDC6] rounded-[32px] p-6 shadow-inner">
      <div className="flex items-center gap-3 mb-6">
        <CircleDollarSign size={28} className="text-[#D4A373]" />
        <h2 className="text-xl font-serif text-[#2D331F]">Discount Codes</h2>
      </div>

      <div className="bg-white p-4 rounded-[16px] border border-[#E9EDC6] mb-6 flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Code (e.g. SUMMER20)" 
          value={newCode.code}
          onChange={e => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
          className="flex-1 px-3 py-2 border border-[#E9EDC6] rounded-xl text-sm"
        />
        <input 
          type="number" 
          placeholder="% Off" 
          value={newCode.discount}
          onChange={e => setNewCode({...newCode, discount: parseInt(e.target.value)})}
          className="w-20 px-3 py-2 border border-[#E9EDC6] rounded-xl text-sm"
        />
        <button onClick={handleCreate} className="bg-[#2D331F] text-white p-2 rounded-xl">
          <Plus size={20} />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#7D8F69]">Loading codes...</p>
      ) : (
        <div className="space-y-4">
          {codes.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-[16px] border border-[#E9EDC6] flex justify-between items-center">
              <div>
                <p className="font-bold text-[#2D331F]">{c.code} <span className="text-sm font-normal text-[#D4A373]">({c.discount}%)</span></p>
                <p className="text-[10px] text-[#7D8F69] mt-1">Limits: {c.perUserLimit} per user | {c.redemptionLimit} total</p>
              </div>
              <button 
                onClick={() => toggleActive(c.id, c.active)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {c.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
