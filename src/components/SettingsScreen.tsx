import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Droplet,
  Volume2,
  Clock,
  ShieldCheck,
  LogOut,
  User,
  Sparkles,
  Check,
  Send,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { notificationManager } from '../utils/notifications';
import { soundEffects } from '../utils/audio';
import { BadgesSection } from './BadgesSection';

export const SettingsScreen: React.FC = () => {
  const {
    user,
    isGuest,
    profile,
    theme,
    setTheme,
    updateProfileSettings,
    updateNotificationSettings,
    openAuthModal,
    logout,
  } = useApp();

  const [dailyGoal, setDailyGoal] = useState<number>(profile.dailyGoal);
  const [servingSize, setServingSize] = useState<number>(profile.servingSize);
  const [unit, setUnit] = useState<'ml' | 'oz'>(profile.unit);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(
    profile.notificationSettings.enabled
  );
  const [frequencyMinutes, setFrequencyMinutes] = useState<number>(
    profile.notificationSettings.frequencyMinutes
  );
  const [startTime, setStartTime] = useState<string>(profile.notificationSettings.startTime);
  const [endTime, setEndTime] = useState<string>(profile.notificationSettings.endTime);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(profile.notificationSettings.sound);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    notificationManager.getPermissionStatus()
  );

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    soundEffects.playSoftClick();
    await setTheme(newTheme);
  };

  const handleRequestPermission = async () => {
    const perm = await notificationManager.requestPermission();
    setPermissionState(perm);
    if (perm === 'granted') {
      setNotificationEnabled(true);
      await updateNotificationSettings({
        enabled: true,
        frequencyMinutes,
        startTime,
        endTime,
        sound: soundEnabled,
      });
      notificationManager.sendTestReminder(soundEnabled);
    }
  };

  const handleTestReminder = () => {
    notificationManager.sendTestReminder(soundEnabled);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSoftClick();

    await updateProfileSettings({
      dailyGoal,
      servingSize,
      unit,
      theme,
      notificationSettings: {
        enabled: notificationEnabled,
        frequencyMinutes,
        startTime,
        endTime,
        sound: soundEnabled,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-4 space-y-6">
      {/* Account Info Card */}
      <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-stone-800 dark:text-emerald-50">
                {profile.displayName || (isGuest ? 'Guest Hydrator' : 'Explorer')}
              </h2>
              {isGuest ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  Guest Mode
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  Cloud Synced
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {user?.email || 'Local storage session'}
            </p>
          </div>
        </div>

        <div>
          {isGuest ? (
            <button
              onClick={openAuthModal}
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Link Account</span>
            </button>
          ) : (
            <button
              onClick={logout}
              type="button"
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#223d30] hover:bg-stone-50 dark:hover:bg-[#1b2b23] text-stone-600 dark:text-stone-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* SPECIAL ACHIEVEMENT BADGES SECTION */}
      <BadgesSection />

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* GLOBAL THEME TOGGLE SECTION (DARK GREEN & CHARCOAL PALETTE) */}
        <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e352a] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800 dark:text-emerald-50">Visual Theme</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Switch between sunny desert daylight and atmospheric dark green & charcoal.
                </p>
              </div>
            </div>

            {/* Quick Pill Switch */}
            <button
              type="button"
              onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer bg-stone-100 dark:bg-[#0d1410] border-stone-200 dark:border-[#223d30] text-stone-700 dark:text-emerald-300"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/40" />
                  <span>Dark Mode On</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/40" />
                  <span>Light Mode On</span>
                </>
              )}
            </button>
          </div>

          {/* Theme Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Light Meadow Option */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'light'
                  ? 'border-emerald-600 bg-amber-50/80 dark:bg-[#182820] shadow-sm ring-2 ring-emerald-500/30'
                  : 'border-stone-200 dark:border-[#1e352a] bg-stone-50/50 dark:bg-[#0d1410]/70 hover:border-emerald-300 dark:hover:border-emerald-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 dark:text-emerald-50">
                    Light Meadow
                  </span>
                </div>
                {theme === 'light' && (
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                Warm soft cream, natural sunlight greens, and earthy terracotta accents.
              </p>
              {/* Color Swatch Preview */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-[#fffbeb] border border-amber-200" title="Cream" />
                <span className="w-5 h-5 rounded-md bg-[#22c55e]" title="Fresh Green" />
                <span className="w-5 h-5 rounded-md bg-[#ea580c]" title="Terracotta" />
                <span className="w-5 h-5 rounded-md bg-[#0284c7]" title="Water Blue" />
              </div>
            </button>

            {/* Charcoal Oasis Option */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-[#0c1a13] shadow-md ring-2 ring-emerald-400/30'
                  : 'border-stone-200 dark:border-[#1e352a] bg-stone-50/50 dark:bg-[#0d1410]/70 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    <Moon className="w-4 h-4 fill-emerald-400/30" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 dark:text-emerald-50">
                    Charcoal Oasis
                  </span>
                </div>
                {theme === 'dark' && (
                  <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/80">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                Atmospheric dark green & deep charcoal with bioluminescent emerald night glow.
              </p>
              {/* Color Swatch Preview */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-[#0d1410] border border-[#1e352a]" title="Charcoal Green Base" />
                <span className="w-5 h-5 rounded-md bg-[#131e18] border border-[#233a2d]" title="Deep Charcoal Card" />
                <span className="w-5 h-5 rounded-md bg-[#059669]" title="Forest Jade" />
                <span className="w-5 h-5 rounded-md bg-[#34d399]" title="Vibrant Sprout Glow" />
                <span className="w-5 h-5 rounded-md bg-[#38bdf8]" title="Moonlit Water" />
              </div>
            </button>
          </div>
        </div>

        {/* Hydration Goals & Units Section */}
        <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-6 space-y-5 transition-colors">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-[#1e352a] pb-3">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-stone-800 dark:text-emerald-50">Hydration Preferences</h3>
          </div>

          {/* Unit Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-2">
              Measurement Unit
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => setUnit('ml')}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  unit === 'ml'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'border-stone-200 dark:border-[#1e352a] bg-white dark:bg-[#0d1410] text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#16241e]'
                }`}
              >
                Millilitres (ml)
              </button>
              <button
                type="button"
                onClick={() => setUnit('oz')}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  unit === 'oz'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'border-stone-200 dark:border-[#1e352a] bg-white dark:bg-[#0d1410] text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#16241e]'
                }`}
              >
                Fluid Ounces (oz)
              </button>
            </div>
          </div>

          {/* Daily Goal Target */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                Daily Hydration Target
              </label>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                {unit === 'oz' ? `${(dailyGoal * 0.033814).toFixed(0)} oz` : `${dailyGoal} ml`}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="4500"
              step="100"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500 mt-1">
              <span>1000 ml (Low)</span>
              <span>2000 ml (Recommended)</span>
              <span>4500 ml (High)</span>
            </div>
          </div>

          {/* Serving Size */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                Default Water Serving Size
              </label>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                {unit === 'oz' ? `${(servingSize * 0.033814).toFixed(1)} oz` : `${servingSize} ml`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[150, 200, 250, 350, 500].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setServingSize(sz)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    servingSize === sz
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'border-stone-200 dark:border-[#1e352a] bg-white dark:bg-[#0d1410] text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#16241e]'
                  }`}
                >
                  {unit === 'oz' ? `${(sz * 0.033814).toFixed(1)} oz` : `${sz} ml`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1.5">
              Each tap of the Fill Up button records this volume and adds +5% cactus growth.
            </p>
          </div>
        </div>

        {/* PUSH NOTIFICATIONS & REMINDERS SECTION */}
        <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e352a] pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-stone-800 dark:text-emerald-50">
                  Hydration Push Reminders
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Receive encouraging reminders to drink water and care for your cactus.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 dark:bg-[#1a2b22] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Browser Notification Permission Banner */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0d1410] border border-stone-200/80 dark:border-[#1e352a] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span className="text-stone-700 dark:text-stone-300">
                Browser Notifications:{' '}
                <strong
                  className={
                    permissionState === 'granted'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : permissionState === 'denied'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }
                >
                  {permissionState === 'granted'
                    ? 'Active'
                    : permissionState === 'denied'
                    ? 'Blocked in Browser'
                    : 'Permission Needed'}
                </strong>
              </span>
            </div>

            {permissionState !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
              >
                Enable Notifications
              </button>
            )}
          </div>

          {notificationEnabled && (
            <div className="space-y-4 pt-2">
              {/* Frequency Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-2">
                  Reminder Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Every 30 mins', val: 30 },
                    { label: 'Every 1 hour', val: 60 },
                    { label: 'Every 1.5 hours', val: 90 },
                    { label: 'Every 2 hours', val: 120 },
                    { label: 'Every 3 hours', val: 180 },
                    { label: 'Every 4 hours', val: 240 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setFrequencyMinutes(item.val)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        frequencyMinutes === item.val
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
                          : 'border-stone-200 dark:border-[#1e352a] bg-white dark:bg-[#0d1410] text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#16241e]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-2">
                  Active Reminder Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold mb-1 block">
                      Start Time (Morning)
                    </span>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-stone-200 dark:border-[#1e352a] bg-stone-50 dark:bg-[#0d1410] text-stone-800 dark:text-emerald-50 focus:bg-white dark:focus:bg-[#131e18] focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold mb-1 block">
                      End Time (Evening)
                    </span>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-stone-200 dark:border-[#1e352a] bg-stone-50 dark:bg-[#0d1410] text-stone-800 dark:text-emerald-50 focus:bg-white dark:focus:bg-[#131e18] focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1.5">
                  Notifications will only trigger between {startTime} and {endTime} so your sleep is never disturbed.
                </p>
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Audio Chime Alert
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 dark:bg-[#1a2b22] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Test Reminder and Sound Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => soundEffects.playWaterDrop()}
                  className="py-2.5 px-3 rounded-xl border border-cyan-200 dark:border-cyan-800/80 bg-cyan-50/60 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Preview Water Droplet</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestReminder}
                  className="py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Reminder</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" />
              Settings saved!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
