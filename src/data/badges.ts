import { Badge, UserProfile, DailyRecord } from '../types';

export const BADGES_CATALOG: Badge[] = [
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Drank water before 9:00 AM to kickstart morning vitality.',
    category: 'timing',
    iconName: 'Sunrise',
    gradient: 'from-amber-400 to-orange-500',
    accentColor: '#f59e0b',
    requirement: 'Log a drink before 9:00 AM',
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Maintained a 7-day consecutive hydration streak.',
    category: 'streak',
    iconName: 'Flame',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: '#ea580c',
    requirement: 'Achieve a 7-day consecutive streak',
  },
  {
    id: 'glass_100',
    name: '100th Glass',
    description: 'Drank 100 total servings of water! Century Sipper master.',
    category: 'volume',
    iconName: 'Trophy',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    accentColor: '#0284c7',
    requirement: 'Record 100 lifetime Fill Up taps',
  },
  {
    id: 'first_drop',
    name: 'First Drop',
    description: 'Took your first sip and recorded your first Fill Up!',
    category: 'growth',
    iconName: 'Droplet',
    gradient: 'from-emerald-400 to-teal-500',
    accentColor: '#10b981',
    requirement: 'Record your very first water drink',
  },
  {
    id: 'night_owl',
    name: 'Night Owl Hydrator',
    description: 'Logged water between 9:00 PM and midnight to rest hydrated.',
    category: 'timing',
    iconName: 'Moon',
    gradient: 'from-indigo-500 via-purple-600 to-slate-800',
    accentColor: '#6366f1',
    requirement: 'Log a drink between 9:00 PM and midnight',
  },
  {
    id: 'streak_14',
    name: '14-Day Habit Master',
    description: 'Two full weeks of continuous hydration discipline.',
    category: 'streak',
    iconName: 'Zap',
    gradient: 'from-yellow-400 via-amber-500 to-red-500',
    accentColor: '#f59e0b',
    requirement: 'Achieve a 14-day consecutive streak',
  },
  {
    id: 'full_bloom',
    name: 'Full Bloom Hero',
    description: 'Nurtured a cactus to 100% full maturity and blossom in a single day.',
    category: 'growth',
    iconName: 'Sparkles',
    gradient: 'from-pink-500 via-rose-500 to-emerald-500',
    accentColor: '#ec4899',
    requirement: 'Reach 100% cactus growth (20 taps in 1 day)',
  },
  {
    id: 'greenhouse_master',
    name: 'Green Thumb Collector',
    description: 'Unlocked 3 or more rare cactus varieties in your garden.',
    category: 'collection',
    iconName: 'Sprout',
    gradient: 'from-emerald-500 via-teal-600 to-emerald-800',
    accentColor: '#059669',
    requirement: 'Unlock 3 species in the Cactus Garden',
  },
  {
    id: 'champion_10',
    name: 'Hydration Champion',
    description: 'Achieved your daily hydration goal 10 total times.',
    category: 'volume',
    iconName: 'Award',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    accentColor: '#d97706',
    requirement: 'Complete daily goal for 10 total days',
  },
  {
    id: 'desert_oasis',
    name: 'Desert Oasis',
    description: 'Consumed 3,000 ml or more in a single day.',
    category: 'volume',
    iconName: 'Waves',
    gradient: 'from-teal-400 via-cyan-500 to-blue-600',
    accentColor: '#0d9488',
    requirement: 'Drink at least 3,000 ml in a single day',
  },
];

/**
 * Calculates unlock status, progress percentage, and progress labels for each badge
 */
export function evaluateBadges(
  profile: UserProfile,
  todayRecord: DailyRecord,
  historyRecords: DailyRecord[]
): Array<Badge & { isUnlocked: boolean; progressPercent: number; progressLabel: string }> {
  // Combine today + history records
  const allRecords = [todayRecord, ...historyRecords.filter((r) => r.id !== todayRecord.id)];

  // 1. Calculate total lifetime taps
  const totalLifetimeTaps =
    profile.lifetimeTaps ||
    allRecords.reduce((acc, curr) => acc + (curr.tapsCount || curr.drinks?.length || 0), 0);

  // 2. Check for Early Bird (any drink before 09:00)
  const hasEarlyBird = allRecords.some((r) =>
    r.drinks?.some((d) => {
      if (!d.time) return false;
      const [h] = d.time.split(':').map(Number);
      return h < 9;
    })
  );

  // 3. Check for Night Owl (any drink after 21:00 / 9pm)
  const hasNightOwl = allRecords.some((r) =>
    r.drinks?.some((d) => {
      if (!d.time) return false;
      const [h] = d.time.split(':').map(Number);
      return h >= 21;
    })
  );

  // 4. Check for Full Bloom in a single day
  const hasFullBloom = allRecords.some((r) => r.cactusGrowthPercentage >= 100 || r.tapsCount >= 20);

  // 5. Check for Desert Oasis (>= 3000 ml)
  const maxDayIntake = Math.max(0, ...allRecords.map((r) => r.totalIntake || 0));

  const maxStreak = Math.max(profile.currentStreak || 0, profile.longestStreak || 0);
  const unlockedBadgesSet = new Set(profile.unlockedBadges || []);

  return BADGES_CATALOG.map((badge) => {
    let isUnlocked = unlockedBadgesSet.has(badge.id);
    let progressPercent = 0;
    let progressLabel = '';

    switch (badge.id) {
      case 'early_bird':
        if (hasEarlyBird) isUnlocked = true;
        progressPercent = isUnlocked ? 100 : 0;
        progressLabel = isUnlocked ? 'Unlocked' : 'Log a drink before 9 AM';
        break;

      case 'streak_7':
        if (maxStreak >= 7) isUnlocked = true;
        progressPercent = Math.min(100, Math.round((maxStreak / 7) * 100));
        progressLabel = isUnlocked ? 'Unlocked' : `${maxStreak} / 7 Days`;
        break;

      case 'glass_100':
        if (totalLifetimeTaps >= 100) isUnlocked = true;
        progressPercent = Math.min(100, Math.round((totalLifetimeTaps / 100) * 100));
        progressLabel = isUnlocked ? 'Unlocked' : `${totalLifetimeTaps} / 100 Glasses`;
        break;

      case 'first_drop':
        if (totalLifetimeTaps >= 1) isUnlocked = true;
        progressPercent = isUnlocked ? 100 : 0;
        progressLabel = isUnlocked ? 'Unlocked' : '0 / 1 Drinks';
        break;

      case 'night_owl':
        if (hasNightOwl) isUnlocked = true;
        progressPercent = isUnlocked ? 100 : 0;
        progressLabel = isUnlocked ? 'Unlocked' : 'Log a drink after 9 PM';
        break;

      case 'streak_14':
        if (maxStreak >= 14) isUnlocked = true;
        progressPercent = Math.min(100, Math.round((maxStreak / 14) * 100));
        progressLabel = isUnlocked ? 'Unlocked' : `${maxStreak} / 14 Days`;
        break;

      case 'full_bloom':
        if (hasFullBloom) isUnlocked = true;
        progressPercent = isUnlocked ? 100 : Math.round(todayRecord.cactusGrowthPercentage);
        progressLabel = isUnlocked ? 'Unlocked' : `${todayRecord.cactusGrowthPercentage}% Today`;
        break;

      case 'greenhouse_master':
        const cactiCount = profile.unlockedCacti?.length || 1;
        if (cactiCount >= 3) isUnlocked = true;
        progressPercent = Math.min(100, Math.round((cactiCount / 3) * 100));
        progressLabel = isUnlocked ? 'Unlocked' : `${cactiCount} / 3 Cacti`;
        break;

      case 'champion_10':
        const successfulDays = profile.totalSuccessfulDays || 0;
        if (successfulDays >= 10) isUnlocked = true;
        progressPercent = Math.min(100, Math.round((successfulDays / 10) * 100));
        progressLabel = isUnlocked ? 'Unlocked' : `${successfulDays} / 10 Days Won`;
        break;

      case 'desert_oasis':
        if (maxDayIntake >= 3000) isUnlocked = true;
        progressPercent = Math.min(100, Math.round((maxDayIntake / 3000) * 100));
        progressLabel = isUnlocked ? 'Unlocked' : `${maxDayIntake} / 3000 ml`;
        break;

      default:
        progressPercent = isUnlocked ? 100 : 0;
        progressLabel = isUnlocked ? 'Unlocked' : 'In Progress';
    }

    return {
      ...badge,
      isUnlocked,
      progressPercent,
      progressLabel,
    };
  });
}

/**
 * Returns newly unlocked badges that have not yet been added to profile.unlockedBadges
 */
export function checkNewBadges(
  profile: UserProfile,
  todayRecord: DailyRecord,
  historyRecords: DailyRecord[]
): Badge[] {
  const currentUnlocked = new Set(profile.unlockedBadges || []);
  const evaluated = evaluateBadges(profile, todayRecord, historyRecords);
  return evaluated
    .filter((b) => b.isUnlocked && !currentUnlocked.has(b.id))
    .map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      category: b.category,
      iconName: b.iconName,
      gradient: b.gradient,
      accentColor: b.accentColor,
      requirement: b.requirement,
    }));
}
