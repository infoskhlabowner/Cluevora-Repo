/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import CaseScreen from './screens/CaseScreen';

import CasesScreen from './screens/CasesScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import EvidenceScreen from './screens/EvidenceScreen';
import AdminScreen from './screens/AdminScreen';
import SettingsScreen from './screens/SettingsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';

export default function App() {
  const { user, loading, initAuth } = useStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-500">Loading...</div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/case/:id" element={<CaseScreen />} />
        <Route path="/privacy" element={<PrivacyPolicyScreen />} />
        <Route path="/terms" element={<TermsOfServiceScreen />} />
        
        <Route path="/" element={<Layout><HomeScreen /></Layout>} />
        <Route path="/cases" element={<Layout><CasesScreen /></Layout>} />
        <Route path="/evidence" element={<Layout><EvidenceScreen /></Layout>} />
        <Route path="/leaderboard" element={<Layout><LeaderboardScreen /></Layout>} />
        <Route path="/profile" element={<Layout><ProfileScreen /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsScreen /></Layout>} />
        <Route path="/admin" element={<Layout><AdminScreen /></Layout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
