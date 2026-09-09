import { Link } from "react-router-dom";
import { useState } from "react";
import { CASES } from "../data/cases";
import { useStore } from "../store/useStore";
import { Lock, CheckCircle2, ChevronRight, Clock, Star, Sparkles, FileBadge, X, Download, ShieldAlert, Eye } from "lucide-react";

export default function CasesScreen() {
  const { stats } = useStore();
  const [showCertModal, setShowCertModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  if (!stats) return null;

  const totalCases = CASES.length;
  const uniqueSolved = new Set(stats.completedCases).size; 
  const isEligible = stats.isPremium && uniqueSolved >= totalCases;

  const handleDownload = () => {
    alert("Downloading Official Detective Certificate... (PDF generated successfully)");
    setShowCertModal(false);
  };

  const userName = stats.displayName || (stats.email ? stats.email.split('@')[0] : 'Anonymous Detective');

  return (
    <div className="p-6 pt-12 relative pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">Case Archive</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Review past investigations and unlock new mysteries.</p>
      </header>

      <button 
        onClick={() => setShowCertModal(true)}
        className="w-full bg-[#2D331F] text-[#FDFBF7] border border-[#2D331F] rounded-[24px] p-4 flex items-center justify-between shadow-md mb-8 hover:bg-[#434832] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373]">
            <FileBadge size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-serif italic text-lg leading-tight">Get Certificate</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Official Completion Award</p>
          </div>
        </div>
        <ChevronRight size={20} className="opacity-50" />
      </button>

      <div className="space-y-4">
        {CASES.map((c, index) => {
          const isSolved = stats.completedCases.includes(c.id);
          const isPremiumLocked = c.category === 'premium' && !stats.isPremium;
          const isLocked = isPremiumLocked; 

          return (
            <Link 
              key={c.id} 
              to={isLocked ? '#' : `/case/${c.id}`}
              className={`block relative bg-white border border-[#E9EDC6] rounded-[32px] p-6 transition-all shadow-sm ${isLocked ? 'opacity-70 bg-slate-50 grayscale hover:border-[#E9EDC6] cursor-default' : 'hover:border-[#7D8F69]/50'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest block">Case #{String(c.dayNumber).padStart(3, '0')}</span>
                    {c.category === 'weekly' && <span className="bg-[#D4A373]/20 text-[#D4A373] px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest border border-[#D4A373]/30">Weekly Master</span>}
                    {c.category === 'premium' && <span className="bg-[#2D331F]/10 text-[#2D331F] px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest border border-[#2D331F]/20 flex items-center gap-1"><Sparkles size={8}/> Premium</span>}
                  </div>
                  <h3 className="text-xl font-serif text-[#2D331F] italic leading-tight">
                    {c.title}
                  </h3>
                </div>
                {isSolved && (
                  <div className="w-8 h-8 rounded-full bg-[#E9EDC6]/40 flex items-center justify-center shrink-0 border border-[#E9EDC6]">
                    <CheckCircle2 size={18} className="text-[#7D8F69]" />
                  </div>
                )}
                {isLocked && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                    <Lock size={16} />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium text-[#434832] opacity-70">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-[#D4A373]" />
                  <span>{c.difficulty}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#7D8F69]" />
                  <span>{c.estimatedTime}m</span>
                </div>
              </div>
              
              {!isLocked && (
                <div className="absolute right-6 bottom-6 opacity-0 hover:opacity-100 transition-opacity md:opacity-100">
                  <ChevronRight size={20} className="text-[#7D8F69]" />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2D331F]/80 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] rounded-[32px] p-8 w-full max-w-sm relative shadow-2xl border border-[#E9EDC6]">
            <button 
              onClick={() => setShowCertModal(false)}
              className="absolute top-6 right-6 text-[#7D8F69] hover:text-[#2D331F]"
            >
              <X size={24} />
            </button>
            
            <div className="w-16 h-16 bg-[#F5F2ED] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm text-[#D4A373]">
              <FileBadge size={32} />
            </div>
            
            <h2 className="text-2xl font-serif italic text-[#2D331F] text-center mb-2">Official Certificate</h2>
            <p className="text-sm text-[#434832] text-center mb-8 opacity-80 leading-relaxed">
              To earn your Official Detective Certificate, you must unlock and solve all <strong className="text-[#2D331F]">{totalCases}</strong> cases. This exclusive diploma is available only to Premium operatives.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-4 bg-white border border-[#E9EDC6] rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7D8F69]">Premium Status</span>
                {stats.isPremium ? (
                  <CheckCircle2 size={18} className="text-[#D4A373]" />
                ) : (
                  <Lock size={18} className="text-slate-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-[#E9EDC6] rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7D8F69]">Cases Solved</span>
                <span className={`text-sm font-bold ${uniqueSolved >= totalCases ? 'text-[#D4A373]' : 'text-[#2D331F]'}`}>
                  {uniqueSolved} / {totalCases}
                </span>
              </div>
            </div>

            {isEligible ? (
              <button 
                onClick={handleDownload}
                className="w-full bg-[#D4A373] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#b0875e] transition-colors"
              >
                <Download size={18} />
                Download Certificate
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-[#E9EDC6] text-[#7D8F69] py-4 rounded-full font-bold uppercase tracking-widest text-xs opacity-70 cursor-not-allowed mb-3"
              >
                Requirements Not Met
              </button>
            )}

            <button
              onClick={() => setShowPreviewModal(true)}
              className="w-full bg-white border border-[#E9EDC6] text-[#434832] py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Eye size={16} />
              Preview Example
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2D331F]/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl relative">
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="absolute -top-12 right-0 text-[#E9EDC6] hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            
            {/* The Certificate Concept */}
            <div className="bg-[#FDFBF7] p-4 md:p-8 border-[12px] border-[#2D331F] shadow-2xl relative">
              <div className="border-[2px] border-[#D4A373] p-8 md:p-16 relative flex flex-col items-center justify-center text-center bg-white shadow-inner">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#434832 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Header */}
                <div className="mb-8 relative z-10">
                  <h3 className="text-[#7D8F69] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-2">Cluevora Detective Agency</h3>
                  <div className="w-24 h-px bg-[#D4A373] mx-auto"></div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-serif italic text-[#2D331F] mb-8 relative z-10 tracking-tight">
                  Certificate of <br className="hidden md:block" />Master Detective
                </h1>

                {/* Content */}
                <p className="text-sm md:text-base text-[#434832] uppercase tracking-widest mb-6 relative z-10 font-medium">
                  This is to certify that
                </p>

                <div className="border-b-2 border-[#2D331F] min-w-[280px] md:min-w-[400px] mb-6 relative z-10 pb-2">
                  <p className="text-2xl md:text-4xl font-serif text-[#D4A373] italic">
                    {userName}
                  </p>
                </div>

                <p className="text-sm md:text-base text-[#434832] max-w-xl mx-auto leading-relaxed relative z-10 italic mb-12">
                  has successfully completed all classified investigations, demonstrating exceptional deductive reasoning, unwavering attention to detail, and a mastery of forensic analysis in the field.
                </p>

                {/* Footer Section */}
                <div className="w-full flex justify-between items-end relative z-10 mt-8">
                  <div className="text-center">
                    <div className="w-32 h-px bg-[#7D8F69] mb-2 mx-auto"></div>
                    <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">Date Achieved</p>
                    <p className="text-sm text-[#434832] font-serif italic">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  {/* Seal */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-24 h-24 bg-[#D4A373] rounded-full flex items-center justify-center border-4 border-[#FDFBF7] shadow-xl">
                    <div className="w-20 h-20 rounded-full border border-dashed border-[#FDFBF7] flex flex-col items-center justify-center text-[#FDFBF7]">
                      <ShieldAlert size={24} className="mb-1" />
                      <span className="text-[8px] uppercase tracking-widest font-bold text-center leading-tight">Official<br/>Seal</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-32 h-px bg-[#7D8F69] mb-2 mx-auto"></div>
                    <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">Chief Inspector</p>
                    <p className="text-sm text-[#434832] font-serif italic font-bold">Arthur Pendelton</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
               <p className="text-[#E9EDC6] text-sm opacity-80 uppercase tracking-widest font-bold">Concept Preview (Actual PDF may vary)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
