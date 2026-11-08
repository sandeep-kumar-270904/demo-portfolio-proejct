import { Volume2, VolumeX, FastForward, Music } from "lucide-react";

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
  isAudioPlaying = false,
  trackTitle,
  onToggleSound,
  onSkip,
}: IntroControlsProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-[25] p-6 sm:p-10 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {/* Act Counter & Track Metadata */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 items-center gap-2 rounded-full border border-[#C69B45]/20 bg-[#171614]/80 px-3 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E5B747]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2EBDD]">
              ACT 0{currentAct + 1} <span className="text-[#AAA69B]">/ 0{totalActs}</span>
            </span>
          </div>

          {trackTitle && isAudioPlaying && (
            <div className="hidden items-center gap-2 rounded-full border border-[#777C80]/20 bg-[#171614]/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#AAA69B] backdrop-blur-md md:flex">
              <Music size={11} className="text-[#E5B747] animate-pulse" />
              <span className="max-w-[200px] truncate text-[#F2EBDD]">{trackTitle}</span>
            </div>
          )}
        </div>

        {/* Audio Toggle & Skip Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          {onToggleSound && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSound();
              }}
              aria-label={isAudioPlaying ? "Mute audio" : "Play audio with sound"}
              className={`group flex h-8 items-center gap-2 rounded-lg px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur-md transition-all active:scale-95 ${
                isAudioPlaying
                  ? "border border-[#C69B45]/50 bg-[#171614]/80 text-[#E5B747] hover:border-[#E5B747]"
                  : "border border-[#E5B747]/80 bg-[#C69B45]/15 text-[#F2D18A] shadow-[0_0_15px_rgba(229,183,71,0.25)] animate-pulse hover:bg-[#C69B45]/25"
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 size={13} className="text-[#E5B747] animate-pulse" />
                  <span className="hidden sm:inline">SOUND: ON</span>
                  <span className="sm:hidden">ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} className="text-[#E5B747]" />
                  <span className="hidden sm:inline">SOUND: OFF (TAP TO PLAY)</span>
                  <span className="sm:hidden">SOUND: OFF</span>
                </>
              )}
            </button>
          )}

          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSkip();
            }}
            aria-label="Skip introduction"
            className="group flex h-8 items-center gap-2 rounded-lg border border-[#C69B45]/40 bg-[#171614]/90 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2EBDD] backdrop-blur-md transition-all hover:border-[#E5B747] hover:bg-[#C69B45]/15 hover:text-[#E5B747] active:scale-95"
          >
            <span>SKIP</span>
            <span className="hidden text-[9px] text-[#827D74] sm:inline">[ESC]</span>
            <FastForward size={12} className="text-[#C69B45] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
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

        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#827D74]">
          SYSTEM ID: ESK-2026 // INDIA
        </div>
      </div>
    </div>
  );
}
