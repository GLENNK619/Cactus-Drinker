import React, { useState } from 'react';
import { Flame, Droplet, Sparkles, Trophy, Award, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CACTUS_VARIETIES } from '../data/cacti';
import { CactusSvg } from './CactusSvg';
import { WaterButton } from './WaterButton';
import { HydrationTipCard } from './HydrationTipCard';
import { ShareModal } from './ShareModal';
import { WaterBuddy } from './WaterBuddy';

interface DashboardProps {
  onNavigateToGarden: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToGarden }) => {
  const {
    profile,
    todayRecord,
    fillUp,
    isWatering,
  } = useApp();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const activeCactus =
    CACTUS_VARIETIES.find((c) => c.id === profile.activeCactusId) || CACTUS_VARIETIES[0];
  const activePotId = profile.customPots[profile.activeCactusId] || 'terracotta';

  // Format quantities
  const isOz = profile.unit === 'oz';
  const displayIntake = isOz
    ? `${(todayRecord.totalIntake * 0.033814).toFixed(1)} oz`
    : `${todayRecord.totalIntake} ml`;
  const displayGoal = isOz
    ? `${(profile.dailyGoal * 0.033814).toFixed(0)} oz`
    : `${profile.dailyGoal} ml`;

  const goalPercentage = Math.min(100, Math.round((todayRecord.totalIntake / profile.dailyGoal) * 100));
  const remainingMl = Math.max(0, profile.dailyGoal - todayRecord.totalIntake);
  const displayRemaining = isOz
    ? `${(remainingMl * 0.033814).toFixed(1)} oz`
    : `${remainingMl} ml`;

  // Growth Stage description
  const getGrowthStageText = (pct: number) => {
    if (pct >= 100) return 'Stage 5: Fully Grown & Radiant Bloom! 🌺🌟';
    if (pct >= 75) return 'Stage 4: Swelling Flower Bud 🌸';
    if (pct >= 45) return 'Stage 3: Branching & Arm Sprouting 🌵✨';
    if (pct >= 20) return 'Stage 2: Young Succulent Stem Growing 🌵';
    if (pct >= 5) return 'Stage 1: Sprout Rising & Unfurling Leaves 🌿';
    return 'Stage 1: Sprout Emerging from Soil 🌱';
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full px-4 py-4 space-y-5">
      {/* Top Status Badges: Streak & Goal Progress */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Streak Card */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-100/70 dark:bg-[#131e18] border border-amber-200/80 dark:border-[#1e352a] shadow-xs transition-colors">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-6 h-6 fill-amber-100" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-950 dark:text-amber-300">
                {profile.currentStreak}
              </span>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Days</span>
            </div>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400/90 truncate">
              {profile.currentStreak > 0 ? 'Consecutive Streak 🔥' : 'Start your streak today!'}
            </p>
          </div>
        </div>

        {/* Longest Streak / Goal Card */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-100/70 dark:bg-[#131e18] border border-emerald-200/80 dark:border-[#1e352a] shadow-xs transition-colors">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-950 dark:text-emerald-300">
                {profile.longestStreak}
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Days</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400/90 truncate">
              Record Best 🏆
            </p>
          </div>
        </div>
      </div>

      {/* Hydration Tip of the Day (Dismissible) */}
      <HydrationTipCard todayDate={todayRecord.date} />

      {/* Main Cactus Botanical Terrarium Showcase */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-amber-50 via-emerald-50/40 to-amber-100/50 dark:from-[#0f1c16] dark:via-[#13261d] dark:to-[#0c1611] border border-amber-200/90 dark:border-[#1e352a] shadow-sm p-6 flex flex-col items-center overflow-hidden transition-colors">
        {/* Decorative background sun / moon aura */}
        <div className="absolute top-4 w-52 h-52 rounded-full bg-amber-200/30 dark:bg-emerald-500/10 blur-2xl pointer-events-none" />

        {/* Plant Badge Header */}
        <div className="relative z-10 flex items-center justify-between w-full mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-stone-800 dark:text-emerald-50">
                {activeCactus.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80">
                {activeCactus.rarity}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 italic">
              {activeCactus.latinName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-[#1a2d23] hover:bg-amber-200/90 dark:hover:bg-[#223d2f] px-3 py-1.5 rounded-xl border border-amber-300/80 dark:border-[#2a4537] shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Share Card</span>
            </button>

            <button
              onClick={onNavigateToGarden}
              type="button"
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-[#1a2d23] hover:bg-emerald-50 dark:hover:bg-[#20372b] px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-[#2a4537] shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Garden</span>
            </button>
          </div>
        </div>

        {/* Animated Cactus with Selected Pot */}
        <div className="relative z-10 my-1 py-2">
          <CactusSvg
            cactusId={activeCactus.id}
            growthPercentage={todayRecord.cactusGrowthPercentage}
            potId={activePotId}
            size={270}
            isWatering={isWatering}
          />
        </div>

        {/* Growth Level Bar */}
        <div className="relative z-10 w-full mt-2">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-stone-700 dark:text-stone-300">
              {getGrowthStageText(todayRecord.cactusGrowthPercentage)}
            </span>
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md font-black border border-transparent dark:border-emerald-800/60">
              {todayRecord.cactusGrowthPercentage}% Grown
            </span>
          </div>

          <div className="w-full h-3.5 bg-stone-200/80 dark:bg-[#0d1410] rounded-full overflow-hidden p-0.5 border border-stone-300/60 dark:border-[#1e352a] shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${todayRecord.cactusGrowthPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center mt-1">
            {todayRecord.tapsCount} of 20 taps completed today • Each tap adds 5%
          </p>
        </div>
      </div>

      {/* 2D Animated Water Buddy Companion */}
      <WaterBuddy
        currentIntake={todayRecord.totalIntake}
        dailyGoal={profile.dailyGoal}
        unit={profile.unit}
        isWatering={isWatering}
      />

      {/* Hydration Intake Metric Card */}
      <div className="w-full rounded-2xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/60">
              <Droplet className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800 dark:text-emerald-50">Today's Hydration</h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {goalPercentage >= 100
                  ? 'Daily goal completed! Keep sipping.'
                  : `${displayRemaining} remaining to reach target`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-stone-800 dark:text-emerald-50">{displayIntake}</span>
            <span className="text-xs text-stone-400 dark:text-stone-500 block">/ {displayGoal}</span>
          </div>
        </div>

        {/* Goal Progress Bar */}
        <div className="w-full h-3 bg-cyan-100/60 dark:bg-[#0d1410] rounded-full overflow-hidden p-0.5 border border-cyan-200/60 dark:border-[#1e352a]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              goalPercentage >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${Math.min(100, goalPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-2">
          <span>{goalPercentage}% of target</span>
          {todayRecord.goalAchieved && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Award className="w-3.5 h-3.5" />
              Goal Achieved!
            </span>
          )}
        </div>
      </div>

      {/* Prominent Fill Up Button */}
      <WaterButton
        onFillUp={fillUp}
        servingSize={profile.servingSize}
        unit={profile.unit}
      />

      {/* Social Media Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          cactusId={activeCactus.id}
          growthPercentage={todayRecord.cactusGrowthPercentage}
          potId={activePotId}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
