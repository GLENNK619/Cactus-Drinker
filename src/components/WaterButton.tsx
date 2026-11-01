import React, { useState } from 'react';
import { Droplets, Plus } from 'lucide-react';
import { useWaterDropSound } from '../hooks/useWaterDropSound';

interface WaterButtonProps {
  onFillUp: (amount: number) => void;
  servingSize: number;
  unit: 'ml' | 'oz';
  disabled?: boolean;
}

export const WaterButton: React.FC<WaterButtonProps> = ({
  onFillUp,
  servingSize,
  unit,
  disabled = false,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const [showQuickPicks, setShowQuickPicks] = useState(false);
  const { playWaterDrop, unlockAudio } = useWaterDropSound({ volume: 0.35 });

  const handleMainTap = () => {
    if (disabled) return;
    setIsPressing(true);
    setRippleKey((prev) => prev + 1);
    playWaterDrop({ volume: 0.36, variant: 'classic' });
    onFillUp(servingSize);
    setTimeout(() => setIsPressing(false), 200);
  };

  const handleQuickAdd = (amount: number) => {
    if (disabled) return;
    playWaterDrop({
      volume: 0.32,
      variant: amount >= 500 ? 'ripple' : amount <= 150 ? 'crisp' : 'classic',
    });
    onFillUp(amount);
  };

  const displayServing = unit === 'oz' ? `${(servingSize * 0.033814).toFixed(1)} oz` : `${servingSize} ml`;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      {/* Big Tactile Fill Up Button */}
      <div className="relative group flex items-center justify-center">
        {/* Animated Ripple Waves on click */}
        {rippleKey > 0 && (
          <div
            key={rippleKey}
            className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping pointer-events-none"
            style={{ animationDuration: '0.8s' }}
          />
        )}

        <button
          onClick={handleMainTap}
          onPointerDown={() => soundEffects.unlock()}
          disabled={disabled}
          type="button"
          aria-label="Fill up water and grow cactus by 5%"
          className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-200 select-none cursor-pointer shadow-xl ${
            isPressing
              ? 'scale-95 translate-y-1 shadow-md bg-gradient-to-b from-cyan-600 to-emerald-600'
              : 'hover:scale-105 active:scale-95 bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-700/25'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {/* Subtle glossy top glass highlight */}
          <div className="absolute top-2 w-32 h-16 rounded-t-full bg-white/20 blur-[1px] pointer-events-none" />

          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-1">
            <Droplets className="w-8 h-8 text-white fill-white/80 animate-pulse" />
          </div>

          <span className="text-xl font-bold tracking-tight drop-shadow">Fill Up</span>
          <span className="text-xs font-semibold text-cyan-100 flex items-center gap-1">
            +{displayServing} • +5% 🌱
          </span>
        </button>
      </div>

      {/* Quick Volume Adjusters */}
      <div className="flex items-center justify-between w-full px-2 pt-1 text-xs">
        <button
          type="button"
          onClick={() => setShowQuickPicks(!showQuickPicks)}
          className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-emerald-300 font-medium transition-colors flex items-center gap-1 mx-auto py-1 px-3 rounded-full hover:bg-stone-200/60 dark:hover:bg-[#182820]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showQuickPicks ? 'Hide serving shortcuts' : 'Different serving size?'}</span>
        </button>
      </div>

      {showQuickPicks && (
        <div className="flex items-center gap-2 p-1.5 bg-stone-100/90 dark:bg-[#131e18] rounded-2xl border border-stone-200/80 dark:border-[#1e352a] shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            type="button"
            onClick={() => handleQuickAdd(150)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0d1410] hover:bg-emerald-50 dark:hover:bg-[#1b2b23] text-stone-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-semibold shadow-xs border border-stone-200/60 dark:border-[#223d30] transition-colors"
          >
            Sip (150 ml)
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(350)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0d1410] hover:bg-emerald-50 dark:hover:bg-[#1b2b23] text-stone-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-semibold shadow-xs border border-stone-200/60 dark:border-[#223d30] transition-colors"
          >
            Mug (350 ml)
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(500)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0d1410] hover:bg-emerald-50 dark:hover:bg-[#1b2b23] text-stone-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-semibold shadow-xs border border-stone-200/60 dark:border-[#223d30] transition-colors"
          >
            Bottle (500 ml)
          </button>
        </div>
      )}
    </div>
  );
};
