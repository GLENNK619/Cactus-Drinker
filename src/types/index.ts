export type UnitType = 'ml' | 'oz';

export interface DrinkEntry {
  id: string;
  time: string; // HH:mm
  timestamp: number;
  amount: number; // in ml
  growthAdded: number; // 5%
}

export interface NotificationSettings {
  enabled: boolean;
  frequencyMinutes: number; // 30, 60, 90, 120, 180, 240
  startTime: string; // "08:00"
  endTime: string; // "22:00"
  sound: boolean;
}

export interface UserProfile {
  uid: string;
  email?: string;
  displayName?: string;
  dailyGoal: number; // in ml (e.g. 2000)
  servingSize: number; // in ml (e.g. 250)
  unit: UnitType;
  currentStreak: number;
  longestStreak: number;
  totalSuccessfulDays: number;
  lastHydrationDate?: string; // YYYY-MM-DD
  activeCactusId: string;
  dailyRotationEnabled?: boolean; // Changes cactus each day to create botanical diversity
  customPots: Record<string, string>; // cactusId -> potId
  notificationSettings: NotificationSettings;
  unlockedCacti: string[];
  unlockedBadges?: string[];
  lifetimeTaps?: number;
  theme?: 'light' | 'dark';
  createdAt?: string;
  updatedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'volume' | 'timing' | 'growth' | 'collection';
  iconName: string;
  gradient: string;
  accentColor: string;
  requirement: string;
}

export interface DailyRecord {
  id: string; // YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  totalIntake: number; // ml
  goal: number; // ml
  goalAchieved: boolean;
  tapsCount: number;
  cactusGrowthPercentage: number; // 0 - 100
  cactusId: string;
  drinks: DrinkEntry[];
  lastUpdated: string;
}

export interface CactusVariety {
  id: string;
  name: string;
  latinName: string;
  requiredStreak: number;
  description: string;
  funFact: string;
  colorFamily: string;
  bloomType: string;
  rarity: 'Starter' | 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface PotDesign {
  id: string;
  name: string;
  style: string;
  description: string;
  rimColor: string;
  bodyColor: string;
  shadowColor: string;
  patternType?: 'plain' | 'ribbed' | 'geometric' | 'gold_rim' | 'speckled' | 'chevron' | 'brass';
  accentColor?: string;
}
