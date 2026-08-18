import { useEffect } from "react";

/**
 * Subtle synthesized UI click for buttons/links.
 * Uses WebAudio (no asset), respects prefers-reduced-motion, unlocks on first gesture.
 */
export default function ClickSound() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    type Ctor = typeof AudioContext;
    const AC: Ctor | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!AC) return;

    let ctx: AudioContext | null = null;

    const blip = (freq: number, gainPeak: number, dur: number) => {
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(gainPeak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    };

    const onPointerDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest(
        "button, a, [role='button'], input[type='submit']",
      );
      if (!el) return;
      if ((el as HTMLButtonElement).disabled) return;
      try {
        if (!ctx) ctx = new AC();
        if (ctx.state === "suspended") void ctx.resume();
        blip(880, 0.05, 0.06);
        blip(1320, 0.02, 0.045);
      } catch {
        /* audio unavailable — stay silent */
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      ctx?.close().catch(() => {});
    };
  }, []);

  return null;
}
