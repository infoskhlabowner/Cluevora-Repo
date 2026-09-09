const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');
content = content.replace(/  toggleLearningMode[\s\S]+$/, `  toggleLearningMode: async () => {
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
    
    // Auto upgrade if reaching 19
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
    if (stats.lastDailyCoinDate === todayStr) return false; // Already claimed

    const newStats = {
      ...stats,
      coins: stats.coins + 100, // Premium daily coins
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
}));`);
fs.writeFileSync('src/store/useStore.ts', content);
