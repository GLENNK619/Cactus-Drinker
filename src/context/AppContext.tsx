import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { UserProfile, DailyRecord, DrinkEntry, NotificationSettings } from '../types';
import { CACTUS_VARIETIES, getDailyCactusForDate } from '../data/cacti';
import { checkNewBadges } from '../data/badges';
import { soundEffects } from '../utils/audio';
import { notificationManager, ToastAlert } from '../utils/notifications';

interface AppContextType {
  user: User | null;
  isGuest: boolean;
  profile: UserProfile;
  todayRecord: DailyRecord;
  historyRecords: DailyRecord[];
  isWatering: boolean;
  toast: ToastAlert | null;
  milestoneData: {
    type: 'cactus_unlocked' | 'cactus_grown' | 'goal_achieved';
    cactusId?: string;
  } | null;
  fillUp: (amount?: number) => Promise<void>;
  updateProfileSettings: (settings: Partial<UserProfile>) => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  updateCactusPot: (cactusId: string, potId: string) => Promise<void>;
  setActiveCactus: (cactusId: string) => Promise<void>;
  setToast: (toast: ToastAlert | null) => void;
  clearMilestone: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  toggleTheme: () => Promise<void>;
  toggleDailyRotation: (forceVal?: boolean) => Promise<void>;
}

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest_user',
  displayName: 'Desert Explorer',
  dailyGoal: 2000,
  servingSize: 250,
  unit: 'ml',
  currentStreak: 0,
  longestStreak: 0,
  totalSuccessfulDays: 0,
  activeCactusId: 'saguaro_sprout',
  dailyRotationEnabled: true,
  customPots: {
    saguaro_sprout: 'terracotta',
  },
  notificationSettings: {
    enabled: false,
    frequencyMinutes: 60,
    startTime: '08:00',
    endTime: '22:00',
    sound: true,
  },
  unlockedCacti: ['saguaro_sprout'],
  unlockedBadges: [],
  lifetimeTaps: 0,
  theme: 'light',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const todayDate = getTodayDateString();
  const dailyCactusToday = getDailyCactusForDate(todayDate).id;

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedTheme = (localStorage.getItem('cactusdrop_theme') as 'light' | 'dark') || 'light';
    const saved = localStorage.getItem('cactusdrop_guest_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const rotEnabled = parsed.dailyRotationEnabled !== false;
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          dailyRotationEnabled: rotEnabled,
          activeCactusId: rotEnabled ? dailyCactusToday : (parsed.activeCactusId || DEFAULT_PROFILE.activeCactusId),
          theme: parsed.theme || savedTheme,
        };
      } catch {
        // ignore
      }
    }
    return {
      ...DEFAULT_PROFILE,
      activeCactusId: dailyCactusToday,
      theme: savedTheme,
    };
  });

  const [todayRecord, setTodayRecord] = useState<DailyRecord>(() => {
    const saved = localStorage.getItem(`cactusdrop_record_${todayDate}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          cactusId: parsed.cactusId || dailyCactusToday,
        };
      } catch {
        // ignore
      }
    }
    return {
      id: todayDate,
      userId: 'guest_user',
      date: todayDate,
      totalIntake: 0,
      goal: DEFAULT_PROFILE.dailyGoal,
      goalAchieved: false,
      tapsCount: 0,
      cactusGrowthPercentage: 0,
      cactusId: dailyCactusToday,
      drinks: [],
      lastUpdated: new Date().toISOString(),
    };
  });

  const [historyRecords, setHistoryRecords] = useState<DailyRecord[]>([]);
  const [isWatering, setIsWatering] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastAlert | null>(null);
  const [milestoneData, setMilestoneData] = useState<{
    type: 'cactus_unlocked' | 'cactus_grown' | 'goal_achieved';
    cactusId?: string;
  } | null>(null);

  // Bind toast listener to notificationManager
  useEffect(() => {
    notificationManager.setToastListener((t) => {
      setToast(t);
      setTimeout(() => setToast(null), 5000);
    });
  }, []);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    const activeTheme = profile.theme || 'light';
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#0d1410] text-emerald-50 antialiased selection:bg-emerald-800 selection:text-emerald-100 min-h-screen transition-colors duration-300';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-amber-50/40 text-stone-800 antialiased selection:bg-emerald-200 selection:text-emerald-900 min-h-screen transition-colors duration-300';
    }
    localStorage.setItem('cactusdrop_theme', activeTheme);
  }, [profile.theme]);

  // Sync Schedule Watcher with notification settings
  useEffect(() => {
    const getLastDrinkTime = () => {
      if (todayRecord.drinks.length > 0) {
        return todayRecord.drinks[todayRecord.drinks.length - 1].timestamp;
      }
      return Date.now() - 30 * 60 * 1000;
    };
    notificationManager.startScheduleWatcher(profile.notificationSettings, getLastDrinkTime);

    return () => {
      notificationManager.stopScheduleWatcher();
    };
  }, [profile.notificationSettings, todayRecord.drinks]);

  // Load User Data from Firestore
  const loadUserData = useCallback(async (firebaseUser: User) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      let currentProf: UserProfile;
      if (snap.exists()) {
        currentProf = snap.data() as UserProfile;
        // Merge in defaults if missing
        currentProf = {
          ...DEFAULT_PROFILE,
          ...currentProf,
          uid: firebaseUser.uid,
          email: firebaseUser.email || currentProf.email,
          displayName: firebaseUser.displayName || currentProf.displayName,
          customPots: { ...DEFAULT_PROFILE.customPots, ...(currentProf.customPots || {}) },
          unlockedCacti: currentProf.unlockedCacti?.length ? currentProf.unlockedCacti : ['saguaro_sprout'],
          unlockedBadges: currentProf.unlockedBadges || [],
          lifetimeTaps: currentProf.lifetimeTaps || 0,
        };
      } else {
        // Create initial profile in Firestore
        currentProf = {
          ...DEFAULT_PROFILE,
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          displayName: firebaseUser.displayName || 'Water Explorer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, currentProf);
      }
      setProfile(currentProf);

      // Load Today's Record from Firestore
      const today = getTodayDateString();
      const recordRef = doc(db, 'users', firebaseUser.uid, 'dailyRecords', today);
      const recordSnap = await getDoc(recordRef);

      if (recordSnap.exists()) {
        setTodayRecord(recordSnap.data() as DailyRecord);
      } else {
        const newRecord: DailyRecord = {
          id: today,
          userId: firebaseUser.uid,
          date: today,
          totalIntake: 0,
          goal: currentProf.dailyGoal,
          goalAchieved: false,
          tapsCount: 0,
          cactusGrowthPercentage: 0,
          cactusId: currentProf.activeCactusId,
          drinks: [],
          lastUpdated: new Date().toISOString(),
        };
        await setDoc(recordRef, newRecord);
        setTodayRecord(newRecord);
      }

      // Load Historical Records
      const historyQuery = query(
        collection(db, 'users', firebaseUser.uid, 'dailyRecords'),
        orderBy('date', 'desc'),
        limit(30)
      );
      const historySnap = await getDocs(historyQuery);
      const records: DailyRecord[] = [];
      historySnap.forEach((docSnap) => {
        records.push(docSnap.data() as DailyRecord);
      });
      setHistoryRecords(records);
    } catch (err) {
      console.error('Error loading user data:', err);
      handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
    }
  }, []);

  // Monitor Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        setUser(currUser);
        setIsGuest(false);
        await loadUserData(currUser);
      } else {
        setUser(null);
        setIsGuest(true);
      }
    });
    return () => unsub();
  }, [loadUserData]);

  // Guest persistence to localStorage
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('cactusdrop_guest_profile', JSON.stringify(profile));
    }
  }, [profile, isGuest]);

  useEffect(() => {
    if (isGuest) {
      localStorage.setItem(`cactusdrop_record_${todayRecord.date}`, JSON.stringify(todayRecord));
    }
  }, [todayRecord, isGuest]);

  // Fill Up Water Tap Action
  const fillUp = async (customAmount?: number) => {
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 800);

    const amountToAdd = customAmount || profile.servingSize;
    const newTotalIntake = todayRecord.totalIntake + amountToAdd;
    const newTapsCount = todayRecord.tapsCount + 1;
    // Exactly +5% per tap up to 100% (20 taps)
    const newGrowth = Math.min(100, todayRecord.cactusGrowthPercentage + 5);
    const newLifetimeTaps = (profile.lifetimeTaps || 0) + 1;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newDrink: DrinkEntry = {
      id: Math.random().toString(36).substring(2, 9),
      time: timeStr,
      timestamp: Date.now(),
      amount: amountToAdd,
      growthAdded: 5,
    };

    const newDrinks = [...todayRecord.drinks, newDrink];
    const today = getTodayDateString();
    const reachedGoalNow = !todayRecord.goalAchieved && newTotalIntake >= profile.dailyGoal;
    const isGoalAchieved = todayRecord.goalAchieved || reachedGoalNow;

    const updatedRecord: DailyRecord = {
      ...todayRecord,
      totalIntake: newTotalIntake,
      tapsCount: newTapsCount,
      cactusGrowthPercentage: newGrowth,
      goalAchieved: isGoalAchieved,
      drinks: newDrinks,
      lastUpdated: now.toISOString(),
    };

    setTodayRecord(updatedRecord);

    // Check if Cactus reached 100% just now
    if (todayRecord.cactusGrowthPercentage < 100 && newGrowth >= 100) {
      setMilestoneData({
        type: 'cactus_grown',
        cactusId: profile.activeCactusId,
      });
    }

    // Handle Streak and Unlocks if Goal Achieved Today for the first time
    let updatedProfile = { ...profile, lifetimeTaps: newLifetimeTaps };
    if (reachedGoalNow) {
      const yesterday = getYesterdayDateString();
      let newStreak = 1;
      if (profile.lastHydrationDate === yesterday) {
        newStreak = profile.currentStreak + 1;
      } else if (profile.lastHydrationDate === today) {
        newStreak = profile.currentStreak;
      } else {
        newStreak = 1;
      }

      const newLongest = Math.max(profile.longestStreak, newStreak);
      const newTotalSuccessful = profile.totalSuccessfulDays + 1;

      // Check for newly unlocked cacti based on consecutive streak
      const newlyUnlocked: string[] = [];
      CACTUS_VARIETIES.forEach((v) => {
        if (newStreak >= v.requiredStreak && !profile.unlockedCacti.includes(v.id)) {
          newlyUnlocked.push(v.id);
        }
      });

      const updatedUnlocked = Array.from(new Set([...profile.unlockedCacti, ...newlyUnlocked]));

      updatedProfile = {
        ...updatedProfile,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalSuccessfulDays: newTotalSuccessful,
        lastHydrationDate: today,
        unlockedCacti: updatedUnlocked,
      };

      if (newlyUnlocked.length > 0) {
        setMilestoneData({
          type: 'cactus_unlocked',
          cactusId: newlyUnlocked[0],
        });
      } else {
        setMilestoneData({
          type: 'goal_achieved',
        });
      }
    }

    // Evaluate and award newly earned achievement badges
    const tempProfileForBadgeCheck: UserProfile = {
      ...updatedProfile,
      lifetimeTaps: newLifetimeTaps,
    };
    const newlyEarnedBadges = checkNewBadges(
      tempProfileForBadgeCheck,
      updatedRecord,
      historyRecords
    );

    if (newlyEarnedBadges.length > 0) {
      const allUnlockedBadgeIds = Array.from(
        new Set([
          ...(updatedProfile.unlockedBadges || []),
          ...newlyEarnedBadges.map((b) => b.id),
        ])
      );
      updatedProfile.unlockedBadges = allUnlockedBadgeIds;

      // Celebrate the first unlocked badge
      const topBadge = newlyEarnedBadges[0];
      notificationManager.sendNotification(
        `Badge Unlocked: ${topBadge.name}! 🏆`,
        `${topBadge.description}`,
        profile.notificationSettings.sound
      );
      soundEffects.playCelebration();
    }

    updatedProfile.updatedAt = now.toISOString();
    setProfile(updatedProfile);

    // Save to Firestore if authenticated
    if (user && !isGuest) {
      try {
        const recordRef = doc(db, 'users', user.uid, 'dailyRecords', today);
        await setDoc(recordRef, updatedRecord);

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          lifetimeTaps: updatedProfile.lifetimeTaps,
          unlockedBadges: updatedProfile.unlockedBadges || [],
          currentStreak: updatedProfile.currentStreak,
          longestStreak: updatedProfile.longestStreak,
          totalSuccessfulDays: updatedProfile.totalSuccessfulDays,
          ...(updatedProfile.lastHydrationDate ? { lastHydrationDate: updatedProfile.lastHydrationDate } : {}),
          unlockedCacti: updatedProfile.unlockedCacti,
          updatedAt: updatedProfile.updatedAt,
        });
      } catch (err) {
        console.error('Error saving tap to Firestore:', err);
      }
    }

    // Update history records list in state
    setHistoryRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === today);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });
  };

  // Update Profile Settings (Goal, Serving, Unit, etc.)
  const updateProfileSettings = async (settings: Partial<UserProfile>) => {
    const updated = { ...profile, ...settings, updatedAt: new Date().toISOString() };
    setProfile(updated);

    if (user && !isGuest) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { ...settings, updatedAt: updated.updatedAt });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  // Update Notification Settings
  const updateNotificationSettings = async (notifSettings: NotificationSettings) => {
    await updateProfileSettings({ notificationSettings: notifSettings });
  };

  // Update Custom Pot for a specific Cactus
  const updateCactusPot = async (cactusId: string, potId: string) => {
    const newCustomPots = {
      ...profile.customPots,
      [cactusId]: potId,
    };
    await updateProfileSettings({ customPots: newCustomPots });
  };

  // Set Active Cactus on Dashboard
  const setActiveCactus = async (cactusId: string) => {
    await updateProfileSettings({ activeCactusId: cactusId });
  };

  const clearMilestone = () => setMilestoneData(null);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const continueAsGuest = () => {
    setIsGuest(true);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    if (user) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setIsGuest(true);
  };

  const setTheme = async (newTheme: 'light' | 'dark') => {
    await updateProfileSettings({ theme: newTheme });
  };

  const toggleTheme = async () => {
    const next = profile.theme === 'dark' ? 'light' : 'dark';
    await setTheme(next);
  };

  const value = useMemo(
    () => ({
      user,
      isGuest,
      profile,
      todayRecord,
      historyRecords,
      isWatering,
      toast,
      milestoneData,
      fillUp,
      updateProfileSettings,
      updateNotificationSettings,
      updateCactusPot,
      setActiveCactus,
      setToast,
      clearMilestone,
      openAuthModal,
      closeAuthModal,
      isAuthModalOpen,
      continueAsGuest,
      logout,
      theme: profile.theme || 'light',
      setTheme,
      toggleTheme,
    }),
    [
      user,
      isGuest,
      profile,
      todayRecord,
      historyRecords,
      isWatering,
      toast,
      milestoneData,
      isAuthModalOpen,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
