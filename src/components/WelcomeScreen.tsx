import React from 'react';
import { Droplet, Sparkles, Flame, Trophy, Palette, ArrowRight } from 'lucide-react';
import { CactusSvg } from './CactusSvg';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenAuth: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50/50 to-amber-100/60 dark:from-[#091711] dark:via-[#0d1e16] dark:to-[#07130e] flex flex-col items-center justify-between px-4 py-8 transition-colors">
      {/* Top Brand */}
      <div className="flex items-center gap-2 pt-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
          <Droplet className="w-6 h-6 fill-white" />
        </div>
        <span className="text-xl font-black text-stone-800 dark:text-emerald-50 tracking-tight">CactusDrop</span>
      </div>

      {/* Hero Showcase */}
      <div className="max-w-md w-full flex flex-col items-center text-center my-6">
        <div className="relative mb-2">
          {/* Soft background halo */}
          <div className="absolute inset-0 rounded-full bg-amber-200/40 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
          <CactusSvg
            cactusId="saguaro_sprout"
            growthPercentage={100}
            potId="terracotta"
            size={240}
          />
        </div>

        <div className="space-y-2 mt-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
            Gamified Hydration & Habit Building
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-emerald-50 tracking-tight">
            Drink Water. <br />
            <span className="text-emerald-600 dark:text-emerald-400">Grow Your Cactus.</span>
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
            Each drink of water grows your cactus by +5%. Build 10-day consecutive streaks to unlock
            rare desert species and customize artisan pots!
          </p>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-6 text-left">
          <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#131e18] border border-stone-200/70 dark:border-[#1e352a] shadow-xs flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 shrink-0 border border-transparent dark:border-cyan-900/60">
              <Droplet className="w-4 h-4 fill-cyan-400" />
            </span>
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-emerald-100 block">+5% per Sip</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">20 taps = full bloom</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#131e18] border border-stone-200/70 dark:border-[#1e352a] shadow-xs flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 shrink-0 border border-transparent dark:border-amber-900/60">
              <Flame className="w-4 h-4 fill-amber-400" />
            </span>
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-emerald-100 block">Streak Tracking</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Local midnight reset</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#131e18] border border-stone-200/70 dark:border-[#1e352a] shadow-xs flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0 border border-transparent dark:border-emerald-900/60">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-emerald-100 block">Unlock Varieties</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Every 10 days</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#131e18] border border-stone-200/70 dark:border-[#1e352a] shadow-xs flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 shrink-0 border border-transparent dark:border-pink-900/60">
              <Palette className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-emerald-100 block">Artisan Pots</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Custom styling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md w-full space-y-3 pb-2">
        <button
          onClick={onStart}
          type="button"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-black text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Start Growing (Quick Start)</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenAuth}
          type="button"
          className="w-full py-3.5 rounded-2xl bg-white dark:bg-[#131e18] hover:bg-stone-50 dark:hover:bg-[#1a2b22] text-stone-800 dark:text-emerald-100 font-bold text-sm border border-stone-200/90 dark:border-[#1e352a] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Sign In / Create Account</span>
        </button>
      </div>
    </div>
  );
};
