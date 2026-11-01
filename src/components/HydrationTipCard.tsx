import React, { useState, useEffect } from 'react';
import { Lightbulb, X, RotateCw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getDailyTip, HydrationTip, HYDRATION_TIPS } from '../data/hydrationTips';
import { soundEffects } from '../utils/audio';

interface HydrationTipCardProps {
  todayDate: string;
}

export const HydrationTipCard: React.FC<HydrationTipCardProps> = ({ todayDate }) => {
  const storageKey = `cactusdrop_dismissed_tip_${todayDate}`;

  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  const [tipIndexOffset, setTipIndexOffset] = useState<number>(0);
  const currentTip: HydrationTip = getDailyTip(todayDate, tipIndexOffset);

  // If date changes, check dismissal status
  useEffect(() => {
    setIsDismissed(localStorage.getItem(storageKey) === 'true');
    setTipIndexOffset(0);
  }, [storageKey]);

  const handleDismiss = () => {
    soundEffects.playSoftClick();
    setIsDismissed(true);
    localStorage.setItem(storageKey, 'true');
  };

  const handleRestore = () => {
    soundEffects.playSoftClick();
    setIsDismissed(false);
    localStorage.removeItem(storageKey);
  };

  const handleNextTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playSoftClick();
    setTipIndexOffset((prev) => (prev + 1) % HYDRATION_TIPS.length);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isDismissed ? (
          <motion.div
            key="tip-card"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-50/90 via-emerald-50/70 to-teal-50/90 dark:from-[#112319] dark:via-[#13271d] dark:to-[#0f2117] border border-emerald-200/80 dark:border-[#223d2e] shadow-xs p-4 relative overflow-hidden transition-colors"
          >
            {/* Ambient decorative blur */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-xl pointer-events-none" />

            <div className="flex items-start gap-3 relative z-10">
              {/* Tip Icon */}
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Lightbulb className="w-5 h-5 fill-amber-400/40" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                    Tip of the Day • {currentTip.tag}
                  </span>
                  <span className="text-xs font-bold text-stone-800 dark:text-emerald-50">
                    {currentTip.title}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-emerald-100/90 leading-relaxed">
                  {currentTip.fact}
                </p>

                {/* Bottom interactive action bar */}
                <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-emerald-100/80 dark:border-[#1a3324] text-[11px]">
                  <button
                    type="button"
                    onClick={handleNextTip}
                    className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Next Fact</span>
                  </button>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span className="text-stone-400 dark:text-stone-500 text-[10px]">
                    Fresh daily insights
                  </span>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss hydration tip"
                className="absolute top-3 right-3 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-[#1a2d22] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dismissed-chip"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-end pt-0.5"
          >
            <button
              type="button"
              onClick={handleRestore}
              className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#102017] hover:bg-emerald-100 dark:hover:bg-[#152a1e] px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-[#1e3828] transition-all cursor-pointer shadow-2xs"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Show Hydration Tip</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
