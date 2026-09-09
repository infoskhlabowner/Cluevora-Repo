const fs = require('fs');
const content = `import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from 'firebase/auth';

export interface PlayerStats {
  xp: number;
  coins: number;
  rank: string;
  streak: number;
  completedCases: string[];
  lastSolvedDate?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
  role?: string;
  isDisabled?: boolean;
  email?: string;
  displayName?: string;
  friends: string[];
  learningMode?: boolean;
  referrals?: number;
  lastDailyCoinDate?: string;
  premiumIcon?: string;
}

interface GameState {
  user: User | null;
  stats: PlayerStats | null;
  loading: boolean;
  activeDictionary: Record<string, string>;
  setActiveDictionary: (dict: Record<string, string>) => void;
  initAuth: () => void;
  loginGuest: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  signOut: () => Promise<void>;
  solveCase: (caseId: string, xpReward: number, coinReward: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  purchasePremium: () => Promise<void>;
  addFriend: (friendId: string) => Promise<boolean>;
  watchAd: () => Promise<void>;
  toggleLearningMode: () => Promise<void>;
  addReferral: () => Promise<void>;
  claimDailyCoins: () => Promise<boolean>;
  updatePremiumIcon: (icon: string) => Promise<void>;
}

const DEFAULT_STATS: PlayerStats = {
  xp: 0,
  coins: 50,
  rank: 'Recruit',
  streak: 0,
  completedCases: [],
  lastSolvedDate: '',
  isPremium: false,
  isAdmin: false,
  role: "USER",
  isDisabled: false,
  friends: [],
  learningMode: true,
  referrals: 0,
  lastDailyCoinDate: '',
  premiumIcon: '🕵️',
};

export const useStore = create<GameState>((set, get) => ({
  user: null,
  stats: null,
  loading: true,
  activeDictionary: {},
  setActiveDictionary: (dict) => set({ activeDictionary: dict }),
  
  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (user.email && !data.email) {
            await updateDoc(userRef, { email: user.email, displayName: user.displayName || 'Anonymous Detective' });
            data.email = user.email;
            data.displayName = user.displayName || 'Anonymous Detective';
          }
          set({ user, stats: data as PlayerStats, loading: false });
        } else {
          const statsToSave = { ...DEFAULT_STATS, email: user.email || '', displayName: user.displayName || 'Anonymous Detective' };
          await setDoc(userRef, statsToSave);
          set({ user, stats: statsToSave, loading: false });
        }
      } else {
        set({ user: null, stats: null, loading: false });
      }
    });
  },
  
  loginGuest: async () => {
    set({ loading: true });
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.error("Guest login failed", e);
      set({ loading: false });
      throw e;
    }
  },
  
  loginWithEmail: async (e: string, p: string) => {
    set({ loading: true });
    try {
      await signInWithEmailAndPassword(auth, e, p);
    } catch (err) {
      console.error("Email login failed", err);
      set({ loading: false });
      throw err;
    }
  },
  
  signUpWithEmail: async (e: string, p: string) => {
    set({ loading: true });
    try {
      await createUserWithEmailAndPassword(auth, e, p);
    } catch (err) {
      console.error("Email signup failed", err);
      set({ loading: false });
      throw err;
    }
  },
  
  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google login failed", err);
      set({ loading: false });
      throw err;
    }
  },
  
  resetPassword: async (e: string) => {
    try {
      await sendPasswordResetEmail(auth, e);
    } catch (err) {
      console.error("Password reset failed", err);
      throw err;
    }
  },
  
  signOut: async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Sign out failed", e);
    }
  },
  
  solveCase: async (caseId: string, xpReward: number, coinReward: number) => {
    const { user, stats } = get();
    if (!user || !stats) return;
    
    if (stats.completedCases.includes(caseId)) return; // Already solved
    
    const todayStr = new Date().toISOString().split('T')[0];
    const newStats = {
      ...stats,
      xp: stats.xp + xpReward,
      coins: stats.coins + coinReward,
      completedCases: [...stats.completedCases, caseId],
      lastSolvedDate: todayStr,
      streak: stats.streak + 1, // simplified streak logic
    };
    
    if (newStats.xp > 1000) newStats.rank = 'Detective';
    else if (newStats.xp > 500) newStats.rank = 'Junior Detective';
    
    set({ stats: newStats });
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      xp: newStats.xp,
      coins: newStats.coins,
      completedCases: newStats.completedCases,
      lastSolvedDate: newStats.lastSolvedDate,
      streak: newStats.streak,
      rank: newStats.rank
    });
  },
  
  spendCoins: async (amount: number) => {
    const { user, stats } = get();
    if (!user || !stats || stats.coins < amount) return false;
    
    const newStats = {
      ...stats,
      coins: stats.coins - amount
    };
    
    set({ stats: newStats });
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newStats.coins });
    return true;
  },
  
  purchasePremium: async () => {
    const { user, stats } = get();
    if (!user || !stats || stats.isPremium) return;
    
    const newStats = {
      ...stats,
      isPremium: true
    };
    
    set({ stats: newStats });
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { isPremium: true });
  },
  
  addFriend: async (friendId: string) => {
    const { user, stats } = get();
    if (!user || !stats) return false;
    
    if (stats.friends?.includes(friendId) || friendId === user.uid) return false;
    
    try {
      const friendRef = doc(db, 'users', friendId);
      const friendSnap = await getDoc(friendRef);
      if (!friendSnap.exists()) return false;
      
      const newFriends = [...(stats.friends || []), friendId];
      set({ stats: { ...stats, friends: newFriends } });
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { friends: newFriends });
      return true;
    } catch (e) {
      console.error("Failed to add friend", e);
      return false;
    }
  },
  
  watchAd: async () => {
    const { user, stats } = get();
    if (!user || !stats) return;
    
    await new Promise(r => setTimeout(r, 1500));
    
    const newStats = {
      ...stats,
      coins: stats.coins + 50
    };
    
    set({ stats: newStats });
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newStats.coins });
  },
  
  toggleLearningMode: async () => {
    const { user, stats } = get();
    if (!user || !stats) return;
    
    const newMode = !(stats.learningMode ?? true);
    const newStats = {
      ...stats,
      learningMode: newMode
    };
    
    set({ stats: newStats });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { learningMode: newMode });
  },
  
  addReferral: async () => {
    const { user, stats } = get();
    if (!user || !stats) return;
    
    const currentRef = stats.referrals || 0;
    const newStats = { ...stats, referrals: currentRef + 1 };
    
    if (newStats.referrals >= 19 && !newStats.isPremium) {
      newStats.isPremium = true;
    }
    
    set({ stats: newStats });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { referrals: newStats.referrals, isPremium: newStats.isPremium });
  },
  
  claimDailyCoins: async () => {
    const { user, stats } = get();
    if (!user || !stats || !stats.isPremium) return false;
    
    const todayStr = new Date().toISOString().split('T')[0];
    if (stats.lastDailyCoinDate === todayStr) return false; 

    const newStats = {
      ...stats,
      coins: stats.coins + 100, 
      lastDailyCoinDate: todayStr
    };
    
    set({ stats: newStats });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newStats.coins, lastDailyCoinDate: todayStr });
    return true;
  },
  
  updatePremiumIcon: async (icon: string) => {
    const { user, stats } = get();
    if (!user || !stats || !stats.isPremium) return;
    
    const newStats = { ...stats, premiumIcon: icon };
    set({ stats: newStats });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { premiumIcon: icon });
  }
}));
`;
fs.writeFileSync('src/store/useStore.ts', content);
