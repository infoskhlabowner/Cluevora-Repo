import { create } from 'zustand';
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
  isPremium?: boolean;
  isAdmin?: boolean;
  friends: string[];
}

interface GameState {
  user: User | null;
  stats: PlayerStats | null;
  loading: boolean;
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
}

const DEFAULT_STATS: PlayerStats = {
  xp: 0,
  coins: 50,
  rank: 'Recruit',
  streak: 0,
  completedCases: [],
  isPremium: false,
  isAdmin: false,
  friends: [],
};

export const useStore = create<GameState>((set, get) => ({
  user: null,
  stats: null,
  loading: true,

  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          set({ user, stats: snap.data() as PlayerStats, loading: false });
        } else {
          await setDoc(userRef, DEFAULT_STATS);
          set({ user, stats: DEFAULT_STATS, loading: false });
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

    const newStats = {
      ...stats,
      xp: stats.xp + xpReward,
      coins: stats.coins + coinReward,
      completedCases: [...stats.completedCases, caseId],
      streak: stats.streak + 1, // simplified streak logic
    };

    // basic rank calculation
    if (newStats.xp > 1000) newStats.rank = 'Detective';
    else if (newStats.xp > 500) newStats.rank = 'Junior Detective';

    set({ stats: newStats });
    
    // Persist
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      xp: newStats.xp,
      coins: newStats.coins,
      completedCases: newStats.completedCases,
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
    
    // Persist
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
    
    // Persist
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { isPremium: true });
  },

  addFriend: async (friendId: string) => {
    const { user, stats } = get();
    if (!user || !stats) return false;
    if (stats.friends?.includes(friendId) || friendId === user.uid) return false;

    // Verify friend exists
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
    
    // Simulate ad watch
    await new Promise(r => setTimeout(r, 1500));
    
    const newStats = {
      ...stats,
      coins: stats.coins + 50
    };
    set({ stats: newStats });
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newStats.coins });
  }
}));
