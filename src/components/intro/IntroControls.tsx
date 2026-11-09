import { FastForward } from "lucide-react";

interface IntroControlsProps {
  currentAct: number;
  totalActs: number;
  isAudioPlaying?: boolean;
  trackTitle?: string;
  onToggleSound?: () => void;
  onSkip: () => void;
}

export default function IntroControls({
  currentAct,
  totalActs,
  onSkip,
}: IntroControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[25] p-6 sm:p-10 select-none">
      {/* Top Bar - Minimal, distraction-free with only the Skip button */}
      <div className="flex items-center justify-end">
        {/* Skip Button (pointer-events-auto so it receives clicks) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          aria-label="Skip introduction"
          className="group pointer-events-auto flex h-8 items-center gap-2 rounded-lg border border-[#C69B45]/30 bg-[#171614]/80 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#AAA69B] backdrop-blur-md transition-all hover:border-[#E5B747] hover:bg-[#C69B45]/15 hover:text-[#F5F0E6] active:scale-95 cursor-pointer shadow-lg"
        >
          <span>SKIP</span>
          <span className="hidden text-[9px] text-[#827D74] sm:inline">[ESC]</span>
          <FastForward size={12} className="text-[#C69B45] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between sm:bottom-10 sm:left-10 sm:right-10">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalActs }).map((_, idx) => (
            <div
              key={idx}
              className={`h-[2px] transition-all duration-700 ease-out ${
                idx === currentAct
                  ? "w-10 bg-[#E5B747]"
                  : idx < currentAct
                  ? "w-4 bg-[#C69B45]/60"
                  : "w-4 bg-[#777C80]/30"
              }`}
            />
          ))}
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#827D74]/70">
          ESK // THE ART OF ARRIVAL
        </div>
      </div>
    </div>
  );
}
