import { useStore } from "../store/useStore";
import { CASES } from "../data/cases";
import { getCaseImage } from "../lib/images";
import { Link } from "react-router-dom";
import { ShieldAlert, Flame, CircleDollarSign, ChevronRight, Clock, Star } from "lucide-react";
import { motion } from "motion/react";

export default function HomeScreen() {
  const { stats } = useStore();
  
  if (!stats) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const hasPlayedToday = stats.lastSolvedDate === todayStr;

  // If they have played today, show the case they solved.
  // Otherwise, show the next unsolved case.
  const caseIndexToShow = hasPlayedToday ? Math.max(0, stats.completedCases.length - 1) : stats.completedCases.length;
  const todayCase = CASES[caseIndexToShow % CASES.length];
  const isSolved = stats.completedCases.includes(todayCase.id);

  return (
    <div className="p-6 pt-12">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#7D8F69] text-xs font-bold tracking-widest uppercase mb-1 opacity-80">Good Evening</p>
          <h1 className="text-3xl font-serif text-[#2D331F] italic flex items-center gap-2">
            Detective 
            {stats.isPremium ? (
              <Star size={24} className="text-[#D4A373]" fill="currentColor" />
            ) : (
              <ShieldAlert size={24} className="text-[#D4A373]" />
            )}
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 bg-white bg-opacity-60 px-3 py-1.5 rounded-full border border-[#E9EDC6]">
            <Flame size={14} className="text-[#D4A373]" />
            <span className="text-sm font-medium text-[#434832]">{stats.streak}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white bg-opacity-60 px-3 py-1.5 rounded-full border border-[#E9EDC6]">
            <CircleDollarSign size={14} className="text-[#7D8F69]" />
            <span className="text-sm font-medium text-[#434832]">{stats.coins}</span>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold tracking-wider text-[#434832] uppercase opacity-60">Today's Case</h2>
          <span className="text-xs text-[#7D8F69] font-bold">Case #{String(todayCase.dayNumber).padStart(3, '0')}</span>
        </div>

        <Link to={hasPlayedToday ? '#' : `/case/${todayCase.id}`} className={hasPlayedToday ? 'cursor-default block' : 'block'}>
          <motion.div 
            whileTap={hasPlayedToday ? {} : { scale: 0.98 }}
            className={`relative bg-white border border-[#E9EDC6] rounded-[32px] p-6 overflow-hidden shadow-sm ${!hasPlayedToday && 'group'}`}
          >
            
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9EDC6]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            {/* Case Image */}
            <div className="relative h-40 -mt-6 -mx-6 mb-6 overflow-hidden rounded-t-[32px] border-b border-[#E9EDC6]">
              <img src={getCaseImage(todayCase.dayNumber)} referrerPolicy="no-referrer" alt="Case Cover" className="w-full h-full object-cover" />
            </div>

            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className={`text-2xl font-serif text-[#2D331F] italic leading-tight pr-4 ${!hasPlayedToday && 'group-hover:text-[#7D8F69] transition-colors'}`}>
                {todayCase.title}
              </h3>
              {isSolved && (
                <div className="bg-[#E9EDC6]/40 text-[#7D8F69] px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-[#E9EDC6]">
                  Solved
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-[#7D8F69] bg-[#FDFBF7] px-3 py-1.5 rounded-full border border-[#E9EDC6]">
                <Star size={14} className="text-[#D4A373]" />
                <span className="font-medium">{todayCase.difficulty}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7D8F69] bg-[#FDFBF7] px-3 py-1.5 rounded-full border border-[#E9EDC6]">
                <Clock size={14} className="text-[#D4A373]" />
                <span className="font-medium">{todayCase.estimatedTime}m</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#434832] text-sm font-semibold tracking-wide relative z-10">
              {hasPlayedToday ? (
                <span className="text-[#7D8F69] italic">Great work! Come back tomorrow for the next case.</span>
              ) : (
                <>
                  Start Investigation
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-[#7D8F69]" />
                </>
              )}
            </div>
          </motion.div>
        </Link>
      </section>

      <section>
        <h2 className="text-xs font-bold tracking-wider text-[#434832] uppercase opacity-60 mb-4">Your Progress</h2>
        <div className="bg-[#E9EDC6]/40 rounded-[32px] border border-[#E9EDC6] p-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-[#7D8F69] font-bold uppercase tracking-widest mb-1">Rank</p>
              <p className="text-xl font-serif italic text-[#2D331F]">{stats.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#7D8F69] font-bold uppercase tracking-widest mb-1">XP</p>
              <p className="text-xl font-serif text-[#2D331F]">{stats.xp}</p>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="w-full bg-white h-2.5 rounded-full mt-4 overflow-hidden border border-[#E9EDC6]">
            <div 
              className="bg-[#7D8F69] h-full rounded-full relative"
              style={{ width: `${Math.min(100, (stats.xp % 500) / 500 * 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full" style={{ backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,.15) 25%, rgba(255,255,255,.15) 50%, transparent 50%, transparent 75%, rgba(255,255,255,.15) 75%, rgba(255,255,255,.15) 100%)', backgroundSize: '1rem 1rem' }}></div>
            </div>
          </div>
          <p className="text-center text-[10px] text-[#7D8F69] font-bold mt-3 uppercase tracking-wider">{500 - (stats.xp % 500)} XP to Next Rank</p>
        </div>
      </section>
    </div>
  );
}
