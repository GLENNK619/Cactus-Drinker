import React, { useState } from 'react';
import { Sparkles, Lock, Check, Palette, Award, Info, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CACTUS_VARIETIES } from '../data/cacti';
import { POT_DESIGNS } from '../data/pots';
import { CactusSvg } from './CactusSvg';
import { PotCustomizerModal } from './PotCustomizerModal';
import { ShareModal } from './ShareModal';

export const CactusGarden: React.FC = () => {
  const {
    profile,
    setActiveCactus,
    updateCactusPot,
  } = useApp();

  const [customizingCactusId, setCustomizingCactusId] = useState<string | null>(null);
  const [sharingCactusId, setSharingCactusId] = useState<string | null>(null);

  const unlockedCount = profile.unlockedCacti.length;
  const totalCount = CACTUS_VARIETIES.length;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-4 space-y-6">
      {/* Garden Greenhouse Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 dark:from-[#091711] dark:via-[#0f261c] dark:to-[#0a1811] text-white p-6 shadow-md relative overflow-hidden border border-transparent dark:border-[#1e352a] transition-colors">
        {/* Decorative foliage accent */}
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10 flex items-center justify-center pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/80 dark:bg-emerald-950/80 border border-emerald-400/40 dark:border-emerald-700/60">
              <Award className="w-5 h-5 text-emerald-200" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Personal Botanical Greenhouse
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight mb-2">Cactus Garden</h1>
          <p className="text-xs text-emerald-100 dark:text-emerald-200/80 max-w-lg mb-4">
            Every 10 consecutive successful hydration days unlocks a new desert species. Customize
            distinct pots for every cactus in your sanctuary!
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-200 mb-1.5">
              <span>Collection Progress</span>
              <span>
                {unlockedCount} of {totalCount} Species Collected
              </span>
            </div>
            <div className="h-2.5 w-full bg-emerald-950/40 dark:bg-[#07110c] rounded-full overflow-hidden p-0.5 border border-emerald-500/30 dark:border-[#1e352a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cacti Collection Shelves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CACTUS_VARIETIES.map((cactus) => {
          const isUnlocked = profile.unlockedCacti.includes(cactus.id);
          const isActive = profile.activeCactusId === cactus.id;
          const assignedPotId = profile.customPots[cactus.id] || 'terracotta';
          const equippedPot = POT_DESIGNS.find((p) => p.id === assignedPotId) || POT_DESIGNS[0];
          const daysNeeded = Math.max(0, cactus.requiredStreak - profile.currentStreak);

          return (
            <div
              key={cactus.id}
              className={`relative rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-50/90 dark:bg-[#13231a] border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : isUnlocked
                  ? 'bg-white dark:bg-[#131e18] border-stone-200/90 dark:border-[#1e352a] hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs'
                  : 'bg-stone-50/80 dark:bg-[#0d1410] border-stone-200/60 dark:border-[#18261e] opacity-80'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Active Plant
                </div>
              )}

              {/* Card Main Body */}
              <div className="p-5 flex flex-col items-center text-center">
                {/* Visual Plant preview */}
                <div className="relative py-2 my-1 flex items-center justify-center">
                  {!isUnlocked ? (
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="filter grayscale brightness-50 contrast-125 opacity-40">
                        <CactusSvg
                          cactusId={cactus.id}
                          growthPercentage={100}
                          potId="terracotta"
                          size={150}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-stone-800/80 dark:bg-[#07110c]/90 text-white flex items-center justify-center shadow-md mb-2 border border-transparent dark:border-[#1e352a]">
                          <Lock className="w-6 h-6 text-stone-200" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-stone-900/80 dark:bg-[#07110c]/95 text-stone-200 text-xs font-bold backdrop-blur-xs border border-transparent dark:border-[#1e352a]">
                          {cactus.requiredStreak}-Day Streak Required
                        </span>
                      </div>
                    </div>
                  ) : (
                    <CactusSvg
                      cactusId={cactus.id}
                      growthPercentage={100}
                      potId={assignedPotId}
                      size={150}
                    />
                  )}
                </div>

                {/* Name & Lore */}
                <div className="mt-1 w-full">
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <h3 className="text-base font-black text-stone-800 dark:text-emerald-50">
                      {cactus.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-stone-100 dark:bg-[#0d1410] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-[#223d30]">
                      {cactus.rarity}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 italic mb-2">
                    {cactus.latinName}
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 px-2">
                    {cactus.description}
                  </p>
                </div>

                {/* Equipped Pot Swatch Badge (if unlocked) */}
                {isUnlocked && (
                  <div className="w-full mt-3 pt-3 border-t border-stone-100 dark:border-[#1e352a] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border shadow-xs"
                        style={{ backgroundColor: equippedPot.bodyColor, borderColor: equippedPot.rimColor }}
                      />
                      <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                        Pot: <strong className="text-stone-800 dark:text-emerald-100">{equippedPot.name}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setCustomizingCactusId(cactus.id)}
                      type="button"
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Change Pot</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-stone-50/70 dark:bg-[#0f1713] border-t border-stone-100 dark:border-[#1e352a] flex items-center gap-2">
                {isUnlocked ? (
                  <>
                    <button
                      onClick={() => setSharingCactusId(cactus.id)}
                      type="button"
                      title="Share Summary Card"
                      className="p-2 rounded-xl border border-stone-200 dark:border-[#223d30] hover:border-amber-400 dark:hover:border-amber-500 bg-amber-50/80 dark:bg-[#1b2b23] hover:bg-amber-100 text-amber-800 dark:text-amber-300 transition-all cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setCustomizingCactusId(cactus.id)}
                      type="button"
                      className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-[#223d30] hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-[#131e18] hover:bg-emerald-50/50 dark:hover:bg-[#1b2b23] text-stone-700 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Customize</span>
                    </button>

                    {!isActive && (
                      <button
                        onClick={() => setActiveCactus(cactus.id)}
                        type="button"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Set Active
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between px-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Need {daysNeeded} more consecutive {daysNeeded === 1 ? 'day' : 'days'}
                    </span>
                    <span className="font-bold text-stone-700 dark:text-stone-200">
                      {profile.currentStreak}/{cactus.requiredStreak}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pot Customizer Modal */}
      {customizingCactusId && (
        <PotCustomizerModal
          cactusId={customizingCactusId}
          currentPotId={profile.customPots[customizingCactusId] || 'terracotta'}
          onSave={async (cId, pId) => {
            await updateCactusPot(cId, pId);
            setCustomizingCactusId(null);
          }}
          onClose={() => setCustomizingCactusId(null)}
        />
      )}

      {/* Share Species Card Modal */}
      {sharingCactusId && (
        <ShareModal
          cactusId={sharingCactusId}
          growthPercentage={100}
          potId={profile.customPots[sharingCactusId] || 'terracotta'}
          customTitle={`${
            CACTUS_VARIETIES.find((c) => c.id === sharingCactusId)?.name || 'Cactus'
          } in Greenhouse!`}
          customSubtitle={
            CACTUS_VARIETIES.find((c) => c.id === sharingCactusId)?.latinName
          }
          onClose={() => setSharingCactusId(null)}
        />
      )}
    </div>
  );
};
