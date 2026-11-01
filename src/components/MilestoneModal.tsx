import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, CheckCircle, ArrowRight, Share2 } from 'lucide-react';
import { CactusVariety } from '../types';
import { CactusSvg } from './CactusSvg';
import { soundEffects } from '../utils/audio';
import { ShareModal } from './ShareModal';

export type MilestoneType = 'cactus_unlocked' | 'cactus_grown' | 'goal_achieved';

interface MilestoneModalProps {
  type: MilestoneType;
  cactus?: CactusVariety;
  streakCount?: number;
  potId?: string;
  onClose: () => void;
  onSetActive?: (cactusId: string) => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  type,
  cactus,
  streakCount = 0,
  potId = 'terracotta',
  onClose,
  onSetActive,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    soundEffects.playCelebration();
    // Confetti burst
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#131e18] border border-amber-200/80 dark:border-[#1e352a] rounded-3xl shadow-2xl p-6 text-center overflow-hidden flex flex-col items-center transition-colors">
        {/* Glow backdrop */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-100/70 dark:from-emerald-950/40 to-transparent pointer-events-none" />

        {/* Milestone badge */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-4 animate-bounce">
          {type === 'cactus_unlocked' ? (
            <Trophy className="w-8 h-8" />
          ) : type === 'goal_achieved' ? (
            <CheckCircle className="w-8 h-8" />
          ) : (
            <Sparkles className="w-8 h-8" />
          )}
        </div>

        {/* Titles */}
        {type === 'cactus_unlocked' && cactus ? (
          <>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
              🎉 New Cactus Variety Unlocked!
            </span>
            <h2 className="text-2xl font-black text-stone-800 dark:text-emerald-50">{cactus.name}</h2>
            <p className="text-xs italic text-stone-500 dark:text-stone-400 mb-3">{cactus.latinName}</p>

            {/* Visual showcase */}
            <div className="my-2 p-2 bg-gradient-to-b from-emerald-50 to-amber-50/40 dark:from-[#0f1c16] dark:via-[#13261d] dark:to-[#0c1611] rounded-2xl border border-emerald-100 dark:border-[#1e352a]">
              <CactusSvg
                cactusId={cactus.id}
                growthPercentage={100}
                potId={potId}
                size={180}
              />
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 mb-2 px-4">{cactus.description}</p>
            <div className="p-3 bg-amber-50 dark:bg-[#0d1410] rounded-xl border border-amber-200/60 dark:border-[#1e352a] text-xs text-amber-900 dark:text-amber-300 mb-5 text-left">
              💡 <span className="font-semibold">Botanical Lore:</span> {cactus.funFact}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Discovery Card</span>
              </button>

              <div className="flex gap-2 w-full">
                {onSetActive && (
                  <button
                    type="button"
                    onClick={() => {
                      onSetActive(cactus.id);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                  >
                    Make Active Plant
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-[#0d1410] hover:bg-stone-200 dark:hover:bg-[#1a2b22] text-stone-700 dark:text-stone-300 font-bold text-sm border border-transparent dark:border-[#1e352a] transition-colors cursor-pointer"
                >
                  Keep in Garden
                </button>
              </div>
            </div>
          </>
        ) : type === 'goal_achieved' ? (
          <>
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400 mb-1">
              Daily Goal Crushed! 💧
            </span>
            <h2 className="text-2xl font-black text-stone-800 dark:text-emerald-50">Target Achieved!</h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 mb-4">
              You gave your body the hydration it needed today! Your consecutive streak is now{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">{streakCount} Days</strong>.
            </p>

            <div className="w-full p-4 bg-emerald-50 dark:bg-[#0d1410] border border-emerald-200 dark:border-[#1e352a] rounded-2xl mb-5 flex items-center justify-around">
              <div>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-400">{streakCount}</span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Current Streak</span>
              </div>
              <div className="h-8 w-px bg-emerald-200 dark:bg-[#1e352a]" />
              <div>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-400">+1</span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Day Added</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Streak Achievement</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Keep Growing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400 mb-1">
              Full Bloom Unlocked! 🌸
            </span>
            <h2 className="text-2xl font-black text-stone-800 dark:text-emerald-50">100% Grown Today!</h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 mb-4">
              20 Fill Up taps recorded today. Your cactus has reached its supreme blooming stage!
            </p>

            {cactus && (
              <div className="my-2 p-2 bg-gradient-to-b from-pink-50 to-amber-50/40 dark:from-[#0f1c16] dark:via-[#13261d] dark:to-[#0c1611] rounded-2xl border border-pink-100 dark:border-[#1e352a]">
                <CactusSvg
                  cactusId={cactus.id}
                  growthPercentage={100}
                  potId={potId}
                  size={180}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Bloom Card</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-[#0d1410] hover:bg-stone-200 dark:hover:bg-[#1a2b22] text-stone-700 dark:text-stone-300 font-bold text-sm border border-transparent dark:border-[#1e352a] transition-colors cursor-pointer"
              >
                Celebrate Blossom
              </button>
            </div>
          </>
        )}
      </div>

      {/* Embedded Share Card Modal */}
      {isShareModalOpen && (
        <ShareModal
          cactusId={cactus?.id || 'saguaro_sprout'}
          growthPercentage={100}
          potId={potId}
          customTitle={
            type === 'cactus_unlocked'
              ? `Unlocked ${cactus?.name || 'New Cactus'}!`
              : type === 'goal_achieved'
              ? `${streakCount}-Day Streak Crushed!`
              : '100% Fully Blooming Cactus!'
          }
          customSubtitle={
            type === 'cactus_unlocked'
              ? cactus?.latinName
              : type === 'goal_achieved'
              ? 'Daily hydration target smashed'
              : 'Supercharged with daily sips'
          }
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
