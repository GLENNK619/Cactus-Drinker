import { useCallback, useRef, useEffect, useState } from 'react';
import { soundEffects } from '../utils/audio';

export interface WaterDropOptions {
  /** Master volume between 0.0 and 1.0 (default: 0.35) */
  volume?: number;
  /** Pitch variation factor (default: +/- 6% organic variance) */
  pitchMultiplier?: number;
  /** Flavor of water droplet sound */
  variant?: 'classic' | 'crisp' | 'deep' | 'ripple';
}

/**
 * Custom React hook that plays a subtle, pleasant water-dropping sound effect
 * whenever triggered (e.g. when the 'Fill Up' button is clicked).
 *
 * Utilizes the Web Audio API with zero external dependencies to deliver
 * instantaneous, satisfying tactile feedback with multi-layered acoustic physics
 * and randomized micro-pitch modulation to keep repetitive taps natural.
 */
export function useWaterDropSound(defaultOptions: WaterDropOptions = {}) {
  const [isAudioSupported, setIsAudioSupported] = useState<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize or retrieve the active AudioContext
  const getAudioContext = useCallback((): AudioContext | null => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        } else {
          setIsAudioSupported(false);
          return null;
        }
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch {
      setIsAudioSupported(false);
      return null;
    }
  }, []);

  // Pre-warm the audio context on user interaction (pointerdown / touchstart)
  const unlockAudio = useCallback(() => {
    soundEffects.unlock();
    getAudioContext();
  }, [getAudioContext]);

  /**
   * Plays a subtle, pleasant water droplet sound effect.
   */
  const playWaterDrop = useCallback(
    (options?: WaterDropOptions) => {
      const merged: WaterDropOptions = {
        volume: 0.32,
        variant: 'classic',
        ...defaultOptions,
        ...options,
      };

      const ctx = getAudioContext();
      if (!ctx) {
        // Fallback to soundEffects singleton if local context fails
        soundEffects.playWaterDrop(merged.volume);
        return;
      }

      try {
        const now = ctx.currentTime;
        // Subtle organic pitch variance (+/- 7%) so consecutive taps feel alive
        const baseVariance = 0.93 + Math.random() * 0.14;
        const pitchVariance = (merged.pitchMultiplier || 1) * baseVariance;
        const volume = Math.max(0, Math.min(1, merged.volume ?? 0.32));

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, now);
        masterGain.connect(ctx.destination);

        // Variant configurations
        let baseFreqStart = 480;
        let baseFreqEnd = 1260;
        let echoFreqStart = 740;
        let echoFreqEnd = 1580;
        let bassFreqStart = 135;

        if (merged.variant === 'crisp') {
          baseFreqStart = 580;
          baseFreqEnd = 1450;
          echoFreqStart = 850;
          echoFreqEnd = 1800;
        } else if (merged.variant === 'deep') {
          baseFreqStart = 380;
          baseFreqEnd = 980;
          echoFreqStart = 600;
          echoFreqEnd = 1200;
          bassFreqStart = 110;
        } else if (merged.variant === 'ripple') {
          baseFreqStart = 520;
          baseFreqEnd = 1320;
          echoFreqStart = 780;
          echoFreqEnd = 1620;
        }

        // --- LAYER 1: Primary droplet upward tension sweep ("bloop") ---
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();

        osc1.type = 'sine';
        const start1 = baseFreqStart * pitchVariance;
        const end1 = baseFreqEnd * pitchVariance;

        osc1.frequency.setValueAtTime(start1, now);
        osc1.frequency.exponentialRampToValueAtTime(end1, now + 0.08);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.68, now + 0.015);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc1.connect(gain1);
        gain1.connect(masterGain);

        osc1.start(now);
        osc1.stop(now + 0.18);

        // --- LAYER 2: Secondary micro-splash echo (32ms offset) ---
        const delay2 = 0.032;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.type = 'sine';
        const start2 = echoFreqStart * pitchVariance;
        const end2 = echoFreqEnd * pitchVariance;

        osc2.frequency.setValueAtTime(start2, now + delay2);
        osc2.frequency.exponentialRampToValueAtTime(end2, now + delay2 + 0.06);

        gain2.gain.setValueAtTime(0.001, now + delay2);
        gain2.gain.linearRampToValueAtTime(0.38, now + delay2 + 0.012);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + delay2 + 0.13);

        osc2.connect(gain2);
        gain2.connect(masterGain);

        osc2.start(now + delay2);
        osc2.stop(now + delay2 + 0.15);

        // --- LAYER 3: Low-frequency water displacement pop ---
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();

        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(bassFreqStart * pitchVariance, now);
        osc3.frequency.exponentialRampToValueAtTime(55 * pitchVariance, now + 0.05);

        gain3.gain.setValueAtTime(0.001, now);
        gain3.gain.linearRampToValueAtTime(0.32, now + 0.008);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc3.connect(gain3);
        gain3.connect(masterGain);

        osc3.start(now);
        osc3.stop(now + 0.08);
      } catch (err) {
        console.warn('Water drop audio playback error:', err);
      }
    },
    [defaultOptions, getAudioContext]
  );

  /**
   * Plays a cascade of 2-3 rapid gentle water droplets
   * (e.g. for larger pour sizes or satisfying celebratory gulps).
   */
  const playWaterCascade = useCallback(
    (count = 3, intervalMs = 70) => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          playWaterDrop({
            volume: 0.28 - i * 0.04,
            pitchMultiplier: 0.95 + i * 0.12,
          });
        }, i * intervalMs);
      }
    },
    [playWaterDrop]
  );

  /**
   * Helper function that wraps any click handler, playing the sound
   * immediately before executing the callback.
   */
  const withWaterDropSound = useCallback(
    <T extends (...args: unknown[]) => unknown>(callback?: T, options?: WaterDropOptions) => {
      return (...args: Parameters<T>): ReturnType<T> | undefined => {
        playWaterDrop(options);
        if (callback) {
          return callback(...args) as ReturnType<T>;
        }
        return undefined;
      };
    },
    [playWaterDrop]
  );

  // Clean up audio context on unmount if needed
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    playWaterDrop,
    playWaterCascade,
    withWaterDropSound,
    unlockAudio,
    isAudioSupported,
  };
}
