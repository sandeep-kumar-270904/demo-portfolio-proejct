/**
 * Web Audio API Sound Synthesizer for Cinematic Industrial Luxury Intro.
 * Generates rich, atmospheric audio impacts, risers, glitches and clicks
 * entirely in-browser with zero external audio assets or latency.
 */

class IntroSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Muted by default per Section 12

  constructor() {
    // Check saved audio preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cinematic-intro-audio-muted");
      this.isMuted = saved === null ? true : saved === "true";
    }
  }

  private initContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    if (typeof window === "undefined") return null;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      return this.ctx;
    } catch {
      return null;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cinematic-intro-audio-muted", String(muted));
      } catch {}
    }
    if (!muted) {
      this.initContext();
      this.playClick();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Deep sub-bass cinematic impact.
   * Sine wave sweeping from 85Hz down to 26Hz with soft saturation.
   */
  public playBassImpact(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(85, t);
      osc.frequency.exponentialRampToValueAtTime(26, t + 1.2);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.42, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.85);
    } catch {}
  }

  /**
   * FM synthesis metallic ping impact for gold/metallic reflections.
   */
  public playMetallicImpact(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // Carrier
      const carrier = ctx.createOscillator();
      const carrierGain = ctx.createGain();
      carrier.type = "triangle";
      carrier.frequency.setValueAtTime(440, t);
      carrier.frequency.exponentialRampToValueAtTime(180, t + 0.9);

      // Modulator
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();
      mod.type = "sine";
      mod.frequency.setValueAtTime(1240, t);
      modGain.gain.setValueAtTime(500, t);
      modGain.gain.exponentialRampToValueAtTime(10, t + 0.6);

      mod.connect(carrier.frequency);
      carrier.connect(carrierGain);
      carrierGain.connect(ctx.destination);

      carrierGain.gain.setValueAtTime(0.001, t);
      carrierGain.gain.linearRampToValueAtTime(0.25, t + 0.02);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      mod.start(t);
      carrier.start(t);
      mod.stop(t + 1.25);
      carrier.stop(t + 1.25);
    } catch {}
  }

  /**
   * Digital glitch noise burst.
   */
  public playGlitch(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2400, t);
      filter.Q.setValueAtTime(4, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(t);
      whiteNoise.stop(t + 0.09);
    } catch {}
  }

  /**
   * Cinematic riser / whoosh for dramatic transitions.
   */
  public playRiser(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, t);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.9);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.exponentialRampToValueAtTime(3200, t + 0.9);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.0);
    } catch {}
  }

  /**
   * Tactile mechanical micro-click.
   */
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.025);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch {}
  }
}

export const introSound = new IntroSoundEngine();
