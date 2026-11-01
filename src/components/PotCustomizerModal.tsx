import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { POT_DESIGNS } from '../data/pots';
import { CACTUS_VARIETIES } from '../data/cacti';
import { CactusSvg } from './CactusSvg';
import { soundEffects } from '../utils/audio';

interface PotCustomizerModalProps {
  cactusId: string;
  currentPotId: string;
  onSave: (cactusId: string, potId: string) => void;
  onClose: () => void;
}

export const PotCustomizerModal: React.FC<PotCustomizerModalProps> = ({
  cactusId,
  currentPotId,
  onSave,
  onClose,
}) => {
  const [selectedPotId, setSelectedPotId] = useState<string>(currentPotId);
  const cactus = CACTUS_VARIETIES.find((c) => c.id === cactusId) || CACTUS_VARIETIES[0];

  const handleSelect = (potId: string) => {
    setSelectedPotId(potId);
    soundEffects.playSoftClick();
  };

  const handleApply = () => {
    soundEffects.playCelebration();
    onSave(cactusId, selectedPotId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-amber-50/95 dark:bg-[#131e18] border border-amber-200/80 dark:border-[#1e352a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200/60 dark:border-[#1e352a] bg-amber-100/60 dark:bg-[#0d1410]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-stone-800 dark:text-emerald-50">Customize Pot</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">Style the pot for {cactus.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-emerald-200 hover:bg-stone-200/50 dark:hover:bg-[#1a2b22] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Cactus & Pot Preview Stage */}
          <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-b from-emerald-100/40 via-amber-100/30 to-amber-50 dark:from-[#0f1c16] dark:via-[#13261d] dark:to-[#0c1611] rounded-2xl border border-amber-200/60 dark:border-[#1e352a] shadow-inner transition-colors">
            <CactusSvg
              cactusId={cactusId}
              growthPercentage={100}
              potId={selectedPotId}
              size={180}
            />
            <span className="text-xs font-semibold text-stone-600 dark:text-emerald-300 mt-1">
              Live Preview: {POT_DESIGNS.find((p) => p.id === selectedPotId)?.name}
            </span>
          </div>

          {/* Pot Choices Grid */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
              Select Artisan Pot Design
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POT_DESIGNS.map((pot) => {
                const isSelected = pot.id === selectedPotId;
                return (
                  <button
                    key={pot.id}
                    onClick={() => handleSelect(pot.id)}
                    type="button"
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-[#13231a] shadow-md ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-[#1e352a] bg-white dark:bg-[#0d1410] hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-stone-50 dark:hover:bg-[#16241e] shadow-xs'
                    }`}
                  >
                    {/* Visual Color Swatch */}
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-xs"
                      style={{
                        backgroundColor: pot.bodyColor,
                        borderColor: pot.rimColor,
                      }}
                    >
                      {isSelected ? (
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      ) : (
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: pot.rimColor }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-800 dark:text-emerald-50 truncate">
                          {pot.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md border border-transparent dark:border-emerald-800">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">{pot.style}</p>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-1 mt-0.5">
                        {pot.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-amber-200/60 dark:border-[#1e352a] bg-amber-100/40 dark:bg-[#0d1410]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-emerald-200 hover:bg-stone-200/60 dark:hover:bg-[#182820] text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Save Pot Design
          </button>
        </div>
      </div>
    </div>
  );
};
