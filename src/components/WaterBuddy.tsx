import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, HelpCircle, Heart, Zap, RefreshCw, Volume2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export type BuddyMood = 'completed' | 'ahead' | 'on_track' | 'behind' | 'critical_behind' | 'morning_start';

interface WaterBuddyProps {
  currentIntake: number; // in ml
  dailyGoal: number; // in ml
  unit: 'ml' | 'oz';
  isWatering?: boolean;
}

interface MoodData {
  mood: BuddyMood;
  title: string;
  badge: string;
  badgeColor: string;
  badgeTextColor: string;
  badgeBorder: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  quotes: string[];
}

export const WaterBuddy: React.FC<WaterBuddyProps> = ({
  currentIntake,
  dailyGoal,
  unit,
  isWatering = false,
}) => {
  const [isPoked, setIsPoked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showPacingExplainer, setShowPacingExplainer] = useState(false);
  const [previewMood, setPreviewMood] = useState<BuddyMood | null>(null);
  const [floatingParticles, setFloatingParticles] = useState<
    { id: number; x: number; y: number; char: string }[]
  >([]);

  // Calculate pacing based on current time of day
  const pacingStats = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    // Normal active daylight hours: 8:00 AM (8.0) to 10:00 PM (22.0) = 14 hours
    const wakeHour = 8;
    const sleepHour = 22;
    const activeSpan = sleepHour - wakeHour; // 14 hours

    let elapsedActiveHours = 0;
    if (currentHour < wakeHour) {
      elapsedActiveHours = 0.2; // early morning just beginning
    } else if (currentHour >= sleepHour) {
      elapsedActiveHours = activeSpan;
    } else {
      elapsedActiveHours = currentHour - wakeHour;
    }

    const expectedFraction = Math.min(1, Math.max(0.05, elapsedActiveHours / activeSpan));
    const expectedIntake = Math.round(expectedFraction * dailyGoal);

    const actualPct = Math.min(100, (currentIntake / dailyGoal) * 100);
    const expectedPct = Math.min(100, Math.round(expectedFraction * 100));
    const diffMl = currentIntake - expectedIntake;
    const diffPct = actualPct - expectedPct;

    return {
      currentHour,
      expectedIntake,
      expectedPct,
      actualPct,
      diffMl,
      diffPct,
      isEarlyMorning: currentHour < 9.5 && currentIntake < dailyGoal * 0.25,
    };
  }, [currentIntake, dailyGoal]);

  // Determine actual natural mood based on pacing
  const calculatedMood: BuddyMood = useMemo(() => {
    if (currentIntake >= dailyGoal) {
      return 'completed';
    }
    if (pacingStats.isEarlyMorning) {
      return 'morning_start';
    }
    // Ahead by more than 12%
    if (pacingStats.diffPct >= 12) {
      return 'ahead';
    }
    // Within ±12%
    if (pacingStats.diffPct >= -12) {
      return 'on_track';
    }
    // Moderately behind (-12% to -35%)
    if (pacingStats.diffPct >= -35) {
      return 'behind';
    }
    // Severely behind
    return 'critical_behind';
  }, [currentIntake, dailyGoal, pacingStats]);

  const activeMood: BuddyMood = previewMood || calculatedMood;

  // React to watering animation
  useEffect(() => {
    if (isWatering) {
      setIsPoked(true);
      soundEffects.playBuddyChirp();
      const timer = setTimeout(() => setIsPoked(false), 900);
      return () => clearTimeout(timer);
    }
  }, [isWatering]);

  // Mood configuration dictionary
  const moodData: Record<BuddyMood, MoodData> = {
    completed: {
      mood: 'completed',
      title: 'Goal Champion!',
      badge: 'Goal Crushed! 🏆',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80',
      badgeTextColor: 'text-emerald-800 dark:text-emerald-300',
      badgeBorder: 'border-emerald-300 dark:border-emerald-800',
      bgColor: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/40 dark:to-teal-950/30',
      borderColor: 'border-emerald-200/80 dark:border-[#1e352a]',
      glowColor: '#10b981',
      quotes: [
        'Incredible! Daily target reached! We are fully replenished! 🌟🌺',
        'Your cactus is glowing and so are you! Pure hydration mastery!',
        'Ahhh, so crisp! You crushed your hydration goal today!',
        'Dewey is in party mode! Keep sipping whenever you fancy!',
      ],
    },
    ahead: {
      mood: 'ahead',
      title: 'Radiant & Energized!',
      badge: 'Ahead of Pace ⚡',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950/80',
      badgeTextColor: 'text-cyan-800 dark:text-cyan-300',
      badgeBorder: 'border-cyan-300 dark:border-cyan-800',
      bgColor: 'from-cyan-500/10 via-sky-500/10 to-blue-500/10 dark:from-cyan-950/40 dark:to-sky-950/30',
      borderColor: 'border-cyan-200/80 dark:border-[#1e352a]',
      glowColor: '#06b6d4',
      quotes: [
        "You're zooming ahead of schedule! Hydration pro in action! 💧🚀",
        'Cactus says: "Thank you for keeping my soil so fresh and healthy!"',
        'Feeling buoyant! That proactive water intake feels fantastic!',
        'You are crushing the hourly pace! Keep this wonderful flow!',
      ],
    },
    on_track: {
      mood: 'on_track',
      title: 'Smooth & Steady',
      badge: 'On Track 🌿',
      badgeColor: 'bg-teal-100 dark:bg-teal-950/80',
      badgeTextColor: 'text-teal-800 dark:text-teal-300',
      badgeBorder: 'border-teal-300 dark:border-teal-800',
      bgColor: 'from-teal-500/10 via-emerald-500/5 to-cyan-500/10 dark:from-teal-950/40 dark:to-emerald-950/30',
      borderColor: 'border-teal-200/80 dark:border-[#1e352a]',
      glowColor: '#14b8a6',
      quotes: [
        'Right on target! Steady, consistent sips keep you thriving all day.',
        'Perfect pace! Smooth waters run deep. Your cactus is loving this!',
        'One glass at a time! Maintaining this rhythm makes reaching 100% easy.',
        'Did you know? Regular small sips enhance focus and natural energy!',
      ],
    },
    behind: {
      mood: 'behind',
      title: 'A Little Thirsty...',
      badge: 'Falling Behind ⏳',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80',
      badgeTextColor: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-300 dark:border-amber-800',
      bgColor: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-950/40 dark:to-orange-950/30',
      borderColor: 'border-amber-200/80 dark:border-[#1e352a]',
      glowColor: '#f59e0b',
      quotes: [
        'A bit behind our pace! How about a refreshing cool glass right now? 🥤',
        "Your cactus is glancing at the watering can... let's take a sip together!",
        'A quick refill will boost us right back into the green zone!',
        "Don't wait until you feel parched! A friendly sip goes a long way.",
      ],
    },
    critical_behind: {
      mood: 'critical_behind',
      title: 'Parched & Waiting!',
      badge: 'Needs Water! 🏜️',
      badgeColor: 'bg-rose-100 dark:bg-rose-950/80',
      badgeTextColor: 'text-rose-800 dark:text-rose-300',
      badgeBorder: 'border-rose-300 dark:border-rose-800',
      bgColor: 'from-rose-500/10 via-orange-500/10 to-amber-500/10 dark:from-rose-950/40 dark:to-rose-950/30',
      borderColor: 'border-rose-200/80 dark:border-[#1e352a]',
      glowColor: '#f43f5e',
      quotes: [
        'Water rescue needed! Dewey and your cactus are feeling quite dry! 🥺💦',
        "It's not too late to catch up! Drink a full glass now to revive us!",
        'Emergency hydration break! Your brain and body need fresh liquid love.',
        'Tap the Fill Up button and watch both Dewey and your plant perk right up!',
      ],
    },
    morning_start: {
      mood: 'morning_start',
      title: 'Good Morning!',
      badge: 'Morning Start ☀️',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80',
      badgeTextColor: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-300 dark:border-amber-800',
      bgColor: 'from-amber-500/10 via-yellow-500/10 to-orange-500/10 dark:from-amber-950/40 dark:to-yellow-950/30',
      borderColor: 'border-amber-200/80 dark:border-[#1e352a]',
      glowColor: '#fbbf24',
      quotes: [
        'Rise and shine! Kickstart your metabolism with an early morning glass! ☀️',
        'A glass of water first thing revives your cells after hours of rest.',
        'Morning sun is up! Start today’s cactus growth with your first drink!',
        'Dewey is stretching! Grab a glass and let’s begin a healthy day together.',
      ],
    },
  };

  const currentInfo = moodData[activeMood];
  const activeQuote = currentInfo.quotes[quoteIndex % currentInfo.quotes.length];

  // Mascot Poke Interaction
  const handleMascotPoke = () => {
    setIsPoked(true);
    setClickCount((prev) => prev + 1);
    setQuoteIndex((prev) => prev + 1);

    if (activeMood === 'completed' || activeMood === 'ahead') {
      soundEffects.playBuddyChirp();
    } else {
      soundEffects.playBuddySqueak();
    }

    // Spawn cute floating particle
    const symbols = ['💧', '✨', '💙', '⭐', '🌱'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const newParticle = {
      id: Date.now() + Math.random(),
      x: Math.floor(Math.random() * 40) - 20,
      y: Math.floor(Math.random() * 20) - 10,
      char: randomSymbol,
    };
    setFloatingParticles((prev) => [...prev.slice(-4), newParticle]);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1200);

    setTimeout(() => {
      setIsPoked(false);
    }, 450);
  };

  // Convert volume for display
  const formatVolume = (ml: number) => {
    if (unit === 'oz') {
      return `${(ml * 0.033814).toFixed(0)} oz`;
    }
    return `${ml} ml`;
  };

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-br ${currentInfo.bgColor} border ${currentInfo.borderColor} shadow-xs p-4 sm:p-5 transition-all duration-300 relative overflow-hidden`}
    >
      {/* Background ambient water glow */}
      <div
        className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: currentInfo.glowColor }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
        {/* Mascot Character Stage */}
        <div className="relative shrink-0 flex flex-col items-center">
          {/* Mascot Click Ripple / Particle Spawns */}
          <div className="relative">
            {floatingParticles.map((particle) => (
              <span
                key={particle.id}
                className="absolute pointer-events-none text-sm animate-bounce z-30 transition-all duration-1000"
                style={{
                  top: `${particle.y}px`,
                  left: `calc(50% + ${particle.x}px)`,
                  opacity: 0.9,
                  transform: 'translateY(-24px)',
                }}
              >
                {particle.char}
              </span>
            ))}

            {/* Clickable Animated 2D Water Buddy (Dewey) */}
            <button
              type="button"
              onClick={handleMascotPoke}
              title="Click Dewey to interact!"
              className={`relative cursor-pointer select-none group focus:outline-none transition-transform duration-300 ${
                isPoked ? 'scale-115 -translate-y-2' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {/* Soft ground ripple shadow */}
              <div
                className={`w-20 h-3.5 mx-auto bg-stone-900/15 dark:bg-black/30 rounded-full blur-xs transition-transform duration-700 ${
                  isPoked ? 'scale-75 opacity-40' : 'scale-100 opacity-70 animate-pulse'
                }`}
              />

              {/* The 2D SVG Character */}
              <div className="relative -mt-2">
                <DeweySvg mood={activeMood} isPoked={isPoked} clickCount={clickCount} />
              </div>

              {/* Little sound tooltip icon */}
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white/90 dark:bg-[#1a2d23] text-stone-600 dark:text-stone-300 shadow-xs border border-stone-200 dark:border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <Volume2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </div>
            </button>
          </div>

          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
            <span>Dewey</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-extrabold">
              Buddy
            </span>
          </span>
        </div>

        {/* Mascot Speech Bubble & Hydration Guidance */}
        <div className="flex-1 w-full min-w-0">
          {/* Header Row: Mood badge, Title, and Pacing Explainer Button */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs transition-colors ${currentInfo.badgeColor} ${currentInfo.badgeTextColor} ${currentInfo.badgeBorder}`}
              >
                {currentInfo.badge}
              </span>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 hidden xs:inline">
                {currentInfo.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPacingExplainer(!showPacingExplainer)}
                className="text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 p-1 rounded-md transition-colors"
                title="How pacing works"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setQuoteIndex((prev) => prev + 1)}
                className="text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 p-1 rounded-md transition-colors"
                title="Next message"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Speech Bubble Card */}
          <div
            onClick={handleMascotPoke}
            className="cursor-pointer group relative bg-white/90 dark:bg-[#13221b] border border-stone-200/90 dark:border-[#223d2f] rounded-2xl p-3 shadow-2xs hover:border-cyan-400/60 dark:hover:border-cyan-600/60 transition-all"
          >
            {/* Small speech arrow on desktop pointing to mascot */}
            <div className="hidden sm:block absolute -left-2 top-4 w-3 h-3 bg-white/90 dark:bg-[#13221b] border-l border-b border-stone-200/90 dark:border-[#223d2f] rotate-45 transform" />

            <p className="text-xs text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
              "{activeQuote}"
            </p>

            {/* Micro Pacing Indicator */}
            <div className="mt-2 pt-2 border-t border-stone-100 dark:border-[#1c3227] flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping inline-block" />
                <span>
                  Expected now: <strong className="text-stone-700 dark:text-stone-300">{formatVolume(pacingStats.expectedIntake)}</strong>
                </span>
              </div>

              <div>
                {pacingStats.diffMl >= 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    +{formatVolume(pacingStats.diffMl)} ahead
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {formatVolume(Math.abs(pacingStats.diffMl))} behind pace
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive expression simulator preview bar */}
          <div className="mt-2.5 flex items-center justify-between text-[10px]">
            <span className="text-stone-400 dark:text-stone-500 font-semibold">
              Preview Dewey's expressions:
            </span>

            <div className="flex items-center gap-1 flex-wrap justify-end">
              {(
                [
                  { id: 'completed', label: '🏆 Champion' },
                  { id: 'ahead', label: '⚡ Ahead' },
                  { id: 'on_track', label: '🌿 On Track' },
                  { id: 'behind', label: '⏳ Behind' },
                  { id: 'critical_behind', label: '🏜️ Parched' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() =>
                    setPreviewMood((prev) => (prev === mode.id ? null : mode.id))
                  }
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                    activeMood === mode.id
                      ? 'bg-cyan-500 text-white shadow-2xs'
                      : 'bg-white/60 dark:bg-[#1a2d23] text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-[#243e30]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}

              {previewMood && (
                <button
                  type="button"
                  onClick={() => setPreviewMood(null)}
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline"
                  title="Reset to live pacing"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pacing Explainer Accordion Modal / Card */}
      {showPacingExplainer && (
        <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-[#1e352a] text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-white/60 dark:bg-[#0e1913]/70 p-3 rounded-xl transition-all">
          <div className="flex items-center justify-between mb-1.5 font-bold text-stone-800 dark:text-stone-100">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              How Dewey Tracks Your Daily Pacing
            </span>
            <button
              onClick={() => setShowPacingExplainer(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              Close
            </button>
          </div>
          <p className="mb-2 text-[11px]">
            Dewey dynamically distributes your daily goal ({formatVolume(dailyGoal)}) evenly across your active waking hours (8:00 AM to 10:00 PM).
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-emerald-50/80 dark:bg-[#15271e] border border-emerald-200/50 dark:border-[#223d2f]">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Ahead or On Track</span>
              <span>Intake matches or exceeds the hourly expectation. Dewey celebrates with bouncy smiles and sparkles!</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50/80 dark:bg-[#251e13] border border-amber-200/50 dark:border-[#3d2e1c]">
              <span className="font-bold text-amber-800 dark:text-amber-300 block">Falling Behind</span>
              <span>When intake lags behind by 12% or more, Dewey gets gently concerned to remind you before dehydration sets in.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Pure 2D SVG Animated Character (Dewey the Water Buddy)
// -----------------------------------------------------------------------------
interface DeweySvgProps {
  mood: BuddyMood;
  isPoked: boolean;
  clickCount: number;
}

const DeweySvg: React.FC<DeweySvgProps> = ({ mood, isPoked }) => {
  // SVG Eye Blink State (periodic natural blinking)
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Random blink every 3 to 6 seconds
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3500 + Math.random() * 2500);

    return () => clearInterval(interval);
  }, []);

  // Palette definitions based on hydration state
  const colors = useMemo(() => {
    switch (mood) {
      case 'completed':
        return {
          gradTop: '#38bdf8',
          gradMid: '#0284c7',
          gradBottom: '#0369a1',
          highlight: '#e0f2fe',
          innerGlow: '#67e8f9',
          blush: '#f43f5e',
        };
      case 'ahead':
        return {
          gradTop: '#38bdf8',
          gradMid: '#0ea5e9',
          gradBottom: '#0284c7',
          highlight: '#f0f9ff',
          innerGlow: '#7dd3fc',
          blush: '#f472b6',
        };
      case 'on_track':
        return {
          gradTop: '#38bdf8',
          gradMid: '#0284c7',
          gradBottom: '#075985',
          highlight: '#f0f9ff',
          innerGlow: '#38bdf8',
          blush: '#fb7185',
        };
      case 'behind':
        return {
          gradTop: '#60a5fa',
          gradMid: '#3b82f6',
          gradBottom: '#1d4ed8',
          highlight: '#e0f2fe',
          innerGlow: '#93c5fd',
          blush: '#fca5a5',
        };
      case 'critical_behind':
        // Paler, drier, desaturated look
        return {
          gradTop: '#93c5fd',
          gradMid: '#60a5fa',
          gradBottom: '#3b82f6',
          highlight: '#ffffff',
          innerGlow: '#bfdbfe',
          blush: '#f87171',
        };
      case 'morning_start':
        return {
          gradTop: '#7dd3fc',
          gradMid: '#38bdf8',
          gradBottom: '#0284c7',
          highlight: '#fef08a',
          innerGlow: '#fde047',
          blush: '#fca5a5',
        };
    }
  }, [mood]);

  return (
    <svg
      width="100"
      height="105"
      viewBox="0 0 100 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300"
      style={{
        transform: isPoked
          ? 'scale(1.18, 0.85) translateY(4px)'
          : 'scale(1, 1)',
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12))',
      }}
    >
      <defs>
        {/* Main Body Gradient */}
        <linearGradient id="deweyBodyGrad" x1="50" y1="12" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.gradTop} />
          <stop offset="55%" stopColor={colors.gradMid} />
          <stop offset="100%" stopColor={colors.gradBottom} />
        </linearGradient>

        {/* 3D Highlight Gradient */}
        <linearGradient id="deweyShine" x1="30" y1="20" x2="48" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Liquid Wave Base Gradient */}
        <linearGradient id="liquidWaveGrad" x1="50" y1="65" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </linearGradient>

        {/* Sunglasses Tint Gradient */}
        <linearGradient id="glassesGrad" x1="30" y1="45" x2="70" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Ambient Halo for Completed / Ahead */}
      {(mood === 'completed' || mood === 'ahead') && (
        <circle
          cx="50"
          cy="60"
          r="42"
          fill={colors.innerGlow}
          opacity="0.2"
          className="animate-pulse"
        />
      )}

      {/* Main Teardrop / Water Droplet Body */}
      {/* Smooth organic droplet shape with rounded crest and chubby base */}
      <path
        d="M 50 14 
           C 50 14, 82 50, 82 72 
           C 82 89.5, 67.8 98, 50 98 
           C 32.2 98, 18 89.5, 18 72 
           C 18 50, 50 14, 50 14 Z"
        fill="url(#deweyBodyGrad)"
      />

      {/* Internal Liquid Motion Wave */}
      <path
        d="M 20 72 
           Q 35 66, 50 72 
           T 80 72 
           C 80 88, 67 96, 50 96 
           C 33 96, 20 88, 20 72 Z"
        fill="url(#liquidWaveGrad)"
      />

      {/* Curved Glossy Highlight on Top-Left Shoulder */}
      <path
        d="M 47 22 
           C 42 27, 28 45, 27 64 
           C 26 73, 27 78, 28 80
           C 25 76, 24 67, 26 58 
           C 29 44, 41 28, 47 22 Z"
        fill="url(#deweyShine)"
      />

      {/* Secondary micro highlight dot */}
      <ellipse cx="36" cy="36" rx="2.5" ry="4" transform="rotate(-30 36 36)" fill="#ffffff" opacity="0.75" />

      {/* Cheeks Blush */}
      <circle cx="31" cy="65" r="5" fill={colors.blush} opacity="0.45" />
      <circle cx="69" cy="65" r="5" fill={colors.blush} opacity="0.45" />

      {/* ---------------------------------------------------------------------- */}
      {/* EYES & EXPRESSION VARIATIONS */}
      {/* ---------------------------------------------------------------------- */}

      {/* 1. GOAL COMPLETED (Cool Sunglasses or Star Sparkle Eyes) */}
      {mood === 'completed' && (
        <g id="dewey-completed-face">
          {/* Golden Crown */}
          <path
            d="M 33 18 L 38 7 L 50 14 L 62 7 L 67 18 Z"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="7" r="1.5" fill="#ef4444" />
          <circle cx="50" cy="14" r="1.5" fill="#3b82f6" />
          <circle cx="62" cy="7" r="1.5" fill="#ef4444" />

          {/* Trendy Sunglasses */}
          <g>
            {/* Bridge */}
            <path d="M 45 52 L 55 52" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left Glass */}
            <rect x="26" y="47" width="20" height="13" rx="4" fill="url(#glassesGrad)" stroke="#0284c7" strokeWidth="1" />
            <path d="M 28 49 L 36 49" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
            {/* Right Glass */}
            <rect x="54" y="47" width="20" height="13" rx="4" fill="url(#glassesGrad)" stroke="#0284c7" strokeWidth="1" />
            <path d="M 56 49 L 64 49" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
          </g>

          {/* Big Victorious Smile */}
          <path
            d="M 40 68 Q 50 78, 60 68"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#f43f5e"
          />
        </g>
      )}

      {/* 2. AHEAD OF PACE (Happy Arched Sparkle Eyes & Open Grin) */}
      {mood === 'ahead' && (
        <g id="dewey-ahead-face">
          {/* Little Floating Star Accents */}
          <path d="M 72 26 L 74 30 L 78 32 L 74 34 L 72 38 L 70 34 L 66 32 L 70 30 Z" fill="#fde047" opacity="0.9" />

          {/* Happy Arched Eyes (^_^) */}
          {isBlinking ? (
            <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
              <line x1="32" y1="53" x2="44" y2="53" />
              <line x1="56" y1="53" x2="68" y2="53" />
            </g>
          ) : (
            <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 32 54 Q 38 46, 44 54" />
              <path d="M 56 54 Q 62 46, 68 54" />
            </g>
          )}

          {/* Open Joyful Grin with Tongue */}
          <path
            d="M 41 63 C 41 63, 44 75, 50 75 C 56 75, 59 63, 59 63 Z"
            fill="#0f172a"
          />
          {/* Tongue */}
          <path
            d="M 45 71 C 47 74, 53 74, 55 71 C 53 69, 47 69, 45 71 Z"
            fill="#f472b6"
          />
        </g>
      )}

      {/* 3. ON TRACK (Large Anime Eyes with Blinking & Gentle Smile) */}
      {mood === 'on_track' && (
        <g id="dewey-on-track-face">
          {/* Anime Eyes */}
          {isBlinking ? (
            <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
              <line x1="33" y1="53" x2="43" y2="53" />
              <line x1="57" y1="53" x2="67" y2="53" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <ellipse cx="38" cy="52" rx="5" ry="6.5" fill="#0f172a" />
              <circle cx="36.5" cy="49.5" r="2.2" fill="#ffffff" />
              <circle cx="40" cy="54" r="1.1" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="62" cy="52" rx="5" ry="6.5" fill="#0f172a" />
              <circle cx="60.5" cy="49.5" r="2.2" fill="#ffffff" />
              <circle cx="64" cy="54" r="1.1" fill="#ffffff" />
            </g>
          )}

          {/* Gentle Sweet Smile */}
          <path
            d="M 43 64 Q 50 70, 57 64"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* 4. FALLING BEHIND (Worried Brows, Sweat Droplet & Hesitant Mouth) */}
      {mood === 'behind' && (
        <g id="dewey-behind-face">
          {/* Sweat drop on brow */}
          <path
            d="M 70 38 C 70 38, 74 44, 74 46 C 74 48, 72.2 49.5, 70 49.5 C 67.8 49.5, 66 48, 66 46 C 66 44, 70 38, 70 38 Z"
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth="0.8"
          />

          {/* Tilted Concerned Brows */}
          <path d="M 32 44 L 43 47" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M 68 44 L 57 47" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

          {/* Slightly wide worried eyes */}
          {isBlinking ? (
            <g stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round">
              <line x1="33" y1="53" x2="43" y2="53" />
              <line x1="57" y1="53" x2="67" y2="53" />
            </g>
          ) : (
            <g>
              <ellipse cx="38" cy="53" rx="4.5" ry="5.5" fill="#0f172a" />
              <circle cx="36" cy="51" r="1.8" fill="#ffffff" />

              <ellipse cx="62" cy="53" rx="4.5" ry="5.5" fill="#0f172a" />
              <circle cx="60" cy="51" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Wavy cute concerned mouth */}
          <path
            d="M 43 66 Q 47 64, 50 67 Q 53 70, 57 66"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* 5. SEVERELY BEHIND / PARCHED (Droopy Puppy Eyes & Teary Drop) */}
      {mood === 'critical_behind' && (
        <g id="dewey-critical-face">
          {/* Tilted Sad Brows */}
          <path d="M 33 43 L 42 46" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 67 43 L 58 46" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />

          {/* Big Teary Eyes (🥺) */}
          <g>
            {/* Left Eye with big tear shine */}
            <circle cx="38" cy="54" r="6" fill="#0f172a" />
            <circle cx="36" cy="51.5" r="2.8" fill="#ffffff" />
            <circle cx="40" cy="56" r="1.4" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="62" cy="54" r="6" fill="#0f172a" />
            <circle cx="60" cy="51.5" r="2.8" fill="#ffffff" />
            <circle cx="64" cy="56" r="1.4" fill="#ffffff" />
          </g>

          {/* Tear droplet falling from eye */}
          <path
            d="M 32 60 C 32 60, 30 65, 30 67 C 30 69, 31.5 70, 33 70 C 34.5 70, 36 69, 36 67 C 36 65, 32 60, 32 60 Z"
            fill="#60a5fa"
            stroke="#1d4ed8"
            strokeWidth="0.8"
          />

          {/* Quivering sad mouth */}
          <path
            d="M 44 68 Q 50 63, 56 68"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* 6. MORNING START (Sleepy Half-lidded Eyes & Yawn) */}
      {mood === 'morning_start' && (
        <g id="dewey-morning-face">
          {/* Floating Zzz */}
          <text x="68" y="32" fontSize="9" fontWeight="bold" fill="#0369a1" opacity="0.8">
            z
          </text>
          <text x="74" y="24" fontSize="11" fontWeight="bold" fill="#0284c7" opacity="0.9">
            Z
          </text>

          {/* Sleepy Half-lids */}
          <g>
            <path d="M 32 52 Q 38 48, 44 52" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="54" r="2.5" fill="#0f172a" />

            <path d="M 56 52 Q 62 48, 68 52" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="62" cy="54" r="2.5" fill="#0f172a" />
          </g>

          {/* Tiny Cute Yawn (O mouth) */}
          <ellipse cx="50" cy="65" rx="3.5" ry="4.5" fill="#0f172a" />
          <ellipse cx="50" cy="66" rx="2" ry="2.5" fill="#f472b6" />
        </g>
      )}
    </svg>
  );
};
