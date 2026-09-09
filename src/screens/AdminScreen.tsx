import { useState } from "react";
import { useStore } from "../store/useStore";
import { ShieldCheck, Database, FileKey, Users, FileText } from "lucide-react";

import UserOpsTab from "./admin/UserOpsTab";
import CaseEditorTab from "./admin/CaseEditorTab";
import DiscountCodesTab from "./admin/DiscountCodesTab";
import SystemTab from "./admin/SystemTab";

export default function AdminScreen() {
  const { stats } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'users' | 'billing' | 'system'>('overview');

  const isAdminOrHigher = stats?.role === 'ADMIN' || stats?.role === 'SUPER_ADMIN' || stats?.isAdmin;

  if (!isAdminOrHigher) {
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
          {stats?.role || 'ADMIN'}
        </div>
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">HQ Dashboard</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Manage game content, operations, and system settings.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 border-b border-[#E9EDC6] pb-2">
        {(['overview', 'users', 'cases', 'billing', 'system'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[#2D331F] text-[#FDFBF7]' : 'text-[#434832] bg-white border border-[#E9EDC6]'}`}
          >
            {tab === 'billing' ? 'Discounts/Billing' : tab}
          </button>
        ))}
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
            <p className="text-xl font-serif text-[#2D331F] mb-1">Live</p>
            <p className="text-[10px] text-[#D4A373] font-bold uppercase tracking-widest">Cases Sync</p>
          </div>
          <div className="col-span-2 bg-white border border-[#E9EDC6] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#2D331F]">Authorization Module</p>
              <p className="text-xs text-[#7D8F69] mt-1">Server-side RBAC enforced</p>
            </div>
            <ShieldCheck size={28} className="text-[#D4A373]" />
          </div>
        </div>
      )}

      {activeTab === 'users' && <UserOpsTab />}
      {activeTab === 'cases' && <CaseEditorTab />}
      {activeTab === 'billing' && <DiscountCodesTab />}
      {activeTab === 'system' && <SystemTab />}

    </div>
  );
}
