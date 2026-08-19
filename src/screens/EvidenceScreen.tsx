import { useStore } from "../store/useStore";
import { CASES } from "../data/cases";
import { ShieldAlert, Award, Lock } from "lucide-react";

export default function EvidenceScreen() {
  const { stats } = useStore();

  if (!stats) return null;

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[#2D331F] italic mb-2">Evidence Room</h1>
        <p className="text-[#7D8F69] text-sm opacity-80">Your collection of achievements and case badges.</p>
      </header>

      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4A373] mb-4 flex items-center gap-2">
          <Award size={18} />
          Detective Rank
        </h2>
        
        <div className="bg-white border border-[#E9EDC6] rounded-[32px] p-6 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4A373] to-[#7D8F69]" />
          <div className="w-20 h-20 bg-[#F5F2ED] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
            <ShieldAlert size={36} className="text-[#2D331F]" />
          </div>
          <h3 className="text-2xl font-serif italic text-[#2D331F] mb-1">{stats.rank}</h3>
          <p className="text-sm text-[#7D8F69] mb-4">Total XP: <span className="font-bold">{stats.xp}</span></p>
          
          <div className="w-full bg-[#F5F2ED] rounded-full h-2 mb-2 overflow-hidden">
            <div 
              className="bg-[#7D8F69] h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (stats.xp / 1000) * 100)}%` }} 
            />
          </div>
          <p className="text-[10px] text-right text-[#7D8F69] uppercase font-bold tracking-widest">
            {stats.xp < 1000 ? `${1000 - stats.xp} XP to Next Rank` : 'Max Rank Reached'}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4A373] mb-4">Case Badges</h2>
        <div className="grid grid-cols-2 gap-4">
          {CASES.map(c => {
            const isSolved = stats.completedCases.includes(c.id);

            return (
              <div 
                key={c.id} 
                className={`bg-white border ${isSolved ? 'border-[#7D8F69]' : 'border-[#E9EDC6] opacity-60'} rounded-[24px] p-5 text-center shadow-sm relative flex flex-col items-center justify-center aspect-square`}
              >
                {!isSolved && (
                  <div className="absolute top-3 right-3 text-[#E9EDC6]">
                    <Lock size={16} />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isSolved ? 'bg-[#E9EDC6]/40 text-[#7D8F69]' : 'bg-slate-50 text-slate-300'}`}>
                  <ShieldAlert size={28} />
                </div>
                <h4 className="font-serif italic text-[#2D331F] text-sm leading-tight mb-1">
                  {c.title}
                </h4>
                <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest">
                  {isSolved ? 'Solved' : 'Locked'}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
