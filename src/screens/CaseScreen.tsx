import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CASES } from "../data/cases";
import { useStore } from "../store/useStore";
import { ChevronLeft, FileText, Users, Clock, AlertTriangle, ArrowRight, ShieldCheck, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

type Tab = 'briefing' | 'suspects' | 'evidence' | 'timeline' | 'hints' | 'accuse';

export default function CaseScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stats, solveCase, spendCoins } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('briefing');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [selectedMotive, setSelectedMotive] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [unlockedHintCount, setUnlockedHintCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const caseData = CASES.find(c => c.id === id);
  const isSolved = stats?.completedCases.includes(caseData?.id || '');

  if (!caseData) return <div className="p-6">Case not found</div>;

  const handleUnlockHint = async () => {
    setErrorMsg(null);
    if (unlockedHintCount >= caseData.hints.length) return;
    const success = await spendCoins(20); // 20 coins per hint
    if (success) {
      setUnlockedHintCount(prev => prev + 1);
    } else {
      setErrorMsg("Not enough coins!");
    }
  };

  const handleAccuse = async () => {
    setErrorMsg(null);
    if (!selectedSuspectId || !selectedMotive || !selectedMethod) {
      setErrorMsg("Please complete your theory (Suspect, Motive, Method).");
      return;
    }
    
    // Check if correct
    if (
      selectedSuspectId === caseData.solution.culpritId && 
      selectedMotive === caseData.solution.motive &&
      selectedMethod === caseData.solution.method
    ) {
      // Success
      await solveCase(caseData.id, caseData.rewards.xp, caseData.rewards.coins);
      setActiveTab('accuse'); // Stays on accuse to show success
    } else {
      // Incorrect logic
      setErrorMsg("Incorrect deduction. Review the evidence and theory again.");
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#434832] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E9EDC6] px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-[#7D8F69] hover:text-[#434832] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#D4A373] font-bold mb-0.5">Case #{String(caseData.dayNumber).padStart(3, '0')}</p>
          <h1 className="text-lg font-serif italic text-[#2D331F]">{caseData.title}</h1>
        </div>
        <div className="w-8" /> {/* Spacer */}
      </header>

      {/* Tabs Navigation */}
      <nav className="flex overflow-x-auto hide-scrollbar border-b border-[#E9EDC6] bg-[#FDFBF7] sticky top-[64px] z-10 px-2">
        {(['briefing', 'suspects', 'evidence', 'timeline', 'hints', 'accuse'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative",
              activeTab === tab ? "text-[#7D8F69]" : "text-[#434832] opacity-50 hover:opacity-100"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7D8F69]" />
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {/* BRIEFING */}
            {activeTab === 'briefing' && (
              <div className="space-y-6 pb-12">
                <div className="bg-white rounded-[32px] p-6 border border-[#E9EDC6] shadow-sm">
                  <h2 className="text-xs text-[#434832] opacity-60 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <FileText size={14} /> Introduction
                  </h2>
                  <p className="text-[#434832] leading-relaxed text-sm">{caseData.introduction}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#E9EDC6]/40 rounded-[24px] p-5 border border-[#E9EDC6]">
                    <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-semibold text-[#2D331F]">{caseData.location}</p>
                  </div>
                  <div className="bg-[#E9EDC6]/40 rounded-[24px] p-5 border border-[#E9EDC6]">
                    <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-widest mb-1">Target</p>
                    <p className="text-sm font-semibold text-[#D4A373]">{caseData.victimOrObject}</p>
                  </div>
                </div>
              </div>
            )}

            {/* SUSPECTS */}
            {activeTab === 'suspects' && (
              <div className="space-y-4 pb-12">
                <h2 className="text-xs text-[#434832] opacity-60 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <Users size={14} /> Persons of Interest
                </h2>
                {caseData.suspects.map((s) => (
                  <div key={s.id} className="bg-white rounded-[24px] border border-[#E9EDC6] overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-[#E9EDC6] bg-[#F5F2ED]">
                      <h3 className="font-serif italic text-2xl text-[#2D331F]">{s.name}</h3>
                      <p className="text-xs font-bold tracking-widest uppercase text-[#7D8F69] mt-2 opacity-80">{s.occupation} • {s.relationship}</p>
                    </div>
                    <div className="p-5 bg-white">
                      <p className="text-[10px] text-[#D4A373] font-bold uppercase tracking-wider mb-2">Statement</p>
                      <p className="text-sm text-[#434832] italic leading-relaxed">"{s.statement}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EVIDENCE */}
            {activeTab === 'evidence' && (
              <div className="space-y-4 pb-12">
                <h2 className="text-xs text-[#434832] opacity-60 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} /> Recovered Evidence
                </h2>
                {caseData.clues.map((c, i) => (
                  <div key={c.id} className="bg-white rounded-[24px] border border-[#E9EDC6] p-5 flex gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-[16px] bg-[#F5F2ED] flex items-center justify-center shrink-0">
                      <span className="text-[#2D331F] font-bold font-serif text-lg">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-serif italic text-[#2D331F] mb-1">{c.title}</h3>
                      <p className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wider mb-2">Source: {c.source}</p>
                      <p className="text-sm text-[#434832] leading-relaxed">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="pb-12">
                <h2 className="text-xs text-[#434832] opacity-60 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                  <Clock size={14} /> Sequence of Events
                </h2>
                <div className="relative border-l-2 border-[#E9EDC6] ml-4 space-y-8">
                  {caseData.timeline.map((event, i) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#7D8F69] ring-4 ring-[#FDFBF7]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-1 block">{event.time}</span>
                      <p className="text-sm text-[#434832] leading-relaxed">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HINTS */}
            {activeTab === 'hints' && (
              <div className="space-y-6 pb-12">
                <div className="bg-white rounded-[32px] p-6 border border-[#E9EDC6] shadow-sm text-center">
                  <Lightbulb size={32} className="text-[#D4A373] mx-auto mb-4" />
                  <h2 className="text-2xl font-serif italic text-[#2D331F] mb-2">Need a Clue?</h2>
                  <p className="text-sm text-[#434832] opacity-80 mb-6">Unlock hints to point you in the right direction.</p>
                  
                  <div className="inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-[#7D8F69] bg-[#F5F2ED] py-2 px-4 rounded-full">
                    Available Coins: {stats?.coins}
                  </div>
                </div>

                <div className="space-y-4">
                  {caseData.hints.map((hint, i) => {
                    const isUnlocked = i < unlockedHintCount;
                    return (
                      <div key={i} className="bg-white rounded-[24px] border border-[#E9EDC6] p-5 shadow-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4A373] mb-3">Hint #{i + 1}</h3>
                        {isUnlocked ? (
                          <p className="text-sm text-[#434832] leading-relaxed">{hint}</p>
                        ) : (
                          <>
                            <AnimatePresence>
                              {errorMsg && activeTab === 'hints' && i === unlockedHintCount && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }} 
                                  animate={{ opacity: 1, y: 0 }} 
                                  exit={{ opacity: 0, y: -10 }}
                                  className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-[16px] flex items-center gap-3 shadow-sm"
                                >
                                  <AlertTriangle size={18} className="shrink-0" />
                                  <p>{errorMsg}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <button 
                              onClick={handleUnlockHint}
                              disabled={i > unlockedHintCount}
                              className={`w-full py-4 rounded-[16px] border border-[#E9EDC6] border-dashed text-sm font-bold transition-all ${i > unlockedHintCount ? 'opacity-30 cursor-not-allowed' : 'text-[#434832] opacity-70 hover:opacity-100 hover:border-[#7D8F69]'}`}
                            >
                              {i > unlockedHintCount ? "Unlock previous hint first" : "Unlock Hint (20 Coins)"}
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACCUSE */}
            {activeTab === 'accuse' && (
              <div className="pb-12">
                {isSolved ? (
                  <div className="bg-[#E9EDC6]/40 border border-[#E9EDC6] rounded-[32px] p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-[#7D8F69] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-serif italic text-[#2D331F] mb-4">Case Solved</h2>
                    <p className="text-[#434832] text-sm leading-relaxed mb-8">
                      {caseData.solution.explanation}
                    </p>
                    <div className="bg-white rounded-[24px] p-5 border border-[#E9EDC6] inline-block text-left shadow-sm">
                      <p className="text-[10px] text-[#7D8F69] font-bold uppercase tracking-wider mb-3">Rewards Earned</p>
                      <p className="text-sm font-bold text-[#434832]">+{caseData.rewards.xp} XP</p>
                      <p className="text-sm font-bold text-[#D4A373]">+{caseData.rewards.coins} Coins</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-[32px] p-6 border border-[#E9EDC6] text-center shadow-sm">
                      <h2 className="text-2xl font-serif italic text-[#2D331F] mb-2">Final Accusation</h2>
                      <p className="text-sm text-[#434832] opacity-80">Review all evidence. Who is responsible for the crime?</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7D8F69] mb-2">1. Who is the Culprit?</p>
                        <div className="space-y-2">
                          {caseData.suspects.map((s) => (
                    <button
                              key={s.id}
                              onClick={() => setSelectedSuspectId(s.id)}
                              className={cn(
                                "w-full text-left p-4 rounded-[16px] border transition-all flex items-center justify-between shadow-sm",
                                selectedSuspectId === s.id 
                                  ? "bg-[#7D8F69]/10 border-[#7D8F69] text-[#2D331F]" 
                                  : "bg-white border-[#E9EDC6] text-[#434832] hover:border-[#7D8F69]/50"
                              )}
                            >
                              <div>
                                <p className="font-serif italic text-lg">{s.name}</p>
                              </div>
                              {selectedSuspectId === s.id && <div className="w-3 h-3 rounded-full bg-[#7D8F69]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7D8F69] mb-2 mt-4">2. What was the Motive?</p>
                        <select 
                          className="w-full bg-white border border-[#E9EDC6] rounded-[16px] p-3 text-sm focus:outline-none focus:border-[#7D8F69]"
                          value={selectedMotive}
                          onChange={(e) => setSelectedMotive(e.target.value)}
                        >
                          <option value="" disabled>Select a motive...</option>
                          {caseData.theoryOptions.motives.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7D8F69] mb-2 mt-4">3. What was the Method?</p>
                        <select 
                          className="w-full bg-white border border-[#E9EDC6] rounded-[16px] p-3 text-sm focus:outline-none focus:border-[#7D8F69]"
                          value={selectedMethod}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                        >
                          <option value="" disabled>Select a method...</option>
                          {caseData.theoryOptions.methods.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {errorMsg && activeTab === 'accuse' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-[16px] flex items-center gap-3 shadow-sm"
                        >
                          <AlertTriangle size={18} className="shrink-0" />
                          <p>{errorMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handleAccuse}
                      className={`w-full mt-6 text-white font-semibold tracking-wide py-4 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 ${!selectedSuspectId || !selectedMotive || !selectedMethod ? 'bg-[#E9EDC6] text-[#434832]/50 cursor-not-allowed' : 'bg-[#434832] hover:bg-[#2D331F]'}`}
                    >
                      Submit Deduction <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
