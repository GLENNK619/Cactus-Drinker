import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { ToastAlert } from '../utils/notifications';

interface ToastBannerProps {
  toast: ToastAlert | null;
  onClose: () => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toast, onClose }) => {
  return (
    <div className="fixed top-4 inset-x-4 z-50 max-w-md mx-auto pointer-events-none">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -24, scale: 0.94, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 450,
                damping: 28,
                mass: 0.8,
              },
            }}
            exit={{
              opacity: 0,
              y: -18,
              scale: 0.95,
              filter: 'blur(2px)',
              transition: {
                duration: 0.22,
                ease: [0.32, 0.72, 0, 1],
              },
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y < -30) {
                onClose();
              }
            }}
            className="pointer-events-auto relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#131e18]/95 backdrop-blur-md border border-emerald-200/90 dark:border-emerald-800/80 shadow-2xl shadow-emerald-950/20 p-4 transition-colors"
          >
            {/* Ambient subtle emerald glow */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-xl pointer-events-none" />

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="text-xs font-black tracking-tight text-stone-900 dark:text-emerald-100">
                    {toast.title}
                  </h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {toast.body}
                </p>
              </div>

              <button
                onClick={onClose}
                type="button"
                aria-label="Dismiss notification"
                className="text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-emerald-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-[#1a2b22] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle animated lifespan bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ originX: 0 }}
              className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
