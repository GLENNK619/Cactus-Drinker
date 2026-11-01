// Zero-dependency synthesized tactile water audio using Web Audio API

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Pre-warm audio on user touch/pointer interaction to prevent initial delay on mobile
  unlock() {
    this.getContext();
  }

  /**
   * Subtle, organic water-dropping sound effect.
   * Multi-layered physical acoustic modeling:
   * 1. Primary droplet upward tension sweep ("bloop")
   * 2. Secondary micro-splash echo (delayed by 30-40ms)
   * 3. Low-frequency tactile water body displacement pop
   * 4. Micro-pitch randomization so consecutive taps sound natural & dynamic
   */
  playWaterDrop(volume = 0.35) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Random organic pitch variation (+/- 6%)
      const pitchVariance = 0.94 + Math.random() * 0.12;

      // Master output gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, now);
      masterGain.connect(ctx.destination);

      // --- LAYER 1: Primary droplet "bloop" ---
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'sine';
      const startFreq1 = 480 * pitchVariance;
      const endFreq1 = 1250 * pitchVariance;

      osc1.frequency.setValueAtTime(startFreq1, now);
      osc1.frequency.exponentialRampToValueAtTime(endFreq1, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.18);

      // --- LAYER 2: Secondary micro-splash droplet (35ms delayed) ---
      const delay2 = 0.035;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      const startFreq2 = 720 * pitchVariance;
      const endFreq2 = 1580 * pitchVariance;

      osc2.frequency.setValueAtTime(startFreq2, now + delay2);
      osc2.frequency.exponentialRampToValueAtTime(endFreq2, now + delay2 + 0.06);

      gain2.gain.setValueAtTime(0.001, now + delay2);
      gain2.gain.linearRampToValueAtTime(0.4, now + delay2 + 0.012);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay2 + 0.14);

      osc2.connect(gain2);
      gain2.connect(masterGain);

      osc2.start(now + delay2);
      osc2.stop(now + delay2 + 0.16);

      // --- LAYER 3: Low-frequency water displacement pop ---
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(140 * pitchVariance, now);
      osc3.frequency.exponentialRampToValueAtTime(60 * pitchVariance, now + 0.05);

      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.linearRampToValueAtTime(0.35, now + 0.008);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc3.connect(gain3);
      gain3.connect(masterGain);

      osc3.start(now);
      osc3.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }

  // Multi-tone celebration arpeggio when goal or cactus unlocks
  playCelebration() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.55);
      });
    } catch (e) {
      console.warn('Celebration audio failed', e);
    }
  }

  // Gentle soft click for buttons
  playSoftClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  // Cute friendly chirp/bubble sound for the Water Buddy mascot
  playBuddyChirp() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Cheerful upward-rising bubble chirp
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  // Soft squeaky wobble sound for poke interaction
  playBuddySqueak() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.04);
      osc.frequency.linearRampToValueAtTime(720, now + 0.09);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEffects();
