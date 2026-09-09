import React, { useState } from "react";
import { FileKey, FileCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useStore } from "../../store/useStore";

export default function CaseEditorTab() {
  const { user } = useStore();
  const [cases, setCases] = useState<any[]>([
    { id: '1', title: 'The Stolen Diamond', status: 'PUBLISHED', difficulty: 'Easy', reward: 50 },
    { id: '2', title: 'Midnight Train Murder', status: 'REVIEW', difficulty: 'Hard', reward: 150 },
    { id: '3', title: 'Mansion Mystery', status: 'DRAFT', difficulty: 'Medium', reward: 100 },
  ]);

  const [validationResult, setValidationResult] = useState<string | null>(null);

  const validateCase = (c: any) => {
    // Simulate validation rules
    if (!c.title || !c.difficulty || !c.reward) {
      setValidationResult(`Validation Failed for "${c.title}": Missing core fields.`);
      return false;
    }
    // E.g., At least one valid solution, Correct answer exists, No broken clues, etc.
    setValidationResult(`Validation Passed for "${c.title}". Ready for PUBLISHED.`);
    return true;
  };

  const updateCaseStatus = (id: string, newStatus: string) => {
    const c = cases.find(x => x.id === id);
    if (newStatus === 'PUBLISHED') {
      if (!validateCase(c)) return;
    }
    setCases(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x));
    
    // Log audit
    addDoc(collection(db, "audit_logs"), {
      action: `Changed case ${id} status to ${newStatus}`,
      adminId: user?.uid,
      timestamp: Date.now()
    }).catch(console.error);
  };

  return (
    <div className="bg-[#F5F2ED] border border-[#E9EDC6] rounded-[32px] p-6 shadow-inner">
      <div className="flex items-center gap-3 mb-6">
        <FileKey size={28} className="text-[#D4A373]" />
        <h2 className="text-xl font-serif text-[#2D331F]">Content Administration</h2>
      </div>
      
      {validationResult && (
        <div className={`p-4 rounded-[16px] mb-4 text-sm font-semibold flex items-center gap-2 ${validationResult.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {validationResult.includes('Failed') ? <AlertTriangle size={16}/> : <CheckCircle size={16}/>}
          {validationResult}
        </div>
      )}

      <div className="space-y-4">
        {cases.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-[16px] border border-[#E9EDC6] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-[#2D331F] mb-1">{c.title}</p>
              <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider">
                <span className={`px-2 py-0.5 rounded ${c.status === 'PUBLISHED' ? 'bg-[#7D8F69]/20 text-[#7D8F69]' : c.status === 'REVIEW' ? 'bg-[#D4A373]/20 text-[#D4A373]' : 'bg-gray-200 text-gray-600'}`}>
                  {c.status}
                </span>
                <span className="text-[#7D8F69]">Diff: {c.difficulty}</span>
                <span className="text-[#D4A373]">Reward: {c.reward}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => validateCase(c)}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"
              >
                <FileCheck size={12}/> Validate
              </button>
              <select 
                value={c.status} 
                onChange={(e) => updateCaseStatus(c.id, e.target.value)}
                className="px-2 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200 outline-none"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
