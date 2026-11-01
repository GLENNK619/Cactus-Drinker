import React, { useState } from 'react';
import {
  Trophy,
  Sunrise,
  Flame,
  Droplet,
  Moon,
  Zap,
  Sparkles,
  Sprout,
  Award,
  Waves,
  Lock,
  Check,
  Info,
  X,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateBadges } from '../data/badges';
import { soundEffects } from '../utils/audio';
import { Badge } from '../types';
import { ShareModal } from './ShareModal';

export const BadgesSection: React.FC = () => {
  const { profile, todayRecord, historyRecords } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<(Badge & { isUnlocked: boolean; progressLabel: string; progressPercent: number }) | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const evaluatedBadges = evaluateBadges(profile, todayRecord, historyRecords);
  const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const totalCount = evaluatedBadges.length;

  const filteredBadges = evaluatedBadges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const renderBadgeIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sunrise':
        return <Sunrise className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Droplet':
        return <Droplet className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Sprout':
        return <Sprout className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Waves':
      default:
        return <Waves className={className} />;
    }
  };

  const handleBadgeClick = (badge: typeof evaluatedBadges[0]) => {
    soundEffects.playSoftClick();
    setSelectedBadge(badge);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-6 space-y-5 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-[#1e352a] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-stone-800 dark:text-emerald-50">
                Achievement Badges
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-800/80">
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Celebrate habits, streaks, timing, and lifetime hydration goals!
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#0d1410] p-1 rounded-xl border border-stone-200/80 dark:border-[#1e352a] self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-[#1b2b23] text-stone-900 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-white dark:bg-[#1b2b23] text-stone-900 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'locked'
                ? 'bg-white dark:bg-[#1b2b23] text-stone-900 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            In Progress ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 relative group ${
                badge.isUnlocked
                  ? 'bg-stone-50/80 dark:bg-[#0f1a14] border-stone-200/90 dark:border-[#1e352a] hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs'
                  : 'bg-stone-50/40 dark:bg-[#0a110d] border-stone-200/50 dark:border-[#16241c] opacity-75 hover:opacity-95'
              }`}
            >
              {/* Badge Icon Emblem */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md transition-transform group-hover:scale-105 ${
                  badge.isUnlocked
                    ? `bg-gradient-to-tr ${badge.gradient} shadow-emerald-950/20 ring-2 ring-white/20`
                    : 'bg-stone-300 dark:bg-[#1a2b22] text-stone-400 dark:text-stone-500'
                }`}
              >
                {badge.isUnlocked ? (
                  renderBadgeIcon(badge.iconName, 'w-6 h-6 drop-shadow')
                ) : (
                  <Lock className="w-5 h-5 text-stone-400 dark:text-stone-500" />
                )}
              </div>

              {/* Badge Info */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-black text-stone-800 dark:text-emerald-50 truncate">
                    {badge.name}
                  </h4>
                  {badge.isUnlocked ? (
                    <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500">
                      {badge.progressLabel}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mb-1.5">
                  {badge.description}
                </p>

                {/* Progress bar for locked badges */}
                {!badge.isUnlocked && (
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-[#16241c] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#131e18] border border-stone-200 dark:border-[#1e352a] rounded-3xl shadow-2xl p-6 text-center overflow-hidden flex flex-col items-center">
            <button
              onClick={() => setSelectedBadge(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emblem */}
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-4 shadow-xl ${
                selectedBadge.isUnlocked
                  ? `bg-gradient-to-tr ${selectedBadge.gradient} ring-4 ring-white/20 animate-bounce`
                  : 'bg-stone-300 dark:bg-[#182a20] text-stone-400'
              }`}
            >
              {selectedBadge.isUnlocked ? (
                renderBadgeIcon(selectedBadge.iconName, 'w-10 h-10')
              ) : (
                <Lock className="w-8 h-8 text-stone-400 dark:text-stone-500" />
              )}
            </div>

            <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
              {selectedBadge.isUnlocked ? '🌟 Milestone Achieved' : '🔒 Locked Milestone'}
            </span>
            <h3 className="text-xl font-black text-stone-900 dark:text-emerald-50 mb-1">
              {selectedBadge.name}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 mb-4 px-2">
              {selectedBadge.description}
            </p>

            <div className="w-full p-3 bg-stone-50 dark:bg-[#0d1410] rounded-2xl border border-stone-200/80 dark:border-[#1e352a] text-xs mb-5 text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Requirement:</span>
                <span className="font-bold text-stone-800 dark:text-emerald-200">
                  {selectedBadge.requirement}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Status:</span>
                <span
                  className={`font-bold ${
                    selectedBadge.isUnlocked
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {selectedBadge.isUnlocked ? 'Completed' : selectedBadge.progressLabel}
                </span>
              </div>
            </div>

            {selectedBadge.isUnlocked && (
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full mb-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Achievement Card</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-[#0d1410] hover:bg-stone-200 dark:hover:bg-[#1a2b22] text-stone-700 dark:text-stone-300 font-bold text-xs border border-transparent dark:border-[#1e352a] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Share Badge Card Modal */}
      {isShareModalOpen && selectedBadge && (
        <ShareModal
          cactusId={profile.activeCactusId}
          growthPercentage={todayRecord.cactusGrowthPercentage}
          potId={profile.customPots[profile.activeCactusId] || 'terracotta'}
          badgeName={selectedBadge.name}
          badgeDescription={selectedBadge.description}
          customTitle={`${selectedBadge.name} Badge!`}
          customSubtitle={selectedBadge.description}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
