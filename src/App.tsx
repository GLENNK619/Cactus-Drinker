import React, { useState } from 'react';
import {
  Home,
  Sprout,
  BarChart3,
  Settings,
  Droplet,
  Flame,
  User,
  Sparkles,
  X,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { CactusGarden } from './components/CactusGarden';
import { ProgressHistory } from './components/ProgressHistory';
import { SettingsScreen } from './components/SettingsScreen';
import { AuthModal } from './components/AuthModal';
import { MilestoneModal } from './components/MilestoneModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ToastBanner } from './components/ToastBanner';
import { CACTUS_VARIETIES } from './data/cacti';

type NavTab = 'dashboard' | 'garden' | 'history' | 'settings';

function MainApp() {
  const {
    user,
    isGuest,
    profile,
    todayRecord,
    toast,
    setToast,
    milestoneData,
    clearMilestone,
    setActiveCactus,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    continueAsGuest,
    theme,
    toggleTheme,
  } = useApp();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [hasDismissedWelcome, setHasDismissedWelcome] = useState<boolean>(() => {
    return localStorage.getItem('cactusdrop_welcome_seen') === 'true';
  });

  const handleStartFromWelcome = () => {
    setHasDismissedWelcome(true);
    localStorage.setItem('cactusdrop_welcome_seen', 'true');
  };

  const handleOpenAuthFromWelcome = () => {
    setHasDismissedWelcome(true);
    localStorage.setItem('cactusdrop_welcome_seen', 'true');
    openAuthModal();
  };

  // If first-time user hasn't seen welcome screen yet
  if (!hasDismissedWelcome && isGuest && todayRecord.tapsCount === 0) {
    return (
      <WelcomeScreen
        onStart={handleStartFromWelcome}
        onOpenAuth={handleOpenAuthFromWelcome}
      />
    );
  }

  const activeCactus =
    CACTUS_VARIETIES.find((c) => c.id === (milestoneData?.cactusId || profile.activeCactusId)) ||
    CACTUS_VARIETIES[0];
  const activePotId = profile.customPots[activeCactus.id] || 'terracotta';

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50 dark:bg-[#0d1410] text-stone-800 dark:text-emerald-50 transition-colors duration-300">
      {/* Top Animated Floating Toast Notification Banner */}
      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {/* Top Application Navbar */}
      <header className="sticky top-0 z-30 bg-amber-50/80 dark:bg-[#0d1410]/85 backdrop-blur-md border-b border-amber-200/60 dark:border-[#1e352a] px-4 py-3 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('dashboard')}
            type="button"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <div className="text-left">
              <span className="text-base font-black tracking-tight text-stone-900 dark:text-emerald-100 block leading-tight">
                CactusDrop
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-none">
                Hydrate & Bloom
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-amber-100/60 dark:bg-[#131e18] p-1 rounded-2xl border border-amber-200/60 dark:border-[#1e352a] transition-colors">
            <button
              onClick={() => setActiveTab('dashboard')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('garden')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'garden'
                  ? 'bg-white dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Cactus Garden</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>History</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Right Header Status (Theme Toggle, Streak & Profile) */}
          <div className="flex items-center gap-2">
            {/* Quick Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              title={theme === 'dark' ? 'Switch to Light Meadow' : 'Switch to Charcoal Oasis (Dark Mode)'}
              className="p-2 rounded-xl border border-stone-200 dark:border-[#1e352a] bg-white dark:bg-[#131e18] text-stone-600 dark:text-emerald-300 hover:bg-stone-50 dark:hover:bg-[#182820] shadow-2xs transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {/* Streak Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-xs font-extrabold shadow-2xs transition-colors">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600 dark:text-amber-400" />
              <span>{profile.currentStreak}d</span>
            </div>

            {/* Profile / Auth Button */}
            {isGuest ? (
              <button
                onClick={openAuthModal}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131e18] hover:bg-emerald-50 dark:hover:bg-[#1a2b22] text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/80 dark:border-[#223d30] shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('settings')}
                type="button"
                className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-emerald-400 cursor-pointer"
                title={user?.email || 'Settings'}
              >
                {profile.displayName?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigateToGarden={() => setActiveTab('garden')} />
        )}
        {activeTab === 'garden' && <CactusGarden />}
        {activeTab === 'history' && <ProgressHistory />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#0d1410]/95 backdrop-blur-md border-t border-stone-200/80 dark:border-[#1e352a] px-4 py-2 flex items-center justify-around shadow-lg transition-colors">
        <button
          onClick={() => setActiveTab('dashboard')}
          type="button"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('garden')}
          type="button"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'garden'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Garden</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          type="button"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">History</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          type="button"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>

      {/* Global Milestone Celebration Modal */}
      {milestoneData && (
        <MilestoneModal
          type={milestoneData.type}
          cactus={activeCactus}
          streakCount={profile.currentStreak}
          potId={activePotId}
          onClose={clearMilestone}
          onSetActive={setActiveCactus}
        />
      )}

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onContinueAsGuest={continueAsGuest}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
