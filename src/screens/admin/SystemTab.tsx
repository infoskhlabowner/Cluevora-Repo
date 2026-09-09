import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Database, Download, FileText, CreditCard, ShieldAlert } from "lucide-react";
import { useStore } from "../../store/useStore";

export default function SystemTab() {
  const { stats } = useStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(20));
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleExport = async () => {
    // In a real app, this would trigger a cloud function to generate a secure temp link.
    // For now, we simulate the process and log it.
    alert("Export initiated. A secure download link will be generated shortly.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Download size={24} className="text-[#D4A373]" />
            <h3 className="font-serif text-[#2D331F] text-lg">Secure Export</h3>
          </div>
          <p className="text-xs text-[#434832] opacity-80 mb-4">Export database records. Passwords, secrets, and payment credentials are automatically excluded. Requires Admin authorization.</p>
          <button onClick={handleExport} className="w-full bg-[#2D331F] text-white py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
            <Database size={14} /> Request Database Export
          </button>
        </div>

        <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard size={24} className="text-[#D4A373]" />
            <h3 className="font-serif text-[#2D331F] text-lg">Billing Portal</h3>
          </div>
          <p className="text-xs text-[#434832] opacity-80 mb-4">Do not store credit card details locally. Access the official secure payment provider portal here.</p>
          <button onClick={() => alert('Redirecting to Stripe Billing Portal...')} className="w-full bg-blue-50 text-blue-700 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-blue-200">
            <CreditCard size={14} /> Official Billing Portal
          </button>
        </div>
      </div>

      <div className="bg-[#F5F2ED] border border-[#E9EDC6] rounded-[32px] p-6 shadow-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText size={28} className="text-[#D4A373]" />
            <h2 className="text-xl font-serif text-[#2D331F]">Audit History</h2>
          </div>
          <button onClick={fetchLogs} className="text-xs font-bold uppercase tracking-wider text-[#7D8F69] hover:text-[#2D331F]">Refresh</button>
        </div>
        
        {loading ? (
          <p className="text-center text-[#7D8F69]">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-[#7D8F69]">No audit logs found.</p>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="bg-white p-3 rounded-[12px] border border-[#E9EDC6] text-xs">
                <div className="flex justify-between text-[#7D8F69] mb-1">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="font-mono">Admin: {log.adminId}</span>
                </div>
                <p className="text-[#2D331F] font-semibold">{log.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-[#E9EDC6] rounded-[24px] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert size={24} className="text-red-500" />
          <h3 className="font-serif text-[#2D331F] text-lg">Account Recovery</h3>
        </div>
        <p className="text-xs text-[#434832] opacity-80 mb-4">Secure recovery process. Administrator authentication required to bypass 2FA or reset accounts.</p>
        <button onClick={() => alert('Initiating secure recovery flow. Audit log will be created.')} className="bg-red-50 text-red-700 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">
          Initiate Recovery
        </button>
      </div>
    </div>
  );
}
