import { Link } from "react-router-dom";
import { CASES } from "../data/cases";
import { useStore } from "../store/useStore";
import { Lock, CheckCircle2, ChevronRight, Clock, Star, Sparkles } from "lucide-react";

export default function CasesScreen() {
  const { stats } = useStore();
  
  if (!stats) return null;

  return (
    <div className="p-6 pt-12">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">Case Archive</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Review past investigations and unlock new mysteries.</p>
      </header>

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
    </div>
  );
}
